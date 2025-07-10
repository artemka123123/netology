import { Injectable } from "@nestjs/common";

import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { BookComment, BookCommentDocument } from '../schemas/comment.schema';
import { Connection, Model } from 'mongoose';
import { CreateBookComment } from '../types/comments';


@Injectable()
export class CommentService {
    constructor(
        @InjectModel(BookComment.name) private commentModel: Model<BookCommentDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    createComment(data: CreateBookComment) {
        const newComment = this.commentModel.insertOne(data)

        return newComment;
    }

    findComments(id: string) {
        return this.commentModel.find({bookId: id})
    }

    findComment(id: string) {
        return this.commentModel.findById(id)
    }

    updateComment(id: string, data: string) {
        return this.commentModel.updateOne({id: id}, {comment: data})
    }

    deleteComment(id: string) {
        return this.commentModel.deleteOne({id: id})
    }
}