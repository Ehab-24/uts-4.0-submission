import { serializePopulatedPosts } from "$lib/api"
import db from "$lib/db"
import type { Load } from "@sveltejs/kit"
import { ObjectId } from "mongodb"

export const load: Load = async ({ params }) => {
    try {
        const pipeline = [
            {
                $addFields: {
                    createdBy: {
                        $toObjectId: "$createdBy"
                    }
                }
            },
            {
                $match: {
                    createdBy: ObjectId.createFromHexString(params.user!)
                }
            },
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
    }
    catch (error) {
        console.error(error)
        return {
            posts: []
        }
    }
}

