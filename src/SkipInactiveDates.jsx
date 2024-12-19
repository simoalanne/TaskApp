/* eslint react/prop-types: */
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import { Tooltip } from "@mui/material";

const ToggleAlternativeMode = ({ skipInactiveDates, setSkipInactiveDates }) => {
  return (
    <div style={{ marginTop: "16px" }}>
      <Tooltip
        title={
          <p style={{ fontSize: "16px" }}>
            Näytetäänkö vain päivät jolloin tehtävällä on ollut aktiivisuutta?
          </p>
        }
        placement="bottom-start" // component is full width flex so this is right below the checkbox and label
      >
        <FormGroup>
          <FormLabel id="theme-label">Asetukset</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={skipInactiveDates}
                onChange={() => setSkipInactiveDates(!skipInactiveDates)}
                name="alternativeMode"
                color="primary"
              />
            }
            label="Skippaa inaktiiviset päivät"
          />
        </FormGroup>
      </Tooltip>
    </div>
  );
};

export default ToggleAlternativeMode;
