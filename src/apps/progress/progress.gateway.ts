import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { FileRepositoryService } from 'src/database/file-repository/file-repository.service';
import { DocumentsProducer } from '../background-jobs/documents/documents.producer';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProgressGateway {
  @WebSocketServer() server: Server;
  @Inject() private readonly fileRepositoryService: FileRepositoryService;
  @Inject() private readonly documentsProducer: DocumentsProducer;

  @SubscribeMessage('progress')
  async getProgress(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    let jobProgress;
    do {
      jobProgress = await this.documentsProducer.getJobsProgress(userId);
      console.log(jobProgress);
      client.emit('progress', jobProgress);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } while (true);
  }
}
