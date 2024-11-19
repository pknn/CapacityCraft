import { WritableDraft } from 'immer';

export type UndoableState<TState> = {
  current: TState;
  previous: TState | undefined;
};

type UndoableSelector<T, V> = {
  value: (state: V) => T;
};

type UndoableAdapter<TState> = {
  getInitialState: () => UndoableState<TState>;
  update: (
    state: WritableDraft<UndoableState<TState>>,
    update: Partial<TState>
  ) => void;
  commit: (state: WritableDraft<UndoableState<TState>>) => void;
  rollback: (state: WritableDraft<UndoableState<TState>>) => void;
  getSelectors: <V>(
    selectState: (state: V) => UndoableState<TState>
  ) => UndoableSelector<TState, V>;
};

const createUndoableAdapter = <TState>(
  initialState: TState
): UndoableAdapter<TState> => {
  return {
    getInitialState: () => ({
      current: initialState,
      previous: undefined,
    }),
    update: (state, update) => {
      state.current = {
        ...state.current,
        ...update,
      };
    },
    commit: (state) => {
      state.previous = state.current;
    },
    rollback: (state) => {
      if (!state.previous) return;
      state.current = state.previous;
    },
    getSelectors: (selectState) => ({
      value: (state) => selectState(state).current,
    }),
  };
};

export default createUndoableAdapter;
