import React from "react";
import FadeInWrapper from "../loader/fadeinwrapper";

interface ErrorCardProps {
  message: string;
  mt?: number;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message, mt = 0 }) => {
  return (
    <FadeInWrapper>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 "></p>
        </div>
      </div>
      <div
        className={`flex justify-center items-center bg-bodybg mt-[${mt}rem] text-center p-6 rounded-lg shadow-xl`}
      >
        <p
          className="text-2xl font-extrabold text-defaulttextcolor drop-shadow-lg"
          dangerouslySetInnerHTML={{
            __html: message.replace(/\n/g, "<br />")
          }}
        />
      </div>
    </FadeInWrapper>
  );
};

export default ErrorCard;
