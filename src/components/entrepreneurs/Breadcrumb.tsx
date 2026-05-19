import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string; // undefined means current page (not clickable)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-600 transition-colors hover:text-[#C8102E]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-[#1C1C1E]">{item.label}</span>
              )}

              {!isLast && <ChevronRight className="h-4 w-4 text-gray-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
