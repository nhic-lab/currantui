/**
 * Recipe: Rich Table
 *
 * The eRadia-worklist look built from CurrantUI primitives + TanStack Table.
 * This file is copy-paste ready: drop it into your app, replace the placeholder
 * data/columns with your own, and delete the Storybook block at the bottom.
 *
 * CurrantUI deliberately does NOT ship a DataTable component — table state
 * (sorting, selection, filtering) belongs to your app and your state library.
 * The package provides the presentation pieces; this recipe shows the wiring.
 */
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DownloadSimpleIcon,
  FolderOpenIcon,
  FunnelSimpleIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Badge } from "@nhic/currantui/components/badge";
import { Button } from "@nhic/currantui/components/button";
import { Checkbox } from "@nhic/currantui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nhic/currantui/components/select";
import { SortIndicator } from "@nhic/currantui/components/sort-indicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@nhic/currantui/components/table";
import { TableEmptyState } from "@nhic/currantui/components/table-empty-state";
import { TablePagination } from "@nhic/currantui/components/table-pagination";
import {
  TableSelectionBar,
  blurFocusedRowControl,
} from "@nhic/currantui/components/table-selection-bar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nhic/currantui/components/tooltip";
import { exportRowsToCsv } from "@nhic/currantui/lib/export-csv";
import { cn } from "@nhic/currantui/lib/utils";

import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import type { Meta, StoryObj } from "@storybook/react-vite";

/* Placeholder domain — replace with your own row type */
interface Report {
  id: string;
  facility: string;
  district: string;
  categories: Array<string>;
  summary: string;
  submittedAt: string; // ISO date
  status: "draft" | "submitted" | "approved" | "rejected";
  reviewer: string | null;
  /* row-accent flags — see rowClassName below */
  urgent?: boolean;
  overdue?: boolean;
}

const REPORTS: Array<Report> = [
  {
    id: "RPT-1042",
    facility: "Kacyiru District Hospital",
    district: "Gasabo",
    categories: ["Maternal", "Q2"],
    summary: "Quarterly maternal health indicators, all facilities reporting",
    submittedAt: "2026-07-08",
    status: "submitted",
    reviewer: null,
    urgent: true,
  },
  {
    id: "RPT-1041",
    facility: "Muhima Hospital",
    district: "Nyarugenge",
    categories: ["Vaccination"],
    summary: "Routine immunization coverage follow-up",
    submittedAt: "2026-07-07",
    status: "approved",
    reviewer: "A. Uwase",
  },
  {
    id: "RPT-1039",
    facility: "Masaka Hospital",
    district: "Kicukiro",
    categories: ["Nutrition", "U5"],
    summary: "Under-five nutrition screening results",
    submittedAt: "2026-07-05",
    status: "submitted",
    reviewer: "J. Mugisha",
    overdue: true,
  },
  {
    id: "RPT-1036",
    facility: "Remera Health Center",
    district: "Gasabo",
    categories: ["Malaria"],
    summary: "Weekly malaria surveillance",
    submittedAt: "2026-07-03",
    status: "rejected",
    reviewer: "A. Uwase",
  },
  {
    id: "RPT-1033",
    facility: "Gikondo Health Center",
    district: "Kicukiro",
    categories: ["TB", "HIV"],
    summary: "Co-infection cohort quarterly review",
    submittedAt: "2026-06-30",
    status: "approved",
    reviewer: "C. Niyonzima",
  },
  {
    id: "RPT-1031",
    facility: "Nyamirambo Health Center",
    district: "Nyarugenge",
    categories: ["Maternal"],
    summary: "Antenatal care attendance, June",
    submittedAt: "2026-06-28",
    status: "draft",
    reviewer: null,
  },
  {
    id: "RPT-1028",
    facility: "Kimironko Health Center",
    district: "Gasabo",
    categories: ["Malaria", "Surveillance"],
    summary: "Weekly malaria surveillance, week 26",
    submittedAt: "2026-06-26",
    status: "approved",
    reviewer: "J. Mugisha",
  },
  {
    id: "RPT-1026",
    facility: "Biryogo Health Center",
    district: "Nyarugenge",
    categories: ["Vaccination"],
    summary: "Measles catch-up campaign coverage",
    submittedAt: "2026-06-24",
    status: "submitted",
    reviewer: null,
  },
  {
    id: "RPT-1024",
    facility: "Gatenga Health Center",
    district: "Kicukiro",
    categories: ["Nutrition"],
    summary: "Community nutrition screening, southern sectors",
    submittedAt: "2026-06-21",
    status: "approved",
    reviewer: "C. Niyonzima",
  },
  {
    id: "RPT-1021",
    facility: "Kacyiru District Hospital",
    district: "Gasabo",
    categories: ["TB"],
    summary: "TB case-notification quarterly summary",
    submittedAt: "2026-06-18",
    status: "rejected",
    reviewer: "A. Uwase",
  },
  {
    id: "RPT-1019",
    facility: "Muhima Hospital",
    district: "Nyarugenge",
    categories: ["Maternal", "Referral"],
    summary: "Obstetric referral outcomes, May–June",
    submittedAt: "2026-06-15",
    status: "approved",
    reviewer: "J. Mugisha",
  },
  {
    id: "RPT-1017",
    facility: "Masaka Hospital",
    district: "Kicukiro",
    categories: ["HIV"],
    summary: "ART retention cohort update",
    submittedAt: "2026-06-12",
    status: "submitted",
    reviewer: "C. Niyonzima",
  },
];

