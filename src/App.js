import React, { Component } from 'react';
import {
  Header, Menu, Dropdown
} from 'semantic-ui-react';
import { CreateAccount, Login } from './Modals';
import { Tables } from './data';
import firebase from './firebase';
import logo from './logo.svg';

class App extends Component {
  state = {
    createAccount: false,
    currentUser: null
  }

  constructor(props) {
    super(props);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          currentUser: user
        });
      } else {
        this.setState({
          currentUser: null
        });
      }
    });
  }

  logout = () => firebase.auth().signOut();

  render() {
    return (
      <div>
        <Header
          attached='top'
          textAlign='center'
          inverted
          size='huge'
          image={logo}
          content='Database Management'
        />
        <Menu
          attached='top'
          inverted
          style={{ marginTop: 0 }}
        >
          <Dropdown item text='User'>
            <Dropdown.Menu>
              <CreateAccount
                trigger={
                  <Dropdown.Item>
                    Create
                  </Dropdown.Item>
                }
              />
              {
                this.state.currentUser ?
                <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item> :
                <Login
                  trigger={
                    <Dropdown.Item>Login</Dropdown.Item>
                  }
                />
              }
            </Dropdown.Menu>
          </Dropdown>
        </Menu>

        <Tables user={this.state.currentUser}/>
      </div>
    );
  }
}

export default App;
