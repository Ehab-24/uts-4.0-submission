import db from "$lib/db";
import { LoginArgs } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "$env/static/private";

export const POST: RequestHandler = async ({ request, cookies }) => {
	const payload = await request.json();
	const args = LoginArgs.parse(payload);


	const user = await db.collection("users").findOne({ email: args.email })
	if (!user) {
		return json({
			message: "Email does not exist",
		}, { status: 400 })
	}
	if (!bcrypt.compareSync(args.password || "", user.password)) {
		return json({
			message: "Invalid password",
		}, { status: 401 });
	}
	console.log(args)

	const hash = jwt.sign({ _id: user._id, email: args.email }, JWT_SECRET, { expiresIn: "14d" });
	const lastLogin = new Date()
	await db.collection("users").updateOne({ _id: user._id }, { $set: { lastLogin } })

	cookies.set("x-auth-token", hash, { path: "/", secure: true, sameSite: "strict" });

	return json({
		userId: user._id,
		message: "Logged in successfully",
	})
}

