"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";
import { useEditUser } from "@/app/(home)/users/hooks/useEditUser";
import { useUserDetail } from "@/app/(home)/users/hooks/useUserDetail";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const EditProfileDialog = ({
  userId,
  onClose,
}: {
  userId: string | null;
  onClose: () => void;
}) => {
  // Shares the same react-query cache entry as ProfileView's fetch for this
  // userId, so this doesn't trigger a second network request.
  const { user } = useUserDetail(userId);
  const {
    form,
    update,
    errors,
    onboardingAnswers,
    updateOnboardingAnswer,
    submit,
    isPending,
  } = useEditUser(user, onClose);

  return (
    <Dialog
      open={!!userId}
      onClose={onClose}
      title="Edit Profile"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Name" required error={fieldError(errors.name)}>
              <Input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </FormField>
            <FormField label="Gender">
              <SingleSelect
                options={GENDER_OPTIONS}
                value={form.gender}
                onChange={(val) => update({ gender: String(val) })}
                placeholder="Select Gender"
                searchable={false}
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
          </div>
        </div>

        {onboardingAnswers.length > 0 && (
          <div>
            <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
              Onboarding Details
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {onboardingAnswers.map((answer, idx) => (
                <FormField key={idx} label={answer.label}>
                  {answer.type === "TEXTAREA" ? (
                    <TextArea
                      value={answer.value}
                      onChange={(e) =>
                        updateOnboardingAnswer(idx, e.target.value)
                      }
                      rows={2}
                    />
                  ) : (
                    <Input
                      type={
                        answer.type === "NUMBER"
                          ? "number"
                          : answer.type === "DATE"
                            ? "date"
                            : "text"
                      }
                      value={answer.value}
                      onChange={(e) =>
                        updateOnboardingAnswer(idx, e.target.value)
                      }
                      disabled={answer.fieldId == null}
                      title={
                        answer.fieldId == null
                          ? "This field can't be saved yet — no fieldId returned for it."
                          : undefined
                      }
                    />
                  )}
                </FormField>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="cancel" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={isPending}
            className="rounded-md px-6 py-2.5"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProfileDialog;
