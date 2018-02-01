import React, { Component } from 'react';
import { Header, Menu, Dropdown } from 'semantic-ui-react';
import { CreateAccount, Login } from './modals';
import { Tables, Fields } from './screens';
import { user } from './db';
import logo from './logo.svg';

class App extends Component {
  state = { selectedTable: null };

  componentDidMount () {
    user.subscribe(this, () => this.forceUpdate());
  }

  componentWillUnmount () {
    user.unsubscribe(this);
  }

  renderMenu = () => (
    <Dropdown.Menu>
      <CreateAccount trigger={<Dropdown.Item>Create</Dropdown.Item>} />
      {user.exists ? (
        <Dropdown.Item onClick={user.signOut}>Logout</Dropdown.Item>
      ) : (
        <Login trigger={<Dropdown.Item>Login</Dropdown.Item>} />
      )}
    </Dropdown.Menu>
  );

  renderContent = () =>
    this.state.selectedTable ? (
      <Fields
        back={() => this.setState({ selectedTable: null })}
        tableId={this.state.selectedTable}
      />
    ) : (
      <Tables
        user={user}
        onSelect={selectedTable => this.setState({ selectedTable })}
      />
    );

  render () {
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
        <Menu attached='top' inverted style={{ marginTop: 0 }}>
          <Dropdown item text='User'>
            {this.renderMenu()}
          </Dropdown>
        </Menu>

        {user.exists ? this.renderContent() : 'Please login to continue'}
      </div>
    );
  }
}

export default App;
