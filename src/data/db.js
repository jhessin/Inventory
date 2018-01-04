import firebase from '../firebase';

export default firebase;

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
