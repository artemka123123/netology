import { Module } from '@nestjs/common';
import { BookComment, BookCommentSchema } from '../schemas/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentsGateway } from './comment.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookComment.name, schema: BookCommentSchema }
    ])
  ],

  controllers: [],
  providers: [CommentService, CommentsGateway],
  exports: []
})
export class CommentsModule {


}
