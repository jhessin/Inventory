import React, { Component } from 'react';
import { Container, List, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-firebase';

class TablesClass extends Component {
  static defaultProps = {
    user: null
  }

  state = {
    newListName: ''
  }

  onChange = (e, { name, value }) => this.setState({ [name]: value })

  onSubmit = () => this.props.addTable(this.state.newListName)

  componentWillReceiveProps(nextProps) {
    if (this.props.tables) {
      Object.values(this.props.tables).forEach((table, index) => console.log(index, table.tableName));
    }
  }

  render = () => (
    <Container>
      {!this.props.user ? 'Please Login To Continue' :
      <div>
        {!this.props.tables ? null :
          <List>
            {Object.values(this.props.tables).forEach(
              (table, index) => (
                <List.Item key={index}>
                  table.tableName
                </List.Item>
              )
            )}
          </List>
        }
        <Input
          placeholder='New Table'
          value={this.state.newListName}
          name='newListName'
          onChange={this.onChange}
        />
        <Button
          onClick={this.onSubmit}
        >Add</Button>
      </div>
    }
    </Container>
  )
}

export const Tables = connect((props, ref) => {
  if (!props.user) return {};

  return {
    tables: `${props.user.uid}/Tables`,
    addTable: tableName => ref(`${props.user.uid}/Tables`).push({ tableName })
  }
})(TablesClass)
