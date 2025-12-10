import {
  Calculator,
  FlaskConical,
  Languages,
  Bike,
  Palette,
  Atom,
  BookOpen,
  Scale,
  Code,
  Music,
  HeartPulse,
  TrendingUp,
  Brain,
  Globe,
  HelpCircle,
  School,
  ClipboardCheck,
  Search,
  Hammer,
  type LucideProps,
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  Calculator,
  FlaskConical,
  Languages,
  Bike,
  Palette,
  Atom,
  BookOpen,
  Scale,
  Code,
  Music,
  HeartPulse,
  TrendingUp,
  Brain,
  Globe,
  School,
  ClipboardCheck,
  Search,
  Hammer,
};

export function getIconComponent(iconName: string): React.FC<LucideProps> {
  return iconMap[iconName] || HelpCircle;
}

export function renderCategoryIcon(iconName: string, size: number = 40) {
  const IconComponent = getIconComponent(iconName);
  return <IconComponent size={size} />;
}
