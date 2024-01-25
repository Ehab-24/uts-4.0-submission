import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const updateResult = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(params.post!), "comments._id": ObjectId.createFromHexString(params.comment!) }, {
            $pull: { "comments.$.replies": { _id: ObjectId.createFromHexString(params.reply!) } }
        })

        return json(updateResult)

    } catch (error) { return errorResponse(error) }
}
