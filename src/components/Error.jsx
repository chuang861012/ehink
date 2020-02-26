import React from "react";
import { Box, Text } from "ink";
import Ascii from "ink-ascii";
import SelectInput from './SelectInput';

export default ({ redirect }) => {
    return (
        <Box flexDirection="column">
            <Ascii font="Standard" horizontalLayout="full" verticalLayout="default" text="ERROR" />
            <Text>This will occur when</Text>
            <Text>1. Entering Exhentai without cookies.</Text>
            <Text>2. Network Error (wrong cookie or other network problems)</Text>
            <SelectInput
                items={[
                    { label: "[ Back to home ]", value: 0 }
                ]}
                onSelect={_ => redirect()}
            />
        </Box>
    );
};
