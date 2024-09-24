export interface PaginatedResult<T> {
  data: T[];
  first: string | null;
  last: string | null;
  hasMore: boolean;
}

export function paginate<T extends Record<K, string>, K extends keyof T>(
  data: T[],
  cursorKey: K,
  cursor?: string,
  take: number = 5,
): PaginatedResult<T> {
  const absTake = Math.abs(take);
  let sliceArr =
    take > 0 ? [0, take] : [Math.max(data.length - absTake, 0), data.length];

  if (take === 0) throw new Error("take must not be 0");

  if (cursor) {
    const cursorIndex = data.findIndex((item) => item[cursorKey] === cursor);
    sliceArr =
      take > 0
        ? [cursorIndex + 1, cursorIndex + 1 + absTake]
        : [Math.max(cursorIndex - absTake, 0), cursorIndex];
  }

  const [sliceStart, sliceEnd] = sliceArr;

  const paginatedData = data.slice(sliceStart, sliceEnd);

  return {
    data: paginatedData,
    first: data[sliceStart][cursorKey],
    last: sliceEnd < data.length ? data[sliceEnd - 1][cursorKey] : null,
    hasMore: sliceEnd < data.length,
  };
}
