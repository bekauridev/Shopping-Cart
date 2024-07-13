import { API_BASE_URL } from "./config.js";
import { render, getById, range } from "./helpers.js";
import { modalDialogBox } from "./utils.js";
import { getData } from "./api.js";
import { productsRow, modalDialog, userDialogBox, pagination } from "./dom.js";
import {
  _Col,
  AlertComponent,
  ProductComponent,
  SingleProductComponent,
  ProductRowComponent,
  ProductRowFooterComponent,
  // PaginateComponent,
} from "./components.js";

import { select, insert, update } from "./storage.js";

// Function to fetch and display products sorted by given property and order
async function sortedByProperty(category, property, order) {
  const fullUrl = [API_BASE_URL, "products", "category", category].join("/");
  const queryParams = [
    ["sortBy", property],
    ["order", order],
  ];
  const data = await getData(fullUrl, queryParams);
  const { products } = data;
  renderProducts(products);
}

// Function to render products into the products row
function renderProducts(products) {
  const productsLayout = products
    .map((product) => ProductComponent(product))
    .map((product) =>
      _Col({ content: product, classes: ["col-lg-4", "col-md-6", "mb-4"] })
    )
    .join("");
  render(productsRow, productsLayout);
}

// Function to show detailed product information in a modal dialog
async function showProductDetails(e) {
  const productId = e.dataset.id;
  const fullUrl = [API_BASE_URL, "products", productId].join("/");
  const product = await getData(fullUrl);
  const productDetails = SingleProductComponent(product);
  const modalBody = modalDialog.querySelector(".modal-body");
  const modalTitle = modalDialog.querySelector(".modal-title");
  render(modalBody, productDetails);
  render(modalTitle, product.title);
  modalDialogBox.show();
}

// Function to change the thumbnail image of a product
function changeThumbnail(e) {
  const { productId } = e.dataset;
  const component = getById(["single", productId].join("-"));
  const thumbnail = component.querySelector(`[data-image="main"]`);
  thumbnail.setAttribute("src", e.getAttribute("src"));
}

// !! shopping cart related
// Function to add a product to the user's cart
async function addCart(e) {
  const { id } = e.dataset;
  const userId = JSON.parse(localStorage.getItem("session")).id;
  const carts = select("carts");
  const userCart = carts.find((cart) => cart.userId === userId);

  if (userCart) {
    const cartProduct = userCart.products.find((product) => product.id === Number(id));

    if (cartProduct) {
      const updatedUserCart = {
        ...userCart,
        products: userCart.products.map((product) =>
          product.id === Number(id)
            ? { ...product, quantity: product.quantity + 1 }
            : product
        ),
      };
      update("carts", updatedUserCart.id, updatedUserCart);
    } else {
      const fullUrl = [API_BASE_URL, "products", id].join("/");
      const product = await getData(fullUrl);
      const cartProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        brand: product.brand,
        category: product.category,
        thumbnail: product.thumbnail,
        quantity: 1,
      };
      const updatedUserCart = {
        ...userCart,
        products: [...userCart.products, cartProduct],
      };
      update("carts", updatedUserCart.id, updatedUserCart);
    }
  } else {
    const fullUrl = [API_BASE_URL, "products", id].join("/");
    const product = await getData(fullUrl);
    const cartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      brand: product.brand,
      category: product.category,
      thumbnail: product.thumbnail,
      quantity: 1,
    };
    const cart = {
      id: crypto.randomUUID(),
      products: [cartProduct],
      userId: userId,
    };
    insert("carts", cart);
  }
  showDialogMessages("success", "Product successfully added");
}

// Function to display user's cart products
function showUserCart(e) {
  showCartProducts(e);
}