const STATUS_VARIANT = {
  draft: "outline",
  submitted: "secondary",
  approved: "default",
  rejected: "destructive",
} as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/*
 * Extension point: columns. Each cell owns its typography — mono for IDs and
 * dates, medium for the primary entity, badges for enums, truncated muted
 * text for long descriptions.
 */
const COLUMNS: Array<ColumnDef<Report>> = [
  {
    /* Extension point: the selection column — remove it for read-only tables */
    id: "select",
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
        className="block"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className="block"
      />
    ),
    size: 36,
  },
  {
    accessorKey: "id",
    header: "Report ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-[11px]">{String(getValue())}</span>
    ),
    size: 90,
  },
  {
    accessorKey: "facility",
    header: "Facility",
    cell: ({ getValue }) => (
      <span className="text-[12px] font-medium">{String(getValue())}</span>
    ),
    size: 180,
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ getValue }) => (
      <span className="text-[11px]">{String(getValue())}</span>
    ),
    size: 90,
  },
  {
    accessorKey: "categories",
    header: "Categories",
    enableSorting: false,
    cell: ({ getValue }) => (
      <div className="flex flex-wrap gap-0.5">
        {(getValue() as Array<string>).map((c) => (
          <Badge key={c} variant="ghost" className="border-border bg-input/20">
            {c}
          </Badge>
        ))}
      </div>
    ),
    size: 110,
  },
  {
    accessorKey: "summary",
    header: "Summary",
    enableSorting: false,
    cell: ({ getValue }) => (
      <span
        /* foreground/70, not muted-foreground: stays AA on accent-tinted rows */
        className="block max-w-[220px] truncate text-[11px] text-foreground/70"
        title={String(getValue())}
      >
        {String(getValue())}
      </span>
    ),
    size: 220,
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ getValue }) => (
      <span className="font-mono text-[11px]">
        {formatDate(String(getValue()))}
      </span>
    ),
    size: 100,
    sortDescFirst: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as Report["status"];
      return (
        <Badge variant={STATUS_VARIANT[status]} className="capitalize">
          {status}
        </Badge>
      );
    },
    size: 90,
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ getValue }) => {
      const name = getValue() as string | null;
      return name ? (
        <span className="text-[11px]">{name}</span>
      ) : (
        <span className="text-[11px] text-foreground/70 italic">Unassigned</span>
      );
    },
    size: 110,
  },
];

interface RichTableProps {
  data: Array<Report>;
  /* Extension point: row navigation */
  onOpen?: (report: Report) => void;
  /* Extension point: bulk mutations — omit and the bar shows export only */
  onSetStatus?: (ids: Array<string>, status: Report["status"]) => void;
}

