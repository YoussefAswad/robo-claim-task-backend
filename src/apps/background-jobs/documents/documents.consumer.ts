import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Queues } from 'src/common/constants/queues';
import { DocumentData } from './types/document-data.interface';
import { Inject } from '@nestjs/common';
import { StorageService } from '@codebrew/nestjs-storage';
import { FileRepositoryService } from 'src/database/file-repository/file-repository.service';
// import Tesseract from 'tesseract.js';
import Papa from 'papaparse';

@Processor(Queues.DOCUMENT)
export class DocumentConsumer extends WorkerHost {
  @Inject() private readonly storage: StorageService;
  @Inject() private readonly filesRepository: FileRepositoryService;

  async process(job: Job<DocumentData, any, string>): Promise<any> {
    job.updateProgress({
      progress: 0,
      stage: 'Started processing',
      fileId: job.data.id,
    });
    try {
      console.log('Processing document', job.data);

      const { mimeType } = job.data;

      await this.filesRepository.changeStatus(job.data.id, 'processing');

      // simulate processing time 1 minute
      await new Promise((resolve) => setTimeout(resolve, 60000));

      const fileStream = await this.storage.getDisk().getBuffer(job.data.id);

      switch (mimeType) {
        case 'application/pdf':
          await this.processPdf(job, fileStream.content);
          break;
        case 'application/vnd.ms-excel':
          await this.processExcel(job, fileStream.content);
          break;
        case 'text/csv':
          await this.processCsv(job, fileStream.content);
          break;
        default:
          await this.filesRepository.changeStatus(job.data.id, 'failed');
          throw new Error('Unsupported file type');
      }
      console.log('Finished processing document', job.data);

      return job.data;
    } catch (e) {
      await this.filesRepository.changeStatus(job.data.id, 'failed', e.message);
      throw e;
    }
  }
  private async processCsv(
    job: Job<DocumentData, any, string>,
    fileStream: Buffer,
  ) {
    console.log('Processing CSV');
    const data = Papa.parse(fileStream.toString());
    await this.filesRepository.addData(job.data.id, data);
    await job.updateProgress({
      progress: 100,
      stage: 'Finished processing',
      fileId: job.data.id,
    });
  }

  private async processExcel(
    job: Job<DocumentData, any, string>,
    fileStream: Buffer,
  ) {
    const XLSX = await import('xlsx');
    console.log('Processing Excel');

    const workbook = XLSX.read(fileStream, { type: 'buffer' });

    const data = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      data.push(sheetData);

      const progress =
        ((data.length + 1) / workbook.SheetNames.length) * 100 - 10;
      await job.updateProgress({
        progress,
        stage: `Processing sheet ${sheetName}, remaining ${workbook.SheetNames.length - data.length}`,
        fileId: job.data.id,
      });
    }

    await this.filesRepository.addData(job.data.id, data);
    await job.updateProgress({
      progress: 100,
      stage: 'Finished processing',
      fileId: job.data.id,
    });
  }

  private async processPdf(
    job: Job<DocumentData, any, string>,
    fileStream: Buffer,
  ) {
    const mupdfjs = await import('mupdf/mupdfjs');

    console.log('Processing PDF');
    const document = mupdfjs.PDFDocument.openDocument(
      fileStream,
      'application/pdf',
    );

    const data = [];

    const pageCount = document.countPages();
    for (let i = 0; i < pageCount; i++) {
      const page = new mupdfjs.PDFPage(document, i);
      const text = page.toStructuredText('preserve-whitespace').asJSON();
      const imageStack = page.getImages();
      // console.log('Page', i + 1, {
      //   text,
      //   images: imageStack.length,
      // });

      data.push({ text });

      // for (const { image } of imageStack) {
      //   const pixmap = image.toPixmap();
      //   // const imageText = await Tesseract.recognize(pixmap, 'eng');
      // }
      //
      const progress = ((i + 1) / pageCount) * 100 - 10;
      await job.updateProgress({
        progress,
        stage: `Processing page ${i + 1} of ${pageCount}`,
        fileId: job.data.id,
      });
    }
    await this.filesRepository.addData(job.data.id, data);
    await job.updateProgress({
      progress: 100,
      stage: 'Finished processing',
      fileId: job.data.id,
    });
  }
}
