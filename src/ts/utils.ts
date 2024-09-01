
export const crfsToken = document.querySelector('[name="csrf-token"]')?.getAttribute('content');

export const stripOfNonNumeric = (str: string) => str.replace(/\D/gi, '');
export const ppStripOfNonNumeric = <T>(val: T) => (typeof val === 'string' ? stripOfNonNumeric(val) : val);

export const hasTransitionSet = (el: HTMLElement) => getComputedStyle(el).transitionDuration !== '1s';

export const debouncer = (fn: (...args: any[]) => any, delay: number) => {
	let timeout: number | any = 0;

	return (...params: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(params), delay);
	};
};

export const formatCurrency = (n: number | string) =>
	new Intl.NumberFormat('pt-PT', {
		style: 'currency',
		currency: 'EUR',
	})
		.format(Number(n))
		.replace(',00', '');

export const currentLocale = document.documentElement.lang as 'fr' | 'en' | 'pt' | 'es' | null;

type TimeTravelJump = {
	years?: number;
	months?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	miliseconds?: number;
};

export const timeTravel = ({ years, months, hours, minutes, seconds, miliseconds }: TimeTravelJump, date = new Date()) => {
	const now = new Date(date);
	if (years) now.setFullYear(now.getFullYear() + years);
	if (months) now.setMonth(now.getMonth() + months);
	if (hours) now.setHours(now.getHours() + hours);
	if (minutes) now.setMinutes(now.getMinutes() + minutes);
	if (seconds) now.setSeconds(now.getSeconds() + seconds);
	if (miliseconds) now.setMilliseconds(now.getMilliseconds() + miliseconds);
	return now;
};
