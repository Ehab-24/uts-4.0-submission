<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import Drawer from "$lib/components/drawer.svelte";
    import { Button } from "$lib/components/ui/button";
</script>

<h1>Welcome to SvelteKit</h1>
<div class="w-full flex flex-col items-center gap-12 justify-center">
    <Carousel.Root class="w-full max-w-xs">
        <Carousel.Content>
            {#each Array(5) as _, i (i)}
                <Carousel.Item>
                    <div class="p-1">
                        <Card.Root>
                            <Card.Content
                                class="flex aspect-square items-center justify-center p-6"
                            >
                                <span class="text-4xl font-semibold"
                                    >{i + 1}</span
                                >
                            </Card.Content>
                        </Card.Root>
                    </div>
                </Carousel.Item>
            {/each}
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
    </Carousel.Root>

    <form method="POST" action="/auth?/logout">
        <Button type="submit">Logout</Button>
    </form>

    <Drawer />
</div>
