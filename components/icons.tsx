import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Coins,
  Compass,
  Flame,
  Globe2,
  GraduationCap,
  HeartHandshake,
  House,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Orbit,
  Phone,
  Play,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
  Gem,
} from "lucide-react";

const icons = {
  arrow: ArrowRight,
  "arrow-up": ArrowUpRight,
  "arrow-down": ArrowDown,
  book: BookOpen,
  briefcase: BriefcaseBusiness,
  check: Check,
  "check-circle": CheckCircle2,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
  circle: Circle,
  clock: Clock3,
  coins: Coins,
  compass: Compass,
  flame: Flame,
  globe: Globe2,
  graduation: GraduationCap,
  heart: HeartHandshake,
  home: House,
  leaf: Leaf,
  mail: Mail,
  pin: MapPin,
  menu: Menu,
  message: MessageCircle,
  moon: Moon,
  orbit: Orbit,
  phone: Phone,
  play: Play,
  scale: Scale,
  search: Search,
  shield: ShieldCheck,
  stars: Sparkles,
  sun: Sun,
  close: X,
  gem: Gem,
};

export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Component = icons[name as keyof typeof icons] || Sparkles;
  return (
    <Component
      size={size}
      strokeWidth={1.55}
      className={className}
      aria-hidden="true"
    />
  );
}

export function SunMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="15" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="40" cy="40" r="21" stroke="currentColor" strokeWidth=".6" />
      <path
        d="M40 31v18m-9-9h18M34 34l12 12m0-12L34 46"
        stroke="currentColor"
        strokeWidth=".8"
      />
      {Array.from({ length: 16 }, (_, i) => (
        <path
          key={i}
          d="M40 9l-2 13h4L40 9Z"
          stroke="currentColor"
          strokeWidth=".8"
          transform={`rotate(${i * 22.5} 40 40)`}
        />
      ))}
    </svg>
  );
}

export function ZodiacWheel({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="300"
        cy="300"
        r="288"
        stroke="currentColor"
        strokeWidth=".7"
      />
      <circle
        cx="300"
        cy="300"
        r="276"
        stroke="currentColor"
        strokeWidth=".5"
      />
      <circle
        cx="300"
        cy="300"
        r="224"
        stroke="currentColor"
        strokeWidth=".7"
      />
      <circle
        cx="300"
        cy="300"
        r="180"
        stroke="currentColor"
        strokeWidth=".5"
      />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 30} 300 300)`}>
          <path
            d="M300 13v62M300 76v44"
            stroke="currentColor"
            strokeWidth=".65"
          />
          <path d="m300 32 3 7-3 7-3-7 3-7Z" fill="currentColor" />
        </g>
      ))}
      {Array.from({ length: 72 }, (_, i) => (
        <path
          key={i}
          d="M300 18v5"
          stroke="currentColor"
          strokeWidth=".8"
          transform={`rotate(${i * 5} 300 300)`}
        />
      ))}
      <path
        d="m300 119 157 272H143L300 119Zm0 362L143 209h314L300 481Z"
        stroke="currentColor"
        strokeWidth=".55"
      />
      <circle
        cx="300"
        cy="300"
        r="104"
        stroke="currentColor"
        strokeWidth=".6"
      />
    </svg>
  );
}
