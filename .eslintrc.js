module.exports = {
	root: true,
	'extends': 'wpcalypso/react',
	parser: 'babel-eslint',
	env: {
		browser: true,
		mocha: true,
		node: true
	},
	rules: {
		'wpcalypso/jsx-classname-namespace': 0,
		'wpcalypso/import-docblock': 0,
		'react/prefer-es6-class': 0,
		'max-len': 0,
		'camelcase': 0,
		'indent': [ 'error', 2, { 'SwitchCase': 1 } ],
		'curly': 0,
		'no-console': 0,
	}
};
