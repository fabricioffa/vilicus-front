import { cachedFetch } from './api.js';
import { TabItem } from './components/TabItem.js';
import { TabList } from './components/TabList.js';
import { TabPanel } from './components/TabPanel.js';
import { Category } from './types.js';
import { formatDate } from './utils.js';


customElements.define('tab-item', TabItem, { extends: 'li' });
customElements.define('tab-list', TabList, { extends: 'ul' });
customElements.define('tab-panel', TabPanel, { extends: 'div' });

const categoriesResp = await cachedFetch<Category>({ key: 'categories', endpoint: 'categories' });

document.querySelectorAll('placeholder').forEach(async placeholder => {
  console.log('%c placeholder', 'color: green', placeholder)
  const resp = await fetch(`/components/${placeholder.id}.html`);
  const html = await resp.text()
  const tempEl = document.createElement('div');
  tempEl.innerHTML = html
  const content = tempEl.querySelector<HTMLElement>('[content]')
  if (!content) return
  content.removeAttribute('content')
  placeholder.replaceWith(content)
})

if (categoriesResp.success) {
  console.log('%c categoriesResp', 'color: green', categoriesResp)
	const categoryTableBody = document.querySelector('[id*=category-table] tbody');
  console.log('%c categoryTableBody', 'color: green', categoryTableBody)
	if (categoryTableBody) {
		categoryTableBody.innerHTML = categoriesResp.data
			.map(
				category => `
                <tr>
                    <td class="p-4 border-b first:ps-8 last:pe-8 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">${category.id
											?.toString()
											.padStart(2, '0')}</td>
                    <td class="p-4 border-b first:ps-8 last:pe-8 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 capitalize">${category.name}</td>
                    <td class="p-4 border-b first:ps-8 last:pe-8 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">${formatDate(category.created_at)}</td>
                    <td class="p-4 border-b first:ps-8 last:pe-8 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">${formatDate(category.updated_at)}</td>
                </tr>
            `
			)
			.join('');
	}
}

const anyForm = document.querySelector<HTMLElement>('[id$=form]');

if (anyForm) import('./forms.js');

const dialogBtns = document.querySelectorAll<HTMLButtonElement>('[aria-controls^=dialog]');

if (dialogBtns.length) (await import('./dialogs.js')).initDialogs(dialogBtns);

const dropdownsTriggers = document.querySelectorAll<HTMLButtonElement>('[aria-controls^=dropdown]');

if (dropdownsTriggers.length) (await import('./dropdowns.js')).initDropdowns(dropdownsTriggers);

const tabs = document.querySelectorAll<HTMLUListElement>('[role=tablist]');

if (tabs.length) (await import('./tabs.js')).initTabs(tabs);

const accordionTriggers = document.querySelectorAll<HTMLButtonElement>('[aria-controls^=accordion]');

if (accordionTriggers.length) (await import('./accordions.js')).initAccordions(accordionTriggers);

document.addEventListener('show-toaster', ((e: CustomEvent) => {
	import('./toasts.js').then(({ toast }) => {
		const { type, text } = e.detail;
		toast[type as keyof typeof toast](text).showToast();
	});
}) as EventListener);
