"use client";

import { useEffect } from 'react';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Group } from '@/app/page';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom du groupe doit contenir au moins 2 caractères." }),
  sessionDay1: z.string({ required_error: "Veuillez sélectionner le premier jour." }),
  sessionDay2: z.string({ required_error: "Veuillez sélectionner le deuxième jour." }),
}).refine(data => data.sessionDay1 !== data.sessionDay2, {
  message: "Les jours de séance doivent être différents.",
  path: ["sessionDay2"], 
});

type EditGroupDialogProps = {
  group: Group;
  onUpdateGroup: (groupId: string, newName: string, sessionDays: number[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const weekDays = [
  { value: '1', label: 'Lundi' },
  { value: '2', label: 'Mardi' },
  { value: '3', label: 'Mercredi' },
  { value: '4', label: 'Jeudi' },
  { value: '5', label: 'Vendredi' },
  { value: '6', label: 'Samedi' },
  { value: '0', label: 'Dimanche' },
];

export function EditGroupDialog({ group, onUpdateGroup, open, onOpenChange }: EditGroupDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group.name,
      sessionDay1: group.sessionDays?.[0]?.toString() ?? "2",
      sessionDay2: group.sessionDays?.[1]?.toString() ?? "5",
    },
  });

  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        sessionDay1: group.sessionDays?.[0]?.toString() ?? "2",
        sessionDay2: group.sessionDays?.[1]?.toString() ?? "5",
      });
    }
  }, [group, form, open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const sessionDays = [parseInt(values.sessionDay1, 10), parseInt(values.sessionDay2, 10)];
    onUpdateGroup(group.id, values.name, sessionDays);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le groupe</DialogTitle>
          <DialogDescription>
            Changez le nom et/ou les jours de séance du groupe.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du groupe</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sessionDay1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Séance 1</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Jour" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekDays.map((day) => (
                          <SelectItem key={`day1-edit-${day.value}`} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessionDay2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Séance 2</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Jour" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekDays.map((day) => (
                          <SelectItem key={`day2-edit-${day.value}`} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
