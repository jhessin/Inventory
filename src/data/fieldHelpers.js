// @flow

import { user, } from '../db';

type FieldType = {
	typeName: string,
	validate: (mixed) => boolean
}

export const fieldTypes: Array<FieldType> = [
	{
		typeName: 'string',
		validate: value => typeof value === 'string',
	},
	{
		typeName: 'number',
		validate: value => typeof value === 'number',
	},
	{
		typeName: 'boolean',
		validate: value => typeof value === 'boolean',
	},
	{
		typeName: 'date',
		validate: value => value instanceof Date,
	},
];

export function verify({ type, value, }) {
	if (type && typeof type === 'object' &&
		type.hasOwnProperty('validate') &&
		typeof type.validate === 'function'
	) return type.validate(value);

	return false;

}

export function pushField(data) {
	if (!user.exists) {
		// eslint-disable-next-line no-console
		console.error('User not logged in!');
		return;
	}

	if (data) {
		if (data.id) user.path(`Fields/${data.id}`).data = data;
		else user.path('Fields').push(data);

	}
}

export function createField({
	named, type, tableId,
}) {
	if (!named) return null;


	switch (type) {
	case 'string':
	case 'number':
	case 'boolean':
	case 'date':
		return {
			id: pushField().key,
			fieldName: named,
			fieldType: type,
		};
	case 'link':
		if (!tableId) return null;
		return {
			id: pushField().key,
			fieldName: named,
			fieldType: type,
		};
	default:
		return null;
	}
}
