import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PageProvider } from "./contexts/PageContext";

export default function App() {
  return (
    <ThemeProvider>
      <PageProvider>
        <RouterProvider router={router} />
      </PageProvider>
    </ThemeProvider>
  );
}
