<script lang="ts">
    import type { PopulatedPost, User } from "$lib/types";
    import * as Avatar from "$lib/components/ui/avatar";
    import {
        CircleUserRound,
        MoreVertical,
        Bookmark,
        Eye,
        Share2,
    } from "lucide-svelte";
    import TimeAgo from "javascript-time-ago";
    import { Button } from "$lib/components/ui/button";
    import { handleApiRequestError } from "$lib/api";
    import axios from "axios";
    import { toast } from "svelte-sonner";
    import { getTimeAgo } from "$lib/utils";

    const timeAgo = new TimeAgo("en-US");

    export let data: { posts: PopulatedPost[]; user: User };

    let loading = false;
    async function handleBookmark(post: PopulatedPost) {
        loading = true;
        try {
            axios.post(`/users/${post.createdBy._id}/bookmarks`, {
                postId: post._id,
            });
            data.user.bookmarkedPosts = [
                ...data.user.bookmarkedPosts,
                post._id!,
            ];
            post.bookmarkCount++;
            toast.success("Bookmark saved!");
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }

    async function handleUnbookmark(post: PopulatedPost) {
        loading = true;
        try {
            axios.post(`/users/${post.createdBy._id}/unbookmark`, {
                postId: post._id,
            });
            data.user.bookmarkedPosts = data.user.bookmarkedPosts.filter(
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

<h1 class="text-3xl font-bold my-8 ml-4">Bookmarks</h1>

{#each data.posts as post (post._id)}
    <div
        class="flex border-b dark:border-slate-600 cursor-default hover:bg-slate-900 transition-all gap-2 w-full px-4 py-8"
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
                <div class="flex gap-1 items-center">
                    {#if data.user.bookmarkedPosts.includes(post._id || "")}
                        <Button
                            on:click={() => handleUnbookmark(post)}
                            variant="ghost"
                            class="p-2 dark:text-sky-400 w-max h-max"
                        >
                            <Bookmark class="w-4 h-4" />
                        </Button>
                    {:else}
                        <Button
                            on:click={() => handleBookmark(post)}
                            variant="ghost"
                            class="p-2 w-max h-max"
                        >
                            <Bookmark class="w-4 h-4" />
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

            <a href={`/posts/${post._id}`} class="flex flex-col my-4">
                <h3 class="font-bold text-xl">{post.title}</h3>
                <p class="text-sm">{post.content}</p>
            </a>
        </div>
    </div>
{/each}
