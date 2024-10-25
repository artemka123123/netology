const express = require("express")
const { v4: uuid } = require("uuid")

class Book {

    constructor(id, title, description = "", authors = "", favorite = "", fileCover = "", fileName = "") {
        this.id = id

        this.title = title
        this.description = description
        this.authors = authors

        this.favorite = favorite

        this.fileCover = fileCover
        this.fileName = fileName
    }

}

const storage = {
    books: [
        new Book(
            uuid(),

            "Война и мир",
            "",
            "",
            "",
            "",
            ""
        )
    ]
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/api/user/login", (request, response) => {
    
    response.sendStatus(201)
    response.json({
        id: 1, 
        mail: "test@mail.ru"
    })
})

app.get("/api/books", (request, response) => {
    response.json(storage.books)
})

app.get("/api/books/:id", (request, response) => {
    const { id } = request.params
    const book = storage.books.find(b => b.id == id)

    if (!book) {
        response.status(404)
        response.json({
            suceess: false,
            error: "Книга не найдена."
        })

        return
    } 

    response.json({
        sucess: true,
        book: book
    })
})

app.post("/api/books", (request, response) => {
    const { title, description, authors, favorite, fileCover, fileName } = request.body

    if (!title) {
        response.status(400)
    
        response.json({
            success: false,
            error: "У книги должно быть название."
        })

        return
    }

    const newBook = new Book(uuid(), title, description, authors, favorite, fileCover, fileName)
    storage.books.push(newBook)

    response.status(201)
    
    response.json({
        success: true,
        book: newBook
    })
})

app.put("/api/books/:id", (request, response) => {
    const { id } = request.params
    const { title, description, authors, favorite, fileCover, fileName } = request.body

    const index = storage.books.findIndex(b => b.id == id)

    if (index == -1) {
        response.status(404);

        response.json({
            suceess: false,
            error: "Книга не найдена."
        })

        return
    }

    const oldBook = storage.books[index]

    storage.books[index] = new Book(
        oldBook.id,
        title || oldBook.title,
        description || oldBook.description,
        authors || oldBook.authors,
        favorite || oldBook.favorite,
        fileCover || oldBook.fileCover,
        fileName || oldBook.fileName
    )

    response.status(201)

    response.json({
        sucess: true,
        book: storage.books[index]
    })
})

app.delete("/api/books/:id", (request, response) => {
    const { id } = request.params
    const index = storage.books.findIndex(b => b.id = id)

    if (index == -1) {
        response.status(404)

        response.json({
            suceess: false,
            error: "Книга не найдена."
        })

        return
    }

    const removedBook = storage.books.splice(index, 1)[0]

    response.status(201)
    
    response.json({
        success: true,
        book: removedBook
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT)