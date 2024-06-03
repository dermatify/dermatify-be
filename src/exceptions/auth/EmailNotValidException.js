class EmailInvalidError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailInvalidError";
  }
}
