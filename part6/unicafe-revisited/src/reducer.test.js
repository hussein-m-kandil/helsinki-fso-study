import deepFreeze from 'deep-freeze';
import counterReducer from './reducer.js';

describe('unicafe reducer', () => {
  it('should return a proper initial state when called with undefined state', () => {
    const initialState = {
      good: 0,
      ok: 0,
      bad: 0,
    };
    const action = {
      type: 'DO_NOTHING',
    };
    const newState = counterReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  it('should increment the field corresponding to the given type', () => {
    const fields = ['good', 'ok', 'bad'];
    for (const f of fields) {
      const action = { type: f.toUpperCase() };
      const expectedState = { good: 0, ok: 0, bad: 0 };
      const stateOne = counterReducer(undefined, action);
      deepFreeze(stateOne);
      const stateTwo = counterReducer(stateOne, action);
      expectedState[f] = 2;
      expect(stateTwo).toEqual(expectedState);
    }
  });

  it('should return the given state if the type is unknown', () => {
    const action = { type: 'UNKNOWN' };
    const expectedState = { good: 2, ok: 3, bad: 1 };
    deepFreeze(expectedState);
    const actualState = counterReducer(expectedState, action);
    expect(actualState).toEqual(expectedState);
  });

  it('should reset all fields to Zero', () => {
    const action = { type: 'ZERO' };
    const state = { good: 2, ok: 3, bad: 1 };
    deepFreeze(state);
    const expectedState = { good: 0, ok: 0, bad: 0 };
    const actualState = counterReducer(state, action);
    expect(actualState).toEqual(expectedState);
  });
});
