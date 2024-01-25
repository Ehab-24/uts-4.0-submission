<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { MoreHorizontal } from "lucide-svelte";
  import * as Tooltip from "$lib/components/ui/tooltip";

  export let id: string;
  export let payments: any;
  export let setPayments: (payments: any) => void;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder={builder1}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder={builder2}>
        <Button
          variant="ghost"
          builders={[builder1, builder2]}
          size="icon"
          class="relative w-8 h-8 p-0"
        >
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>More actions</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
        Copy payment ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item on:click={() => console.log("hello")}
      >View customer</DropdownMenu.Item
    >
    <DropdownMenu.Item>View payment details</DropdownMenu.Item>
    <DropdownMenu.Item
      on:click={() => setPayments(payments.filter((p) => p.id !== id))}
      >Delete</DropdownMenu.Item
    >
  </DropdownMenu.Content>
</DropdownMenu.Root>
