type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

function isObject(obj?: unknown): obj is object {
  return Boolean(obj) && (obj as object)?.constructor === Object;
}

function merge(target: Record<string, unknown>, source?: Record<string, unknown>) {
  const clone = { ...target } as Record<string, unknown>;
  if (!source) return clone;
  for (const key of Object.keys(source)) {
    if (isObject(source[key])) {
      clone[key] = merge(
        clone[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      clone[key] = source[key];
    }
  }

  return clone;
}

export default function objectBuilder<T>(defaultParameters: T) {
  return (overrideParameters?: DeepPartial<T> | null): T => {
    if (!overrideParameters) overrideParameters = {} as DeepPartial<T>;
    return merge(
      defaultParameters as Record<string, unknown>,
      overrideParameters as Record<string, unknown>
    ) as T;
  };
}
