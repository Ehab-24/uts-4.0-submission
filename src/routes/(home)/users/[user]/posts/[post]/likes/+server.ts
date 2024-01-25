import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const POST: RequestHandler = async ({ params }) => {
    try {
        const updateResult = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(params.post!) }, {
            $push: { likes: params.user }
        })
        return json(updateResult)
    } catch (error) {
        return errorResponse(error)
    }
}

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const updateResult = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(params.post!) }, {
            $pull: { likes: params.user }
        })
        return json(updateResult)
    } catch (error) {
        return errorResponse(error)
    }
}

