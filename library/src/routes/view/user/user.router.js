import express from "express"

const router = express.Router()

const getUserParams = (request) => {

    return {
        "loggedIn": request.session.passport != null,
        "user": request.session.passport
    }

}

router.get("/login", (request, response) => {
    if (request.session.passport) {
        response.redirect("/user/me")

        return
    }

    response.render("user/login", {
        title: "Войти",

        loggedIn: false,
        user: null
    })

})

router.get("/signup", (request, response) => {

    if (request.session.passport) {
        response.redirect("/user/me")

        return
    }

    response.render("user/signup", {
        title: "Регистрация",

        loggedIn: false,
        user: null
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
            loggedIn: true,
            user: request.session.passport
        })

    })

export default router