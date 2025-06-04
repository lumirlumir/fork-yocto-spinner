import process from 'node:process';
import yoctoSpinner from './index.js';

process.env.CI = 'true';

const spinner = yoctoSpinner({
	text: 'Attempt 1 failed. There are 100 retries left.',
}).start();

setTimeout(() => {
	spinner.text = 'Attempt 2 failed. There are 99 retries left.';
}, 1000);

setTimeout(() => {
	spinner.text = 'Attempt 3 failed. There are 98 retries left.';
}, 2000);

setTimeout(() => {
	spinner.success('Deploy completed successfully!');
}, 3000);
