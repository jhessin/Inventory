import React, { Component } from 'react';
import { Modal, Popup, Form, Button } from 'semantic-ui-react';
import { user } from '../db';

export class CreateAccount extends Component {

  state = {
    open: false,
    email: '',
    password: '',
    confirmPass: '',
    error: '',
    errorState: false
  }

  open = () => this.setState({
    open: true
  })

  dismiss = () => this.setState({
    open: false,
    email: '',
    password: '',
    confirmPass: ''
  })

  onChange = (e, { name, value }) => this.setState({
    [name]: value
  })

  onSubmit = () => {
    const { email, password, confirmPass } = this.state;

    if (password !== confirmPass) {
      this.setState({
        error: 'The passwords do not match',
        errorState: true
      });
      return;
    }

    user.create(email, password).catch((e) => {
      console.log(e.message);
        this.setState({
          error: e.message,
          errorState: true
        });
      }).then(() => this.state.errorState ? null : this.dismiss());
  }

  clearError = () => this.setState({
    error: '',
    errorState: false
  })

  render = () => (
    <Modal
      {...this.props}
      open={this.state.open}
      onOpen={this.open}
      onClose={this.dismiss}
    >
      <Modal.Content>
        <Form>
          <Form.Input
            label='User Email'
            type='email'
            value={this.state.email}
            name='email'
            onChange={this.onChange}
          />
          <Form.Input
            label='Password'
            type='password'
            value={this.state.password}
            name='password'
            onChange={this.onChange}
          />
          <Form.Input
            label='Confirm Password'
            type='password'
            value={this.state.confirmPass}
            name='confirmPass'
            onChange={this.onChange}
          />
          <Popup
            trigger={
              <Button type='submit'>
                Create Account
              </Button>
            }
            content={this.state.error}
            on='click'
            open={this.state.errorState}
            onClose={this.clearError}
            onOpen={this.onSubmit}
          />
        </Form>
      </Modal.Content>
    </Modal>
  )
}
