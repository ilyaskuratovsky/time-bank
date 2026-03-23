export default function nullthrows(
  value: any | null | undefined,
  description: string = "",
): any {
  if (value === null || value === undefined) {
    throw new Error(`Value is null: ${description}`);
  }
  return value;
}
