"use client";

import Dialog from "@/ui/Dialog";
import FormField from "@/ui/FormField";
import Input from "@/ui/Input";
import TextArea from "@/ui/TextArea";
import Button from "@/ui/Button";
import { useEditOrganization } from "../hooks/useEditOrganization";
import type { Organization } from "../types/organization.types";

const fieldError = (msg?: string) =>
  msg ? ({ message: msg } as any) : undefined;

const EditOrganization = ({
  organization,
  onClose,
}: {
  organization: Organization | null;
  onClose: () => void;
}) => {
  const { form, update, errors, submit, isPending } = useEditOrganization(
    organization,
    onClose,
  );

  return (
    <Dialog
      open={!!organization}
      onClose={onClose}
      title="Edit Organization"
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
          </div>
        </div>

        <div>
          <h3 className="mb-4 border-l-4 border-sky-500 pl-3 text-base font-bold text-slate-900">
            Address
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Address" className="sm:col-span-2 flex flex-col">
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
          <FormField label="About Organization">
            <TextArea
              placeholder="Brief description about the organization"
              value={form.aboutOrganization}
              onChange={(e) => update({ aboutOrganization: e.target.value })}
              rows={3}
            />
          </FormField>
        </div>

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

export default EditOrganization;
