import db, { getPopulatedPosts } from "$lib/db";
import { type Load } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export const load: Load = async ({ params }) => {
    try {

        const userDoc = await db.collection("users").findOne({ _id: ObjectId.createFromHexString(params.user!) })
        if (!userDoc) return { posts: [] }

        const pipeline: any[] = [
            { $match: { tags: { $in: userDoc.interests } } },
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

        return {
            posts: await getPopulatedPosts(pipeline)
        };

    } catch (error) {
        console.error(error)
        return { posts: [] }
    }
}
