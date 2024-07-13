import { API_BASE_URL } from "./config.js";
import { getData } from "./api.js";
import { render } from "./helpers.js";
import { sortedByProperty, renderProducts, generatePages } from "./functions.js";
import {
  _Col,
  OptionComponent,
  AuthComponent,
  PanelSettingsComponent,
} from "./components.js";
import {
  productsRow,
  categoryDropdown,
  propertyDropdown,
  orderDropdown,
  adminPanel,
  panelSettings,
} from "./dom.js";

// Add event listener for the window load event
window.addEventListener("load", async () => {
  // TODO: Check User Authorization
  if (localStorage.hasOwnProperty("session")) {
    // Check if the user is authenticated
    const user = JSON.parse(localStorage.getItem("session")); // Retrieve user data from localStorage
    render(panelSettings, PanelSettingsComponent({ user })); // Render user settings panel
  } else {
    render(adminPanel, AuthComponent(null)); // Render authentication panel if user is not authenticated
  }

  // TODO: Get Product List With limit
  const fullUrl = [API_BASE_URL, "products"].join("/"); // Construct the full URL for fetching products
  const queryParams = [
    ["skip", 0], // Skip 0 items
    ["limit", 0], // Limit to 0 items (no limit)
  ];
  const data = await getData(fullUrl, queryParams); // Fetch the product data
  const { products } = data; // Destructure products from the fetched data
  localStorage.setItem("display", JSON.stringify(products)); // Store products in localStorage
  // renderProducts(products.slice(0, PRE_PAGE)); // Render the first page of products
  renderProducts(products); // Render the first page of products

  // TODO: Get Category List
  const categoryUrl = [API_BASE_URL, "products", "categories"].join("/"); // Construct the URL for fetching categories
  const categories = await getData(categoryUrl); // Fetch the category data
  const categoryOptionsList = categories
    .map(({ slug, name }) => OptionComponent({ value: slug, text: name })) // Map categories to option components
    .join(""); // Join the option components into a single string
  render(categoryDropdown, categoryOptionsList); // Render the category dropdown options

  // TODO: Generate Pagination Pages
  generatePages(); // Generate pagination pages based on the product data
});

// Add event listener for category dropdown change event
categoryDropdown.addEventListener("change", async (e) => {
  const category = e.target.value; // Get the selected category
  const fullUrl = [API_BASE_URL, "products", "category", category].join("/"); // Construct the URL for fetching products by category
  const data = await getData(fullUrl); // Fetch the product data for the selected category
  const { products } = data; // Destructure products from the fetched data
  localStorage.setItem("display", JSON.stringify(products)); // Store products in localStorage
  // renderProducts(products.slice(0, PRE_PAGE)); // Render the first page of products
  renderProducts(products); // Render the first page of products
  // TODO: Generate Pagination Pages
  generatePages(); // Generate pagination pages based on the filtered product data
});

// Add event listener for property dropdown change event
propertyDropdown.addEventListener("change", async (e) => {
  await sortedByProperty(
    categoryDropdown.value, // Get the selected category value
    propertyDropdown.value, // Get the selected property value
    orderDropdown.value // Get the selected order value
  );
});

// Add event listener for order dropdown change event
orderDropdown.addEventListener("change", async (e) => {
  await sortedByProperty(
    categoryDropdown.value, // Get the selected category value
    propertyDropdown.value, // Get the selected property value
    orderDropdown.value // Get the selected order value
  );
});
