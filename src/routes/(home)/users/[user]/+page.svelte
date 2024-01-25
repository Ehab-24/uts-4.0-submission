<script lang="ts">
    import EditProfileDialog from "$lib/components/profile/edit-profile-dialog.svelte";
    import type { User } from "$lib/types";
    import {
        ArrowUpToLine,
        Ban,
        CalendarDays,
        FlagOff,
        HeartHandshake,
    } from "lucide-svelte";
    import Fullscreen from "svelte-fullscreen";
    import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button";
    import { handleApiRequestError } from "$lib/api";
    import axios from "axios";
    import { toast } from "svelte-sonner";

    export let data: {
        user: User;
    };

    async function handleFollow() {
        try {
            await axios.post(`/users/${data.user._id}/follow`, {
                userId: $page.params.user,
            });
            data.user.following = [...data.user.following, $page.params.user];
            toast.success(`You are now following ${data.user.displayName}!`);
        } catch (error) {
            handleApiRequestError(error);
        }
    }

    async function handleUnfollow() {
        try {
            await axios.post(`/users/${data.user._id}/unfollow`, {
                userId: $page.params.user,
            });
            data.user.following = data.user.following.filter(
                (id) => id !== $page.params.user,
            );
            toast.success(`Unfollowed ${data.user.displayName}!`);
        } catch (error) {
            handleApiRequestError(error);
        }
    }

    async function handleBlockUser() {
        try {
            await axios.post(`/users/${data.user._id}/blocked`, {
                userId: $page.params.user,
            });
            toast.success(`${data.user.displayName} blocked!`);
        } catch (error) {
            handleApiRequestError(error);
        }
    }

    async function handleUnblockUser() {
        try {
            await axios.post(`/users/${data.user._id}/unblock`, {
                userId: $page.params.user,
            });
            toast.success(`${data.user.displayName} blocked!`);
        } catch (error) {
            handleApiRequestError(error);
        }
    }
</script>

<h1 class="text-3xl font-bold my-8 ml-4">Profile</h1>

<main class="flex px-4 flex-col w-full pb-12">
    <div class="w-full h-80 relative rounded-md">
        <Fullscreen let:onToggle>
            <img
                on:click={onToggle}
                src="https://loremflickr.com/680/680"
                alt={data.user.displayName}
                class="w-full h-full object-cover dark:bg-slate-800 rounded-md object-center"
            />
        </Fullscreen>
        <div
            class="absolute border-[6px] border-slate-50 dark:border-slate-950 dark:bg-slate-800 bottom-0 left-4 xl:left-6 w-40 h-40 xl:w-56 xl:h-56 rounded-full overflow-hidden translate-y-1/2"
        >
            <Fullscreen let:onToggle>
                <img
                    on:click={onToggle}
                    src="https://loremflickr.com/680/680"
                    alt={data.user.displayName}
                    class="dark:bg-slate-800"
                />
            </Fullscreen>
        </div>
    </div>

    <div class="w-full flex pt-28 xl:pt-40 flex-col md:flex-row-reverse">
        <div class="flex gap-2 items-center h-max">
            {#if $page.params.user !== data.user._id && data.user.following.includes($page.params.user)}
                <Button on:click={handleUnfollow} variant="destructive">
                    <FlagOff class="h-4 w-4 mr-2" />
                    Unfollow
                </Button>
            {:else if $page.params.user !== data.user._id}
                <Button on:click={handleFollow} variant="outline">
                    <ArrowUpToLine class="h-4 w-4 mr-2" />
                    Follow
                </Button>
            {/if}
            {#if data.user._id === $page.params.user}
                <div
                    class="w-full flex items-start mb-8 xl:mb-0 xl:justify-end"
                >
                    <EditProfileDialog
                        user={data.user}
                        onSave={() => window.location.reload()}
                    />
                </div>
            {:else if data.user.blockedUsers.includes($page.params.user)}
                <Button on:click={handleUnblockUser} variant="outline">
                    <HeartHandshake class="h-4 w-4 mr-2" />
                    Unblock User
                </Button>
            {:else}
                <Button on:click={handleBlockUser} variant="destructive">
                    <Ban class="h-4 w-4 mr-2" />
                    Block User
                </Button>
            {/if}
        </div>

        <div class="flex flex-col w-full">
            <h1
                class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                {data.user.displayName}
            </h1>
            <p class="leading-7">
                {data.user.bio || "👋 Hey there! I am using Quip."}
            </p>

            <p class="dark:text-slate-400 mt-6">
                <CalendarDays class="inline-block h-4 w-4 mr-1" />
                Joined on{" "}
                {new Date(data.user.createdAt || "").toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    },
                )}
            </p>

            <div class="flex gap-6 mt-2">
                <p class="dark:text-slate-400 whitespace-nowrap">
                    <span class="dark:text-slate-200 font-bold">
                        {data.user.following?.length ?? 0}
                    </span>
                    Following
                </p>
                <p class="dark:text-slate-400 whitespace-nowrap">
                    <span class="dark:text-slate-200 font-bold">
                        {data.user.followers?.length ?? 0}
                    </span>
                    Followers
                </p>
            </div>
        </div>
    </div>
</main>

<slot />
