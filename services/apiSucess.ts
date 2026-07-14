import { AxiosResponse } from "axios";
import { successMsg } from "../utils/notify";

interface ApiSuccessResponse {
  status?: string;
  message?: string;
  [key: string]: any;
}

export const apiSuccess = (
  response: AxiosResponse<ApiSuccessResponse>,
): AxiosResponse<ApiSuccessResponse> => {
  const { status } = response;

  // Handle success-like HTTP codes: 200 - 399
  switch (status) {
    case 200:
      break;

    case 201:
      successMsg(response.data?.message || "Data Added Successfully");
      break;

    case 202:
      successMsg(response.data?.message || "Data Deleted Successfully");
      break;

    case 204:
      successMsg(response.data?.message || "Data Deleted Successfully");
      break;

    default:
      break;
  }

  return response;
};
