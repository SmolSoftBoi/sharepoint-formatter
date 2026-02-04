import smolpack from "@smolpack/eslint-config";
import next from "@next/eslint-plugin-next";

export default [
	...smolpack,
	next.configs["core-web-vitals"],
	{
		files: ["scripts/**/*.mjs"],
		languageOptions: {
			globals: {
				process: "readonly",
				console: "readonly",
				Buffer: "readonly",
				fetch: "readonly",
			},
		},
	},
	{
		ignores: [
			".next/**",
			"node_modules/**",
			"app/schemas/sharepoint-v2/*.json",
		],
	},
	{
		settings: {
			"import/resolver": {
				typescript: {
					project: "./tsconfig.json",
				},
			},
		},
	},
];
