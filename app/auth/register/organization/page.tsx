import { Suspense } from "react";
import OrgOnboard from "../components/OrgOnboard";

export default function OrganizationRegisterPage() {
  return (
    <Suspense fallback={null}>
      <OrgOnboard />
    </Suspense>
  );
}
