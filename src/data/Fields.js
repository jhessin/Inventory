import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Table
} from 'semantic-ui-react';

export class Fields extends Component {
  static defaultProps = {
    back: () => null
  }

  state = {
    fields: [],
    rows: []
  }

  renderFields = field => (
    <Table.HeaderCell>field.fieldName</Table.HeaderCell>
  )

  renderRows = row => (
    <Table.Row>
      {this.state.fields.map(field => row[field])}
    </Table.Row>
  )

  render() {
    return (
      <div>
        <Button onClick={this.props.back} >
          Back to Tables
        </Button>
        <Table celled>
          <Table.Header>
            <Table.Row>
              {this.state.fields.map(this.renderFields)}
              <Table.HeaderCell><Button icon='plus' content='Add Field'/></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.rows.map(this.renderRows)}
            <Table.Row>
              <Table.Cell><Button icon='plus' content='Add Record'/></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

Fields.propTypes = {
  tableId: PropTypes.string.isRequired
}
