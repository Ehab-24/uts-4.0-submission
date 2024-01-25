import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { CommentSchema } from "$lib/types"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const payload = await request.json()
        payload.createdAt = (new Date()).toString()
        payload.updatedAt = (new Date()).toString()
        const comment = CommentSchema.parse(payload)
        // @ts-ignore
        comment._id = new ObjectId()

        const updateReult = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(params.post!) }, {
            $push: { comments: comment }
        })
        return json(updateReult)
    } catch (error) { return errorResponse(error) }
}
