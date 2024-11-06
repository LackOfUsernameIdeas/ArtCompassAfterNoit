import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// Revenue Statistics
interface spark3 {
  options?: ApexOptions;
  width?: string | number;
  height?: string | number;
  series?: ApexOptions["series"];
  [key: string]: any;
  label?: XAxisAnnotations;
  endingShape?: string;
}
const dataSeries = [
  [
    {
      date: "2014-01-01",
      value: 20000000
    },
    {
      date: "2014-01-02",
      value: 30000000
    },
    {
      date: "2014-01-03",
      value: 20000000
    },
    {
      date: "2014-01-04",
      value: 40000000
    }
  ]
];
let ts2 = 1484418600000;
const dates: any = [];
//   var spikes = [5, -5, 3, -3, 8, -8]
for (let i = 0; i < 120; i++) {
  ts2 = ts2 + 86400000;
  const innerArr = [ts2, dataSeries[1][i].value];
  dates.push(innerArr);
}
export class Zoomabletime extends Component<{}, spark3> {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      series: [
        {
          name: "XYZ MOTORS",
          data: dates
        }
      ],
      options: {
        chart: {
          type: "area",
          stacked: false,
          height: 320,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: "zoom"
          },
          events: {
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        title: {
          text: "Stock Price Movement",
          align: "left",
          style: {
            fontSize: "13px",
            fontWeight: "bold",
            color: "#8c9097"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          }
        },
        grid: {
          borderColor: "#f2f5f7"
        },
        colors: ["#845adf"],
        yaxis: {
          labels: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0);
            },
            show: true,
            style: {
              colors: "#8c9097",
              fontSize: "11px",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label"
            }
          },
          title: {
            text: "Price",
            style: {
              color: "#8c9097",
              fontSize: "13px",
              fontWeight: "bold"
            }
          }
        },
        xaxis: {
          type: "datetime",
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
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0);
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
        type="area"
        height={300}
      />
    );
  }
}
