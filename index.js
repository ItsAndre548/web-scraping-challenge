const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

const BASE_URL = "https://webscraper.io/test-sites/e-commerce/static/computers/laptops?page=";

async function scrapePage(page, brand) {
    const response = await axios.get(`${BASE_URL}${page}`);
    const $ = cheerio.load(response.data);
    const notebooks = [];

    $(".caption").each(function() {
        const price = $(this).find("h4.price").text().trim();
        const title = $(this).find("h4 a.title").text().trim();

        if (!brand || title.toLowerCase().includes(brand)) {
            notebooks.push({ title, price });
        }
    });

    return notebooks;
}

async function scrapeAllPages(brand) {
    const totalPages = 20;
    const promises = [];

    for (let page = 1; page <= totalPages; page++) {
        promises.push(
            scrapePage(page, brand).catch(err => {
                console.error(`Erro na página ${page}:`, err);
                return [];
            })
        );
    }

    const results = await Promise.all(promises);
    return results.flat().sort((a, b) =>
        parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""))
    );
}

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

app.get("/notebooks", async (req, res) => {
    try {
        const brand = req.query.brand?.toLowerCase(); 
        const notebooks = await scrapeAllPages(brand);
        res.json(notebooks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar notebooks" });
    }
});

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});