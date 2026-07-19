import { Provider } from "react-redux";
import { store } from "./store"; // adjust path to your store file

export const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};