import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
                * {
                    margin: 0;
                    box-sizing: border-box;
                }
                #root {
                  height: 100vh;
                  display: flex;
                  flex-direction: column;
                }
            `,
    },
  },
});

console.log({ theme });

export default theme;
