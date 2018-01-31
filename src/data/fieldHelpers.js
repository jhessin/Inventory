// @flow

import { user } from '../db';

export type FieldType = {
  typeName: string,
  validate: mixed => boolean,
};

export type Args = {
  named: ?string,
  tableId: ?string,
  type: ?FieldType,
  value: ?mixed,
};

// An array of FieldTypes
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

export const verify = ({ type, value }: Args) => {
  if (
    type &&
    typeof type === 'object' &&
    type.hasOwnProperty('validate') &&
    typeof type.validate === 'function'
  ) {
    return type.validate(value);
  }

  return false;
};

export const pushField = (data: ?Object) => {
  if (data) {
    if (data.id) {
      let path = user.path(`Fields/${data.id}`);
      if (path) return (path.data = data);
    } else return user.path('Fields').push(data);
  }
};

export const createField = ({ named, type, tableId }: Args) => {
  if (!named || !user) return null;

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
        // fieldType: type,
      };

    default:
      return null;
  }
};
