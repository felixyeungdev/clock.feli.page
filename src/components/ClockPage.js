import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import moment from "moment";

function getSimpleTime() {
    return moment().format("HH:mm:ss");
}
function getSimpleDate() {
    return moment().format("ddd, DD MMM");
}

function ClockPage() {
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
            <Typography variant="h3">{time}</Typography>
            <Typography variant="h5">{date}</Typography>
        </Container>
    );
}

export default ClockPage;
