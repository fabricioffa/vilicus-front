import * as zod from 'zod';

const sumDays = (date: number | Date, dayNumber: number) => {
	const newDate = new Date(date);
	newDate.setDate(newDate.getDay() + dayNumber);
	return newDate;
};

const formatDate = (date: number | Date) => new Intl.DateTimeFormat('pt-BR').format(date);

const errorMsgs = {
	required: 'Campo obrigatório.',
	string: 'O campo deve conter apenas texto.',
	minLength: 'O mínimo de caracteres é',
	min: 'O mínimo é',
	minDate: 'A data deve ser maior ou igual a',
	maxLength: 'O máximo de caracteres é',
	max: 'O máximo é',
	maxDate: 'A data máxima é ',
	email: 'Formato de email inválido.',
	accepted: 'É preciso aceitar os termos.',
	enum: 'Opção inválida.',
	passwordConfirmation: 'As senhas não coincidem.',
	numericOnly: 'O código CVV deve conter apenas caracteres numéricos.',
} as const;

export const customErrorMap: zod.ZodErrorMap = (error, ctx) => {
	switch (error.code) {
		case zod.ZodIssueCode.invalid_type:
			if (error.received === 'undefined' || error.received === 'nan') {
				return { message: errorMsgs.required };
			}
			if (error.expected === 'string') {
				return { message: errorMsgs.string };
			}
			break;
		case zod.ZodIssueCode.invalid_union:
			if (error.unionErrors.every(error => error.issues.every(issue => issue.code === zod.ZodIssueCode.invalid_type))) {
				return { message: errorMsgs.required };
			}
			break;
		case zod.ZodIssueCode.too_small:
			if (error.type === 'string')
				return error.minimum === 1
					? { message: errorMsgs.required }
					: {
							message: `${errorMsgs.minLength} ${error.inclusive ? error.minimum : Number(error.minimum) - 1}.`,
					  };
			if (error.type === 'number')
				return {
					message: `${errorMsgs.min} ${error.inclusive ? error.minimum : Number(error.minimum) + 1}.`,
				};
			if (error.type === 'date')
				return {
					message: `${errorMsgs.minDate} ${error.inclusive ? formatDate(Number(error.minimum)) : formatDate(sumDays(Number(error.minimum), 1))}.`,
				};

			break;
		case zod.ZodIssueCode.too_big:
			if (error.type === 'string')
				return {
					message: `${errorMsgs.maxLength} ${error.inclusive ? error.maximum : Number(error.maximum) - 1}.`,
				};
			if (error.type === 'number')
				return {
					message: `${errorMsgs.max} ${error.inclusive ? error.maximum : Number(error.maximum) - 1}.`,
				};
			if (error.type === 'date')
				return {
					message: `${errorMsgs.maxDate} ${error.inclusive ? formatDate(Number(error.maximum)) : formatDate(sumDays(Number(error.maximum), -1))}.`,
				};
			break;
		case zod.ZodIssueCode.invalid_string:
			if (error.validation === 'email') return { message: errorMsgs.email };
			break;
		case zod.ZodIssueCode.invalid_literal:
			if (error.expected === 'on') return { message: errorMsgs.accepted };
			break;
		case zod.ZodIssueCode.invalid_enum_value:
			if (error.received === '') return { message: errorMsgs.required };
			return { message: errorMsgs.enum };
	}
	return { message: ctx.defaultError };
};

zod.setErrorMap(customErrorMap);
export const z = zod;
