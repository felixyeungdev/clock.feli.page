import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import LanguageIcon from "@material-ui/icons/Language";

import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import TimezoneDisplay from "./TimezoneDisplay";
import TimezoneSelect from "./TimezoneSelect";
import useLocalStorage from "../hooks/useLocalStorage";
import { Container as DraggableContainer, Draggable } from "react-smooth-dnd";
import arrayMove from "array-move";

const useStyles = makeStyles((theme) => ({
    time: {
        letterSpacing: "5px",
        textAlign: "center",
    },
    fab: {
        position: "fixed",
        transform: "TranslateX(-50%)",
        bottom: "72px",
        left: "50%",
        zIndex: "50",
    },
    centerText: {
        textAlign: "center",
    },
}));

function getSimpleTime() {
    return moment().format("HH:mm:ss");
}
function getSimpleDate() {
    return moment().format("ddd, DD MMM");
}

function ClockPage() {
    const classes = useStyles();
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [showTimezoneSelect, setShowTimezoneSelect] = useState(false);
    const [userTimezones, setUserTimezones] = useLocalStorage("timezones", []);
    function updateClock() {
        setTime(getSimpleTime());
        setDate(getSimpleDate());
    }

    function handleAddTimezoneIntent() {
        setShowTimezoneSelect(true);
    }
    function handleAddTimezone(timezone) {
        setShowTimezoneSelect(false);
        timezone &&
            setUserTimezones((old) => {
                if (!old.includes(timezone)) {
                    return [...old, timezone];
                }
                return old;
            });
    }

    function onDrop({ removedIndex, addedIndex }) {
        setUserTimezones((items) => arrayMove(items, removedIndex, addedIndex));
    }

    useEffect(() => {
        var interval = setInterval(updateClock, 10);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container
            style={{
                marginTop: "16px",
            }}
        >
            <Container>
                <Typography
                    variant="h3"
                    color="primary"
                    className={classes.time}
                >
                    {time}
                </Typography>
                <Typography variant="h5" className={classes.centerText}>
                    {date}
                </Typography>
                <Divider style={{ marginTop: "16px" }} />
            </Container>
            <Container>
                <DraggableContainer onDrop={onDrop} dragBeginDelay={200}>
                    {userTimezones.map((timezone) => {
                        return (
                            <Draggable key={timezone}>
                                <TimezoneDisplay timezone={timezone} />
                            </Draggable>
                        );
                    })}

                    {/* <TimezoneDisplay timezone="Asia/Hong_Kong" />
                <TimezoneDisplay timezone="Europe/London" />
                <TimezoneDisplay timezone="Asia/Tokyo" />
                <TimezoneDisplay timezone="Asia/Yangon" /> */}
                </DraggableContainer>
            </Container>
            <Fab
                color="primary"
                aria-label="add"
                className={classes.fab}
                onClick={handleAddTimezoneIntent}
            >
                <LanguageIcon />
            </Fab>
            <TimezoneSelect
                open={showTimezoneSelect}
                onClose={handleAddTimezone}
            />
        </Container>
    );
}

export default ClockPage;
