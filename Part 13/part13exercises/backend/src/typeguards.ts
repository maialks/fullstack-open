import type { SequelizeValidationError, BlogI } from './types.js';

export const isSequelizeValidationError = function (
  error: unknown
): error is SequelizeValidationError {
  return !!(
    error &&
    typeof error === 'object' &&
    'name' in error &&
    'message' in error &&
    'SequelizeValidationError'
  );
};

export function isBlog(obj: any): obj is BlogI {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return 'title' in obj && 'author' in obj && 'url' in obj;
}
