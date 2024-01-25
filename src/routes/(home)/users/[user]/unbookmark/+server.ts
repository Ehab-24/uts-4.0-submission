
import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const payload = await request.json()
        if (!payload.postId) return errorResponse({ message: "missing 'postId' in request body" })
        const requests = [
            db.collection("users").updateOne({ _id: ObjectId.createFromHexString(params.user!) }, {
                $pull: { bookmarkedPosts: payload.postId }
            }),
            db.collection("posts").updateOne({ _id: ObjectId.createFromHexString(payload.postId) }, {
                $inc: { bookmarkCount: -1 }
            })
        ]

        const [updateResult] = await Promise.all(requests)

        return json(updateResult)
    } catch (error) {
        return errorResponse(error)
    }
}

