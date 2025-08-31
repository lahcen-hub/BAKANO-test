"use client";

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from 'lucide-react';
import type { Group } from '@/app/page';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  groupId: z.string({ required_error: "Veuillez sélectionner un groupe." }),
});

type AddStudentDialogProps = {
  onAddStudent: (name: string, groupId: string) => void;
  groups: Group[];
  defaultGroupId: string;
  disabled?: boolean;
};

export function AddStudentDialog({ onAddStudent, groups, defaultGroupId, disabled }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      groupId: defaultGroupId,
    },
  });

  useEffect(() => {
    if (groups.length > 0) {
      form.setValue('groupId', defaultGroupId);
    }
  }, [defaultGroupId, groups, form]);

  useEffect(() => {
    if (open) {
      form.reset({ name: "", groupId: defaultGroupId });
    }
  }, [open, defaultGroupId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddStudent(values.name, values.groupId);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter un élève
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel élève</DialogTitle>
          <DialogDescription>
            Entrez les informations de l'élève pour l'ajouter à un groupe. Les frais mensuels sont fixés à 200 MAD.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Groupe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un groupe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit">Ajouter l'élève</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
