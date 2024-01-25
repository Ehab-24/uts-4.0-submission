import { errorResponse } from "$lib/api"
import db from "$lib/db"
import { UserSchema } from "$lib/types"
import { json, type RequestHandler } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const payload = await request.json()
        const userData = UserSchema.parse(payload)
        delete userData._id
        const updateResult = await db.collection("users").updateOne({ _id: ObjectId.createFromHexString(params.user || "") }, { $set: userData })
        return json(updateResult)
    }
    catch (error) {
        return errorResponse(error)
    }
}

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const deleteResult = await db.collection("users").deleteOne({ _id: ObjectId.createFromHexString(params.user || "") })
        return json(deleteResult)
    }
    catch (error) {
        return errorResponse(error)
    }
}
