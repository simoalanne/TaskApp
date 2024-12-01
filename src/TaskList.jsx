import { useState, useEffect } from "react";
import ToggleTaskActivityButton from "./ToggleTaskActivivityButton";
import "./TaskList.css";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAndSet = async (url, setFunction) => {
    try {
      const res = await axios.get(url);
      setFunction(res.data);
    } catch (err) {
      console.error(`Failed to fetch from ${url}:`, err);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetchAndSet("http://localhost:3010/tasks", setTasks),
        fetchAndSet("http://localhost:3010/tags", setTags),
        fetchAndSet("http://localhost:3010/timestamps", setTimestamps),
      ]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Add new properties tagNames and timestamps to the object
  tasks.forEach((task) => {
    const tagIds = task.tags.split(",").map(Number);
    task.tagNames = tagIds.map(
      (tagId) => tags.find((tag) => tag.id === tagId)?.name
    );
    task.timestamps = timestamps
      .filter((stamp) => stamp.task === task.id)
      .map((stamp) => ({
        id: stamp.id,
        timestamp: stamp.timestamp,
        type: stamp.type,
      }));
    console.log(task);
  });

  const handleDoubleclick = (id) => {
    console.log("doubleclicked task with id", id);
  };

  const updateTimeStamps = async (timestamp, task, type) => {
    type = type === false ? 0 : 1;
    console.log("timestamp", timestamp);
    console.log("task", task);
    console.log("type", type);
    try {
      // Send POST request to add the new timestamp
      const response = await axios.post("http://localhost:3010/timestamps", {
        timestamp,
        task,
        type,
      });
      setTimestamps((prevTimestamps) => [...prevTimestamps, response.data]);
    } catch (err) {
      console.error("Error adding timestamp:", err);
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3010/tasks/${id}`);
    setTasks(() => tasks.filter(task => task.id !== id));
  };
    

  return (
    <>
      <ul className="container">
        {tasks.map((task) => (
          <li key={task.id} className="tasks">
            <button
              className="taskButton"
              onDoubleClick={() => handleDoubleclick(task.id)}
            >
              <div className="taskContent">
                <p className="taskName">{task.name}</p>
                <ToggleTaskActivityButton
                  taskId={task.id}
                  checked={
                    (task.timestamps[task.timestamps.length - 1]?.type ?? 0) ===
                    1
                  }
                  onChange={updateTimeStamps}
                />
                <p>tägit:</p>
                <ul className="taskTags">
                  {task.tagNames.map((tagName, index) => (
                    <li key={index} className="tagItem">
                      {tagName}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => deleteTask(task.id)} variant="outlined" startIcon={<DeleteIcon />}>
                  Poista
                </Button>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
