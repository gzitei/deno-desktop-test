export const getEnumKeyByValue = <T extends object>(
  enumObject: T,
  value: string,
): keyof T | undefined => {
  return (Object.keys(enumObject) as Array<keyof T>).find(
    (key) => enumObject[key] === value,
  )
}
