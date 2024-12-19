import { deleteData, addData, fetchData, editData } from "./api";

export const deleteTask = async (
  taskId,
  setTasks,
  timestamps,
  setTimestamps
) => {
  try {
    await deleteData(`/tasks/${taskId}`);
    setTasks((prevTasks) => {
      const taskPos = prevTasks.find(
        (task) => task.id === taskId
      ).additional_data;
      return prevTasks
        .filter((task) => task.id !== taskId)
        .map((task) => {
          if (task.additional_data > taskPos) {
            task.additional_data -= 1;
            editData(`/tasks/${task.id}`, task);
          }
          return task;
        });
    });
    const deletableTimestamps = timestamps.filter(
      (stamp) => stamp.task === taskId
    );
    await Promise.all(
      deletableTimestamps.map((stamp) => deleteData(`/timestamps/${stamp.id}`))
    );
    const newStamps = await fetchData("/timestamps");
    setTimestamps(newStamps);
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};

export const updateTimeStamps = async (
  timestamp,
  task,
  type,
  setTimestamps
) => {
  type = type === false ? 1 : 0;
  try {
    const id = await addData("/timestamps", {
      timestamp,
      task,
      type,
    });
    const newTimestamp = { id: id.id, timestamp, task, type };
    setTimestamps((prevTimestamps) => [...prevTimestamps, newTimestamp]);
  } catch (err) {
    console.error("Error adding timestamp:", err);
  }
};

export const editTask = async (task) => {
  try {
    await editData(`/tasks/${task.id}`, task);
  } catch (err) {
    console.error("Error editing task:", err);
  }
};

/**
 * Finds the tag names that correspond to the tag ids in the task
 *
 * @param {object} task - The task object that should contain a tags property with tag ids as a string
 * @param {Array<object>} tags - An array of tag objects. Should be fetched from the API on app start
 * @returns {Array<string>} - An array of tag names
 */
export const getTagNames = (task, tags) => {
  const tagIds = task.tags.split(",").map(Number);
  return tagIds.map((tagId) => {
    const tag = tags.find((tag) => tag.id === tagId);
    return tag ? tag.name : null;
  });
};

export const getTimestamps = (task, timestamps) => {
  const taskTimestamps = timestamps
    .filter((stamp) => stamp.task === task.id)
    .map((stamp) => ({
      id: stamp.id,
      timestamp: stamp.timestamp,
      type: stamp.type === 0 ? true : false,
    }));
  /* Add a lastType property to the last timestamp object. If task doesn't have any timestamps, 
  lastType is false signaling that the task is not currently active */
  taskTimestamps.lastType =
    taskTimestamps.length > 0
      ? taskTimestamps[taskTimestamps.length - 1].type
      : false;
  return taskTimestamps;
};

export const addTask = async (task, setTasks) => {
  try {
    const res = await addData("/tasks", task);
    const id = res.id;
    setTasks((prevTasks) => [...prevTasks, { id, ...task }]);
  } catch (err) {
    console.error("Error adding task:", err);
  }
};
