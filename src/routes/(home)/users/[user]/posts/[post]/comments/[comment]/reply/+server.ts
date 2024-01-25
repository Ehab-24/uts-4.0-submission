
import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { ReplySchema } from "$lib/types"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const payload = await request.json()
        payload.createdAt = (new Date()).toString()
        payload.updatedAt = (new Date()).toString()
        const reply = ReplySchema.parse(payload)
        // @ts-ignore
        reply._id = new ObjectId()

        console.log(reply)

        const updateResult = await db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(params.post!), "comments._id": ObjectId.createFromHexString(params.comment!) }, {
            $push: { "comments.$.replies": reply }
        })

        return json(updateResult)

    } catch (error) { return errorResponse(error) }
}
