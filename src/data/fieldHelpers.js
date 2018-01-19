import firebase from '../firebase';

export const fieldTypes = [
  'string',
  'number',
  'boolean',
  'date',
  'link'
];

export function verify({ type, value }) {
  if (!type || !value) {
    return null;
  }

  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'boolean':
      return typeof value === 'boolean';
    case 'date':
      return value instanceof Date;
    case 'link':
      return value instanceof Array;
    default:
      return false;
  }
}
export function pushField(data) {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log('User not logged in!');
    return;
  }
  if (data && data.id) {
    return firebase.database().ref(`${user.uid}/Fields/${data.id}`);
  }
  return firebase.database().ref(`${user.uid}/Fields`).push(data);
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
