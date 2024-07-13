// Function to get an element by its ID from the DOM
function getById(id) {
  return document.getElementById(id);
}

// Function to check if a string is valid JSON
function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to generate an array of numbers in a specified range
function range(start, end) {
  const numbers = [];
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }
  return numbers;
}

// Function to render HTML content into a DOM element
function render(element, content) {
  element.innerHTML = content;
}

// Exporting functions for use in other modules
export { getById, isValidJSON, range, render };
