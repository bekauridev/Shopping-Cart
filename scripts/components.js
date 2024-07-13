// TODO: High Order Components
/**
 * @param {Object} props
 * @property {String} content - HTML content to be rendered inside a div.
 * @property {String[]} classes - CSS classes to be applied to the div.
 * @return {String} - HTML string representing a div with specified content and classes.
 */
function _Col(props) {
  const { content, classes } = props;
  return `<div class="${classes.join(" ")}">
            ${content}
          </div>`;
}

/**
 * @param {Object} props
 * @property {String} status - Status of the alert (e.g., "success", "danger, warning, info").
 * @property {String} message - Message content to display in the alert.
 * @return {String} - HTML string representing an alert component.
 */
function AlertComponent({ status, message }) {
  return /*html*/ `<div class="alert alert-${status} alert-component" role="alert">
    ${message}
  </div>`;
}

/**
 * @param {Object} props
 * @property {String | number} value - Value attribute for the option element.
 * @property {String} text - Text content of the option element.
 * @return {String} - HTML string representing an option in a select dropdown.
 */
function OptionComponent(props) {
  const { value, text } = props;
  return /*html*/ `<option value="${value}">${text}</option>`;
}

/**
 * @param {Object} props
 * @property {String} name - Name displayed on the button.
 * @return {String} - HTML string representing a button component.
 */
function TagComponent(props) {
  const { name } = props;
  return /*html*/ `<button type="button" class="btn btn-info" aria-label="tag button"
  title="tag" >#${name}</button>`;
}

/**
 * @param {Object} props
 * @property {String} id - Unique identifier of the thumbnail.
 * @property {String} image - URL of the thumbnail image.
 * @property {String | number} productId - ID of the product associated with the thumbnail.
 * @return {String} - HTML string representing a thumbnail image component.
 */
function ThumbnailComponent(props) {
  const { id, image, productId } = props;

  return /*html*/ `<img src="${image}"
                        class="img-thumbnail cursor-pointer"
                        data-product-id="${productId}"
                        alt="..."
                        onclick="changeThumbnail(this)"/>`;
}

/**
 * @param {Object} props
 * @property {String | number} id - Unique identifier of the product.
 * @property {String} title - Title of the product.
 * @property {String} description - Description of the product.
 * @property {String} category - Category of the product.
 * @property {number} price - Price of the product.
 * @property {String[]} tags - Tags associated with the product.
 * @property {String} thumbnail - URL of the product thumbnail image.
 * @return {String} - HTML string representing a product card component.
 */
function ProductComponent(props) {
  const { id, title, description, category, price, tags, thumbnail } = props;
  const tagsContent = tags.map((tag) => TagComponent({ name: tag })).join("");
  const isAuth = localStorage.hasOwnProperty("session");
  const loginButtons = [
    /*html*/ `<button type="button" class="btn btn-warning" aria-label="add to shopping cart"
              title="add to cart" data-id="${id}" onclick="addCart(this)">
                <i class="bi bi-cart4"></i>
              </button>`,
  ];

  const logoutButtons = [
    /*html*/ `<button type="button" class="btn btn-warning"
            data-template-id="authorization-form-template"
            data-template-title="Authorization Form"
            onclick="renderTemplateComponent(this)">
             <i class="bi bi-cart4"></i>
          </button>`,
  ];
  const buttons = isAuth ? loginButtons : logoutButtons;
  return /*html*/ `<li class="card name" id="${id}">
            <div class="card-header position-relative">
              <img src="${thumbnail}"
              class="card-img-top cursor-pointer"
              alt="${title}" data-id="${id}"
              onclick="showProductDetails(this)" />
              <div class="btn-group favorite-basket gap-1" role="group">
                ${buttons.join("")}
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="card-text">${description}</p>
            </div>
            <div class="card-footer">
              <div class="btn-group gap-1" role="group">
              ${tagsContent}
              </div>
            </div>
          </li>`;
}

/**
 * @param {Object} props
 * @property {String | number} id - Unique identifier of the product.
 * @property {String} title - Title of the product.
 * @property {String} description - Description of the product.
 * @property {String} category - Category of the product.
 * @property {String} brand - Brand of the product.
 * @property {number} price - Price of the product.
 * @property {number} rating - Rating of the product.
 * @property {String[]} tags - Tags associated with the product.
 * @property {String[]} images - Array of image URLs associated with the product.
 * @property {String} thumbnail - URL of the product thumbnail image.
 * @return {String} - HTML string representing a detailed view of a single product.
 */

function SingleProductComponent(props) {
  const {
    id,
    title,
    description,
    category,
    brand,
    price,
    rating,
    tags,
    images,
    thumbnail,
  } = props;

  const tagsContent = tags.map((tag) => TagComponent({ name: tag })).join("");
  const imagesContent = images
    .map((image) => ThumbnailComponent({ id: crypto.randomUUID(), image, productId: id }))
    .map((image) => _Col({ content: image, classes: ["col-3", "md-4"] }))
    .join("");

  return /*html*/ `<div class="card mb-3" id="single-${id}">
          <div class="row g-0">
            <div class="col-md-5">
              <img src="${thumbnail}" data-image="main" class="img-fluid rounded-start fit-image  " alt="${title}" 
               >
              <div class="row align-items-end">
              ${imagesContent}
              </div>
            </div>
            <div class="col-md-7">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <strong>Category</strong> : ${category}
                </li>
                <li class="list-group-item">
                  <strong>Brand</strong> : ${brand}
                </li>
                <li class="list-group-item">
                  <strong>Price</strong> : ${price}
                </li>
                <li class="list-group-item">
                  <strong>Rating</strong> : ${rating}
                </li>
              </ul>
              </div>
              <div class="card-footer">
              <div class="btn-group" role="group">
              ${tagsContent}
              </div>
            </div>
            </div>
          </div>
        </div>`;
}

