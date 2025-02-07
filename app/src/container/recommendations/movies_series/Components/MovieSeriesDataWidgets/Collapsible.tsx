import type React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="border border-gray-200 rounded-lg overflow-hidden"
      >
        <AccordionTrigger
          noHoverUnderline
          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        >
          <span className="font-semibold text-gray-700">{title}</span>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-white">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Collapsible;
