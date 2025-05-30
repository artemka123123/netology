export default (request, response) => {
    response.render("errors/404", {
        title: "Страница не найдена"
    })
}