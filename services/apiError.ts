import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { errorMsg } from "../utils/notify";

export const apiError = (error: AxiosError<any>) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || "An error occurred";
  switch (status) {
    case 400:
      errorMsg(message || "Bad Request");
      break;
    case 403:
      errorMsg(message || "Forbidden");
      break;
    case 404:
      errorMsg(message || "Not Found");
      break;
    case 405:
      errorMsg(message || "Method Not Allowed");
      break;
    case 406:
      errorMsg(message || "Not Acceptable");
      break;
    case 407:
      errorMsg(message || "Proxy Authentication Required");
      break;
    case 408:
      errorMsg(message || "Request Timeout");
      break;
    case 409:
      errorMsg(message || "Conflict");
      break;
    case 410:
      errorMsg(message || "Gone");
      break;
    case 411:
      errorMsg(message || "Length Required");
      break;
    case 412:
      errorMsg(message || "Precondition Failed");
      break;
    case 413:
      errorMsg(message || "Payload Too Large");
      break;
    case 414:
      errorMsg(message || "URI Too Long");
      break;
    case 415:
      errorMsg(message || "Unsupported Media Type");
      break;
    case 417:
      errorMsg(message || "Expectation Failed");
      break;
    case 418:
      errorMsg(message || "I'm a teapot");
      break;
    case 422:
      errorMsg(message || "Unprocessable Entity");
      break;
    case 423:
      errorMsg(message || "Locked");
      break;
    case 424:
      errorMsg(message || "Failed Dependency");
      break;
    case 401:
      if (Cookies.get("token")) {
        // Token was present but got rejected — unexpected session expiry
        errorMsg(message || "Unauthorized");
        Cookies.remove("token");
        if (window.location.pathname !== "/") {
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.replace("/");
            }
          }, 5000);
        }
      }
      // If no token exists, this is a post-logout stale request — silently ignore
      break;

    default:
      errorMsg(message || "Something went wrong");
      break;
  }
};
