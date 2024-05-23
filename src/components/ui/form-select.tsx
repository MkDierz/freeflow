"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isArray } from "@/lib/utils";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";

export type optionsType = Array<{ value: string; label: string }>;

interface ISelectInputProps<T>
  extends React.SelectHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  description?: string | Array<string>;
  options?: optionsType;
  label?: string;
  isLoading?: boolean;
  name: Path<T>;
}

export function FormSelect<T extends FieldValues>({
  label,
  name,
  placeholder,
  description,
  options,
  isLoading,
}: ISelectInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value ?? undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map(({ label, value }) => (
                <SelectItem
                  key={`${label}-${value}`}
                  value={value ?? undefined}
                >
                  {label}
                </SelectItem>
              ))}
              {isLoading && <SelectItem value="">Loading...</SelectItem>}
            </SelectContent>
          </Select>
          {description && isArray(description) ? (
            description.map((desc) => (
              <FormDescription key={desc}>{desc}</FormDescription>
            ))
          ) : (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
