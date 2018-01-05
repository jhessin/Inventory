import React, { Component } from 'react';
import {
  Button
} from 'semantic-ui-react';

export class Fields extends Component {
  static defaultProps = {
    back: () => null
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.back} >
          Back to Tables
        </Button>
        This is the Fields View
      </div>
    );
  }
}
