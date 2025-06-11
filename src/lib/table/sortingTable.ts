import { type Row } from "@tanstack/vue-table";
function sortingByLang<TData>(
  currentRow: Row<TData>,
  nextRow: Row<TData>,
  columnId: string,
  lang: string = "fa",
) {
  const current = currentRow.getValue(columnId) as string;
  const next = nextRow.getValue(columnId) as string;
  return current.localeCompare(next, lang);
}

export { sortingByLang };
