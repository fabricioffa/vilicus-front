export class TabPanel extends HTMLDivElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.setAttribute('role', 'tabpanel');
		const tabName = this.getAttribute('tab-name')
        if (!tabName) throw new Error('tab-name is required!')
			const sanitizedTabName = CSS.escape(tabName)
		
		this.setAttribute('aria-labelledby', `tab-${sanitizedTabName}`);
		this.setAttribute('id', `tabpanel-${sanitizedTabName}`);

		this.classList.add('hidden', 'opacity-0', 'transition-opacity', 'easy-in-out', 'durantion-300') 
	}
}