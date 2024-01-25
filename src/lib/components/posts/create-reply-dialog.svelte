<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Avatar from "$lib/components/ui/avatar";
    import {
        ReplySchema,
        type PopulatedPost,
        type User,
        type Comment,
        type Reply,
    } from "$lib/types";
    import { CircleUserRound } from "lucide-svelte";
    import { Button } from "../ui/button";
    import { handleApiRequestError } from "$lib/api";
    import axios from "axios";
    import { toast } from "svelte-sonner";

    export let post: PopulatedPost;
    export let user: User;
    export let comment: Comment;
    export let onSuccess: (reply: Reply) => void;
    let open = false;
    let loading = false;
    let content: string = "";

    async function createReply() {
        try {
            loading = true;
            const url = `/users/${user._id}/posts/${post._id}/comments/${comment._id}/reply`;
            const reply = ReplySchema.parse({
                content,
                createdBy: user._id,
                likes: [],
                replies: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            await axios.post(url, reply);
            toast.success("Reply posted!");
            loading = false;
            open = false;
            onSuccess(reply);
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }
</script>

<Dialog.Root bind:open onOpenChange={(b) => (open = b)}>
    <Dialog.Trigger>
        <Button
            class="self-start py-1 h-max font-bold"
            size="sm"
            variant="ghost">reply</Button
        >
    </Dialog.Trigger>
    <Dialog.Content class="max-h-[90vh] flex flex-col overflow-y-scroll">
        <Dialog.Header class="flex flex-row gap-4">
            <Avatar.Root class="min-w-6 min-h-6">
                <Avatar.Image
                    src={post.createdBy.avatar}
                    alt={post.createdBy.displayName}
                />
                <Avatar.Fallback>
                    <CircleUserRound />
                </Avatar.Fallback>
            </Avatar.Root>
            <div class="flex w-full flex-col gap-2">
                <Dialog.Title>{post.title}</Dialog.Title>
                <Dialog.Description class="dark:text-slate-200">
                    {comment.content}
                </Dialog.Description>
            </div>
        </Dialog.Header>

        <div class="flex gap-4 pl-5">
            <div class="bg-slate-600 w-[1.5px] h-10 left-[44px] top-14" />
            <div class="w-full text-slate-400 text-sm flex items-center">
                replying to&nbsp;<span class="text-sky-400">
                    {post.createdBy.displayName}
                </span>
            </div>
        </div>

        <div class="flex mt-2 flex-row gap-2">
            <Avatar.Root class="min-w-6 min-h-6">
                <Avatar.Image src={user.avatar} alt={user.displayName} />
                <Avatar.Fallback>
                    <CircleUserRound />
                </Avatar.Fallback>
            </Avatar.Root>
            <textarea
                disabled={loading}
                bind:value={content}
                class="border-none outline-none ring-0 w-full h-32 p-2 bg-transparent"
                placeholder="Write a reply..."
            />
        </div>

        <Button on:click={createReply} class="self-end w-max min-w-24 mt-4"
            >Reply</Button
        >
    </Dialog.Content>
</Dialog.Root>
