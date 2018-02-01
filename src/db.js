// @flow

import firebase from './firebase';
import _ from 'lodash';

export default firebase;

type Args = {
	clearFilter?: boolean,
	filterBy?: Object,
	onUpdate?: Function,
	path?: string,
	sortBy?: string,
};

export class Path {
	// Private Data

	// The ref to the Path
	_ref = firebase.database().ref();

	// The string of the Path
	_path: string = '';

	// A field to sort the data by when getting the dataArray
	_sortBy: string = '';

	// Key value pairs to filter the list by.
	_filterBy: Object = {};

	// The data stored by this Path
	_data: Object = {};

	// The callback to call when the data is updated
	_onUpdate = () => {}; // A callback to be run when the data is updated.

	// eslint-disable-next-line
	constructor(path: Path | string | null = '', args: ?Args) {
	  if (args) {
	    const {
	      sortBy = '',
	      filterBy = {},
	      clearFilter = false,
	      onUpdate = () => {},
	    } = args;
	    // Set up all the data to populate the _data content.
	    if (path instanceof Path) {
	      this._path = path._path || '';
	      this._sortBy = sortBy || path._sortBy || '';
	      this._filterBy = clearFilter
	        ? filterBy || {}
	        : {
	          ...path._filterBy,
	          ...filterBy,
	        };
	      this._ref = path._ref;
	      this._onUpdate = onUpdate || path._onUpdate || (() => {});
	    } else {
	      this._path = args.path || '';
	      this._onUpdate = onUpdate || (() => {});
	      this._ref = firebase.database().ref(path);
	      this._sortBy = sortBy || '';
	      this._filterBy = filterBy || {};
	    }
	  }

	  // A standard system to update the _data when there is a change.
	  const updateData = snap => {
	    // If the snapshot doesn't exist do nothing
	    if (!snap.exists()) return;

	    const value = snap.val();
	    // Filter the list by the filterBy criteria.
	    if (typeof value === 'object') {
	      for (let filter in this._filterBy) {
	        if (
	          this._filterBy.hasOwnProperty(filter) &&
						value.hasOwnProperty(filter) &&
						value[filter] !== this._filterBy[filter]
	        ) {
	          return;
	        }
	      }
	    }

	    // Save the value to the _data object.
	    this._data[snap.key] = value;
	    const { key, ref } = snap;
	    if (typeof value === 'object') {
	      this._data[snap.key].key = key;
	      this._data[snap.key].ref = ref;
	    } else {
	      this._data[snap.key] = {
	        key,
	        ref,
	      };
	      this._data[snap.key].value = value;
	    }

	    this._onUpdate();
	  };

	  this._ref.on('child_added', updateData);

	  this._ref.on('child_removed', snap => {
	    if (delete this._data[snap.key]) this._onUpdate();
	  });

	  this._ref.on('child_changed', updateData);
	}

	onUpdate (onUpdate: Function) {
	  if (typeof onUpdate === 'function') return new Path(this, { onUpdate });
	}

	get path (): string {
	  return this._path;
	}

	get data (): ?mixed {
	  return this._data;
	}

	set data (obj: ?mixed) {
	  this._ref.update(obj);
	}

	get dataArray (): Array<Object> {
	  if (!this._data || typeof this._data !== 'object') return [];

	  // Shortcut for faster loading
	  // eslint-disable-next-line no-magic-numbers
	  if (Object.keys(this._data).length === 0) return [];

	  let arr = [];

	  Object.keys(this._data).forEach(key => {
	    arr.push(this._data[key]);
	  });

	  // Sort the data by it's sortBy string
	  arr = _.sortBy(arr, key => {
	    if (key && typeof key === 'object') return key[this._sortBy] || key.key;
	  });

	  return arr;
	}

	child = (childPath: string) => {
	  return new Path(this, { path: this._path + childPath });
	};

	push = data =>
	  this._ref.push({
	    ...data,
	    ...this._filterBy,
	  });

	remove = () => this._ref.remove();

	filter = (filterBy = {}, clearFilter = true) =>
	  new Path(this, {
	    filterBy,
	    clearFilter,
	  });

	addFilter = (filterBy = {}) => this.filter(filterBy, false);

	sort = (sortBy = '') => new Path(this, { sortBy });
}

// Create an all time User
firebase.auth().onAuthStateChanged(currentUser => {
  user.data = currentUser;
  if (currentUser) {
    user.uid = currentUser.uid;
    user.path = (path, { ...args }) => {
      if (typeof path === 'string') { new Path((`${user.uid}/${path}`: string), { ...args }) }
    };
  } else {
    user.uid = '';
    user.path = () => null;
  }
  _.forEach(user.listeners, value => value.callback());
});

export const user = {
  create: (...args: [string]) =>
    firebase.auth().createUserWithEmailAndPassword(...args),
  signIn: (...args: [string]) =>
    firebase.auth().signInWithEmailAndPassword(...args),
  signOut: () => firebase.auth().signOut(),
  listeners: [], // An array of callbacks
  subscribe: (obj: Object, meth?: string | Function = 'onUpdate') => {
    let callback: Function;
    const id = obj;
    if (typeof meth === 'function' && obj) {
      callback = meth;
      user.listeners.push({
        id,
        callback,
      });
      return callback();
    }
    if (
      typeof meth === 'string' &&
			typeof obj === 'object' &&
			typeof obj[meth] === 'function'
    ) {
      callback = obj[meth];
      user.listeners.push({
        id,
        callback,
      });
      return callback();
    }
  },
  unsubscribe: (obj: Object) => {
    _.remove(user.listeners, listener => listener.id === obj);
  },
  get exists () {
    return user.uid && user.path;
  },
  data: {},
  uid: '',
  path: (path: string = '', args?: Args) => new Path(path, args),
};
