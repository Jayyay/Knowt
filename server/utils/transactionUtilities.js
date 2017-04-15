const transactionUtils = {
  abort(message) {
    throw new Error(message);
  },
};

module.exports = transactionUtils;
