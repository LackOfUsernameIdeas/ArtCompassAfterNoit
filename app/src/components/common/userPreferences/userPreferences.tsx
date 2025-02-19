import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Users,
  Zap,
  Brain,
  Globe,
  Calendar,
  Smile,
  Clapperboard,
  Pen,
  Target,
  MessageSquareHeart,
  List
} from "lucide-react";

interface Preference {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface UserPreferences {
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
      icon: <List className="h-4 w-4" />
    },
    {
      label: "Настроение",
      value: preferences.mood,
      icon: <Smile className="h-4 w-4" />
    },
    {
      label: "Време за гледане",
      value: preferences.timeAvailability,
      icon: <Clock className="h-4 w-4" />
    },
    {
      label: "Време на създаване",
      value: preferences.preferred_age,
      icon: <Pen className="h-4 w-4" />
    },
    {
      label: "Тип",
      value: preferences.preferred_type,
      icon: <Clapperboard className="h-4 w-4" />
    },
    {
      label: "Актьори",
      value: preferences.preferred_actors,
      icon: <Users className="h-4 w-4" />
    },
    {
      label: "Режисьори",
      value: preferences.preferred_directors,
      icon: <Users className="h-4 w-4" />
    },
    {
      label: "Държави",
      value: preferences.preferred_countries,
      icon: <Globe className="h-4 w-4" />
    },
    {
      label: "Темпо на развитие на сюжета",
      value: preferences.preferred_pacing,
      icon: <Zap className="h-4 w-4" />
    },
    {
      label: "Ниво на задълбочаване",
      value: preferences.preferred_depth,
      icon: <Brain className="h-4 w-4" />
    },
    {
      label: "Целева група",
      value: preferences.preferred_target_group,
      icon: <Target className="h-4 w-4" />
    },
    {
      label: "Интереси",
      value: preferences.interests || "Не е зададено",
      icon: <MessageSquareHeart className="h-4 w-4" />
    }
  ];

  return (
    <Card className="w-full mx-auto my-4 bg-bodybg dark:border-black/10 shadow-lg dark:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
        <CardTitle className="text-2xl font-bold text-defaulttextcolor dark:text-white/80">
          Последно регистрирани предпочитания
        </CardTitle>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(preferences.date).toLocaleString("bg-BG")}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-2">
          {preferenceItems.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-bodybg2 p-3 rounded-md shadow-sm flex items-center max-w-[69rem]"
            >
              <div className="flex items-center w-1/3">
                {item.icon}
                <span className="ml-2 font-semibold text-sm">{item.label}</span>
              </div>
              <div
                title={item.value || "Не е зададено"}
                className="w-2/3 text-sm text-defaulttextcolor dark:text-white/80 truncate"
              >
                {item.value || "Не е зададено"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
