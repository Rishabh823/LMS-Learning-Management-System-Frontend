export interface OrgSubscription {
  subscriptionId: number;
  organizationId: string | number;
  planId: number;
  planName: string;
  planCode: string;
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
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  autoRenew: boolean;
  paymentStatus: string;
  pendingPlanCode: string | null;
  pendingPlanName: string | null;
  pendingPlanEffectiveDate: string | null;
}

export interface OrgSubscriptionResponse {
  data: OrgSubscription;
  message: string;
  status: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  planId: number;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentHistoryItem {
  transactionId: string;
  planName: string;
  planCode: string;
  provider: string;
  providerOrderId: string;
  providerPaymentId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  createdDate: string;
}

export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  message: string;
  status: string;
}
