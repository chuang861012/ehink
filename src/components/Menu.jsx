import React from "react";
import { Box } from "ink";
import Ascii from "ink-ascii";

import SelectInput from "./SelectInput";

export default ({ menuSelectHandler }) => {
    return (
        <Box flexDirection="column">
            <Ascii font="Standard" horizontalLayout="full" verticalLayout="default" text="MENU" />
            <SelectInput
                items={[
                    { label: "[ Home ]", value: "ENTRY" },
                    { label: "[ Search ]", value: "SEARCH" },
                    { label: "[ Favorites ]", value: "FAVORITES" },
                    { label: "[ Popular ]", value: "POPULAR" },
                    { label: "[ Exit ]", value: "EXIT" }
                ]}
                onSelect={({ _, value }) => menuSelectHandler(value)}
            />
        </Box>
    );
};
