const zip = <A, B>(as: A[], bs: B[]): [A, B][] => as.map((a, i) => [a, bs[i]]);

export default zip;
