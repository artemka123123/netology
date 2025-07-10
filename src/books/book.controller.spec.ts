import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';

describe('AppController', () => {

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      imports: []
    }).compile();
  });
});
