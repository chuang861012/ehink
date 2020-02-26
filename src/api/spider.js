const axios = require("axios");
const cheerio = require("cheerio");

const path = require("path");
const LocalStorage = require("node-localstorage").LocalStorage;

const localStorage = new LocalStorage(path.resolve(__dirname, "..", "local_storage"));

const parseLink = link => {
    const gid = parseInt(link.split("/")[4]);
    const token = link.split("/")[5];
    return [gid, token];
};

async function scrapePage(url, headers) {
    const res = await axios.get(url, { headers });

    const $ = cheerio.load(res.data);
    const galleryIdentifiers = [];

    $(".glink").each((_index, element) => {
        while (element.tagName !== "a" && $(element).parent() !== null) {
            if (element.parent === null) break;
            element = $(element).parent()[0];
        }
        const link = $(element).attr("href");
        if (link) {
            galleryIdentifiers.push(parseLink(link));
        }
    });

    const next = $(".ptt td:last-child a").attr("href");
    const prev = $(".ptt td:first-child a").attr("href");

    return { galleryIdentifiers, next, prev };
}

class Spider {
    constructor() {
        this.headers = {
            "User-Agent":
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
            Cookie: localStorage.getItem("COOKIES")
        };
    }

    async getOnePage(url) {
        const { galleryIdentifiers, next, prev } = await scrapePage(url, this.headers);
        const pending = await Promise.all(this.fetchAllGalleries(galleryIdentifiers));
        const data = pending.reduce((acc, val) => acc.concat(val), []);
        return { data, next, prev };
    }

    fetchAllGalleries(galleryIdentifiers) {
        const pending = [];

        while (galleryIdentifiers.length > 0) {
            const reqData = galleryIdentifiers.splice(0, 25);

            pending.push(this.fetchApi(reqData));
        }

        return pending;
    }

    async fetchApi(data) {
        const result = await axios.post(
            "https://api.e-hentai.org/api.php",
            JSON.stringify({
                method: "gdata",
                gidlist: data,
                namespace: 1
            })
        );
        return result.data.gmetadata;
    }
}

// (async () => {
//     const data = await Spider.getOnePage('https://exhentai.org/');
//     console.log(data.data[0].tags)
// })()


module.exports = Spider;