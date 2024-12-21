"use client";
import axios from "axios";
import { useEffect, useState } from "react";
let socket;

export default function Chat() {
  let [val, Setval] = useState("");
  let [message, SetMessage] = useState([]);

  useEffect(() => {
    socket = new WebSocket("wss://chatf-production.up.railway.app/message");
    socket.onmessage = (event) => {
      console.log(event.data);
      SetMessage((prev) => [...prev, event.data]);
    };
  }, []);

  function handleChange(e) {
    let value = e.target.value;

    Setval((old) => {
      return value;
    });
  }
  function submit() {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(val);
      Setval("");
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 px-6 text-lg font-semibold">
        Chat Application
      </div>

      {/* Message Display */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {message.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              idx % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                idx % 2 === 0
                  ? "bg-white text-gray-800 shadow-md"
                  : "bg-blue-500 text-white"
              }`}
            >
              {msg}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="bg-gray-200 text-black p-4 flex items-center space-x-2 w-full">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
          value={val}
          onChange={handleChange}
          type="text"
          placeholder="Type a message"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={submit}
        >
          Send
        </button>
      </div>
    </div>
  );
}
