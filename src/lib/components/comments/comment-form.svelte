<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar";
    import type { PopulatedPost } from "$lib/types";
    import { CircleUserRound } from "lucide-svelte";
    import { Textarea } from "../ui/textarea";

    export let post: PopulatedPost;
</script>

<h4 class="font-bold tracking-tight leading-7">
    Commenting on <span class="font-bold tracking-tight">{post.title}</span> by
    <span class="text-sky-400">{post.createdBy.displayName}</span>
</h4>

<form action="" class="flex w-full gap-2">
    <Avatar.Root class="min-w-6 min-h-6">
        <Avatar.Image
            src={post.createdBy.avatar}
            alt={post.createdBy.displayName}
        />
        <Avatar.Fallback>
            <CircleUserRound />
        </Avatar.Fallback>
    </Avatar.Root>

    <Textarea class="w-full h-60" placeholder="Comment" />
</form>
