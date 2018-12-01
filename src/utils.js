// Utils methods to use across our app

export function _getJSONOrLogError(response) {
  if (response.ok) return response.json();
  console.log('Error ' + response.statusText);
}
