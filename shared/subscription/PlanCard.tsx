import { Check, X, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import {
  formatLimit,
  formatPlanPrice,
  PLAN_FEATURE_FLAGS,
  PLAN_LIMIT_FIELDS,
  type SubscriptionPlan,
} from "./types";

const PlanCard = ({
  plan,
  featured,
  selected,
  onSelect,
  footer,
}: {
  plan: SubscriptionPlan;
  featured?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  footer?: ReactNode;
}) => {
  const clickable = !!onSelect;

  return (
    <div
      onClick={onSelect}
      className={`relative flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-all ${
        clickable ? "cursor-pointer" : ""
      } ${
        selected || featured
          ? "border-sky-400 ring-2 ring-sky-100"
          : "border-slate-100 hover:border-sky-200"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <Sparkles size={12} /> Most Popular
        </span>
      )}

      <div>
        <h3 className="text-lg font-bold text-slate-900">{plan.planName}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {plan.description}
        </p>
      </div>

      <div>
        <span className="text-3xl font-extrabold text-slate-900">
          {formatPlanPrice(plan.price, plan.currency)}
        </span>
        {plan.price > 0 && (
          <span className="ml-1 text-sm font-medium text-slate-400">
            /{plan.billingCycle.toLowerCase()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
        {PLAN_LIMIT_FIELDS.map((f) => (
          <div key={f.key} className="flex items-center justify-between">
            <span className="text-slate-400">{f.label}</span>
            <span className="font-semibold text-slate-700">
              {formatLimit(plan[f.key])}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 border-t border-slate-100 pt-4">
        {PLAN_FEATURE_FLAGS.map((f) => {
          const enabled = !!plan[f.key];
          return (
            <div key={f.key} className="flex items-center gap-2 text-sm">
              {enabled ? (
                <Check size={14} className="shrink-0 text-emerald-500" />
              ) : (
                <X size={14} className="shrink-0 text-slate-300" />
              )}
              <span className={enabled ? "text-slate-700" : "text-slate-400"}>
                {f.label}
              </span>
            </div>
          );
        })}
      </div>

      {footer && <div className="mt-auto pt-2">{footer}</div>}

      {onSelect && (
        <div
          className={`absolute top-6 right-6 h-4 w-4 rounded-full border-2 ${
            selected ? "border-sky-500 bg-sky-500" : "border-slate-300 bg-white"
          }`}
        />
      )}
    </div>
  );
};

export default PlanCard;
