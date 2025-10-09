// AnalyticsPage.jsx
"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
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
          >
            {delta >= 0 ? `+${delta}%` : `${delta}%`}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("30"); // days
  const [fromTo, setFromTo] = useState(null); // optional exact range
  const [filters, setFilters] = useState({
    membershipType: "all",
    trainerId: "all",
  });
  const [kpis, setKpis] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [range, filters]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        days: range,
        membershipType: filters.membershipType,
        trainerId: filters.trainerId,
      });
      const res = await fetch(`/api/admin/analytics?${params.toString()}`);
      const data = await res.json();
      // expected shape: { kpis: {...}, timeSeries: { labels:[], activeCounts:[], revenue:[] }, membershipBreakdown: {...} }
      setKpis(data.kpis);
      setTimeSeries(data.timeSeries);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!timeSeries) return;
    const rows = [
      ["date", "activeMembers", "newSignups", "revenue"],
      ...timeSeries.labels.map((d, i) => [
        d,
        timeSeries.activeCounts[i],
        timeSeries.newSignups[i],
        timeSeries.revenue[i],
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineData = timeSeries
    ? {
        labels: timeSeries.labels,
        datasets: [
          {
            label: "Active Members",
            data: timeSeries.activeCounts,
            borderColor: "#2563EB",
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
        ],
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-200 hover:scale-105 cursor-pointer">
          Analytics
        </h2>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border rounded"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>

          <button
            onClick={downloadCSV}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

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
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Membership & Signups
          </h3>
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {lineData && (
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Membership Breakdown
          </h3>
          <div className="text-sm text-gray-500">
            Top membership types and distribution (pie/bar placeholder)
          </div>
          {/* You can add a Pie or Bar here using the data returned from the API */}
          <pre className="mt-3 text-xs text-gray-400">
            {" "}
            {JSON.stringify(timeSeries?.breakdown ?? {}, null, 2)}
          </pre>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          Retention (cohort-style)
        </h3>
        <div className="text-xs text-gray-500">
          Cohort visualization or table goes here — ask for cohort example if
          needed
        </div>
      </div>
    </div>
  );
}
