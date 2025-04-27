import { AppBar, Button, Toolbar, Typography } from "@mui/material";

export const Navbar = ({ onReset }) => {
  return (
    <AppBar component="nav" position="sticky">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5">Sentiment Analyzer</Typography>
        <Button color="white" onClick={onReset}>
          Reset
        </Button>
      </Toolbar>
    </AppBar>
  );
};
