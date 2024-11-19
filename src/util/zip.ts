const zip = <A, B>(as: A[], bs: B[]): [A, B][] => {
  const result: [A, B][] = [];
  for (let i = 0; i < as.length && i < bs.length; i++) {
    result.push([as[i], bs[i]]);
  }

  return result;
};

export default zip;
