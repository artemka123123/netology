import multer from "multer"

const storage = multer.diskStorage({
    destination(request, file, callback) {

        callback(null, '/data/books')

    },

    filename(request, file, callback) {
        const { title } = request.body

        callback(null, `${title}.book`)
    },
    
})

export default multer({storage})