/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

const after = (
  asyncFn: () => Promise<any>,
  errorHandler?: (error: Error) => void,
): void => {
  asyncFn().catch((error) => {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error("Background task error:", error);
    }
  });
};

export default after;
