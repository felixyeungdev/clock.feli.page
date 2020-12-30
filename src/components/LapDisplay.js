import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import LinearProgress from "@material-ui/core/LinearProgress";
import PlayArrowOutlinedIcon from "@material-ui/icons/PlayArrowOutlined";
import PauseOutlinedIcon from "@material-ui/icons/PauseOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { generateTextTime, calculateDisplayTime } from "./StopwatchPage";

const useStyles = makeStyles((theme) => ({
    centerDelta: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    centerIndex: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    centerLap: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    margin: {
        marginTop: "8px",
        marginBottom: "8px",
    },
}));

function LapDisplay({ index, lap }) {
    const classes = useStyles();

    const deltaTime = calculateDisplayTime({ paused: true, timed: lap.delta });
    const lapTime = calculateDisplayTime({ paused: true, timed: lap.lap });
    const deltaTextTime = generateTextTime(deltaTime);
    const lapTextTime = generateTextTime(lapTime);

    return (
        <Container
            className={classes.margin}
            style={{ textAlign: "center", maxWidth: "450px" }}
        >
            <Grid container style={{ textAlign: "center" }}>
                <Grid item xs={4} className={classes.centerIndex}>
                    <Typography variant="subtitle">#{index}</Typography>
                </Grid>
                <Grid item xs={4} className={classes.centerDelta}>
                    <Typography variant="body1">{deltaTextTime}</Typography>
                </Grid>
                <Grid
                    item
                    xs={4}
                    className={classes.centerLap}
                    style={{ textAlign: "start" }}
                >
                    <Typography variant="body1">{lapTextTime}</Typography>
                </Grid>
            </Grid>
        </Container>
    );
}

export default LapDisplay;
