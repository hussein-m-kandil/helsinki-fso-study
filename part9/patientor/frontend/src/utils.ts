import { isAxiosError } from 'axios';

export const logError = (error: unknown): void => {
  console.log(error instanceof Error ? error.toString() : error);
};

export const getApiErrorMessage = (
  error: unknown,
  defaultMessage: string
): string => {
  let errorMessage = '';
  if (isAxiosError(error) && error.response?.data?.error) {
    const apiError = error.response.data.error;
    if (typeof apiError === 'string') errorMessage = apiError;
    else if (typeof apiError === 'object') {
      const path =
        'path' in apiError && Array.isArray(apiError.path)
          ? `${apiError.path.join('/')}: `
          : '';
      if (
        ('message' in apiError && typeof apiError.message === 'string') ||
        apiError.member instanceof String
      ) {
        errorMessage = `${path?.toUpperCase() || ''}${apiError.message}`;
      }
    }
  }
  return errorMessage || defaultMessage;
};

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
