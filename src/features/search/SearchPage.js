import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Header, Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';


export class SearchPage extends Component {
  static propTypes = {
    search: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {

    const { doSearchPending, doSearchError,
      similars
    } = this.props.search;
    const { doSearch } = this.props.actions;


    const handleChange = event => {
      this.props.search.query = event.target.value;
    };

    return (
      <div className="search-search-page">

        <Header as='h1'>Semantic Similarity Search</Header>
        <Form onSubmit={doSearch}>

          <Form.Input placeholder='what is on my mind'
            name='query'
            onChange={handleChange} />
          <Button type="submit" onClick={doSearch} >
            {doSearchPending ? 'Searching...' : 'Search'}
          </Button>
        </Form>

        {doSearchError && (
          <div className="fetch-list-error">Failed to load: {doSearchError.toString()}</div>
        )}
        {similars.length > 0 ? (
          <div>
            {similars.map(sentence => (
              <div className="card-sentence" key={sentence.id}>

                <div className="sentence-url">
                  {sentence.url}
                </div>
                <div className="sentence-title" id={sentence.id}>
                  {sentence.title}
                </div>
                <div>
                  <a>
                    <span className="sentence-score">{sentence.score}</span>
                  </a>
                  &nbsp; &middot; &nbsp;
                  <a>
                    <span className="sentence-author">{sentence.author}</span>
                  </a>
                </div>
                {/*<p className="sentence-desc">{sentence.desc}</p>*/}
              </div>
            ))}
          </div>
        ) : (
            <div>
              <p>Let's search some book by title or author.</p>
            </div>
          )}


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
