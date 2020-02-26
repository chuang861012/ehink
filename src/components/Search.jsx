import React, { useState } from "react";
import { Box } from "ink";
import TextInput from "ink-text-input";

import SelectInput from "./SelectInput";

export default ({ domain, callback }) => {
    // 0: plain text, 1:artist
    const [mode, setMode] = useState(null);
    const [query, setQuery] = useState("");

    const handleSelect = ({ _, value }) => {
        setMode(value);
    };

    const handleSubmit = value => {
        switch (mode) {
            case 0:
                callback(`${domain || "https://e-hentai.org"}/?f_search=${value}`);
                break;
            case 1:
                callback(`${domain || "https://e-hentai.org"}/tag/artist:${value}`);
                break;
        }
    };

    if (mode === null) {
        return (
            <SelectInput
                items={[
                    { label: "plain text", value: 0 },
                    { label: "artist", value: 1 }
                ]}
                onSelect={handleSelect}
            />
        );
    }

    return (
        <Box>
            <Box marginRight={1}>Enter your query:</Box>
            <TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
        </Box>
    );
};
