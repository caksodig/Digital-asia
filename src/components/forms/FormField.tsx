"use client";

import { Controller, Control } from "react-hook-form";

type FormFieldProps = {
  name: string;
  control: Control<any>;
  label: string;
  render: (field: any) => React.ReactNode;
  error?: string;
};

export function FormField({
  name,
  control,
  label,
  render,
  error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => render(field)}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
