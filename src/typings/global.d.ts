type ObjectWith<PropKey extends string, T> = {
  [key: string]: unknown;
} & {
  [K in PropKey]?: T;
};
