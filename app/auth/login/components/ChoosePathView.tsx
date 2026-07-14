"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AuthWrap from "./AuthWrap";

const PATHS = [
  {
    role: "learner",
    icon: "person-badge",
    color: "#0284c7",
    title: "I'm a Learner",
    desc: "Access courses, take exams, and track your learning progress.",
  },
  {
    role: "trainer",
    icon: "easel2",
    color: "#2563eb",
    title: "I'm a Trainer",
    desc: "Create courses, conduct live training, and manage learners.",
  },
  {
    role: "organization",
    icon: "building",
    color: "#4f46e5",
    title: "I'm an Organization",
    desc: "Set up your organization and manage your entire training program.",
  },
];

const ChoosePathView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  return (
    <AuthWrap wide>
      <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-lg md:p-12">
        <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">
          Create Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Choose how you&rsquo;d like to get started
        </p>
        <div className="mt-8 flex flex-col gap-4">
          {PATHS.map((p) => (
            <button
              key={p.role}
              className="group flex items-center gap-4 rounded-xl border border-sky-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
              onClick={() =>
                router.push(
                  p.role === "organization" && planId
                    ? `/auth/register/${p.role}?planId=${planId}`
                    : `/auth/register/${p.role}`,
                )
              }
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl text-white"
                style={{ background: p.color }}
              >
                <i className={"bi bi-" + p.icon} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{p.desc}</p>
              </div>
              <span className="text-slate-300 transition-colors group-hover:text-sky-500">
                <i className="bi bi-chevron-right" />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-sky-600 hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Sign in here
          </button>
        </p>
      </div>
    </AuthWrap>
  );
};

export default ChoosePathView;
