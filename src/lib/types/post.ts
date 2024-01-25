import z from "zod"
import { type User } from "."


const ReplySchema = z.object({
    _id: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    content: z.string().min(1, "Reply can not be empty."),
    likes: z.array(z.string()),
})

const CommentSchema = z.object({
    _id: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    content: z.string().min(1, "Comment can not be empty."),
    createdBy: z.string(),
    likes: z.array(z.string()),
    replies: z.array(ReplySchema)
})

type Comment = z.infer<typeof CommentSchema>
type Reply = z.infer<typeof ReplySchema>

type PopulatedComment = Omit<Comment, "createdBy"> & {
    createdBy: User
}

const PostSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    content: z.string().min(1, "Content is required").max(4096, "Content is too long"),
    media: z.array(z.string()),
    allowComments: z.boolean(),
    type: z.enum(["text", "media", "article", "poll"]),
    tags: z.array(z.string()).min(1, "At least one tag is required").max(5, "Too many tags (max 5)"),
    createdBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: z.enum(["draft", "published", "deleted"]),
    bookmarkCount: z.number().default(0),
    likes: z.array(z.string()),
    views: z.number().default(0),
    comments: z.array(CommentSchema)
})

type Post = z.infer<typeof PostSchema>

type PopulatedPost = Omit<Post, "createdBy"> & {
    createdBy: User
}

export {
    type Post, PostSchema, type PopulatedPost, CommentSchema, ReplySchema, type Comment, type Reply, type PopulatedComment
}
