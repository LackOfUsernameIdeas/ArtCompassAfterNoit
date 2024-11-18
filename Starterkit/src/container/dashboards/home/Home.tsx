import { FC, Fragment, useEffect, useState } from "react";
import { DataType, UserData } from "../home-types";
import { fetchData } from "../helper_functions";
import TableComponent from "./Statistics/TableComponent";
import TreemapComponent from "./Statistics/TreemapComponent";
import TopRecommendationsBarChartComponent from "./Statistics/TopRecommendationsBarChart";
import CountryBarChartComponent from "./Statistics/CountryBarChartComponent";
import MovieProsperityBubbleChartComponent from "./Statistics/MovieProsperityBubbleChartComponent";
import GenrePopularityOverTimeComponent from "./Statistics/GenrePopularityOverTimeComponent";
import MovieBarChartComponent from "./Statistics/MovieBarChartComponent";
import WidgetCards from "./Statistics/WidgetCards";

interface CrmProps {}

const Home: FC<CrmProps> = () => {
  // States for holding fetched data
  const [data, setData] = useState<DataType>({
    usersCount: [],
    topRecommendations: [],
    topGenres: [],
    genrePopularityOverTime: {},
    topActors: [],
    topDirectors: [],
    topWriters: [],
    oscarsByMovie: [],
    totalAwardsByMovieOrSeries: [],
    totalAwards: [],
    sortedDirectorsByProsperity: [],
    sortedActorsByProsperity: [],
    sortedWritersByProsperity: [],
    sortedMoviesByProsperity: [],
    sortedMoviesAndSeriesByMetascore: [],
    sortedMoviesAndSeriesByIMDbRating: [],
    sortedMoviesAndSeriesByRottenTomatoesRating: [],
    averageBoxOfficeAndScores: [],
    topCountries: []
  });

  // User data state
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    first_name: "",
    last_name: "",
    email: ""
  });

  // Data fetching for user and platform stats (combined into one useEffect)
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      fetchData(token, setUserData, setData);
      console.log("fetching");
    }
  }, []);

  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
            Здравейте, {userData.first_name} {userData.last_name}!
          </p>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <WidgetCards data={data} />
        <div className="xxl:col-span-6 col-span-12">
          <div className="xxl:col-span-6 col-span-12">
            <MovieProsperityBubbleChartComponent data={data} />
            <GenrePopularityOverTimeComponent data={data} />
            <MovieBarChartComponent data={data} />
          </div>
        </div>
        <div className="xxl:col-span-6 col-span-12">
          <TableComponent data={data} />
          <TopRecommendationsBarChartComponent data={data} />
          <TreemapComponent data={data} />
          <CountryBarChartComponent data={data} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6"></div>
      <div className="transition fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 opacity-0 hidden"></div>
    </Fragment>
  );
};

export default Home;
