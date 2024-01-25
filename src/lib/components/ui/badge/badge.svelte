<script lang="ts">
	import { cn } from "$lib/utils";
	import { badgeVariants, type Variant } from ".";

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = "default";
	export let element: string = "span";
	export { className as class };
</script>

<svelte:element
	this={href ? "a" : element}
	{href}
	class={cn(badgeVariants({ variant, className }))}
	{...$$restProps}
>
	<slot />
</svelte:element>
