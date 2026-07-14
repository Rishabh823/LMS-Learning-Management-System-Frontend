"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import PasswordInput from "@/ui/PasswordInput";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";
import { useAddInstructor } from "../hooks/useAddInstructor";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const AddInstructor = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { form, update, errors, submit, isPending, reset } =
    useAddInstructor(onClose);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add New Instructor"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Email"
              required
              error={fieldError(errors.emailId)}
            >
              <Input
                type="email"
                placeholder="Email Address"
                value={form.emailId}
                onChange={(e) => update({ emailId: e.target.value })}
              />
            </FormField>
            <FormField label="Name" required error={fieldError(errors.name)}>
              <Input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </FormField>
            <FormField
              label="Phone"
              required
              error={fieldError(errors.contactNo)}
            >
              <Input
                type="tel"
                placeholder="Contact Number"
                value={form.contactNo}
                onChange={(e) => update({ contactNo: e.target.value })}
              />
            </FormField>
            <FormField
              label="Gender"
              required
              error={fieldError(errors.gender)}
            >
              <SingleSelect
                options={GENDER_OPTIONS}
                value={form.gender}
                onChange={(val) => update({ gender: String(val) })}
                placeholder="Select Gender"
                searchable={false}
              />
            </FormField>
            <FormField
              label="Password"
              required
              error={fieldError(errors.password)}
            >
              <PasswordInput
                placeholder="Password"
                value={form.password}
                onChange={(e) => update({ password: e.target.value })}
              />
            </FormField>
            <FormField
              label="Confirm Password"
              required
              error={fieldError(errors.confirmPassword)}
            >
              <PasswordInput
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => update({ confirmPassword: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
            Educational Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Degree Name">
              <Input
                type="text"
                placeholder="Degree Name"
                value={form.degreeName}
                onChange={(e) => update({ degreeName: e.target.value })}
              />
            </FormField>
            <FormField label="Year Of Passing">
              <Input
                type="text"
                placeholder="Passing Year"
                value={form.passingYear}
                onChange={(e) => update({ passingYear: e.target.value })}
              />
            </FormField>
            <FormField label="Year Of Experience">
              <Input
                type="number"
                min="0"
                placeholder="Year of Experience (in years)"
                value={form.totalExprience}
                onChange={(e) => update({ totalExprience: e.target.value })}
              />
            </FormField>
            <FormField label="Percentage">
              <Input
                type="text"
                placeholder="Percentage (example:99.99)"
                value={form.percentage}
                onChange={(e) => update({ percentage: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={reset} disabled={isPending}>
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={isPending}
            className="rounded-md px-6 py-2.5"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddInstructor;
