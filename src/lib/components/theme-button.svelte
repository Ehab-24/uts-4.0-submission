<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { getContext } from "svelte";
    import type { ThemeProviderState } from "$lib/types";

    const { theme, setTheme } = getContext<ThemeProviderState>("theme");

    function toggleTheme() {
        setTheme($theme === "dark" ? "light" : "dark");
    }
</script>

<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <Button builders={[builder]} variant="outline" on:click={toggleTheme}>
            <slot />
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
        <p>Switch to {$theme === "dark" ? "light" : "dark"}</p>
    </Tooltip.Content>
</Tooltip.Root>
