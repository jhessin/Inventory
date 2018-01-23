// @flow

import firebase from '../firebase';

export default firebase;

export class Path {
  static fromUID(path, sortField) {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          unsubscribe();
          resolve(new Path(`${user.uid}/${path}`, sortField));
        }
      });
    });
  }

  ref = firebase.database().ref(); // the ref to the Path
  path = ''; // the string of the Path
  sortField = ''; // a field to sort the data by when getting the dataArray
  _data = {}; // the data stored by this Path
  onUpdate = () => {}; // a callback to be run when the data is updated.

  constructor(path: string, sortField: ?string) {
    this.path = path;
    this.sortField = sortField;
    this.ref = firebase.database().ref(path);

    this.ref.on('child_added', snap => {
      this._data[snap.key] = snap.val();
      this._data[snap.key].key = snap.key;
      this._data[snap.key].ref = snap.ref;
      this.onUpdate();
    });

    this.ref.on('child_removed', snap => {
      if (delete this._data[snap.key]) {
        this.onUpdate();
      }
    });
  }

  get data() {
    return this._data;
  }

  get dataArray() {
    if (!this._data || typeof this._data !== 'object') {
      return [];
    }

    if (Object.keys(this._data).length === 0) {
      // Shortcut for faster loading
      return [];
    }

    const arr = [];

    Object.keys(this._data).forEach(key => {
      arr.push(this._data[key]);
    });

    // TODO: Sort the data by it's sortField
    return arr;
  }

  set data(obj) {
    this.ref.update(obj);
  }

  remove() {
    return this.ref.remove();
  }
}

// OLD STUFF TO REPLACE
export function listen({path, getRef, getUser, onChange}) {
  firebase.auth().onAuthStateChanged(
    user => {
      if (user) {
        if (getUser) {
          getUser(user);
        }

        const ref = firebase.database().ref(`${user.uid}/${path}`);

        if (getRef) {
          getRef(ref);
        }

        if (!onChange || !path) {
          return;
        }

        const obj = {}
        ref.on('child_added', snap => {
          obj[snap.key] = snap.val();
          obj[snap.key].key = snap.key;
          obj[snap.key].ref = snap.ref;
          onChange(obj);
        });

        ref.on('child_removed', snap => {
          if (delete obj[snap.key]) {
            onChange(obj);
          }
        });
      } else {
        if (getUser) {
          getUser();
        }
      }
    }
  )
}

export function signOut() { firebase.auth().signOut(); }
