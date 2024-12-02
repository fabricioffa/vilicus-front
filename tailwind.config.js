const strToNumber = n => Number(n.replace(/rem/gi, ''));

const buildClamp = (minFontSize, maxFontSize) => {
	const minWidth = 23.4375;
	const maxWidth = 120;

	const slope = (strToNumber(maxFontSize) - strToNumber(minFontSize)) / (maxWidth - minWidth);

	const yAxisIntersection = -minWidth * slope + strToNumber(minFontSize);
	return `clamp(${minFontSize}, ${yAxisIntersection.toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw, ${maxFontSize});`;
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['*.html', './src/ts/**/*.ts'],
	theme: {
		extend: {
			container: theme => ({
				center: true,
				padding: theme('padding.2'),
			}),
		},
	},
	plugins: [
		function ({ addVariant, theme, addUtilities }) {
			addVariant('em', ({ container }) => {
				container.walkRules(rule => {
					rule.selector = `.em\\:${rule.selector.slice(1)}`;
					rule.walkDecls(decl => {
						decl.value = decl.value.replace('rem', 'em');
					});
				});
			});


			const customFontSizes = [
				['0.625rem', 'base'],
				['xs', 'sm'],
			].reduce(
				(acc, cur) => ({
					...acc,
					[`.text-${cur.map(n => n.replace(/\./, '\\.')).join('-')}`]: {
						'font-size': buildClamp(theme(`fontSize.${cur[0]}`) ?? cur[0], theme(`fontSize.${cur[1]}`) ?? cur[1]),
					},
				}),
				{}
			);
			addUtilities(customFontSizes);
		},
	],
};
