import React from "react";
import { Box } from "ink";
import Ascii from "ink-ascii";

import SelectInput from "./SelectInput";

export default ({ entryHandler }) => {
    return (
        <Box flexDirection="column">
            <Ascii font="Standard" horizontalLayout="full" verticalLayout="default" text="EHINK" />
            <SelectInput
                items={[
                    { label: "[ Enter E-hentai ]", value: "https://e-hentai.org" },
                    { label: "[ Enter Exhentai ]", value: "https://exhentai.org" },
                    { label: "[ Manage Cookies ]", value: "SETTING" }
                ]}
                onSelect={({ _, value }) => entryHandler(value)}
            />
        </Box>
    );
};
