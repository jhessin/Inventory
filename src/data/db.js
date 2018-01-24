// @flow

import firebase from '../firebase';
import _ from 'lodash';

export default firebase;

export class Path {
  static fromUID(path, sortBy) {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          unsubscribe();
          resolve(new Path(`${user.uid}/${path}`, sortBy));
        }
      });
    });
  }

  ref = firebase.database().ref(); // the ref to the Path
  path = ''; // the string of the Path
  sortBy = ''; // a field to sort the data by when getting the dataArray
  filterBy = {}; // key value pairs to filter the list by.
  _data = {}; // the data stored by this Path
  onUpdate = () => {}; // a callback to be run when the data is updated.

  constructor(path: string, sortBy: ?string) {
    this.path = path;
    this.sortBy = sortBy;
    this.ref = firebase.database().ref(path);

    this.ref.on('child_added', snap => {
      if (!snap.exists()) {
        return;
      }

      // TODO: Filter the list by the filterBy criteria.
      const value = snap.val();
      if (typeof value === 'object') {
        this._data[snap.key] = value;
        this._data[snap.key].key = snap.key;
        this._data[snap.key].ref = snap.ref;
      } else {
        const { key, ref } = snap;
        this._data[snap.key] = { key, ref };
        this._data[snap.key].value = value;
      }

      this.onUpdate();
    });

    this.ref.on('child_removed', snap => {
      if (delete this._data[snap.key]) {
        this.onUpdate();
      }
    });

    this.ref.on('child_changed', snap => {
      this._data[snap.key] = snap.val();
    })
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

    // TODO: Sort the data by it's sortBy
    return arr;
  }

  set data(obj) {
    this.ref.update(obj);
  }

  push(data) {
    this.ref.push(data);
  }

  remove() {
    return this.ref.remove();
  }
}

// create an all time User
firebase.auth().onAuthStateChanged(currentUser => {
  user.data = currentUser;
  if (currentUser) {
    user.uid = currentUser.uid;
    user.path = path => new Path(`${user.uid}/${path}`)
  } else {
    user.uid = null;
    user.path = () => null;
  }
  _.forEach(user.listeners, listener => listener.callback(listener.id));
})

export const user = {
  signIn: firebase.auth().signInWithEmailAndPassword,
  signOut: firebase.auth().signOut,
  listeners: [], // An array of callbacks
  onChange: callback => {
    const id = user.listeners.length;
    user.listeners.push({ callback, id })
    callback(id);
    return () => _.remove(user.listeners, listener => listener.id === id);
  },
  get exists() {
    return !!user.uid;
  },
  data: null,
  uid: null,
  path: null
};
