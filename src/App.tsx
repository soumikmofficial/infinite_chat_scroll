import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import BottomScroll from "./components/Chat/BottomScroll";
import Chat from "./components/Chat/Chat";
import Chat2 from "./components/Chat/Chat2";
import Chat3 from "./components/Chat/Chat3";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {/* <Chat2 /> */}
      {/* <Chat /> */}
      {/* <Chat3 /> */}
      <BottomScroll />
    </div>
  );
}

export default App;
