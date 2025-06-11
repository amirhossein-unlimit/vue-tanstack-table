import { type Ref, ref } from "vue";
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/vue-table";

interface TableOptions {
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableRowSelection?: boolean;
}

function useTanStackTable<TData, TValue = unknown>(
  data: Ref<TData[]>,
  columns: ColumnDef<TData, TValue>[],
  { enableFiltering = false, enableSorting = true, enableRowSelection = false }: TableOptions = {},
) {
  const sorting = ref<SortingState>([]);
  const tableSearchQuery = ref<string | number>(""); // Global filter value for row filtering based on user input
  const rowSelection = ref<RowSelectionState>({});

  // Table change handlers (sorting, filtering, selection, etc.)
  function onSortingChange(updaterOrValue: unknown) {
    sorting.value =
      typeof updaterOrValue === "function" ? updaterOrValue(sorting.value) : updaterOrValue;
  }

  function onGlobalFilterChange(updaterOrValue: unknown) {
    tableSearchQuery.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(tableSearchQuery.value)
        : updaterOrValue;
  }

  function onRowSelectionChange(updateOrValue: unknown) {
    rowSelection.value =
      typeof updateOrValue === "function" ? updateOrValue(rowSelection.value) : updateOrValue;
  }

  // create a table with custom options
  const table = useVueTable({
    get data() {
      return data.value;
    },
    state: {
      get sorting() {
        return enableSorting ? sorting.value : undefined;
      },
      get globalFilter() {
        return enableFiltering ? tableSearchQuery.value : undefined;
      },
      get rowSelection() {
        return enableRowSelection ? rowSelection.value : undefined;
      },
    },
    columns,
    onSortingChange: enableSorting ? onSortingChange : undefined,
    onGlobalFilterChange: enableFiltering ? onGlobalFilterChange : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,
    enableRowSelection, //enable row selection for all rows
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    tableSearchQuery,
    tableRowSelected: rowSelection,
    tableOptions: { enableFiltering, enableSorting, enableRowSelection },
  };
}

export default useTanStackTable;
