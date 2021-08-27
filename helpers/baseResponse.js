exports.errorResponse = (msg) => {
  const errorMsg = new Error(msg);
  errorMsg.status = 200;
  return errorMsg;
};

exports.successResponse = (msg, payload = null) => {
  return {
    ErrorMessage: null,
    Success: true,
    Results: msg ? [{ message: msg, data: payload }] : payload,
  };
};
