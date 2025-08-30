"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  render: (field: any) => React.ReactElement;
  error?: string;
};

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  render,
  error,
}: FormFieldProps<T>) {
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
