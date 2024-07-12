// import { API_BASE_URL, PRE_PAGE } from "./config.js";
// import { render, getById, range } from "./helpers.js";
// import { modalDialogBox } from "./utils.js";
// import { getData } from "./api.js";
// import { productsRow, modalDialog, userDialogBox, pagination } from "./dom.js";
// import {
//   _Col,
//   AlertComponent,
//   ProductComponent,
//   SingleProductComponent,
//   ProductRowComponent,
//   ProductRowFooterComponent,
//   PaginateComponent,
// } from "./components.js";

// import { select, insert, update } from "./storage.js";

// async function sortedByProperty(category, property, order) {
//   const fullUrl = [API_BASE_URL, "products", "category", category].join("/");
//   const queryParams = [
//     ["sortBy", property],
//     ["order", order],
//   ];
//   const data = await getData(fullUrl, queryParams);
//   const { products } = data;
//   renderProducts(products);
// }

// function renderProducts(products) {
//   const productsLayout = products
//     .map((product) => ProductComponent(product))
//     .map((product) =>
//       _Col({ content: product, classes: ["col-lg-4", "col-md-6", "mb-4"] })
//     )
//     .join("");
//   render(productsRow, productsLayout);
// }

// async function showProductDetails(e) {
//   const productId = e.dataset.id;
//   const fullUrl = [API_BASE_URL, "products", productId].join("/");
//   const product = await getData(fullUrl);
//   const productDetails = SingleProductComponent(product);
//   const modalBody = modalDialog.querySelector(".modal-body");
//   const modalTitle = modalDialog.querySelector(".modal-title");
//   render(modalBody, productDetails);
//   render(modalTitle, product.title);
//   modalDialogBox.show();
//   // TODO: Render Product Details
// }

// function changeThumbnail(e) {
//   const { productId } = e.dataset;
//   const component = getById(["single", productId].join("-"));
//   const thumbnail = component.querySelector(`[data-image="main"]`);
//   thumbnail.setAttribute("src", e.getAttribute("src"));
//   // thumbnail.src = e.src;
// }

// async function addCart(e) {
//   const { id } = e.dataset;
//   const userId = JSON.parse(localStorage.getItem("session")).id;
//   const carts = select("carts");
//   const userCart = carts.find((cart) => cart.userId === userId);
//   if (userCart) {
//     // TODO: if existing User Cart
//     const cartProduct = userCart.products.find((product) => product.id === Number(id));
//     if (cartProduct) {
//       // TODO: if existing User Cart and Existing Product
//       const updatedUserCart = {
//         ...userCart,
//         products: userCart.products.map((product) =>
//           product.id === Number(id)
//             ? { ...product, quantity: product.quantity + 1 }
//             : product
//         ),
//       };
//       update("carts", updatedUserCart.id, updatedUserCart);
//     } else {
//       // TODO: if existing User Cart and not Existing Product
//       const fullUrl = [API_BASE_URL, "products", id].join("/");
//       const product = await getData(fullUrl);
//       const cartProduct = {
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         brand: product.brand,
//         category: product.category,
//         thumbnail: product.thumbnail,
//         quantity: 1,
//       };
//       const updatedUserCart = {
//         ...userCart,
//         products: [...userCart.products, cartProduct],
//       };
//       update("carts", updatedUserCart.id, updatedUserCart);
//     }
//   } else {
//     // TODO: if not existing User Cart
//     const fullUrl = [API_BASE_URL, "products", id].join("/");
//     const product = await getData(fullUrl);
//     const cartProduct = {
//       id: product.id,
//       title: product.title,
//       price: product.price,
//       brand: product.brand,
//       category: product.category,
//       thumbnail: product.thumbnail,
//       quantity: 1,
//     };
//     const cart = {
//       id: crypto.randomUUID(),
//       products: [cartProduct],
//       userId: userId,
//     };
//     insert("carts", cart);
//   }
//   showDialogMessages("success", "Product successfully added");
// }

