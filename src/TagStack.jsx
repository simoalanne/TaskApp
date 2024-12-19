/* eslint-disable react/prop-types */
import { Stack, Chip } from "@mui/material";

const gradients = [
  "linear-gradient(to right, #8e2de2, #4a00e0)",
  "linear-gradient(to right, #ff8008, #ffc837)",
  "linear-gradient(to right, #56ab2f, #a8e063)"
];

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
      {tagNames.slice(0, 3).map((tag, index) => (
        <Chip
          key={index}
          style={{
            background: gradients[index],
            color: "white",
            fontWeight: "bold",
          }}
          label={tag}
        />
      ))}
    </Stack>
  );
};

export default TagStack;
