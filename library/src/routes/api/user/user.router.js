import express from "express"

const router = express.Router()

router.post("/login/", (request, response) => {
    response.sendStatus(201)

    response.json({
        id: 1, 
        mail: "test@mail.ru"
    })
})

export default router