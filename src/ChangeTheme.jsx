/* eslint react/prop-types: */
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const ChangeTheme = ({ theme, setTheme }) => {
  return (
    <FormControl>
      <FormLabel id="theme-label">Valitse teema</FormLabel>
      <RadioGroup
      aria-labelledby="theme-label"
      value={theme}
      name="theme"
      onChange={(e) => setTheme(e.target.value)}
      >
        <FormControlLabel value="light" control={<Radio />} label="Vaalea" />
        <FormControlLabel value="dark" control={<Radio />} label="Tumma" />
      </RadioGroup>
    </FormControl>
  );
};

export default ChangeTheme;