import React, { Component } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line
import { createField } from './fieldHelpers';
// Createfield({ named: string, type: Enum, tableId(opt): string});
import { Button, Table } from 'semantic-ui-react';

export class Fields extends Component {
  static defaultProps = { back: () => null };

  state = {
    fields: [], // Id: string,
    /*
     * fieldName: string,
     * fieldType: Enum(string, number, date, link),
     * linkedTable: (for fieldType link) string id of the linked table.
     */
    rows: [], // An array of objects indexed by the field ids.
  };

  renderFields = field => (
    <Table.HeaderCell>{field.fieldName}</Table.HeaderCell>
  );

  renderRows = row => (
    <Table.Row>{this.state.fields.map(field => row[field.id])}</Table.Row>
  );

  render () {
    return (
      <div>
        <Button onClick={this.props.back}>Back to Tables</Button>
        <Table celled>
          <Table.Header>
            <Table.Row>
              {this.state.fields.map(this.renderFields)}
              <Table.HeaderCell>
                <Button icon='plus' content='Add Field' />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.rows.map(this.renderRows)}
            <Table.Row>
              <Table.Cell>
                <Button icon='plus' content='Add Record' />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}

Fields.propTypes = {
  tableId: PropTypes.string.isRequired,
  back: PropTypes.func,
};
