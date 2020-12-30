import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import LinearProgress from "@material-ui/core/LinearProgress";
import LapDisplay from "./LapDisplay";
import PlayArrowOutlinedIcon from "@material-ui/icons/PlayArrowOutlined";
import PauseOutlinedIcon from "@material-ui/icons/PauseOutlined";
import { makeStyles } from "@material-ui/core/styles";
import useLocalStorage from "../hooks/useLocalStorage";

const useStyles = makeStyles((theme) => ({
    controls: {
        position: "fixed",
        transform: "TranslateX(-50%)",
        bottom: "56px",
        left: "50%",
        zIndex: "50",
        paddingTop: "64px",
        paddingBottom: "16px",
        background:
            "linear-gradient(0deg, rgba(17,17,17,1) 60%, rgba(17,17,17,0) 100%)",
    },
    flex: {
        display: "flex",
    },
    time: {
        letterSpacing: "5px",
        textAlign: "center",
        fontSize: "3.5rem",
    },
    spacer: {
        minHeight: "180px",
    },
}));

const defaultStopwatchState = {
    timed: 0,
    paused: true,
};

export function generateTextTime(
    [hours, minutes, seconds, milliseconds],
    bypass
) {
    const _hours = `${hours < 10 ? "0" : ""}${hours}`;
    const _minutes = `${minutes < 10 ? "0" : ""}${minutes}`;
    const _seconds = `${seconds < 10 ? "0" : ""}${seconds}`;
    const _milliseconds = `${milliseconds < 10 ? "0" : ""}${milliseconds}`;
    var result = `${_hours}:${_minutes}:${_seconds}.${_milliseconds}`;
    if (bypass) return result;
    if (hours + minutes === 0) {
        result = result.slice(6);
    } else if (hours === 0) {
        result = result.slice(3);
    } else if (hours > 1) {
        result = result.slice(0, 8);
    }
    return result;
}

export const calculateDisplayTime = (state) => {
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

function calculateLapData(laps = []) {
    return laps
        .map((lap, i, arr) => {
            return {
                lap: lap,
                delta: i - 1 >= 0 ? lap - arr[i - 1] : lap,
            };
        })
        .reverse();
}

function generateLapItems(lapData) {
    return lapData.map((lap, i, arr) => {
        return <LapDisplay index={arr.length - i} lap={lap} key={i} />;
    });
}

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

    const textTime = generateTextTime(displayTime);
    var [isZero, setIsZero] = useState(() => total === 0);
    const [progress, setProgress] = useState(() => {
        return Math.floor((seconds / 60) * 100);
    });
    const [lapData, setLapData] = useState(() => calculateLapData(state.laps));
    const [lapItems, setLapItems] = useState(() => generateLapItems(lapData));

    useEffect(() => {
        var interval;
        if (!paused) {
            interval = setInterval(() => {
                setDisplayTime(calculateDisplayTime(state));
            }, 10);
        } else {
            setDisplayTime(calculateDisplayTime(state));
        }
        return () => {
            interval && clearInterval(interval);
        };
    }, [paused]);

    useEffect(() => {
        const progress = Math.floor((seconds / 60) * 100);
        setProgress(progress);
    }, [seconds]);

    useEffect(() => {
        setLapItems(generateLapItems(lapData));
    }, [lapData]);

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
        setLapData([]);
    }

    function shareStopwatch() {
        const textTime = generateTextTime(displayTime, true);
        const _lapData = [...lapData].reverse();
        var lapMessage = "";
        if (_lapData.length > 0) {
            lapMessage = "\nLap time(s):";
            _lapData.forEach((lapItem, i) => {
                const deltaTime = calculateDisplayTime({
                    paused: true,
                    timed: lapItem.delta,
                });
                const deltaTextTime = generateTextTime(deltaTime);
                lapMessage += `\n${i + 1}. ${deltaTextTime}`;
            });
        }

        const message = `My time is ${textTime}${lapMessage}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        // window.open(url, "_blank");
        console.log(message);
    }

    function lapStopwatch() {
        setState((state) => {
            const newState = {};
            newState.laps = state.laps || [];
            newState.laps.push(total);
            setLapData(calculateLapData(newState.laps));
            return { ...state, ...newState };
        });
    }

    return (
        <Container
            style={{
                marginTop: "16px",
            }}
        >
            <Container style={{ textAlign: "center" }}>
                <Typography
                    variant="h3"
                    className={classes.time}
                    color="primary"
                >
                    {textTime}
                </Typography>
                <LinearProgress
                    value={progress}
                    variant="determinate"
                    style={{
                        margin: "auto",
                        maxWidth: "300px",
                    }}
                />

                <Divider style={{ marginTop: "16px" }} />
            </Container>
            <Container>{lapItems}</Container>
            <Container className={classes.spacer}></Container>
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
                        {!isZero &&
                            (paused ? (
                                <Button onClick={shareStopwatch}>Share</Button>
                            ) : (
                                <Button onClick={lapStopwatch}>Lap</Button>
                            ))}
                    </Grid>
                </Grid>
            </Container>
        </Container>
    );
};

export default StopwatchPage;
