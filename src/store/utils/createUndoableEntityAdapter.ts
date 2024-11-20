import {
  createEntityAdapter,
  EntityId,
  EntityState,
  Update,
} from '@reduxjs/toolkit';
import createUndoableAdapter, { UndoableState } from './createUndoableAdapter';

export type UndoableEntityState<Entity, Id extends EntityId> = UndoableState<
  EntityState<Entity, Id>
>;

const createUndoableEntityAdapter = <Entity, Id extends EntityId>(
  options: Parameters<typeof createEntityAdapter<Entity, Id>>[0]
) => {
  const entityAdapter = createEntityAdapter<Entity, Id>(options);
  const undoableAdapter = createUndoableAdapter(
    entityAdapter.getInitialState()
  );

  return {
    ...entityAdapter,
    ...undoableAdapter,
    addOne: (state: UndoableEntityState<Entity, Id>, entity: Entity) => {
      entityAdapter.addOne(state.current, entity);
    },
    addMany: (state: UndoableEntityState<Entity, Id>, entities: Entity[]) => {
      entityAdapter.addMany(state.current, entities);
    },
    setAll: (state: UndoableEntityState<Entity, Id>, entities: Entity[]) => {
      entityAdapter.setAll(state.current, entities);
    },
    removeOne: (state: UndoableEntityState<Entity, Id>, id: Id) => {
      entityAdapter.removeOne(state.current, id);
    },
    removeMany: (state: UndoableEntityState<Entity, Id>, ids: Id[]) => {
      entityAdapter.removeMany(state.current, ids);
    },
    removeAll: (state: UndoableEntityState<Entity, Id>) => {
      entityAdapter.removeAll(state.current);
    },
    updateOne: (
      state: UndoableEntityState<Entity, Id>,
      update: Update<Entity, Id>
    ) => {
      entityAdapter.updateOne(state.current, update);
    },
    updateMany: (
      state: UndoableEntityState<Entity, Id>,
      updates: Update<Entity, Id>[]
    ) => {
      entityAdapter.updateMany(state.current, updates);
    },
    upsertOne: (state: UndoableEntityState<Entity, Id>, entity: Entity) => {
      entityAdapter.upsertOne(state.current, entity);
    },
    upsertMany: (
      state: UndoableEntityState<Entity, Id>,
      entities: Entity[]
    ) => {
      entityAdapter.upsertMany(state.current, entities);
    },
    getSelectors: <V>(
      selectState: (state: V) => UndoableEntityState<Entity, Id>
    ) => {
      const wrapped = (state: V) =>
        undoableAdapter.getSelectors(selectState).value(state);
      return {
        selectIds: (state: V) =>
          entityAdapter.getSelectors().selectIds(wrapped(state)),
        selectEntities: (state: V) =>
          entityAdapter.getSelectors().selectEntities(wrapped(state)),
        selectAll: (state: V) =>
          entityAdapter.getSelectors().selectAll(wrapped(state)),
        selectTotal: (state: V) =>
          entityAdapter.getSelectors().selectTotal(wrapped(state)),
        selectById: (state: V, id: Id) =>
          entityAdapter.getSelectors().selectById(wrapped(state), id),
      };
    },
  };
};

export default createUndoableEntityAdapter;
