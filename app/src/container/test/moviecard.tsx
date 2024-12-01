import React from "react";
import { MovieCardInit } from "./test-types";

const MovieCard: React.FC<MovieCardInit> = ({
  title,
  bgName,
  reason,
  poster,
  onSeeMore
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
        <h3 className="text-lg font-semibold">
          {title} / {bgName}
        </h3>
        <h5 className="text-gray-600">
          <strong> Защо този филм е подходящ за Вас? </strong>
        </h5>
        <h6>{reason}</h6>

        {/* See More button */}
        <button
          onClick={onSeeMore}
          className="text-blue-500 hover:text-blue-700 mt-2 text-sm border border-black"
        >
          Вижте повече
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
