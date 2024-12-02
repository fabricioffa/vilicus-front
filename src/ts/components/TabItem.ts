export class TabItem extends HTMLLIElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.setAttribute('role', 'presentation');
		
        const button = document.createElement('button');
        const tabName = this.getAttribute('tab-name')
        const selected = this.getAttribute('selected')
        const btnClasses = this.getAttribute('btn-classes')?.split(' ') ?? []
        
        if (!tabName) throw new Error('tab-name is required!')
        
        const sanitizedTabName = CSS.escape(tabName)
		
        button.setAttribute('type', 'button');
		button.setAttribute('role', 'tab');
		button.setAttribute('aria-controls', `tabpanel-${sanitizedTabName}`);
		button.setAttribute('aria-selected', String(!!selected) );
		button.id = `tab-${sanitizedTabName}`;
		button.classList.add('[&_*]:pointer-events-none', ...btnClasses);
		button.append(...this.childNodes);
		this.appendChild(button);
	}
}