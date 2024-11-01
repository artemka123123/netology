import { v4 as uuid } from "uuid"

export class Book {

    constructor(id, title, description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "") {
        this.id = id

        this.title = title
        this.description = description
        this.authors = authors

        this.favorite = favorite

        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const storage = {
    books: [
        new Book(
            uuid(),

            "Война и мир",
            "Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона в 1805—1812 годах. Эпилог романа доводит повествование до 1820 года.",
            
            "Лев Толстой",
            "",
            
            "https://cdn.culture.ru/c/365442.jpg",
            "",
            "Война и мир.book"
        ),

        new Book(
            uuid(),

            "Мёртвые души",
            "Произведение Николая Васильевича Гоголя, жанр которого сам автор обозначил как поэма. Писать книгу Гоголь начал в 1835 году как трёхтомник. Первый том был издан в 1842 году. Практически готовый второй том был утерян, но сохранилось несколько глав в черновиках.",

            "Николай Гоголь",
            "",

            "https://cdn.eksmo.ru/v2/430000000000006099/COVER/cover1__w600.jpg",
            "",
            "Мёртвые души.book"
        )
    ]
}

export default storage