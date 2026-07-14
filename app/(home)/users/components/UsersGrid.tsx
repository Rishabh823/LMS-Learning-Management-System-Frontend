"use client";

import { Users } from "lucide-react";
import Loader from "@/ui/Loader";
import UserCard from "./UserCard";
import type { AppUser } from "../types/user.types";

const UsersGrid = ({
  users,
  isLoading,
  onSelectUser,
}: {
  users: AppUser[];
  isLoading: boolean;
  onSelectUser: (user: AppUser) => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-400">
        <Users size={28} />
        <p className="text-sm">No users found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user.userId}
          user={user}
          onClick={() => onSelectUser(user)}
        />
      ))}
    </div>
  );
};

export default UsersGrid;
