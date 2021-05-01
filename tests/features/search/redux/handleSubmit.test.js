import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  SEARCH_HANDLE_SUBMIT_BEGIN,
  SEARCH_HANDLE_SUBMIT_SUCCESS,
  SEARCH_HANDLE_SUBMIT_FAILURE,
  SEARCH_HANDLE_SUBMIT_DISMISS_ERROR,
} from '../../../../src/features/search/redux/constants';

import {
  handleSubmit,
  dismissHandleSubmitError,
  reducer,
} from '../../../../src/features/search/redux/handleSubmit';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('search/redux/handleSubmit', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when handleSubmit succeeds', () => {
    const store = mockStore({});

    return store.dispatch(handleSubmit())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', SEARCH_HANDLE_SUBMIT_BEGIN);
        expect(actions[1]).toHaveProperty('type', SEARCH_HANDLE_SUBMIT_SUCCESS);
      });
  });

  it('dispatches failure action when handleSubmit fails', () => {
    const store = mockStore({});

    return store.dispatch(handleSubmit({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', SEARCH_HANDLE_SUBMIT_BEGIN);
        expect(actions[1]).toHaveProperty('type', SEARCH_HANDLE_SUBMIT_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissHandleSubmitError', () => {
    const expectedAction = {
      type: SEARCH_HANDLE_SUBMIT_DISMISS_ERROR,
    };
    expect(dismissHandleSubmitError()).toEqual(expectedAction);
  });

  it('handles action type SEARCH_HANDLE_SUBMIT_BEGIN correctly', () => {
    const prevState = { handleSubmitPending: false };
    const state = reducer(
      prevState,
      { type: SEARCH_HANDLE_SUBMIT_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.handleSubmitPending).toBe(true);
  });

  it('handles action type SEARCH_HANDLE_SUBMIT_SUCCESS correctly', () => {
    const prevState = { handleSubmitPending: true };
    const state = reducer(
      prevState,
      { type: SEARCH_HANDLE_SUBMIT_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.handleSubmitPending).toBe(false);
  });

  it('handles action type SEARCH_HANDLE_SUBMIT_FAILURE correctly', () => {
    const prevState = { handleSubmitPending: true };
    const state = reducer(
      prevState,
      { type: SEARCH_HANDLE_SUBMIT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.handleSubmitPending).toBe(false);
    expect(state.handleSubmitError).toEqual(expect.anything());
  });

  it('handles action type SEARCH_HANDLE_SUBMIT_DISMISS_ERROR correctly', () => {
    const prevState = { handleSubmitError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SEARCH_HANDLE_SUBMIT_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.handleSubmitError).toBe(null);
  });
});

