<script lang="ts">
    import { browser } from "$app/environment";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import type { Theme, ThemeProviderState } from "$lib/types";
    import { PUBLIC_THEME_CONTEXT_KEY } from "$env/static/public";

    let theme = writable<Theme>("system");

    $: {
        if (browser) {
            const root = window.document.documentElement;
            root.classList.remove("dark", "light");

            if ($theme === "system") {
                const systemTheme = window.matchMedia(
                    "(prefers-color-scheme: dark)",
                ).matches
                    ? "dark"
                    : "light";

                root.classList.add(systemTheme);
                $theme = systemTheme;
            } else {
                root.classList.add($theme);
            }
        }
    }

    const setTheme = (_theme: Theme) => {
        localStorage.setItem(PUBLIC_THEME_CONTEXT_KEY, _theme);
        $theme = _theme;
    };

    setContext<ThemeProviderState>(PUBLIC_THEME_CONTEXT_KEY, {
        theme,
        setTheme,
    });
</script>

<slot />
