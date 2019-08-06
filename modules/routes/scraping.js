const rp = require('request-promise');
const $ = require('cheerio');
const DAL = require('../DAL');
const config = require('../../config');
const express = require('express');
const AhoCorasick = require('ahocorasick');
const router = express.Router();

const scraperCollectionName = config.db.collections.scraper;
const url = 'https://en.wikipedia.org/wiki/List_of_minimum_wages_by_country';

module.exports = () => {
    router.get("/scrapData", (req, res) => {
        rp(url).then(function (html) {
            let data = []

            for (let i = 87; i < 200; i++) {
                let countryName = $('table tr:nth-child(' + i + ') td:nth-child(1) a', html).html();
                let countryData = $('table tr:nth-child(' + i + ') td:nth-child(2)', html).text();

                let annualMinWage = $('table tr:nth-child(' + i + ') td:nth-child(3) span', html).html();
                let hourlyMinWage = $('table tr:nth-child(' + i + ') td:nth-child(6) span', html).html();

                data.push({ countryName, countryData, annualMinWage, hourlyMinWage });
            }

            DAL.Delete(scraperCollectionName, {}).then(result => {
                DAL.InsertMany(scraperCollectionName, data).then(result => {
                    res.send(true);
                }).catch(err => {
                    console.err(err);
                    res.send(false);
                });
            }).catch(err => {
                console.err(err);
                res.send(false);
            });

        }).catch(err => {
            console.err(err);
            res.send(false);
        });
    });

    router.get("/getAllStates", (req, res) => {
        DAL.FindSpecific(scraperCollectionName, {}, { countryName: 1 }, { countryName: 1 })
            .then(result => {
                res.send(result.map(state => {
                    return state.countryName;
                }))
            }).catch(err => {
                res.status(500).end();
            });
    });

    router.post("/findKeyWords", (req, res) => {
        let state = req.body.state;

        DAL.FindOne(scraperCollectionName, { countryName: state }).then(data => {
            let keyWords = req.body.keys.filter(word => {
                return word ? true : false;
            });
            let dataString = data.countryData;
            let ac = new AhoCorasick(keyWords);
            let searchResult = ac.search(dataString);
            res.send({
                searchResult,
                data
            });
        });
    });

    return router;
}