const rp = require('request-promise');
const $ = require('cheerio');
const DAL = require('./DAL');
const config = require('../config');

const scraperCollectionName = config.db.collections.scraper;
const url = 'https://en.wikipedia.org/wiki/List_of_minimum_wages_by_country';

module.exports = () => {
    rp(url).then(function (html) {
        let AhoCorasick = require('ahocorasick');
        let ac = new AhoCorasick(['israel', 'abc', 'popo']);
        let result = ac.search("hello, israel is the bestabc country");

        let data = []

        for (let i = 87; i < 187; i++) {
            let countryName = $('table tr:nth-child(' + i + ') td:nth-child(1) a', html).html();
            let countryData = $('table tr:nth-child(' + i + ') td:nth-child(2)', html).text();

            let annualMinWage = $('table tr:nth-child(' + i + ') td:nth-child(3) span', html).html();
            let hourlyMinWage = $('table tr:nth-child(' + i + ') td:nth-child(6) span', html).html();

            data.push({ countryName, countryData, annualMinWage, hourlyMinWage });
        }

        DAL.Delete(scraperCollectionName, {}).then(result => {
            console.log("delete success");
        }).catch(err => {
            console.err(err);
        });

        DAL.InsertMany(scraperCollectionName, data).then(result => {
            console.log("add success");
        }).catch(err => {
            console.err(err);
        });
    }).catch(function (err) {
        console.err(err);
    });
}