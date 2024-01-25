<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Avatar from "$lib/components/ui/avatar";
    import { type Comment, type PopulatedPost, type User } from "$lib/types";
    import { CircleUserRound, Edit2 } from "lucide-svelte";
    import { Button } from "../ui/button";
    import { handleApiRequestError } from "$lib/api";
    import axios from "axios";
    import { toast } from "svelte-sonner";

    export let post: PopulatedPost;
    export let user: User;
    export let comment: Comment;
    export let onSuccess: (content: string) => void;
    let open = false;
    let loading = false;
    let content: string = comment.content;

    async function createComment() {
        try {
            loading = true;
            const url = `/users/${user._id}/posts/${post._id}/comments/${comment._id}`;
            await axios.put(url, { ...comment, content });
            toast.success("Comment posted!");
            loading = false;
            open = false;
            onSuccess(content);
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }
</script>

<Dialog.Root bind:open onOpenChange={(b) => (open = b)}>
    <Dialog.Trigger class="w-full">
        <Button variant="ghost" size="sm" class="rounded-sm w-full">
            <Edit2 class="w-4 h-4 mr-2" />
            Edit
        </Button>
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
                <Dialog.Description>
                    {post.content}
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
                placeholder="Write a comment..."
            />
        </div>

        <Button on:click={createComment} class="self-end w-max min-w-24 mt-4"
            >Save</Button
        >
    </Dialog.Content>
</Dialog.Root>
