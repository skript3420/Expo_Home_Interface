export function blockPending<T extends (...args: any[]) => Promise<any>>(
  func: T
): (...args: Parameters<T>) => void {
  let isRequestActive = false;

  return function (this: any, ...args: Parameters<T>) {
    if (isRequestActive) {
      return; // Ignore call if a request is already in flight
    }

    isRequestActive = true;

    // Execute the function and unlock only when it finishes (success or failure)
    func.apply(this, args).finally(() => {
      isRequestActive = false;
    });
  };
}