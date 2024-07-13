import { isValidJSON } from "./helpers.js";

// Function to insert a document into a collection in localStorage
function insert(collection, document) {
  // Check if the collection already exists in localStorage
  if (localStorage.hasOwnProperty(collection)) {
    const data = localStorage.getItem(collection);
    // Check if the existing data is valid JSON
    if (data && isValidJSON(data)) {
      const parsedData = JSON.parse(data);
      // If parsedData is an array, push the new document
      if (Array.isArray(parsedData)) {
        parsedData.push(document);
        localStorage.setItem(collection, JSON.stringify(parsedData));
      } else {
        // If not an array, overwrite with a new array containing the document
        localStorage.setItem(collection, JSON.stringify([document]));
      }
    } else {
      // If data is not valid JSON, overwrite with a new array containing the document
      localStorage.setItem(collection, JSON.stringify([document]));
    }
  } else {
    // If collection doesn't exist, create a new array with the document
    localStorage.setItem(collection, JSON.stringify([document]));
  }
}

// Function to remove a document from a collection in localStorage by ID
function remove(collection, id) {
  if (localStorage.hasOwnProperty(collection)) {
    const data = localStorage.getItem(collection);
    if (data && isValidJSON(data)) {
      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData)) {
        // Filter out the document with the matching ID
        const updatedData = parsedData.filter((doc) => doc.id !== id);
        localStorage.setItem(collection, JSON.stringify(updatedData));
      } else {
        // If not an array, set an empty array
        localStorage.setItem(collection, JSON.stringify([]));
      }
    } else {
      // If data is not valid JSON, set an empty array
      localStorage.setItem(collection, JSON.stringify([]));
    }
  } else {
    // If collection doesn't exist, set an empty array
    localStorage.setItem(collection, JSON.stringify([]));
  }
}

// Function to update a document in a collection in localStorage by ID
function update(collection, id, document) {
  if (localStorage.hasOwnProperty(collection)) {
    const data = localStorage.getItem(collection);
    if (data && isValidJSON(data)) {
      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData)) {
        // Map through the array and update the document with matching ID
        const updatedData = parsedData.map((doc) => (doc.id === id ? document : doc));
        localStorage.setItem(collection, JSON.stringify(updatedData));
      } else {
        // If not an array, set an empty array
        localStorage.setItem(collection, JSON.stringify([]));
      }
    } else {
      // If data is not valid JSON, set an empty array
      localStorage.setItem(collection, JSON.stringify([]));
    }
  } else {
    // If collection doesn't exist, set an empty array
    localStorage.setItem(collection, JSON.stringify([]));
  }
}

// Function to select all documents from a collection in localStorage
function select(collection) {
  if (localStorage.hasOwnProperty(collection)) {
    const data = localStorage.getItem(collection);
    if (data && isValidJSON(data)) {
      const parsedData = JSON.parse(data);
      // Return the parsed data if it's an array, otherwise return an empty array
      return Array.isArray(parsedData) ? parsedData : [];
    } else {
      // If data is not valid JSON, set an empty array and return it
      localStorage.setItem(collection, JSON.stringify([]));
      return [];
    }
  } else {
    // If collection doesn't exist, set an empty array and return it
    localStorage.setItem(collection, JSON.stringify([]));
    return [];
  }
}

// Exporting functions for use in other modules
export { insert, select, remove, update };
