import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Button, Form } from 'semantic-ui-react';


export class SearchPage extends Component {
  static propTypes = {
    search: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
  state = { searching: false, query: '' }


  render() {

    const { searching } = this.props.search;
    const { handleSubmit } = this.props.actions;


    const handleChange = event => {
      this.props.search.query = event.target.value;
      console.log(event.target.value)
    };

    return (
      <div className="search-search-page">

        <Form onSubmit={handleSubmit}>

          <Form.Input placeholder='what is on my mind'
            name='query'
            onChange={handleChange} />
          <Button type="submit" onClick={handleSubmit}>
            {searching ? 'Searching...' : 'Search'}
          </Button>
        </Form>

      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    search: state.search,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPage);
