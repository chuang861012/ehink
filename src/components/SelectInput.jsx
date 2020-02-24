import React from "react";
import { Color,Box } from "ink";
import SelectInput from "ink-select-input";

export default ({ items, onSelect }) => {
    return (
        <SelectInput
            items={items}
            onSelect={onSelect}
            itemComponent={({ isSelected, label }) => <Color greenBright={isSelected}>{label}</Color>}
            indicatorComponent={({ isSelected }) => (
                <Box marginRight={1}>{isSelected ? <Color hex="#0984e3">></Color> : " "}</Box>
            )}
        />
    );
};
