/**
 * Database operation retry utility
 * Handles transient connection failures with exponential backoff
 */

export const executeWithRetry = async (
    pool,
    query,
    params = [],
    maxRetries = 3,
    initialDelayMs = 100
) => {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await pool.execute(query, params);
        } catch (error) {
            lastError = error;
            
            // Don't retry on certain errors
            if (
                error.code === 'ER_NO_SUCH_TABLE' ||
                error.code === 'ER_BAD_FIELD_ERROR' ||
                error.code === 'ER_PARSE_ERROR' ||
                error.code === 'ER_ACCESS_DENIED_ERROR'
            ) {
                throw error; // Don't retry on these
            }
            
            // Retry on connection errors
            if (
                error.code === 'ECONNRESET' ||
                error.code === 'ECONNREFUSED' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'PROTOCOL_CONNECTION_LOST' ||
                error.code === 'PROTOCOL_ERROR'
            ) {
                const delayMs = initialDelayMs * Math.pow(2, attempt);
                console.log(
                    `Database connection error (${error.code}). Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`
                );
                
                if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }
            }
            
            // If not a connection error or final attempt, throw
            throw error;
        }
    }
    
    throw lastError;
};

export default executeWithRetry;

// dbretry.js is specifically a "retry on transient connection problems, fail fast on everything else" wrapper.
//  It doesn't catch/handle/suppress errors in general — if a query ultimately fails (after retries or because it's not retriable), the error still gets thrown back to your calling code,
//   and you still need a try/catch wherever you call executeWithRetry.
// So to be precise: it doesn't "handle" errors in the sense of making them go away — it decides whether to retry
//  before re-throwing, for a specific subset of connection-related error codes.
