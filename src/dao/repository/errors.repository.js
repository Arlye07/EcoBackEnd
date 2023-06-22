const errorMessages = {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not found',
    500: 'Unexpected error X(',
    504: 'Service Unavailable'
  }
  
  class ErrorRepository extends Error {
    constructor(message, code) {
      super(message || errorMessages[code])
      this.code = code
    }
  }
  
  module.exports = ErrorRepository