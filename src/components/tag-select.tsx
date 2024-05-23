"use server";

import { api } from "@/trpc/server";
import { FormMultiSelect } from "./ui/form-multi-select";

export async function TagSelect() {
  const tags = await api.tag.getAll();
  return (
    <FormMultiSelect
      label="Tag"
      placeholder="Please select Transaction Tag"
      name="tags"
      options={tags?.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }))}
    />
  );
}
