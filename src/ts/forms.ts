import { z } from './zod-config.js';
import { onSubmit } from './easyForm.js';
import { baseBool, baseText } from './schemas/base.js';

const productForm = document.querySelector<HTMLFormElement>('#product-form');

if (productForm)
	productForm.addEventListener('submit', e =>
		onSubmit(
			e,
			z.object({
				'product-name': baseText,
				'product-avaiable': baseBool,
				// 'product-category':
				// 'product-unit':
			})
		)
	);
const categoryForm = document.querySelector<HTMLFormElement>('#category-form');

if (categoryForm) categoryForm.addEventListener('submit', e => onSubmit(e, z.object({ name: baseText })));
