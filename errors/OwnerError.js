class OwnerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OwnerError';
    this.statusCode = 403;
  }
}

module.exports = OwnerError;
