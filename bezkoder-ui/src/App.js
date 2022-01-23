import { LoadingProvider } from "./contexts/LoadingContext";
import { AlertMessageProvider } from './contexts/AlertMessageContext';
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
  return (
    <AlertMessageProvider>
      <LoadingProvider>
        <Router>
          <Routes />
        </Router>
      </LoadingProvider>
    </AlertMessageProvider>
  );
}