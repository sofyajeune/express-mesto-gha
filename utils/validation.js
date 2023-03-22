// eslint-disable-next-line no-useless-escape
const validationUrl = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?/i;

const validationId = /[0-9a-f]{24}/i;

module.exports = {
  validationUrl,
  validationId,
};
