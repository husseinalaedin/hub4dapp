import ReactECharts from "echarts-for-react";

import * as dark from "../../../../echart/dark.chart.json";
import * as dim from "../../../../echart/dim.chart.json";

import { useEffect, useRef, useState } from "react";
import { useAppTheme } from "../../../../hooks/useAppTheme";

import * as echarts from "echarts";
import { useViewportSize } from "@mantine/hooks";
import {
  Box,
  Button,
  darken,
  Group,
  lighten,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Q } from "../../../../global/Q";
import { D } from "../../../../global/Date";
import { useChangeLanguage } from "../../../../hooks/useChangeLanLocal";

import { FN } from "../../../../global/Locals";

echarts.registerTheme("dark0", dark.theme);
echarts.registerTheme("dim", dim.theme);
// echarts.init(dark, 'dark0')

export const SharedVsResponsesPerGroup = ({ data, t }) => {
  let [thm, setTm] = useState<any>("dark0");
  let { theme } = useAppTheme();
  useEffect(() => {
    setTm(() => {
      return theme == "dark" ? "dark0" : theme == "dim" ? "dim" : "light";
    });
  }, [theme]);
  const { height, width } = useViewportSize();
  const instance = useRef<any>(null);
  useEffect(() => {
    if (instance) {
      instance.current.resize();
    }
  }, [height, width]);

  const option = {
    title: {
      left: "center",
      top: "10px",
    },
    tooltip: {
      trigger: "item",
      formatter: format_tool_tip_pie,
    },
    legend: {
      orient: "vertical",
      left: "10px",
      top: "10px",
    },
    series: [
      {
        name: t("shared", "Shared"),
        type: "pie",
        radius: [0, "30%"],
        data: data?.map((itm, idx) => {
          return {
            value: itm.nb_shared,
            name: itm.channel_group,
          };
        }),
      },
      {
        name: t("responses", "Responses"),
        type: "pie",
        radius: ["45%", "60%"],
        data: data?.map((itm, idx) => {
          return {
            value: itm.nb_responses,
            name: itm.channel_group,
          };
        }),
      },
    ],
  };

  return (
    <ReactECharts
      ref={instance}
      option={option}
      theme={thm}
      style={{ height: "100%", width: "calc(100% - 2px)" }}
    />
  );
};

export const SharedVsResponsesPerGroup2 = ({
  data,
  t,
  x_group,
  show_tools,
}) => {
  let [thm, setTm] = useState<any>("dark0");
  let { theme } = useAppTheme();
  useEffect(() => {
    setTm(() => {
      return theme == "dark" ? "dark0" : theme == "dim" ? "dim" : "light";
    });
  }, [theme]);
  const { height, width } = useViewportSize();
  const instance = useRef<any>(null);
  useEffect(() => {
    if (instance) {
      instance.current.resize();
    }
  }, [height, width]);

  const option = {
    toolbox: {
      show: show_tools,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
          title: {
            zoom: t("zoom", "Zoom"),
            back: t("zoom", "Reset Zoom"),
          },
        },
        dataView: {
          show: true,
          readOnly: true,
          title: t("dataview", "Data View"),
        },
        magicType: {
          type: ["line", "bar"],
          title: {
            line: t("switch_to_line", "Switch To Line View"),
            bar: t("switch_to_bar", "Switch To Bar View"),
          },
        },
        restore: { title: t("restore", "Restore") },
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        show: show_tools,
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "empty",
      },
    ],
    grid: {
      containLabel: true,
    },
    legend: {
      orient: "horizontal",
      left: "10px",
      top: "10px",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          formatter: format_tool_tip_axis_pointer_label_except_x_axis,
        },
      },
      formatter: format_tool_tip,
    },
    dataset: { source: data ? data : [] },
    xAxis: {
      type: "category",
      axisLabel: {
        interval: 0,
        rotate: 60,
        color: format_label_color(theme),
      },
    },
    yAxis: [
      {
        type: "value",
        min: 0,
        alignTicks: true,
        position: "left",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: format_value,
          color: format_label_color(theme),
        },
      },
      {
        type: "value",
        min: 0,
        alignTicks: true,
        position: "right",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: format_value,
          color: format_label_color(theme),
        },
      },
      {
        type: "value",
        min: 0,
        alignTicks: false,
        position: "right",
        offset: 70,
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: format_value,
          color: format_label_color(theme),
        },
      },
    ],
    series: [
      {
        type: "bar",
        name: t("shares", "Shares"),

        encode: {
          x: x_group,
          y: "nb_shared",
        },
      },
      {
        type: "line",
        name: t("responses", "Responses"),
        encode: {
          x: x_group,
          y: "nb_responses_per_share",
        },
        yAxisIndex: 1,
      },
      {
        type: "line",
        name: t("performance", "Performance Responses Per Share"),
        encode: {
          x: x_group,
          y: "performance_per_share",
        },
        yAxisIndex: 2,
      },
    ],
  };

  return (
    <ReactECharts
      ref={instance}
      option={option}
      theme={thm}
      style={{ height: "100%", width: "calc(100% - 2px)" }}
    />
  );
};

