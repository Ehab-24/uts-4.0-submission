import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const payload = await request.json()
        if (!payload.userId) return errorResponse({ message: "missing required field `userId'" })
        const updatedResult = await db.collection("users").updateOne({ _id: ObjectId.createFromHexString(params.user!) }, {
            $push: { blockedUsers: payload.userId }
        })
        return json(updatedResult)
    }
    catch (error) {
        return errorResponse(error)
    }
}

