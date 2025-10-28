import React from "react";
import {
  LucideProps,
  Building2,
  Megaphone,
  Users,
  GraduationCap,
  Briefcase,
  Target,
  UserCheck,
  UserPlus,
  Rocket,
  ChartLine,
  Building,
  University,
  Headphones,
  BookOpen,
  Handshake,
  Cpu,
  CircleDollarSign,
} from "lucide-react";

const ICONS = {
  Building2: Building2,
  Building: Building,
  Megaphone: Megaphone,
  Users: Users,
  GraduationCap: GraduationCap,
  Briefcase: Briefcase,
  Target: Target,
  UserCheck: UserCheck,
  UserPlus: UserPlus,
  Rocket: Rocket,
  ChartLine: ChartLine,
  University: University,
  Headphones: Headphones,
  BookOpen: BookOpen,
  Handshake: Handshake,
  Cpu: Cpu,
  CircleDollarSign: CircleDollarSign,
};

type IconKey = keyof typeof ICONS;

type IconProps = LucideProps & {
  name: string | undefined;
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = name && name in ICONS ? ICONS[name as IconKey] : Target;
  return <IconComponent {...props} />;
};
