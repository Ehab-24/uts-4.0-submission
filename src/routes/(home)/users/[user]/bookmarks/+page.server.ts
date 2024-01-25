import { errorResponse, serializePopulatedPosts } from "$lib/api"
import { ObjectId } from "mongodb"
import type { PageServerLoad } from "../$types"
import db from "$lib/db"
import type { User } from "$lib/types"

export const load: PageServerLoad = async ({ params }) => {
    try {
        // @ts-ignore
        const user = await db.collection("users").findOne({ _id: ObjectId.createFromHexString(params.user!) }) as User
        const bookmarks = user.bookmarkedPosts.map(id => ObjectId.createFromHexString(id))

        const pipeline = [
            { $match: { _id: { $in: bookmarks } } },
            { $addFields: { createdBy: { $toObjectId: "$createdBy" } } },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            }
        ]

        const postDocs = await db.collection("posts").aggregate(pipeline).toArray()
        const posts = serializePopulatedPosts(postDocs)
        return {
            posts
        }
    } catch (error) {
        return errorResponse(error)
    }
}
