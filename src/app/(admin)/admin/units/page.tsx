import Link from "next/link";

import {
  FormField,
  SelectField,
  AdminTable,
} from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import {
  UNIT_PAGE_SIZE,
  listAdminUnits,
  loadUnitFilterOptions,
  parseUnitListParams,
  unitListHref,
  unitSortValues,
} from "@/lib/admin/units";
import { confidenceValues } from "@/lib/schema";

const SORT_LABELS: Record<(typeof unitSortValues)[number], string> = {
  cluster: "Cluster, then plot",
  plot_number: "Plot number",
  unit_number: "Unit number",
  bua: "BUA",
};

function formatBua(value: number | null): string {
  if (value == null) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function plexLabel(row: {
  plex_size: number;
  range_start: number | null;
  range_end: number | null;
} | null): string {
  if (!row) return "—";
  if (row.range_start != null && row.range_end != null) {
    return `${row.range_start}–${row.range_end} (${row.plex_size})`;
  }
  return String(row.plex_size);
}

export default async function AdminUnitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = parseUnitListParams(raw);

  const [filters, list] = await Promise.all([
    loadUnitFilterOptions(params.clusterSlug),
    listAdminUnits(params),
  ]);

  const totalPages = Math.max(1, Math.ceil(list.count / UNIT_PAGE_SIZE));
  const from = list.count === 0 ? 0 : (params.page - 1) * UNIT_PAGE_SIZE + 1;
  const to = Math.min(params.page * UNIT_PAGE_SIZE, list.count);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Units</h1>
      <p className="mt-2 text-neutral-600">
        Search and filter physical plots. Read-only.
      </p>

      <form
        method="get"
        action="/admin/units"
        className="mt-6 border border-neutral-200 bg-white p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            label="Search"
            name="q"
            defaultValue={params.q}
            hint="Unit number or plot number"
          />
          <SelectField
            label="Cluster"
            name="cluster"
            options={filters.clusters.map((c) => ({
              value: c.slug,
              label: c.name,
            }))}
            defaultValue={params.clusterSlug}
            allowEmpty
            emptyLabel="All clusters"
          />
          <SelectField
            label="Bedrooms"
            name="bedrooms"
            options={filters.bedrooms.map((n) => String(n))}
            defaultValue={
              params.bedrooms != null ? String(params.bedrooms) : ""
            }
            allowEmpty
            emptyLabel="All"
          />
          <SelectField
            label="Facade"
            name="facade"
            options={filters.facades}
            defaultValue={params.facade}
            allowEmpty
            emptyLabel="All"
          />
          <SelectField
            label="Confidence"
            name="confidence"
            options={confidenceValues}
            defaultValue={params.confidence}
            allowEmpty
            emptyLabel="All"
          />
          <SelectField
            label="Sort"
            name="sort"
            options={unitSortValues.map((value) => ({
              value,
              label: SORT_LABELS[value],
            }))}
            defaultValue={params.sort}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button type="submit" size="sm">
            Apply
          </Button>
          <Link
            href="/admin/units"
            className="text-sm text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
          >
            Clear
          </Link>
        </div>
      </form>

      {filters.error ? (
        <p className="mt-4 text-sm text-red-700">{filters.error}</p>
      ) : null}
      {list.error ? (
        <p className="mt-4 text-sm text-red-700">{list.error}</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-neutral-600">
            {list.count === 0
              ? "No units match."
              : `Showing ${from}–${to} of ${list.count}`}
          </p>
          <AdminTable
            headers={[
              "Cluster",
              "Plot",
              "Type",
              "Facade",
              "BUA",
              "TH",
              "Plex",
              "Confidence",
            ]}
          >
            {list.rows.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2">
                  {row.clusters ? (
                    <Link
                      href={`/admin/clusters/${row.cluster_id}`}
                      className="underline underline-offset-2"
                    >
                      {row.clusters.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 tabular-nums">
                  <div>{row.plot_number ?? "—"}</div>
                  {row.unit_number !== String(row.plot_number) ? (
                    <div className="font-mono text-xs text-neutral-500">
                      {row.unit_number}
                    </div>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  {row.unit_types
                    ? `${row.unit_types.bedrooms}BR${
                        row.unit_types.label
                          ? ` ${row.unit_types.label}`
                          : ""
                      }`
                    : "—"}
                  {row.unit_types?.layout ? (
                    <div className="font-mono text-xs text-neutral-500">
                      {row.unit_types.layout}
                    </div>
                  ) : null}
                </td>
                <td className="px-3 py-2">{row.facade_style ?? "—"}</td>
                <td className="px-3 py-2 tabular-nums">
                  {formatBua(row.bua)}
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {row.th_position ?? "—"}
                </td>
                <td className="px-3 py-2">{plexLabel(row.plexes)}</td>
                <td className="px-3 py-2">{row.confidence}</td>
              </tr>
            ))}
          </AdminTable>
          {list.count > UNIT_PAGE_SIZE ? (
            <div className="mt-4 flex items-center gap-4 text-sm">
              {params.page > 1 ? (
                <Link
                  href={unitListHref(params, { page: params.page - 1 })}
                  className="underline underline-offset-2"
                >
                  Previous
                </Link>
              ) : (
                <span className="text-neutral-400">Previous</span>
              )}
              <span className="text-neutral-500">
                Page {params.page} of {totalPages}
              </span>
              {params.page < totalPages ? (
                <Link
                  href={unitListHref(params, { page: params.page + 1 })}
                  className="underline underline-offset-2"
                >
                  Next
                </Link>
              ) : (
                <span className="text-neutral-400">Next</span>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
