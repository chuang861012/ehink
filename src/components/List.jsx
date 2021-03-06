import React from "react";
import { Color, Text, Box } from "ink";
import SelectInput from "./SelectInput";
import Divider from "ink-divider";

export default ({ list, listSelectHandler, prev, next, headIndex }) => {
    const buildSelector = () => {
        const items = list.map((_, i) => {
            return { label: `${headIndex + i}`, value: i };
        });
        prev && items.push({ label: "prev", value: "PREV" });
        next && items.push({ label: "next", value: "NEXT" });
        return items;
    };

    const renderGallery = (g, i) => {
        let language = "";
        for (const tag of g.tags) {
            if (tag.startsWith("language:") && !tag.endsWith("translated")) {
                language = tag;
                break;
            }
        }
        language = language.length > 0 ? language.substring(9) : "japanese";
        const label = (
            <Box key={i} width="100%">
                <Box width={10} marginRight={2} flexShrink={0}>
                    <Color hex="#ff8468">{g.category}</Color>
                </Box>
                <Box width={12} marginRight={2} flexShrink={0}>
                    <Color hex="#5fa9cf">{language}</Color>
                </Box>
                <Box width={6} marginRight={2} flexShrink={0}>
                    <Color hex="#ffde74">{g.rating}</Color>
                </Box>
                <Box width={5} marginRight={2} flexShrink={0}>
                    <Color hex="#71b600">{g.filecount}</Color>
                </Box>
                <Box textWrap="truncate" marginRight={3}>
                    <Text>{g.title_jpn || g.title}</Text>
                </Box>
            </Box>
        );
        return label;
    };

    if (list.length === 0) return <Text bold>No result.</Text>;

    return (
        <Box flexDirection="column">
            <Box>
                <Box marginRight={5}> id</Box>
                <Box width={10} marginRight={2} flexShrink={0}>
                    <Color hex="#ff8468">Category</Color>
                </Box>
                <Box width={12} marginRight={2} flexShrink={0}>
                    <Color hex="#5fa9cf">language</Color>
                </Box>
                <Box width={6} marginRight={2}>
                    <Color hex="#ffde74">Rating</Color>
                </Box>
                <Box width={5} marginRight={2}>
                    <Color hex="#71b600">Pages</Color>
                </Box>
                <Text bold>Title</Text>
            </Box>
            <Divider />
            <Box>
                <Box marginRight={2} flexDirection="column" justifyContent="flex-end">
                    <SelectInput items={buildSelector()} onSelect={listSelectHandler} />
                </Box>
                <Box flexDirection="column">{list.map(renderGallery)}</Box>
            </Box>
        </Box>
    );
};
