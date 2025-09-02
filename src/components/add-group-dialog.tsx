"use client";

import { useState } from 'react';
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
import { Users } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom du groupe doit contenir au moins 2 caractères." }),
  sessionDay1: z.string({ required_error: "Veuillez sélectionner le premier jour." }),
  sessionDay2: z.string({ required_error: "Veuillez sélectionner le deuxième jour." }),
}).refine(data => data.sessionDay1 !== data.sessionDay2, {
  message: "Les jours de séance doivent être différents.",
  path: ["sessionDay2"], 
});

type AddGroupDialogProps = {
  onAddGroup: (name: string, sessionDays: number[]) => void;
  disabled?: boolean;
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

export function AddGroupDialog({ onAddGroup, disabled }: AddGroupDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sessionDay1: "2", // Tuesday
      sessionDay2: "5", // Friday
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const sessionDays = [parseInt(values.sessionDay1, 10), parseInt(values.sessionDay2, 10)];
    onAddGroup(values.name, sessionDays);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" /> Ajouter un groupe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau groupe</DialogTitle>
          <DialogDescription>
            Entrez le nom du nouveau groupe et sélectionnez les deux jours de séance.
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
                    <Input placeholder="Ex: Groupe 3" {...field} />
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
                          <SelectItem key={`day1-${day.value}`} value={day.value}>
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
                          <SelectItem key={`day2-${day.value}`} value={day.value}>
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
              <Button type="submit">Ajouter le groupe</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
