import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken"
import { redirect, type Cookies } from "@sveltejs/kit";
import { type User } from "$lib/types";
import db from "$lib/db";
import { ObjectId } from "mongodb";
import { serializeDocument } from "$lib/api";

export const load = async ({ cookies }: { cookies: Cookies }) => {
	const token = cookies.get("x-auth-token") || "";
	if (!token) throw redirect(308, "/auth");

	//@ts-ignore
	const decoded: { _id: string, email: string } = jwt.verify(token, JWT_SECRET);
	const userDoc = await db.collection("users").findOne({ _id: ObjectId.createFromHexString(decoded._id) });
	if (!userDoc) throw redirect(308, "/auth")
	const user = serializeDocument<User>(userDoc)
	if (token && jwt.verify(token, JWT_SECRET)) {
		return {
			user
		};
	} else {
		throw redirect(308, "/auth");
	}
}
