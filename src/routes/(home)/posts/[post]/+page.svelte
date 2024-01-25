<script lang="ts">
    import PostCard from "$lib/components/posts/post-card.svelte";
    import type { PopulatedPost, User } from "$lib/types";
    import CommentTile from "$lib/components/comments/comment-tile.svelte";

    export let data: { user: User; post: PopulatedPost };
</script>

<PostCard user={data.user} post={data.post} />

<div class="w-full border-b dark:border-slate-600 mt-6 mb-2"></div>

{#each data.post.comments as comment (comment._id)}
    <CommentTile post={data.post} user={data.user} {comment} />
{/each}
