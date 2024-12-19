/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Switch } from "@mui/material";
import { updateTimeStamps } from "./util/tasks";
import { getTimestamps } from "./util/tasks";

const ToggleTaskActivityButton = ({
  taskId,
  tasks,
  setTimestamps,
  timestamps,
  checked = false,
  alternativeModeActive,
}) => {
  // Initialize state with the checked prop
  const [isActive, setIsActive] = useState(checked);

  useEffect(() => {
    // Update the state if the checked prop changes
    setIsActive(checked);
  }, [checked]);

  const handleChange = async () => {
    if (alternativeModeActive) {
      if (!isActive) {
        // if the task is not active, then deactivate all other active tasks before activating the current task
        // returns the tasks array with the current task removed and isActive field added that is true if the task is active
        const otherActiveTasks = tasks
          .filter((task) => task.id !== taskId)
          .map((task) => ({
            ...task,
            isActive: getTimestamps(task, timestamps).lastType,
          }))
          .filter((task) => task.isActive);

        // deactivate all tasks from the array that are active
        await Promise.all(
          otherActiveTasks.map((task) => {
            const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
            return updateTimeStamps(timestamp, task.id, false, setTimestamps);
          })
        );
      }
    }

    setIsActive((prev) => {
      const newState = !prev;
      const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
      updateTimeStamps(timestamp, taskId, newState, setTimestamps);
      return newState;
    });
  };

  return (
    <div className="toggleTaskButton">
      <p style={{fontSize: "1.25rem"}}>
        <strong>{isActive ? "Tehtävä aktiivinen ⏱️" : "Tehtävä ei aktiivinen ❌"}</strong>
      </p>
      <Switch checked={isActive} onChange={handleChange} name="toggle-task-activity" inputProps = {{ "aria-label": "aktivoi tehtävä" }} />	
    </div>
  );
};

export default ToggleTaskActivityButton;
