#!/usr/bin/env node
import psi from 'psi';
import { stringify } from 'csv-stringify';
import fs from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

//Sets up the custom CLI commands which allow you to select the number of test runs.
var argv = yargs(hideBin(process.argv))

    .default("e","desktop")
    .alias("r","runs")
    .describe("r", "Set the number of times that you would like to run this script.")
    .default("r",10)
    .help("help")
    .argv

//An array of URLS for testing and a second array with the names of the pages that these URLS lead to.
const pageURLS = [
    "https://www.npmjs.com/",
    "https://github.com/",
    "https://neocities.org/"
];
const pageNames = [
    "NPM",
    "GitHub",
    "NeoCities"
];

async function urlLoop(platform) {
    //Loops through the URLs, matches them to their names, and determines if it is testing on desktop or mobile
    for (let i=0; i < pageURLS.length; i++){
        let pageUrl = pageURLS[i];
        let currentPosition = i;
        let page = pageNames[currentPosition];
        let dateTime = new Date().toLocaleString();
        var view = (platform =="desktop") ? "Desktop" : "Mobile";
        console.log("Running test on ", platform);
        const { data } = await psi(pageUrl,{
            strategy: platform
        });

        //Calculates and adjusts performance scores
        let performance = Math.round(data.lighthouseResult.categories.performance.score * 100);
        const passFail = (performance > 49) ? "Passed" : "Failed";
        let regExAndTrim = [
            data.lighthouseResult.audits['largest-contentful-paint'].displayValue,
            data.lighthouseResult.audits["first-contentful-paint"].displayValue,
            data.lighthouseResult.audits["server-response-time"].displayValue,
            data.lighthouseResult.audits["total-blocking-time"].displayValue,
            data.lighthouseResult.audits["speed-index"].displayValue
        ];
        let trimmedItems = regExAndTrim.map((x) => Number(x.toString().replace(/[^0-9.]/g,"").trim()));
        let LargestContentfulPaint = trimmedItems[0] * 1000;
        let FirstContentfulPaint = trimmedItems[1] * 1000;
        let FirstByte = trimmedItems[2];
        let BlockingTime = trimmedItems[3];
        let SpeedIndex = trimmedItems[4] * 1000;

        //Saves scores and other data to an array
        let newRowArray = [
             [dateTime, view, page, pageUrl.toString(), passFail, LargestContentfulPaint, data.lighthouseResult.audits["cumulative-layout-shift"].displayValue,
             FirstContentfulPaint, FirstByte, BlockingTime, SpeedIndex, performance]
            ];
        console.log(data.lighthouseResult.audits["server-response-time"].displayValue,"SRT");
        console.log(newRowArray);

        //Adds the content from newRowArray to the CSV file as a new row
        stringify(newRowArray, (err, output) =>
            fs.appendFileSync("pagespeed-results.csv", output)
        );
    };
};

//Runs the loop over the specified URLs x number of times on both desktop and mobile
async function testPages() {
    const runs = argv.r;
    for(let j=0; j < runs; j++) {
        console.log("Iteration:", j + 1);
        await urlLoop("desktop").then(
            urlLoop("mobile")
        );
    };
    console.log("The script has finished running.");
};

//Initiates the test
testPages();