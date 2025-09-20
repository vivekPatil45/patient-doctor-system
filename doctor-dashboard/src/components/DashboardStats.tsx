import React, { type SVGProps } from 'react';
import { 
    Calendar, 
    CheckCircle, 
    Clock, 
    FileText, 
    TrendingUp,
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const  StatsCard = ({ title, value, icon: Icon, color, bgColor, change, trend }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center space-x-1 mt-2 ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

interface DoctorStatsProps {
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  totalPrescriptions: number;
}

export function DoctorStats({ 
  totalAppointments, 
  scheduledAppointments, 
  completedAppointments, 
  totalPrescriptions 
}: DoctorStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Appointments"
        value={totalAppointments}
        icon={Calendar}
        color="text-blue-600"
        bgColor="bg-blue-100"
        change="+12% from last month"
        trend="up"
      />
      <StatsCard
        title="Scheduled Today"
        value={scheduledAppointments}
        icon={Clock}
        color="text-yellow-600"
        bgColor="bg-yellow-100"
      />
      <StatsCard
        title="Completed"
        value={completedAppointments}
        icon={CheckCircle}
        color="text-green-600"
        bgColor="bg-green-100"
        change="+8% from last week"
        trend="up"
      />
      <StatsCard
        title="Prescriptions"
        value={totalPrescriptions}
        icon={FileText}
        color="text-indigo-600"
        bgColor="bg-indigo-100"
      />
    </div>
  );
}

interface PatientStatsProps {
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  totalPrescriptions: number;
}

export function PatientStats({ 
  totalAppointments, 
  scheduledAppointments, 
  completedAppointments, 
  totalPrescriptions 
}: PatientStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Appointments"
        value={totalAppointments}
        icon={Calendar}
        color="text-purple-600"
        bgColor="bg-purple-100"
      />
      <StatsCard
        title="Upcoming"
        value={scheduledAppointments}
        icon={Clock}
        color="text-orange-600"
        bgColor="bg-orange-100"
      />
      <StatsCard
        title="Completed"
        value={completedAppointments}
        icon={CheckCircle}
        color="text-green-600"
        bgColor="bg-green-100"
      />
      <StatsCard
        title="Prescriptions"
        value={totalPrescriptions}
        icon={FileText}
        color="text-pink-600"
        bgColor="bg-pink-100"
      />
    </div>
  );
}