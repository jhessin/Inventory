import React, { Component } from 'react';
import {
  Header, Menu, Dropdown
} from 'semantic-ui-react';
import { CreateAccount, Login } from './Modals';
import { Tables, Fields, user } from './data';
import logo from './logo.svg';

class App extends Component {
  state = {
    user,
    selectedTable: null,
    unsubscribe: null,
  }

  componentDidMount() {
    const unsubscribe = user.onChange(() => this.setState({ user }));
    this.setState({ unsubscribe });
  }

  componentWillUnmount() {
    if (this.state.unsubscribe) {
      this.state.unsubscribe();
      this.setState({ unsubscribe: null });
    }
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

        { this.state.selectedTable ?
          <Fields
            back={() => this.setState({ selectedTable: null })}
            tableId={this.state.selectedTable}
          /> :
          <Tables user={user} onSelect={selectedTable => this.setState({ selectedTable })}/>
        }
      </div>
    );
  }
}

export default App;
