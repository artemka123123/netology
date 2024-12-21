export default (request, response) => {
    response.sendStatus(404)

    response.json({
        success: false,
        error: 404
    })
}