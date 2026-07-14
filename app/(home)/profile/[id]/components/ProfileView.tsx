"use client";

import { useState } from "react";
import Loader from "@/ui/Loader";
import { useUserDetail } from "@/app/(home)/users/hooks/useUserDetail";
import { useProfilePic } from "@/app/(home)/users/hooks/useProfilePic";
import ProfileHeader from "./ProfileHeader";
import OnboardingDetails from "./OnboardingDetails";
import EditProfileDialog from "./EditProfileDialog";

const ProfileView = ({ userId }: { userId: string }) => {
  const { user, isLoading } = useUserDetail(userId);
  const { pictureUrl, isLoadingPicture, uploadPicture, isUploading } =
    useProfilePic(userId);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto">
      <ProfileHeader
        user={user}
        pictureUrl={pictureUrl}
        isLoadingPicture={isLoadingPicture}
        onUpload={(file) => uploadPicture(userId, file)}
        isUploading={isUploading}
        onEdit={() => setEditOpen(true)}
      />

      <OnboardingDetails onboarding={user.onboarding} />

      <EditProfileDialog
        userId={editOpen ? userId : null}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
};

export default ProfileView;
