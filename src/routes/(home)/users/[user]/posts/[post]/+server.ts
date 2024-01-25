import { errorResponse } from "$lib/api";
import db from "$lib/db";
import { json, type RequestHandler } from "@sveltejs/kit";
import { ObjectId } from "mongodb";

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const deleteResult = await db.collection("posts").deleteOne({ _id: new ObjectId(params.post) });
		return json(deleteResult);
	} catch (error) {
		return errorResponse(error);
	}
}

export const GET: RequestHandler = async ({ params }) => {
	try {
		const post = await db.collection("posts").findOne({ _id: new ObjectId(params.post) });
		return json(post);
	} catch (error) {
		return errorResponse(error);
	}
}

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const payload = await request.json();
		payload.updatedAt = (new Date()).toString();
		delete payload._id;
		const post = await db.collection("posts").findOneAndUpdate({ _id: new ObjectId(params.post) }, { $set: payload });
		return json(post);
	} catch (error) {
		return errorResponse(error);
	}
}
