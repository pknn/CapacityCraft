// @ts-expect-error won't describe type
const historyMiddleware = (store) => (next) => (action) => {
  const previousState = store.getState();
  action.meta = {
    ...action.meta,
    previousState: {
      ...action.meta.previousState,
      [action.type]: previousState,
    },
  };
  return next(action);
};

export default historyMiddleware;
