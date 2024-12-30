import { Component, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";

import {
  ActorData,
  CountryData,
  DirectorData,
  MovieData,
  MovieProsperityData,
  RecommendationData,
  RoleData,
  WriterData
} from "../individualStats-types";
import { Link } from "react-router-dom";
import { ApexOptions } from "apexcharts";

// Revenue Statistics
interface spark3 {
  options?: ApexOptions;
  width?: string | number;
  height?: string | number;
  series?: ApexOptions["series"];
  [key: string]: any;
  label?: XAxisAnnotations | string;
  endingShape?: string;
}

//Category
export class Categorybar extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
        }
      ],
      options: {
        chart: {
          type: "bar",
          height: 320,
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          },
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "bottom"
            }
          }
        },
        colors: [
          "#845adf",
          "#23b7e5",
          "#f5b849",
          "#e6533c",
          "#49b6f5",
          "#a65e76",
          "#5b67c7",
          "#a65e9a",
          "#26bf94",
          "#23b7e5"
        ],
        grid: {
          borderColor: "#f2f5f7"
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#fff"]
          },
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: false
          }
        },
        stroke: {
          width: 1,
          colors: ["#fff"]
        },
        xaxis: {
          categories: [
            "South Korea",
            "Canada",
            "United Kingdom",
            "Netherlands",
            "Italy",
            "France",
            "Japan",
            "United States",
            "China",
            "India"
          ],
          labels: {
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-label"
            }
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          theme: "dark",
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return "";
              }
            }
          }
        }
      }
    };
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        height={350}
      />
    );
  }
}
