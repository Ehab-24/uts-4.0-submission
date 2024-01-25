<script lang="ts">
    import type { PopulatedPost, User } from "$lib/types";
    import * as Avatar from "$lib/components/ui/avatar";
    import Fullscreen from "svelte-fullscreen";
    import {
        CircleUserRound,
        MoreVertical,
        ThumbsUp,
        Bookmark,
        Eye,
        Share2,
        Trash2,
    } from "lucide-svelte";
    import TimeAgo from "javascript-time-ago";
    import { Button } from "../ui/button";
    import { handleApiRequestError } from "$lib/api";
    import axios from "axios";
    import { toast } from "svelte-sonner";
    import CreateCommentDialog from "./create-comment-dialog.svelte";
    import { getTimeAgo } from "$lib/utils";
    import * as Popover from "$lib/components/ui/popover";

    const timeAgo = new TimeAgo("en-US");

    export let onDelete: (() => void) | undefined;
    export let post: PopulatedPost;
    export let user: User;

    let loading = false;
    async function handleLike() {
        loading = true;
        try {
            axios.post(`/users/${post.createdBy._id}/posts/${post._id}/likes`);
            post.likes = [...post.likes, user._id!];
            toast.success("Post liked!");
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
                `/users/${post.createdBy._id}/posts/${post._id}/likes`,
            );
            post.likes = post.likes.filter((id) => id !== user._id);
            toast.success("Like removed!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }

    async function handleBookmark() {
        loading = true;
        try {
            axios.post(`/users/${post.createdBy._id}/bookmarks`, {
                postId: post._id,
            });
            user.bookmarkedPosts = [...user.bookmarkedPosts, post._id!];
            post.bookmarkCount++;
            toast.success("Bookmark saved!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }

    async function handleUnbookmark() {
        loading = true;
        try {
            axios.post(`/users/${post.createdBy._id}/unbookmark`, {
                postId: post._id,
            });
            user.bookmarkedPosts = user.bookmarkedPosts.filter(
                (id) => id !== post._id,
            );
            post.bookmarkCount--;
            toast.success("Bookmark removed!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }

    async function handleDelete() {
        loading = true;
        try {
            axios.delete(`/users/${post.createdBy._id}/posts/${post._id}`);
            if (onDelete) onDelete();
            toast.success("Post deleted!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }

    async function handleShare() {
        loading = true;
        try {
            // TODO:
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }
</script>

<div
    class="flex border-b border-t dark:border-slate-600 cursor-default hover:bg-slate-900 transition-all gap-2 w-full px-4 py-8"
>
    <div class="h-full">
        <Avatar.Root class="min-w-6 min-h-6">
            <Avatar.Image
                src={post.createdBy.avatar}
                alt={post.createdBy.displayName}
            />
            <Avatar.Fallback>
                <CircleUserRound />
            </Avatar.Fallback>
        </Avatar.Root>
    </div>
    <div class="flex w-full flex-col">
        <div class="flex w-full justify-between">
            <a
                href={`/users/${post.createdBy._id}`}
                class="flex hover:underline items-center"
            >
                <h4 class="scroll-m-20 font-semibold tracking-tight">
                    {post.createdBy.displayName}
                </h4>
                <div
                    class="min-w-1 min-h-1 mx-2 dark:bg-slate-400 rounded-full"
                ></div>
                <p class="dark:text-slate-400 text-sm tracking-tight">
                    {getTimeAgo(post.createdAt, timeAgo)}
                </p>
            </a>
            {#if onDelete !== undefined}
                <Popover.Root>
                    <Popover.Trigger>
                        <Button variant="ghost" class="p-2 w-max h-max">
                            <MoreVertical class="w-4 h-4" />
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content class="w-min p-1">
                        <Button
                            on:click={handleDelete}
                            size="sm"
                            class="rounded-sm"
                            variant="ghost"
                        >
                            <Trash2 class="w-4 h-4 mr-2" />
                            <span>Delete</span>
                        </Button>
                    </Popover.Content>
                </Popover.Root>
            {/if}
        </div>

        <a href={`/posts/${post._id}`} class="flex flex-col my-4">
            <h3 class="font-bold text-xl">{post.title}</h3>
            <p class="text-sm">{post.content}</p>
        </a>

        <Fullscreen
            let:onToggle
            class="w-full rounded-md overflow-hidden h-full"
        >
            <img
                on:click={onToggle}
                class="object-contain object-center"
                src={post.media[0]}
                alt={post.title}
            />
        </Fullscreen>

        <div class="my-2" />

        <div class="flex justify-between w-full">
            {#if post.likes.includes(user._id || "")}
                <Button
                    on:click={handleUnlike}
                    variant="ghost"
                    class="p-2 w-max h-max flex dark:text-sky-400 items-center"
                >
                    <ThumbsUp class="w-4 h-4 mr-2" />
                    <p>{post.likes.length}</p>
                </Button>
            {:else}
                <Button
                    on:click={handleLike}
                    variant="ghost"
                    class="p-2 w-max h-max flex items-center"
                >
                    <ThumbsUp class="w-4 h-4 mr-2" />
                    <p>{post.likes.length}</p>
                </Button>
            {/if}
            {#if post.allowComments}
                <CreateCommentDialog
                    {post}
                    {user}
                    onSuccess={(comment) => {
                        post.comments = [...post.comments, comment];
                    }}
                />
            {:else}
                some
            {/if}
            <Button on:click={() => {}} variant="ghost" class="p-2 w-max h-max">
                <Eye class="w-4 h-4 mr-2" />
                <p>{post.views}</p>
            </Button>
            {#if user.bookmarkedPosts.includes(post._id || "")}
                <Button
                    on:click={handleUnbookmark}
                    variant="ghost"
                    class="p-2 dark:text-sky-400 w-max h-max"
                >
                    <Bookmark class="w-4 h-4 mr-2" />
                    <p>{post.bookmarkCount}</p>
                </Button>
            {:else}
                <Button
                    on:click={handleBookmark}
                    variant="ghost"
                    class="p-2 w-max h-max"
                >
                    <Bookmark class="w-4 h-4 mr-2" />
                    <p>{post.bookmarkCount}</p>
                </Button>
            {/if}
            <Button
                on:click={handleShare}
                variant="ghost"
                class="p-2 w-max h-max"
            >
                <Share2 class="w-4 h-4" />
            </Button>
        </div>
    </div>
</div>