// Function to display user's cart products in a modal dialog
function showCartProducts(e) {
  const { userId } = e.dataset;
  const carts = select("carts");
  const userCart = carts.find((cart) => cart.userId === userId);
  if (userCart) {
    const fullPrice = userCart.products.reduce((accumulator, product) => {
      return (accumulator += product.price * product.quantity);
    }, 0);

    const modalBody = modalDialog.querySelector(".modal-body");
    const modalTitle = modalDialog.querySelector(".modal-title");
    if (userCart.products.length <= 0)
      return render(
        modalBody,
        "<h6>Oops! Looks like your cart is empty. Let's fill it up with some amazing finds! </h6>"
      );

    const cartProductsLayout = userCart.products
      .map((product) => ProductRowComponent(product))
      .join("");

    render(
      modalBody,
      [cartProductsLayout, ProductRowFooterComponent({ userId, fullPrice })].join("")
    );
    render(modalTitle, `User Products List`);
    modalDialogBox.show();
  }
}

// Function to delete a product from the user's cart
function deleteProductFromCart(e) {
  if (confirm("Are you sure you want to delete this product?")) {
    const { productId } = e.dataset;
    const userId = JSON.parse(localStorage.getItem("session")).id;
    const carts = select("carts");
    const userCart = carts.find((cart) => cart.userId === userId);
    const updatedUserCart = {
      ...userCart,
      products: userCart.products.filter((product) => product.id !== Number(productId)),
    };
    update("carts", updatedUserCart.id, updatedUserCart);
    showCartProducts(e);
  }
}

// Function to increment the quantity of a product in the user's cart
function incrementProduct(e) {
  const { userId, productId } = e.dataset;
  const carts = select("carts");
  const userCart = carts.find((cart) => cart.userId === userId);
  const updatedUserCart = {
    ...userCart,
    products: userCart.products.map((product) =>
      product.id === Number(productId)
        ? { ...product, quantity: product.quantity + 1 }
        : product
    ),
  };
  update("carts", updatedUserCart.id, updatedUserCart);
  showCartProducts(e);
}

// Function to decrement the quantity of a product in the user's cart
function decrementProduct(e) {
  const { userId, productId } = e.dataset;
  const carts = select("carts");
  const userCart = carts.find((cart) => cart.userId === userId);
  const updatedUserCart = {
    ...userCart,
    products: userCart.products.map((product) =>
      product.id === Number(productId)
        ? { ...product, quantity: product.quantity - 1 }
        : product
    ),
  };
  update("carts", updatedUserCart.id, updatedUserCart);
  showCartProducts(e);
}

// Function to clear the user's cart
function clearCart(e) {
  if (confirm("Are you sure you want to clear your cart?")) {
    const { userId } = e.dataset;
    const carts = select("carts");
    const userCart = carts.find((cart) => cart.userId === userId);
    const updatedUserCart = {
      ...userCart,
      products: [],
    };
    update("carts", updatedUserCart.id, updatedUserCart);
    showCartProducts(e);
  }
}
// !!!!!!!!!!!!!!!!!

// Function to display alert messages in the user dialog box
function showDialogMessages(status, message) {
  render(userDialogBox, AlertComponent({ status, message }));
  setTimeout(() => {
    render(userDialogBox, "");
  }, 3000);
}

// !! pagination related
// const ListPagination = window.ListPagination;

// function generatePages() {
//   const options = {
//     valueNames: ["name"],
//     page: 3,
//     plugins: [
//       ListPagination({
//         preventPageJump: true,
//       }),
//     ],
//     pagination: {
//       innerWindow: 1,
//       outerWindow: 1,
//       left: 0,
//       right: 0,
//       paginationClass: "pagination",
//     },
//   };

//   const productsList = new List("test-list", options);

//   // Function to add event listeners to pagination links
//   function addPaginationEventListeners() {
//     document.querySelectorAll(".pagination a").forEach((anchor) => {
//       anchor.addEventListener("click", function (event) {
//         event.preventDefault();
//         console.log(event);
//       });
//     });
//   }

//   // Initial call to add event listeners
//   addPaginationEventListeners();

