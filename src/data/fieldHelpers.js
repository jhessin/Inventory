// @flow

import { user } from '../db';

export const fieldTypes: [{ typeName: string, validate: () => boolean }] = [
  {
    typeName: 'string',
    validate: value => typeof value === 'string'
  },
  {
    typeName: 'number',
    validate: value => typeof value === 'number'
  },
  {
    typeName: 'boolean',
    validate: value => typeof value === 'boolean'
  },
  {
    typeName: 'date',
    validate: value => value instanceof Date
  },
  {
    typeName: 'link',
    validate: value => {
      if (!(value instanceof Array)) {
        return false;
      }

      for (let child of value) {
        // TODO: validate child data
        // return typeof child === 'object'
      }
    }
  }
];

export function verify({ type, value }) {
  if (type && typeof type === 'object' &&
    type.hasOwnProperty('validate') &&
    typeof type.validate === 'function'
  ) {
    return type.validate(value);
  }
  return false;
}
export function pushField(data) {
  if (!user.exists) {
    console.error('User not logged in!'); // eslint-disable-line no-console
    return;
  }

  if (data) {
    if (data.id) {
      user.path(`Fields/${data.id}`).data = data;
    } else {
      user.path('Fields').push(data);
    }
  }
}

export function createField({
  named, type, tableId
}) {
  if (!named) {
    return null;
  }

  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'date':
      return {
        id: pushField().key,
        fieldName: named,
        fieldType: type
      }
    case 'link':
      if (!tableId) return null;
      return {
        id: pushField().key,
        fieldName: named,
        fieldType: type
      }
    default:
      return null;
  }
}
