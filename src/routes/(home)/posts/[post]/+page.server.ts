import { serializePopulatedPosts } from "$lib/api"
import db from "$lib/db"
import { ObjectId } from "mongodb"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
    try {
        const pipeline = [
            { $match: { _id: ObjectId.createFromHexString(params.post!) } },
            {
                $addFields: {
                    createdBy: {
                        $toObjectId: "$createdBy"
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdBy"
                }
            },
        ]
        const postDocs = await db.collection("posts").aggregate(pipeline).toArray()
        if (!postDocs.length) return { status: 404 }
        const post = serializePopulatedPosts(postDocs)[0]
        return {
            post
        }
    }
    catch (error) {
        console.log(error)
        return {}
    }
}