export const SharesResponsesPerMonth = ({ data, t, x_group, show_tools }) => {
  let [thm, setTm] = useState<any>("dark0");
  let { theme } = useAppTheme();
  const [source, setSource] = useState<any>([]);
  useEffect(() => {
    setTm(() => {
      return theme == "dark" ? "dark0" : theme == "dim" ? "dim" : "light";
    });
  }, [theme]);
  const { height, width } = useViewportSize();
  const instance = useRef<any>(null);
  useEffect(() => {
    if (instance) {
      instance.current.resize();
    }
  }, [height, width]);
  useEffect(() => {
    let src = Q.GroupBy(
      data,
      ["year", "month"],
      ["nb_shared", "nb_responses"],
      { year_month: ["year", "-", "month"] }
    );
    setSource(src);
  }, [data]);
  const option = {
    toolbox: {
      show: show_tools,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
          title: {
            zoom: t("zoom", "Zoom"),
            back: t("zoom", "Reset Zoom"),
          },
        },
        dataView: {
          show: true,
          readOnly: true,
          title: t("dataview", "Data View"),
        },
        magicType: {
          type: ["line", "bar"],
          title: {
            line: t("switch_to_line", "Switch To Line View"),
            bar: t("switch_to_bar", "Switch To Bar View"),
          },
        },
        restore: { title: t("restore", "Restore") },
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        show: show_tools,
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "empty",
      },
    ],
    grid: {
      containLabel: true,
    },
    legend: {
      orient: "horizontal",
      left: "10px",
      top: "10px",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          formatter: format_tool_tip_axis_pointer_label_except_x_axis,
        },
      },
      formatter: format_tool_tip,
    },
    dataset: [
      {
        id: "raw_data",
        dimensions: [
          "year",
          "month",
          "year_month",
          "nb_shared",
          "nb_responses",
        ],
        source: source,
      },
      {
        id: "sorted_data",
        fromDatasetId: "raw_data",
        transform: [
          {
            type: "sort",
            config: [
              { dimension: "year", order: "asc" },
              { dimension: "month", order: "asc" },
            ],
          },
        ],
      },
    ],
    xAxis: {
      type: "category",
      axisLabel: {
        interval: 0,
        rotate: 30,
        color: format_label_color(theme),
      },
    },
    yAxis: [
      {
        type: "value",
        min: 0,
        alignTicks: true,
        position: "left",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: format_value,
          color: format_label_color(theme),
        },
      },
      {
        type: "value",
        min: 0,
        alignTicks: true,
        position: "right",
        axisPointer: {
          type: "line",
        },
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: format_value,
          color: format_label_color(theme),
        },
      },
    ],
    series: [
      {
        datasetId: "sorted_data",
        type: "line",
        name: t("shares", "Shares"),
        encode: {
          x: x_group,
          y: "nb_shared",
        },
      },
      {
        datasetId: "sorted_data",
        type: "line",
        name: t("responses", "Responses"),
        encode: {
          x: x_group,
          y: "nb_responses",
        },
        yAxisIndex: 1,
      },
    ],
  };

  return (
    <ReactECharts
      ref={instance}
      option={option}
      theme={thm}
      style={{ height: "100%", width: "calc(100% - 2px)" }}
    />
  );
};
export const SharesResponsesPerDay = ({ data, t, x_group, show_tools }) => {
  let [thm, setTm] = useState<any>("dark0");
  let { theme } = useAppTheme();
  const [source, setSource] = useState<any>([]);

  useEffect(() => {
    setTm(() => {
      return theme == "dark" ? "dark0" : theme == "dim" ? "dim" : "light";
    });
  }, [theme]);
  const { height, width } = useViewportSize();
  const instance = useRef<any>(null);
  useEffect(() => {
    if (instance) {
      instance.current.resize();
    }
  }, [height, width]);

  useEffect(() => {
    let src = Q.GroupBy(
      D.add_days_to_data(data, "created_on"),
      ["day_name", "day"],
      ["nb_shared", "nb_responses"]
    );
    setSource(src);
  }, [data]);
  const option = {
    toolbox: {
      show: show_tools,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
          title: {
            zoom: t("zoom", "Zoom"),
            back: t("zoom", "Reset Zoom"),
          },
        },
        dataView: {
          show: true,
          readOnly: true,
          title: t("dataview", "Data View"),
        },
        magicType: {
          type: ["line", "bar"],
          title: {
            line: t("switch_to_line", "Switch To Line View"),
            bar: t("switch_to_bar", "Switch To Bar View"),
          },
        },
        restore: { title: t("restore", "Restore") },
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        show: show_tools,
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "empty",
      },
    ],
    grid: {
      containLabel: true,
    },
    legend: {
      orient: "horizontal",
      left: "10px",
      top: "10px",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          formatter: format_tool_tip_axis_pointer_label_except_x_axis,
        },
      },
      formatter: format_tool_tip,
    },
    dataset: [
      {
        id: "raw_data",
        dimensions: [
          "year",
          "month",
          "year_month",
          "nb_shared",
          "nb_responses",
          "day",
          "day_name",
        ],
        source: source,
      },
      {
        id: "sorted_data",
        fromDatasetId: "raw_data",
        transform: [
          {
            type: "sort",
            config: [{ dimension: "day", order: "asc" }],
          },
        ],
      },
    ],
    xAxis: {
      type: "category",
      axisLabel: {
        interval: 0,
        rotate: 30,
        color: format_label_color(theme),
      },
    },
    yAxis: [
      {
        type: "value",
        min: 0,
        alignTicks: true,
        position: "left",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: format_value,
          color: format_label_color(theme),
        },
      },
      {
        type: "value",
        min: 0,
        alignTicks: true,
        position: "right",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: format_value,
          color: format_label_color(theme),
        },
      },
    ],
    series: [
      {
        datasetId: "sorted_data",
        type: "line",
        name: t("shares", "Shares"),
        areaStyle: {},
        encode: {
          x: x_group,
          y: "nb_shared",
        },
      },
      {
        datasetId: "sorted_data",
        type: "line",
        name: t("responses", "Responses"),
        areaStyle: {},
        encode: {
          x: x_group,
          y: "nb_responses",
        },
        yAxisIndex: 1,
      },
    ],
  };

  return (
    <ReactECharts
      ref={instance}
      option={option}
      theme={thm}
      style={{ height: "100%", width: "calc(100% - 2px)" }}
    />
  );
};

