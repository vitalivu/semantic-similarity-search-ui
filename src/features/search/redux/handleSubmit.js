import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  SEARCH_HANDLE_SUBMIT_BEGIN,
  SEARCH_HANDLE_SUBMIT_SUCCESS,
  SEARCH_HANDLE_SUBMIT_FAILURE,
  SEARCH_HANDLE_SUBMIT_DISMISS_ERROR,
} from './constants';

export function handleSubmit(args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: SEARCH_HANDLE_SUBMIT_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = args.error ? Promise.reject(new Error()) : Promise.resolve();
      doRequest.then(
        (res) => {
          dispatch({
            type: SEARCH_HANDLE_SUBMIT_SUCCESS,
            data: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: SEARCH_HANDLE_SUBMIT_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function dismissHandleSubmitError() {
  return {
    type: SEARCH_HANDLE_SUBMIT_DISMISS_ERROR,
  };
}

export function useHandleSubmit(params) {
  const dispatch = useDispatch();

  const { query, handleSubmitPending, handleSubmitError } = useSelector(
    state => ({
      query: state.search.query,
      handleSubmitPending: state.search.handleSubmitPending,
      handleSubmitError: state.search.handleSubmitError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback((...args) => {
    return dispatch(handleSubmit(...args));
  }, [dispatch]);

  useEffect(() => {
    if (params) boundAction(...(params || []));
  }, [...(params || []), boundAction]); // eslint-disable-line

  const boundDismissError = useCallback(() => {
    return dispatch(dismissHandleSubmitError());
  }, [dispatch]);

  return {
    query,
    handleSubmit: boundAction,
    handleSubmitPending,
    handleSubmitError,
    dismissHandleSubmitError: boundDismissError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SEARCH_HANDLE_SUBMIT_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        handleSubmitPending: true,
        handleSubmitError: null,
      };

    case SEARCH_HANDLE_SUBMIT_SUCCESS:
      // The request is success
      return {
        ...state,
        handleSubmitPending: false,
        handleSubmitError: null,
      };

    case SEARCH_HANDLE_SUBMIT_FAILURE:
      // The request is failed
      return {
        ...state,
        handleSubmitPending: false,
        handleSubmitError: action.data.error,
      };

    case SEARCH_HANDLE_SUBMIT_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        handleSubmitError: null,
      };

    default:
      return state;
  }
}
