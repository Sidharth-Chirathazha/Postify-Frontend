import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Base toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    backgroundColor: "#FFFDF2", // cream color
    color: "#000000", // black color
    borderRadius: "6px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: "inherit",
  }
};

// Make sure to export each function
export const showSuccessToast = (message) => {
  return toast.success(message, {
    ...toastConfig,
    progressStyle: { background: "#000000" },
    icon: "🎉"
  });
};

export const showErrorToast = (message) => {
  return toast.error(message, {
    ...toastConfig,
    progressStyle: { background: "#E53E3E" },
    icon: "❌"
  });
};

export const showInfoToast = (message) => {
  return toast.info(message, {
    ...toastConfig,
    progressStyle: { background: "#3182CE" },
    icon: "ℹ️"
  });
};

export const showWarningToast = (message) => {
  return toast.warning(message, {
    ...toastConfig,
    progressStyle: { background: "#ED8936" },
    icon: "⚠️"
  });
};

export const showToast = (message) => {
  return toast(message, toastConfig);
};