export const SharesResponsesCalendar = ({
  data,
  t,
  field,
  years,
  show_tools,
  maxPerformance,
}) => {
  let [thm, setTm] = useState<any>("dark0");
  let [calendars, setCalendars] = useState<any>([]);
  let [series, setSeries] = useState<any>([]);

  let { theme } = useAppTheme();
  let { changeLang } = useChangeLanguage();
  const [source, setSource] = useState<any>([]);
  useEffect(() => {
    setTm(() => {
      return theme == "dark" ? "dark0" : theme == "dim" ? "dim" : "light";
    });
  }, [theme]);
  const { height, width } = useViewportSize();
  const instance = useRef<any>(null);
  useEffect(() => {
    if (instance) {
      instance.current.resize();
    }
  }, [height, width]);

  const calendar_data = () => {
    let calendars_0: any = [];
    let series_0: any = [];
    let left = 150;
    let idx = 0;
    for (let i = 0; i < years.length; i++) {
      calendars_0.push({
        left: left.toString(),
        orient: "vertical",
        range: years[i].year.toString(),
        cellSize: [20, 20],
        dayLabel: { nameMap: D.get_days_abrev() },
        monthLabel: { nameMap: D.get_months_abrev() },
      });
      series_0.push({
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: idx,
        data: get_calendar_data(
          data,
          years[i].year,
          "year",
          "created_on",
          field
        ),
      });
      left = left + 200;
      idx++;
    }
    setCalendars(() => {
      return calendars_0;
    });
    setSeries(() => {
      return series_0;
    });
  };

  useEffect(() => {
    calendar_data();
  }, [years, data]);
  const option = {
    tooltip: {
      position: "top",
      formatter: function (p) {
        const format = echarts.time.format(
          p.data[0],
          "{yyyy}-{MM}-{dd}",
          false
        );
        return format + ": " + FN(p.data[1]);
      },
    },
    visualMap: {
      top: 50,
      min: 0,
      max: maxPerformance,
      inRange: {
        color:
          thm == "dim" || thm == "dark0"
            ? ["#0e4429", "#39d353"]
            : ["#bae0ff", "#001d66"],
      },
      calculable: true,
      orient: "vertical",
      type: "piecewise",
    },
    calendar: calendars,
    series: series,
  };

  return (
    <ScrollArea h="100%">
      <ReactECharts
        ref={instance}
        option={option}
        theme={thm}
        style={{ height: "1150px", width: "calc(100% - 2px)" }}
      />
    </ScrollArea>
  );
};
export const SharesResponsesGaugePerformance = ({ data }) => {
  let [thm, setTm] = useState<any>("dark0");
  let themeC = useMantineTheme();
  let { theme } = useAppTheme();
  let [value, setValue] = useState<number>(0);
  let [colors, setColors] = useState<any>([1 / 10, "#73b9bc"]);
  let { changeLang } = useChangeLanguage();
  useEffect(() => {
    let clr = theme == "dark" || theme == "dim" ? "#73b9bc" : "#3fb1e3";
    // if (theme == 'dark' || "dim") {
    let clrs: any = [];

    for (let i = 1; i <= 10; i++) {
      if (i < 5) clrs.push([i / 10, lighten(clr, (5 - i) / 10)]);
      else clrs.push([i / 10, darken(clr, (i - 5) / 10)]);
    }
    setColors(() => {
      return clrs;
    });
    // }
    setTm(() => {
      return theme == "dark" ? "dark0" : theme == "dim" ? "dim" : "light";
    });
  }, [theme]);
  const { height, width } = useViewportSize();
  const instance = useRef<any>(null);
  useEffect(() => {
    if (instance) {
      instance.current.resize();
    }
  }, [height, width]);

  useEffect(() => {
    const dataR = Q.GroupBy(data, [], ["nb_shared", "nb_responses"]);
    setValue(() => {
      if (!(dataR && dataR.length > 0)) return 0;
      let v = 0;
      let dt: any = dataR[0];
      let shrd = dt["nb_shared"];
      let resp = dt["nb_responses"];
      shrd = shrd ? shrd : 0;
      resp = resp ? resp : 0;
      if (shrd == 0) v = resp;
      v = (100 * resp) / shrd;
      return +v.toFixed(0);
    });
  }, [data]);

  const option = {
    series: [
      {
        type: "gauge",
        axisLine: {
          lineStyle: {
            width: 30,
            //thm == 'dim' || thm == 'dark0' ?
            color:
              // [[1 / 10, themeC.fn.lighten('#73b9bc', 0.5)], [2 / 10, themeC.fn.lighten('#73b9bc', 0.4)], [3 / 10, '#B2F2BB'], [4 / 10, '#8CE99A'], [5 / 10, '#69DB7C'], [6 / 10, '#51CF66'], [7 / 10, '#40C057'], [8 / 10, '#37B24D'], [9 / 10, '#2F9E44'], [10 / 10, '#2B8A3E']]
              colors,
            // : [[1 / 10, '#EDF2FF'], [2 / 10, '#DBE4FF'], [3 / 10, '#BAC8FF'], [4 / 10, '#91A7FF'], [5 / 10, '#748FFC'], [6 / 10, '#5C7CFA'], [7 / 10, '#5C7CFA'], [8 / 10, '#5C7CFA'], [9 / 10, '#5C7CFA'], [10 / 10, '#5C7CFA']]
            // [
            //     [0.3, '#67e0e3'],
            //     [0.7, '#37a2da'],
            //     [1, '#fd666d']
            // ]
            // '#69b1ff', '#4096ff', '#1677ff', '#0958d9'
          },
        },
        pointer: {
          itemStyle: {
            color: "inherit",
          },
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: "#fff",
            width: 2,
          },
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: "#fff",
            width: 4,
          },
        },
        axisLabel: {
          color: "inherit", //thm == 'dim' || thm == 'dark0' ? 'white':'black',
          distance: 40,
          fontSize: 15,
          fontWeight: 550,
        },
        detail: {
          valueAnimation: true,
          formatter: format_value,
          color: "inherit", // thm == 'dim' || thm == 'dark0' ? 'green' : 'black',
          // fontSize: 25
        },
        data: [
          {
            value: value,
          },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      ref={instance}
      option={option}
      theme={thm}
      style={{ height: "100%", width: "calc(100% - 2px)" }}
    />
  );
};
export const SharesResponsesCounts = ({
  data,
  t,
  field,
  show_tools,
  c,
  label,
}) => {
  const totalsCalc = (data) => {
    if (!data) return 0;
    let tot = 0;
    for (let i = 0; i < data.length; i++) {
      tot = tot + +data[i][field];
    }
    return tot;
  };
  const [totals, setTotals] = useState<number>(() => {
    return totalsCalc(data);
  });

  useEffect(() => {
    setTotals(() => {
      return totalsCalc(data);
    });
  }, [data]);
  return (
    // <Stack fz={64} align="center" justify="center"  h={300} sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] })}>

    // </Stack>
    <Group
      fz={64}
      align="center"
      h="100%"
      justify="center"
      gap={0}
      c={c}
      fw="bolder"
    >
      <Box>
        {/* <NumericFormat displayType="text" value={totals} thousandSeparator={thousandSep()} decimalSeparator={decimalSep()} /> */}
        <Text fz={45}>{FN(totals)}</Text>
        <Text fz={45} mt={-15}>{label}</Text>
      </Box>
    </Group>
    // <Stack align="center" justify="center"  h={300} sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] })}>
    //     <Button variant="outline">1</Button>
    //     <Button variant="outline">2</Button>
    //     <Button variant="outline">3</Button>
    // </Stack>
  );
};
const get_calendar_data = (data, year, year_field, date_field, data_field) => {
  const dataC: any = [];
  if (data) {
    data.map((datum) => {
      if (datum[year_field] === year) {
        let time = datum[date_field];
        dataC.push([
          echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
          datum[data_field],
        ]);
      }
    });
  }
  return dataC;
};

const format_tool_tip = (params) => {
  let output = "<b>" + params[0].name + "</b><br/>";
  for (let i = 0; i < params.length; i++) {
    let dim = params[i].dimensionNames[params[i].encode.y[0]];
    if (dim in params[i].value) {
      output +=
        params[i].marker +
        params[i].seriesName +
        ": " +
        FN(params[i].value[dim]);
      if (i != params.length - 1) {
        // Append a <br/> tag if not last in loop
        output += "<br/>";
      }
    }
  }
  return output;
};
const format_tool_tip_pie = (params) => {
  return params.marker + params.seriesName + ": " + FN(params.value);
};
const format_value = (value) => {
  return FN(value);
};

function format_tool_tip_axis_pointer_label_except_x_axis(value) {
  if (value.axisDimension == "x") return value.value;
  return FN(value.value);
}
const format_label_color = (theme) => {
  return theme == "light" ? null : "#eeeeee";
};
