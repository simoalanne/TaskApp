/* eslint react/prop-types: */
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Chip,
  Box,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune"; // best icon that represents filtering

// this changes the state of the parent component to update the filtering
const TaskFilterDialog = ({ tags, setFiltering }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the selected tags and updates both the local state of this component
   * aswell as the parent component's state to reflect the change in the actual filtering.
   *
   * @param {string} tag The tag that should be toggled.
   * @returns {void}
   */
  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      const newSelectedTags = selectedTags.filter(
        (selectedTag) => selectedTag !== tag
      );
      setSelectedTags(newSelectedTags);
      setFiltering(newSelectedTags);
    } else {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      setFiltering(newSelectedTags);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ backgroundColor: "orange", borderRadius: 0, width: "200px", color: "black" }}
        disabled={tags?.length === 0}
        onClick={() => setIsOpen(true)}
        startIcon={<TuneIcon />}
      >
        Filteröi tehtäviä
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Valitse tägit joiden perusteella filteröidään</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleToggleTag(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                clickable
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={selectedTags.length === 0}
            onClick={() => {
              setFiltering([]);
              setSelectedTags([]);
            }}
          >
            Poista kaikki filterit
          </Button>
          <Button onClick={() => setIsOpen(false)} color="secondary">
            Tallenna ja sulje
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskFilterDialog;