// function showUserCart(e) {
//   showCartProducts(e);
// }

// function showCartProducts(e) {
//   const { userId } = e.dataset;
//   const carts = select("carts");
//   const userCart = carts.find((cart) => cart.userId === userId);
//   if (userCart) {
//     // TODO: if existing User Cart
//     const fullPrice = userCart.products.reduce((accumulator, product) => {
//       return (accumulator += product.price * product.quantity);
//     }, 0);
//     const cartProductsLayout = userCart.products
//       .map((product) => ProductRowComponent(product))
//       .join("");
//     const modalBody = modalDialog.querySelector(".modal-body");
//     const modalTitle = modalDialog.querySelector(".modal-title");
//     render(
//       modalBody,
//       [cartProductsLayout, ProductRowFooterComponent({ userId, fullPrice })].join("")
//     );
//     render(modalTitle, `User Products List`);
//     modalDialogBox.show();
//   }
// }

// function deleteProductFromCart(e) {
//   if (confirm("Are you sure you want to delete this product?")) {
//     const { productId } = e.dataset;
//     const userId = JSON.parse(localStorage.getItem("session")).id;
//     const carts = select("carts");
//     const userCart = carts.find((cart) => cart.userId === userId);
//     const updatedUserCart = {
//       ...userCart,
//       products: userCart.products.filter((product) => product.id !== Number(productId)),
//     };
//     update("carts", updatedUserCart.id, updatedUserCart);
//     showCartProducts(e);
//   }
// }

// function incrementProduct(e) {
//   const { userId, productId } = e.dataset;
//   const carts = select("carts");
//   const userCart = carts.find((cart) => cart.userId === userId);
//   const updatedUserCart = {
//     ...userCart,
//     products: userCart.products.map((product) =>
//       product.id === Number(productId)
//         ? { ...product, quantity: product.quantity + 1 }
//         : product
//     ),
//   };
//   update("carts", updatedUserCart.id, updatedUserCart);
//   showCartProducts(e);
// }

// function decrementProduct(e) {
//   const { userId, productId } = e.dataset;
//   const carts = select("carts");
//   const userCart = carts.find((cart) => cart.userId === userId);
//   const updatedUserCart = {
//     ...userCart,
//     products: userCart.products.map((product) =>
//       product.id === Number(productId)
//         ? { ...product, quantity: product.quantity - 1 }
//         : product
//     ),
//   };
//   update("carts", updatedUserCart.id, updatedUserCart);
//   showCartProducts(e);
// }

// function showDialogMessages(status, message) {
//   render(userDialogBox, AlertComponent({ status, message }));
//   setTimeout(() => {
//     render(userDialogBox, "");
//   }, 3000);
// }

// function clearCart(e) {
//   if (confirm("Are you sure you want to clear your cart?")) {
//     const { userId } = e.dataset;
//     const carts = select("carts");
//     const userCart = carts.find((cart) => cart.userId === userId);
//     const updatedUserCart = {
//       ...userCart,
//       products: [],
//     };
//     update("carts", updatedUserCart.id, updatedUserCart);
//     showCartProducts(e);
//   }
// }

// function generatePages() {
//   const display = select("display");
//   //TODO: Generate Pages List
//   const pages = Math.ceil(display.length / PRE_PAGE);
//   const pagesList = range(1, pages)
//     .map((page) => PaginateComponent({ page }))
//     .join("");
//   render(pagination, pagesList);
// }

// function paginate(e) {
//   const { page } = e.dataset;
//   const display = select("display");
//   const start = (Number(page) - 1) * PRE_PAGE;
//   const end = Number(page) * PRE_PAGE;
//   renderProducts(display.slice(start, end));
// }

