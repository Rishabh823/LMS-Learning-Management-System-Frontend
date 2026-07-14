"use client";

import type { AppUser } from "../types/user.types";

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

const avatarColor = (seed: string) => {
  const idx = seed.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const UserCard = ({
  user,
  onClick,
}: {
  user: AppUser;
  onClick: () => void;
}) => {
  const degree = user.usersProfile?.degreeName;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:border-sky-200 hover:shadow-md"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColor(user.name)}`}
      >
        {user.name?.[0]?.toUpperCase() || "?"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-400">{user.emailId}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {user.gender && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
              {user.gender}
            </span>
          )}
          {degree && (
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-sky-600">
              {degree}
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              user.status
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {user.status ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default UserCard;
