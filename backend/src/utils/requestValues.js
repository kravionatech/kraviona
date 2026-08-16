export const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object || {}, key);

export const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
  return fallback;
};

export const mergeNestedFields = (current, changes, fields) => {
  const merged = { ...(current || {}), ...(changes || {}) };

  for (const field of fields) {
    if (changes?.[field] === undefined) continue;
    merged[field] = {
      ...(current?.[field] || {}),
      ...(changes[field] || {}),
    };
  }

  return merged;
};
