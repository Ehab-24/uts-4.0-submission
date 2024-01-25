<script lang="ts">
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Button } from "./ui/button";
    import * as Drawer from "$lib/components/ui/drawer";
</script>

<Drawer.Root>
    <Drawer.Trigger asChild let:builder={drawerBuilder}>
        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
                <Button
                    builders={[tooltipBuilder, drawerBuilder]}
                    variant="outline">Open Drawer</Button
                >
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Open navigation drawer</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </Drawer.Trigger>
    <Drawer.Content>
        <div class="mx-auto w-full max-w-sm">
            <Drawer.Header>
                <Drawer.Title>The f*** You Looking At?</Drawer.Title>
                <Drawer.Description
                    >Set your daily activity goal.</Drawer.Description
                >
            </Drawer.Header>
            <Drawer.Footer>
                <Button>Submit</Button>
                <Drawer.Close asChild let:builder>
                    <Button builders={[builder]} variant="outline"
                        >Cancel</Button
                    >
                </Drawer.Close>
            </Drawer.Footer>
        </div>
    </Drawer.Content>
</Drawer.Root>
