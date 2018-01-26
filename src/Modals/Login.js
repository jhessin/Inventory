import React, { Component } from 'react';
import { Modal, Popup, Form, Button } from 'semantic-ui-react';
import { user } from '../db';

export class Login extends Component {

  state = {
    open: false,
    email: '',
    password: '',
    error: '',
    errorState: false
  }

  open = () => this.setState({
    open: true
  })

  dismiss = () => this.setState({
    open: false,
    email: '',
    password: ''
  })

  onChange = (e, { name, value }) => this.setState({
    [name]: value
  })

  onSubmit = () => {
    const { email, password } = this.state;

    user.signIn(email, password).catch((e) => {
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
          <Popup
            trigger={
              <Button type='submit'>
                Login
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
