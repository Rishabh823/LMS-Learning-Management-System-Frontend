"use client";

import { useEffect, useState } from "react";
import { useApiQuery } from "@/services/useApiQuery";
import { useApiMutation } from "@/services/useApiMutation";
import { successMsg } from "@/utils/notify";
import { useAuthToken } from "@/utils/useAuthToken";
import { PROFILEPIC } from "../api/user.api";

export const useProfilePic = (userId: string | null) => {
  const token = useAuthToken();

  const {
    data: blob,
    isLoading: isLoadingPicture,
    refetch,
  } = useApiQuery<Blob>({
    endpoint: userId ? PROFILEPIC(userId) : "",
    method: "GET",
    queryKey: ["profile-pic", userId],
    enabled: !!userId && !!token,
    config: { responseType: "blob" },
  });

  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob || blob.size === 0) {
      setPictureUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    setPictureUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);

  const { mutate, isPending: isUploading } = useApiMutation({
    queryKey: [["users"], ["user-details"], ["profile-pic"]],
  });

  const uploadPicture = (userIdToUpdate: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    mutate(
      {
        method: "put",
        endpoint: PROFILEPIC(userIdToUpdate),
        body: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      },
      {
        onSuccess: () => {
          successMsg("Profile picture updated successfully.");
          refetch();
        },
      },
    );
  };

  return { pictureUrl, isLoadingPicture, uploadPicture, isUploading };
};
