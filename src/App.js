// @flow

import React, { Component } from 'react';
import { connect } from 'react-firebase';
import logo from './logo.svg';
// import './App.css';
import {
  Container, Divider, Dropdown,
  Grid, Header, Image,
  List, Menu, Segment
} from 'semantic-ui-react';

class App extends Component {
  // render() {
  //   return (
  //     <div className="App">
  //       <header className="App-header">
  //         <img src={logo} className="App-logo" alt="logo" />
  //         <h1 className="App-title">Welcome to React</h1>
  //       </header>
  //       <p className="App-intro">
  //         To get started, edit <code>src/App.js</code> and save to reload.
  //       </p>
  //     </div>
  //   );
  // }

  render = () => (
    <div>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item as='a' header>
            <Image
              size='mini'
              src={logo}
              style={{ marginRight: '1.5em' }}
            />
            Inventory
          </Menu.Item>

          <Dropdown item simple text='File'>
            <Dropdown.Menu>
              <Dropdown.Item>New</Dropdown.Item>
              <Dropdown.Item>List Item</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header>Header Item</Dropdown.Header>
              <Dropdown.Item>
                <i className='dropdown icon' />
                <span className='text'>Submenu</span>
                <Dropdown.Menu>
                  <Dropdown.Item>List Item</Dropdown.Item>
                  <Dropdown.Item>List Item</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Item>
              <Dropdown.Item>List Item</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
      <Container text style={{ marginTop: '7em' }}>
        <button onClick={() => this.props.setValue(this.props.value - 1)}>-</button>
        <span>{this.props.value}</span>
        <button onClick={() => this.props.setValue(this.props.value + 1)}>+</button>
      </Container>

    </div>
  )
}

export default connect((props, ref) => ({
  value: 'counterValue',
  setValue: (value = 0) => {
    if (typeof value !== 'number') {
      value = 0;
    }
    ref('counterValue').set(value);
  }
}))(App);
// export default App;
