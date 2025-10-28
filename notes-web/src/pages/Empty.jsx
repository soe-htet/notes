import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Empty({ text = "No items." }) {
  return (
    <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
      <Typography>{text}</Typography>
    </Box>
  );
}
