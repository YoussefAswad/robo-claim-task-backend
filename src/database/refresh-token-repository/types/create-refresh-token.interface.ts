export interface CreateRefreshToken {
  userId: number;
  token: string;
  expiresAt: Date;
}
