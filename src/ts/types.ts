import { CategorySchemaType } from './schemas/entities';
import type z from 'zod';

export type TimeTravelJump = {
	years?: number;
	months?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	miliseconds?: number;
};

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

export type CategoryInsertion = z.infer<CategorySchemaType>

export type Category = {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

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
			data: TData[];
	  }
	| {
			success: false;
			data: ErrorData<TData>;
	  };
