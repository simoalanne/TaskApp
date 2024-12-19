/* eslint react/prop-types: */
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const TaskPicker = ({ selectedTask, setSelectedTask, tasks }) => {
  return (
    <FormControl sx={{ marginTop: "16px" }}>
      <InputLabel id="choose-task-label">
        {tasks.length === 0 ? "Ei tehtäviä" : "Valitse tarkasteltava tehtävä"}
      </InputLabel>
      <Select
        labelId="choose-task-label"
        id="choose-task"
        name="choose-task"
        label="Valitse tarkasteltava tehtävä"
        value={selectedTask || ""}
        onChange={(e) => setSelectedTask(e.target.value)}
        disabled={tasks.length === 0}
      >
        {tasks.map((task, i) => (
          <MenuItem key={i} value={task}>
            {task.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TaskPicker;
