export function handleError(
  fn: (...args: unknown[]) => unknown,
  defaultErrorMessage = "An error has occurred, check your inputs and try again"
) {
  try {
    fn();
  } catch (error) {
    console.log(
      error instanceof Error ? error.toString() : defaultErrorMessage
    );
  }
}
