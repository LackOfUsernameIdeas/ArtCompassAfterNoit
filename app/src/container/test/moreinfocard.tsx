import React from "react";
import { Movie } from "./test-types";

const MoreInfo: React.FC<Movie> = ({
  title,
  bgName,
  year,
  runtime,
  director,
  writer,
  imdbRating,
  poster,
  plot,
  reason,
  genre,
  actors,
  country,
  metascore,
  type,
  boxOffice,
  totalSeasons
}) => {
  return (
    <div className="flex border border-gray-200 rounded p-4 shadow">
      {/* Poster on the left */}
      <div className="w-1/4">
        <img
          src={poster || "https://via.placeholder.com/100x150"}
          alt={title}
          className="object-cover rounded"
        />
      </div>

      {/* Details on the right */}
      <div className="w-3/4 pl-4">
        <h2 className="font-semibold">
          {title} / {bgName}
        </h2>
        <h4 className="text-gray-600">
          <strong> Защо този филм е подходящ за Вас? </strong>
        </h4>
        <h5>{reason}</h5>
        <p className="text-gray-600">
          <strong> Година: </strong>
          {year}
        </p>
        <p className="text-gray-600">
          <strong> Продължителност: </strong>
          {runtime}
        </p>
        <p className="text-gray-600">
          <strong> Режисьори:</strong> {director}
        </p>
        <p className="text-gray-600">
          <strong> Сценаристи: </strong>
          {writer}
        </p>
        <p className="text-gray-600">
          <strong> Рейтинг в IMDB: </strong>
          {imdbRating}
        </p>
        <p className="text-gray-600">
          <strong> Сюжет: </strong>
          {plot}
        </p>
        <p className="text-gray-600">
          <strong> Жанр:</strong> {genre}
        </p>
        <p className="text-gray-600">
          <strong> Актьори: </strong>
          {actors}
        </p>
        <p className="text-gray-600">
          <strong> Държава: </strong>
          {country}
        </p>
        <p className="text-gray-600">
          <strong> Рейтинг на критиците: </strong>
          {metascore}
        </p>
        {/* <p className="text-gray-600">{type}</p> */}
        <p className="text-gray-600 flex items-center">
          <span className="ml-1 relative group">
            {/* Info icon */}
            <span className="text-blue-500 cursor-pointer mr-1">ⓘ </span>

            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-32 text-sm text-white bg-black p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Това са приходите от продажба на всички билети за филма, докато
              той се върти по кината.
            </span>
          </span>
          <strong> Боксофис: </strong>
          {boxOffice}
        </p>
        <p className="text-gray-600">
          <strong> Сезони: </strong>
          {totalSeasons}
        </p>
      </div>
    </div>
  );
};

export default MoreInfo;
