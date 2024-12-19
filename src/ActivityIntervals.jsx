/* eslint-disable react/prop-types */
import { useState } from "react";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
import "dayjs/locale/fi";
import { createIntervalArray } from "./util/stats";
import { getTimestamps } from "./util/tasks";
import { formatToFinnishFormat, filterIntervals } from "./util/stats";
import TaskPicker from "./TaskPicker";
import DateTimeRangePicker from "./DateTimeRangerPicker";
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
  const [selectedTask, setSelectedTask] = useState(tasks[0] || "");
  const [startTime, setStartTime] = useState(dayjs().startOf("day"));
  const [endTime, setEndTime] = useState(dayjs());

  /**
   * Creates a JSX list of intervals
   * if the interval has no end time (null), it is not shown
   * @param {Array<object>} intervalArray - An array of objects with start and end properties
   * @returns {Array<JSX.Element>} - An array of JSX list items
   */
  const intervalList = (intervalArray) => {
    if (intervalArray.length === 0) {
      return (
        <ul>
          <li>Ei aktiivisuutta valitulla aikavälillä</li>
        </ul>
      );
    }
    const intervals = intervalArray.map((interval, i) => {
      return (
        <li key={i}>
          {formatToFinnishFormat(interval.activated)} -{" "}
          {formatToFinnishFormat(interval.ended)}
        </li>
      );
    });
    return (
      <ul>
        <strong>
          <li className="intervals-header">
            <span>Aloitettu </span>
            <span>Lopetettu</span>
          </li>
        </strong>
        {intervals}
      </ul>
    );
  };

  const correspondingTask = tasks.find(
    (task) => task.name === selectedTask.name
  );
  return (
    <div className="task-intervals-container">
      <div className="task-intervals-controls">
        <DateTimeRangePicker
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />
        <TaskPicker
          tasks={tasks}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      </div>
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
