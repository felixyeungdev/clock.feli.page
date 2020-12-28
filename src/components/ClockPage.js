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

const useStyles = makeStyles((theme) => ({
    time: {
        letterSpacing: "5px",
    },
    fab: {
        position: "fixed",
        transform: "TranslateX(-50%)",
        bottom: "72px",
        left: "50%",
        zIndex: "50",
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
        console.log(`Select ${timezone}`);
        setShowTimezoneSelect(false);
        setUserTimezones((old) => {
            if (!old.includes(timezone)) {
                return [...old, timezone];
            }
            return old;
        });
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
                    variant="h2"
                    color="primary"
                    className={classes.time}
                >
                    {time}
                </Typography>
                <Typography variant="h5">{date}</Typography>
                <Divider style={{ marginTop: "16px" }} />
            </Container>
            <Container>
                {userTimezones.map((timezone) => {
                    return <TimezoneDisplay timezone={timezone} />;
                })}
                {/* <TimezoneDisplay timezone="Asia/Hong_Kong" />
                <TimezoneDisplay timezone="Europe/London" />
                <TimezoneDisplay timezone="Asia/Tokyo" />
                <TimezoneDisplay timezone="Asia/Yangon" /> */}
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
