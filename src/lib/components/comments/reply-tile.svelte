<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar";
    import { CircleUserRound, MoreVertical, ThumbsUp } from "lucide-svelte";
    import { getTimeAgo } from "$lib/utils";
    import { Button } from "$lib/components/ui/button";
    import type { Comment, PopulatedPost, Reply, User } from "$lib/types";
    import TimeAgo from "javascript-time-ago";
    import axios from "axios";
    import { toast } from "svelte-sonner";
    import { handleApiRequestError } from "$lib/api";

    export let comment: Comment;
    export let user: User;
    export let post: PopulatedPost;
    export let reply: Reply;

    const timeAgo = new TimeAgo("en-US");

    let loading = false;
    async function handleLike() {
        loading = true;
        try {
            axios.post(
                `/users/${post.createdBy._id}/posts/${post._id}/comments/${comment._id}/reply/${reply._id}/likes`,
            );
            reply.likes = [...reply.likes, user._id!];
            toast.success("Reply liked!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }

    async function handleUnlike() {
        loading = true;
        try {
            axios.delete(
                `/users/${post.createdBy._id}/posts/${post._id}/comments/${comment._id}/reply/${reply._id}/likes`,
            );
            reply.likes = reply.likes.filter((id) => id !== user._id);
            toast.success("Like removed!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex gap-2 w-full p-4">
    <Avatar.Root class="min-w-6 min-h-6">
        <Avatar.Image
            src={reply.createdBy.avatar}
            alt={reply.createdBy.displayName}
        />
        <Avatar.Fallback>
            <CircleUserRound />
        </Avatar.Fallback>
    </Avatar.Root>

    <div class="flex w-full flex-col">
        <div class="flex w-full justify-between">
            <div class="flex items-center">
                <h4 class="scroll-m-20 font-semibold tracking-tight">Name</h4>
                <div
                    class="min-w-1 min-h-1 mx-2 dark:bg-slate-400 rounded-full"
                ></div>
                <p class="dark:text-slate-400 text-sm tracking-tight">
                    {getTimeAgo(reply.createdAt, timeAgo)}
                </p>
            </div>

            {#if reply.createdBy === user._id}
                <Button variant="ghost" class="p-2 w-max h-max">
                    <MoreVertical class="w-4 h-4" />
                </Button>
            {/if}
        </div>
        <div class="text-sm my-2">
            {reply.content}
        </div>
        {#if reply.likes.includes(user._id || "")}
            <Button
                on:click={handleUnlike}
                variant="ghost"
                class="p-2 w-max h-max flex dark:text-sky-400 items-center"
            >
                <ThumbsUp class="w-4 h-4 mr-2" />
                <p>{reply.likes.length}</p>
            </Button>
        {:else}
            <Button
                on:click={handleLike}
                variant="ghost"
                class="p-2 w-max h-max flex items-center"
            >
                <ThumbsUp class="w-4 h-4 mr-2" />
                <p>{reply.likes.length}</p>
            </Button>
        {/if}
    </div>
</div>
<div class="border-b w-4/5 mb-2 self-center dark:border-slate-800"></div>
