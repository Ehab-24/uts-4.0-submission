<script lang="ts">
    import { Command } from "lucide-svelte";
    import UserAuthForm from "./(components)/user-auth-form.svelte";
    import "../../app.css";

    let isLogin = true;
</script>

<div
    class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
    <div
        class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
    >
        <div
            class="absolute inset-0 bg-cover"
            style="
            background-image:
            url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
        />
        <div class="relative z-20 flex items-center text-lg font-medium">
            <Command class="mr-2 h-6 w-6" />
            Quip Inc
        </div>
        <div class="relative z-20 mt-auto">
            <blockquote class="space-y-2">
                <p class="text-lg">
                    &ldquo;Embrace the art of brevity in our platform for
                    concise conversations, seamlessly connecting you to the
                    pulse of current moments and discussions.&rdquo;
                </p>
                <footer class="text-sm">Sofia Davis</footer>
            </blockquote>
        </div>
    </div>
    <div class="lg:p-8">
        <div
            class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        >
            <div class="flex flex-col space-y-2 text-center">
                <h1 class="text-2xl font-semibold tracking-tight">
                    {#if isLogin}
                        Log in to your account
                    {:else}
                        Create an account
                    {/if}
                </h1>
                <p class="text-sm text-muted-foreground">
                    {#if isLogin}
                        Use an existing account
                    {:else}
                        Continue with a fresh account
                    {/if}
                </p>
            </div>
            <UserAuthForm bind:isLogin />
            <p
                class="px-8 leading-relaxed text-center text-sm text-muted-foreground"
            >
                By clicking continue, you agree to our{" "}
                <a
                    href="/terms"
                    class="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </a>{" "}
                and{" "}
                <a
                    href="/privacy"
                    class="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </a>
                .
            </p>
        </div>
    </div>
</div>
