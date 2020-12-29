import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SearchIcon from "@material-ui/icons/Search";
import ct from "countries-and-timezones";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "relative",
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function TimezoneSelect({ open, onClose }) {
    const classes = useStyles();

    const [timezones, setTimezones] = useState(() => ct.getAllTimezones());
    const [listItems, setListItems] = useState(() => []);
    const inputEl = useRef(null);

    const [input, setInput] = useState(() => "");

    useEffect(() => {
        const normalisedInput = input
            .toLowerCase()
            .replaceAll("/", "")
            .replaceAll(" ", "");
        const filteredTimezones = Object.values(timezones).filter(
            (timezone) => {
                return timezone.name
                    .toLowerCase()
                    .replaceAll("/", "")
                    .replaceAll("_", "")
                    .includes(normalisedInput);
            }
        );
        return setListItems(
            filteredTimezones.map((timezone) => {
                return (
                    <ListItem
                        button
                        key={timezone.name}
                        onClick={() => onClose(timezone.name)}
                    >
                        <ListItemText
                            primary={timezone.name
                                .replaceAll("/", " - ")
                                .replaceAll("_", " ")}
                        />
                    </ListItem>
                );
            })
        );
    }, [input]);

    function handleFocusOrClear(shouldFocus) {
        if (!shouldFocus) {
            setInput("");
        }
        inputEl.current.focus();
    }

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={() => onClose()}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar} color="secondary">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => onClose()}
                        aria-label="close"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <InputBase
                        inputRef={inputEl}
                        value={input}
                        placeholder="Search..."
                        autoFocus
                        style={{
                            paddingLeft: "16px",
                            width: "100%",
                        }}
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                    />
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => handleFocusOrClear(input == "")}
                        aria-label={input == "" ? "search" : "clear"}
                    >
                        {input == "" ? <SearchIcon /> : <CloseIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <List>{listItems.slice(0, 15)}</List>
        </Dialog>
    );
}
