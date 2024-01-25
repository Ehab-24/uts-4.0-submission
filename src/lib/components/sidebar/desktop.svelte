<script lang="ts">
    import { cn } from "$lib/utils";
    import CreatePostDialog from "$lib/components/posts/create-post-dialog.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Send, Bookmark, Home, User, StickyNote } from "lucide-svelte";

    let className: string | null | undefined = undefined;
    export { className as class };
    export let userId: string;

    import { mediaQuery } from "svelte-legos";
    import SidebarItem from "./sidebar-item.svelte";
    const isDesktop = mediaQuery("(min-width: 1280px)");
</script>

{#if $isDesktop}
    <div
        class={cn(
            "border-r min-h-screen border-gray-200 dark:border-slate-800",
            className,
        )}
    >
        <div
            class="space-y-4 pb-12 pt-8 min-h-screen h-full p-4 flex flex-col items-stretch justify-between w-full"
        >
            <div class="py-2">
                <h2
                    class="mb-4 pb-4 px-4 border-b-[1.5px] text-2xl font-semibold tracking-tight"
                >
                    Quip
                </h2>
                <div class="space-y-1 h-full">
                    <SidebarItem
                        exact
                        activePrefix=""
                        href={`/users/${userId}/feed`}
                    >
                        <Home class="w-4 h-4 mr-2" />
                        Home
                    </SidebarItem>
                    <SidebarItem
                        exact
                        activePrefix="/"
                        href={`/users/${userId}/posts`}
                    >
                        <StickyNote class="w-4 h-4 mr-2" />
                        My Posts
                    </SidebarItem>
                    <SidebarItem
                        activePrefix="/coderush/registration"
                        href={`/users/${userId}/bookmarks`}
                    >
                        <Bookmark class="w-4 h-4 mr-2" />
                        Bookmarks
                    </SidebarItem>
                    <SidebarItem
                        exact
                        activePrefix=""
                        href={`/users/${userId}`}
                    >
                        <User class="w-4 h-4 mr-2" />
                        My Profile
                    </SidebarItem>
                </div>
            </div>

            <CreatePostDialog {userId}>
                <Button class="w-full">
                    <Send class="w-4 h-4 mr-2" />
                    Create Post
                </Button>
            </CreatePostDialog>
        </div>
    </div>
{/if}
