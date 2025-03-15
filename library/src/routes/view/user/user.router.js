import express from "express"

const router = express.Router()

router.get("/login", (request, response) => {

    response.render("user/login", {
        title: "Войти"
    })

})

router.get("/signup", (request, response) => {

    response.render("user/signup", {
        title: "Регистрация"
    })

})

router.get("/me", (request, response, next) => {    
    if (!request.session.passport)
        return response.redirect("/user/login")

    next()

    },

    (request, response) => {
        
        response.render("user/profile", {
            title: "Профиль",
            user: request.session.passport
        })

    })

export default router