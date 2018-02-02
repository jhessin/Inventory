// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Icon, Form, Label, Grid } from 'semantic-ui-react';
import { user, Path } from '../db';

type Props = {
  onSelect: () => null,
};
type State = {
  newListName: string,
  sorted: boolean,
  path: ?Path,
};
/**
 * Tables - A React component that displays all of the user's
 * tables in a list and provides options to open, delete, and
 * add new tables.
 * @extends Component
 */
export class Tables extends Component<Props, State> {
  static defaultProps = { onSelect: () => null };

  state = {
    newListName: '',
    sorted: false,
    path: null,
  };

  /**
   * Tables - this is a computed property that is used to get the user's
   * tables from firebase using the user.path.
   *
   * @returns {Array} An array containing the user's tables.
   */
  get tables () {
    if (this.state.path) return this.state.path.dataArray;

    return [];
  }

  /**
   * ComponentDidMount - A react method that updates the user's tables.
   *
   * @returns {null} Nothing to return
   */
  componentDidMount () {
    const path = user.path('Tables', {
      onUpdate: () => this.forceUpdate(),
      sortBy: this.state.sorted ? 'tableName' : '',
    });

    this.setState({ path });
  }

  /**
   * Unknown - Description
   *
   * @param {Event}   e             The text changed event.
   * @param {object} Unknown       Description
   * @param {type}   Unknown.name  Description
   * @param {type}   Unknown.value Description
   *
   * @returns {type} Description
   */
  onUpdate = (e, { name, value }) => this.setState({ [name]: value });

  /**
   * Unknown - Description
   *
   * @returns {type} Description
   */
  onSubmit = () => {
    this.state.path.push({ tableName: this.state.newListName });
    this.setState({ newListName: '' });
  };

  /**
   * Unknown - Description
   *
   * @returns {type} Description
   */
  onSort = () => {
    const sorted = !this.state.sorted;
    let path;

    if (sorted) path = this.state.path.sort('tableName');
    else path = this.state.path.sort();
    this.setState({
      path,
      sorted,
    });
  };

  /**
   * Unknown - Description
   *
   * @param {type} table Description
   *
   * @returns {type} Description
   */
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

  /**
   * Unknown - Description
   *
   * @returns {type} Description
   */
  render = () => (
    <Container textAlign='center'>
      <Label
        as='a'
        onClick={() => this.onSort()}
        floated='left'
        content={this.state.sorted ? 'Unsort' : 'Sort By Name'}
      />
      <Grid centered stretched columns={2}>
        {this.tables.map(this.renderTable)}
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
    </Container>
  );
}

Tables.propTypes = { onSelect: PropTypes.func };
