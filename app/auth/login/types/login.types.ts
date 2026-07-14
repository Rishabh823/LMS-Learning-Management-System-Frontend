export interface LoginPayload {
  emailId: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  organizationId: number;
  role: "ADMIN" | "STUDENT" | "TRAINER" | "ORGANIZATION" | "EXTERNALEXAMINEE";
  contact: string;
  profilePic: string | null;
  name: string;
  userId: string;
  email: string;
  status: string;
  message?: string;
  [key: string]: unknown;
}
