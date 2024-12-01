/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { format } from "date-fns"; // Import format from date-fns
import { Switch } from "@mui/material";

const ToggleTaskActivityButton = ({ taskId, onChange, checked = false }) => {
  console.log(`For task id ${taskId} the switch should be set to ${checked}`);

  // Initialize state with the checked prop
  const [isActive, setIsActive] = useState(checked);

  useEffect(() => {
    // Update the state if the checked prop changes
    setIsActive(checked);
  }, [checked]);

  const handleChange = () => {
    setIsActive((prev) => {
      const newState = !prev;
      const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
      // Pass the updated state to onChange
      onChange(timestamp, taskId, newState);
      return newState;
    });
  };

  return (
    <div className="toggleTaskButton">
      <p>{isActive ? "Tehtävä Aktiivinen" : "Tehtävä Inaktiivinen"}</p>
      <Switch checked={isActive} onChange={handleChange} />
    </div>
  );
};

export default ToggleTaskActivityButton;
