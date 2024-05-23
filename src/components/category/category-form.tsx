"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { FormInput } from "../ui/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { FormSelect } from "../ui/form-select";
import { CategoryInputSchema } from "@/schemas";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Pencil1Icon, SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "../ui/use-toast";
import { type Category } from "@prisma/client";

export function CategoryForm({
  refetch,
  value = {
    name: "",
  },
  id,
  category,
}: {
  refetch: VoidFunction;
  value?: Partial<z.infer<typeof CategoryInputSchema>>;
  id?: string;
  category: Category[];
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onSuccess = () => {
    refetch();
    setOpen(false);
    toast({ title: id ? "Category Updated" : "Category Created" });
  };

  const createCategory = api.category.create.useMutation({ onSuccess });
  const updateCategory = api.category.update.useMutation({ onSuccess });

  const form = useForm<z.infer<typeof CategoryInputSchema>>({
    resolver: zodResolver(CategoryInputSchema),
    defaultValues: value,
  });

  async function onSubmit(values: z.infer<typeof CategoryInputSchema>) {
    if (id) {
      updateCategory.mutate({ id, data: values });
    } else {
      createCategory.mutate(values);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={id ? "icon" : "default"}>
            {id ? <Pencil1Icon /> : "Create Category"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{id ? "Update" : "Create New"} Category</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput
                label={"Name"}
                placeholder={"Category name"}
                name="name"
              />
              <FormSelect
                label="Type"
                placeholder="Please select Category type"
                name="type"
                options={[
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ]}
              />
              <FormSelect
                label="Parent"
                placeholder="Please select Parent Category"
                name="parentId"
                options={category.map((c) => ({ label: c.name, value: c.id }))}
              />
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                Submit
                {(createCategory.isPending || updateCategory.isPending) && (
                  <SymbolIcon className="animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
