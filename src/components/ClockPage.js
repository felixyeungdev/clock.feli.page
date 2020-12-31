import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import LanguageIcon from "@material-ui/icons/Language";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import TimezoneDisplay from "./TimezoneDisplay";
import TimezoneSelect from "./TimezoneSelect";
import useLocalStorage from "../hooks/useLocalStorage";
import { Container as DraggableContainer, Draggable } from "react-smooth-dnd";
import arrayMove from "array-move";

const colors = {
    red: "#f44336",
    darkRed: "#ba000d",
};

const useStyles = makeStyles((theme) => ({
    time: {
        letterSpacing: "5px",
        textAlign: "center",
        fontSize: "3.5rem",
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
    removeContainer: {
        position: "fixed",
        transform: "TranslateX(-50%)",
        bottom: "72px",
        left: "50%",
        width: "100vw",
        height: "56px",
    },
    timezoneDrag: {},
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
    const [isDraggingTimezone, setIsDraggingTimezone] = useState(() => false);
    const [isDeleteReady, setIsDeleteReady] = useState(() => false);

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
        console.log({ removedIndex, addedIndex });
        setUserTimezones((items) => {
            const newItems = arrayMove(items, removedIndex, addedIndex || 0);
            if (addedIndex === null) newItems.shift();
            return newItems;
        });
    }

    useEffect(() => {
        updateClock();
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
                <DraggableContainer
                    lockAxis="y"
                    groupName="timezone"
                    onDrop={onDrop}
                    dragBeginDelay={200}
                    onDragStart={(e) => setIsDraggingTimezone(true)}
                    onDragEnd={() => setIsDraggingTimezone(false)}
                    dragClass={classes.timezoneDrag}
                >
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
            <Container
                className={classes.removeContainer}
                style={{
                    zIndex: isDraggingTimezone && "500",
                }}
            >
                <DraggableContainer
                    groupName="timezone"
                    onDragEnter={() => setIsDeleteReady(true)}
                    onDragLeave={() => setIsDeleteReady(false)}
                    onDragEnd={() => setIsDeleteReady(false)}
                    className={classes.removeContainer}
                    style={{
                        width: "100%",
                        height: "56px",
                    }}
                ></DraggableContainer>
            </Container>
            <Fab
                color="primary"
                aria-label="add"
                className={classes.fab}
                onClick={handleAddTimezoneIntent}
                style={{
                    background:
                        isDraggingTimezone &&
                        (isDeleteReady ? colors.darkRed : colors.red),
                }}
            >
                {isDraggingTimezone ? <DeleteOutlineIcon /> : <LanguageIcon />}
            </Fab>
            <TimezoneSelect
                open={showTimezoneSelect}
                onClose={handleAddTimezone}
            />
        </Container>
    );
}

export default ClockPage;
