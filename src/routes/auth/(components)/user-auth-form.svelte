<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { cn } from "$lib/utils";
	import Spinner from "$lib/assets/icons/spinner.svelte";
	import { LogIn } from "lucide-svelte";
	import type { EventHandler } from "svelte/elements";
	import axios from "axios";
	import type { User } from "$lib/types";
	import { handleApiRequestError } from "$lib/api";

	let className: string | undefined | null = undefined;
	export { className as class };

	export let isLogin: boolean;

	let loading = false;

	const handleLogin = async (email: string, password: string) => {
		loading = true;
		try {
			const { data } = await axios.post("/auth/login", {
				email,
				password,
			});
			loading = false;
			window.location.href = `/users/${data.userId}/feed`;
		} catch (error) {
			handleApiRequestError(error);
		} finally {
			loading = false;
		}
	};

	const handleRegister = async (user: User) => {
		loading = true;
		try {
			const { data } = await axios.post("/auth/register", user);
			loading = false;
			window.location.href = `/users/${data.userId}/feed`;
		} catch (error) {
			handleApiRequestError(error);
		} finally {
			loading = false;
		}
	};

	const onSubmit: EventHandler<SubmitEvent, HTMLFormElement> = async (ev) => {
		if (isLogin) {
			// @ts-ignore
			handleLogin(ev.target.email.value, ev.target.password.value);
		} else {
			handleRegister({
				// @ts-ignore
				displayName: ev.target.displayName.value,
				// @ts-ignore
				email: ev.target.email.value,
				// @ts-ignore
				password: ev.target.password.value,
				blockedUsers: [],
				interests: [],
				bookmarkedPosts: [],
				following: [],
				followers: [],
			});
		}
	};
</script>

<div class={cn("grid gap-6", className)} {...$$restProps}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-1">
				<Label class="sr-only" for="email">Email</Label>
				{#if !isLogin}
					<Input
						id="displayName"
						name="displayName"
						autocomplete="name"
						placeholder="John Doe"
						disabled={loading}
					/>
				{/if}
				<Input
					id="email"
					name="email"
					placeholder="name@example.com"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					disabled={loading}
				/>
				<Input
					id="password"
					name="password"
					placeholder="******"
					type="password"
					disabled={loading}
				/>
			</div>
			<Button type="submit" disabled={loading}>
				{#if loading}
					<Spinner />
				{/if}
				{#if isLogin}
					Sign In with Email
				{:else}
					Create Account
				{/if}
			</Button>
		</div>
	</form>
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t" />
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background px-2 text-muted-foreground">
				Or create an account
			</span>
		</div>
	</div>
	<Button
		variant="outline"
		type="button"
		disabled={loading}
		on:click={() => (isLogin = !isLogin)}
	>
		{#if loading}
			<Spinner />
		{:else}
			<LogIn class="h-4 w-4" />
		{/if}
		{" "}
		<p class="ml-2">
			{#if isLogin}
				Create an Account
			{:else}
				Log In
			{/if}
		</p>
	</Button>
</div>
