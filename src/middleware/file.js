import multer from "multer"

const storage = multer.diskStorage({
    destination(request, file, callback) {

        callback(null, 'public/')

    },

    filename(request, file, callback) {
        callback(null, file.fieldname)
    },
    
})

export default multer({storage})