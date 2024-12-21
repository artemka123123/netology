import express from "express"

const router = express.Router()

router.get("/", (request, response) => {
    response.render("index", {
        title: "Главная"
    })
})

export default router