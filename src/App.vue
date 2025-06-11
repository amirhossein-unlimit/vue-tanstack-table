<script setup lang="ts">
import { h, ref } from 'vue';
// components
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge.vue';
// icons
import AltArrowUp from '@/components/icons/AltArrowUp.vue';
import AltArrowDown from '@/components/icons/AltArrowDown.vue';
import CrownStar from '@/components/icons/CrownStar.vue';
import Star from '@/components/icons/Star.vue';

// composables
import useTanStackTable from '@/composables/useTable';

// logical functions
import { createSelectionColumn } from '@/lib/table/selectionTable';
import { FlexRender } from '@tanstack/vue-table';
import { sortingByLang } from '@/lib/table/sortingTable';

// types
import type { ColumnDef, Row } from '@tanstack/vue-table';
import type { User } from '@/types/User';

const users = ref<User[]>([
  { firstName: 'علی', lastName: 'رضایی', age: 100, email: 'ali.rezaei@example.com', role: 'admin' },
  {
    firstName: 'سارا',
    lastName: 'محمدی',
    age: 38,
    email: 'sara.mohammadi@example.com',
    role: 'user',
  },
  { firstName: 'مینا', lastName: 'احمدی', age: 1, email: 'mina.ahmadi@example.com', role: 'user' },
  {
    firstName: 'حسین',
    lastName: 'کریمی',
    age: 12,
    email: 'hossein.karimi@example.com',
    role: 'admin',
  },
  {
    firstName: 'زهرا',
    lastName: 'نجفی',
    age: 7,
    email: 'zahra.najafi@example.com',
    role: 'superAdmin',
  },
  { firstName: 'رضا', lastName: 'کاظمی', age: 89, email: 'reza.kazemi@example.com', role: 'user' },
  { firstName: 'نرگس', lastName: 'صدر', age: 20, email: 'narges.sadr@example.com', role: 'admin' },
  { firstName: 'امیر', lastName: 'جعفری', age: 10, email: 'amir.jafari@example.com', role: 'user' },
  {
    firstName: 'لیلا',
    lastName: 'سلطانی',
    age: 40,
    email: 'leila.soltani@example.com',
    role: 'user',
  },
  { firstName: 'مهدی', lastName: 'نوری', age: 1, email: 'mahdi.nouri@example.com', role: 'admin' },
]);

const columns = [
  createSelectionColumn<User>(),
  {
    accessorKey: 'email',
    header: 'ایمیل',
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: 'نقش',
    cell: ({ row }: { row: Row<User> }) => {
      switch (row.original.role) {
        case 'superAdmin':
          return h(Badge, { class: 'bg-yellow-100 text-yellow-800 text-sm' }, () => [
            h(CrownStar, { class: 'size-5!' }),
            'سوپر ادمین',
          ]);
        case 'admin':
          return h(Badge, { class: 'bg-yellow-100 text-yellow-800 text-sm' }, () => [
            h(Star, { class: 'size-5!' }),
            'ادمین',
          ]);
        case 'user':
          return 'کاربر';
        default:
          break;
      }
    },
  },
  {
    accessorKey: 'age',
    header: 'سن',
  },
  {
    accessorKey: 'lastName',
    header: 'نام خانوادگی',
    // Use the `sortingByLang` function only when you need to sort based on a language other than English.
    sortingFn: sortingByLang,
  },
  {
    accessorKey: 'firstName',
    header: 'نام',
    sortingFn: sortingByLang,
  },
] satisfies ColumnDef<User, string>[];

const { table, tableSearchQuery, tableOptions } = useTanStackTable<User, string>(users, columns, {
  enableFiltering: true,
  enableRowSelection: true,
  enableSorting: true,
});
</script>

<template>
  <section class="container">
    <div
      v-if="tableOptions.enableFiltering"
      class="w-full max-w-xs mb-4 ml-auto flex items-center gap-1.5"
    >
      <Input
        v-model.trim="tableSearchQuery"
        id="search"
        type="search"
        placeholder="جست و جو"
        dir="rtl"
      />
    </div>
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :colSpan="header.colSpan"
            :class="{
              'cursor-pointer select-none':
                tableOptions.enableSorting && header.column.getCanSort(),
            }"
            dir="rtl"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <div v-if="!header.isPlaceholder" class="flex items-center justify-between">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
              <template v-if="tableOptions.enableSorting">
                <AltArrowUp
                  v-show="header.column.getCanSort() && header.column.getIsSorted() === 'asc'"
                  class="size-4.5"
                />
                <AltArrowDown
                  v-show="header.column.getCanSort() && header.column.getIsSorted() === 'desc'"
                  class="size-4.5"
                />
                <span
                  v-show="header.column.getCanSort() && !header.column.getIsSorted()"
                  class="mr-1.5"
                >
                  <AltArrowUp class="size-4.5" />
                  <AltArrowDown class="size-4.5 -mt-1.5" />
                </span>
              </template>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="table.getRowModel().rows.length">
        <TableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :data-state="row.getIsSelected() && 'selected'"
        >
          <TableCell
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            dir="rtl"
            class="font-medium"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </section>
</template>
