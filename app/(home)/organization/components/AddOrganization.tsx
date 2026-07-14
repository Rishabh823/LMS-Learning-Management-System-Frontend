"use client";

import { ImagePlus } from "lucide-react";
import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import { useAddOrganization } from "../hooks/useAddOrganization";

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const AddOrganization = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { form, update, errors, submit, isPending, reset } =
    useAddOrganization(onClose);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add New Organization"
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
            Organization Details
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Organization Name"
              required
              error={fieldError(errors.fullName)}
            >
              <Input
                type="text"
                placeholder="Organization Name"
                value={form.fullName}
                onChange={(e) => update({ fullName: e.target.value })}
              />
            </FormField>
            <FormField
              label="Owner's Name"
              required
              error={fieldError(errors.ownersName)}
            >
              <Input
                type="text"
                placeholder="Owner's Name"
                value={form.ownersName}
                onChange={(e) => update({ ownersName: e.target.value })}
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
                value={form.emailId}
                onChange={(e) => update({ emailId: e.target.value })}
              />
            </FormField>
            <FormField label="Alternate Email">
              <Input
                type="email"
                placeholder="Alternate Email Address"
                value={form.emailIdAlternate}
                onChange={(e) => update({ emailIdAlternate: e.target.value })}
              />
            </FormField>
            <FormField
              label="Contact"
              required
              error={fieldError(errors.contact)}
            >
              <Input
                type="tel"
                placeholder="Contact Number"
                value={form.contact}
                onChange={(e) => update({ contact: e.target.value })}
              />
            </FormField>
            <FormField label="Alternate Contact">
              <Input
                type="tel"
                placeholder="Alternate Contact Number"
                value={form.contactAlternate}
                onChange={(e) => update({ contactAlternate: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
            Address
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Address"
              required
              error={fieldError(errors.address)}
              className="sm:col-span-2 flex flex-col"
            >
              <Input
                type="text"
                placeholder="Street Address"
                value={form.address}
                onChange={(e) => update({ address: e.target.value })}
              />
            </FormField>
            <FormField label="City">
              <Input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => update({ city: e.target.value })}
              />
            </FormField>
            <FormField label="State">
              <Input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => update({ state: e.target.value })}
              />
            </FormField>
            <FormField label="Country">
              <Input
                type="text"
                placeholder="Country"
                value={form.country}
                onChange={(e) => update({ country: e.target.value })}
              />
            </FormField>
            <FormField label="Zip Code">
              <Input
                type="text"
                placeholder="Zip Code"
                value={form.zipcode}
                onChange={(e) => update({ zipcode: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
            Additional Details
          </h3>
          <div className="grid grid-cols-1 gap-5">
            <FormField label="About Organization">
              <TextArea
                placeholder="Brief description about the organization"
                value={form.aboutOrganization}
                onChange={(e) => update({ aboutOrganization: e.target.value })}
                rows={3}
              />
            </FormField>
            <FormField label="Logo">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-sky-200 bg-sky-50/40 px-4 py-4 hover:border-sky-400">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    update({ logo: e.target.files?.[0] || null })
                  }
                />
                <ImagePlus size={20} className="shrink-0 text-sky-500" />
                <span className="text-sm text-slate-600">
                  {form.logo
                    ? form.logo.name
                    : "Click to upload organization logo"}
                </span>
              </label>
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

export default AddOrganization;