//   // Reapply event listeners after each List.js update
//   productsList.on("updated", addPaginationEventListeners);
// }
const ListPagination = window.ListPagination;

function generatePages() {
  const options = {
    valueNames: ["name"],
    page: 3,
    plugins: [
      ListPagination({
        preventPageJump: true,
      }),
    ],
    pagination: {
      innerWindow: 1,
      outerWindow: 1,
      left: 0,
      right: 0,
      paginationClass: "pagination",
    },
  };

  const productsList = new List("test-list", options);

  // Function to add event listeners to pagination links
  function addPaginationEventListeners() {
    document.querySelectorAll(".pagination a").forEach((anchor) => {
      anchor.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(event);
      });
    });
  }

  // Initial call to add event listeners
  addPaginationEventListeners();

  // Reapply event listeners after each List.js update
  productsList.on("updated", function () {
    addPaginationEventListeners();
  });
}
// !!!!!!!!!!!!!!!!!

// Function to render template components in the modal dialog
function renderTemplateComponent(e) {
  const { templateId, templateTitle } = e.dataset;
  const template = getById(templateId);
  const templateFragment = template.content.cloneNode(true);
  const modalBody = modalDialog.querySelector(".modal-body");
  const modalTitle = modalDialog.querySelector(".modal-title");
  render(modalTitle, templateTitle);
  modalBody.innerHTML = ""; // Clear inner content
  modalBody.appendChild(templateFragment);
  modalDialogBox.show();
}

// Function to handle user registration form submission
function registration(e) {
  e.preventDefault();
  const { email, password, re_password } = e.target;
  const errors = [];
  const emailPattern = /^.+@[^\.].*\.[a-z]{2,}$/;

  if (password.value.trim() !== re_password.value.trim()) {
    const errorMessage = "Passwords do not match";
    errors.push(errorMessage);
    password.classList.add("border-danger");
    render(password.nextElementSibling, errorMessage);
    render(re_password.nextElementSibling, errorMessage);
  }

  if (!emailPattern.test(email.value.trim())) {
    const errorMessage = "Invalid email address";
    errors.push(errorMessage);
    email.classList.add("border-danger");
    render(email.nextElementSibling, errorMessage);
  }

  if (!errors.length) {
    const user = {
      id: crypto.randomUUID(),
      email: email.value.trim(),
      password: password.value.trim(),
      created_at: new Date().getTime(),
    };
    insert("users", user);
    e.target.reset();
    modalDialogBox.hide();
    showDialogMessages("success", "Registration successful completed");
  }
}

// Function to handle user authorization form submission
function authorization(e) {
  e.preventDefault();
  const { email, password } = e.target;
  const users = select("users");
  const errorMessage = "user not found";
  const user = users.find(
    (user) => user.email === email.value.trim() && user.password === password.value.trim()
  );

  if (user) {
    delete user.password;
    localStorage.setItem("session", JSON.stringify(user));
    e.target.reset();
    modalDialogBox.hide();
    showDialogMessages("success", "Authorization successful completed");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
  if (!user) {
    render(password.nextElementSibling, errorMessage);
    render(email.nextElementSibling, errorMessage);
    email.classList.add("border-danger");
    password.classList.add("border-danger");
  }
}

// Function to handle user logout
function logout() {
  localStorage.removeItem("session");
  window.location.reload();
}

// Function to hide error messages on input fields
function hideErrorMessage(e) {
  e.classList.remove("border-danger");
  render(e.nextElementSibling, "");
}

// Exporting all functions
export {
  sortedByProperty,
  renderProducts,
  showProductDetails,
  changeThumbnail,
  addCart,
  showUserCart,
  deleteProductFromCart,
  incrementProduct,
  decrementProduct,
  clearCart,
  generatePages,
  // paginate,
  renderTemplateComponent,
  registration,
  authorization,
  logout,
  hideErrorMessage,
};