// function renderTemplateComponent(e) {
//   const { templateId, templateTitle } = e.dataset;
//   const template = getById(templateId);
//   const templateFragment = template.content.cloneNode(true);
//   const modalBody = modalDialog.querySelector(".modal-body");
//   const modalTitle = modalDialog.querySelector(".modal-title");
//   render(modalTitle, templateTitle);
//   modalBody.innerHTML = ""; // Cleat inner Content
//   modalBody.appendChild(templateFragment);
//   modalDialogBox.show();
// }

// function registration(e) {
//   e.preventDefault();
//   const { email, password, re_password } = e.target;
//   const errors = [];
//   const emailPattern = /^.+@[^\.].*\.[a-z]{2,}$/;
//   if (password.value.trim() !== re_password.value.trim()) {
//     const errorMessage = "Passwords do not match";
//     errors.push(errorMessage);
//     password.classList.add("border-danger");
//     render(password.nextElementSibling, errorMessage);
//     render(re_password.nextElementSibling, errorMessage);
//   }
//   if (!emailPattern.test(email.value.trim())) {
//     const errorMessage = "Invalid email address";
//     errors.push(errorMessage);
//     email.classList.add("border-danger");
//     render(email.nextElementSibling, errorMessage);
//   }
//   if (!errors.length) {
//     const user = {
//       id: crypto.randomUUID(),
//       email: email.value.trim(),
//       password: password.value.trim(),
//       created_at: new Date().getTime(),
//     };
//     insert("users", user);
//     e.target.reset();
//     modalDialogBox.hide();
//     showDialogMessages("success", "Registration successful completed");
//   }
// }

// function authorization(e) {
//   e.preventDefault();
//   const { email, password } = e.target;
//   const users = select("users");
//   const user = users.find(
//     (user) => user.email === email.value.trim() && user.password === password.value.trim()
//   );
//   if (user) {
//     delete user.password;
//     localStorage.setItem("session", JSON.stringify(user));
//     e.target.reset();
//     modalDialogBox.hide();
//     showDialogMessages("success", "Authorization successful completed");
//     setTimeout(() => {
//       window.location.reload();
//     }, 1500);
//   }
// }

// function logout() {
//   localStorage.removeItem("session");
//   window.location.reload();
// }

// function hideErrorMessage(e) {
//   e.classList.remove("border-danger");
//   render(e.nextElementSibling, "");
// }

// export {
//   sortedByProperty,
//   renderProducts,
//   showProductDetails,
//   changeThumbnail,
//   addCart,
//   showUserCart,
//   deleteProductFromCart,
//   incrementProduct,
//   decrementProduct,
//   clearCart,
//   generatePages,
//   paginate,
//   renderTemplateComponent,
//   registration,
//   authorization,
//   logout,
//   hideErrorMessage,
// };

// !! V2 - with comments

import { API_BASE_URL, PRE_PAGE } from "./config.js";
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
  PaginateComponent,
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

    const cartProductsLayout = userCart.products
      .map((product) => ProductRowComponent(product))
      .join("");

    const modalBody = modalDialog.querySelector(".modal-body");
    const modalTitle = modalDialog.querySelector(".modal-title");
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

// Function to display alert messages in the user dialog box
function showDialogMessages(status, message) {
  render(userDialogBox, AlertComponent({ status, message }));
  setTimeout(() => {
    render(userDialogBox, "");
  }, 3000);
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

// Function to generate pagination controls
function generatePages() {
  const display = select("display");
  const pages = Math.ceil(display.length / PRE_PAGE);
  const pagesList = range(1, pages)
    .map((page) => PaginateComponent({ page }))
    .join("");
  render(pagination, pagesList);
}

// Function to handle pagination
function paginate(e) {
  const { page } = e.dataset;
  const display = select("display");
  const start = (Number(page) - 1) * PRE_PAGE;
  const end = Number(page) * PRE_PAGE;
  renderProducts(display.slice(start, end));
}

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
  paginate,
  renderTemplateComponent,
  registration,
  authorization,
  logout,
  hideErrorMessage,
};
