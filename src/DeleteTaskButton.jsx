/* eslint-disable react/prop-types */
import { deleteTask } from "./util/tasks";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteTaskButton = ({ taskId, setTasks, timestamps, setTimestamps }) => {
  return (
    <Button
      variant="contained"
      sx={{ marginBottom: "10px" }}
      startIcon={<DeleteIcon />}
      onClick={() => deleteTask(taskId, setTasks, timestamps, setTimestamps)}
    >
      Poista tehtävä
    </Button>
  );
};

export default DeleteTaskButton;
