"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Loader from "@/ui/Loader";
import Button from "@/ui/Button";
import PlanCard from "@/shared/subscription/PlanCard";
import ZenithLogo from "@/public/zenith guard transparent logo.png";
import { usePricingPlans } from "../hooks/usePricingPlans";

const FEATURED_PLAN_CODE = "PREMIUM";

const PricingPage = () => {
  const router = useRouter();
  const { plans, isLoading } = usePricingPlans();

  // Send them to the role chooser first (learner / trainer / organization) —
  // the plan only actually applies to the organization signup flow, which
  // picks it back up from this query param and skips its own plan step.
  const goToRegister = (planId: number) =>
    router.push(`/auth/register?planId=${planId}`);

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-50 via-white to-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600">
            <Image
              src={ZenithLogo}
              alt="ZenithLMS Logo"
              className="h-5 w-5 object-contain brightness-0 invert"
              width={20}
              height={20}
            />
          </div>
          <span className="text-lg font-bold text-slate-800">ZenithLMS</span>
        </Link>
        <Button
          variant="clear"
          className="rounded-md px-5 py-2"
          onClick={() => router.push("/auth/login")}
        >
          Sign In
        </Button>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-10 pb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
          <ShieldCheck size={14} /> Simple, transparent pricing
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Choose the plan that fits your organization
        </h1>
        <p className="mt-3 text-slate-500">
          Every plan includes secure hosting and updates. Upgrade, downgrade, or
          cancel at any time.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-400">
            <p className="text-sm">No plans are available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.planId}
                plan={plan}
                featured={plan.planCode === FEATURED_PLAN_CODE}
                footer={
                  <Button
                    variant="primary"
                    className="w-full rounded-md py-2.5"
                    onClick={() => goToRegister(plan.planId)}
                  >
                    Get Started
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PricingPage;
