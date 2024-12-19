/* eslint react/prop-types: */
import { Drawer, Box } from "@mui/material";
import ChangeTheme from "./ChangeTheme";
import ToggleAlternativeMode from "./ToggleAlternativeMode";

const Settings = ({ theme, setTheme, open, setOpen, alternative, setAlternative }) => {
  console.log("open in settings:", open);
  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 250, padding: 2 }}>
        <h1>Asetukset</h1>
        <ChangeTheme theme={theme} setTheme={setTheme} />
        <ToggleAlternativeMode alternative={alternative} setAlternative={setAlternative} />
      </Box>
    </Drawer>
  );
};

export default Settings;
