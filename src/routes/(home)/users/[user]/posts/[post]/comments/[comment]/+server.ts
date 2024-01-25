import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const POST: RequestHandler = async ({ params }) => {
    try {
        const updateReult = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(params.post!) }, {
            $pull: { comments: { _id: ObjectId.createFromHexString(params.comment!) } }
        })
        return json(updateReult)
    } catch (error) { return errorResponse(error) }
}
