import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("x-auth-token");
    if (!token) return {};
    if (token && jwt.verify(token, JWT_SECRET)) {
        throw redirect(308, "/");
    }
}

export const actions: Actions = {
    logout: async ({ cookies }) => {
        cookies.set("x-auth-token", "", { path: "/", expires: new Date() });
        throw redirect(302, "/auth");
    },
};
