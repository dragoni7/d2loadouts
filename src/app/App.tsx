import { RouterProvider } from "react-router-dom";
import { useMemo } from "react";
import { createRouter } from "./routes";
import { Provider } from "react-redux";
import { store } from "../store";

const AppRouter = () => {
  const router = useMemo(() => createRouter(), []);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
