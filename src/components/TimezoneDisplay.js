import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment-timezone";
import ct from "countries-and-timezones";

const useStyles = makeStyles((theme) => ({
    marginVert: {
        marginTop: "16px",
        marginBottom: "16px",
    },
}));

function getSimpleTime(timezone) {
    return timezone
        ? moment().tz(timezone).format("HH:mm")
        : moment().format("HH:mm");
}

function prettyOffset(utcOffset) {
    utcOffset += new Date().getTimezoneOffset();
    const totalMin = Math.abs(utcOffset);
    var hours = Math.floor(totalMin / 60);
    var minutes = totalMin % 60;
    var result = [];
    if (hours > 0) {
        result.push(`${hours} hr`);
    }
    if (minutes > 0) {
        result.push(`${hours} min`);
    }
    if (utcOffset === 0) return "Now";
    if (utcOffset < 0) return `Yesterday, ${result.join(" ")} behind`;
    if (utcOffset > 0) return `Tomorrow, ${result.join(" ")} behind`;
}

function TimezoneDisplay({ timezone }) {
    const classes = useStyles();
    const [timezoneInfo, setTimezoneInfo] = useState(() => {
        return ct.getTimezone(timezone);
    });
    const [countryInfo, setCountryInfo] = useState(() => {
        return ct.getCountry(timezoneInfo.country);
    });
    const [offsetString, setOffsetString] = useState(() => {
        return prettyOffset(timezoneInfo.utcOffset);
    });
    const [time, setTime] = useState("");

    function updateClock() {
        setTime(getSimpleTime(timezone));
    }

    useEffect(() => {
        var interval = setInterval(updateClock, 10);
        return () => clearInterval(interval);
    }, []);

    return (
        <Grid container spacing={1} className={classes.marginVert}>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h6">{countryInfo.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption">
                            {offsetString}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{time}</Typography>
            </Grid>
        </Grid>
    );
}

export default TimezoneDisplay;
