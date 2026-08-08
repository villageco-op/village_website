/**
 * Custom error class defining the error recieved in backend responses.
 */
export class ApiError extends Error {
  status: number;
  data: { error: string };

  /**
   * Constructor for setting the error name, status, and data fields.
   * @param status - The response status
   * @param data - The response data
   * @param data.error - The error message
   */
  constructor(status: number, data: { error: string }) {
    super(data.error || `HTTP Error ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
