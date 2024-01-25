<script lang="ts">
    import {
        createTable,
        createRender,
        Render,
        Subscribe,
    } from "svelte-headless-table";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import DataTableActions from "./data-table-actions.svelte";
    import { addPagination, addSortBy } from "svelte-headless-table/plugins";
    import { ArrowUpDown } from "lucide-svelte";
    import type { RegistrationData } from "$lib/types";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Button } from "../ui/button";

    export let data: RegistrationData[];

    const table = createTable(readable(data), {
        page: addPagination(),
        sort: addSortBy(),
    });

    const columns = table.createColumns([
        table.column({
            accessor: "teamName",
            header: "Team name",
        }),
        table.column({
            accessor: "nMembers",
            header: "No. of members",
        }),
        table.column({
            accessor: "institute",
            header: "Institute",
        }),
        table.column({
            accessor: "competition",
            header: "Competition",
        }),
        table.column({
            accessor: "totalFee",
            header: "Total fee",
        }),
        table.column({
            accessor: "status",
            header: "Status",
        }),
        table.column({
            accessor: "createdAt",
            header: "Created at",
            cell: ({ value }) =>
                Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                }).format(new Date(value!)),
        }),
        table.column({
            accessor: ({ _id }) => _id,
            header: "",
            cell: (r) => {
                return createRender(DataTableActions, {
                    id: r.value!,
                    payments: data,
                    setPayments: (ps) => {
                        console.log(ps);
                        data = ps;
                    },
                });
            },
        }),
    ]);

    const sortableFields = [
        "teamName",
        "nMembers",
        "institute",
        "competition",
        "totalFee",
        "status",
        "createdAt",
    ];

    const { headerRows, pageRows, tableBodyAttrs } =
        table.createViewModel(columns);
</script>

<div class="rounded-md border">
    <Table.Root>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe
                                attrs={cell.attrs()}
                                props={cell.props()}
                                let:props
                            >
                                <Table.Head>
                                    {#if sortableFields.includes(cell.id)}
                                        <Tooltip.Root>
                                            <Tooltip.Trigger
                                                asChild
                                                let:builder={tooltipBuilder}
                                            >
                                                <Button
                                                    builders={[tooltipBuilder]}
                                                    variant="link"
                                                    class="flex no-underline gap-1 items-center hover:text-gray-700 dark:hover:text-gray-200"
                                                    on:click={props.sort.toggle}
                                                >
                                                    <Render
                                                        of={cell.render()}
                                                    />
                                                    <ArrowUpDown
                                                        class="ml-2 h-4 w-4"
                                                    />
                                                </Button>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content>
                                                <p>
                                                    Sort by{" "}
                                                    {props.sort.order}
                                                </p>
                                            </Tooltip.Content>
                                        </Tooltip.Root>
                                    {:else}
                                        <Render of={cell.render()} />
                                    {/if}
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>

        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <div
                                        class={`${
                                            cell.id === "teamName"
                                                ? ""
                                                : "text-center"
                                        }`}
                                    >
                                        <Render of={cell.render()} />
                                    </div>
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
