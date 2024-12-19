/* eslint-disable react/prop-types */
import { useState } from "react";
import ToggleTaskActivityButton from "./ToggleTaskActivivityButton";
import "./Tasks.css";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
// util modules for modifying data
import { addData, fetchData, deleteData, editData } from "./util/api";
import TaskDialog from "./TaskDialog";
import TagDialog from "./TagDialog";
import TaskFilterDialog from "./TaskFilterDialog";
import DeleteTaskButton from "./DeleteTaskButton";
import { addTask, getTagNames, getTimestamps } from "./util/tasks";
import TagStack from "./TagStack";
import MoveTaskButtons from "./MoveTaskButtons";
import { motion } from "framer-motion"; // for animating layout changes in the list when tasks are moved, deleted or added
import { useTheme } from "@emotion/react";
const Tasks = ({
  tasks,
  tags,
  stamps,
  setTasks,
  setTags,
  setStamps,
  alternativeModeActive,
}) => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const theme = useTheme();
  const addNewTags = async (tagNames) => {
    if (tagNames.some((tagName) => !tagName)) {
      console.error(
        "should not be possible to add empty / undefined / null tags"
      );
      tagNames = tagNames.map((tagName) => tagName ?? ""); // set all undefined to empty string which is not be valid tag either but it will not crash the app
    }
    const newTags = tagNames.filter(
      (tagName) => !tags.some((tag) => tag.name === tagName)
    );
    
    const res = await Promise.all(
      newTags.map((tagName) => addData("/tags", { name: tagName }))
    );

    const newTagsIds = res.map((tag) => tag.id);

    const newTagObjects = newTagsIds.map((tagId, index) => ({
      id: tagId,
      name: newTags[index],
    }));
    const updatedTags = [...tags, ...newTagObjects];
    setTags(updatedTags);
    return updatedTags;
  };

  const deleteTag = async (tagName) => {
    try {
      const tagId = tags.find((tag) => tag.name === tagName)?.id;
      await deleteData(`/tags/${tagId}`);
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
      const updatedTagsString = tasks.map((task) =>
        task.tags
          .split(",")
          .map(Number)
          .filter((taskTagId) => taskTagId !== tagId)
          .join(",")
      );
      // Update the tags strings in the tasks where it has changed
      await Promise.all(
        tasks.map(
          (task, i) =>
            task.tags !== updatedTagsString[i] &&
            editData(`/tasks/${task.id}`, {
              name: task.name,
              tags: updatedTagsString[i],
              additional_data: task.additional_data,
            })
        )
      );

      setTasks(await fetchData("/tasks")); // Not optimized, but it was too hard to get this done locally and this guarentees no errors
    } catch (err) {
      console.error("Error deleting tag:", err);
    }
  };

  const deleteAllTags = async () => {
    try {
      await Promise.all(tags.map((tag) => deleteData(`/tags/${tag.id}`)));
      await Promise.all(
        tasks.map((task) =>
          editData(`/tasks/${task.id}`, {
            name: task.name,
            tags: "",
            additional_data: task.additional_data,
          })
        )
      );
      setTags([]);
      setTasks(await fetchData("/tasks"));
    } catch (err) {
      console.error("Error deleting all tags:", err);
    }
  };

  const openEditTask = (taskId) => {
    setEditedTask(tasks.find((task) => task.id === taskId));
    setTaskDialogOpen(true);
  };

  const editTask = async (task) => {
    try {
      await editData(`/tasks/${editedTask.id}`, task);
      const tasksCopy = [...tasks];
      const taskIndex = tasksCopy.findIndex((t) => t.id === editedTask.id);
      tasksCopy[taskIndex] = { ...tasksCopy[taskIndex], ...task };
      setTasks(tasksCopy);
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  /**
   * Adds or edits a task based on the state of the editedTask.
   *
   * @param {Object} task - The task object to add or edit. should contain a name and tagNames property.
   * @returns {void}
   *
   */
  const addOrEditTask = async (task) => {
    const updatedTags = await addNewTags(task.tagNames);

    const tagIds = task.tagNames.map((tagName) =>
      updatedTags.find((tag) => tag.name === tagName)
    );
    const tagIdsString = tagIds
      .map((tag) => tag.id)
      .sort((a, b) => a - b)
      .join(",");
    if (editedTask) {
      await editTask({
        name: task.name,
        tags: tagIdsString,
        id: editedTask.id,
        additional_data: editedTask.additional_data,
      });
      closeDialog();
      return;
    }
    await addTask(
      { name: task.name, tags: tagIdsString, additional_data: tasks.length },
      setTasks
    );
    closeDialog();
  };

  const closeDialog = () => {
    setTaskDialogOpen(false);
    setEditedTask(null);
  };

  // should be in seperate file maybe but it uses so many variables from this file that its worse to pass them as props
  const NoTasks = () => {
    if (filtered.length !== 0 && tasks.length !== 0) {
      if (
        tasks.filter((task) =>
          filtered.every((tag) => getTagNames(task, tags).includes(tag))
        ).length === 0
      ) {
        return (
          <div className="noTasks">
            <h3>Ei tehtäviä, jotka sisältävät kaikki valitut tägit</h3>
          </div>
        );
      }
    }
    if (tasks.length === 0) {
      return (
        <div className="noTasks">
          <h3>Ei tehtäviä </h3>
          <Button
            variant="contained"
            sx={{ backgroundColor: "lime", width: "200px", color: "black" }}
            onClick={() => setTaskDialogOpen(true)}
          >
            Uusi tehtävä
          </Button>
        </div>
      );
    }
  };

  const usedTags = [
    ...new Set(tasks.flatMap((task) => getTagNames(task, tags))),
  ].filter(Boolean);

  const filteredTasks = tasks.filter((task) =>
    filtered.every((tag) => getTagNames(task, tags).includes(tag))
  );

  const positionAddedTasks = filteredTasks.map((task, index) => {
    const position = task.additional_data;
    if (task.additional_data === "") {
      editData(`/tasks/${task.id}`, { ...task, additional_data: index });
    }
    return { ...task, additional_data: position === "" ? index : position };
  });

  const sortedTasks = positionAddedTasks.sort(
    (a, b) => Number(a.additional_data) - Number(b.additional_data)
  );

  return (
    <>
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          sx={{
            borderRadius: "0px",
            backgroundColor: "lime",
            color: "black",
            width: "200px",
            marginLeft: "16px",
          }}
          onClick={() => {
            setEditedTask(null);
            setTaskDialogOpen(true);
          }}
          startIcon={<AddIcon />}
        >
          Uusi tehtävä
        </Button>
        <TagDialog
          tags={tags.map((tag) => tag.name)}
          onAddTag={addNewTags}
          onDeleteTag={deleteTag}
          onDeleteAllTags={deleteAllTags}
        />
        <TaskDialog
          open={taskDialogOpen}
          onClose={closeDialog}
          onSubmit={addOrEditTask}
          task={editedTask}
          taskNames={tasks.map((task) => task.name)}
          tags={tags}
        />
        <TaskFilterDialog
          tags={usedTags}
          filtered={filtered}
          setFiltering={setFiltered}
          tasks={tasks}
        />
      </div>
      <ul
        className={
          theme.palette.mode === "light" ? "lightContainer" : "darkContainer"
        }
      >
        <NoTasks />
        {sortedTasks.length > 0 &&
          sortedTasks.map((task) => (
            <motion.li
              key={task.id}
              className={
                theme.palette.mode === "light" ? "lightTasks" : "darkTasks"
              }
              layout
            >
              <div className="taskContent">
                <strong><p className={theme.palette.mode === "light" ? "taskNameLight" : "taskNameDark"}>{task.name}</p></strong>
                <ToggleTaskActivityButton
                  taskId={task.id}
                  checked={getTimestamps(task, stamps)?.lastType} // lastType returns the last value of the timestamps array.
                  setTimestamps={setStamps}
                  timestamps={stamps}
                  alternativeModeActive={alternativeModeActive}
                  tasks={tasks}
                />
                <TagStack tagNames={getTagNames(task, tags)} />
                <div className="taskButtons">
                  <DeleteTaskButton
                    taskId={task.id}
                    setTasks={setTasks}
                    setTimestamps={setStamps}
                    timestamps={stamps}
                  />
                  <Button
                    onClick={() => openEditTask(task.id)}
                    variant="contained"
                    startIcon={<EditIcon />}
                  >
                    Muokkaa
                  </Button>
                  <MoveTaskButtons
                    task={task}
                    tasks={sortedTasks}
                    areTasksFiltered={filtered}
                    setTasks={setTasks}
                  />
                </div>
              </div>
            </motion.li>
          ))}
      </ul>
    </>
  );
};

export default Tasks;
