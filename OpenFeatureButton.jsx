/* eslint react/prop-types: */
import { Button } from "@mui/material";

  const OpenFeatureButton = ({ onClick, text }) => {
    return (
      <Button
        variant="contained"
        sx={{ borderRadius: 0, margin: "8px", width: "200px" }}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  };

  export default OpenFeatureButton;