import express from "express"
import fs from "node:fs"
import { getViews, addView } from "../storage/storage.js"

const router = express.Router()

router.get("/:id", (request, response) => {
    const { id } = request.params
    const views = getViews(id)

    response.json({
        "success": true,
        "views": views.views
    })
})

router.post("/:id/increment", (request, response) => {
    const { id } = request.params

    addView(id)

    response.json({
        "success": true,
        "views": getViews(id).views
    })
})

export default router;