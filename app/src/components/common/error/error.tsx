import type React from "react";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../loader/fadeinwrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Compass } from "lucide-react";

interface ErrorCardProps {
  message: string;
  mt?: number;
  redirectUrl?: string;
  redirectText?: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({
  message,
  mt = 0,
  redirectUrl,
  redirectText = "Go to Homepage"
}) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
    }
  };

  return (
    <FadeInWrapper>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 "></p>
        </div>
      </div>
      <div className={`mt-[${mt}rem] grid gap-8`}>
        <Card className="bg-bodybg shadow-xl">
          <CardContent className="pt-6">
            <p
              className="text-2xl font-extrabold text-defaulttextcolor drop-shadow-lg text-center"
              dangerouslySetInnerHTML={{
                __html: message.replace(/\n/g, "<br />")
              }}
            />
          </CardContent>
        </Card>

        {redirectUrl && (
          <div className="text-center animate-float">
            <div className="mb-4 relative">
              <Compass className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400 animate-pulse" />
            </div>
            <Button
              variant="outline"
              className="px-6 py-3 text-lg font-semibold text-blue-600 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-400 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
              onClick={handleRedirect}
            >
              {redirectText}
              <ArrowRight className="ml-2 h-5 w-5 animate-bounce-horizontal" />
            </Button>
          </div>
        )}
      </div>
    </FadeInWrapper>
  );
};

export default ErrorCard;
