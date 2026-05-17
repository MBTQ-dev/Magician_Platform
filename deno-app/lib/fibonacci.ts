/**
 * Calculate a trust score using a Fibonacci-like algorithm.
 * The trust score grows exponentially based on user activity count,
 * following the Fibonacci sequence pattern for balanced growth.
 * 
 * @param n - The count of user activities (messages, contributions, etc.)
 * @returns A trust score based on the Fibonacci sequence
 */
export function getTrustScore(n: number) {
  // Maximum iterations to prevent overflow for large activity counts
  const MAX_FIBONACCI_ITERATIONS = 50;
  
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0, b = 1;
  for (let i = 2; i <= Math.min(n, MAX_FIBONACCI_ITERATIONS); i++) {
    const c = a + b;
    a = b;
    b = c;
  }

  return b;
}
