// Styles
import "./App.css";

// React
import { useState } from "react";

// Components
import QrReader from "./components/QrReader";

function App() {
  // const [openQr, setOpenQr] = useState<boolean>(True);
  return (
    <div>
<QrReader />
    </div>
  );
}

export default App;
