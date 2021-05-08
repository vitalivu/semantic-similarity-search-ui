import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Header, Card, Button, Label, Icon, Form } from 'semantic-ui-react';
import queryString from 'query-string';


export class SearchPage extends Component {
  static propTypes = {
    search: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { doSearch, suggestQuestion } = this.props.actions;
    console.log('componentDidMount', this.props);
    if (this.props.location.search) {
      let params = queryString.parse(this.props.location.search);
      let { q, random, alt } = params;// if random/alt is present, its value is null
      if (q) {
        this.props.search.query = q;
        if (alt===null) {
          this.props.search.altSearch = true;
        }
        doSearch();
      } if (random === null) {
        this.props.search.random = true;
        doSearch();
      }
    } else {
      suggestQuestion();
    }
  }

  render() {

    const { doSearchPending, doSearchError, suggest,
      similars, question, queryTime } = this.props.search;
    const { doSearch } = this.props.actions;

    const handleChange = event => { this.props.search.query = event.target.value; };

    return (
      <div className="search-search-page">

        <Header as='h1'>Semantic Similarity Search</Header>
        <Form onSubmit={doSearch}>

          <Form.Group>
            <Form.Input placeholder={suggest} width={12}
              name='query' onChange={handleChange} />
            <Button primary width={2}
              type="submit" onClick={doSearch} >
              {doSearchPending ? 'Searching...' : 'Search'}
            </Button>

          </Form.Group>
        </Form>

        {doSearchError && (
          <Header as="h3" className="fetch-list-error">Failed to load: {doSearchError.toString()}</Header>
        )}
        {similars.length > 0 ? (
          <div>
            <Header as="h3">Similar questions to <span class='search-highlight'><i>{question}</i></span></Header>
            <Header as="h5">Top 10 results in {queryTime} seconds</Header>
            {similars.map(sentence => (
              sentence.questions.map(quest => (
                <Card id={sentence.id} className="search-search-card" fluid href={'/search?offset=0&limit=10&q=' + quest}>
                  <Card.Content header={quest} ></Card.Content>
                  <Card.Content description={sentence.clean_text} />
                  <Card.Content extra>
                    <Icon name='user' />{sentence.author}
                    <Label floating color={sentence.score == 1 ? 'red' : (sentence.score > 0.85 ? 'blue' : 'grey')}>{sentence.score}</Label>
                  </Card.Content>
                </Card>

              ))
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
