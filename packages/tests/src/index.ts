import path from 'path'
import chalk from 'chalk'

const createBuckets = require('esm')(module)(path.resolve(process.cwd(), '../search_/src/use-search/get-buckets')).default

function logTestResult(success: boolean, errorMessage: string = '') {
	if (success)	console.log(chalk.green('Pass'))
	else			console.log(chalk.red('Fail'), errorMessage);
}

const b1 = createBuckets(new Date(Date.UTC(1500, 11, 1)), new Date(Date.UTC(1804, 2, 1)))
logTestResult(b1.length === 11, b1.length.toString())
logTestResult(b1[0].fromLabel === '1500', b1[0].fromLabel)

const b2 = createBuckets(new Date(Date.UTC(1500, 9, 1)), new Date(Date.UTC(1508, 2, 1)))
logTestResult(b2.length === 10, b2.length.toString())
logTestResult(b2[0].fromLabel === 'Q4 1500', b2[0].fromLabel)

const b3 = createBuckets(new Date(Date.UTC(1500, 9, 1)), new Date(Date.UTC(1502, 2, 1)))
logTestResult(b3.length === 9, b3.length.toString())
logTestResult(b3[0].fromLabel === 'Oct 1500', b3[0].fromLabel)

const b4 = createBuckets(new Date(Date.UTC(1500, 9, 3)), new Date(Date.UTC(1501, 2, 1)))
logTestResult(b4.length === 15, b4.length.toString())
logTestResult(b4[0].fromLabel === '3 Oct 1500', b4[0].fromLabel)
