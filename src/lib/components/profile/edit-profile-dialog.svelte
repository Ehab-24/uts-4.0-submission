<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "../ui/button";
    import { Input } from "../ui/input";
    import { Label } from "../ui/label";
    import { Separator } from "../ui/separator";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { User } from "$lib/types";
    import axios from "axios";
    import { handleApiRequestError } from "$lib/api";
    import { toast } from "svelte-sonner";
    import { uploadImage } from "$lib/utils";

    export let user: User;
    export let onSave: () => void;

    let open = false;
    let loading = false;

    async function handleSubmit(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        loading = true;
        try {
            await axios.put(`/users/${user._id}`, user);
            toast.success("Profile saved!");
            open = false;
            onSave();
        } catch (error) {
            handleApiRequestError(error);
        } finally {
            loading = false;
        }
    }
</script>

<Dialog.Root bind:open onOpenChange={(b) => (open = b)}>
    <Dialog.Trigger>
        <Button variant="outline">Edit profile</Button>
    </Dialog.Trigger>
    <Dialog.Content class="max-h-[90vh] overflow-y-scroll">
        <Dialog.Header class="pt-2">
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>
                Update your profile information.
            </Dialog.Description>
        </Dialog.Header>

        <Separator class="my-[2px]" />

        <form on:submit={handleSubmit} action="">
            <div class="w-full flex gap-4 flex-col items-center py-6">
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="displayName">Display name</Label>
                    <Input
                        bind:value={user.displayName}
                        name="displayName"
                        id="displayName"
                        placeholder="John Doe"
                    />
                </div>

                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="bio">Bio</Label>
                    <Textarea
                        bind:value={user.bio}
                        name="bio"
                        id="bio"
                        placeholder="👋 Hey there! I am using Quip!"
                    />
                </div>

                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="interests">Interests</Label>
                    <Input
                        on:keydown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();

                                user = {
                                    ...user,
                                    interests: [
                                        ...user.interests,
                                        // @ts-ignore
                                        e.target.value.toLowerCase(),
                                    ],
                                };
                                // @ts-ignore
                                e.target.value = "";
                            }
                        }}
                        name="interests"
                        id="interests"
                        placeholder="Sports, Music..."
                    />
                    <div class="flex flex-wrap gap-x-2 gap-y-1 w-full mt-2">
                        {#each user.interests as interest}
                            <Button
                                variant="secondary"
                                class="px-1 py-0.5 capitalize h-min w-min"
                                on:click={() => {
                                    user = {
                                        ...user,
                                        interests: user.interests.filter(
                                            (i) => i !== interest,
                                        ),
                                    };
                                    console.log(user.interests);
                                }}
                            >
                                {interest}
                            </Button>
                        {/each}
                    </div>
                </div>

                <div class="grid w-full max-w-sm self-center gap-1.5">
                    <Label for="avatar">Avatar</Label>
                    <Input
                        id="avatar"
                        type="file"
                        on:change={async (e) => {
                            loading = true;
                            const image = await uploadImage(e);
                            if (image) {
                                user = { ...user, avatar: image };
                                toast.success("Image uploaded!");
                            } else toast.error("Failed to upload image");
                            loading = false;
                        }}
                    />
                </div>

                <div class="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label for="profilePicture">Profile Picture</Label>
                    <Input
                        id="profilePicture"
                        type="file"
                        on:change={async (e) => {
                            loading = true;
                            const image = await uploadImage(e);
                            user = {
                                ...user,
                                profilePicture: image,
                            };
                            loading = false;
                        }}
                    />
                </div>
            </div>

            <Separator class="my-[2px]" />

            <div class="flex justify-end pt-4 w-full">
                <Button disabled={loading} type="submit" class="min-w-24"
                    >Save</Button
                >
            </div>
        </form>
    </Dialog.Content>
</Dialog.Root>
