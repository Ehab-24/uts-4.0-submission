import type { WithId, Document } from "mongodb";
import { ZodError } from "zod";
import { toast } from "svelte-sonner";
import { AxiosError } from "axios";
import { json } from "@sveltejs/kit";
import type { PopulatedPost } from "./types";

export function serializeDocument<T>(doc: WithId<Document>): T {
    return { ...doc, _id: doc._id.toHexString() } as T;
}
export function serializeDocuments<T>(docs: (Document | WithId<Document>)[]): T[] {
    return docs.map(p => ({ ...p, _id: p._id.toHexString() })) as T[];
}

export function handleApiError(error: any) {
    if (error instanceof ZodError) {
        return error.issues[0].message;
    } else if (error.message) {
        return error.message;
    } else {
        return "Something went wrong";
    }
}

export function serializePopulatedPosts(postDocs: Document[]): PopulatedPost[] {
    const posts = serializeDocuments<PopulatedPost>(postDocs)
    posts.forEach(p => {
        //@ts-ignore
        p.createdBy = p.createdBy[0]
        if (typeof p.createdBy !== 'string') {
            //@ts-ignore
            p.createdBy._id = p.createdBy._id.toString()
        }
        p.comments.forEach(c => {
            // @ts-ignore
            c._id = c._id.toString()
            c.replies.forEach(r => {
                // @ts-ignore
                r._id = r._id.toString()
            })
        })
    })
    return posts
}

export function errorResponse(error: any) {
    console.log(error)
    const message = handleApiError(error);
    const status = error instanceof ZodError ? 400 : 500;
    return json({ message }, { status });
}

export function handleApiRequestError(error: any) {
    if (error instanceof ZodError) {
        toast.error(error.issues[0].message);
    } else if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
    } else {
        toast.error("Something wen wrong")
    }
    console.error(error)
}
