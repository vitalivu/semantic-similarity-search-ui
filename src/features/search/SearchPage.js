import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Header, Card, Button, Form } from 'semantic-ui-react';
import queryString from 'query-string';


export class SearchPage extends Component {
  static propTypes = {
    search: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { doSearch } = this.props.actions;
    if (this.props.location.search) {
      let params = queryString.parse(this.props.location.search);
      let { q, alt } = params;
      if (q) {
        this.props.search.query = q;
        doSearch();
      }
      if (alt) {
        this.props.search.altSearch = true;
      } else {
        this.props.search.altSearch = false;
      }
    }

  }

  render() {

    const { doSearchPending, doSearchError,
      similars, question, queryTime } = this.props.search;
    const { doSearch } = this.props.actions;

    const handleChange = event => { this.props.search.query = event.target.value; };
    const handleClick = event => {
      console.log(event)
    };

    return (
      <div className="search-search-page">

        <Header as='h1'>Semantic Similarity Search</Header>
        <Form onSubmit={doSearch}>

          <Form.Group>
            <Form.Input placeholder='what is on my mind' width={12}
              name='query'
              onChange={handleChange} />
            <Button primary width={2}
              type="submit" onClick={doSearch} >
              {doSearchPending ? 'Searching...' : 'Search'}
            </Button>

          </Form.Group>
        </Form>

        {doSearchError && (
          <div className="fetch-list-error">Failed to load: {doSearchError.toString()}</div>
        )}
        {similars.length > 0 ? (
          <div>
            <Header as="h2">Similar questions to <span class='search-highlight'><i>{question}</i></span></Header>
            <Header as="h5">Top 10 results in {queryTime} seconds</Header>
            {similars.map(sentence => (
              <Card id={sentence.id} className="search-search-card" fluid onClick={handleClick}
                href={'/search?offset=0&limit=10&q=' + sentence.title}
                header={sentence.title}
                meta={sentence.score + ' - ' + sentence.author}
                description={sentence.desc} />
            ))}
          </div>
        ) : (
            <div>
              <p>Let search your questions</p>
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
