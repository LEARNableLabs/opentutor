/**
 * The request was wrong, not the server: a bad id, a duplicate, an unknown
 * student, an invalid topic. Routes answer `.status` with the message. Only
 * errors thrown as this are shown to the caller; any other error gets the
 * route's generic answer, however its text reads (#144).
 */
export class RequestError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
