import React, { useState } from "react";
import { Box, Text } from "ink";
import Ascii from "ink-ascii";

import TextInput from "ink-text-input";

const path = require("path");
const LocalStorage = require("node-localstorage").LocalStorage;

const localStorage = new LocalStorage(path.resolve(__dirname, "..", "local_storage"));

export default ({ redirect }) => {
    const [input, setInput] = useState("");

    const COOKIES = localStorage.getItem("COOKIES");

    const handleSubmit = value => {
        localStorage.setItem("COOKIES", value);
        redirect();
    };

    return (
        <Box flexDirection="column">
            <Ascii font="Standard" horizontalLayout="full" verticalLayout="default" text="SETTING" />
            {COOKIES ? <Text>You have set your cookies. Enter your cookies to overwrite.</Text> : <Text>You have no cookies now. Enter your cookies here.</Text>}
            <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
        </Box>
    );
};
