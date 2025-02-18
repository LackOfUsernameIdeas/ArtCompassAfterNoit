import { FC, useState, useEffect } from "react";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { moviesSeriesGenreOptions } from "../../../data_common";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    genres: string[];
    runtime: string[];
    type: string[];
    year: string[];
  }) => void;
}

const FilterSidebar: FC<FilterSidebarProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [isGenreVisible, setIsGenreVisible] = useState(false);
  const [isRuntimeVisible, setIsRuntimeVisible] = useState(false);
  const [isTypeVisible, setIsTypeVisible] = useState(false);
  const [isYearVisible, setIsYearVisible] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedRuntime, setSelectedRuntime] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);

  // Disable page scroll when the sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSelectedRuntime([]);
    setSelectedType([]);
    setSelectedYear([]);

    // Apply the reset filters immediately
    onApplyFilters({
      genres: [],
      runtime: [],
      type: [],
      year: [],
    });
  };

  const toggleGenreVisibility = () => setIsGenreVisible(!isGenreVisible);
  const toggleRuntimeVisibility = () => setIsRuntimeVisible(!isRuntimeVisible);
  const toggleTypeVisibility = () => setIsTypeVisible(!isTypeVisible);
  const toggleYearVisibility = () => setIsYearVisible(!isYearVisible);

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleRuntimeChange = (runtime: string) => {
    setSelectedRuntime((prev) =>
      prev.includes(runtime) ? prev.filter((r) => r !== runtime) : [...prev, runtime]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleYearChange = (year: string) => {
    setSelectedYear((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      genres: selectedGenres,
      runtime: selectedRuntime,
      type: selectedType,
      year: selectedYear,
    });
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-bodybg dark:bg-bodybg shadow-lg transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 p-4 overflow-y-auto`}
    >
      <button
        className="absolute top-4 right-4 dark:text-white hover:text-black"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      <h3 className="text-lg font-bold opsilion mb-4">Филтриране</h3>
      <div className="space-y-4">
        {/* Жанр Section */}
        <div>
          <button
            className="opsilion text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md"
            onClick={toggleGenreVisibility}
          >
            Жанр {isGenreVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isGenreVisible && (
            <div className="mt-2 space-y-2">
              {moviesSeriesGenreOptions.map(({ bg }) => (
                <div key={bg} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(bg)}
                    onChange={() => handleGenreChange(bg)}
                    className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                  <span className="opsilion text-sm">{bg}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Runtime Section */}
        <div>
          <button
            className="opsilion text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md"
            onClick={toggleRuntimeVisibility}
          >
            Продължителност {isRuntimeVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isRuntimeVisible && (
            <div className="mt-2 space-y-2">
              {["Под 60 минути", "60 до 120 минути", "120 до 180 минути", "Повече от 180 минути"].map(
                (option) => (
                  <div key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRuntime.includes(option)}
                      onChange={() => handleRuntimeChange(option)}
                      className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <span className="opsilion text-sm">{option}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Type Section */}
        <div>
          <button
            className="opsilion text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md"
            onClick={toggleTypeVisibility}
          >
            Вид {isTypeVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isTypeVisible && (
            <div className="mt-2 space-y-2">
              {["Филм", "Сериал"].map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedType.includes(option)}
                    onChange={() => handleTypeChange(option)}
                    className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                  <span className="opsilion text-sm">{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Year of Release Section */}
        <div>
          <button
            className="opsilion text-sm flex items-center justify-between w-full bg-white dark:bg-bodybg2 px-4 py-2 rounded-md shadow-md"
            onClick={toggleYearVisibility}
          >
            Година на излизане {isYearVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {isYearVisible && (
            <div className="mt-2 space-y-2">
              {["Преди 2000", "2000 до 2010", "2010 до 2020", "След 2020"].map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedYear.includes(option)}
                    onChange={() => handleYearChange(option)}
                    className="cursor-pointer bg-white dark:bg-bodybg2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                  <span className="opsilion text-sm">{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset and Apply Buttons */}
        <div className="flex flex-col gap-2">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition w-full"
            onClick={handleResetFilters}
          >
            Нулиране на филтрите
          </button>
          <button
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition w-full"
            onClick={handleApplyFilters}
          >
            Приложи
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;