export function RichTable({ data, onOpen, onSetStatus }: RichTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "submittedAt", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns: COLUMNS,
    state: { sorting, rowSelection, pagination },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

  const selectedRows = table.getSelectedRowModel().rows;

  return (
    /* Drop the provider if your app already mounts one at the root */
    <TooltipProvider>
      <div className="flex min-h-0 flex-1 flex-col rounded-md border border-border">
        <TableSelectionBar
          count={selectedRows.length}
          onClear={() => table.resetRowSelection()}
        >
          <Button
            size="xs"
            variant="ghost"
            className="h-6 gap-1 text-[11px]"
            onClick={() =>
              exportRowsToCsv(
                selectedRows.map((r) => r.original),
                [
                  { header: "id", value: (r) => r.id },
                  { header: "facility", value: (r) => r.facility },
                  { header: "district", value: (r) => r.district },
                  { header: "categories", value: (r) => r.categories },
                  { header: "submittedAt", value: (r) => r.submittedAt },
                  { header: "status", value: (r) => r.status },
                ],
                "reports-export",
              )
            }
          >
            <DownloadSimpleIcon size={12} />
            Export CSV
          </Button>

          {/*
           * Extension point: a Radix Select inside the bar. blurFocusedRowControl
           * (from the package) prevents a focus trap when the Select opens while
           * a row checkbox holds focus — keep it on every Select trigger here.
           */}
          {onSetStatus && (
            <Select
              value=""
              onValueChange={(status) => {
                onSetStatus(
                  selectedRows.map((r) => r.original.id),
                  status as Report["status"],
                );
                table.resetRowSelection();
              }}
            >
              <SelectTrigger
                size="sm"
                aria-label="Set status"
                onPointerDown={blurFocusedRowControl}
                className="h-6 gap-1 border-0 bg-transparent px-2 text-[11px] font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <TagIcon size={12} />
                <SelectValue placeholder="Set status…" />
              </SelectTrigger>
              <SelectContent>
                {(["draft", "submitted", "approved", "rejected"] as const).map(
                  (s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          )}
        </TableSelectionBar>

        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {table.getRowModel().rows.length === 0 ? (
            <TableEmptyState icon={<FunnelSimpleIcon />} className="py-16">
              No reports match the current filters.
            </TableEmptyState>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="hover:bg-transparent">
                    {hg.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      return (
                        <TableHead
                          key={header.id}
                          style={{ width: header.column.columnDef.size }}
                          className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase select-none"
                        >
                          {header.isPlaceholder ? null : canSort ? (
                            /* Sortable headers are buttons — keyboard reachable */
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="flex cursor-pointer items-center gap-1 uppercase hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              <SortIndicator
                                direction={header.column.getIsSorted()}
                              />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                    <TableHead className="w-0">
                      <span className="sr-only">Row actions</span>
                    </TableHead>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    onClick={() => onOpen?.(row.original)}
                    className={cn(
                      "group relative",
                      onOpen && "cursor-pointer",
                      /*
                       * Extension point: row accents. Map your domain flags to
                       * tokenized treatments — never hard-coded colors.
                       */
                      row.original.urgent && "bg-destructive/5",
                      row.original.overdue && "border-l-2 border-l-destructive",
                      row.getIsSelected() && "bg-primary/5",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {/* Extension point: hover row actions — revealed on group-hover */}
                    <TableCell className="w-0 py-2">
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {onOpen && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpen(row.original);
                                }}
                                className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/30 transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                              >
                                <FolderOpenIcon size={11} />
                                Open
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="text-[10px]">
                              Open report
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Swap for TableFooterCount if the table doesn't paginate */}
        <TablePagination
          pageIndex={pagination.pageIndex}
          pageCount={table.getPageCount()}
          onPageChange={table.setPageIndex}
          pageSize={pagination.pageSize}
          onPageSizeChange={table.setPageSize}
        >
          <span>
            {data.length} reports
            {selectedRows.length > 0 && ` · ${selectedRows.length} selected`}
          </span>
        </TablePagination>
      </div>
    </TooltipProvider>
  );
}

/* Storybook block — delete everything below when copying into an app */

const meta = {
  title: "Recipes/Rich Table",
  component: RichTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Copy-paste recipe for the eRadia-worklist table look. CurrantUI ships the presentation primitives (`Table`, `SortIndicator`, `TableSelectionBar`, `TableEmptyState`, `TableFooterCount`, `exportRowsToCsv`); sorting and selection state are wired with TanStack Table in your app. View this file's source for the full recipe — extension points are marked with comments.",
      },
    },
  },
  args: {
    data: REPORTS,
    onOpen: fn(),
    onSetStatus: fn(),
  },
} satisfies Meta<typeof RichTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The polished default: sortable headers, selection, bulk bar, hover actions, footer. */
export const Default: Story = {};

const PAGE_SIZE = 5;

/**
 * Every extension point engaged, verified by interaction: select-all reveals
 * the bulk bar (page-scoped, so it selects the current page's rows); the bulk
 * Select mutates and clears; pagination pages through; row accents come from
 * domain flags (urgent/overdue rows in the placeholder data).
 */
export const ExtensionPoints: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("checkbox", { name: "Select all" }));
    await expect(canvas.getByText(`${PAGE_SIZE} selected`)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("combobox", { name: "Set status" }));
    const listbox = within(canvasElement.ownerDocument.body);
    await userEvent.click(listbox.getByRole("option", { name: "approved" }));
    await expect(args.onSetStatus).toHaveBeenCalledOnce();

    /* mutation clears the selection, hiding the bar */
    await expect(
      canvas.queryByText(`${PAGE_SIZE} selected`),
    ).not.toBeInTheDocument();

    /* pagination pages through the remaining rows */
    const pageCount = Math.ceil(REPORTS.length / PAGE_SIZE);
    await expect(canvas.getByText(`Page 1 of ${pageCount}`)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(canvas.getByText(`Page 2 of ${pageCount}`)).toBeInTheDocument();
  },
};

/** Zero rows → TableEmptyState fills the body. */
export const Empty: Story = {
  args: { data: [] },
};
