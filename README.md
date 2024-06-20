# Automated PageSpeed Insights Script for Testing Multiple Pages

This script is designed to run PSI via Google Chrome on both mobile and desktop emulations and spit out the results in a CSV file. The metrics that this script uses are as follows:

* Largest Contentful Paint
* Cumulative Layout Shift
* First Contentful Paint
* Time to First Byte
* Total Blocking Time
* Speed Index
* Overall Performance


## Setup

* Import this repository.
* Open batch-pagespeed-test.js
* Go to the array starting on line 19 and replace the sample URLs with the ones that you would like to test
* Go to the array starting on line 24 and replace the sample page names with the names of the pages that you put into the first array. Make sure
that they are in the same order.
* Open a command prompt and CD into this folder.
* Use the following command to run the script:
```
 node batch-pagespeed-test
 ```
This runs the default version of the script, which allows you to run the script 10 times. To view the output, open pagespeed-results.csv.

## Number of Iterations

By default, this script is set up to test each page 10 times, but you can change this easily via the cli. To change the number of runs from 10 to 40, run the script like so:
```
node batch-pagespeed-test.js --r 40
```
The -r represents the number of times that the script will run and the number following it is that numeric value. You can have -r be whatever number you would like.
