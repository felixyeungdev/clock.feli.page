import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
    createMuiTheme,
    // makeStyles,
    ThemeProvider,
} from "@material-ui/core/styles";

const feliOrange = "#f9a825";
const backgroundColor = "#111111";

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: { main: feliOrange },
        secondary: {
            main: backgroundColor,
        },
        background: {
            default: backgroundColor,
            paper: "#1e1e1e",
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
