"use client";

import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useLogin";
import AuthWrap from "./AuthWrap";
import FormField from "@/ui/FormField";
import Label from "@/ui/Label";
import Input from "@/ui/Input";
import PasswordInput from "@/ui/PasswordInput";
import Button from "@/ui/Button";

const LoginView = () => {
  const router = useRouter();
  const { captcha, captchaInput, setCaptchaInput, refreshCaptcha, handleLogin, isPending } =
    useLogin();

  return (
    <AuthWrap wide>
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Hero left */}
        <div className="relative hidden flex-col justify-center md:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
            <i className="bi bi-shield-check" /> Secure Access Portal
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900">
            Your Awareness
            <br />
            Trainer
          </h1>
          <p className="mt-6 max-w-sm text-base text-slate-600">
            Protect your organization with world&rsquo;s leading cybersecurity
            awareness solutions.
          </p>
          <ul className="mt-6 flex flex-col gap-2">
            {[
              "Enterprise Grade Security",
              "Interactive Learning",
              "Real-time Progress Tracking",
              "24/7 Expert Support",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <i className="bi bi-check-circle-fill text-sky-500" /> {f}
              </li>
            ))}
          </ul>

          <div className="relative mt-10 flex items-center justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-sky-200/50">
              <i className="bi bi-shield-fill-check text-6xl text-sky-500" />
            </div>
            <div className="absolute top-2 left-0 flex items-center gap-2 rounded-xl border border-sky-100 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
              <i className="bi bi-people-fill text-sky-500" /> 10,000+ Orgs
            </div>
            <div className="absolute right-0 bottom-2 flex items-center gap-2 rounded-xl border border-sky-100 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
              <i className="bi bi-award-fill text-amber-500" /> 98% Satisfaction
            </div>
          </div>
        </div>

        {/* Login card */}
        <div className="mx-auto w-full max-w-md rounded-2xl border border-sky-100 bg-white p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-xl text-sky-600">
              <i className="bi bi-person-fill" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Welcome Back</h3>
              <p className="text-sm text-slate-500">Sign in to continue</p>
            </div>
          </div>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleLogin}>
            <FormField label="Email Address">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                icon={<i className="bi bi-person" />}
              />
            </FormField>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <button
                  type="button"
                  className="text-sm font-semibold text-sky-600 hover:underline"
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>
              <PasswordInput
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <FormField label="Security Verification *">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex-1 select-none rounded-md border border-sky-200 bg-sky-50 px-4 py-2 text-center text-lg font-bold tracking-[0.3em] text-sky-700">
                    {captcha}
                  </span>
                  <Button
                    type="button"
                    variant="clear"
                    className="flex h-10 w-10 shrink-0 items-center justify-center"
                    onClick={refreshCaptcha}
                  >
                    <i className="bi bi-arrow-clockwise" />
                  </Button>
                </div>
                <Input
                  type="text"
                  placeholder="Enter the code above"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  icon={<i className="bi bi-shield-check" />}
                />
              </div>
            </FormField>

            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="mt-1 w-full py-3"
            >
              {isPending ? "Signing In…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {"Don't have an account? "}
            <button
              type="button"
              className="font-semibold text-sky-600 hover:underline"
              onClick={() => router.push("/auth/register")}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </AuthWrap>
  );
};

export default LoginView;
