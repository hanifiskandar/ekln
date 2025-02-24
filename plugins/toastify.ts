import Toast, { type ToastOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  const options: ToastOptions = {
    position: "top-right", // Position: "top-right", "top-center", "top-left", etc.
    autoClose: 3000,       // Time in milliseconds before the toast closes
    hideProgressBar: true, // Hide the progress bar
    closeOnClick: true,    // Close the toast when clicked
    pauseOnHover: true,    // Pause the timer on hover
    // draggable: false,      // Disable dragging
    theme: "colored",        // Theme: "light", "dark", or "colored"
  };

  nuxtApp.vueApp.use(Toast, options);
});
