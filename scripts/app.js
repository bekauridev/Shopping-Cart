// import { API_BASE_URL, PRE_PAGE } from "./config.js";
// import { getData } from "./api.js";
// import { render } from "./helpers.js";
// import { sortedByProperty, renderProducts, generatePages } from "./functions.js";
// import {
//   _Col,
//   ProductComponent,
//   OptionComponent,
//   AvatarComponent,
//   AuthComponent,
//   PanelSettingsComponent,
// } from "./components.js";
// import {
//   productsRow,
//   categoryDropdown,
//   propertyDropdown,
//   orderDropdown,
//   searchForm,
//   adminPanel,
//   panelSettings,
// } from "./dom.js";

// window.addEventListener("load", async () => {
//   // TODO: Check User Authorization
//   if (localStorage.hasOwnProperty("session")) {
//     const user = JSON.parse(localStorage.getItem("session"));
//     render(panelSettings, PanelSettingsComponent({ user }));
//   } else {
//     render(adminPanel, AuthComponent(null));
//   }

//   // TODO: Get Product List With limit
//   const fullUrl = [API_BASE_URL, "products"].join("/");
//   const queryParams = [
//     ["skip", 0],
//     ["limit", 0],
//   ];
//   const data = await getData(fullUrl, queryParams);
//   const { products } = data;
//   localStorage.setItem("display", JSON.stringify(products));
//   renderProducts(products.slice(0, PRE_PAGE));

//   // TODO: Get Category List
//   const categoryUrl = [API_BASE_URL, "products", "categories"].join("/");
//   const categories = await getData(categoryUrl);
//   const categoryOptionsList = categories
//     .map(({ slug, name }) => OptionComponent({ value: slug, text: name }))
//     .join("");
//   render(categoryDropdown, categoryOptionsList);

//   // TODO: Generate Pagination Pages
//   generatePages();
// });

// categoryDropdown.addEventListener("change", async (e) => {
//   const category = e.target.value;
//   const fullUrl = [API_BASE_URL, "products", "category", category].join("/");
//   const data = await getData(fullUrl);
//   const { products } = data;
//   localStorage.setItem("display", JSON.stringify(products));
//   renderProducts(products.slice(0, PRE_PAGE));
//   // TODO: Generate Pagination Pages
//   generatePages();
// });

// propertyDropdown.addEventListener("change", async (e) => {
//   await sortedByProperty(
//     categoryDropdown.value,
//     propertyDropdown.value,
//     orderDropdown.value
//   );
// });

// orderDropdown.addEventListener("change", async (e) => {
//   await sortedByProperty(
//     categoryDropdown.value,
//     propertyDropdown.value,
//     orderDropdown.value
//   );
// });

// searchForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const fullUrl = [API_BASE_URL, "products", "search"].join("/");
//   const search = e.target.search.value.trim();
//   const queryParams = [["q", search]];
//   const data = await getData(fullUrl, queryParams);
//   const { products } = data;
//   localStorage.setItem("display", JSON.stringify(products));
//   renderProducts(products.slice(0, PRE_PAGE));
//   // TODO: Generate Pagination Pages
//   generatePages();
// });

// !! V2 - with comments

import { API_BASE_URL, PRE_PAGE } from "./config.js";
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
  searchForm,
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
  renderProducts(products.slice(0, PRE_PAGE)); // Render the first page of products

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
  renderProducts(products.slice(0, PRE_PAGE)); // Render the first page of products
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

// Add event listener for search form submit event
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  const fullUrl = [API_BASE_URL, "products", "search"].join("/"); // Construct the URL for searching products
  const search = e.target.search.value.trim(); // Get the search query value
  const queryParams = [["q", search]]; // Create the query parameters for the search
  const data = await getData(fullUrl, queryParams); // Fetch the search results
  const { products } = data; // Destructure products from the fetched data
  localStorage.setItem("display", JSON.stringify(products)); // Store products in localStorage
  renderProducts(products.slice(0, PRE_PAGE)); // Render the first page of products
  // TODO: Generate Pagination Pages
  generatePages(); // Generate pagination pages based on the search results
});
