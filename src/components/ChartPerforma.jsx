import React, { useState, useEffect } from "react";
import { getChartLayanan } from "../services/chartLayananService";

const ChartPerforma = () => {
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setIsChartVisible(false);

        const response = await getChartLayanan();

        const colors = [
          "bg-green-400",
          "bg-blue-400",
          "bg-yellow-400",
          "bg-purple-400",
          "bg-pink-400",
          "bg-indigo-400",
          "bg-red-400",
          "bg-orange-400",
          "bg-teal-400",
        ];

        const transformedData = response.data.map((item, index) => ({
          label: item.label,
          value: item.value,
          color: colors[index % colors.length],
          date: item.date || new Date().toLocaleDateString("id-ID"),
        }));

        setChartData(transformedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Trigger chart animation after data loaded
  useEffect(() => {
    if (!loading && chartData.length > 0) {
      const timerChart = setTimeout(() => setIsChartVisible(true), 200);
      return () => clearTimeout(timerChart);
    }
  }, [loading, chartData]);

  // Dapatkan tanggal terbaru dari data
  const latestUpdate =
    chartData.length > 0
      ? chartData[chartData.length - 1].date
      : new Date().toLocaleDateString("id-ID");

  // Skeleton Loading Component
  const ChartSkeleton = () => (
    <div className="space-y-2 md:space-y-2.5">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex items-center gap-2 md:gap-3">
          <div
            className="h-2.5 bg-gray-600/30 rounded animate-pulse flex-shrink-0"
            style={{
              width: "60px",
              animationDelay: `${index * 100}ms`,
              animationDuration: "1.5s",
            }}
          ></div>
          <div
            className="h-6 md:h-7 bg-gray-600/30 rounded-r-lg animate-pulse flex-1"
            style={{
              animationDelay: `${index * 100}ms`,
              animationDuration: "1.5s",
            }}
          ></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex justify-center w-full px-4 sm:px-6">
      <div className="backdrop-blur-xl rounded-2xl p-4 md:p-5 w-full max-w-2xl relative overflow-hidden">
        {/* Gradient decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl translate-y-8 -translate-x-8"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              </span>
            </div>
            <h3 className="text-white text-base md:text-lg font-bold text-center md:text-left">
              Layanan GALAMAI
            </h3>
          </div>

          {/* Chart Content - Horizontal Bars */}
          {loading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="space-y-2.5 md:space-y-3">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 md:gap-3 group relative min-h-fit"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Label - Fixed width dengan text handling */}
                    <div className="w-20 md:w-24 lg:w-28 flex-shrink-0">
                      <div
                        className={`text-white text-[9px] md:text-xs lg:text-sm font-medium text-right transition-all duration-500 line-clamp-2 leading-tight ${
                          isChartVisible
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-4 opacity-0"
                        } ${
                          hoveredBar === index
                            ? "text-green-400 font-semibold"
                            : ""
                        }`}
                        style={{
                          transitionDelay: `${index * 100}ms`,
                          wordBreak: "break-word",
                        }}
                        title={item.label}
                      >
                        {item.label}
                      </div>
                    </div>

                    {/* Bar Container */}
                    <div className="flex-1 relative min-w-0">
                      {/* Tooltip */}
                      {hoveredBar === index && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-20 transition-all duration-300">
                          <div className="bg-gray-900/95 backdrop-blur-sm text-white px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg shadow-xl border border-gray-700/50 min-w-max">
                            <div className="text-left">
                              <div className="font-bold text-sm md:text-base text-green-400">
                                {item.value}
                              </div>
                              <div className="text-[10px] md:text-xs text-gray-200 font-medium max-w-xs truncate">
                                {item.label}
                              </div>
                              <div className="text-[9px] md:text-xs text-gray-400 mt-0.5">
                                {item.date}
                              </div>
                            </div>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2">
                              <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900/95"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`h-6 md:h-7 lg:h-8 ${
                          item.color
                        } rounded-r-lg shadow-md relative overflow-hidden transform transition-all duration-500 ease-out cursor-pointer ${
                          hoveredBar === index
                            ? "scale-105 shadow-xl brightness-110"
                            : "hover:scale-102 hover:shadow-lg"
                        } ${
                          isChartVisible
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-8 opacity-0"
                        }`}
                        style={{
                          width: isChartVisible ? `${item.value}%` : "0%",
                          transitionDelay: `${index * 100}ms`,
                          minWidth: isChartVisible ? "20px" : "0px",
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                        {/* Hover overlay */}
                        {hoveredBar === index && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-r-lg"></div>
                        )}

                        {/* Value inside bar */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white font-bold text-[9px] md:text-xs lg:text-sm whitespace-nowrap">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Update Terbaru */}
              <div className="mt-4 text-center text-gray-300 text-xs md:text-sm italic">
                Update terbaru:{" "}
                <span className="text-green-400 font-semibold">
                  {latestUpdate}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartPerforma;
