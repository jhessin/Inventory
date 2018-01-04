import React, { Component } from 'react';
import { Container, List, Form, Icon } from 'semantic-ui-react';
import { listen } from './db';

export class Tables extends Component {
  static defaultProps = {
    onSelect: () => null
  }

  state = {
    newListName: '',
    tables: [],
    user: null
  }

  constructor(props) {
    super(props);

    // authListen(user => (this.setState({ user })));

    listen({
      path: 'Tables',
      getUser: user => this.setState({ user }),
      getRef: ref => (this.ref = ref),
      onChange: this.loadTables
    });
  }

  // The nitty gritty of formatting the database
  loadTables = (obj) => {
    const tables = []
    if (Object.keys(obj).length === 0) {
      // Shortcut for faster loading
      this.setState({ tables });
      return;
    }

    Object.keys(obj).forEach(key => {

      tables.push(this.renderTable(obj[key]));

      this.setState({
        tables
      });
    });
  };

  deleteTable = key => this.ref.child(key).remove();

  onChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
    this.ref.push({ tableName: this.state.newListName});
    this.setState({
      newListName: ''
    });
  }

  renderTable = table => (
    <List.Item as='a' key={table.key} onClick={() => this.props.onSelect(table.key)}>
      {table.tableName}
      <Icon
        link
        name='trash'
        onClick={() => table.ref.remove()}
      />
    </List.Item>
  );

  render = () => (
    <div>
      {!this.state.user ? 'Please Login To Continue' :
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
