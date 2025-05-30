import express from "express";
const router = express.Router();
router.get("/", (request, response) => {
    const loggedIn = request.session.passport != null;
    response.render("index", {
        title: "Главная",
        loggedIn: loggedIn,
        user: request.session.passport
    });
});
export default router;
