"use client";

import AuthWrap from "../../login/components/AuthWrap";
import { useForgotPassword } from "../hooks/useForgotPassword";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import Button from "@/ui/Button";

const ForgotPasswordView = () => {
  const { submitted, isPending, handleSubmit, goToLogin } = useForgotPassword();

  return (
    <AuthWrap>
      <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-8 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-xl text-sky-600">
            <i className="bi bi-envelope-check" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Forgot Password
            </h3>
            <p className="text-sm text-slate-500">
              Reset your account password
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="mt-8 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-3xl text-sky-500">
              <i className="bi bi-check-circle-fill" />
            </div>
            <h4 className="mt-4 font-semibold text-slate-900">
              Check your inbox
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              We&rsquo;ve sent password reset instructions to your email
              address.
            </p>
            <Button
              variant="primary"
              className="mt-6 w-full py-3"
              onClick={goToLogin}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-4xl text-sky-500">
                <i className="bi bi-shield-lock-fill" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Recover Your Account
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter your email and we&rsquo;ll send you instructions to
                reset your password.
              </p>
            </div>

            <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
              <FormField label="Email Address">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  required
                  icon={<i className="bi bi-person" />}
                />
              </FormField>

              <div className="flex items-start gap-2 rounded-md bg-sky-50 px-3 py-2.5 text-sm text-sky-700">
                <i className="bi bi-info-circle mt-0.5" />
                <span>
                  We&rsquo;ll send you a link to reset your password. Please
                  check your inbox and follow the instructions.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="w-full py-3"
              >
                {isPending ? "Sending…" : "Send Reset Link"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {"Remember your password? "}
              <button
                type="button"
                className="font-semibold text-sky-600 hover:underline"
                onClick={goToLogin}
              >
                Sign in here
              </button>
            </p>
          </>
        )}
      </div>
    </AuthWrap>
  );
};

export default ForgotPasswordView;
