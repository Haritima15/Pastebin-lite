import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ViewPaste from "./pages/ViewPaste";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:shortId" element={<ViewPaste />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
