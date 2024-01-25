<script lang="ts">
    import { Button } from "../ui/button";
    import { page } from "$app/stores";

    export let exact: boolean = false;
    export let href: string;
    export let activePrefix: string;

    function isActive(str: string): boolean {
        return exact
            ? $page.url.pathname === str
            : $page.url.pathname.startsWith(str);
    }
</script>

{#key $page.url.pathname}
    <Button
        variant={isActive(activePrefix) ? "secondary" : "ghost"}
        {href}
        class="w-full justify-start"
    >
        <slot />
    </Button>
{/key}
