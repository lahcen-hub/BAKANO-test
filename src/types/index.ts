export type AttendanceStatus = 'present' | 'absent';

export type PaymentStatus = 'paid' | 'unpaid';

export type Student = {
  id: string;
  name: string;
  joinDate: Date;
  attendance: { [date: string]: AttendanceStatus };
  payments: { [month: string]: PaymentStatus };
  monthlyFee: number;
};
