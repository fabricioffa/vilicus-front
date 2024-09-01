import { CategorySchemaType } from './schemas/entities';
import type z from 'zod';

export type laravelErrorBag<TData> = {
	message: string;
	errors: ErrorsBag<TData>;
};

export type ErrorsBag<TData> = {
	[Property in keyof TData]?: string[] | undefined;
};

export type BaseTData = {
	[name: string]: unknown;
};

export type Category = z.infer<CategorySchemaType>;

export type ErrorData<TData> =
	| {
			type: 'Client Error';
			description: string;
	  }
	| {
			type: 'Missing Header';
			description: string;
	  }
	| { type: 'Mal Formatted Json' }
	| { type: 'Resource Not Found' }
	| {
			type: 'Validation Error';
			fieldErrors: ErrorsBag<TData>;
	  }
	| {
			type: 'Server Error';
			description: string;
	  };

export type ApiResponse<TData extends BaseTData> =
	| {
			success: true;
			data: TData;
	  }
	| {
			success: false;
			data: ErrorData<TData>;
	  };
