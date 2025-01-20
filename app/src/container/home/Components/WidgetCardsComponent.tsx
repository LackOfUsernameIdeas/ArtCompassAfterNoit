import { FC, Fragment, useEffect, useState } from "react"; 
// Import necessary React modules and hooks

import { DataType } from "../home-types"; 
// Importing a type definition for the data structure

import { handleDropdownClick } from "../helper_functions"; 
// Importing a helper function to handle dropdown interactions

import { useMediaQuery } from "react-responsive"; 
// Importing a library for handling responsive design

import { Link } from "react-router-dom"; 
// Importing Link for navigation without reloading the page

import { getAveragesOptions, getAwardOptions } from "../home-data"; 
// Importing functions to generate options for dropdowns

// Define the type for the props passed to this component
interface WidgetCardsComponentProps {
  data: DataType; // Expecting data of type `DataType`
}

// Main functional component
const WidgetCardsComponent: FC<WidgetCardsComponentProps> = ({ data }) => {
  // States to manage the displayed names and values for averages and awards
  const [displayedNameAverages, setDisplayedNameAverages] =
    useState("Среден Боксофис"); // Default display name for averages
  const [displayedValueAverages, setDisplayedValueAverages] =
    useState<number>(0); // Default value for averages

  const [displayedNameAwards, setDisplayedNameAwards] = useState(
    "Общ брой спечелени награди"
  ); // Default display name for awards
  const [displayedValueAwards, setDisplayedValueAwards] = useState<number>(0); // Default value for awards

  // States to manage whether dropdown menus are open
  const [isAveragesMenuOpen, setIsAveragesMenuOpen] = useState(false);
  const [isAwardsMenuOpen, setIsAwardsMenuOpen] = useState(false);

  // Effect to initialize displayed values from data
  useEffect(() => {
    if (
      data.totalAwards.length > 0 && // Ensure awards data is available
      data.averageBoxOfficeAndScores.length > 0 // Ensure averages data is available
    ) {
      setDisplayedValueAwards(data.totalAwards[0].total_awards_wins); 
      // Set initial awards value
      setDisplayedValueAverages(
        data.averageBoxOfficeAndScores[0].average_box_office
      ); 
      // Set initial averages value
    }
  }, [data]); // Dependency array ensures this runs when `data` changes

  // Toggles the awards dropdown menu
  const toggleAwardsMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link behavior
    setIsAwardsMenuOpen((prev) => !prev); // Toggle the state
  };

  // Toggles the averages dropdown menu
  const toggleAveragesMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link behavior
    setIsAveragesMenuOpen((prev) => !prev); // Toggle the state
  };

  // Generate options for the awards dropdown
  const awardOptions = getAwardOptions(data); 
  // Generate options for the averages dropdown
  const averagesOptions = getAveragesOptions(data);

  // Media query breakpoints for responsive design
  const is1856 = useMediaQuery({ query: "(max-width: 1856px)" });
  const is1532 = useMediaQuery({ query: "(max-width: 1532px)" });
  const is1966 = useMediaQuery({ query: "(max-width: 1966px)" });

  // Return JSX for rendering the component
  return (
    <Fragment>
      {/* Card 1: Total Users */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              {/* Left section showing the total user count */}
              <div className="flex-grow">
                <p
                  className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                    is1856 && "text-xs"
                  }`}
                >
                  Общ брой потребители {/* "Total Users" label */}
                </p>
                <div className="flex items-center"> 
                  <span 
                    className={`text-[${
                      is1856 ? "1.25rem" : "1.125rem"
                    }] !font-Opsilon tracking-wider`}
                  >
                    {data.usersCount?.[0]?.user_count || 0} {/* Display the total user count or fallback to 0 */}
                  </span>
                </div>
              </div>
              {/* Right section showing an icon */}
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-person text-primary text-[${
                      is1856 ? "1rem" : "0.875rem"
                    }]`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Top Recommended Genre */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <p
                  className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                    is1856 && "text-xs"
                  }`}
                >
                  Най-препоръчван жанр {/* "Top Recommended Genre" label */}
                </p>
                <div className="flex items-center">
                  <span
                    className={`text-[${
                      is1856 ? "1.25rem" : "1.125rem"
                    }] !font-Opsilon tracking-wider`}
                  >
                    {data.topGenres[0]?.genre_bg} {/* Display the top genre in Bulgarian */}
                  </span>
                </div>
              </div>
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-film text-primary text-[${
                      is1856 ? "1rem" : "0.875rem"
                    }]`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Sreden boxoffice */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <div className="flex flex-wrap items-start">
                  <div
                    className={`flex items-center space-x-${is1856 ? 2 : 1}`}
                  >
                    <p
                      className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                        is1856 &&
                        "truncate overflow-hidden max-w-[130px] whitespace-nowrap text-xs"
                      }`}
                    >
                      {displayedNameAverages}
                    </p>
                    <div className="hs-dropdown ti-dropdown">
                      <Link
                        to="#"
                        className={`flex items-center ${
                          is1856
                            ? "px-1 py-0.5 text-[0.70rem]"
                            : "px-0.5 py-0.25 text-[0.70rem]"
                        } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all max-h-[1.125rem]`}
                        onClick={toggleAveragesMenu}
                        aria-expanded={isAveragesMenuOpen ? "true" : "false"}
                      >
                        <span className={`${is1532 && "hidden"}`}>
                          Сортирай по
                        </span>
                        <i
                          className={`ri-arrow-${
                            isAveragesMenuOpen ? "up" : "down"
                          }-s-line ${!is1532 && "ml-0.5"} text-sm`}
                        ></i>
                      </Link>
                      <ul
                        className={`hs-dropdown-menu ti-dropdown-menu ${
                          isAveragesMenuOpen ? "block" : "hidden"
                        }`}
                        role="menu"
                      >
                        {averagesOptions.map(({ label, value }) => (
                          <li key={label}>
                            <Link
                              onClick={() =>
                                handleDropdownClick(
                                  setDisplayedNameAverages,
                                  setDisplayedValueAverages,
                                  label,
                                  value
                                )
                              }
                              className={`ti-dropdown-item ${
                                displayedNameAverages === label ? "active" : ""
                              } ${
                                displayedNameAverages === label
                                  ? "disabled"
                                  : ""
                              }`}
                              to="#"
                            >
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-[${
                      is1856 ? "1.25rem" : "1.125rem"
                    }] !font-Opsilon tracking-wider`}
                  >
                    {displayedValueAverages}
                  </span>
                </div>
              </div>
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-${
                      displayedNameAverages == "Среден Боксофис"
                        ? "ticket-perforated"
                        : "bi bi-clipboard-data"
                    } text-[${is1856 ? "1rem" : "0.875rem"}] text-primary`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Awards */}
      <div className="xxl:col-span-3 xl:col-span-3 col-span-12">
        <div className="box custom-box">
          <div className="box-body h-[5.5rem]">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <div className={`flex items-center space-x-${is1966 ? 2 : 1}`}>
                  <p
                    className={`mb-0 text-[#8c9097] dark:text-white/50 ${
                      is1966 &&
                      "truncate overflow-hidden max-w-[130px] whitespace-nowrap text-xs"
                    }`}
                  >
                    {displayedNameAwards}
                  </p>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      to="#"
                      className={`flex items-center ${
                        is1966
                          ? "px-1 py-0.5 text-[0.70rem]"
                          : "px-0.5 py-0.25 text-[0.70rem]"
                      } font-medium text-primary border border-primary rounded-sm hover:bg-primary/10 transition-all max-h-[1.125rem]`}
                      onClick={toggleAwardsMenu}
                      aria-expanded={isAwardsMenuOpen ? "true" : "false"}
                    >
                      <span className={`${is1532 && "hidden"}`}>
                        Сортирай по
                      </span>
                      <i
                        className={`ri-arrow-${
                          isAwardsMenuOpen ? "up" : "down"
                        }-s-line ${!is1532 && "ml-0.5"} text-sm`}
                      ></i>
                    </Link>
                    <ul
                      className={`hs-dropdown-menu ti-dropdown-menu ${
                        isAwardsMenuOpen ? "block" : "hidden"
                      }`}
                      role="menu"
                    >
                      {awardOptions.map(({ label, value }) => (
                        <li key={label}>
                          <Link
                            onClick={() =>
                              handleDropdownClick(
                                setDisplayedNameAwards,
                                setDisplayedValueAwards,
                                label,
                                value
                              )
                            }
                            className={`ti-dropdown-item ${
                              displayedNameAwards === label ? "active" : ""
                            } ${
                              displayedNameAwards === label ? "disabled" : ""
                            }`}
                            to="#"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-[${
                      is1966 ? "1.25rem" : "1.125rem"
                    }] !font-Opsilon tracking-wider`}
                  >
                    {displayedValueAwards}
                  </span>
                </div>
              </div>
              <div>
                <span className="avatar avatar-md !rounded-full bg-primary/10 !text-secondary text-[1.125rem]">
                  <i
                    className={`bi bi-trophy text-[${
                      is1966 ? "1rem" : "0.875rem"
                    }] text-primary`}
                  ></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WidgetCardsComponent;
