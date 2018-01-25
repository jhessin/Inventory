import React, { Component } from 'react';
import {
  Container, Icon, Form,
  Label, Grid
} from 'semantic-ui-react';
import { user } from '../db';

export class Tables extends Component {
  static defaultProps = {
    onSelect: () => null
  }

  state = {
    newListName: '',
    tables: [],
    sorted: false,
    path: null
  }

  componentDidMount() {
    user.subscribe(this, () => {
      if (user.exists) {
        const path = user.path({
          path: 'Tables',
          onUpdate: () => this.setState({ tables: path.dataArray })
        });
        this.setState({
          path,
          tables: path.dataArray
        });
      }
    });
  }

  componentWillUnmount() {
    user.unsubscribe(this)
  }

  onUpdate = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
    this.state.path.ref.push({ tableName: this.state.newListName});
    this.setState({
      newListName: ''
    });
  }

  onSort = () => {
    console.log('Sorting...');
    const sorted = !this.state.sorted;
    let path;
    if (sorted) {
      path = this.state.path.sort('tableName');
    } else {
      path = this.state.path.sort();
    }
    this.setState({ path, sorted, tables: path.dataArray });
  }

  renderTable = table => (
    <Grid.Row key={table.tableName}>
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
      <Label
        as='a'
        onClick={() => this.onSort()}
        floated='left'
        content={this.state.sorted ? 'Unsort': 'Sort By Name'}
      />
      {!user.exists ? 'Please Login To Continue' :
        <Grid centered stretched columns={2}>
          {this.state.tables.map(this.renderTable)}
          <Grid.Row columns={1}>
            <Form size='massive' onSubmit={this.onSubmit}>
              <Form.Input
                placeholder='New Table'
                value={this.state.newListName}
                name='newListName'
                onChange={this.onUpdate}
              />
            </Form>
          </Grid.Row>
        </Grid>
    }
  </Container>
  )
}
