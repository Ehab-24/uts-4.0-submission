<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "../ui/button";
    import { Check, ImagePlus } from "lucide-svelte";
    import Separator from "../ui/separator/separator.svelte";
    import { handleApiRequestError } from "$lib/api";
    import axios from "axios";
    import { toast } from "svelte-sonner";
    import Spinner from "../../assets/icons/spinner.svelte";
    import * as Tabs from "$lib/components/ui/tabs";
    import { uploadImage } from "$lib/utils";

    export let userId: string;

    let open = false;

    let type: "text" | "media" | "article" = "text";
    let allowComments = true;
    let title = "";
    let content = "";
    let tags: string[] = [];
    let media: string[] = [];

    let loading = false;
    async function createPost() {
        try {
            loading = true;
            await axios.post(`/users/${userId}/posts`, {
                title,
                createdBy: userId,
                content,
                type,
                allowComments,
                tags,
                media,
                status: "published",
                likes: [],
                comments: [],
            });
            toast.success("Post created successfully");
            open = false;
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }
</script>

<Dialog.Root bind:open onOpenChange={(b) => (open = b)}>
    <Dialog.Trigger>
        <slot />
    </Dialog.Trigger>
    <Dialog.Content class="max-h-[90vh] overflow-y-scroll">
        <Dialog.Header>
            <Dialog.Title>Create a post</Dialog.Title>
            <Dialog.Description>
                This post will be visible to all users.
            </Dialog.Description>
        </Dialog.Header>

        <Tabs.Root value="text" class="w-full">
            <Tabs.List class="w-full">
                <Tabs.Trigger class="w-full" value="text">Text</Tabs.Trigger>
                <Tabs.Trigger class="w-full" value="poll">Poll</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="text">
                <div class="flex flex-col px-2">
                    <div class="flex items-center">
                        <div
                            class="min-w-12 h-12 mr-2 bg-gray-700 rounded-full"
                        ></div>
                        <input
                            disabled={loading}
                            type="text"
                            placeholder="Title"
                            bind:value={title}
                            class="text-2xl md:text-3xl bg-transparent border-none outline-none ring-0 font-bold w-full p-2"
                        />
                    </div>
                    <textarea
                        disabled={loading}
                        bind:value={content}
                        class="border-none outline-none ring-0 w-full h-48 p-2 bg-transparent"
                        placeholder="What is happening?"
                    />
                </div>
            </Tabs.Content>
            <Tabs.Content value="poll">
                <div class="flex flex-col px-2">
                    <div class="flex items-center">
                        <div
                            class="min-w-12 h-12 mr-2 bg-gray-700 rounded-full"
                        ></div>
                        <input
                            disabled={loading}
                            type="text"
                            placeholder="My Article"
                            bind:value={title}
                            class="text-2xl md:text-3xl bg-transparent border-none outline-none ring-0 font-bold w-full p-2"
                        />
                    </div>
                    <textarea
                        disabled={loading}
                        bind:value={content}
                        class="border-none outline-none ring-0 w-full h-48 p-2 bg-transparent"
                        placeholder="Article content"
                    />
                </div>
            </Tabs.Content>
        </Tabs.Root>

        {#if media.length > 0}
            <div class="w-full h-max rounded-md bg-slate-800">
                <img
                    src={media[0]}
                    alt={title}
                    class="w-full h-max rounded-md object-contain bg-contain"
                />
            </div>
        {/if}

        <Separator />

        <div class="flex w-full justify-between items-center">
            <div class="flex gap-1 items-center">
                <div
                    class="relative flex p-2 rounded-md cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/10"
                >
                    {#if loading}
                        <Spinner />
                    {:else}
                        <ImagePlus class="w-4 h-4" />
                    {/if}
                    <input
                        on:change={async (e) => {
                            loading = true;
                            const url = await uploadImage(e);
                            if (url) {
                                media = [...media, url];
                                toast.success("Image uploaded!");
                            } else toast.error("Failed to upload image");
                            loading = false;
                        }}
                        type="file"
                        accept="image/png,image/jpeg"
                        class="opacity-0 w-8 cursor-pointer absolute"
                    />
                </div>

                <div class="mx-1 h-6 w-[1.5px] bg-slate-700" />
                <Button
                    disabled={loading}
                    variant="ghost"
                    size="sm"
                    class={allowComments
                        ? "text-sky-400 hover:text-sky-500"
                        : "text-red-400 hover:text-red-500"}
                    on:click={() => (allowComments = !allowComments)}
                >
                    {#if allowComments}
                        <Check class="w-4 h-4 mr-2" />
                        Allow comments
                    {:else}
                        Comments disabled
                    {/if}
                </Button>
            </div>
            <Button disabled={loading} on:click={createPost} class="min-w-24"
                >Post</Button
            >
        </div>
    </Dialog.Content>
</Dialog.Root>
