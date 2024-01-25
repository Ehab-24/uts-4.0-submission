import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";
import type { PopulatedPost } from "./types";
import { serializePopulatedPosts } from "./api";

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db("uts");

export async function getPopulatedPosts(pipeline: any[]): Promise<PopulatedPost[]> {

    pipeline.push({
        $set: { views: { $add: ["$views", 1] } }
    })

    const postDocs = await db.collection("posts").aggregate(pipeline).toArray()
    const posts = serializePopulatedPosts(postDocs)

    return posts
}

export default db


