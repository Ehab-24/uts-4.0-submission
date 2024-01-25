import db from "$lib/db";
import { JWT_SECRET } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";
import { ZodError } from "zod";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserSchema } from "$lib/types/auth";
import { ObjectId } from "mongodb";

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {

		const payload = await request.json();

		payload.createdAt = (new Date()).toString();
		payload.lastLogin = (new Date()).toString();
		const userData = UserSchema.parse(payload);

		const duplicate = await db.collection("users").findOne({ email: userData.email })
		if (duplicate) {
			return json({
				message: "Email is already registered",
			}, { status: 400 });
		}

		const hashedPass = bcrypt.hashSync(userData.password, 10);

		// @ts-ignore
		userData._id = new ObjectId();
		// @ts-ignore
		const user = await db.collection("users").insertOne({ ...userData, password: hashedPass });
		const hash = jwt.sign({ _id: user.insertedId, email: userData.email }, JWT_SECRET, { expiresIn: "14d" });

		cookies.set("x-auth-token", hash, { path: "/", secure: true, sameSite: "strict" });

		return json({ message: "success", userId: user.insertedId }, { status: 201 });
	} catch (error) {
		console.error(error)
		if (error instanceof ZodError) {
			return json({
				message: error.errors[0].message,
			}, { status: 400 });
		}
		return json({
			message: "something went wrong",
		}, { status: 500 });
	}
}
