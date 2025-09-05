'use client';

import { useState, useMemo, type FC, useEffect } from 'react';
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
  getDaysInMonth,
  nextDay,
  isThisWeek,
  subDays,
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
  Download,
  Search,
  UserPlus,
  Pencil,
} from 'lucide-react';
import { AddStudentDialog } from '@/components/add-student-dialog';
import { AddGroupDialog } from '@/components/add-group-dialog';
import { useToast } from '@/hooks/use-toast';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { EditStudentDialog } from '@/components/edit-student-dialog';
import { EditGroupDialog } from '@/components/edit-group-dialog';


const initialGroups: Group[] = [
  {
    id: 'groupe-1',
    name: 'Groupe 1',
    sessionDays: [2, 5], // Tuesday, Friday
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
    sessionDays: [2, 5], // Tuesday, Friday
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
  sessionDays: number[]; // 0 for Sunday, 1 for Monday, etc.
};


const AttendanceIcon: FC<{ status?: AttendanceStatus }> = ({ status }) => {
  if (status === 'present')
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === 'absent') return <XCircle className="h-5 w-5 text-red-500" />;
  return <Circle className="h-5 w-5 text-muted-foreground" />;
};


export default function Home() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroupId, setSelectedGroupId] = useState<string>('groupe-1');
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [showOnlyUnpaid, setShowOnlyUnpaid] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedGroups = localStorage.getItem('bakano-groups');
      if (savedGroups) {
        const parsedGroups = JSON.parse(savedGroups, (key, value) => {
          if (key === 'joinDate' && value) {
            return new Date(value);
          }
          if (key === 'sessionDays' && !value) {
            return [2, 5]; // Default session days
          }
          return value;
        });
        setGroups(parsedGroups);
      } else {
        setGroups(initialGroups);
      }
    } catch (error) {
      console.error("Could not load groups from localStorage", error);
      setGroups(initialGroups);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('bakano-groups', JSON.stringify(groups));
      } catch (error) {
        console.error("Could not save groups to localStorage", error);
      }
    }
  }, [groups, isHydrated]);

  useEffect(() => {
    if (isHydrated && groups.length > 0 && !groups.find(g => g.id === selectedGroupId)) {
      setSelectedGroupId(groups[0].id);
    }
  }, [isHydrated, groups, selectedGroupId]);

  const selectedGroup = useMemo(() => {
    if (!isHydrated) return null;
    return groups.find(g => g.id === selectedGroupId) ?? null;
  }, [groups, selectedGroupId, isHydrated]);


  const students = useMemo(() => {
    if (!selectedGroup) return [];
    
    let filteredStudents = selectedGroup.students;

    if (searchQuery) {
      filteredStudents = filteredStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (showOnlyUnpaid) {
      const currentMonthStr = format(currentDate, 'yyyy-MM');
      filteredStudents = filteredStudents.filter(student => {
        const paymentStatus = student.payments[currentMonthStr] ?? 'unpaid';
        return paymentStatus === 'unpaid';
      });
    }
    
    return filteredStudents;
  }, [selectedGroup, showOnlyUnpaid, currentDate, searchQuery]);

  const totalStudentsCount = useMemo(() => {
    if (!isHydrated) return 0;
    return groups.reduce((total, group) => total + group.students.length, 0);
  }, [groups, isHydrated]);

  const totalFinancialSummary = useMemo(() => {
    if (!isHydrated) return { totalPaid: 0 };
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
  }, [groups, currentDate, isHydrated]);

  const financialSummary = useMemo(() => {
    if (!selectedGroup) return { totalPaid: 0, totalUnpaid: 0, potentialRevenue: 0 };
    const currentMonthStr = format(currentDate, 'yyyy-MM');
    let totalPaid = 0;
    let totalUnpaid = 0;
    let potentialRevenue = 0;

    selectedGroup.students.forEach(student => {
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
  }, [selectedGroup, currentDate]);

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

  const updateStudentName = (studentId: string, newName: string) => {
    setGroups(prevGroups => prevGroups.map(group => ({
      ...group,
      students: group.students.map(s => 
        s.id === studentId ? { ...s, name: newName } : s
      )
    })));
    toast({
      title: "Nom de l'élève modifié",
      description: `Le nom a été changé en ${newName}.`,
    });
  };

  const addGroup = (name: string, sessionDays: number[]) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      students: [],
      sessionDays,
    };
    
    setGroups(prevGroups => {
      const newGroups = [...prevGroups, newGroup];
      setSelectedGroupId(newGroup.id);
      return newGroups;
    });

    toast({
      title: 'Groupe ajouté',
      description: `Le groupe "${name}" a été créé.`,
    });
  };

  const updateGroup = (groupId: string, newName: string, sessionDays: number[]) => {
    setGroups(prevGroups => prevGroups.map(group => 
      group.id === groupId ? { ...group, name: newName, sessionDays: sessionDays } : group
    ));
    toast({
      title: 'Groupe modifié',
      description: `Le groupe "${newName}" a été mis à jour.`,
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

  const handleDownloadReport = () => {
    if (!selectedGroup) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un groupe pour télécharger le rapport.',
        variant: 'destructive',
      });
      return;
    }
  
    const doc = new jsPDF();
    const monthStr = format(currentDate, 'yyyy-MM');
    const monthStrFormatted = format(currentDate, 'MMMM yyyy', { locale: fr });
    
    doc.setFontSize(18);
    doc.text(`Rapport pour ${selectedGroup.name} - ${monthStrFormatted}`, 14, 22);
    
    const head: any[] = [
      "Nom de l'eleve",
      "Paiement",
      "Absences",
    ];
    
    const monthDates: Date[] = [];
    const sessionDays = selectedGroup.sessionDays || [];
    const start = startOfMonth(currentDate);
    const end = addMonths(start, 1);

    const daysInInterval = eachDayOfInterval({ start, end: subDays(end, 1) });
    
    daysInInterval.forEach(day => {
        if (sessionDays.includes(day.getDay())) {
            monthDates.push(day);
        }
    });

    const tableHead = [
      ...head,
      ...monthDates.map(d => format(d, 'dd/MM'))
    ];
    
    const tableBody: any[] = [];

    selectedGroup.students.forEach(student => {
        const joinMonth = format(student.joinDate, 'yyyy-MM');
        if (joinMonth > monthStr) return;

        const paymentStatus = student.payments[monthStr] === 'paid' ? 'Payé' : 'Non Payé';
        
        let absencesInMonth = 0;
        const attendanceRow = monthDates.map(d => {
            const dateStr = format(d, 'yyyy-MM-dd');
            const status = student.attendance[dateStr];
            if (isBefore(d, student.joinDate)) return '-';
            
            if (isSameMonth(new Date(dateStr), currentDate) && status === 'absent') {
                absencesInMonth++;
            }
            if (status === 'absent') return 'A'; // Absent
            if (status === 'present') return 'P'; // Present
            return ''; // Empty for future or no status
        });

        tableBody.push([
            student.name,
            paymentStatus,
            absencesInMonth.toString(),
            ...attendanceRow
        ]);
    });

    if (tableBody.length > 0) {
        (doc as any).autoTable({
            head: [tableHead],
            body: tableBody,
            startY: 30,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { font: 'helvetica', fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 15 },
                2: { cellWidth: 15, halign: 'center' },
            }
        });
    } else {
        doc.text("Aucun élève dans ce groupe pour le mois sélectionné.", 14, 40);
    }
    
    const reportFileName = `rapport_${selectedGroup.name.replace(/ /g, '_')}_${format(currentDate, 'MMMM_yyyy', { locale: fr })}.pdf`;
    doc.save(reportFileName);

    toast({
        title: 'Rapport téléchargé',
        description: `${reportFileName} a été téléchargé.`,
    });
  };


  const getNextSessionDate = useMemo(() => {
    if (!selectedGroup || !selectedGroup.sessionDays || selectedGroup.sessionDays.length === 0) return new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDays = selectedGroup.sessionDays.slice().sort((a, b) => a - b);
    
    for(let i=0; i<7; i++){
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      if(sessionDays.includes(nextDate.getDay())){
        return nextDate;
      }
    }

    return today;
  }, [selectedGroup]);

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
                  À encaisser ({selectedGroup?.name ?? ''})
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
                  {showOnlyUnpaid ? 'Filtre activé, cliquez pour retirer' : 'Cliquez pour filtrer les non payés'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rapport Mensuel</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <Button
                      onClick={handleDownloadReport}
                      className="w-full"
                      size="sm"
                      disabled={!isHydrated || !selectedGroup}
                  >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger PDF
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                      Rapport pour {selectedGroup?.name ?? '...'}
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
                <div className="text-xl md:text-2xl font-bold">{totalStudentsCount}</div>
                 <div className="flex gap-2 mt-2">
                  <AddStudentDialog 
                    onAddStudent={addStudent} 
                    groups={groups} 
                    defaultGroupId={selectedGroupId}
                    disabled={!isHydrated}
                  />
                  <AddGroupDialog onAddGroup={addGroup} disabled={!isHydrated} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    Suivi des présences et paiements
                    <Badge>{`${selectedGroup?.name ?? 'Chargement...'}`}</Badge>
                    {showOnlyUnpaid && <Badge variant="destructive">Élèves non payés</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {isHydrated && selectedGroup ? `Prochaine séance le ${format(getNextSessionDate, 'eeee d MMMM', { locale: fr })}` : 'Chargement...'}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                   <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      disabled={!isHydrated}
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
                      disabled={!isHydrated || isSameMonth(currentDate, new Date())}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 w-full sm:w-auto">
                    <Select value={selectedGroupId} onValueChange={setSelectedGroupId} disabled={!isHydrated}>
                      <SelectTrigger className="w-full">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setGroupToEdit(selectedGroup)}
                      disabled={!selectedGroup}
                      className="shrink-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un élève..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-[200px]"
                      disabled={!isHydrated}
                    />
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
                    {!isHydrated ? (
                      Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4}>
                            <Skeleton className="h-8 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      students.map(student => {
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
                                  <TooltipProvider>
                                      <Tooltip>
                                          <TooltipTrigger>
                                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                              <p>{absencesInCurrentMonth} absences ce mois-ci</p>
                                          </TooltipContent>
                                      </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <div className="flex items-center gap-1 min-w-[36px]">
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
                                  disabled={!selectedGroup}
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
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setStudentToEdit(student)}
                                >
                                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setStudentToDelete(student.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>

      {studentToEdit && (
        <EditStudentDialog
          student={studentToEdit}
          onUpdateStudent={(studentId, newName) => {
            updateStudentName(studentId, newName);
            setStudentToEdit(null);
          }}
          open={!!studentToEdit}
          onOpenChange={(open) => !open && setStudentToEdit(null)}
        />
      )}

      {groupToEdit && (
        <EditGroupDialog
          group={groupToEdit}
          onUpdateGroup={(groupId, newName, sessionDays) => {
            updateGroup(groupId, newName, sessionDays);
            setGroupToEdit(null);
          }}
          open={!!groupToEdit}
          onOpenChange={(open) => !open && setGroupToEdit(null)}
        />
      )}

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
