export const capitalize = (str: string) => {
  if (!str) return '';
  const trimmedStr = String(str).trim().toLowerCase();
  
  return trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1);
};
