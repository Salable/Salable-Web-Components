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
				{label: 'Getting Started', link: '/'},
				{
					label: 'Components',
					items: [
						{label: 'Pricing Table', link: '/components/pricing-table'},
						{label: 'Checkout', link: '/components/checkout'},
						{label: 'Invoices', link: '/components/invoices'}
					]
				}
			],
		}),
	],
});
