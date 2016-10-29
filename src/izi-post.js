const json = response => response.json()

export default (url, body) => {
  return fetch(url, { 
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'no-cors',
    body: JSON.stringify(body)
  })
  .then(json)
  .catch(function (error) {
    console.error('Request failed: \n', error)
  })
}
