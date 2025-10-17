// AnalyticsPage.jsx
"use client";
import { useEffect, useState, useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function KpiCard({ label, value, delta }) {
  return (
    <div
      className="p-4 bg-white dark:bg-gray-800 rounded shadow"
      role="group"
      aria-label={`${label} KPI`}
    >
      <div className="text-sm text-gray-500 dark:text-gray-300">{label}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </div>
        {delta != null && (
          <div
            className={`text-sm font-medium ${
              delta >= 0 ? "text-green-600" : "text-red-600"
            }`}
            aria-label={`${label} change`}
          >
            {delta >= 0 ? `+${delta}%` : `${delta}%`}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("30");
  const [filters, setFilters] = useState({
    membershipType: "all",
    trainerId: "all",
  });
  const [kpis, setKpis] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [cohorts, setCohorts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [range, filters]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        days: range,
        membershipType: filters.membershipType,
        trainerId: filters.trainerId,
      });
      const res = await fetch(`/api/analytics/members?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setKpis(data.kpis);
      setTimeSeries(data.timeSeries);
      setBreakdown(data.membershipBreakdown ?? data.timeSeries?.breakdown);
      setCohorts(data.cohorts ?? null);
    } catch (err) {
      console.error("Failed to load analytics", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const rows = [];
    if (timeSeries?.labels) {
      rows.push(["date", "activeMembers", "newSignups", "revenue"]);
      timeSeries.labels.forEach((d, i) => {
        rows.push([
          d,
          timeSeries.activeCounts?.[i] ?? "",
          timeSeries.newSignups?.[i] ?? "",
          timeSeries.revenue?.[i] ?? "",
        ]);
      });
    }
    if (breakdown) {
      rows.push([]);
      rows.push(["membershipType", "count"]);
      Object.entries(breakdown).forEach(([k, v]) => {
        rows.push([k, v?.count ?? v]);
      });
    }
    if (cohorts) {
      rows.push([]);
      rows.push([
        "cohort_start",
        ...cohorts[0].retention.map((_, i) => `D+${i}`),
      ]);
      cohorts.forEach((c) => {
        rows.push([c.start, ...c.retention]);
      });
    }
    if (!rows.length) return;
    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineData = useMemo(() => {
    if (!timeSeries) return null;
    return {
      labels: timeSeries.labels,
      datasets: [
        {
          label: "Active Members",
          data: timeSeries.activeCounts,
          borderColor: "#188db0ff",
          backgroundColor: "rgba(37,99,235,0.08)",
          tension: 0.25,
          pointRadius: 2,
        },
        {
          label: "New Signups",
          data: timeSeries.newSignups,
          borderColor: "#10B981",
          backgroundColor: "rgba(16,185,129,0.06)",
          tension: 0.25,
          pointRadius: 2,
        },
        {
          label: "Revenue",
          data: timeSeries.revenue,
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245,158,11,0.06)",
          tension: 0.25,
          pointRadius: 2,
          yAxisID: "y1",
        },
      ],
    };
  }, [timeSeries]);

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      plugins: { legend: { position: "top" } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Members" } },
        y1: {
          beginAtZero: true,
          position: "right",
          grid: { drawOnChartArea: false },
          title: { display: true, text: "Revenue" },
        },
      },
    }),
    []
  );

  const pieData = useMemo(() => {
    if (!breakdown) return null;
    const labels = Object.keys(breakdown);
    const values = labels.map((k) => breakdown[k]?.count ?? breakdown[k]);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#3B82F6",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
          ],
        },
      ],
    };
  }, [breakdown]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Analytics
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border rounded"
            aria-label="Select time range"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>
          <button
            onClick={downloadCSV}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 rounded"
            aria-label="Export analytics as CSV"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Members"
          value={kpis?.totalMembers ?? "—"}
          delta={kpis?.totalMembersDelta}
        />
        <KpiCard
          label="Active Members"
          value={kpis?.activeMembers ?? "—"}
          delta={kpis?.activeMembersDelta}
        />
        <KpiCard
          label="New Signups"
          value={kpis?.newSignups ?? "—"}
          delta={kpis?.newSignupsDelta}
        />
        <KpiCard
          label="Revenue (period)"
          value={kpis?.revenue ? `$${kpis.revenue}` : "—"}
          delta={kpis?.revenueDelta}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-sm font-medium mb-2">
            Membership, Signups & Revenue
          </h3>
          {loading && <div className="text-sm text-gray-500">Loading…</div>}
          {!loading && !lineData && !error && (
            <div className="text-sm text-gray-500">
              No time‑series data available for this range.
            </div>
          )}
          {lineData && <Line data={lineData} options={lineOptions} />}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-sm font-medium mb-2">Membership Breakdown</h3>
          {pieData ? (
            <div style={{ maxWidth: 300, margin: "0 auto" }}>
              <Pie data={pieData} />
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No breakdown data available.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-sm font-medium mb-2">Retention (cohort‑style)</h3>
        {cohorts && cohorts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th>Cohort</th>
                  {cohorts[0].retention.map((_, idx) => (
                    <th key={idx} className="text-right">{`D+${idx}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.start} className="border-t">
                    <td className="py-2">{c.start}</td>
                    {c.retention.map((r, i) => (
                      <td key={i} className="py-2 text-right">
                        {r == null ? "—" : `${Math.round(r * 100)}%`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            No cohort data available for this range.
          </div>
        )}
      </div>
    </div>
  );
}
