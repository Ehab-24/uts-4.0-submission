
import { json, type RequestHandler } from "@sveltejs/kit";
import { PostSchema } from "$lib/types"
import db from "$lib/db";
import { errorResponse } from "$lib/api";

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = await request.json();
		payload.createdAt = (new Date()).toString();
		payload.updatedAt = (new Date()).toString();
		const post = PostSchema.parse(payload);
		const createResult = await db.collection("posts").insertOne(post);
		return json(createResult, { status: 201 });
	} catch (error) {
		return errorResponse(error)
	}
}

// export const GET: RequestHandler = async ({ url }) => {
// 	try {
// 		const searchParams = url.searchParams;
// 		const createdBy = searchParams.get("createdBy");
// 		const status = searchParams.get("status");
// 		const tagsString = searchParams.get("tags");
// 		const tags = tagsString ? tagsString.split(",") : [];
// 		const pipeline: any[] = []
//
// 		if (createdBy) pipeline.push({ $match: { createdBy } })
// 		if (status) pipeline.push({ $match: { status } })
// 		if (tags.length) pipeline.push({ $match: { tags: { $in: tags } } })
//
// 		const posts = await db.collection("posts").aggregate(pipeline).toArray()
// 		return json(posts);
// 	} catch (error) {
// 		return errorResponse(error)
// 	}
// }
