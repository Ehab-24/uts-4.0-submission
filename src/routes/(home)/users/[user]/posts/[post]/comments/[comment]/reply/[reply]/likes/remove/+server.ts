
import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const POST: RequestHandler = async ({ params }) => {
    try {
        const updateResult = await db.collection("posts").updateOne({
            _id: ObjectId.createFromHexString(params.post!), "comments._id": ObjectId.createFromHexString(params.comment!), "comments.replies._id": ObjectId.createFromHexString(params.reply!)
        }, {
            $pull: { "comments.$.replies.$.likes": params.user }
        })
        return json(updateResult)
    } catch (error) {
        return errorResponse(error)
    }
}

