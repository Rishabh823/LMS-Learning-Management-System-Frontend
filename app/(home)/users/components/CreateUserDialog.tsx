"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import PasswordInput from "@/ui/PasswordInput";
import TextArea from "@/ui/TextArea";
import SingleSelect from "@/ui/SingleSelect";
import Button from "@/ui/Button";
import Loader from "@/ui/Loader";
import { useCreateUserForm } from "../hooks/useCreateUserForm";

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const CreateUserDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    form,
    isLoadingForm,
    account,
    updateAccount,
    answers,
    updateAnswer,
    errors,
    submit,
    isPending,
    reset,
  } = useCreateUserForm(open, onClose);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={form?.title || "Create User"}
      maxWidth="max-w-3xl"
    >
      {isLoadingForm ? (
        <div className="flex items-center justify-center py-16">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {form?.description && (
            <p className="text-sm text-slate-500">{form.description}</p>
          )}

          <div>
            <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
              Account Details
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Name" required error={fieldError(errors.name)}>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={account.name}
                  onChange={(e) => updateAccount({ name: e.target.value })}
                />
              </FormField>
              <FormField
                label="Email"
                required
                error={fieldError(errors.emailId)}
              >
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={account.emailId}
                  onChange={(e) => updateAccount({ emailId: e.target.value })}
                />
              </FormField>
              <FormField
                label="Password"
                required
                error={fieldError(errors.password)}
              >
                <PasswordInput
                  placeholder="Password"
                  value={account.password}
                  onChange={(e) => updateAccount({ password: e.target.value })}
                />
              </FormField>
              <FormField
                label="Confirm Password"
                required
                error={fieldError(errors.confirmPassword)}
              >
                <PasswordInput
                  placeholder="Confirm Password"
                  value={account.confirmPassword}
                  onChange={(e) =>
                    updateAccount({ confirmPassword: e.target.value })
                  }
                />
              </FormField>
            </div>
          </div>

          {form?.sections.map((section) => (
            <div key={section.id ?? section.title}>
              <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {section.fields.map((f) => {
                  const value = answers[f.fieldName];
                  return (
                    <FormField
                      key={f.id ?? f.fieldName}
                      label={f.label}
                      required={f.required}
                    >
                      {f.fieldType === "TEXTAREA" ? (
                        <TextArea
                          value={(value as string) || ""}
                          onChange={(e) =>
                            updateAnswer(f.fieldName, e.target.value)
                          }
                          rows={3}
                        />
                      ) : f.fieldType === "SELECT" ||
                        f.fieldType === "RADIO" ? (
                        <SingleSelect
                          options={f.options.map((o) => ({
                            value: o.value,
                            label: o.label,
                          }))}
                          value={(value as string) || ""}
                          onChange={(val) =>
                            updateAnswer(f.fieldName, String(val))
                          }
                          placeholder={`Select ${f.label}`}
                          searchable={false}
                        />
                      ) : f.fieldType === "FILE" || f.fieldType === "IMAGE" ? (
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border-2 border-dashed border-sky-200 bg-sky-50/40 px-3 py-2.5 text-sm text-slate-600 hover:border-sky-400">
                          <input
                            type="file"
                            accept={
                              f.fieldType === "IMAGE" ? "image/*" : undefined
                            }
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) updateAnswer(f.fieldName, file);
                            }}
                          />
                          <span className="truncate">
                            {value instanceof File
                              ? value.name
                              : "Click to upload"}
                          </span>
                        </label>
                      ) : (
                        <Input
                          type={
                            f.fieldType === "NUMBER"
                              ? "number"
                              : f.fieldType === "DATE"
                                ? "date"
                                : "text"
                          }
                          value={(value as string) || ""}
                          onChange={(e) =>
                            updateAnswer(f.fieldName, e.target.value)
                          }
                        />
                      )}
                    </FormField>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button variant="cancel" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={submit}
              disabled={isPending || !form}
              className="rounded-md px-6 py-2.5"
            >
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default CreateUserDialog;
