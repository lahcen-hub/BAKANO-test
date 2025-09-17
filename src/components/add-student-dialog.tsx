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
import { UserPlus, Upload, Loader2, List } from 'lucide-react';
import type { Group } from '@/app/page';
import { Textarea } from '@/components/ui/textarea';
import { extractStudentsFromFile } from '@/ai/flows/extract-students-flow';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  names: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  groupId: z.string({ required_error: "Veuillez sélectionner un groupe." }),
  file: z.instanceof(File).optional(),
});

type AddStudentDialogProps = {
  onAddStudent: (name: string, groupId: string) => void;
  groups: Group[];
  defaultGroupId: string;
  disabled?: boolean;
};

export function AddStudentDialog({ onAddStudent, groups, defaultGroupId, disabled }: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      names: "",
      groupId: defaultGroupId,
    },
  });
  
  const fileRef = form.register("file");

  useEffect(() => {
    if (groups.length > 0) {
      form.setValue('groupId', defaultGroupId);
    }
  }, [defaultGroupId, groups, form]);

  useEffect(() => {
    if (open) {
      form.reset({ names: "", groupId: defaultGroupId, file: undefined });
    }
  }, [open, defaultGroupId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const names = values.names.split('\n').filter(name => name.trim().length > 1);
    names.forEach(name => {
      onAddStudent(name.trim(), values.groupId);
    });
    form.reset();
    setOpen(false);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file);
    }
  };

  const handleExtract = async () => {
    const file = form.getValues("file");
    if (!file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier PDF ou une image.",
        variant: "destructive",
      });
      return;
    }

    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        const result = await extractStudentsFromFile({ fileDataUri: dataUri, fileType: file.type });
        if (result.students && result.students.length > 0) {
          form.setValue("names", result.students.join("\n"));
          toast({
            title: "Extraction réussie",
            description: `${result.students.length} élèves ont été extraits du document.`,
          });
        } else {
          toast({
            title: "Extraction échouée",
            description: "Aucun nom n'a pu être extrait du document. Veuillez essayer avec un autre fichier.",
            variant: "destructive",
          });
        }
      };
      reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast({
          title: "Erreur de lecture du fichier",
          variant: "destructive",
        });
      };
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur d'extraction",
        description: "Une erreur s'est produite lors de l'extraction des noms.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} size="sm">
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter un élève
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un ou plusieurs élèves</DialogTitle>
          <DialogDescription>
            Entrez un nom par ligne ou extrayez-les depuis un fichier PDF/image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel htmlFor="file-upload">Extraire depuis un fichier (PDF/Image)</FormLabel>
              <div className="flex gap-2">
                <Input id="file-upload" type="file" {...fileRef} onChange={handleFileChange} accept="application/pdf,image/*" className="flex-grow"/>
                <Button type="button" onClick={handleExtract} disabled={isExtracting} size="icon" variant="outline">
                  {isExtracting ? <Loader2 className="animate-spin" /> : <List />}
                  <span className="sr-only">Extraire les noms</span>
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Noms des élèves (un par ligne)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Jean Dupont&#x0a;Marie Curie" {...field} rows={5} />
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
              <Button type="submit">Ajouter les élèves</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
