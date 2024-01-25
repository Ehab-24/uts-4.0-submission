<script lang="ts">
    import PostCard from "$lib/components/posts/post-card.svelte";
    import type { PopulatedPost, User } from "$lib/types";

    export let data: { user: User; posts: PopulatedPost[] };
</script>

<h1 class="text-3xl font-bold my-8 ml-4">My Posts</h1>

<div class="flex flex-col w-full items-center">
    {#each data.posts as post (post._id)}
        <PostCard
            onDelete={() =>
                (data.posts = data.posts.filter((p) => p._id !== post._id))}
            {post}
            user={data.user}
        />
    {/each}
</div>
