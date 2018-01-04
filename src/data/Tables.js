import React, { Component } from 'react';
import { Container, List, Form, Icon } from 'semantic-ui-react';
import firebase from '../firebase';

export class Tables extends Component {
  static defaultProps = {
    user: null
  }

  state = {
    newListName: '',
    tables: [],
    addTable: () => null
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.user) {
      this.uid = nextProps.user.uid
    } else {
      return;
    }

    this.ref = firebase.database().ref(this.uid + '/Tables');

    this.setState({
      addTable: tableName => this.ref.push({ tableName })
    });

    if (!this.tableDict) {
      this.tableDict = {}
    }

    // The nitty gritty of accessing the database
    const loadTables = () => {
      const tables = []
      Object.keys(this.tableDict).forEach(key => {
        const table = {
          key,
          tableName: this.tableDict[key]
        };

        tables.push(this.renderTable(table));

        this.setState({
          tables
        });
      });
    };

    this.ref.on('child_added', snap => {
      this.tableDict[snap.key] = snap.val().tableName;

      loadTables();
    });

    this.ref.on('child_removed', snap => {
      if (delete this.tableDict[snap.key]) {
        if (Object.keys(this.tableDict).length === 0) {
          this.setState({ tables: [] }) // shortcut for faster rendering.
        } else {
          loadTables();
        }
      }
    });

  }

  deleteTable = key => this.ref.child(key).remove();

  onChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => this.state.addTable(this.state.newListName)

  renderTable = table => (
    <List.Item key={table.key} >
      {table.tableName}
      <Icon
        link
        name='trash'
        onClick={() => this.deleteTable(table.key)}
      />
    </List.Item>
  );

  render = () => (
    <div>
      {!this.uid ? 'Please Login To Continue' :
      <Container>
        <List size='massive' items={this.state.tables} />
        <Form onSubmit={this.onSubmit}>
          <Form.Input
            placeholder='New Table'
            value={this.state.newListName}
            name='newListName'
            onChange={this.onChange}
          />
        </Form>
      </Container>
    }
  </div>
  )
}
