import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const LOCATION = process.env.LOCATION;

function Chat({ socket, username, room, language }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const endpoint =
    "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" +
    language;

  const sendMessage = async () => {
    let axiosConfig = {
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY
        "Ocp-Apim-Subscription-Region": LOCATION,
        "Content-type": "application/json",
      },
    };

    if (currentMessage !== "") {
      let body = [{ Text: currentMessage }];
      const messageData = {};
      await axios.post(endpoint, body, axiosConfig).then(async (res) => {
        const messageData = {
          room: room,
          author: username,
          message: res.data[0].translations[0].text,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
      });
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent) => {
          return <h1>{messageContent.message}</h1>;
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey.."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
