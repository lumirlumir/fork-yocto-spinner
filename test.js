import process from 'node:process';
import {PassThrough} from 'node:stream';
import getStream from 'get-stream';
import test from 'ava';
import stripAnsi from 'strip-ansi';
import yoctocolors from 'yoctocolors';
import yoctoSpinner from './index.js';

delete process.env.CI;

const getPassThroughStream = () => {
	const stream = new PassThrough();
	stream.clearLine = () => {};
	stream.cursorTo = () => {};
	stream.moveCursor = () => {};
	return stream;
};

const runSpinner = async (function_, options = {}, testOptions = {}) => {
	const stream = testOptions.stream ?? getPassThroughStream();
	const output = getStream(stream);

	const spinner = yoctoSpinner({
		stream,
		text: testOptions.text ?? 'foo',
		spinner: {
			frames: ['-'],
			interval: 10_000,
		},
		...options,
	});

	spinner.start();
	function_(spinner);
	stream.end();

	return stripAnsi(await output);
};

test('start and stop spinner', async t => {
	const output = await runSpinner(spinner => spinner.stop());
	t.is(output, '- foo\n');
});

test('spinner.success()', async t => {
	const output = await runSpinner(spinner => spinner.success());
	t.regex(output, /✔ foo\n$/);
});

test('spinner.error()', async t => {
	const output = await runSpinner(spinner => spinner.error());
	t.regex(output, /✖ foo\n$/);
});

test('spinner.warning()', async t => {
	const output = await runSpinner(spinner => spinner.warning());
	t.regex(output, /⚠ foo\n$/);
});

test('spinner.info()', async t => {
	const output = await runSpinner(spinner => spinner.info());
	t.regex(output, /ℹ foo\n$/);
});

test('spinner changes text', async t => {
	const output = await runSpinner(spinner => {
		spinner.text = 'bar';
		spinner.stop();
	});
	t.is(output, '- foo\n- bar\n');
});

test('spinner stops with final text', async t => {
	const output = await runSpinner(spinner => spinner.stop('final'));
	t.regex(output, /final\n$/);
});

test('spinner with non-TTY stream', t => {
	const stream = getPassThroughStream();
	stream.isTTY = false;
	const spinner = yoctoSpinner({stream, text: 'foo'});

	spinner.start();
	spinner.stop('final');
	t.pass();
});

test('spinner starts with custom text', async t => {
	const output = await runSpinner(spinner => spinner.stop(), {text: 'custom'});
	t.is(output, '- custom\n');
});

test('spinner starts and changes text multiple times', async t => {
	const output = await runSpinner(spinner => {
		spinner.text = 'bar';
		spinner.text = 'baz';
		spinner.stop();
	});
	t.is(output, '- foo\n- bar\n- baz\n');
});

test('spinner handles multiple start/stop cycles', async t => {
	const output = await runSpinner(spinner => {
		spinner.stop();
		spinner.start('bar');
		spinner.stop();
		spinner.start('baz');
		spinner.stop();
	});
	t.is(output, '- foo\n- bar\n- baz\n');
});

test('spinner stops with success symbol and final text', async t => {
	const output = await runSpinner(spinner => spinner.success('done'));
	t.regex(output, /✔ done\n$/);
});

test('spinner stops with error symbol and final text', async t => {
	const output = await runSpinner(spinner => spinner.error('failed'));
	t.regex(output, /✖ failed\n$/);
});

test('spinner accounts for ANSI escape codes when computing line breaks', async t => {
	const scenarios = [
		// 1 symbol + 1 space + 78 chars = 80 chars, max for one line
		{
			textLength: 78,
			clearLineCount: 1,
		},

		// 1 symbol + 1 space + 79 chars = 81 chars, split on two lines
		{
			textLength: 79,
			clearLineCount: 2,
		},
	];

	for (const scenario of scenarios) {
		let clearLineCount = 0;

		const stream = new PassThrough();
		stream.clearLine = () => {
			clearLineCount += 1;
		};

		stream.cursorTo = () => {};
		stream.moveCursor = () => {};
		stream.isTTY = true;

		let text = '';
		for (let i = 0; i < scenario.textLength; i++) {
			text += yoctocolors.blue('a');
		}

		// eslint-disable-next-line no-await-in-loop
		await runSpinner(spinner => spinner.stop(), {}, {
			stream,
			text,
		});
		t.is(clearLineCount, scenario.clearLineCount);
	}
});
