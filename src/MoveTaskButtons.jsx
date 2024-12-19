/* eslint-disable react/prop-types */
import { arrayMoveImmutable } from "array-move";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCicleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { Button } from "@mui/material";
import { editTask } from "./util/tasks";
import { useState, useEffect } from "react";

const MoveTaskButtons = ({
  task,
  tasks,
  setTasks,
  areTasksFiltered = false,
}) => {
  const currentIndex = Number(task.additional_data);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const moveTask = (direction) => {
    let newIndex = currentIndex;

    if (direction === "left" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (direction === "right" && currentIndex < tasks.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      const newTasks = arrayMoveImmutable(tasks, currentIndex, newIndex).map((task, index) => ({
        ...task,
        additional_data: index,
      }));
      newTasks.map((task) => editTask(task));
      setTasks(newTasks);
    }
  };

  const getMoveTaskIcon = (direction) => {
    // less than 739px means only one task item fits per row
    const twoTasksPerRow = viewportWidth > 739;
    if (twoTasksPerRow) {
      if (direction === "left") {
        return <ArrowCircleLeftIcon style={{ fontSize: 40 }} />;
      }
      return <ArrowCircleRightIcon style={{ fontSize: 40 }} />;
    }
    if (direction === "left") {
      return <ArrowCicleUpIcon style={{ fontSize: 40 }} />;
    }
    return <ArrowCircleDownIcon style={{ fontSize: 40 }} />;
  };

  /* If tasks are filtered the move up and down buttons are disabled
  This is because the moving wont work as expected when tasks are filtered
  because filtering does not change the state of the tasks array. */
  if (areTasksFiltered.length > 0) {
    return <p> Filteröinti käytössä, joten tehtävää ei voi liikuttaa </p>;
  }

  return (
    <div
      style={{
        display: "flex",
        marginTop: "20px",
        justifyContent: "space-around",
      }}
    >
      <Button
        disabled={currentIndex === 0}
        onClick={() => moveTask("left")}
        startIcon={getMoveTaskIcon("left")}
      />
      <Button
        disabled={currentIndex === tasks.length - 1}
        onClick={() => moveTask("right")}
        startIcon={getMoveTaskIcon("right")}
      />
    </div>
  );
};

export default MoveTaskButtons;
