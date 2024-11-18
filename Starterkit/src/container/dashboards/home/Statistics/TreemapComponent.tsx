import { FC, Fragment, useState } from "react";
import { DataType } from "../../home-types";
import { handleTopStatsSortCategory } from "../../helper_functions";
import { Treemap } from "./Charts";
interface TreemapComponentProps {
  data: DataType;
}

const TreemapComponent: FC<TreemapComponentProps> = ({ data }) => {
  const [topStatsSortCategory, setTopStatsSortCategory] = useState("Actors");

  const tableCategoryDisplayNames: Record<
    "Directors" | "Actors" | "Writers",
    string
  > = {
    Directors: "Режисьори",
    Actors: "Актьори",
    Writers: "Сценаристи"
  };

  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="box custom-box h-[30rem]">
          <div className="box-header justify-between">
            <div className="box-title">
              {
                tableCategoryDisplayNames[
                  topStatsSortCategory as keyof typeof tableCategoryDisplayNames
                ]
              }{" "}
              по бройка
            </div>
            <div className="flex flex-wrap gap-2">
              <div
                className="inline-flex rounded-md shadow-sm"
                role="group"
                aria-label="Sort By"
              >
                {["Actors", "Directors", "Writers"].map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`ti-btn-group !border-0 !text-xs !py-2 !px-3 ${
                      category === topStatsSortCategory
                        ? "ti-btn-primary-full text-white"
                        : "text-[#CC3333] bg-[#be1313] bg-opacity-10"
                    } ${
                      index === 0
                        ? "rounded-l-md"
                        : index === 2
                        ? "rounded-r-md"
                        : ""
                    }`}
                    onClick={() =>
                      handleTopStatsSortCategory(
                        category,
                        setTopStatsSortCategory
                      )
                    }
                  >
                    {
                      tableCategoryDisplayNames[
                        category as keyof typeof tableCategoryDisplayNames
                      ]
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="box-body flex justify-center items-center">
            <div id="treemap-basic" className="w-full">
              <Treemap
                data={
                  topStatsSortCategory === "Actors"
                    ? data.topActors
                    : topStatsSortCategory === "Directors"
                    ? data.topDirectors
                    : data.topWriters
                }
                role={topStatsSortCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TreemapComponent;
