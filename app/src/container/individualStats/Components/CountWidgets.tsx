import { FC, Fragment } from "react";
import { Count } from "../individualStats-types";

interface CountWidgetsProps {
  recommendationsCount: Count;
}

const CountWidgets: FC<CountWidgetsProps> = ({ recommendationsCount }) => {
  return (
    <Fragment>
      <div className="box custom-box">
        <div className="box-header justify-between">
          <div className="box-title">Брой Препоръчвани:</div>
        </div>
        <div className="box-body">
          <div className="grid grid-cols-1 xxl:grid-cols-3 gap-x-6">
            <div className="xxl:col-span-1 col-span-1">
              <div className="text-center">
                <span className="avatar avatar-md bg-primary shadow-sm !rounded-full mb-2">
                  <i className="ri-movie-line text-[1rem]"></i>
                </span>
                <p className="text-[.875rem] font-semibold mb-2">Филми</p>
                <div className="flex items-center justify-center flex-wrap">
                  <h5 className="mb-0 font-semibold">
                    {recommendationsCount.movies}
                  </h5>
                </div>
              </div>
            </div>

            <div className="xxl:col-span-1 col-span-1">
              <div className="text-center">
                <span className="avatar avatar-md bg-primary shadow-sm !rounded-full mb-2">
                  <i className="ri-movie-line text-[1rem]"></i>
                </span>
                <p className="text-[.875rem] font-semibold mb-2">Сериали</p>
                <div className="flex items-center justify-center flex-wrap">
                  <h5 className="mb-0 font-semibold">
                    {recommendationsCount.series}
                  </h5>
                </div>
              </div>
            </div>

            <div className="xxl:col-span-1 col-span-1">
              <div className="text-center">
                <span className="avatar avatar-md bg-primary shadow-sm !rounded-full mb-2">
                  <i className="ri-movie-2-line text-[1rem]"></i>
                </span>
                <p className="text-[.875rem] font-semibold mb-2">Общо</p>
                <div className="flex items-center justify-center flex-wrap">
                  <h5 className="mb-0 font-semibold">
                    {recommendationsCount.movies + recommendationsCount.series}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CountWidgets;
