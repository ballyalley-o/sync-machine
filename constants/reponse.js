const RESPONSE = {
  iniSimulation: 'Ready for Simulation',
  noChanges: 'No changes found',
  exists: (data) => `${data} already exists`,
  dbSaved: (data) => `new ${data} has been saved to the database`,
  success: {
    200: 'OK: Request fetched',
    201: 'CREATED: Request created',
    normalized: (word, result) => ` Normalized ${word} to ${result} `,
    204: 'NO CONTENT: The server successfully processed the request but there is no content to send in the response.',
    file200: (file) => `OK: File: ${file}`,
    profile201: (length) => `CREATED: Profile ${length}`,
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
    underScoreIndex: 'Underscore index Not Found',
    file404: (type, ext) => `No ${type + ext} file found in the folder.`,
    parseErr: (err) => `Error parsing JSON: ${err}`,
  },
}

module.exports = RESPONSE
