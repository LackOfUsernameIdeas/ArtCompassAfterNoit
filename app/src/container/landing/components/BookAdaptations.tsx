import { Card, CardContent } from "@/components/ui/card";
import { Clapperboard, Tv } from "lucide-react";

interface BookAdaptationsProps {
  movieAdaptations: number;
  seriesAdaptations: number;
}

export default function BookAdaptations({
  movieAdaptations,
  seriesAdaptations
}: BookAdaptationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card className="overflow-hidden border-2 !border-primary">
        <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-primary/25">
          <div className="flex items-center mb-4">
            <div className="bg-primary/20 dark:bg-primary/40 p-3 rounded-full mr-4">
              <Clapperboard className="h-6 w-6 text-primary dark:text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground">
              Филмови адаптации
            </h3>
          </div>
          <p className="text-sm text-primary/70 dark:text-primary-foreground/70 mb-2">
            Брой книги, адаптирани във филми
          </p>
          <p className="text-5xl font-bold text-primary dark:text-primary-foreground font-mono">
            {movieAdaptations}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-2 !border-secondary">
        <CardContent className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/25">
          <div className="flex items-center mb-4">
            <div className="bg-secondary/20 dark:bg-secondary/40 p-3 rounded-full mr-4">
              <Tv className="h-6 w-6 text-secondary dark:text-secondary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-secondary dark:text-secondary-foreground">
              Сериални адаптации
            </h3>
          </div>
          <p className="text-sm text-secondary/70 dark:text-secondary-foreground/70 mb-2">
            Брой книги, адаптирани в сериали
          </p>
          <p className="text-5xl font-bold text-secondary dark:text-secondary-foreground font-mono">
            {seriesAdaptations}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
