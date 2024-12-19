/* eslint-disable react/prop-types */
import { Stack, Chip } from "@mui/material";

const TagStack = ({ tagNames }) => {
  if (tagNames[0] === null) return <div style={{ minHeight: "160px" }}></div>;
  
  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        margin: "16px",
        minHeight: "128px",
      }}
      direction="row"
      gap={2}
      flexWrap="wrap"
    >
      {tagNames.map((tag, index) => (
        <Chip color="primary" key={index} label={tag} />
      ))}
    </Stack>
  );
};

export default TagStack;
