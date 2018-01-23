import React, { Component } from 'react';
import {
  Header, Menu, Dropdown
} from 'semantic-ui-react';
import { CreateAccount, Login } from './Modals';
import { Tables, Fields } from './data';
import firebase from './firebase';
import logo from './logo.svg';

class App extends Component {
  state = {
    user: null,
    selectedTable: null
  }

  constructor(props) {
    super(props);

    firebase.auth().onAuthStateChanged(user =>
      this.setState({ user })
    );
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
                this.state.user ?
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

        { this.state.selectedTable ?
          <Fields
            back={() => this.setState({ selectedTable: null })}
            tableId={this.state.selectedTable}
          /> :
          <Tables user={this.state.user} onSelect={selectedTable => this.setState({ selectedTable })}/>
        }
      </div>
    );
  }
}

export default App;
