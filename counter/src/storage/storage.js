import fs from "node:fs"

const DATA_PATH = "/data/views.dat";

function getDataFile() {
    if (!fs.existsSync(DATA_PATH)) {
        fs.writeFileSync(DATA_PATH, "{\"data\": []}")
    }

    return fs.readFileSync(DATA_PATH)
}

export function getViews(bookID) {
    const data = getDataFile()
    const dataJSON = JSON.parse(data)
    const viewIndex = dataJSON.data.findIndex(v => { return v.id == bookID })

    if (viewIndex == -1) {
        return {"views": 0};
    }

    return dataJSON.data[viewIndex]
}

export function addView(bookID) {
    const data = getDataFile()
    const dataJSON = JSON.parse(data)

    var viewIndex = dataJSON.data.findIndex(v => { return v.id == bookID })

    if (viewIndex == -1) {
        const obj = {"views": 0, "id": bookID}

        console.log(obj)

        viewIndex = dataJSON.data.push(obj) - 1
    }

    dataJSON.data[viewIndex].views += 1

    fs.writeFileSync(DATA_PATH, JSON.stringify(dataJSON))
}