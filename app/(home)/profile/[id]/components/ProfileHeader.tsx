"use client";

import { useRef } from "react";
import { Camera, Mail, Phone, Building2, Pencil } from "lucide-react";
import Button from "@/ui/Button";
import Loader from "@/ui/Loader";
import type { UserDetail } from "@/app/(home)/users/types/user.types";

const ProfileHeader = ({
  user,
  pictureUrl,
  isLoadingPicture,
  onUpload,
  isUploading,
  onEdit,
}: {
  user: UserDetail;
  pictureUrl: string | null;
  isLoadingPicture: boolean;
  onUpload: (file: File) => void;
  isUploading: boolean;
  onEdit: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="relative shrink-0">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-sky-500 to-sky-600 text-2xl font-bold text-white">
            {isLoadingPicture ? (
              <Loader />
            ) : pictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pictureUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              user.name?.[0]?.toUpperCase() || "?"
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white shadow-sm transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            aria-label="Change profile picture"
          >
            <Camera size={13} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex flex-col items-center gap-1.5 sm:items-start">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <p className="text-lg font-bold text-slate-900">{user.name}</p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                user.status
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {user.status ? "Active" : "Inactive"}
            </span>
          </div>
          <span className="w-fit rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600">
            {user.role}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-500 sm:justify-start">
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {user.emailId}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> {user.contactNo}
            </span>
            {user.organization && (
              <span className="flex items-center gap-1.5">
                <Building2 size={13} /> {user.organization.fullName}
              </span>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={onEdit}
        className="flex shrink-0 items-center justify-center gap-1.5 rounded-md px-4 py-2.5"
      >
        <Pencil size={14} /> Edit Profile
      </Button>
    </div>
  );
};

export default ProfileHeader;
