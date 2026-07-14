export interface SubscriptionPlan {
  planId: number;
  planName: string;
  planCode: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxStudents: number | null;
  maxTrainers: number | null;
  maxCourses: number | null;
  maxGroups: number | null;
  maxAdmins: number | null;
  storageGB: number | null;
  attendanceEnabled: boolean;
  assignmentEnabled: boolean;
  certificateEnabled: boolean;
  liveClassEnabled: boolean;
  discussionForumEnabled: boolean;
  aiEnabled: boolean;
  brandingEnabled: boolean;
  whiteLabelEnabled: boolean;
  customDomainEnabled: boolean;
  status: string;
}

export type PlanFeatureKey =
  | "attendanceEnabled"
  | "assignmentEnabled"
  | "certificateEnabled"
  | "liveClassEnabled"
  | "discussionForumEnabled"
  | "aiEnabled"
  | "brandingEnabled"
  | "whiteLabelEnabled"
  | "customDomainEnabled";

export const PLAN_FEATURE_FLAGS: { key: PlanFeatureKey; label: string }[] = [
  { key: "attendanceEnabled", label: "Attendance Tracking" },
  { key: "assignmentEnabled", label: "Assignments" },
  { key: "certificateEnabled", label: "Certificates" },
  { key: "liveClassEnabled", label: "Live Classes" },
  { key: "discussionForumEnabled", label: "Discussion Forum" },
  { key: "aiEnabled", label: "AI Features" },
  { key: "brandingEnabled", label: "Custom Branding" },
  { key: "whiteLabelEnabled", label: "White Labeling" },
  { key: "customDomainEnabled", label: "Custom Domain" },
];

export type PlanLimitKey =
  | "maxStudents"
  | "maxTrainers"
  | "maxCourses"
  | "maxGroups"
  | "maxAdmins"
  | "storageGB";

export const PLAN_LIMIT_FIELDS: { key: PlanLimitKey; label: string }[] = [
  { key: "maxStudents", label: "Students" },
  { key: "maxTrainers", label: "Trainers" },
  { key: "maxCourses", label: "Courses" },
  { key: "maxGroups", label: "Groups" },
  { key: "maxAdmins", label: "Admins" },
  { key: "storageGB", label: "Storage (GB)" },
];

export const formatPlanPrice = (price: number, currency: string) => {
  if (price === 0) return "Free";
  const symbol = currency === "INR" ? "₹" : currency + " ";
  return `${symbol}${price.toLocaleString("en-IN")}`;
};

export const formatLimit = (value: number | null | undefined) =>
  value == null ? "Unlimited" : value.toLocaleString("en-IN");
