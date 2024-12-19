/* eslint react/prop-types: */
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import { Tooltip } from "@mui/material";

const ToggleAlternativeMode = ({ alternative, setAlternative }) => {
  return (
    <div style={{ marginTop: "16px" }}>
      <Tooltip
        title={
          <p style={{ fontSize: "16px" }}>
            Vaihtoehtoisessa tilassa vain yksi tehtävä voi olla kerrallaan
            aktiivisena.
          </p>
        }
      >
        <FormGroup>
          <FormLabel id="theme-label">Vaihda tilaa</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={alternative === 1}
                onChange={() => setAlternative(alternative === 0 ? 1 : 0)}
                name="alternativeMode"
                color="primary"
              />
            }
            label="Vaihtoehtoinen tila"
          />
        </FormGroup>
      </Tooltip>
    </div>
  );
};

export default ToggleAlternativeMode;
