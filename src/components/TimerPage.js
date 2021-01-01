import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Fade from "@material-ui/core/Fade";
import Zoom from "@material-ui/core/Zoom";
import LinearProgress from "@material-ui/core/LinearProgress";
import LapDisplay from "./LapDisplay";
import PlayArrowOutlinedIcon from "@material-ui/icons/PlayArrowOutlined";
import PauseOutlinedIcon from "@material-ui/icons/PauseOutlined";
import { makeStyles } from "@material-ui/core/styles";
import useLocalStorage from "../hooks/useLocalStorage";
import DeleteOutlineOutlined from "@material-ui/icons/DeleteOutlineOutlined";
import IconButton from "@material-ui/core/IconButton";
import { generateTextTime, calculateDisplayTime } from "./StopwatchPage";
import * as Tone from "tone";

const synth = new Tone.Synth().toDestination();

const calculateDisplayTimeWrapper = (state) => {
    var timed = 0;
    if (!state.paused) {
        timed = state.target - Date.now();
    } else {
        timed = state.remaining || 0;
    }
    if (timed < 0) timed = 0;
    const _state = {
        paused: true,
        timed: timed,
    };
    return calculateDisplayTime(_state);
};

const useStyles = makeStyles((theme) => ({
    controls: {
        position: "fixed",
        transform: "TranslateX(-50%)",
        bottom: "56px",
        left: "50%",
        zIndex: "50",
        paddingTop: "64px",
        paddingBottom: "16px",
        // background:
        //     "linear-gradient(0deg, rgba(17,17,17,1) 60%, rgba(17,17,17,0) 100%)",
    },
    flex: {
        display: "flex",
    },
    digitParent: {
        textAlign: "center",
        marginTop: "12px",
        padding: "8px",
    },
    digit: {
        fontSize: "2rem",
        width: "100%",
        borderRadius: "16px",
    },
    time: {
        letterSpacing: "5px",
        textAlign: "center",
        fontSize: "3.5rem",
    },
    spacer: {
        minHeight: "180px",
    },
    fab: {
        marginLeft: "16px",
        marginRight: "16px",
    },
    spanner: {
        transition: "height 250ms ease-in-out",
    },
}));

const defaultTimerState = {
    paused: true,
};

const array6Zeros = [0, 0, 0, 0, 0, 0];

function calculateTotalTimeFromSixInMilliseconds([ht, ho, mt, mo, st, so]) {
    return (
        (so + st * 10) * 1000 +
        (mo + mt * 10) * 60000 +
        (ho + ht * 10) * 3600000
    );
}

