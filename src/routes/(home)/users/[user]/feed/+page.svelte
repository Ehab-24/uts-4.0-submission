<script lang="ts">
    import PostCard from "$lib/components/posts/post-card.svelte";
    import type { PopulatedPost, User } from "$lib/types";

    export let data: { user: User; posts: PopulatedPost[] };
</script>

<h1 class="text-3xl font-bold my-8 ml-4">Feed</h1>

{#each data.posts as post (post._id)}
    <PostCard user={data.user} {post} />
{/each}
