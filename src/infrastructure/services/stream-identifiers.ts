export function createStableMatchIdentifier(
  prefix: "match" | "call",
  leftId: string,
  rightId: string,
) {
  const combinedIds = [leftId, rightId].sort().join("_");

  let hash = 0;
  for (let index = 0; index < combinedIds.length; index += 1) {
    const char = combinedIds.charCodeAt(index);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return `${prefix}_${Math.abs(hash).toString(36)}`;
}
