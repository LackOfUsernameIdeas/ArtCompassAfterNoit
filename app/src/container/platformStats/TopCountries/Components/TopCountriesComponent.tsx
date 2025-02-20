import { FC, Fragment } from "react";
import { TopCountriesDataType } from "../../platformStats-types";

import { TopCountriesChart } from "../../charts";
import { useMediaQuery } from "react-responsive";
interface TopCountriesComponentProps {
  data: TopCountriesDataType;
}

const TopCountriesComponent: FC<TopCountriesComponentProps> = ({ data }) => {
  const is1546 = useMediaQuery({ query: "(max-width: 1546px)" });

  return (
    <Fragment>
      <div className="xxl:col-span-12 xl:col-span-6 col-span-12">
        <div className="text-center !text-lg box p-6 flex flex-col">
          <h2 className="text-2xl opsilion text-defaulttextcolor dark:text-white/80">
            Тук може да видите колко пъти са препоръчвани различните{" "}
            <span className="font-bold text-primary">жанрове </span>
            филми и сериали с различни държави по произход. Можете да видите и
            кои са
            <span className="font-bold text-primary"> държавите</span> с{" "}
            <span className="font-bold text-primary">най-много препоръки </span>
            !
          </h2>
        </div>
        <div className="box">
          <div className="box-header justify-between">
            <div className="box-title opsilion">
              Топ 10 държави с най-много препоръки
            </div>
          </div>
          <div className="box-body">
            <TopCountriesChart
              topCountries={data.topCountries}
              is1546={is1546}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TopCountriesComponent;
