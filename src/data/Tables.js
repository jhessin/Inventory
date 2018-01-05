import React, { Component } from 'react';
import {
  Container, Icon, Form,
  Label, Grid
} from 'semantic-ui-react';
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

      tables.push(obj[key]);

      this.setState({
        tables
      });
    });
  };

  onChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
    this.ref.push({ tableName: this.state.newListName});
    this.setState({
      newListName: ''
    });
  }

  renderTable = table => (
    <Grid.Row key={table.key}>
        <Grid.Column>
          <Label
            as='a'
            size='massive'
            onClick={() => this.props.onSelect(table.key)}
            floated='left'
            content={table.tableName}
          />
        </Grid.Column>
        <Grid.Column>
          <Icon
            link
            name='trash'
            size='massive'
            onClick={() => table.ref.remove()}
          />
        </Grid.Column>
    </Grid.Row>
  );

  render = () => (
    <Container textAlign='center'>
      {!this.state.user ? 'Please Login To Continue' :
        <Grid centered stretched columns={2}>
          {this.state.tables.map(this.renderTable)}
          <Grid.Row columns={1}>
            <Form size='massive' onSubmit={this.onSubmit}>
              <Form.Input
                placeholder='New Table'
                value={this.state.newListName}
                name='newListName'
                onChange={this.onChange}
              />
            </Form>
          </Grid.Row>
        </Grid>
    }
  </Container>
  )
}
