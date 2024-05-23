"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { isArray } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export function FormInput({
  label,
  name,
  placeholder,
  description,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  description?: string | Array<string>;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              onChange={
                type === "number"
                  ? (e) => {
                      if (e.target.value === "") {
                        field.onChange(undefined);
                      } else {
                        field.onChange(Number(e.target.value));
                      }
                    }
                  : field.onChange
              }
            />
          </FormControl>
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
