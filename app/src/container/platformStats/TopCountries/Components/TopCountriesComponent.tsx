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
        <div className="text-center !text-sm box p-6 flex flex-col">
          <p>
            Тук може да видите колко пъти са препоръчвани различните жанровете
            филми с различни държави на произход. Можете да видите и кои са
            държавите с най-много препоръки.
          </p>
        </div>
        <div className="box">
          <div className="box-header justify-between">
            <div className="box-title opsilion">
              Топ държави с най-много препоръки
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
