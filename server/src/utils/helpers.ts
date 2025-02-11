export const isValidUrl = (url: string): boolean => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url);
