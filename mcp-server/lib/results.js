  const jsonText = (data) => JSON.stringify(data, null, 2);

export const successResult = (data) => ({
  content: [{ type: "text", text: jsonText(data) }],
});

export const errorResult = (message, details) => {
  const payload = {
    success: false,
    error: message || "Unknown MCP server error",
  };
  if (details?.length) payload.details = details;

  return {
    isError: true,
    content: [{ type: "text", text: jsonText(payload) }],
  };
};

export const errorResultFrom = (error) => {
  if (error?.name === "ValidationError") {
    const details = Object.values(error.errors || {}).map(
      (validationError) => validationError.message,
    );
    return errorResult(details[0] || error.message, details);
  }

  if (error?.code === 11000) {
    const field =
      Object.keys(error.keyValue || error.keyPattern || {})[0] || "value";
    return errorResult(`${field} already exists`);
  }

  if (error?.name === "CastError") {
    return errorResult(`Invalid ${error.path}: ${error.value}`);
  }

  return errorResult(error?.message || "Unexpected MCP server error");
};
