import React, { useState, useEffect, Fragment } from "react";
import { render, Color, Box, Text, useInput } from "ink";
import Spinner from "ink-spinner";

import SelectInput from "./components/SelectInput";
import List from "./components/List";
import Search from "./components/Search";
import Gallery from "./components/Gallery";

const Spider = require("./api/spider");
const open = require("open");

const App = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState("LIST");
    const [galleries, setGalleries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);

    const fetchData = async url => {
        const { data, next, prev } = await Spider.getOnePage(url);
        setGalleries(data);
        setNext(next);
        setPrev(prev);
        setLoading(false);
    };

    useEffect(() => {
        fetchData("https://exhentai.org/");
    }, []);

    useInput((input, key) => {
        if (input === "s") {
            setPage("SEARCH");
        } else if (key.escape) {
            setPage("EXIT");
        }
    });

    const selectHandler = async ({ label, value }) => {
        if (value === "next") {
            setLoading(true);
            fetchData(next);
        } else if (value === "prev") {
            setLoading(true);
            fetchData(prev);
        } else {
            setSelected(value);
            setPage("GALLERY");
            // const url = `https://exhentai.org/g/${galleries[value].gid}/${galleries[value].token}`;
            // await open(url);
        }
    };
    const searchHandler = url => {
        setLoading(true);
        fetchData(url);
        setPage("LIST");
    };

    const exitHandler = ({ _, value }) => {
        if (value === 0) process.exit();
        else setPage("LIST");
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

    switch (page) {
        case "LIST":
            return (
                <List
                    list={galleries}
                    handleSelect={selectHandler}
                    prev={prev}
                    next={next}
                />
            );
        case "SEARCH":
            return <Search callback={searchHandler} />;
        case "GALLERY":
            return <Gallery data={galleries[selected]} />;
        case "EXIT":
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
};

render(<App />);
