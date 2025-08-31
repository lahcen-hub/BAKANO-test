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
  isSameDay,
  isToday,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  XCircle,
  Circle,
  FileText,
  Bot,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BadgeCent,
  Waves,
  AlertTriangle,
  Check,
  Users,
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const initialGroups = [
  {
    id: 'groupe-1',
    name: 'Groupe 1',
    students: [
      { id: '1', name: 'Hamid Lehlou', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '2', name: 'Mounir Rouchdi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '3', name: 'Khalid Ajrar', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '4', name: 'Lahcen ait Ikaid', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '5', name: 'hodaigi Hicham', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '6', name: 'Ayoub Ifakir', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '7', name: 'Azergi Hassan', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '8', name: 'Damoun Abderhim', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '9', name: 'Yassine Ozaoui', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '10', name: 'zaouit mohamed', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '11', name: 'Rachid Dacos', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '12', name: 'Ayoub Lamfadil', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '13', name: 'Mohamed Ikhyati', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '14', name: 'Rachid Ouchikh', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '15', name: 'Adil Ait Addi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '16', name: 'Mourad Rouchdi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '17', name: 'Hicham Bouri', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '18', name: 'Mohamed Dahi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '19', name: 'Imad Imansouri', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '20', name: 'Mohamed Haydoun', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '21', name: 'Hassan Hadaoui', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '22', name: 'Samir Eddarif', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '23', name: 'Said Sougrat', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '24', name: 'Hassan Lmilit', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '25', name: 'Smid Souwat', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
      { id: '26', name: 'Abderrahim Wasir', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
    ],
  },
  {
    id: 'groupe-2',
    name: 'Groupe 2',
    students: [
        { id: '27', name: 'Yassin Aoussi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '28', name: 'Mohamed Abaoud', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '29', name: 'Majid Douar Akram', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '30', name: 'Youssef Souilem Marchi', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '31', name: 'Hassan Boumlou', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '32', name: 'Azragi Abdelrahim', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '33', name: 'El Hassan Boufayed', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '34', name: 'El Maati El Aadli', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '35', name: 'Abou El Aadli', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '36', name: 'Ibrahim El Harouri', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '37', name: 'Said Aghrais', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '38', name: 'Ahmed El Acha', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '39', name: 'Khalid Cherkaoui', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '40', name: 'Ben Saleh Mohamed', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '41', name: 'Ait Dai Mohamed', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '42', name: 'Feraouni Khalid', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '43', name: 'Aziz Sellak', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '44', name: 'Younes Sellak', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '45', name: 'Adil El Attar', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '46', name: 'Abdelkrim Derkaoui', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '47', name: 'Belaid Bikjda', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '48', name: 'Abdellatif Bachtak', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '49', name: 'Tazi Mounsef', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '50', name: 'Abderrahim Yahtani', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '51', name: 'Mohamed Ait Azrki', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '52', name: 'Ismail Azrki', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '53', name: 'Abdellah Tamouh', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '54', name: 'Meskine Mohamed', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
        { id: '55', name: 'Hakim', joinDate: new Date(2024, 6, 1), attendance: {}, payments: {}, monthlyFee: 200 },
    ],
  },
];

export type Group = {
  id: string;
  name: string;
  students: Student[];
};


const AttendanceIcon: FC<{ status?: AttendanceStatus }> = ({ status }) => {
  if (status === 'present')
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === 'absent') return <XCircle className="h-5 w-5 text-red-500" />;
  return <Circle className="h-5 w-5 text-muted-foreground" />;
};


export default function Home() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialGroups[0].id);
  const [report, setReport] = useState<GenerateAbsenceReportOutput | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [showOnlyUnpaid, setShowOnlyUnpaid] = useState(false);
  const { toast } = useToast();

  const students = useMemo(() => {
    const groupStudents = groups.find(g => g.id === selectedGroupId)?.students ?? [];
    if (!showOnlyUnpaid) {
      return groupStudents;
    }
    
    const currentMonthStr = format(currentDate, 'yyyy-MM');
    return groupStudents.filter(student => {
      const paymentStatus = student.payments[currentMonthStr] ?? 'unpaid';
      return paymentStatus === 'unpaid';
    });
  }, [groups, selectedGroupId, showOnlyUnpaid, currentDate]);

  const totalStudentsCount = useMemo(() => {
    return groups.reduce((total, group) => total + group.students.length, 0);
  }, [groups]);

  const totalFinancialSummary = useMemo(() => {
    const currentMonthStr = format(currentDate, 'yyyy-MM');
    let totalPaid = 0;
    
    const allStudents = groups.flatMap(g => g.students);

    allStudents.forEach(student => {
      const joinMonth = format(student.joinDate, 'yyyy-MM');
      if (joinMonth > currentMonthStr) return;

      const paymentStatus = student.payments[currentMonthStr];
      if (paymentStatus === 'paid') {
        totalPaid += student.monthlyFee;
      }
    });

    return { totalPaid };
  }, [groups, currentDate]);

  const financialSummary = useMemo(() => {
    const currentMonthStr = format(currentDate, 'yyyy-MM');
    let totalPaid = 0;
    let totalUnpaid = 0;
    let potentialRevenue = 0;

    const groupStudents = groups.find(g => g.id === selectedGroupId)?.students ?? [];

    groupStudents.forEach(student => {
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
  }, [groups, selectedGroupId, currentDate]);

  const addStudent = (name: string, groupId: string) => {
    const newStudent: Student = {
      id: crypto.randomUUID(),
      name,
      joinDate: new Date(),
      attendance: {},
      payments: {},
      monthlyFee: 200,
    };
    
    setGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.id === groupId) {
          return { ...group, students: [...group.students, newStudent] };
        }
        return group;
      });
    });

    toast({
      title: 'Élève ajouté',
      description: `${name} a été ajouté au ${groups.find(g => g.id === groupId)?.name}.`,
    });
  };

  const deleteStudent = (studentId: string) => {
    setGroups(prevGroups => {
      return prevGroups.map(group => {
        return {
          ...group,
          students: group.students.filter(s => s.id !== studentId),
        };
      });
    });
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
    setGroups(prevGroups => prevGroups.map(group => ({
      ...group,
      students: group.students.map(s => {
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
    })));
  };

  const togglePayment = (studentId: string) => {
    const currentMonthStr = format(currentDate, 'yyyy-MM');
    setGroups(prevGroups => prevGroups.map(group => ({
      ...group,
      students: group.students.map(s => {
        if (s.id !== studentId) return s;

        const newPayments = { ...s.payments };
        const currentStatus = s.payments[currentMonthStr] ?? 'unpaid';
        newPayments[currentMonthStr] = currentStatus === 'paid' ? 'unpaid' : 'paid';

        return { ...s, payments: newPayments };
      })
    })));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);

    const allStudents = groups.flatMap(g => g.students);

    const absenceData = allStudents
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

  const getNextSessionDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    let nextDate = new Date(today);
  
    if (today.getDay() === 2 || today.getDay() === 5) { // Tuesday or Friday
      if (isToday(today)) return today;
    }
  
    while (true) {
      nextDate.setDate(nextDate.getDate() + 1);
      const dayOfWeek = nextDate.getDay();
      if (dayOfWeek === 2 || dayOfWeek === 5) {
        return nextDate;
      }
    }
  }, [currentDate]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6 relative">
            <div className="flex items-center gap-2">
              <Waves className="h-8 w-8 text-primary" />
              <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
                BAKANO
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-2 md:p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total des revenus
                </CardTitle>
                <BadgeCent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {totalFinancialSummary.totalPaid.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'MAD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mois en cours (tous les groupes)
                </p>
              </CardContent>
            </Card>
            <Card 
              onClick={() => setShowOnlyUnpaid(!showOnlyUnpaid)}
              className={`cursor-pointer transition-colors ${showOnlyUnpaid ? 'ring-2 ring-destructive' : 'hover:bg-muted/50'}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  À encaisser ({groups.find(g => g.id === selectedGroupId)?.name})
                </CardTitle>
                <BadgeCent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold text-destructive">
                  {financialSummary.totalUnpaid.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'MAD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {showOnlyUnpaid ? 'Filtre activé' : 'Mois en cours (groupe sél.)'}
                </p>
              </CardContent>
            </Card>
            <Card>
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
                  size="sm"
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Générer
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Analyse du mois dernier.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total des élèves
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {totalStudentsCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Inscrits dans tous les groupes
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    Suivi des présences et paiements
                    {showOnlyUnpaid && <Badge variant="destructive">Élèves non payés</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {`Prochaine séance le ${format(getNextSessionDate, 'eeee d MMMM', { locale: fr })}`}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <AddStudentDialog 
                    onAddStudent={addStudent} 
                    groups={groups} 
                    defaultGroupId={selectedGroupId}
                  />
                  <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sélectionner un groupe" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map(group => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-base md:text-lg capitalize text-center w-[130px]">
                      {format(currentDate, 'MMMM yy', { locale: fr })}
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
              </div>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ScrollArea>
                <Table className="text-xs md:text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] min-w-[120px] px-2 md:px-4">
                        Élève
                      </TableHead>
                      <TableHead className="text-center px-1 md:px-4">
                        Présence (Proch. séance)
                      </TableHead>
                      <TableHead className="text-center px-2 md:px-4">Paiement</TableHead>
                      <TableHead className="text-right px-2 md:px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => {
                      const currentMonthStr = format(currentDate, 'yyyy-MM');
                      const joinMonth = format(student.joinDate, 'yyyy-MM');
                      if (joinMonth > currentMonthStr) return null;

                      const paymentStatus =
                        student.payments[currentMonthStr] ?? 'unpaid';
                      
                      const dateStr = format(getNextSessionDate, 'yyyy-MM-dd');
                      const attendanceStatus = student.attendance[dateStr];

                      const absencesInCurrentMonth = Object.entries(student.attendance).filter(([date, status]) => 
                        isSameMonth(new Date(date), currentDate) && status === 'absent'
                      ).length;

                      return (
                        <TableRow key={student.id} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium px-2 md:px-4">
                            <div className="flex items-center gap-2">
                              {absencesInCurrentMonth > 3 ? (
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                              ) : (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: absencesInCurrentMonth }).map((_, i) => (
                                    <Circle key={i} className="h-2 w-2 text-orange-400 fill-current" />
                                  ))}
                                </div>
                              )}
                              <span>{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center px-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 md:h-10 md:w-10"
                                onClick={() =>
                                  toggleAttendance(
                                    student.id,
                                    getNextSessionDate,
                                    attendanceStatus
                                  )
                                }
                                aria-label={`Marquer la présence pour ${student.name} le ${dateStr}`}
                              >
                                <AttendanceIcon status={attendanceStatus} />
                              </Button>
                            </TableCell>
                          <TableCell className="text-center px-2 md:px-4">
                            <Button
                                variant={
                                  paymentStatus === 'paid' ? 'secondary' : 'outline'
                                }
                                size="sm"
                                className={`text-xs h-8 ${paymentStatus === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
                                onClick={() => togglePayment(student.id)}
                              >
                                {paymentStatus === 'paid' ? (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Payé
                                  </>
                                ) : 'Marquer payé'}
                              </Button>
                          </TableCell>
                          <TableCell className="text-right px-2 md:px-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
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

      <Dialog open={!!report} onOpenChange={(open) => !open && setReport(null)}>
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
