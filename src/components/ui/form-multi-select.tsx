import { type Path, useFormContext, type FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import MultipleSelector, { type Option } from "./multi-select";

interface ISelectInputProps<T>
  extends React.SelectHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  description?: string | Array<string>;
  options?: Option[];
  label?: string;
  isLoading?: boolean;
  name: Path<T>;
}

export function FormMultiSelect<T extends FieldValues>({
  label,
  name,
  placeholder,
  description,
  options,
}: ISelectInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultipleSelector
              value={field.value}
              onChange={field.onChange}
              options={options}
              placeholder={placeholder}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
