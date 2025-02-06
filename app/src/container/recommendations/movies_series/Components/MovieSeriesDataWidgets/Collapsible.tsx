import type React from "react";
import { useState } from "react";

interface CollapsibleProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-4 py-2 bg-gray-50 text-left font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <i
          className={`ti ${
            isOpen ? "ti-chevron-up" : "ti-chevron-down"
          } text-gray-600 text-lg`}
        ></i>
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
};

export default Collapsible;
