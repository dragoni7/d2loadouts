import { RouterProvider } from "react-router-dom"
import { useMemo } from "react"
import { createRouter } from "./routes";

const AppRouter = () => {
  const router = useMemo(() => createRouter(), [])

  return <RouterProvider router={router} />
}

function App() {
  return (
    <AppRouter />
  )
}

export default App;

