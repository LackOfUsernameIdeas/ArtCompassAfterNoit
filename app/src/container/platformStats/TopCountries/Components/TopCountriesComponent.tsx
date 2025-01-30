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
        <div className="box">
          <div className="box-header justify-between">
            <div className="box-title !font-Opsilon !font-light !tracking-wide">
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
