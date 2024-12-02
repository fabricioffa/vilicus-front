import { TimeTravelJump } from "./types";

export const hasTransitionSet = (el: HTMLElement) => getComputedStyle(el).transitionDuration !== '0s';

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));

export const formatCurrency = (n: number | string) =>
	new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(Number(n));

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
