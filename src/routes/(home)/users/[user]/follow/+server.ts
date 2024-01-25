import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { ObjectId } from "mongodb"
import { json, type RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ params, request }) => {
    try {
        const payload = await request.json()
        if (!payload.userId) return errorResponse("Missing userId")
        const requests = [
            db.collection("users").updateOne({ _id: ObjectId.createFromHexString(params.user!) }, {
                $push: { following: payload.userId }
            }),
            db.collection("users").updateOne({ _id: ObjectId.createFromHexString(payload.userId) }, {
                $push: { followers: params.user }
            })
        ]

        const [updateResult] = await Promise.all(requests)
        return json(updateResult)
    } catch (error) {
        return errorResponse(error)
    }
}
