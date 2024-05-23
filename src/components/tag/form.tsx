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
import { TagInputSchema } from "@/schemas";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Pencil1Icon, SymbolIcon } from "@radix-ui/react-icons";
import { useToast } from "../ui/use-toast";

export function TagForm({
  refetch,
  value = {
    name: "",
  },
  id,
}: {
  refetch: VoidFunction;
  value?: Partial<z.infer<typeof TagInputSchema>>;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onSuccess = () => {
    refetch();
    setOpen(false);
    toast({ title: id ? "Tag Updated" : "Tag Created" });
  };

  const createApi = api.tag.create.useMutation({ onSuccess });
  const updateApi = api.tag.update.useMutation({ onSuccess });

  const form = useForm<z.infer<typeof TagInputSchema>>({
    resolver: zodResolver(TagInputSchema),
    defaultValues: value,
  });

  async function onSubmit(values: z.infer<typeof TagInputSchema>) {
    if (id) {
      updateApi.mutate({ id, data: values });
    } else {
      createApi.mutate(values);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size={id ? "icon" : "default"}>
            {id ? <Pencil1Icon /> : "Create Tag"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{id ? "Update" : "Create New"} Tag</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormInput label={"Name"} placeholder={"Tag name"} name="name" />
              <FormInput
                label={"Description"}
                placeholder={"Tag Description"}
                name="description"
              />
              <Button
                type="submit"
                disabled={createApi.isPending || updateApi.isPending}
              >
                Submit
                {(createApi.isPending || updateApi.isPending) && (
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
