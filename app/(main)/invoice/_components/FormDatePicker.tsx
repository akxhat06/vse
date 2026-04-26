"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function parseISODateLocal(s: string): Date | undefined {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatISO(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

function todayISO(): string {
  return formatISO(new Date());
}

type Props = {
  name: string;
  label: string;
  /** `YYYY-MM-DD`. If omitted, uses the user’s local calendar date today. */
  defaultValue?: string;
};

/**
 * Popover + shadcn Calendar (React DayPicker) with a hidden input for Server Actions.
 * @see https://ui.shadcn.com/docs/components/radix/calendar
 */
export function FormDatePicker({ name, label, defaultValue }: Props) {
  const seed = defaultValue?.slice(0, 10) ?? todayISO();
  const [date, setDate] = React.useState<Date | undefined>(() =>
    parseISODateLocal(seed),
  );
  const [open, setOpen] = React.useState(false);
  const timeZone = React.useSyncExternalStore(
    () => () => {},
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    () => undefined,
  );

  const iso = date ? formatISO(date) : "";

  return (
    <div>
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <input type="hidden" name={name} value={iso} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "mt-1 h-11 w-full justify-start rounded-xl border-zinc-700 bg-zinc-900 px-3 font-normal text-white hover:bg-zinc-800",
              !date && "text-zinc-500",
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0 text-zinc-500" />
            {date
              ? date.toLocaleDateString(undefined, { dateStyle: "medium" })
              : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-[200] w-auto border border-zinc-700 bg-zinc-900 p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
            timeZone={timeZone}
            className="rounded-lg border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
