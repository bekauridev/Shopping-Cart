// /**
//  *
//  * @param {String} url
//  * @param {[string, string][]} params
//  * @param {[string, string][]} headers
//  * @returns
//  */
// async function getData(url, params = [], headers = []) {
//   const fullUrl = new URL(url);
//   if (params.length) {
//     params.forEach((param) => {
//       const [key, value] = param;
//       fullUrl.searchParams.append(key, value);
//     });
//   }
//   const response = await fetch(fullUrl.toString());
//   if (response.ok) {
//     const data = await response.json();
//     return data;
//   } else return null;
// }

// async function postData(url, data, headers = null) {
//   const response = await fetch(url, {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response;
// }

// async function putData(url, data, headers = null) {
//   const response = await fetch(url, {
//     method: "PUT",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response;
// }

// async function deleteData(url, headers = null) {
//   const response = await fetch(url, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response;
// }

// export { getData, postData, putData, deleteData };

// !! V2 - with comments

/**
 * Fetch data from a given URL with optional query parameters and headers.
 * @param {String} url - The URL to fetch data from.
 * @param {[string, string][]} params - Optional array of query parameters as [key, value] pairs.
 * @param {[string, string][]} headers - Optional array of headers as [key, value] pairs.
 * @returns {Object|null} - Returns the fetched data as an object if the request is successful, otherwise returns null.
 */
async function getData(url, params = [], headers = []) {
  const fullUrl = new URL(url); // Create a URL object from the given url string
  if (params.length) {
    params.forEach((param) => {
      const [key, value] = param;
      fullUrl.searchParams.append(key, value); // Append each query parameter to the URL
    });
  }
  const response = await fetch(fullUrl.toString()); // Perform a GET request to the constructed URL
  if (response.ok) {
    const data = await response.json(); // Parse the response as JSON if the request is successful
    return data;
  } else return null; // Return null if the request is not successful
}

/**
 * Send a POST request to a given URL with provided data and optional headers.
 * @param {String} url - The URL to send the POST request to.
 * @param {Object} data - The data to be sent in the request body.
 * @param {[string, string][]} headers - Optional array of headers as [key, value] pairs.
 * @returns {Response} - The response object from the fetch request.
 */
async function postData(url, data, headers = null) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data), // Convert data to JSON string
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

/**
 * Send a PUT request to a given URL with provided data and optional headers.
 * @param {String} url - The URL to send the PUT request to.
 * @param {Object} data - The data to be sent in the request body.
 * @param {[string, string][]} headers - Optional array of headers as [key, value] pairs.
 * @returns {Response} - The response object from the fetch request.
 */
async function putData(url, data, headers = null) {
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data), // Convert data to JSON string
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

/**
 * Send a DELETE request to a given URL with optional headers.
 * @param {String} url - The URL to send the DELETE request to.
 * @param {[string, string][]} headers - Optional array of headers as [key, value] pairs.
 * @returns {Response} - The response object from the fetch request.
 */
async function deleteData(url, headers = null) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export { getData, postData, putData, deleteData };
