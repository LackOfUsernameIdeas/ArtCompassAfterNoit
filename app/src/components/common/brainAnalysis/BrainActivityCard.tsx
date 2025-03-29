import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { BrainData } from "@/container/types_common";
import AnimatedValue from "../animatedValue/AnimatedValue";
import { InfoboxModal } from "../infobox/InfoboxModal";
import Infobox from "../infobox/infobox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface BrainActivityCardProps {
  data: BrainData | null;
}

const BrainActivityCard: React.FC<BrainActivityCardProps> = ({ data }) => {
  const prevValidData = useRef<BrainData | null>(null);

  // Състояние за следене на стойностите и техните анимационни ключове
  const [currentAttention, setCurrentAttention] = useState<number>(0);
  const [attentionKey, setAttentionKey] = useState<number>(0);
  const [currentMeditation, setCurrentMeditation] = useState<number>(0);
  const [meditationKey, setMeditationKey] = useState<number>(0);
  const [brainWaveValues, setBrainWaveValues] = useState<
    Record<string, { value: number; key: number }>
  >({});

  // State за отваряне/затваряне на InfoBox
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Конфигурация на мозъчните вълни с цветове и ключове
  const brainWaveConfig: Array<{
    key: keyof BrainData;
    title: string;
    color: string;
  }> = [
    { key: "delta", title: "Delta", color: "#8884d8" },
    { key: "theta", title: "Theta", color: "#82ca9d" },
    { key: "lowAlpha", title: "Low Alpha", color: "#ffc658" },
    { key: "highAlpha", title: "High Alpha", color: "#ff8042" },
    { key: "lowBeta", title: "Low Beta", color: "#0088FE" },
    { key: "highBeta", title: "High Beta", color: "#00C49F" },
    { key: "lowGamma", title: "Low Gamma", color: "#FFBB28" },
    { key: "highGamma", title: "High Gamma", color: "#FF8042" }
  ];

  // Актуализиране на стойностите с управление на анимационните ключове
  useEffect(() => {
    if (!data) return;

    // Актуализиране на стойността за Attention
    const newAttention = Math.round(Number(data.attention) || 0);
    if (newAttention !== currentAttention) {
      setCurrentAttention(newAttention);
      setAttentionKey((prev) => prev + 1);
    }

    // Актуализиране на стойността за Meditation
    const newMeditation = Math.round(Number(data.meditation) || 0);
    if (newMeditation !== currentMeditation) {
      setCurrentMeditation(newMeditation);
      setMeditationKey((prev) => prev + 1);
    }

    // Актуализиране на стойностите за мозъчните вълни
    const newBrainWaveValues = brainWaveConfig.reduce((acc, wave) => {
      const newValue = Math.round(Number(data[wave.key]) || 0);
      const existingValue = brainWaveValues[wave.key]?.value;

      if (newValue !== existingValue) {
        acc[wave.key] = {
          value: newValue,
          key: (brainWaveValues[wave.key]?.key || 0) + 1
        };
      } else {
        acc[wave.key] = brainWaveValues[wave.key];
      }

      return acc;
    }, {} as Record<string, { value: number; key: number }>);

    setBrainWaveValues(newBrainWaveValues);
  }, [data]);

  // Проверка за валидни данни
  const shouldKeepPreviousData =
    data && brainWaveConfig.every(({ key }) => data[key] === 0);

  // Функция за отваряне/затваряне на InfoBox
  const handleInfoButtonClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  if (!shouldKeepPreviousData && data) {
    prevValidData.current = data;
  }

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-black dark:bg-opacity-30 rounded-xl p-4 shadow-md dark:shadow-lg dark:backdrop-blur-sm border border-gray-200 dark:border-transparent">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <div className="flex items-center gap-2">
          <i className="text-xl text-primary ti ti-brain" />
          <span className="leading-none">
            Вашата мозъчна активност в реално време
          </span>
          <Infobox onClick={handleInfoButtonClick} />
        </div>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-black dark:bg-opacity-30 rounded-lg p-3 border border-gray-200 dark:border-transparent">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Attention
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#e5e7eb"
                    className="dark:stroke-[#374151]"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    strokeDasharray={`${2.83 * (currentAttention || 0)} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute text-lg font-semibold">
                  <AnimatedValue
                    key={attentionKey}
                    value={currentAttention}
                    color="#f59e0b"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Meditation
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#e5e7eb"
                    className="dark:stroke-[#374151]"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#0ea5e9"
                    strokeWidth="8"
                    strokeDasharray={`${2.83 * (currentMeditation || 0)} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute text-lg font-semibold">
                  <AnimatedValue
                    key={meditationKey}
                    value={currentMeditation}
                    color="#0ea5e9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-black dark:bg-opacity-30 rounded-lg p-3 flex flex-col h-full border border-gray-200 dark:border-transparent">
          <div>
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <i className="mr-1 text-xl text-primary ti ti-wave-sine" />
              <span>Мозъчни вълни</span>
            </h4>
          </div>
          <div className="flex-grow"></div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-1">
            {brainWaveConfig.map((wave) => (
              <div key={wave.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate mr-1">
                  {wave.title}
                </span>
                <AnimatedValue
                  small
                  key={brainWaveValues[wave.key]?.key || 0}
                  value={brainWaveValues[wave.key]?.value || 0}
                  color={wave.color}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <InfoboxModal
        onClick={handleInfoButtonClick}
        isModalOpen={isModalOpen}
        title="Мозъчна активност"
        description={
          <>
            <p>
              <span className="font-semibold">Мозъчните вълни</span> са
              електрически сигнали, генерирани от милиардите неврони в мозъка.
              Те се анализират чрез т.нар.{" "}
              <span className="font-semibold">
                спектрална плътност на мощността (Power Spectral Density или
                PSD)
              </span>
              , която показва как{" "}
              <span className="font-semibold">енергията (силата)</span> на
              вълните е разпределена в различни честотни диапазони. Всеки един
              от тях е кръстен с буква от гръцката азбука. Диапазоните могат да
              се разделят и на поддиапазони{" "}
              <span className="font-semibold">(Low и High)</span>. Освен
              мозъчните вълни, съществуват и специализирани алгоритми,
              разработени от <span className="font-semibold">NeuroSky</span>,
              които анализират мозъчната дейност и извличат полезни показатели -
              <span className="font-semibold">
                Attention (Измерване на вниманието)
              </span>{" "}
              и{" "}
              <span className="font-semibold">
                Mediation (Измерване на медитативното състояние)
              </span>
              .
            </p>
            <Accordion type="single" collapsible className="space-y-4 pt-5">
              <AccordionItem value="delta">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">Δ</span> Delta вълни
                    (0-4 Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Вълните с най-ниска честота са{" "}
                  <span className="font-semibold">Делта δ (0-4Hz)</span> –
                  когато имаме най-ниски нива на мозъчна активност. При
                  по-високи стойности на проявление на Делта вълните, в
                  сравнение с останалите, е характерно състояние, при което
                  човек е{" "}
                  <span className="font-semibold">
                    изключително отпуснат или дори заспал
                  </span>
                  . Човешкият мозък увеличава делта вълните, за да намали
                  съзнанието за физическия свят около него.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="theta">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">Θ</span> Theta вълни
                    (4-7 Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="font-semibold">Тета θ (4-7Hz)</span> вълните
                  се проявяват при по-високи, но все още сравнително ниски нива
                  на мозъчна активност. При по-високи стойности на Тета вълни, в
                  сравнение с останалите, е характерно състояние, при което
                  човек е <span className="font-semibold">по-отпуснат</span>.
                  Освен това, тези вълни са силно свързани с креативността,
                  интуицията и въображението – като цяло с{" "}
                  <span className="font-semibold">
                    вътрешна концентрация, медитация и духовно осъзнаване
                  </span>{" "}
                  –{" "}
                  <span className="font-semibold">
                    състояние между будността и съня (хипнагонично състояние)
                  </span>
                  .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="low-alpha">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">α</span> Low Alpha
                    вълни (8-10 Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="font-semibold">
                    Ниските Алфа α вълни (8-10 Hz)
                  </span>{" "}
                  са характерни за преходни състояния между будност и сън,{" "}
                  <span className="font-semibold">
                    лека разсеяност или унесено състояние
                  </span>
                  , тъй като са на границата с Тета вълните.{" "}
                  <span className="font-semibold">Алфа α (8-12Hz)</span> вълните
                  се проявяват при умерени нива на мозъчна активност. При
                  по-високи стойности на Алфа вълни, в сравнение с останалите, е
                  характерно състояние, при което човек е{" "}
                  <span className="font-semibold">
                    спокоен, уравновесен, в добро настроение
                  </span>{" "}
                  – в <span className="font-semibold">нормално състояние</span>,
                  при което има умствена координация и съзнателност.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="high-alpha">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">Α</span> High Alpha
                    вълни (10-12 Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="font-semibold">
                    Високите Алфа α вълни (10-12 Hz)
                  </span>{" "}
                  са свързани с{" "}
                  <span className="font-semibold">оптимално и релаксирано</span>
                  , но същевременно{" "}
                  <span className="font-semibold">концентрирано</span>{" "}
                  състояние, тъй като са на границата с Бета вълните. Те се
                  свързват с по-добра когнитивна ефективност, но без да
                  преминават в напрегнато състояние.{" "}
                  <span className="font-semibold">Алфа α (8-12Hz) вълните</span>{" "}
                  се проявяват при умерени нива на мозъчна активност. При
                  по-високи стойности на Алфа вълни, в сравнение с останалите, е
                  характерно състояние, при което човек е{" "}
                  <span className="font-semibold">
                    спокоен, уравновесен, в добро настроение
                  </span>{" "}
                  – в <span className="font-semibold">нормално състояние</span>,
                  при което има умствена координация и съзнателност.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="low-beta">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">β</span> Low Beta
                    вълни (12-15 Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="font-semibold">
                    Ниски Бета β вълни (12-15 Hz)
                  </span>{" "}
                  – свързани са със{" "}
                  <span className="font-semibold">спокойна концентрация</span> и
                  устойчива <span className="font-semibold">бдителност</span>,
                  тъй като са на границата с Алфа вълните. Те често се асоциират
                  със{" "}
                  <span className="font-semibold">
                    сензомоторния ритъм (SMR)
                  </span>{" "}
                  – специфичен мозъчен ритъм в диапазона 12–15 Hz, който се
                  генерира в сензомоторната кора.{" "}
                  <span className="font-semibold">SMR</span> играе ключова роля
                  в регулирането на двигателния контрол и е свързан със
                  състояния на спокойна концентрация, при които тялото остава
                  неподвижно, а умът е{" "}
                  <span className="font-semibold">фокусиран</span>. Поддържането
                  на стабилен SMR ритъм може да допринесе за подобряване на
                  вниманието, когнитивната ефективност и самоконтрола, като
                  същевременно намали импулсивността и хиперактивността.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="high-beta">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">Β</span> High Beta
                    вълни (18-30 Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="font-semibold">
                    Високи Бета β вълни (18-30 Hz)
                  </span>{" "}
                  – асоциират се с{" "}
                  <span className="font-semibold">
                    когнитивна активност, стрес, тревожност и нервност
                  </span>
                  , тъй като мозъкът е в състояние на{" "}
                  <span className="font-semibold">
                    прекомерна активност и бдителност
                  </span>
                  .{" "}
                  <span className="font-semibold">
                    Бета β (12-30Hz) вълните
                  </span>{" "}
                  се проявяват при по-високи нива на мозъчна активност. Тези
                  вълни са свързани с{" "}
                  <span className="font-semibold">
                    логическото мислене, критичния анализ и когнитивната
                    обработка на информация
                  </span>
                  .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="low-gamma">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">γ</span> Low Gamma
                    вълни (30-40 Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Вълните, които притежават{" "}
                  <span className="font-semibold">най-силна честота</span>{" "}
                  (най-бързи) са{" "}
                  <span className="font-semibold">
                    Гама γ вълните (над 30Hz)
                  </span>
                  . Те се проявяват при{" "}
                  <span className="font-semibold">интензивни</span> нива на
                  мозъчна активност. Те играят ключова роля в синхронизирането
                  на различните части на мозъка, което позволява едновременно
                  обработване на информация от различни източници.{" "}
                  <span className="font-semibold">
                    Ниските Гама γ вълни (30-40 Hz)
                  </span>{" "}
                  са свързани с{" "}
                  <span className="font-semibold">
                    добра концентрация, ефективна обработка на информация и
                    синхронизация между мозъчните региони
                  </span>
                  . Оптималните стойности в този диапазон подпомагат
                  дългосрочната памет.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="high-gamma">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl text-primary">Γ</span> High Gamma
                    вълни (40+ Hz)
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Вълните, които притежават{" "}
                  <span className="font-semibold">най-силна честота</span>{" "}
                  (най-бързи) са{" "}
                  <span className="font-semibold">
                    Гама γ вълните (над 30Hz)
                  </span>
                  . Те се проявяват при{" "}
                  <span className="font-semibold">интензивни</span> нива на
                  мозъчна активност. Те играят ключова роля в синхронизирането
                  на различните части на мозъка, което позволява едновременно
                  обработване на информация от различни източници.{" "}
                  <span className="font-semibold">
                    Високите Гама γ вълни (40+ Hz)
                  </span>{" "}
                  са асоциират с изключително{" "}
                  <span className="font-semibold">
                    висока невронна активност и интензивна когнитивна дейност
                  </span>
                  . При прекомерна активност в този диапазон, може да се
                  наблюдават{" "}
                  <span className="font-semibold">
                    свръхвъзбуда, тревожност, когнитивно пренатоварване или дори
                    свръхвисоки нива на стрес
                  </span>
                  .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="attention">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <i className="text-xl text-primary ti ti-message-report" />
                    Attention
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="font-semibold">
                    Attention (Измерване на вниманието)
                  </span>{" "}
                  - измерва нивото на концентрация и интензивността на фокуса.
                  Стойността му варира от{" "}
                  <span className="font-semibold">0 до 100</span>. Високите
                  стойности показват{" "}
                  <span className="font-semibold">силна съсредоточеност</span>{" "}
                  върху една мисъл или задача, а ниските стойности означават
                  <span className="font-semibold">
                    {" "}
                    разсеяност или липса на концентрация
                  </span>
                  .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mediation">
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-semibold">
                    <i className="text-xl text-primary ti ti-chart-histogram" />
                    Mediation
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <span className="font-semibold">
                    Mediation (Измерване на медитативното състояние)
                  </span>{" "}
                  – измерва нивото на спокойствие и релаксация. Стойността му
                  варира от <span className="font-semibold">0 до 100</span>.
                  Високите стойности показват{" "}
                  <span className="font-semibold">
                    спокойствие, отпускане и баланс
                  </span>
                  . Ниските стойности сигнализират за
                  <span className="font-semibold">
                    {" "}
                    напрежение, стрес или неспокойствие
                  </span>
                  .
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        }
      />
    </div>
  );
};

export default BrainActivityCard;
