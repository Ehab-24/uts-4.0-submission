<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar";
    import {
        CircleUserRound,
        MoreVertical,
        ThumbsUp,
        Trash2,
    } from "lucide-svelte";
    import { getTimeAgo } from "$lib/utils";
    import { Button } from "$lib/components/ui/button";
    import CreateReplyDialog from "$lib/components/posts/create-reply-dialog.svelte";
    import type { Comment, PopulatedPost, User } from "$lib/types";
    import TimeAgo from "javascript-time-ago";
    import axios from "axios";
    import { toast } from "svelte-sonner";
    import { handleApiRequestError } from "$lib/api";
    import ReplyTile from "./reply-tile.svelte";
    import * as Popover from "$lib/components/ui/popover";
    import EditCommentDialog from "../posts/edit-comment-dialog.svelte";

    export let comment: Comment;
    export let user: User;
    export let post: PopulatedPost;
    export let onDelete: () => void;

    const timeAgo = new TimeAgo("en-US");

    let showReplies = false;

    let loading = false;
    async function handleLike() {
        loading = true;
        try {
            axios.post(
                `/users/${post.createdBy._id}/posts/${post._id}/comments/${comment._id}/likes`,
            );
            comment.likes = [...comment.likes, user._id!];
            toast.success("Comment liked!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }

    async function handleDelete() {
        loading = true;
        try {
            await axios.delete(
                `/users/${post.createdBy._id}/posts/${post._id}/comments/${comment._id}`,
            );
            onDelete();
            toast.success("Comment deleted!");
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
                `/users/${post.createdBy._id}/posts/${post._id}/comments/${comment._id}/likes`,
            );
            comment.likes = comment.likes.filter((id) => id !== user._id);
            toast.success("Like removed!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex gap-2 w-full border-b dark:border-slate-600 p-4">
    <Avatar.Root class="min-w-6 min-h-6">
        <Avatar.Image
            src={comment.createdBy.avatar}
            alt={comment.createdBy.displayName}
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
                    {getTimeAgo(comment.createdAt, timeAgo)}
                </p>
            </div>

            {#if comment.createdBy === user._id}
                {#if user._id === comment.createdBy}
                    <Popover.Root>
                        <Popover.Trigger>
                            <Button variant="ghost" class="p-2 w-max h-max">
                                <MoreVertical class="w-4 h-4" />
                            </Button>
                        </Popover.Trigger>
                        <Popover.Content class="w-min p-1">
                            {#if onDelete !== undefined}
                                <Button
                                    on:click={handleDelete}
                                    size="sm"
                                    class="rounded-sm"
                                    variant="ghost"
                                >
                                    <Trash2 class="w-4 h-4 mr-2" />
                                    <span>Delete</span>
                                </Button>
                            {/if}
                            <EditCommentDialog
                                onSuccess={(content) =>
                                    (comment.content = content)}
                                {post}
                                {user}
                                {comment}
                            />
                        </Popover.Content>
                    </Popover.Root>
                {/if}
            {/if}
        </div>
        <div class="text-sm mt-2">
            {comment.content}
        </div>

        <div class="flex gap-1 my-4 items-center">
            {#if comment.likes.includes(user._id || "")}
                <Button
                    on:click={handleUnlike}
                    variant="ghost"
                    class="p-2 w-max h-max flex dark:text-sky-400 items-center"
                >
                    <ThumbsUp class="w-4 h-4 mr-2" />
                    <p>{comment.likes.length}</p>
                </Button>
            {:else}
                <Button
                    on:click={handleLike}
                    variant="ghost"
                    class="p-2 w-max h-max flex items-center"
                >
                    <ThumbsUp class="w-4 h-4 mr-2" />
                    <p>{comment.likes.length}</p>
                </Button>
            {/if}
            <div class="h-4 border-r-[1.5px] dark:border-slate-600" />
            <CreateReplyDialog
                onSuccess={(reply) =>
                    (comment.replies = [...comment.replies, reply])}
                {post}
                {user}
                {comment}
            />
        </div>
        {#if comment.replies.length > 0}
            {#if showReplies}
                {#each comment.replies as reply (reply._id)}
                    <ReplyTile {post} {user} {comment} {reply} />
                {/each}
            {:else}
                <Button
                    on:click={() => (showReplies = true)}
                    class="mt-2 w-min dark:text-sky-400 dark:hover:text-sky-500 self-center"
                    size="sm"
                    variant="outline">View replies</Button
                >
            {/if}
        {/if}
    </div>
</div>
