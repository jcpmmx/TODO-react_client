// Utils methods to use across our app


export function getJSONOrLogError(response) {
  if (!response) return null;
  if (!response.ok) {
    throw Error('Server error: ' + response.text());
  }
  return response.text().then(function(text) {
    return text ? JSON.parse(text) : {};
  });
};
