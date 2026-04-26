"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FormSelectOption = { value: string; label: string };

/**
 * shadcn/ui Select (Radix) with a hidden input so Server Actions receive FormData.
 * @see https://ui.shadcn.com/docs/components/radix/select
 */
export function FormSelectField({
  name,
  label,
  placeholder,
  value,
  onValueChange,
  options,
  disabled,
}: {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FormSelectOption[];
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <input type="hidden" name={name} value={value} />
      <Select
        value={value || undefined}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "mt-1 h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white shadow-none",
            "data-[placeholder]:text-zinc-500",
            "focus-visible:border-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-500/30",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={4}
          className="z-[200] max-h-72 border border-zinc-700 bg-zinc-900 text-zinc-100"
        >
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="focus:bg-zinc-800 focus:text-white"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
