"use client";

import { useEffect, useState, useMemo } from "react";

export default function Notifications() {
  const [tab, setTab] = useState("compose"); // compose | inbox | sent | payments
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // compose state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("in-app"); // in-app, email, sms
  const [audienceType, setAudienceType] = useState("all"); // all | segment | userIds
  const [audienceIds, setAudienceIds] = useState("");
  const [sendAt, setSendAt] = useState("");

  // payment state
  const [paymentUsers, setPaymentUsers] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [dueDate, setDueDate] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  // inbox/sent
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [inboxMeta, setInboxMeta] = useState({
    total: 0,
    offset: 0,
    limit: 50,
  });
  const [sentMeta, setSentMeta] = useState({ total: 0, offset: 0, limit: 50 });

  // message responder & confirm
  const [replyText, setReplyText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    action: null,
    label: "",
  });

  // helper: safe fetch + json
  const safeFetchJson = async (url, opts = {}) => {
    const res = await fetch(url, opts);
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
    return json;
  };

  useEffect(() => {
    if (tab === "inbox") fetchInbox();
    if (tab === "sent") fetchSent();
  }, [tab]);

  // fetch inbox
  const fetchInbox = async (offset = 0) => {
    setLoading(true);
    setStatus(null);
    try {
      const q = new URLSearchParams({
        status: "all",
        limit: inboxMeta.limit,
        offset,
      });
      const json = await safeFetchJson(
        `/api/admin/user-messages?${q.toString()}`
      );
      setInbox(Array.isArray(json.messages) ? json.messages : []);
      setInboxMeta((m) => ({ ...m, total: json.total || 0, offset }));
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // fetch sent
  const fetchSent = async (offset = 0) => {
    setLoading(true);
    setStatus(null);
    try {
      const q = new URLSearchParams({
        type: "sent",
        status: "all",
        limit: sentMeta.limit,
        offset,
      });
      const json = await safeFetchJson(
        `/api/admin/notifications?${q.toString()}`
      );
      setSent(Array.isArray(json.notifications) ? json.notifications : []);
      setSentMeta((m) => ({ ...m, total: json.total || 0, offset }));
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // clear compose
  const clearCompose = () => {
    setTitle("");
    setBody("");
    setChannel("in-app");
    setAudienceType("all");
    setAudienceIds("");
    setSendAt("");
    setStatus(null);
  };

  // send/schedule notification
  const handleSendNotification = async (e) => {
    e?.preventDefault();
    setStatus(null);
    if (!title.trim() || !body.trim()) {
      setStatus({ type: "error", text: "Title and body are required." });
      return;
    }
    if (audienceType === "userIds" && !audienceIds.trim()) {
      setStatus({
        type: "error",
        text: "Provide at least one user id in audience.",
      });
      return;
    }
    const audience = { type: audienceType };
    if (audienceType === "userIds") {
      audience.ids = audienceIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const payload = {
      title: title.trim(),
      body: body.trim(),
      audience,
      channel,
      sendAt: sendAt ? new Date(sendAt).toISOString() : undefined,
    };
    setLoading(true);
    try {
      const json = await safeFetchJson("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: body.trim(),
          channel, // e.g. "email", "sms", "both"
          schedule: sendAt ? sendAt : "now", // backend expects "now" or date string
          audience:
            audienceType === "all"
              ? "all-users"
              : audienceType === "segment"
              ? "all-trainers" // adjust if needed
              : audienceType === "userIds"
              ? "user"
              : "all-users",
          id: audienceIds || undefined, // optional user/trainer ID
        }),
      });

      setStatus({
        type: "success",
        text: json.message || "Notification scheduled/sent.",
      });
      clearCompose();
      if (tab === "sent") fetchSent();
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // send payment notifications
  const handleSendPayment = async (e) => {
    e?.preventDefault();
    setStatus(null);
    if (!paymentUsers.trim() || !amount) {
      setStatus({ type: "error", text: "User ids and amount are required." });
      return;
    }
    const userIds = paymentUsers
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      userIds,
      amount: Number(amount),
      currency,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      note: paymentNote,
    };
    setLoading(true);
    try {
      const json = await safeFetchJson("/api/admin/notifications/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus({
        type: "success",
        text: json.message || "Payment notifications queued.",
      });
      setPaymentUsers("");
      setAmount("");
      setDueDate("");
      setPaymentNote("");
      if (tab === "sent") fetchSent();
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // reply to user message
  const handleReplyMessage = async () => {
    if (!selectedMessage || !replyText.trim()) {
      setStatus({ type: "error", text: "Reply text required." });
      return;
    }
    setLoading(true);
    try {
      const json = await safeFetchJson("/api/admin/user-messages/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          response: replyText.trim(),
          markResolved: true,
        }),
      });
      setStatus({ type: "success", text: json.message || "Replied to user." });
      setReplyText("");
      setSelectedMessage(null);
      fetchInbox(inboxMeta.offset);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // confirm modal: setConfirm({ open:true, id, action, label })
  const confirmAction = (id, action) => {
    const label =
      action === "delete"
        ? "Delete permanently"
        : action === "suspend"
        ? "Suspend account"
        : "Reactivate account";
    setConfirm({ open: true, id, action, label });
  };

  // perform generic actions: delete from inbox or manage user (suspend/reactivate)
  const performAction = async () => {
    if (!confirm.id || !confirm.action) return;
    setLoading(true);
    setStatus(null);
    try {
      let res;
      if (confirm.action === "delete") {
        // delete a user message if it exists in inbox, otherwise try deleting a notification
        res = await fetch(
          `/api/admin/delete-user-message?id=${encodeURIComponent(confirm.id)}`,
          { method: "DELETE" }
        );
      } else if (confirm.action === "suspend") {
        res = await fetch(`/api/admin/suspend-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: confirm.id }),
        });
      } else if (confirm.action === "reactivate") {
        res = await fetch(`/api/admin/reactivate-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: confirm.id }),
        });
      } else {
        // fallback: try notifications delete endpoint
        res = await fetch(
          `/api/admin/notifications/delete?id=${encodeURIComponent(
            confirm.id
          )}`,
          { method: "DELETE" }
        );
      }
      const json = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(json?.message || `Action failed (${res.status})`);
      setStatus({
        type: "success",
        text: json?.message || "Action completed.",
      });
      setConfirm({ open: false, id: null, action: null, label: "" });
      fetchInbox(inboxMeta.offset);
      fetchSent(sentMeta.offset);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
      setConfirm({ open: false, id: null, action: null, label: "" });
    } finally {
      setLoading(false);
    }
  };

  // CSV export helper
  const exportMessagesCSV = (list, filename = "messages.csv") => {
    if (!Array.isArray(list) || list.length === 0) return;
    const rows = [
      ["id", "user", "email", "type", "status", "subject", "body", "createdAt"],
    ];
    list.forEach((m) =>
      rows.push([
        m.id,
        m.username || m.userId || "",
        m.email || "",
        m.type || "",
        m.status || "",
        m.subject || "",
        m.body || "",
        m.createdAt || "",
      ])
    );
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
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const audiencePreview = useMemo(() => {
    if (audienceType === "all") return "All users";
    if (audienceType === "segment")
      return "Audience segment (implement on backend)";
    if (audienceType === "userIds")
      return (
        audienceIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 5)
          .join(", ") || "No ids"
      );
    return "";
  }, [audienceType, audienceIds]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <nav className="space-x-2">
          <button
            onClick={() => setTab("compose")}
            className={`px-3 py-1 rounded ${
              tab === "compose" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setTab("inbox")}
            className={`px-3 py-1 rounded ${
              tab === "inbox" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setTab("sent")}
            className={`px-3 py-1 rounded ${
              tab === "sent" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setTab("payments")}
            className={`px-3 py-1 rounded ${
              tab === "payments" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Payments
          </button>
        </nav>
      </header>

      {status && (
        <div
          className={`p-2 rounded ${
            status.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {status.text}
        </div>
      )}

      {tab === "compose" && (
        <section className="bg-blue-400 p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Compose Notification</h2>
          <form onSubmit={handleSendNotification} className="space-y-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full border px-2 py-1 rounded"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Message body"
              rows={4}
              className="w-full border px-2 py-1 rounded"
            />
            <div className="flex gap-2">
              <label className="flex-1">
                Channel
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="in-app">In‑app popup</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </label>
              <label className="flex-1">
                Audience
                <select
                  value={audienceType}
                  onChange={(e) => setAudienceType(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="all-users">All Users</option>
                  <option value="all-trainers">All Trainers</option>
                  <option value="user">Specific User</option>
                  <option value="trainer">Specific Trainer</option>
                </select>
              </label>
            </div>
            {(audienceType === "user" || audienceType === "trainer") && (
              <input
                value={audienceIds}
                onChange={(e) => setAudienceIds(e.target.value)}
                placeholder="Enter User or Trainer ID"
                className="w-full border px-2 py-1 rounded"
              />
            )}

            <div className="flex gap-2 items-center">
              <label className="flex-1">
                Schedule (optional)
                <input
                  type="datetime-local"
                  value={sendAt}
                  onChange={(e) => setSendAt(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </label>
              <div className="text-sm text-gray-600">
                Preview: {audiencePreview}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                Send / Schedule
              </button>
              <button
                type="button"
                onClick={clearCompose}
                className="px-4 py-2 rounded border"
              >
                Clear
              </button>
            </div>
          </form>
        </section>
      )}

      {tab === "payments" && (
        <section className="bg-blue-400 p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Send Payment Notification</h2>
          <form onSubmit={handleSendPayment} className="space-y-2">
            <input
              value={paymentUsers}
              onChange={(e) => setPaymentUsers(e.target.value)}
              placeholder="Comma separated user ids"
              className="w-full border px-2 py-1 rounded"
            />
            <div className="flex gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                className="w-32 border px-2 py-1 rounded"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option>USD</option>
                <option>NGN</option>
                <option>EUR</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="Optional note"
              rows={3}
              className="w-full border px-2 py-1 rounded"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                Send Payments
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentUsers("");
                  setAmount("");
                  setDueDate("");
                  setPaymentNote("");
                }}
                className="px-4 py-2 rounded border"
              >
                Clear
              </button>
            </div>
          </form>
        </section>
      )}

      {tab === "inbox" && (
        <section className="bg-blue-400 p-4 rounded shadow space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">User Messages & Complaints</h2>
            <div className="flex gap-2">
              <button
                onClick={() => exportMessagesCSV(inbox, "inbox.csv")}
                className="px-3 py-1 rounded border"
              >
                Export CSV
              </button>
              <button
                onClick={() => fetchInbox()}
                className="px-3 py-1 rounded border"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && <p>Loading messages…</p>}
          {!loading && inbox.length === 0 && (
            <p className="text-sm text-gray-500">No messages.</p>
          )}
          <div className="space-y-2">
            {inbox.map((m) => (
              <div key={m.id} className="p-3 border rounded">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-sm">
                      {m.username || m.userId}
                    </p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                    <p className="text-xs text-gray-500">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleString()
                        : ""}
                    </p>
                    <p className="mt-2 text-sm">
                      {m.subject ? <strong>{m.subject}: </strong> : null}
                      {m.body}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedMessage(m);
                        setReplyText("");
                      }}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => confirmAction(m.id, "delete")}
                      className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedMessage && (
            <div className="mt-3 p-3 border rounded bg-gray-50">
              <h3 className="font-semibold">
                Reply to {selectedMessage.username || selectedMessage.userId}
              </h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                className="w-full border px-2 py-1 rounded"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReplyMessage}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  disabled={loading}
                >
                  Send Reply
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-3 py-1 rounded border"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === "sent" && (
        <section className="bg-blue-400 p-4 rounded shadow space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Sent Notifications</h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  exportMessagesCSV(sent, "sent_notifications.csv")
                }
                className="px-3 py-1 rounded border"
              >
                Export CSV
              </button>
              <button
                onClick={() => fetchSent()}
                className="px-3 py-1 rounded border"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && <p>Loading…</p>}
          {!loading && sent.length === 0 && (
            <p className="text-sm text-gray-500">No sent notifications.</p>
          )}
          <div className="space-y-2">
            {sent.map((n) => (
              <div key={n.id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-xs text-gray-500">
                      {n.channel} • {n.audience?.type || "audience"}
                    </p>
                    <p className="text-sm mt-2">{n.body}</p>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>
                      {n.scheduledAt
                        ? `Scheduled: ${new Date(
                            n.scheduledAt
                          ).toLocaleString()}`
                        : ""}
                    </div>
                    <div>
                      {n.sentAt
                        ? `Sent: ${new Date(n.sentAt).toLocaleString()}`
                        : ""}
                    </div>
                    <div className="mt-2">{n.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirm Modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setConfirm({ open: false, id: null, action: null, label: "" })
            }
          />
          <div className="relative bg-blue-400 dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">{confirm.label}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to {confirm.action} this item?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setConfirm({ open: false, id: null, action: null, label: "" })
                }
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={performAction}
                className="px-3 py-1 rounded bg-red-600 text-white"
                disabled={loading}
              >
                {loading
                  ? "Working..."
                  : confirm.action === "delete"
                  ? "Delete"
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
