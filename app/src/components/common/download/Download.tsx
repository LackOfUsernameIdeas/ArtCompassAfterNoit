import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  fileName: string | null;
  className?: string;
}

export default function DownloadButton({
  fileName,
  className
}: DownloadButtonProps) {
  if (!fileName) return null;

  return (
    <a
      href={`https://noit.eu/${fileName}`}
      download
      className={cn(
        "mt-4 inline-flex items-center gap-3 rounded-md bg-[#32ab56] px-5 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-[#2c984c] hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2c984c]/50 active:translate-y-[1px] active:shadow-sm",
        className
      )}
    >
      <Download className="h-5 w-5" strokeWidth={2} />
      <span className="font-semibold tracking-wide">Свали програмата</span>
    </a>
  );
}
