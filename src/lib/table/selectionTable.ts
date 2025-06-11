import type { ColumnDef, Row, Table } from "@tanstack/vue-table";
import { h } from "vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";

function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }: { table: Table<TData> }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value) => table.toggleAllPageRowsSelected(!!value),
      }),
    cell: ({ row }: { row: Row<TData> }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        disabled: !row.getCanSelect(),
        "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
      }),
    enableSorting: false,
    enableGlobalFilter: false,
    enableColumnFilter: false,
    enableHiding: false,
    size: 32,
  };
}

export { createSelectionColumn };
