import React, { useState } from 'react';
import { MenuItem, Select, Checkbox, ListItemText } from '@mui/material';

const MultiSelect = ({ filterSelection, tags }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = tags.map(tag => tag.name);

  const handleChange = (event) => {
    const newSelectedOptions = event.target.value;
    setSelectedOptions(newSelectedOptions);
    filterSelection(newSelectedOptions);
  };


  return (
    <Select
      multiple
      value={selectedOptions}
      onChange={handleChange}
      renderValue={(selected) => `Filtering by tags: ${selected.join(', ')}`} // Show selected options as a comma-separated string
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          <Checkbox checked={selectedOptions.includes(option)} />
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiSelect;
