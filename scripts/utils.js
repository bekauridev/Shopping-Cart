import { modalDialog } from "./dom.js";

// Initialize a Bootstrap modal instance for modalDialog element
const modalDialogBox = new bootstrap.Modal(modalDialog, { keyboard: false });

// Export the modalDialogBox instance for use in other modules
export { modalDialogBox };
