/* eslint react/prop-types: */
import DateTimeRangePicker from "./DateTimeRangerPicker";
import dayjs from "dayjs";
import { useState } from "react";
import {
  createIntervalArray,
  filterIntervals,
  getTotalActiveTime,
} from "./util/stats";
import { getTimestamps } from "./util/tasks";
import TaskPicker from "./TaskPicker";
import { BarChart as Chart } from "@mui/x-charts/BarChart";
import SkipInactiveDates from "./SkipInactiveDates";
import { formatTotalTime } from "./util/stats";

const Barchart = ({ tasks, timestamps }) => {
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedTask, setSelectedTask] = useState(tasks[0] || "");
  const [skipInactiveDates, setSkipInactiveDates] = useState(false);

  const createDayIntervals = () => {
    console.log("selectedTask", selectedTask);
    const intervalArray = createIntervalArray(
      getTimestamps(selectedTask, timestamps)
    );
    console.log("intervalArray", intervalArray);
    const dayIntervals = [];
    let currentDate = startDate.clone();

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const dayStart = currentDate.startOf("day");
      const dayEnd = currentDate.endOf("day");

      const dayIntervalsForDay = filterIntervals(
        intervalArray,
        dayStart,
        dayEnd
      ).map(({ activated, ended }) => {
        activated = dayjs(activated);
        ended = ended ? dayjs(ended) : null;

        if (activated.isBefore(dayStart)) {
          activated = dayStart;
        }
        if (ended && ended.isAfter(dayEnd)) {
          ended = dayEnd;
        }

        return { activated, ended };
      });

      dayIntervals.push({
        day: currentDate.clone(),
        intervals: dayIntervalsForDay,
      });

      currentDate = currentDate.add(1, "day");
    }
    return dayIntervals;
  };

  const intervalsPerDay = createDayIntervals();

  const activeTimePerDay = intervalsPerDay
    .map(({ day, intervals }) => {
      const activeTime = getTotalActiveTime(
        intervals,
        day.startOf("day"),
        day.endOf("day")
      );
      console.log("activeTime", activeTime);
      const totalHours = activeTime / 3600;
      return { day: dayjs(day).format("DD.MM.YYYY"), activeTime: totalHours };
    })
    .filter(({ activeTime }) => (skipInactiveDates ? activeTime > 0 : true));

  const chartSettings = {
    xAxis: [
      {
        label: "Aktiivisuusaika tunteina",
        min: 0,
        max: 24,
      },
    ],
    width: 450,
    height: 200 + activeTimePerDay.length * 50,
  };

  const valueFormatter = (value) =>
    `Aktiivinen: ${formatTotalTime(value * 3600)}`;

  return (
    <div>
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}
      >
        <DateTimeRangePicker
          startTime={startDate}
          setStartTime={setStartDate}
          endTime={endDate}
          setEndTime={setEndDate}
          onlyDate={true}
        />
        <TaskPicker
          tasks={tasks}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
        {selectedTask && (
          <SkipInactiveDates
            skipInactiveDates={skipInactiveDates}
            setSkipInactiveDates={setSkipInactiveDates}
          />
        )}
      </div>
      {selectedTask && (
        <Chart
          dataset={activeTimePerDay}
          yAxis={[{ scaleType: "band", dataKey: "day" }]}
          series={[{ dataKey: "activeTime", valueFormatter }]}
          sx={{ margin: 5 }} // y-axis label is cutting off a bit every time when the chart height increases. Margin makes it visible.
          layout="horizontal"
          {...chartSettings}
        />
      )}
    </div>
  );
};

export default Barchart;
