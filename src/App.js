import React, { Component, } from 'react';
import {
  Header, Menu, Dropdown,
} from 'semantic-ui-react';
import { CreateAccount, Login, } from './Modals';
import { Tables, Fields, } from './data';
import { user, } from './db';
import logo from './logo.svg';

class App extends Component {
  state = {
    selectedTable: null,
  }

  componentDidMount() {
    user.subscribe(this, () => this.forceUpdate());
  }

  componentWillUnmount() {
    user.unsubscribe(this);
  }

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
          style={{ marginTop: 0, }}
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
                user.exists ?
                <Dropdown.Item onClick={user.signOut}>Logout</Dropdown.Item> :
                <Login
                  trigger={
                    <Dropdown.Item>Login</Dropdown.Item>
                  }
                />
              }
            </Dropdown.Menu>
          </Dropdown>
        </Menu>

        { user.exists ? (
          this.state.selectedTable ?
          <Fields
            back={() => this.setState({ selectedTable: null, })}
            tableId={this.state.selectedTable}
          /> :
          <Tables
            user={user}
            onSelect={selectedTable => this.setState({ selectedTable, })}
          />) : 'Please login to continue'
        }
      </div>
    );
  }
}

export default App;
