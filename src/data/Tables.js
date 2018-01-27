import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import {
	Container, Icon, Form,
	Label, Grid,
} from 'semantic-ui-react';
import { user, } from '../db';

export class Tables extends Component {
	static defaultProps = {
		onSelect: () => null,
	}

	state = {
		newListName: '',
		sorted: false,
		path: null,
	}

	get tables() {
		if (this.state.path)
			return this.state.path.dataArray;

		return [];
	}

	componentDidMount() {
		const path = user.path({
			path: 'Tables',
			onUpdate: () => this.forceUpdate(),
			sortBy: this.state.sorted ? 'tableName': '',
		});
		this.setState({
			path,
		});
	}

	onUpdate = (e, { name, value, }) => this.setState({ [name]: value, })

	onSubmit = () => {
		this.state.path.push({ tableName: this.state.newListName,});
		this.setState({
			newListName: '',
		});
	}

	onSort = () => {
		const sorted = !this.state.sorted;
		let path;
		if (sorted)
			path = this.state.path.sort('tableName');
		 else
			path = this.state.path.sort();

		this.setState({ path, sorted, });
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
	)
}

Tables.propTypes = {
	onSelect: PropTypes.function,
};
