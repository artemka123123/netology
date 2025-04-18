import { ChatModel } from "../database/models/chat.model.js";
import { EventEmitter } from "node:events"

export class ChatModule {

    static chatEmitter = new EventEmitter()

    static async find(users) {

        return await ChatModel.findOne({
            users: users
        })

    }

    static async sendMessages(data) {
        const { author, reciever, text } = data;

        var chat = await this.find([author, reciever])
        const nowDate = new Date(Date.now())

        if (!chat) {

            chat = await ChatModel.insertOne({
                users: [ author, reciever ],
                createdAt: nowDate,
                messages: []
            })

        }

        const newMessage = {
            author: author,
            sentAt: nowDate,
            text: text
        }

        const messages = chat.messages
        messages.push(newMessage)

        this.chatEmitter.emit("message_" + chat._id, { chatId: chat._id, message: newMessage })

        return new Promise(async (resolve, reject) => {

            await ChatModel.updateOne({ users: [ author, reciever ] }, { messages: messages })

            resolve(newMessage)

        })
    }

    static subscribe(func, chatId) {

        this.chatEmitter.addListener("message_" + chatId, func)

    }

}
