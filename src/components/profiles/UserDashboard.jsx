"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------- MembershipCard -------------------- */
function MembershipCard({
  status = "Active",
  renewalDate = null, // ISO string or null
  billingCycleDays = 30,
  onRenew = () => {},
  onManage = () => {},
}) {
  const { daysLeft, pctElapsed, renewalLabel, state } = useMemo(() => {
    const now = new Date();
    const r = renewalDate ? new Date(renewalDate) : null;
    const renewalLabel =
      r && !Number.isNaN(r.getTime()) ? r.toLocaleDateString() : "—";
    const daysLeft = r
      ? Math.ceil(
          (r.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        )
      : null;
    const boundedDaysLeft = typeof daysLeft === "number" ? daysLeft : null;
    const pctElapsed =
      boundedDaysLeft == null
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              Math.round(
                ((billingCycleDays - Math.max(0, boundedDaysLeft)) /
                  billingCycleDays) *
                  100
              )
            )
          );
    const state =
      boundedDaysLeft == null
        ? "unknown"
        : boundedDaysLeft < 0
        ? "expired"
        : boundedDaysLeft <= 7
        ? "expiring"
        : "active";
    return { daysLeft: boundedDaysLeft, pctElapsed, renewalLabel, state };
  }, [renewalDate, billingCycleDays]);

  const badgeClasses =
    state === "expired"
      ? "bg-red-100 text-red-700"
      : state === "expiring"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="rounded-xl border-l-4 border-prestigeTeal/80 shadow-sm bg-white dark:bg-gray-900 p-4">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0 bg-prestigeTeal/10 dark:bg-prestigeTeal/20 border border-prestigeTeal/30">
          <svg
            className="w-6 h-6 text-prestigeTeal"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M12 2L3 6v6c0 5 3.7 9.7 9 10 5.3-.3 9-5 9-10V6l-9-4z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 12.5L11 14l4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Membership
              </p>

              <div className="flex items-center gap-2 mt-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{status}</h3>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClasses}`}
                >
                  {state === "expired"
                    ? "Expired"
                    : daysLeft === 0
                    ? "Due today"
                    : daysLeft != null
                    ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                    : "—"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">Renewal</p>
              <p className="text-sm font-medium">{renewalLabel}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${
                  state === "expired"
                    ? "bg-red-500"
                    : state === "expiring"
                    ? "bg-amber-400"
                    : "bg-prestigeTeal"
                }`}
                style={{ width: `${pctElapsed}%` }}
                aria-hidden
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{pctElapsed}% of cycle</span>
              <div className="flex gap-2">
                <button
                  onClick={onRenew}
                  className="px-3 py-1 rounded-md text-sm bg-prestigeTeal text-white hover:opacity-95 focus:outline-none"
                >
                  Renew
                </button>
                <button
                  onClick={onManage}
                  className="px-3 py-1 rounded-md text-sm border bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Modal -------------------- */
function Modal({ open, title, children, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      setTimeout(() => closeBtnRef.current?.focus?.(), 50);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="relative z-10 max-w-lg w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 mx-4"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="modal-title" className="text-lg font-semibold">
                {title}
              </h3>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="ml-auto text-sm text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close dialog"
              >
                Close
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------- ProfileUploader -------------------- */
function ProfileUploader({ preview, onSelect }) {
  const inputRef = useRef(null);

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden flex items-center justify-center border">
        {preview ? (
          typeof preview === "string" && preview.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={preview}
              alt="Profile"
              width={48}
              height={48}
              className="object-cover"
            />
          )
        ) : (
          <span className="text-lg">👤</span>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -right-1 -bottom-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border rounded-full p-1 shadow-sm hover:scale-105 focus:outline-none"
          aria-label="Change profile picture"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4"
            />
          </svg>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

/* -------------------- HoverCard / ProgressCard / AnimatedCard -------------------- */
function HoverCard({
  borderClass = "border-violet-600",
  hoverFrom = "from-violet-600",
  hoverTo = "to-violet-800",
  textClass = "text-white",
  onClick,
  children,
}) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
      className={`group relative rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${borderClass} border-2`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${hoverFrom} ${hoverTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.08) 100%)",
          transform: "skewX(-12deg) translateY(-18%)",
          mixBlendMode: "overlay",
        }}
      />
      <div className={`relative z-10 p-4 ${textClass}`}>{children}</div>
    </div>
  );
}

function ProgressCard({ title, value = 0, subtitle = "", onOpen }) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    const w = Math.max(0, Math.min(100, Number(value) || 0));
    const timeout = setTimeout(() => setAnimatedWidth(w), 120);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative rounded-lg">
      <div className="relative z-10">
        <p className="text-sm font-medium mb-2">{title}</p>
        {subtitle ? (
          <p className="text-sm opacity-90 mb-3">{subtitle}</p>
        ) : null}

        <div className="my-2 w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm font-semibold">
            {Math.round(animatedWidth)}%
          </div>
          <button
            type="button"
            onClick={onOpen}
            className="text-xs font-semibold underline"
            aria-label={`Open details for ${title}`}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------- Main Dashboard -------------------- */
export default function Dashboard() {
  const router = useRouter();

  const [username, setUsername] = useState("lamidUser");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);

  const [progress, setProgress] = useState({
    strength: 0,
    flexibility: 0,
    endurance: 0,
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [email, setEmail] = useState(null);
  const [sessionLabel, setSessionLabel] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const [gender, setGender] = useState(null);

  const [accountStatus, setAccountStatus] = useState("Active");
  const [renewalDate, setRenewalDate] = useState(null);
  const billingCycleDays = 30;

  /* modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error(`Failed to load profile: ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        setUsername(data.username ?? username);
        setProfilePreview(data.profileUrl ?? profilePreview);
        setEmail(data.email ?? null);
        setSessionLabel(
          data.session ??
            (data.classesBooked != null
              ? `Booked: ${data.classesBooked}`
              : data.classesThisMonth != null
              ? `This month: ${data.classesThisMonth}`
              : null)
        );
        setTrainer(data.coachName ?? data.trainer ?? null);
        setGender(data.gender ?? null);
        setAccountStatus(data.accountStatus ?? data.status ?? "Active");
        setRenewalDate(data.renewalDate ?? null);

        if (data.progress) {
          setProgress({
            strength: Number(data.progress.strength) || 0,
            flexibility: Number(data.progress.flexibility) || 0,
            endurance: Number(data.progress.endurance) || 0,
          });
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    }

    async function fetchProgress() {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setProgress((prev) => ({
          strength: prev.strength || Number(data.strength) || 0,
          flexibility: prev.flexibility || Number(data.flexibility) || 0,
          endurance: prev.endurance || Number(data.endurance) || 0,
        }));
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    }

    fetchProfile();
    fetchProgress();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function handleProfileSelect(file) {
    if (!file) {
      setProfileFile(null);
      setProfilePreview(null);
      return;
    }
    const valid = file.type && file.type.startsWith("image/");
    if (!valid) {
      setStatus({ success: false, message: "Please select an image file." });
      return;
    }
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = (e) =>
      setProfilePreview(
        typeof e.target.result === "string" ? e.target.result : null
      );
    reader.readAsDataURL(file);
  }

  async function uploadProfile() {
    if (!profileFile) return null;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", profileFile);
      const res = await fetch("/api/upload-profile", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();
      return data.url ?? null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveCredentials(e) {
    e.preventDefault();
    setStatus(null);

    if (password && password.length > 0 && password.length < 8) {
      setStatus({
        success: false,
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    try {
      const uploadedUrl = await (profileFile
        ? uploadProfile()
        : Promise.resolve(null));
      const payload = {
        username,
        ...(password ? { password } : {}),
        ...(uploadedUrl ? { profileUrl: uploadedUrl } : {}),
      };

      const res = await fetch("/api/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(txt || `Update failed ${res.status}`);
      }

      const updated = await res.json();
      setUsername(updated.username ?? username);
      if (updated.profileUrl) setProfilePreview(updated.profileUrl);
      if (updated.accountStatus) setAccountStatus(updated.accountStatus);
      if (updated.renewalDate) setRenewalDate(updated.renewalDate);

      setProfileFile(null);
      setPassword("");
      setEditing(false);
      setStatus({ success: true, message: "Profile updated." });
    } catch (err) {
      console.error("Save error", err);
      setStatus({ success: false, message: err?.message || "Save failed." });
    }
  }

  function openCardModal(title, bodyNode) {
    setModalTitle(title);
    setModalBody(bodyNode);
    setModalOpen(true);
  }

  function openProgressModal(type) {
    const value = progress[type] ?? 0;
    openCardModal(
      `${type[0].toUpperCase() + type.slice(1)} Details`,
      <div>
        <p className="mb-2">
          Current level: <strong>{value}%</strong>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Recommended next steps:
        </p>
        <ul className="mt-2 list-disc ml-5">
          <li>Attend one targeted session this week</li>
          <li>Focus on progressive overload or mobility drills</li>
          <li>Re-check progress in two weeks</li>
        </ul>
      </div>
    );
  }

  function openPlanModal() {
    openCardModal(
      "Personalized Plan",
      <div>
        <p className="mb-2">
          Generate a 4-week plan tailored to your profile and progress.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This will use your workout type, recent activity and goals.
        </p>
      </div>
    );
  }

  function joinChallenge(id) {
    openCardModal(
      "Weekly Challenge",
      <div>
        <p className="mb-2">Challenge: Attend 3 classes this week</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Joining will track your progress and add you to the leaderboard.
        </p>
        <div className="mt-3">
          <button
            onClick={() => {
              /* TBD: call join endpoint */
            }}
            className="px-3 py-2 rounded-md bg-prestigeTeal text-white"
          >
            Join challenge
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.warn(err);
    }
    router.push("/login");
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white py-10 px-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Avatar & Heading */}
      <div className="flex items-center gap-4 mb-6">
        <ProfileUploader
          preview={profilePreview}
          onSelect={handleProfileSelect}
        />
        <div className="relative inline-block text-left overflow-hidden">
          <span className="absolute left-1 top-0 text-red-500 opacity-40 animate-glitch select-none pointer-events-none">
            WELCOME BACK, {String(username).toUpperCase()}
          </span>
          <span className="absolute left-0 top-1 text-blue-500 opacity-40 animate-glitch delay-150 select-none pointer-events-none">
            WELCOME BACK, {String(username).toUpperCase()}
          </span>
          <h1 className="relative z-10 text-2xl font-extrabold uppercase animate-glitch">
            WELCOME BACK, {String(username).toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Membership card */}
      <div className="mb-6">
        <MembershipCard
          status={accountStatus}
          renewalDate={renewalDate}
          billingCycleDays={billingCycleDays}
          onRenew={() =>
            openCardModal(
              "Renew membership",
              <p className="text-sm">Renew flow goes here.</p>
            )
          }
          onManage={() => router.push("/billing")}
        />
      </div>

      {/* Backend-driven profile fields */}
      <div className="border-b border-gray-300 dark:border-gray-700 mb-6 pb-4">
        <p className="text-lg font-medium">
          Email:{" "}
          <span className="text-green-600 dark:text-green-400 font-semibold">
            {email ?? "—"}
          </span>
        </p>
        <p className="text-lg font-medium">
          Session:{" "}
          <span className="text-green-600 dark:text-green-400 font-semibold">
            {sessionLabel ?? "—"}
          </span>
        </p>
        <p className="text-lg font-medium">
          Trainer:{" "}
          <span className="text-green-600 dark:text-green-400 font-semibold">
            {trainer ?? "—"}
          </span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gender: <span className="font-semibold">{gender ?? "—"}</span>
        </p>
      </div>

      {/* Editable Credentials */}
      <div className="mb-6">
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
        >
          {editing ? "Cancel Edit" : "Edit Username & Profile"}
        </button>

        {editing && (
          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 characters to change password.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="bg-prestigeTeal text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setStatus(null);
                  setProfileFile(null);
                  setPassword("");
                }}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
            </div>

            {uploading && (
              <p className="text-sm text-gray-500">
                Uploading profile picture...
              </p>
            )}
            {status && (
              <p
                className={`text-sm mt-2 ${
                  status.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Progress / Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimatedCard>
          <HoverCard
            borderClass="border-violet-500"
            hoverFrom="from-violet-600"
            hoverTo="to-violet-800"
            textClass="text-white"
            onClick={() => openProgressModal("strength")}
          >
            <ProgressCard
              title="Strength Progress"
              value={progress.strength}
              subtitle="Strength Level"
              onOpen={() => openProgressModal("strength")}
            />
          </HoverCard>
        </AnimatedCard>

        <AnimatedCard>
          <HoverCard
            borderClass="border-emerald-400"
            hoverFrom="from-emerald-400"
            hoverTo="to-emerald-600"
            textClass="text-white"
            onClick={openPlanModal}
          >
            <div className="relative z-10">
              <h4 className="font-semibold">Personalized Plan</h4>
              <p className="text-sm mt-1 opacity-90">
                AI-generated 4-week program
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPlanModal();
                }}
                className="mt-3 inline-block px-3 py-2 rounded-md bg-white/10 text-white text-sm font-semibold hover:bg-white/20"
              >
                Generate Plan
              </button>
            </div>
          </HoverCard>
        </AnimatedCard>

        <AnimatedCard>
          <HoverCard
            borderClass="border-amber-400"
            hoverFrom="from-amber-400"
            hoverTo="to-amber-600"
            textClass="text-black"
            onClick={() => joinChallenge("weekly-3")}
          >
            <div className="relative z-10">
              <h4 className="font-semibold">Weekly Challenge</h4>
              <p className="text-sm mt-1 opacity-90">
                Join now: Attend 3 classes this week
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  joinChallenge("weekly-3");
                }}
                className="mt-2 inline-block px-3 py-2 rounded-md bg-black/5 text-black text-sm font-semibold hover:bg-black/10"
              >
                Join
              </button>
            </div>
          </HoverCard>
        </AnimatedCard>
      </div>

      {/* Help & Logout */}
      <div className="mt-6 flex justify-between items-center">
        <Link
          href="/contact"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Need Help?
        </Link>
        <button onClick={handleLogout} className="text-red-600 hover:underline">
          Logout
        </button>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      >
        {modalBody}
      </Modal>
    </div>
  );
}
