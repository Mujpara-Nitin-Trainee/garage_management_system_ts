const callAPI = async (
  endpoint,
  body = {},
  method = "GET",
  formData = false
) => {
  let data = await fetch(
    endpoint,
    method != "GET"
      ? {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      : {}
  );
  try {
    let jsonData = data.json();
    return jsonData;
  } catch (error) {
    return error;
  }
};
const callApiWithFormData = async ({ endpoint, body, method = "POST" }) => {
  let response = await fetch(endpoint, {
    method,
    body,
  });
  return await response.json();
};
