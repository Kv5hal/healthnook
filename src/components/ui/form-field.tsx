import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

type SharedFieldProps = {
  label: string;
  helperText?: ReactNode;
};

type TextInputProps = SharedFieldProps & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = SharedFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

type SelectProps = SharedFieldProps & SelectHTMLAttributes<HTMLSelectElement>;

export function TextInput({
  label,
  helperText,
  className,
  id,
  name,
  ...props
}: TextInputProps) {
  const fieldId = id ?? name;

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        id={fieldId}
        name={name}
        className={cn(
          "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
          className,
        )}
        {...props}
      />
      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export function Textarea({
  label,
  helperText,
  className,
  id,
  name,
  ...props
}: TextareaProps) {
  const fieldId = id ?? name;

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <textarea
        id={fieldId}
        name={name}
        className={cn(
          "mt-2 min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
          className,
        )}
        {...props}
      />
      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  helperText,
  className,
  id,
  name,
  children,
  ...props
}: SelectProps) {
  const fieldId = id ?? name;

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        id={fieldId}
        name={name}
        className={cn(
          "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-slate-500">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}
