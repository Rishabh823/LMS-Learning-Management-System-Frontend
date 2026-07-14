import { Suspense } from "react";
import ChoosePathView from "../login/components/ChoosePathView";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <ChoosePathView />
    </Suspense>
  );
}
