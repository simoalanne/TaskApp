/* eslint-disable react/prop-types */
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
import "dayjs/locale/fi";
import { createIntervalArray } from "./util/stats";
import { getTimestamps } from "./util/tasks";
import { formatToFinnishFormat, filterIntervals } from "./util/stats";
import "./ActivityIntervals.css";
dayjs.extend(isBetween);

/**
 * Renders a container where the user can select a task and a time range
 * which are used to filter and display the task's intervals in a chronological list.
 * @param {Array} tasks - An array of task objects.
 * @param {Array} timestamps - An array of timestamp objects.
 * @returns {JSX.Element} - A container with input fields and a list of intervals corresponding to the selected inputs
 */
const ActivityIntervals = ({ tasks, timestamps }) => {
  const [selectedTask, setSelectedTask] = useState(tasks[0]?.name); // default to the first task
  const [startTime, setStartTime] = useState(dayjs().startOf("day"));
  const [endTime, setEndTime] = useState(dayjs());
  const taskNames = tasks.map((task) => task.name);

  /**
   * Creates a JSX list of intervals
   * if the interval has no end time (null), it is not shown
   * @param {Array<object>} intervalArray - An array of objects with start and end properties
   * @returns {Array<JSX.Element>} - An array of JSX list items
   */
  const intervalList = (intervalArray) => {
    if (intervalArray.length === 0) {
      return <ul><li>Ei aktiivisuutta valitulla aikavälillä</li></ul>;
    }
    const intervals = intervalArray.map((interval, i) => {
      return (
        <li key={i}>
          {formatToFinnishFormat(interval.activated)} -{" "}
          {formatToFinnishFormat(interval.ended)}
        </li>
      );
    });
    return <ul>{intervals}</ul>;
  };

  const correspondingTask = tasks.find((task) => task.name === selectedTask);
  return (
    <div className="task-intervals-container">
      <div className="task-intervals-controls">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
          <DateTimePicker
            className="task-intervals-picker"
            value={startTime}
            onChange={setStartTime}
            ampm={false}
            label="Aloitusajankohta ja -aika"
          />
          <DateTimePicker
            className="task-intervals-picker"
            value={endTime}
            onChange={setEndTime}
            ampm={false}
            label="Lopetusajankohta ja -aika"
          />
        </LocalizationProvider>
        <FormControl className="task-intervals-select">
          <InputLabel id="chosen-task">
            {tasks.length === 0 ? "Ei tehtäviä" : "Valitse tarkasteltava tehtävä"}
          </InputLabel>
          <Select
            labelId="chosen-task"
            id="chosen-task"
            value={selectedTask || ""}
            onChange={(e) => setSelectedTask(e.target.value)}
            disabled={tasks.length === 0}
          >
            {taskNames.map((taskName, i) => (
              <MenuItem key={i} value={taskName}>
                {taskName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {tasks.length > 0 && <p style={{textAlign: "center"}}>Tehtävän aloitus- ja lopetusajat valitulta aikaväliltä:</p> }
      <div className="task-intervals-list">
        {correspondingTask &&
          intervalList(
            filterIntervals(
              createIntervalArray(getTimestamps(correspondingTask, timestamps)),
              startTime,
              endTime
            )
          )}
      </div>
    </div>
  );
};

export default ActivityIntervals;
