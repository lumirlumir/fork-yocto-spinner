import {
	bold,
	dim,
	cyan,
	yellow,
	magenta,
	red,
	green,
	blue,
} from 'yoctocolors';
import yoctoSpinner from './index.js';

console.log(bold('\n🦄 Unicorn Console Integration Demo\n'));
console.log(dim('This example shows how yocto-spinner handles console.error/warn'));
console.log(dim('while the spinner is running. These write to stderr where the hook runs.\n'));

const collectUnicorns = yoctoSpinner({
	text: 'Searching for unicorns in the enchanted forest...',
	color: 'magenta',
}).start();

setTimeout(() => {
	console.error(cyan('✨ Found a baby unicorn near the crystal stream!'));
}, 500);

setTimeout(() => {
	console.error(yellow('✨ Spotted a golden unicorn on the rainbow bridge!'));
}, 1000);

setTimeout(() => {
	console.warn(yellow('⚠️  A wild unicorn is shy and hiding behind clouds'));
}, 1500);

setTimeout(() => {
	console.log(blue('🧭 Tracking hoofprints deeper into the meadow'));
}, 1800);

setTimeout(() => {
	console.error(magenta('✨ Discovered a unicorn herd in the meadow!'));
}, 2100);

setTimeout(() => {
	console.error(red('❌ Dark forest area is too dangerous to explore'));
}, 2600);

setTimeout(() => {
	collectUnicorns.success(green('Collected 3 magical unicorns! 🦄🦄🦄'));

	const processSpinner = yoctoSpinner({
		text: 'Processing unicorn magic...',
		color: 'cyan',
	}).start();

	setTimeout(() => {
		console.error(blue('🌟 Converting stardust to rainbow essence'));
	}, 500);

	setTimeout(() => {
		console.error(magenta('🌈 Brewing magical unicorn potion'));
	}, 1000);

	setTimeout(() => {
		console.error(yellow('✨ Enchanting unicorn horn fragments'));
	}, 1500);

	setTimeout(() => {
		processSpinner.success(green('Unicorn magic processed successfully!'));

		const deploySpinner = yoctoSpinner({
			text: 'Deploying unicorn powers to the world...',
			color: 'magenta',
		}).start();

		setTimeout(() => {
			console.error(magenta('💫 Spreading joy and sparkles'));
		}, 400);

		setTimeout(() => {
			console.error(blue('🎨 Painting rainbows across the sky'));
		}, 800);

		setTimeout(() => {
			console.error(yellow('⭐ Granting wishes to believers'));
		}, 1200);

		setTimeout(() => {
			deploySpinner.success(bold(green('🦄 Unicorn powers deployed! The world is more magical now! ✨')));

			console.log(dim('\n' + '─'.repeat(60)));
			console.log(bold('\n📊 Mission Summary:'));
			console.log('  • Unicorns collected: ' + bold('3'));
			console.log('  • Magic spells cast: ' + bold('6'));
			console.log('  • Rainbows created: ' + bold('∞'));
			console.log('  • World happiness: ' + bold(green('+1000%')));
			console.log(dim('\n' + '─'.repeat(60)));

			console.log(bold('\n✨ Notice how console.error/warn/log appeared cleanly above the spinner!'));
			console.log(dim('The spinner automatically clears, shows your message, then re-renders below.'));
			console.log(dim('Both console.log() and console.error/warn() work seamlessly while spinning!\n'));
		}, 1600);
	}, 2000);
}, 3000);
