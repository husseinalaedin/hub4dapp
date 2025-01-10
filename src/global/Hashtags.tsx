export const ArrayToAppSelect = (arr) =>
  arr?.length
    ? arr.map((val) => ({ value: String(val), label: String(val) }))
    : [];
