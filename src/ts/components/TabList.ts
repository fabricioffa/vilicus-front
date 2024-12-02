export class TabList extends HTMLUListElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.setAttribute('role', 'tablist');
	}
}