import { COLORS } from "../styles/colors";

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-phone-outgoing"
  >
    <polyline points="22 8 22 2 16 2" />
    <line x1="16" x2="22" y1="8" y2="2" />
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const NavigateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-navigation"
  >
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const InvoiceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-receipt-text"
  >
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M14 8H8" />
    <path d="M16 12H8" />
    <path d="M13 16H8" />
  </svg>
);

const ProcessingCompleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-package-check"
  >
    <path d="m16 16 2 2 4-4" />
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
    <path d="m7.5 4.27 9 5.15" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" x2="12" y1="22" y2="12" />
  </svg>
);

const DeliveryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-truck"
  >
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
);

const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-eye"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ExpressIcon = () => (
  <svg width="2em" height="2em" fill="currentColor" viewBox="0 0 84 84">
    <path
      d="M42.0684 32.954C42.0684 31.9295 41.2016 31.0626 40.1771 31.0626H16.5355C15.511 31.0626 14.6441 31.9295 14.6441 32.954C14.6441 33.9784 15.511 34.8453 16.5355 34.8453H40.1771C41.2804 34.8453 42.0684 33.9784 42.0684 32.954Z"
      fill="black"
    />
    <path
      d="M38.995 42.0166C38.995 40.9921 38.1281 40.1252 37.1037 40.1252H24.6524C23.6279 40.1252 22.7611 40.9921 22.7611 42.0166C22.7611 43.041 23.6279 43.9079 24.6524 43.9079H37.1037C38.2069 43.9079 38.995 43.041 38.995 42.0166Z"
      fill="black"
    />
    <path
      d="M57.5143 22H8.89133C7.86686 22 7 22.8669 7 23.8913C7 24.9158 7.86686 25.7827 8.89133 25.7827H57.5931C66.8133 25.7827 74.221 33.2692 74.221 42.4106C74.221 51.552 66.7345 59.0386 57.5931 59.0386C51.3675 59.0386 45.6935 55.5711 42.7777 50.0547C42.4624 49.4243 41.832 49.0303 41.1228 49.0303H31.4297C30.4052 49.0303 29.5384 49.8971 29.5384 50.9216C29.5384 51.9461 30.4052 52.8129 31.4297 52.8129H39.9407C43.5657 59.0386 50.2642 62.9 57.5143 62.9C68.7835 62.8212 77.9249 53.6798 77.9249 42.4106C77.9249 31.1414 68.7835 22 57.5143 22Z"
      fill="black"
    />
    <path
      d="M57.5143 29.0925C56.411 29.0925 55.4653 30.0382 55.4653 31.1415V42.8047C55.4653 42.9623 55.4653 43.0411 55.4653 43.1987C55.4653 43.3563 55.5441 43.4351 55.5441 43.5927C55.6229 43.6715 55.6229 43.8291 55.7018 43.908C55.7806 43.9868 55.8594 44.1444 55.9382 44.2232L61.1393 49.4243C61.5333 49.8184 62.085 50.0548 62.5578 50.0548C63.1095 50.0548 63.5823 49.8184 63.9763 49.4243C64.7644 48.6363 64.7644 47.2966 63.9763 46.5085L59.3268 41.859V31.1415C59.5632 30.0382 58.6964 29.0925 57.5143 29.0925Z"
      fill="black"
    />
  </svg>
);

const OnlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-monitor-smartphone"
  >
    <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
    <path d="M10 19v-3.96 3.15" />
    <path d="M7 19h5" />
    <rect width="6" height="10" x="16" y="12" rx="2" />
  </svg>
);

const StoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-store"
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-file-pen-line"
  >
    <path d="m18 5-3-3H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
    <path d="M8 18h1" />
    <path d="M18.4 9.6a2 2 0 1 1 3 3L17 17l-4 1 1-4Z" />
  </svg>
);

const CompleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={COLORS.successColor}
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-circle-check-big"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

export {
  PhoneIcon,
  NavigateIcon,
  ExpressIcon,
  ProcessingCompleteIcon,
  DeliveryIcon,
  InvoiceIcon,
  ViewIcon,
  OnlineIcon,
  StoreIcon,
  EditIcon,
  CompleteIcon
};
