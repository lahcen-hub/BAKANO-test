'use client';

import { useState, useMemo, type FC } from 'react';
import {
  format,
  startOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isBefore,
  isSameMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Student, AttendanceStatus } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle2,
  XCircle,
  Circle,
  Euro,
  FileText,
  Bot,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BadgeCent,
} from 'lucide-react';
import { AddStudentDialog } from '@/components/add-student-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  generateAbsenceReport,
  type GenerateAbsenceReportInput,
  type GenerateAbsenceReportOutput,
} from '@/ai/flows/generate-absence-report';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const initialStudents: Student[] = [
  { id: '1', name: 'Hamid Lehlou', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '2', name: 'Mounir Rouchdi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '3', name: 'Khalid Ajrar', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '4', name: 'Lahcen ait Ikaid', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '5', name: 'hodaigi Hicham', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '6', name: 'Ayoub Ifakir', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '7', name: 'Azergi Hassan', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '8', name: 'Damoun Abderhim', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '9', name: 'Yassine Ozaoui', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '10', name: 'zaouit mohamed', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '11', name: 'Rachid Dacos', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '12', name: 'Ayoub Lamfadil', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '13', name: 'Mohamed Ikhyati', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '14', name: 'Rachid Ouchikh', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '15', name: 'Adil Ait Addi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '16', name: 'Mourad Rouchdi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '17', name: 'Hicham Bouri', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '18', name: 'Mohamed Dahi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '19', name: 'Imad Imansouri', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '20', name: 'Mohamed Haydoun', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '21', name: 'Hassan Hadaoui', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '22', name: 'Samir Eddarif', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '23', name: 'Said Sougrat', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '24', name: 'Hassan Lmilit', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '25', name: 'Smid Souwat', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
  { id: '26', name: 'Abderrahim Wasir', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 50 },
];

const AttendanceIcon: FC<{ status?: AttendanceStatus }> = ({ status }) => {
  if (status === 'present')
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === 'absent') return <XCircle className="h-5 w-5 text-red-500" />;
  return <Circle className="h-5 w-5 text-muted-foreground" />;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [report, setReport] = useState<GenerateAbsenceReportOutput | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const classDaysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    return eachDayOfInterval({ start, end }).filter(day => day.getDay() === 1); // Mondays
  }, [currentDate]);

  const financialSummary = useMemo(() => {
    const currentMonthStr = format(currentDate, 'yyyy-MM');
    let totalPaid = 0;
    let totalUnpaid = 0;
    let potentialRevenue = 0;

    students.forEach(student => {
      const joinMonth = format(student.joinDate, 'yyyy-MM');
      if (joinMonth > currentMonthStr) return;

      potentialRevenue += student.monthlyFee;
      const paymentStatus = student.payments[currentMonthStr];
      if (paymentStatus === 'paid') {
        totalPaid += student.monthlyFee;
      } else {
        totalUnpaid += student.monthlyFee;
      }
    });

    return { totalPaid, totalUnpaid, potentialRevenue };
  }, [students, currentDate]);

  const addStudent = (name: string, fee: number) => {
    const newStudent: Student = {
      id: crypto.randomUUID(),
      name,
      joinDate: new Date(),
      attendance: {},
      payments: {},
      monthlyFee: fee,
    };
    setStudents(prev => [...prev, newStudent]);
    toast({
      title: 'Élève ajouté',
      description: `${name} a été ajouté à la liste.`,
    });
  };

  const deleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
    toast({
      title: 'Élève supprimé',
      description: "L'élève a été retiré de la liste.",
      variant: 'destructive',
    });
  };

  const toggleAttendance = (
    studentId: string,
    date: Date,
    currentStatus?: AttendanceStatus
  ) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setStudents(
      students.map(s => {
        if (s.id !== studentId) return s;

        const newAttendance = { ...s.attendance };
        if (currentStatus === 'present') {
          newAttendance[dateStr] = 'absent';
        } else if (currentStatus === 'absent') {
          delete newAttendance[dateStr];
        } else {
          newAttendance[dateStr] = 'present';
        }
        return { ...s, attendance: newAttendance };
      })
    );
  };

  const togglePayment = (studentId: string) => {
    const currentMonthStr = format(currentDate, 'yyyy-MM');
    setStudents(
      students.map(s => {
        if (s.id !== studentId) return s;

        const newPayments = { ...s.payments };
        const currentStatus = s.payments[currentMonthStr] ?? 'unpaid';
        newPayments[currentMonthStr] = currentStatus === 'paid' ? 'unpaid' : 'paid';

        return { ...s, payments: newPayments };
      })
    );
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);

    const absenceData = students
      .map(student => ({
        candidateName: student.name,
        absentDates: Object.entries(student.attendance)
          .filter(([date, status]) => {
            const d = new Date(date);
            return (
              status === 'absent' && d >= startDate && d <= endDate
            );
          })
          .map(([date]) => date),
      }))
      .filter(d => d.absentDates.length > 0);

    const input: GenerateAbsenceReportInput = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      absences: absenceData,
    };

    try {
      const result = await generateAbsenceReport(input);
      setReport(result);
    } catch (error) {
      toast({
        title: 'Erreur de génération',
        description: "Impossible de générer le rapport. Veuillez réessayer.",
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              PoolSidePal
            </h1>
            <AddStudentDialog onAddStudent={addStudent} />
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 md:p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenus du mois
                </CardTitle>
                <Euro className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {financialSummary.totalPaid.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  sur{' '}
                  {financialSummary.potentialRevenue.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}{' '}
                  potentiels
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Montant à encaisser
                </CardTitle>
                <BadgeCent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {financialSummary.totalUnpaid.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Pour le mois en cours</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rapport d'absences IA
                </CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Générer le rapport
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Analyse les absences du mois dernier.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Suivi des présences et paiements</CardTitle>
                  <CardDescription>
                    Vue d'ensemble pour le mois sélectionné.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-lg capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: fr })}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    disabled={isSameMonth(currentDate, new Date())}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] min-w-[150px]">
                        Élève
                      </TableHead>
                      {classDaysInMonth.map(day => (
                        <TableHead key={day.toString()} className="text-center">
                          {format(day, 'dd')}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Paiement</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => {
                      const currentMonthStr = format(currentDate, 'yyyy-MM');
                      const joinMonth = format(student.joinDate, 'yyyy-MM');
                      if (joinMonth > currentMonthStr) return null;

                      const paymentStatus =
                        student.payments[currentMonthStr] ?? 'unpaid';

                      return (
                        <TableRow key={student.id} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          {classDaysInMonth.map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const attendanceStatus = student.attendance[dateStr];
                            const isDisabled = isBefore(
                              new Date(),
                              day
                            ) && !isSameMonth(new Date(), day);
                            return (
                              <TableCell key={dateStr} className="text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    toggleAttendance(
                                      student.id,
                                      day,
                                      attendanceStatus
                                    )
                                  }
                                  disabled={isDisabled}
                                  aria-label={`Marquer la présence pour ${student.name} le ${dateStr}`}
                                >
                                  <AttendanceIcon status={attendanceStatus} />
                                </Button>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">
                            <Button
                              variant={
                                paymentStatus === 'paid' ? 'secondary' : 'outline'
                              }
                              size="sm"
                              onClick={() => togglePayment(student.id)}
                            >
                              {paymentStatus === 'paid' ? 'Payé' : 'Marquer payé'}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setStudentToDelete(student.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={!!report} onOpenChange={() => setReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rapport d'Absences</DialogTitle>
            <DialogDescription>
              Voici un résumé et des recommandations basés sur les données
              d'absence du mois dernier.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6 max-h-[60vh] overflow-y-auto pr-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Résumé</h3>
              <p className="text-muted-foreground">{report?.reportSummary}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Recommandations</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {report?.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!studentToDelete}
        onOpenChange={open => !open && setStudentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données de cet élève
              seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (studentToDelete) {
                  deleteStudent(studentToDelete);
                  setStudentToDelete(null);
                }
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
