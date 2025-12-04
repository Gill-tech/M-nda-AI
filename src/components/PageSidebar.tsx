import { ReactNode, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarSection {
  id: string;
  title: string;
  icon: LucideIcon;
  content: ReactNode;
  value?: string | number;
  status?: "good" | "warning" | "danger" | "neutral";
}

interface PageSidebarProps {
  sections: SidebarSection[];
  title?: string;
  className?: string;
}

export function PageSidebar({ sections, title, className }: PageSidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "good": return "text-success bg-success/10 border-success/30";
      case "warning": return "text-warning bg-warning/10 border-warning/30";
      case "danger": return "text-destructive bg-destructive/10 border-destructive/30";
      default: return "text-primary bg-primary/10 border-primary/30";
    }
  };

  return (
    <div className={cn("bg-card rounded-xl border p-4", className)}>
      {title && (
        <h3 className="font-semibold text-foreground mb-4 text-lg">{title}</h3>
      )}
      <Accordion 
        type="multiple" 
        value={openSections} 
        onValueChange={setOpenSections}
        className="space-y-2"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <AccordionItem 
              key={section.id} 
              value={section.id}
              className="border rounded-lg px-3 bg-background/50 hover:bg-background transition-colors"
            >
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center border",
                    getStatusColor(section.status)
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-foreground">{section.title}</p>
                    {section.value !== undefined && (
                      <p className="text-xs text-muted-foreground">{section.value}</p>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
