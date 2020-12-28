import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import Paper from "@material-ui/core/Paper";
// import Grid from "@material-ui/core/Grid";
// import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
// import CardContent from "@material-ui/core/CardContent";
// import TextField from "@material-ui/core/TextField";
// import LinearProgress from "@material-ui/core/LinearProgress";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TimerOutlinedIcon from "@material-ui/icons/TimerOutlined";
import AvTimerOutlinedIcon from "@material-ui/icons/AvTimerOutlined";
import AccessTimeOutlinedIcon from "@material-ui/icons/AccessTimeOutlined";
import Container from "@material-ui/core/Container";
import ClockPage from "./ClockPage";
import TimerPage from "./TimerPage";
import StopwatchPage from "./StopwatchPage";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appbar: {
        // alignItems: "center",
    },
    stickToBottom: {
        width: "100%",
        position: "fixed",
        bottom: 0,
    },
}));

function App() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [bottomNavIndex, setBottomNavIndex] = React.useState(0);
    const pageNames = ["Clock", "Timer", "Stopwatch"];

    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar
                color="secondary"
                position="static"
                className={classes.appbar}
            >
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {pageNames[bottomNavIndex]}
                    </Typography>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <MoreVertIcon></MoreVertIcon>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                Screensaver
                            </MenuItem>
                            <MenuItem onClick={handleClose}>Settings</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Container>
                {
                    [<ClockPage />, <TimerPage />, <StopwatchPage />][
                        bottomNavIndex
                    ]
                }
            </Container>
            <BottomNavigation
                value={bottomNavIndex}
                onChange={(event, newValue) => setBottomNavIndex(newValue)}
                showLabels
                className={classes.stickToBottom}
            >
                <BottomNavigationAction
                    label={pageNames[0]}
                    icon={<AccessTimeOutlinedIcon />}
                />
                <BottomNavigationAction
                    label={pageNames[1]}
                    icon={<AvTimerOutlinedIcon />}
                />
                <BottomNavigationAction
                    label={pageNames[2]}
                    icon={<TimerOutlinedIcon />}
                />
            </BottomNavigation>
        </div>
    );
}

export default App;
