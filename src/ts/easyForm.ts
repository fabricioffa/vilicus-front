import { type z } from 'zod';
import { toast } from './toasts.js';
import { ErrorsBag, laravelErrorBag } from './types.js';



export const resetErrors = (form: HTMLFormElement) => {
	form.querySelectorAll('[id*="error-msg"]').forEach(errorMsg => (errorMsg.innerHTML = ''));

	form.querySelectorAll(`[aria-invalid="true"]`).forEach(el => el?.setAttribute('aria-invalid', 'false'));
};
export const putErrors = <TFormSchema extends Record<string, unknown>>(errorsBag: ErrorsBag<TFormSchema>, form: HTMLFormElement) => {
	form.querySelector<HTMLElement>(`[name="${Object.keys(errorsBag).at(0)}"]`)?.focus();
	for (const key in errorsBag) {
		form.querySelector(`[name=${key}]`)?.setAttribute('aria-invalid', 'true');

		const errorMsgEl = form.querySelector(`[id=${key}-error-msg]`);
		if (errorMsgEl) errorMsgEl.textContent = errorsBag[key as keyof typeof errorsBag]?.at(0) || null;
	}
};

export const parseFormData = (form: HTMLFormElement) => {
	const formData = new FormData(form);
	const data: Record<string, FormDataEntryValue | FormDataEntryValue[] | undefined> = {};

	for (const [key, value] of formData) {
		const parsedValue = value === '' ? undefined : value;
		if (key in data) {
			if (!Array.isArray(data[key])) {
				data[key] = [data[key] as FormDataEntryValue];
			}
			(data[key] as [FormDataEntryValue | undefined]).push(parsedValue);
		} else {
			data[key] = parsedValue;
		}
	}

	return data;
};

export const onSubmit = async <TSchema>(
	e: Event,
	formSchema: z.ZodType<TSchema>,
	optionalData: Record<string, unknown> = {},
	onSuccess?: ({ data, respData }: { data: z.output<z.ZodType<TSchema>>; respData: string | Record<string, unknown> }) => void,
	onError?: (errorBag: ErrorsBag<z.ZodType<TSchema>>, form: HTMLFormElement) => void,
	shouldToast = true,
	successText = 'Contacto realizado com sucesso!',
	errorText = 'Ocorreu um erro. Por favor, tente outra vez'
) => {
	e.preventDefault();

	const form = e.currentTarget;
	type FormSchema = z.infer<typeof formSchema>;
	if (!(form instanceof HTMLFormElement)) throw 'The event current target must be a form element';
	resetErrors(form);

	const dialog = form.closest<HTMLDialogElement>(`#${form.dataset.dialog}`);

	const data = parseFormData(form);

	const result = formSchema.safeParse(data);
	if (!result.success) {
		putErrors(result.error.formErrors.fieldErrors, form);
		onError && onError(result.error.formErrors.fieldErrors, form);
		return;
	}
	const url = new URL(form.action, 'http://localhost/');
	url.port = '3000';

	const resp = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			...result.data,
			...optionalData,
		}),
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});

	if (!resp.ok && resp.status === 422) {
		const errorBag = (await resp.json()) as laravelErrorBag<FormSchema>;
		putErrors(errorBag.errors, form);
		onError && onError(errorBag.errors, form);
		return;
	}

	if (!resp.ok) {
		dialog?.close();
		toast.error(errorText).showToast();
		return;
	}

	const respData = resp.headers.get('content-type')?.includes('json') ? await resp.json() : await resp.text(); // TODO:
	dialog?.close();
	shouldToast && toast.success(successText).showToast();
	onSuccess && onSuccess({ data: result.data, respData });
	form.reset();
};
