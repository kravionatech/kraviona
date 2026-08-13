const jsonText = (data) => JSON.stringify(data, null, 2);

const normalize = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, entry) => {
      if (entry?._bsontype === "ObjectId") return entry.toString();
      return entry;
    }),
  );

export const successResult = (data, summary = "Admin operation completed") => {
  const structuredContent = normalize(data);
  return {
    content: [
      {
        type: "text",
        text: `## ${summary}\n\n\`\`\`json\n${jsonText(structuredContent)}\n\`\`\``,
      },
    ],
    structuredContent,
  };
};

export const errorResult = (message, details) => {
  const payload = {
    success: false,
    error: message || "Unknown MCP server error",
  };
  if (details?.length) payload.details = details;

  return {
    isError: true,
    content: [
      {
        type: "text",
        text: `## Admin operation failed\n\n${payload.error}${
          payload.details?.length
            ? `\n\n- ${payload.details.join("\n- ")}`
            : ""
        }`,
      },
    ],
    structuredContent: payload,
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
