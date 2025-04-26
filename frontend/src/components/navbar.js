import { AppBar, Toolbar, Typography } from "@mui/material";

export const Navbar = () => {
  return (
    <AppBar component="nav" position="sticky">
      <Toolbar>
        <Typography variant="h5">Sentiment Analyzer</Typography>
      </Toolbar>
    </AppBar>
  );
};
