import type { Writable } from "svelte/store";


export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
    theme: Writable<Theme>;
    setTheme: (theme: Theme) => void;
};
