/* eslint react/prop-types: */
import { useState } from "react";
import DateTimeRangePicker from "./DateTimeRangerPicker";
import dayjs from "dayjs";
import { getTimestamps } from "./util/tasks";
import {
  createIntervalArray,
  getTotalActiveTime,
  formatTotalTime,
} from "./util/stats";
import "./TotalActiveTimes.css";

const TotalActiveTimes = ({ tasks, timestamps, tags }) => {
  const [startTime, setStartTime] = useState(dayjs().startOf("day"));
  const [endTime, setEndTime] = useState(dayjs());

  const totalTimes = () => {
    const timeStampsArray = tasks.map((task) =>
      getTimestamps(task, timestamps)
    );
    const intervalArrays = timeStampsArray.map((timeStamps) =>
      createIntervalArray(timeStamps)
    );
    const taskTotalTimes = intervalArrays.map((intervalArray) =>
      getTotalActiveTime(intervalArray, startTime, endTime)
    );
    return taskTotalTimes;
  };

  /**
   * Creates a list of tasks and tags with their total active times
   * If the total time is 0, the task or tag is not shown
   * @returns {JSX.Element}
   */
  const TotalTimesList = () => {
    const taskTotalTimes = totalTimes();

    const nameAndTimeList = tasks
      .map((task, i) => {
        return { task, time: taskTotalTimes[i] };
      })
      .filter((task) => task.time > 0)
      .sort((a, b) => b.time - a.time); // filter out tasks with 0 time and sort by time

    const tagTotalTimes = tags
      .map((tag) => {
        const tasksWithThisTag = nameAndTimeList.filter(({ task }) => {
          const tagIds = task.tags.split(",").map(Number);
          return tagIds.includes(tag.id); // check if the tag id is in the task's tags
        });
        const tagTotalTime = tasksWithThisTag.reduce(
          (acc, task) => acc + task.time,
          0
        ); // sum the times of tasks with this tag.
        return { tagName: tag.name, time: tagTotalTime }; // return an object with the tag name and total time
      })
      .filter((tag) => tag.time > 0)
      .sort((a, b) => b.time - a.time); // filter out tags with 0 time and sort by time
    
    if (tasks.length === 0) {
      return <p className="noTasksText">Ei tehtäviä</p>;
    }

    return (
      <ul style={{marginTop: "20px"}} className="totalTimesList">
        <li><strong>Tehtävien aktiiviset ajat:</strong></li>
        {nameAndTimeList.length === 0 ? (
          <li>Ei aktiivisuutta valitulla aikavälillä</li>
        ) : (
          nameAndTimeList.map((nameAndTimes, i) => (
            <li key={i}>
              {nameAndTimes.task.name}: {formatTotalTime(nameAndTimes.time)}
            </li>
          ))
        )}
        <li style={{marginTop: "20px"}}><strong>Tägien aktiiviset ajat:</strong></li>
        {tagTotalTimes.length === 0 ? (
          <li>Ei aktiivisuutta valitulla aikavälillä</li>
        ) : (
          tagTotalTimes.map((tagTime, i) => (
            <li key={i}>
              {tagTime.tagName}: {formatTotalTime(tagTime.time)}
            </li>
          ))
        )}
      </ul>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "16px",
      }}
    >
      <DateTimeRangePicker
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
      />
      <TotalTimesList />
    </div>
  );
};

export default TotalActiveTimes;
