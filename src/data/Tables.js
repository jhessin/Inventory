import React, { Component } from 'react';
import {
  Container, Icon, Form,
  Label, Grid
} from 'semantic-ui-react';
import { user } from './db';

export class Tables extends Component {
  static defaultProps = {
    onSelect: () => null
  }

  state = {
    newListName: '',
    tables: [],
    path: null
  }

  componentDidMount() {
    this.unsub = user.onChange(this.loadPath);
    this.loadPath();
  }

  loadPath = () => {
    if (user.exists) {
      const path = user.path('Tables');
      path.onUpdate = () => this.setState({ tables: path.dataArray });
      this.setState({
        path,
        tables: path.dataArray
      });
    }
  }

  componentWillUnmount() {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }

  onChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => {
    this.state.path.ref.push({ tableName: this.state.newListName});
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
      {!user.uid ? 'Please Login To Continue' :
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
