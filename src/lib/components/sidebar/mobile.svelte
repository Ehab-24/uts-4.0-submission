<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";
    import { Button } from "$lib/components/ui/button";
    import {
        Bookmark,
        Home,
        Send,
        Sidebar,
        StickyNote,
        User,
    } from "lucide-svelte";

    import { mediaQuery } from "svelte-legos";
    import SidebarItem from "./sidebar-item.svelte";
    import CreatePostDialog from "../posts/create-post-dialog.svelte";
    const isDesktop = mediaQuery("(min-width: 1280px)");

    export let userId: string;
</script>

{#if !$isDesktop}
    <Sheet.Root>
        <Sheet.Trigger asChild let:builder>
            <Button size="sm" builders={[builder]} variant="ghost">
                <Sidebar />
            </Button>
        </Sheet.Trigger>
        <Sheet.Content side="left">
            <div
                class="space-y-4 h-full flex flex-col items-stretch justify-between w-full"
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
        </Sheet.Content>
    </Sheet.Root>
{/if}
