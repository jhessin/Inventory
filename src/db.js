// @flow

import firebase from './firebase';
import _ from 'lodash';

export default firebase;

export class Path {
  // Private Data
  _ref = firebase.database().ref(); // the ref to the Path
  _path = ''; // the string of the Path
  _sortBy = ''; // a field to sort the data by when getting the dataArray
  _filterBy = {}; // key value pairs to filter the list by.
  _data = {}; // the data stored by this Path
  _onUpdate = () => {}; // a callback to be run when the data is updated.

  constructor({ path, sortBy = '', filterBy = {}, clearFilter = false, onUpdate }) {
    if (path instanceof Path) {
      this._path = path._path;
      this._sortBy = sortBy || path._sortBy;
      this._filterBy = clearFilter ? filterBy :
        { ...path._filterBy, ...filterBy };
      this._ref = path._ref;
      this._onUpdate = onUpdate || path._onUpdate || (() => {});
    } else {
      this._path = path;
      this._onUpdate = onUpdate || (() => {});
      this._ref = firebase.database().ref(path);
    }
    this._sortBy = sortBy;
    this._filterBy = filterBy;

    const updateData = (snap) => {
      if (!snap.exists()) {
        return;
      }

      const value = snap.val();
      // Filter the list by the filterBy criteria.
      if (typeof value === 'object') {
        for (var filter in filterBy) {
          if (filterBy.hasOwnProperty(filter) &&
            value.hasOwnProperty(filter) &&
            value[filter] !== filterBy[filter]) {
            return;
          }
        }
      }
      // save the value to the _data object.
      this._data[snap.key] = value;
      const { key, ref } = snap;
      if (typeof value === 'object') {
        this._data[snap.key].key = key;
        this._data[snap.key].ref = ref;
      } else {
        this._data[snap.key] = { key, ref };
        this._data[snap.key].value = value;
      }

      this._onUpdate();
    }

    this._ref.on('child_added', updateData);

    this._ref.on('child_removed', snap => {
      if (delete this._data[snap.key]) {
        this._onUpdate();
      }
    });

    this._ref.on('child_changed', updateData);
  }

  set onUpdate(callback) {
    if (typeof callback === 'function') {
      this._onUpdate = callback;
    }
  }

  get path() { return this._path; }

  get ref() { return this._ref; }

  get data() { return this._data; }

  set data(obj) { this.ref.update(obj); }

  get dataArray() {
    if (!this._data || typeof this._data !== 'object') {
      return [];
    }

    if (Object.keys(this._data).length === 0) {
      // Shortcut for faster loading
      return [];
    }

    let arr = [];

    Object.keys(this._data).forEach(key => {
      arr.push(this._data[key]);
    });

    // Sort the data by it's sortBy string
    arr = _.sortBy(arr, key => key[this._sortBy] || key.key);

    console.log(arr);

    return arr;
  }

  push(data) { this.ref.push(data); }

  remove() { return this.ref.remove(); }

  filter(filterBy = {}, clearFilter = true) {
    return new Path({ path: this, filterBy, clearFilter });
  }

  sort(sortBy = '') {
    return new Path({ path: this, sortBy });
  }
}

// create an all time User
firebase.auth().onAuthStateChanged(currentUser => {
  user.data = currentUser;
  if (currentUser) {
    user.uid = currentUser.uid;
    user.path = ({ path, ...args }) => new Path({ path: `${user.uid}/${path}`, ...args })
  } else {
    user.uid = null;
    user.path = () => null;
  }
  _.forEach(user.listeners, value => value.callback());
})

export const user = {
  create: (...args) => firebase.auth().createUserWithEmailAndPassword(...args),
  signIn: (...args) => firebase.auth().signInWithEmailAndPassword(...args),
  signOut: () => firebase.auth().signOut(),
  listeners: [], // An array of callbacks
  subscribe: (obj, meth = 'onUpdate') => {
    var callback;
    const id = obj;
    if (typeof meth === 'function' && obj) {
      callback = meth
      user.listeners.push({ id, callback });
      return callback();
    }
    if (typeof meth === 'string' && typeof obj === 'object') {
      callback = obj[meth];
      if (callback && typeof callback === 'function') {
        user.listeners.push({ id, callback });
        return callback();
      }
    }
  },
  unsubscribe: (obj) => {
    _.remove(user.listeners, listener => listener.id === obj);
  },
  get exists() {
    return !!user.uid;
  },
  data: null,
  uid: null,
  path: null
};
