import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [lan, setLan] = useState([]);
  const [value, setValue] = useState([]);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  useEffect(() => {
    fetch(
      "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setLan(result.translation);
        },
        (error) => {
          setIsLoaded(true);
        }
      );
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {!showChat ? (
        <div>
          <h3>Join Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <div>
            <select
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            >
              <option disabled={true} value="">
                Select Room Language
              </option>

              {Object.entries(lan).map(([key, value]) => (
                <option value={key}>{value.name}</option>
              ))}
            </select>
          </div>
          <button onClick={joinRoom}>join a room</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          room={room}
          username={username}
          language={value}
        />
      )}
    </div>
  );
}

export default App;
