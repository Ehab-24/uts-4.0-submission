<script lang="ts">
    import { page } from "$app/stores";
</script>

<main class="w-full flex flex-col items-center min-h-screen pt-20 md:pt-32">
    <h1 class="text-5xl font-bold tracking-tight">Unauthorized</h1>

    <p class="dark:text-slate-400 mt-12">
        {$page.url.searchParams.get("message") ||
            "You are not allowed to view this content"}
    </p>
</main>

