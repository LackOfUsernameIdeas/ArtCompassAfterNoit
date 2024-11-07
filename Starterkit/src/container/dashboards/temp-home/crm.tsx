import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Colorrange,
  Dealsstatistics,
  generateData,
  Profitearned,
  Sourcedata
} from "./crmdata";
import { DataType, FilteredTableData } from "../home-types";
import {
  fetchData,
  filterTableData,
  handleDropdownClick,
  handleProsperityTableClick,
  myFunction,
  isDirector,
  isActor,
  isWriter
} from "../helper_functions";
import face10 from "../../../assets/images/faces/10.jpg";
import face12 from "../../../assets/images/faces/12.jpg";

interface CrmProps {}

const TempHome: FC<CrmProps> = () => {
  const [displayedNameAwards, setDisplayedNameAwards] =
    useState("Total Award Wins");
  const [displayedValueAwards, setDisplayedValueAwards] = useState("1,118");

  // States for holding fetched data
  const [Data, setData] = useState(Dealsstatistics);
  const [Data2, setData2] = useState<DataType>({
    usersCount: [],
    topRecommendations: [],
    topGenres: [],
    genrePopularityOverTime: {},
    topActors: [],
    topDirectors: [],
    topWriters: [],
    oscarsByMovie: [],
    totalAwardsByMovie: [],
    totalAwards: [],
    sortedDirectorsByProsperity: [],
    sortedActorsByProsperity: [],
    sortedWritersByProsperity: [],
    sortedMoviesByProsperity: [],
    averageBoxOfficeAndScores: [],
    topCountries: []
  });

  // Table data filtering and pagination
  const [filteredTableData, setFilteredTableData] = useState<FilteredTableData>(
    []
  );
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerTablePage = 5;
  const [currentTableItems, setCurrentTableItems] = useState<FilteredTableData>(
    []
  );
  const [prosperitySortCategory, setProsperitySortCategory] =
    useState("Directors");

  // User data state
  const [userData, setUserData] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    email: ""
  });

  // Pagination logic
  const totalItems = filteredTableData.length;
  const totalTablePages = Math.ceil(totalItems / itemsPerTablePage);

  // Data fetching for user and platform stats (combined into one useEffect)
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      fetchData(
        token,
        prosperitySortCategory,
        setUserData,
        setData2,
        setFilteredTableData
      );
    }
  }, [prosperitySortCategory]);

  // Fetch filtered table data based on category
  useEffect(() => {
    const newItems = filterTableData(
      filteredTableData,
      prosperitySortCategory,
      currentTablePage,
      itemsPerTablePage
    );
    setCurrentTableItems(newItems);
  }, [currentTablePage, prosperitySortCategory, filteredTableData]);

  const seriesData = [
    {
      name: "Jan",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "Feb",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "Mar",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "Apr",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "May",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "Jun",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "Jul",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "Aug",
      data: generateData(20, { min: -30, max: 55 })
    },
    {
      name: "Sep"
      // data: generateData(20, { min: -30, max: 55 }),
    }
  ];

  const handleNextTablePage = () => {
    if (currentTablePage < totalTablePages) {
      setCurrentTablePage((prev) => prev + 1);
    }
  };

  // Handle Previous Page Logic
  const handlePrevTablePage = () => {
    if (currentTablePage > 1) {
      setCurrentTablePage((prev) => prev - 1);
    }
  };

  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
            Здравейте, {userData.first_name} {userData.last_name}!
          </p>
          <p className="font-normal text-[#8c9097] dark:text-white/50 text-[0.813rem]">
            Track your sales activity, leads and deals here.
          </p>
        </div>
        <div className="btn-list md:mt-0 mt-2">
          <button
            type="button"
            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.375rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0"
          >
            <i className="ri-filter-3-fill  inline-block"></i>Филтри
          </button>
          <button
            type="button"
            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium  !me-[0.375rem]  !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none mb-0"
          >
            <i className="ri-upload-cloud-line  inline-block"></i>Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9 xl:col-span-12  col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-4 xl:col-span-4  col-span-12">
              <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                <div className="box custom-box">
                  <div className="box-body">
                    <div className="flex flex-wrap items-start justify-between">
                      <div className="flex-grow">
                        <p className="mb-0 text-[#8c9097] dark:text-white/50">
                          Общ брой потребители
                        </p>
                        <div className="flex items-center">
                          <span className="text-[1.25rem] font-semibold">
                            {Data2.usersCount?.[0]?.user_count || 0}
                          </span>
                          <span className="text-[0.75rem] text-success ms-2">
                            <i className="ti ti-trending-up me-1 inline-block"></i>
                            0.42%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                          <i className="bi bi-person-lines-fill text-[1rem]"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-8  xl:col-span-8  col-span-12">
              <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box custom-box">
                    <div className="box-body">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-start">
                            <p className="mb-0 text-[#8c9097] dark:text-white/50">
                              {displayedNameAwards}
                            </p>
                            <div className="hs-dropdown ti-dropdown">
                              <Link
                                to="#"
                                className="text-[0.75rem] px-2 font-normal text-primary"
                                aria-expanded="false"
                              >
                                View All
                                <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                              </Link>
                              <ul
                                className="hs-dropdown-menu ti-dropdown-menu hidden"
                                role="menu"
                              >
                                <li>
                                  <Link
                                    onClick={() =>
                                      handleDropdownClick(
                                        setDisplayedNameAwards,
                                        setDisplayedValueAwards,
                                        "Total Award Wins",
                                        "1,118"
                                      )
                                    }
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                    to="#"
                                  >
                                    Total Award Wins
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() =>
                                      handleDropdownClick(
                                        setDisplayedNameAwards,
                                        setDisplayedValueAwards,
                                        "Total Award Nominations",
                                        "2,262"
                                      )
                                    }
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                    to="#"
                                  >
                                    Total Award Nominations
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() =>
                                      handleDropdownClick(
                                        setDisplayedNameAwards,
                                        setDisplayedValueAwards,
                                        "Total Oscar Wins",
                                        "11"
                                      )
                                    }
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                    to="#"
                                  >
                                    Total Oscar Wins
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() =>
                                      handleDropdownClick(
                                        setDisplayedNameAwards,
                                        setDisplayedValueAwards,
                                        "Total Oscar Wins",
                                        "11"
                                      )
                                    }
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                                    to="#"
                                  >
                                    Total Oscar Nominations
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-[1.25rem] font-semibold">
                              {displayedValueAwards}
                            </span>
                            <span className="text-[0.75rem] text-success ms-2">
                              <i className="ti ti-trending-up me-1 inline-block"></i>
                              0.42%
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                            <i className="bi bi-person-lines-fill text-[1rem]"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box custom-box">
                    <div className="box-body">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="flex-grow">
                          <p className="mb-0 text-[#8c9097] dark:text-white/50">
                            Most Recommended
                          </p>
                          <div className="flex items-center">
                            <span className="text-[1.25rem] font-semibold">
                              {Data2.topRecommendations[0]?.title_bg}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                            <i className="bi bi-person-lines-fill text-[1rem]"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* tableeee */}
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box custom-card">
              <div className="box-header justify-between">
                <div className="box-title">
                  {prosperitySortCategory} by Prosperity
                </div>
                <div className="flex flex-wrap gap-2">
                  <div>
                    <input
                      className="ti-form-control form-control-sm"
                      type="text"
                      placeholder="Search Here"
                      onChange={(ele) => {
                        myFunction(ele.target.value, Dealsstatistics, setData);
                      }}
                      aria-label=".form-control-sm example"
                    />
                  </div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      to="#"
                      className="ti-btn ti-btn-primary !bg-primary !text-white !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                      aria-expanded="false"
                    >
                      Sort By
                      <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul
                      className="hs-dropdown-menu ti-dropdown-menu hidden"
                      role="menu"
                    >
                      {["Directors", "Actors", "Writers"].map((category) => (
                        <li key={category}>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            to="#"
                            onClick={() =>
                              handleProsperityTableClick(
                                category,
                                setProsperitySortCategory
                              )
                            }
                          >
                            {category}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box-body">
                <div className="overflow-x-auto">
                  <table
                    key={prosperitySortCategory}
                    className="table min-w-full whitespace-nowrap table-hover border table-bordered"
                  >
                    <thead>
                      <tr className="border border-inherit border-solid dark:border-defaultborder/10">
                        <th scope="row" className="!ps-4 !pe-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkboxNoLabel1"
                            defaultValue=""
                            aria-label="..."
                          />
                        </th>
                        <th
                          scope="col"
                          className="!text-start !text-[0.85rem] min-w-[200px]"
                        >
                          {prosperitySortCategory}
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          IMDB Rating
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Box Office
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Movie Count
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Total Recommendations
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Award Wins
                        </th>
                        <th scope="col" className="!text-start !text-[0.85rem]">
                          Award Nominations
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTableItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border border-inherit border-solid hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light"
                        >
                          <td className="!ps-4 !pe-5">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              aria-label="..."
                            />
                          </td>
                          <td>
                            {isDirector(item)
                              ? item.director
                              : isActor(item)
                              ? item.actor
                              : isWriter(item)
                              ? item.writer
                              : ""}
                          </td>
                          <td>{item.avg_imdb_rating}</td>
                          <td>{item.total_box_office}</td>
                          <td>{item.movie_count}</td>
                          <td>{item.total_recommendations}</td>
                          <td>{item.total_wins}</td>
                          <td>{item.total_nominations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="box-footer">
                <div className="sm:flex items-center">
                  <div className="text-defaulttextcolor dark:text-defaulttextcolor/70">
                    Showing 5 Entries{" "}
                    <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                  </div>
                  <div className="ms-auto">
                    <nav
                      aria-label="Page navigation"
                      className="pagination-style-4"
                    >
                      <ul className="ti-pagination mb-0">
                        <li
                          className={`page-item ${
                            currentTablePage === 1 ? "disabled" : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={handlePrevTablePage}
                          >
                            Prev
                          </Link>
                        </li>
                        {[...Array(totalTablePages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentTablePage === index + 1 ? "active" : ""
                            }`}
                          >
                            <Link
                              className="page-link"
                              to="#"
                              onClick={() => setCurrentTablePage(index + 1)}
                            >
                              {index + 1}
                            </Link>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentTablePage === totalTablePages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <Link
                            className="page-link"
                            to="#"
                            onClick={handleNextTablePage}
                          >
                            Next
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box">
              <div className="box-header !gap-0 !m-0 justify-between">
                <div className="box-title">Genre popularity over time</div>
                <div className="hs-dropdown ti-dropdown">
                  <Link
                    to="#"
                    className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                    aria-expanded="false"
                  >
                    View All
                    <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                  </Link>
                  <ul
                    className="hs-dropdown-menu ti-dropdown-menu hidden"
                    role="menu"
                  >
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        This Week
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Last Week
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="xl:col-span-6 col-span-12">
                <div className="box custom-box">
                  <div className="box-body">
                    <div id="heatmap-colorrange">
                      <Colorrange seriesData={seriesData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box">
              <div className="box-header flex justify-between">
                <div className="box-title">Top Deals</div>
                <div className="hs-dropdown ti-dropdown">
                  <Link
                    aria-label="anchor"
                    to="#"
                    className="flex items-center justify-center w-[1.75rem] h-[1.75rem]  !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                    aria-expanded="false"
                  >
                    <i className="fe fe-more-vertical text-[0.8rem]"></i>
                  </Link>
                  <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Week
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Month
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Year
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="box-body">
                <ul className="list-none crm-top-deals mb-0">
                  <li className="mb-[0.9rem]">
                    <div className="flex items-start flex-wrap">
                      <div className="me-2">
                        <span className=" inline-flex items-center justify-center">
                          <img
                            src={face10}
                            alt=""
                            className="w-[1.75rem] h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full"
                          />
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Michael Jordan
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          michael.jordan@example.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $2,893
                      </div>
                    </div>
                  </li>
                  <li className="mb-[0.9rem]">
                    <div className="flex items-start flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center !w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full text-warning  bg-warning/10 font-semibold">
                          EK
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Emigo Kiaren
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          emigo.kiaren@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $4,289
                      </div>
                    </div>
                  </li>
                  <li className="mb-[0.9rem]">
                    <div className="flex items-top flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center">
                          <img
                            src={face12}
                            alt=""
                            className="!w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full"
                          />
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Randy Origoan
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          randy.origoan@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $6,347
                      </div>
                    </div>
                  </li>
                  <li className="mb-[0.9rem]">
                    <div className="flex items-top flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center !w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full text-success bg-success/10 font-semibold">
                          GP
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          George Pieterson
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          george.pieterson@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $3,894
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-top flex-wrap">
                      <div className="me-2">
                        <span className="inline-flex items-center justify-center !w-[1.75rem] !h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full text-primary bg-primary/10 font-semibold">
                          KA
                        </span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                          Kiara Advain
                        </p>
                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                          kiaraadvain214@gmail.com
                        </p>
                      </div>
                      <div className="font-semibold text-[0.9375rem] ">
                        $2,679
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
            <div className="box">
              <div className="box-header justify-between">
                <div className="box-title">Profit Earned</div>
                <div className="hs-dropdown ti-dropdown">
                  <Link
                    to="#"
                    className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
                    aria-expanded="false"
                  >
                    View All
                    <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                  </Link>
                  <ul
                    className="hs-dropdown-menu ti-dropdown-menu hidden"
                    role="menu"
                  >
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Today
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        This Week
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                        to="#"
                      >
                        Last Week
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="box-body !py-0 !ps-0">
                <div id="crm-profits-earned">
                  <Profitearned />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 xl:col-span-6 col-span-12">
              <div className="box custom-box">
                <div className="box-body">
                  <div className="flex flex-wrap items-start justify-between">
                    <div className="flex-grow">
                      <p className="mb-0 text-[#8c9097] dark:text-white/50">
                        Top Genre
                      </p>
                      <div className="flex items-center">
                        <span className="text-[1.25rem] font-semibold">
                          {Data2.topGenres[0]?.genre_bg}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="avatar avatar-md !rounded-full bg-secondary/10 !text-secondary text-[1.125rem]">
                        <i className="bi bi-person-lines-fill text-[1rem]"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-12  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Leads By Source</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      aria-label="anchor"
                      to="#"
                      className="flex items-center justify-center w-[1.75rem] h-[1.75rem] ! !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                      aria-expanded="false"
                    >
                      <i className="fe fe-more-vertical text-[0.8rem]"></i>
                    </Link>
                    <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Month
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Year
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body overflow-hidden">
                  <div className="leads-source-chart flex items-center justify-center">
                    <Sourcedata />
                    <div className="lead-source-value ">
                      <span className="block text-[0.875rem] ">Total</span>
                      <span className="block text-[1.5625rem] font-bold">
                        {(
                          (parseInt(
                            Data2.totalAwards?.[0]?.total_awards_wins,
                            10
                          ) || 0) +
                          (parseInt(
                            Data2.totalAwards?.[0]?.total_awards_nominations,
                            10
                          ) || 0) +
                          (parseInt(
                            Data2.totalAwards?.[0]?.total_oscar_wins,
                            10
                          ) || 0) +
                          (parseInt(
                            Data2.totalAwards?.[0]?.total_oscar_nominations,
                            10
                          ) || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-dashed dark:border-defaultborder/10">
                  <div className="col !p-0">
                    <div className="!ps-4 p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend mobile inline-block">
                        Awards Wins
                      </span>
                      <div>
                        <span className="text-[1rem]  font-semibold">
                          {Data2.totalAwards?.[0]?.total_awards_wins || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col !p-0">
                    <div className="p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend desktop inline-block">
                        Awards Nom.
                      </span>
                      <div>
                        <span className="text-[1rem]  font-semibold">
                          {Data2.totalAwards?.[0]?.total_awards_nominations ||
                            0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col !p-0">
                    <div className="p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend laptop inline-block">
                        Oscar Wins
                      </span>
                      <div>
                        <span className="text-[1rem]  font-semibold">
                          {Data2.totalAwards?.[0]?.total_oscar_wins || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col !p-0">
                    <div className="!pe-4 p-[0.95rem] text-center">
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend tablet inline-block">
                        Oscar Nom.
                      </span>
                      <div>
                        <span className="text-[1rem]  font-semibold">
                          {Data2.totalAwards?.[0]?.total_oscar_nominations || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Deals Status</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      to="#"
                      className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false"
                    >
                      View All
                      <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul
                      className="hs-dropdown-menu ti-dropdown-menu hidden"
                      role="menu"
                    >
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Today
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          This Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  <div className="flex items-center mb-[0.8rem]">
                    <h4 className="font-bold mb-0 text-[1.5rem] ">4,289</h4>
                    <div className="ms-2">
                      <span className="py-[0.18rem] px-[0.45rem] rounded-sm text-success !font-medium !text-[0.75em] bg-success/10">
                        1.02
                        <i className="ri-arrow-up-s-fill align-mmiddle ms-1"></i>
                      </span>
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.813rem] ms-1">
                        compared to last week
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full h-[0.3125rem] mb-6 rounded-full overflow-hidden">
                    <div
                      className="flex flex-col justify-center rounded-s-[0.625rem] overflow-hidden bg-primary w-[21%]"
                      style={{ width: "21%" }}
                      aria-valuenow={21}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-info w-[26%]"
                      style={{ width: "26%" }}
                      aria-valuenow={26}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-warning w-[35%]"
                      style={{ width: "35%" }}
                      aria-valuenow={35}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-e-[0.625rem] overflow-hidden bg-success w-[18%]"
                      style={{ width: "18%" }}
                      aria-valuenow={18}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <ul className="list-none mb-0 pt-2 crm-deals-status">
                    <li className="primary">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Successful Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          987 deals
                        </div>
                      </div>
                    </li>
                    <li className="info">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Pending Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          1,073 deals
                        </div>
                      </div>
                    </li>
                    <li className="warning">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Rejected Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          1,674 deals
                        </div>
                      </div>
                    </li>
                    <li className="success">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Upcoming Deals</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          921 deals
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Recent Activity</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      to="#"
                      className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false"
                    >
                      View All
                      <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul
                      className="hs-dropdown-menu ti-dropdown-menu hidden"
                      role="menu"
                    >
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Today
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          This Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          to="#"
                        >
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  <div>
                    <ul className="list-none mb-0 crm-recent-activity">
                      <li className="crm-recent-activity-content">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] inline-flex items-center justify-center font-medium leading-[1.25rem] text-[0.65rem] text-primary bg-primary/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content text-defaultsize">
                            <span className="font-semibold ">
                              Update of calendar events &amp;
                            </span>
                            <span>
                              <Link
                                to="#"
                                className="text-primary font-semibold"
                              >
                                Added new events in next week.
                              </Link>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              4:45PM
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content">
                        <div className="flex items-start  text-defaultsize">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-secondary bg-secondary/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              New theme for{" "}
                              <span className="font-semibold">
                                Spruko Website
                              </span>{" "}
                              completed
                            </span>
                            <span className="block text-[0.75rem] text-[#8c9097] dark:text-white/50">
                              Lorem ipsum, dolor sit amet.
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              3 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-success bg-success/10 rounded-full">
                              <i className="bi bi-circle-fill  text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Created a{" "}
                              <span className="text-success font-semibold">
                                New Task
                              </span>{" "}
                              today{" "}
                              <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] text-[0.65rem] inline-flex items-center justify-center font-medium bg-purple/10 rounded-full ms-1">
                                <i className="ri-add-fill text-purple text-[0.75rem]"></i>
                              </span>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              22 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-pink bg-pink/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              New member{" "}
                              <span className="py-[0.2rem] px-[0.45rem] font-semibold rounded-sm text-pink text-[0.75em] bg-pink/10">
                                @andreas gurrero
                              </span>{" "}
                              added today to AI Summit.
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              Today
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-warning bg-warning/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>32 New people joined summit.</span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              22 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-info bg-info/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Neon Tarly added{" "}
                              <span className="text-info font-semibold">
                                Robert Bright
                              </span>{" "}
                              to AI summit project.
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              12 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-[#232323] dark:text-white bg-[#232323]/10 dark:bg-white/20 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Replied to new support request{" "}
                              <i className="ri-checkbox-circle-line text-success text-[1rem] align-middle"></i>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              4 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="crm-recent-activity-content  text-defaultsize">
                        <div className="flex items-start">
                          <div className="me-4">
                            <span className="w-[1.25rem] h-[1.25rem] leading-[1.25rem] inline-flex items-center justify-center font-medium text-[0.65rem] text-purple bg-purple/10 rounded-full">
                              <i className="bi bi-circle-fill text-[0.5rem]"></i>
                            </span>
                          </div>
                          <div className="crm-timeline-content">
                            <span>
                              Completed documentation of{" "}
                              <Link
                                to="#"
                                className="text-purple underline font-semibold"
                              >
                                AI Summit.
                              </Link>
                            </span>
                          </div>
                          <div className="flex-grow text-end">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                              4 hrs
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default TempHome;
