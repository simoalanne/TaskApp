/* eslint react/prop-types: 0 */
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import { getTagNames } from "./util/tasks";

const TaskDialog = ({ open, onClose, onSubmit, task, taskNames, tags }) => {
  const [taskName, setTaskName] = useState("");
  const [tagNames, setTagNames] = useState([]);
  const [errorReason, setErrorReason] = useState(""); // Holds the specific error message

  useEffect(() => {
    if (task) {
      const tagNames = getTagNames(task, tags);
      setTaskName(task.name || "");
      const updatedTagNames = [
        ...tagNames,
        ...Array(3 - tagNames.length).fill(""),
      ];
      setTagNames(updatedTagNames);
    }
  }, [task, tags]);

  const handleTagChange = (index, newValue) => {
    const updatedTags = [...tagNames];
    updatedTags[index] = newValue ?? "";
    setTagNames(updatedTags);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nonEmptyTags = tagNames.filter(Boolean).filter((tag) => tag.trim() !== "");
    onSubmit({ name: taskName, tagNames: nonEmptyTags });
    setTaskName("");
    setTagNames(Array(3).fill(""));
  };

  const handleClose = () => {
    onClose();
    setTaskName("");
    setTagNames(Array(3).fill(""));
  };

  // Update error reason whenever relevant state changes
  useEffect(() => {
    if (taskName.trim() === "") {
      setErrorReason("Tehtävän nimi ei voi olla tyhjä.");
      return;
    }

    if (task && taskNames.includes(taskName) && task.name !== taskName) {
      setErrorReason("Tehtävän nimi on jo käytössä.");
      return;
    }

    if (!task && taskNames.includes(taskName)) {
      setErrorReason("Tehtävän nimi on jo käytössä.");
      return;
    }

    if (
      task &&
      taskName === task.name &&
      tagNames.every(
        (tag, index) =>
          tag === getTagNames(task, tags)[index] ||
          (tag === "" && getTagNames(task, tags)[index] === undefined)
      )
    ) {
      setErrorReason(" ");
      return;
    }

    const nonEmptyTags = tagNames.filter(
      (tag) => tag !== null && tag.trim() !== ""
    );
    if (nonEmptyTags.length !== new Set(nonEmptyTags).size) {
      setErrorReason("Jokaisen tägin pitää olla uniikki.");
      return;
    }

    // If no errors, clear the error reason
    setErrorReason("");
  }, [taskName, task, taskNames, tagNames, tags]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ component: "form", onSubmit: handleSubmit }}
      fullWidth
    >
      <DialogTitle>{task ? "Muokkaa tehtävää" : "Uusi tehtävä"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="name"
          name="name"
          label="Tehtävän nimi"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          fullWidth
          required
          variant="standard"
          sx={{ marginBottom: "16px" }}
        />
        {Array.from({ length: 3 }).map((_, index) => (
          <Autocomplete
            key={index}
            freeSolo
            options={
              tags
                ?.map((tag) => tag.name)
                .filter((tagName) => !tagNames.includes(tagName)) ?? []
            }
            value={tagNames[index] || ""}
            onChange={(_, newValue) => handleTagChange(index, newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Lisää tai valitse tägi ${index + 1}`}
                variant="standard"
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
            )}
          />
        ))}
        <p
          style={{
            color: "red",
            paddingTop: "16px",
            fontSize: "1.25rem",
            minHeight: "24px",
          }}
        >
          {errorReason}
        </p>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose} sx={{ marginRight: "8px" }}>
          Peruuta
        </Button>
        <Button disabled={errorReason !== ""} color="success" type="submit">
          {task ? "Tallenna muutokset" : "Luo tehtävä"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