const TimerPage = () => {
    const classes = useStyles();

    const [state, setState] = useLocalStorage(
        "timer-state",
        () => defaultTimerState
    );

    const hasTimer = state.target && state.target !== null;
    const { paused } = state;
    const [canStart, setCanStart] = useState(() => true);
    const [selectedDigits, setSelectedDigits] = useState(() => array6Zeros);
    const [progress, setProgress] = useState(0);
    const [timesUp, setTimesUp] = useState(false);

    const [displayTime, setDisplayTime] = useState(() => {
        return calculateDisplayTimeWrapper(state);
    });

    const [digitsInMs, setDigitsInMs] = useState(() =>
        calculateTotalTimeFromSixInMilliseconds(selectedDigits)
    );

    const textTime = renderTextTime();

    function renderTextTime() {
        if (!hasTimer) {
            // const timed = calculateTotalTimeFromSixInMilliseconds(
            //     selectedDigits
            // );
            // const displayTime = calculateDisplayTimeWrapper(timed);
            // console.log(displayTime);
            // const textTime = generateTextTime(displayTime, true);
            // return textTime;
            const [ht, ho, mt, mo, st, so] = selectedDigits;
            return `${ht}${ho}:${mt}${mo}:${st}${so}`;
        }

        return generateTextTime(displayTime);
    }

    function handleTerminate() {
        setState(defaultTimerState);
    }

    function handleStart() {
        const now = Date.now();
        const targetTime = now + digitsInMs;
        const newState = {
            start: now,
            paused: false,
            lastStart: now,
            target: targetTime,
            total: digitsInMs,
        };
        setSelectedDigits(array6Zeros);
        setDigitsInMs(0);
        setState(newState);
    }

    function handlePlayPause() {
        setState((state) => {
            const now = Date.now();
            const paused = !state.paused;
            const { lastStart, target, total, start } = state;
            const newState = {
                paused,
                total,
                start,
                target,
            };
            if (paused) {
                newState.lastPaused = now;
                newState.remaining = target - Date.now();
            } else {
                newState.lastStart = now;
                newState.target = Date.now() + state.remaining;
            }
            return newState;
        });
    }

    function handleDigitPressed(num) {
        setSelectedDigits((selectedDigits) => {
            const newDigits = [...array6Zeros, ...selectedDigits, num];
            const filtered = newDigits.slice(Math.max(newDigits.length - 6, 1));
            setDigitsInMs(calculateTotalTimeFromSixInMilliseconds(filtered));
            return filtered;
        });
    }

    function timesUpRing() {
        console.log("ring");
        const now = Tone.now();
        synth.triggerAttack("C4", now);
        synth.triggerRelease(now + 1);
    }

    function stopRing() {
        setTimesUp(false);
        handleTerminate();
    }

    useEffect(() => {
        var interval;
        console.log({ timesUp });
        if (timesUp) {
            timesUpRing();
            interval = setInterval(() => {
                timesUpRing();
            }, 1000);
        }
        return () => {
            interval && clearInterval(interval);
        };
    }, [timesUp]);

    useEffect(() => {
        var interval;
        if (!paused) {
            setDisplayTime(calculateDisplayTimeWrapper(state));
            interval = setInterval(() => {
                const [
                    hours,
                    minutes,
                    seconds,
                    milliseconds,
                    timed,
                ] = calculateDisplayTimeWrapper(state);
                if (timed === 0 && !timesUp) {
                    setTimesUp(true);
                }
                setDisplayTime([hours, minutes, seconds, milliseconds, timed]);
            }, 10);
        } else {
            setDisplayTime(calculateDisplayTimeWrapper(state));
        }
        return () => {
            interval && clearInterval(interval);
        };
    }, [paused]);

    return (
        <Container
            style={{
                marginTop: "16px",
            }}
        >
            <Container style={{ textAlign: "center" }}>
                <div
                    style={{
                        height: hasTimer ? "calc(25vh - 64px)" : "0",
                    }}
                    className={classes.spanner}
                ></div>
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
            <Container
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "16px",
                }}
            >
                <Fade in={timesUp}>
                    <Button onClick={stopRing} size="large">
                        Stop
                    </Button>
                </Fade>
            </Container>
            <Fade in={!hasTimer}>
                <Container>
                    <Grid container>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, null].map(
                            (num) => (
                                <Grid
                                    item
                                    xs={4}
                                    className={classes.digitParent}
                                >
                                    {num !== null && (
                                        <Button
                                            size="large"
                                            className={classes.digit}
                                            onClick={() =>
                                                handleDigitPressed(num)
                                            }
                                        >
                                            {num}
                                        </Button>
                                    )}
                                </Grid>
                            )
                        )}
                    </Grid>
                </Container>
            </Fade>

            <Container className={classes.spacer}></Container>
            <Fade
                in={hasTimer && !timesUp}
                style={{
                    zIndex: hasTimer ? 500 : 250,
                }}
            >
                <Container className={classes.controls}>
                    <Grid container align="center" justify="center">
                        <Grid item xs={12}>
                            <Fab
                                color="primary"
                                aria-label="delete"
                                onClick={handleTerminate}
                                className={classes.fab}
                            >
                                <DeleteOutlineOutlined />
                            </Fab>
                            <Fab
                                color="primary"
                                aria-label="add"
                                onClick={handlePlayPause}
                                className={classes.fab}
                            >
                                {paused ? (
                                    <PlayArrowOutlinedIcon />
                                ) : (
                                    <PauseOutlinedIcon />
                                )}
                            </Fab>
                        </Grid>
                    </Grid>
                </Container>
            </Fade>
            <Fade in={!hasTimer && digitsInMs !== 0}>
                <Container className={classes.controls}>
                    <Grid container align="center" justify="center">
                        <Grid item xs={12}>
                            <Fab
                                color="primary"
                                aria-label="start"
                                onClick={handleStart}
                                className={classes.fab}
                            >
                                <PlayArrowOutlinedIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                </Container>
            </Fade>
        </Container>
    );
};

export default TimerPage;
