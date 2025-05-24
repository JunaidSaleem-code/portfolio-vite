// App.tsx
import { CustomThemeProvider } from './theme-provider';
import Home from "./app/page";

export default function App() {
  return (
      <CustomThemeProvider>
        <Home />
      </CustomThemeProvider>
  );
}
