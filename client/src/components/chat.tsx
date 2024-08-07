import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Replace with your server address

function Chat() {
    const [messages, setMessages] = useState<any>([]);
    const [messageInput, setMessageInput] = useState("");

    useEffect(() => {
        // Listen for incoming messages
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });

        return () => {
            // Cleanup on component unmount
            socket.off("message");
        };
    }, [messages]);

    const sendMessage = () => {
        if (messageInput.trim() !== "") {
            const message = { text: messageInput, timestamp: new Date() };
            socket.emit("message", message);
            setMessageInput("");
        }
    };

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current)
            divRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    return (
        <div className="flex justify-center items-center w-full h-screen bg-gradient-to-b from-green-300 to-green-200">
            <div className="bg-white rounded-lg w-96 h-96 p-4 shadow-md">
                <div className="flex flex-col h-full">
                    <div className="flex-1 p-2 overflow-y-auto bg-gray-100 rounded-md" >
                        {messages.map((msg: any, index: number) => (
                            <div key={index} className="flex flex-col items-start mt-2">
                                <div
                                    className="bg-green-500 
                   text-white p-2 rounded-md"
                                >
                                    {msg.text}
                                </div>
                                <span className="text-gray-500 text-xs">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                        <div id={'el'} ref={divRef}>
                        </div>
                    </div>
                    <div className="p-2 border-t border-gray-300">
                        <div className="flex">
                            <input
                                type="text"
                                className="w-full px-2 py-1 border rounded-l-md outline-none"
                                placeholder="Type your message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600"
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;