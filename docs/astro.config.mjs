import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Salable Components',
			social: {
				github: 'https://github.com/Salable/salable-web-components-stenciljs',
			},
			sidebar: [
				{
					label: 'Start Here',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Getting Started', link: '/guides/getting-started/' },
					],
				},
				{
					label: 'Components',
					items: [
						{label: 'Invoices', link: '/components/invoices'}
					]
				},
			],
		}),
	],
});