/**
 * @param {Object} props
 * @property {String | number} id - Unique identifier of the product.
 * @property {String} title - Title of the product.
 * @property {number} quantity - Quantity of the product in the cart.
 * @property {number} price - Price per unit of the product.
 * @property {String} thumbnail - URL of the product thumbnail image.
 * @return {String} - HTML string representing a row in the cart with product details.
 */
// This component represents each product row in shopping cart
function ProductRowComponent(props) {
  const { id, title, quantity, price, thumbnail } = props;
  const userId = JSON.parse(localStorage.getItem("session")).id;
  const disabled = quantity === 1 ? "disabled" : "";

  return /*html*/ `<div class="row g-3 align-items-center border-top border-2 border-light mt-3">
  <div class="col-12 col-md-2 d-flex">
    <img
      src="${thumbnail}"
      class="img-fluid rounded-3 shadow-sm mx-auto d-block"
      alt="${title}'s thumbnail"
    />
  </div>
  <div class="col-12 col-md-5 text-center text-md-start">
    <h5 class="fw-bold text-dark">${title}</h5>
  </div>
  <div class="col-12 col-md-3 d-flex justify-content-center">
    <div class="btn-group" role="group">
      <button
        type="button"
        class="btn btn-secondary"
        onclick="decrementProduct(this)"
        data-product-id="${id}"
        data-user-id="${userId}"
        ${disabled}
      >
        <i class="bi bi-dash-lg"></i>
      </button>
      <input type="number" class="form-control text-center quantity-input" value="${quantity}" />
      <button
        type="button"
        class="btn btn-primary"
        onclick="incrementProduct(this)"
        data-product-id="${id}"
        data-user-id="${userId}"
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
  </div>
  <div class="col-12 col-md-2 text-center text-md-start">
    <span class="fw-bold text-danger">${price * quantity}</span>
  </div>
  <div class="col-12 col-md-1 text-center">
    <button
      type="button"
      class="btn btn-danger"
      data-product-id="${id}"
      data-user-id="${userId}"
      onclick="deleteProductFromCart(this)"
    >
      <i class="bi bi-trash3"></i>
    </button>
  </div>
</div>`;
}

/**
 * @param {Object} props
 * @property {String | number} userId - ID of the user.
 * @property {number} fullPrice - Total price of all products in the cart.
 * @return {String} - HTML string representing the footer of the cart modal.
 */
function ProductRowFooterComponent(props) {
  const { userId, fullPrice } = props;
  return /*html*/ `   <div class="row g-3 mt-3">
  <div class="col-12 col-md-6">
    <button
      type="button"
      class="btn btn-danger w-100"
      data-user-id="${userId}"
      onclick="clearCart(this)"
    >
      <span class="label">Clear Cart</span>
      <i class="bi bi-cart-dash"></i>
    </button>
  </div>
  <div class="col-12 col-md-6">
    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-outline-primary me-2">
        Full Price
      </button>
      <button type="button" class="btn btn-outline-primary">
        ${fullPrice}
      </button>
    </div>
  </div>
</div>`;
}

/**
 * @param {Object | null } props
 * @return {String} - HTML string representing authentication buttons.
 */
function AuthComponent(props) {
  return /*html*/ `<div class="btn-group" role="group">
            <button type="button"
                    class="btn btn-primary"
                    data-template-id="registration-form-template"
                    data-template-title="Registration Form"
                    onclick="renderTemplateComponent(this)">
              Registration
            </button>
            <button type="button"
                    class="btn btn-warning"
                    data-template-id="authorization-form-template"
                    data-template-title="Authorization Form"
                    onclick="renderTemplateComponent(this)">
              Authorization
            </button>
          </div>`;
}

/**
 * @param {Object | null } props
 * @return {String} - HTML string representing an avatar image component.
 */
function AvatarComponent(props) {
  return /*html*/ `<img src="images/theme/admin.webp" class="img-thumbnail" alt="Admin Avatar" />`;
}

/**
 * @param {Object } props
 * @property {Object} user - User object containing user details.
 * @return {String} - HTML string representing panel settings buttons.
 */
function PanelSettingsComponent(props) {
  const { user } = props;
  return /*html*/ `<div class="btn-group w-100 justify-content-end" role="group">
                    <button
                      type="button"
                      class="btn btn-success flex-grow-0"
                      aria-label="shopping cart"
                      title="shopping cart" 
                      data-user-id="${user.id}"
                      onclick="showUserCart(this)"
                    >
                      <i class="bi bi-basket"></i>
                    </button>
                    <button type="button" class="btn btn-primary flex-grow-0" aria-label="Leafe from account"
                    title="Leave"  onclick="logout()">
                      <i class="bi bi-box-arrow-right"></i>
                    </button>
                </div>`;
}

// Exporting all components
export {
  _Col,
  AlertComponent,
  ProductComponent,
  SingleProductComponent,
  TagComponent,
  OptionComponent,
  ProductRowComponent,
  ProductRowFooterComponent,
  AuthComponent,
  AvatarComponent,
  PanelSettingsComponent,
};
