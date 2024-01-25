
import z from "zod"

const UserSchema = z.object({
    _id: z.string().optional(),
    email: z.string().email(),
    password: z.string(),
    displayName: z.string(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    profilePicture: z.string().optional(),
    blockedUsers: z.array(z.string()),
    following: z.array(z.string()),
    followers: z.array(z.string()),
    bookmarkedPosts: z.array(z.string()),
    interests: z.array(z.string()),
    createdAt: z.string().optional(),
    lastLogin: z.string().optional(),
});

type User = z.infer<typeof UserSchema>;

const LoginArgs = z.object({
    email: z.string().email(),
    password: z.string(),
});


export {
    type User,
    UserSchema,
    LoginArgs
}
