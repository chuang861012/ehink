#!/usr/bin/env node
import React, { useState, useEffect, Fragment } from "react";
import { render, Color, Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";

import SelectInput from "./components/SelectInput";
import List from "./components/List";
import Search from "./components/Search";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Setting from "./components/Setting";
import Error from "./components/Error";

const Spider = require("./api/spider");
const open = require("open");
const path = require("path");
const LocalStorage = require("node-localstorage").LocalStorage;

const localStorage = new LocalStorage(path.resolve(__dirname, "local_storage"));

const App = () => {
    const [loading, setLoading] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [domain, setDomain] = useState(null);
    const [page, setPage] = useState("ENTRY");
    const [galleries, setGalleries] = useState([]);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);
    const [headIndex, setHeadIndex] = useState(null);

    const cookies = localStorage.getItem("COOKIES");

    const fetchData = async (url, mode) => {
        const spider = new Spider();
        try {
            const { data, next, prev } = await spider.getOnePage(url);
            setGalleries(data);
            setNext(next);
            setPrev(prev);

            switch (mode) {
                case "NEW":
                    setHeadIndex(1);
                    break;
                case "PREV":
                    setHeadIndex(headIndex - data.length);
                    break;
                case "NEXT":
                    setHeadIndex(headIndex + data.length);
                    break;
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setPage("ERROR");
        }
    };

    useEffect(() => {
        if (domain) {
            switch (page) {
                case "HOME":
                    fetchData(domain, "NEW");
                    break;
                case "FAVORITES":
                    fetchData(`${domain}/favorites.php`, "NEW");
                    break;
                case "POPULAR":
                    fetchData("https://e-hentai.org/popular", "NEW");
                    break;
            }
        } else {
            switch (page) {
                case "FAVORITES":
                    fetchData("https://e-hentai.org/favorites.php", "NEW");
                    break;
                case "POPULAR":
                    fetchData("https://e-hentai.org/popular", "NEW");
                    break;
            }
        }
    }, [domain, page]);

    useInput((input, key) => {
        if (input === "s") {
            setPage("SEARCH");
        } else if (key.escape) {
            setPage("MENU");
        }
    });

    const listSelectHandler = async ({ label, value }) => {
        if (value === "NEXT") {
            setLoading(true);
            fetchData(next, "NEXT");
        } else if (value === "PREV") {
            setLoading(true);
            fetchData(prev, "PREV");
        } else {
            // setSelected(value);
            // setPage("GALLERY");
            const url = `${domain}/g/${galleries[value].gid}/${galleries[value].token}`;
            await open(url);
        }
    };
    const searchHandler = url => {
        fetchData(url, 'NEW');
        setLoading(true);
        setPage("RESULT");
    };

    const exitHandler = ({ _, value }) => {
        if (value === 0) process.exit();
        else setExiting(false);
    };

    const menuSelectHandler = (action) => {
        switch (action) {
            case "EXIT":
                setExiting(true);
                break;
            case "ENTRY":
            case "SEARCH":
                setPage(action);
                break;
            default:
                setLoading(true);
                setPage(action);
        }
    }

    const entryHandler = (site) => {
        if (site === "SETTING") setPage("SETTING");
        else if (site === "https://exhentai.org" && !cookies) setPage("ERROR");
        else {
            setLoading(true);
            setDomain(site);
            setPage("HOME");
        }
    };

    if (loading) {
        return (
            <Box>
                <Color green>
                    <Spinner type="dots" />
                </Color>
                {" Loading"}
            </Box>
        );
    }

    if (exiting) {
        return (
            <Fragment>
                <Text>Do you really want to exit?</Text>
                <SelectInput
                    items={[
                        { label: "Yes", value: 0 },
                        { label: "No", value: 1 }
                    ]}
                    onSelect={exitHandler}
                />
            </Fragment>
        );
    }

    switch (page) {
        case "ENTRY":
            return <Home entryHandler={entryHandler} />;
        case "MENU":
            return <Menu menuSelectHandler={menuSelectHandler} />;
        case "HOME":
        case "FAVORITES":
        case "POPULAR":
        case "RESULT":
            return (
                <List
                    list={galleries}
                    listSelectHandler={listSelectHandler}
                    prev={prev}
                    next={next}
                    headIndex={headIndex}
                />
            );
        case "SEARCH":
            return <Search domain={domain} callback={searchHandler} />;
        case "SETTING":
            return (<Setting redirect={() => setPage("ENTRY")} />);
        case "ERROR":
            return (<Error redirect={() => setPage("ENTRY")} />);
    }

    return null;
};

render(<App />);
