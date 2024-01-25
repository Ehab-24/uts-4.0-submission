<script lang="ts">
    import ThemeProvider from "$lib/components/theme-provider.svelte";
    import "../../app.css";
    import { Toaster } from "$lib/components/ui/sonner";
    import * as Sidebar from "$lib/components/sidebar";
    import TimeAgo from "javascript-time-ago";
    import en from "javascript-time-ago/locale/en";

    TimeAgo.addDefaultLocale(en);
    export let data;
</script>

<ThemeProvider>
    <Toaster />
    <div class="w-full flex justify-center">
        <div class="w-[30vw] fixed left-0 top-0 flex justify-end">
            <Sidebar.Desktop userId={data.user._id || ""} class="h-full w-64" />
        </div>
        <div class="flex flex-col md:min-h-screen h-full w-full">
            <div
                class="fixed p-2 xl:hidden flex z-50 bg-slate-950 border-b border-slate-500 w-screen top-0 left-0"
            >
                <Sidebar.Mobile userId={data.user._id || ""} />
            </div>
            <div class="w-full pt-16 xl:pt-0 xl:ml-[30vw] xl:w-[40vw]">
                <slot />
            </div>
        </div>
        <div
            class="w-[30vw] min-h-screen xl:border-l fixed right-0 top-0 flex justify-start"
        />
    </div>
</ThemeProvider>
