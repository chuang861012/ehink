import React, { useState, useEffect } from "react";
import { render, Color, Box, useInput } from "ink";
import Spinner from 'ink-spinner';

import GallerySelect from './components/GallerySelect';
import Search from './components/Search';

const Spider = require('./api/spider');
const open = require('open');

const App = () => {
    const [loading, setLoading] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [galleries, setGalleries] = useState([]);
    const [prev, setPrev] = useState(null);
    const [next, setNext] = useState(null);

    const fetchData = async (url) => {
        const { data, next, prev } = await Spider.getOnePage(url);
        setGalleries(data);
        setNext(next);
        setPrev(prev);
        setLoading(false);
    }

    useEffect(() => {
        fetchData('https://exhentai.org/');
    }, []);

    useInput((input, key) => {
		if (input === 's') {
			setShowSearch(true);
		}
	});

    const selectHandler = async ({ label, value }) => {
        if (value === 'next') {
            setLoading(true);
            fetchData(next);
        } else if (value === 'prev') {
            setLoading(true);
            fetchData(prev);
        } else {
            const url = `https://exhentai.org/g/${galleries[value].gid}/${galleries[value].token}`;
            await open(url);
        }
    }
    const searchHandler = url => {
        setLoading(true);
        fetchData(url);
        setShowSearch(false);
    }

    if (loading) {
        return (
            <Box>
                <Color green><Spinner type="dots" /></Color>
                {' Loading'}
            </Box>
        )
    }
    if (showSearch) {
        return <Search callback={searchHandler} />
    }

    return <GallerySelect list={galleries} handleSelect={selectHandler} prev={prev} next={next} />;
}

render(<App />);