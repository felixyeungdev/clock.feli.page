import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import PlayArrowOutlinedIcon from "@material-ui/icons/PlayArrowOutlined";
import PauseOutlinedIcon from "@material-ui/icons/PauseOutlined";
import { makeStyles } from "@material-ui/core/styles";
import useLocalStorage from "../hooks/useLocalStorage";

const useStyles = makeStyles((theme) => ({
    controls: {
        position: "fixed",
        transform: "TranslateX(-50%)",
        bottom: "72px",
        left: "50%",
        zIndex: "50",
    },
    flex: {
        display: "flex",
    },
}));

const defaultStopwatchState = {
    timed: 0,
    paused: true,
};

const calculateDisplayTime = (state) => {
    const timed =
        state.paused || !state.lastStarted
            ? state.timed
            : Date.now() - state.lastStarted + state.timed;
    var milliseconds = parseInt((timed % 1000) / 10),
        seconds = Math.floor((timed / 1000) % 60),
        minutes = Math.floor((timed / (1000 * 60)) % 60),
        hours = Math.floor((timed / (1000 * 60 * 60)) % 24);

    return [hours, minutes, seconds, milliseconds, timed];
};

const StopwatchPage = () => {
    const classes = useStyles();

    const [state, setState] = useLocalStorage(
        "stopwatch-state",
        () => defaultStopwatchState
    );
    const { paused } = state;
    const [displayTime, setDisplayTime] = useState(() => {
        return calculateDisplayTime(state);
    });
    const [hours, minutes, seconds, milliseconds, total] = displayTime;
    var [isZero, setIsZero] = useState(() => total === 0);

    useEffect(() => {
        var interval;
        if (!paused) {
            interval = setInterval(() => {
                setDisplayTime(calculateDisplayTime(state));
            });
        }
        return () => {
            interval && clearInterval(interval);
        };
    }, [paused]);

    function toggleStopwatch() {
        setState((state) => {
            const paused = !state.paused;
            const newState = {
                paused,
            };
            const now = Date.now();
            if (paused) {
                if (state.lastStarted != null)
                    newState.timed = now - state.lastStarted + state.timed;
                newState.lastStarted = null;
            } else {
                setIsZero(false);
                newState.lastStarted = now;
                if (state.timed === 0) {
                }
            }
            return { ...state, ...newState };
        });
    }

    function resetStopwatch() {
        setState(defaultStopwatchState);
        setIsZero(true);
        setDisplayTime(calculateDisplayTime(defaultStopwatchState));
    }

    return (
        <Container
            style={{
                margin: "16px",
            }}
        >
            <Typography variant="h3">{`${hours}:${minutes}:${seconds}.${milliseconds}`}</Typography>
            <Container className={classes.controls}>
                <Grid container align="center" justify="center">
                    <Grid
                        item
                        xs={4}
                        className={classes.flex}
                        style={{
                            justifyContent: "flex-end",
                        }}
                    >
                        {!isZero && (
                            <Button onClick={resetStopwatch}>Reset</Button>
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        <Fab
                            color="primary"
                            aria-label="add"
                            onClick={toggleStopwatch}
                        >
                            {paused ? (
                                <PlayArrowOutlinedIcon />
                            ) : (
                                <PauseOutlinedIcon />
                            )}
                        </Fab>
                    </Grid>
                    <Grid item xs={4} className={classes.flex}>
                        {!isZero && <Button>{paused ? "Share" : "Lap"}</Button>}
                    </Grid>
                </Grid>
            </Container>
        </Container>
    );
};

export default StopwatchPage;
