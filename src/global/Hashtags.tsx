export const ArrayToAppSelect = (arr) =>
  arr?.length && arr?.length>=1
    ? arr.map((val) => ({ value: String(val), label: String(val) }))
    : [];
