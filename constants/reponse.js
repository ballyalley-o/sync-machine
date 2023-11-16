const RESPONSE = {
  iniSimulation: 'Ready for Simulation.',
  noChanges: 'No changes found',
  success: {
    200: 'OK: Request granted',
    201: 'CREATED: Request created',
    normalized: (word, result) => ` Normalized ${word} to ${result} `,
    204: 'NO CONTENT: The server successfully processed the request but there is no content to send in the response.'
  },
  error: {
    400: 'BAD REQUEST: Client request is Invalid',
    401: 'UNAUTHORIZED: Request cannot be granted unless Client is Authenticated',
    403: 'FORBIDDEN: Necessary permissions is required to access the Requested Resource',
    404: 'NOT FOUND: Resource requested cannot be found',
    422: 'UNPROCESSABLE ENTITY: The data submitted in a form is in the wrong format or is missing required fields',
    429: 'REQUEST OVERLOAD: Throttling limit exceeded for an API',
    500: 'INTERNAL SERVER ERROR: Server encountered an Unhandled Exception',
    503: 'SERVICE UNAVAILABLE: The server is temporarily unable to handle the Request',
    504: 'GATEWAY TIMEOUT: The server acting as a gateway did not receive a timely response from an upstream server',
    userProfile404: (userProfile) => `${userProfile} NOT FOUND`,
    failedNormalize: (word) => `Failed to normalize ${word}`,
    underScoreIndex: 'Underscore index Not Found'
  }
}


module.exports = RESPONSE