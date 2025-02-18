import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Clock,
  Film,
  Users,
  Zap,
  Brain,
  Globe,
  User,
  Calendar
} from "lucide-react";

interface Preference {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface UserPreferences {
  preferred_genres_en: string;
  preferred_genres_bg: string;
  mood: string;
  timeAvailability: string;
  preferred_age: string;
  preferred_type: string;
  preferred_actors: string;
  preferred_directors: string;
  preferred_countries: string;
  preferred_pacing: string;
  preferred_depth: string;
  preferred_target_group: string;
  interests: string | null;
  date: string;
}

export default function UserPreferences({
  preferences
}: {
  preferences: UserPreferences;
}) {
  const preferenceItems: Preference[] = [
    {
      label: "Жанрове",
      value: preferences.preferred_genres_bg,
      icon: <Film className="h-5 w-5" />
    },
    {
      label: "Време",
      value: preferences.timeAvailability,
      icon: <Clock className="h-5 w-5" />
    },
    {
      label: "Тип",
      value: preferences.preferred_type,
      icon: <Film className="h-5 w-5" />
    },
    {
      label: "Целева група",
      value: preferences.preferred_target_group,
      icon: <User className="h-5 w-5" />
    }
  ];

  const additionalPreferences: Preference[] = [
    {
      label: "Актьори",
      value: preferences.preferred_actors,
      icon: <Users className="h-5 w-5" />
    },
    {
      label: "Режисьори",
      value: preferences.preferred_directors,
      icon: <Users className="h-5 w-5" />
    },
    {
      label: "Държави",
      value: preferences.preferred_countries,
      icon: <Globe className="h-5 w-5" />
    },
    {
      label: "Темпо",
      value: preferences.preferred_pacing,
      icon: <Zap className="h-5 w-5" />
    },
    {
      label: "Дълбочина",
      value: preferences.preferred_depth,
      icon: <Brain className="h-5 w-5" />
    }
  ];

  return (
    <Card className="w-full mx-auto mb-4 bg-bodybg dark:border-black/10 shadow-lg dark:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-3xl font-bold opsilion text-defaulttextcolor dark:text-white/80">
          Последни предпочитания
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(preferences.date).toLocaleString("bg-BG")}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {preferenceItems.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-bodybg2 p-4 rounded-lg shadow"
            >
              <div className="flex items-center mb-2">
                {item.icon}
                <span className="ml-2 font-semibold">{item.label}</span>
              </div>
              <div className="text-lg text-defaulttextcolor dark:text-white/80">
                {item.value || "Не е зададено"}
              </div>
            </div>
          ))}
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="additional-preferences">
            <AccordionTrigger className="text-xl font-semibold opsilion">
              Допълнителни предпочитания
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {additionalPreferences.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {item.icon}
                    <span className="font-semibold">{item.label}:</span>
                    <span>{item.value || "Не е зададено"}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-6">
          <span className="font-semibold mr-2 text-lg">Жанрове (EN):</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.preferred_genres_en.split(", ").map((genre, index) => (
              <Badge key={index} variant="default" className="text-sm">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
