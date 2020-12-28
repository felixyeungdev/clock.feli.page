import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    time: {
        letterSpacing: "5px",
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

    function updateClock() {
        setTime(getSimpleTime());
        setDate(getSimpleDate());
    }

    useEffect(() => {
        var interval = setInterval(updateClock, 10);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container
            style={{
                margin: "16px",
            }}
        >
            <Typography variant="h3" color="primary" className={classes.time}>
                {time}
            </Typography>
            <Typography variant="h5">{date}</Typography>
            <Divider style={{ marginTop: "16px" }} />
        </Container>
    );
}

export default ClockPage;
