import React, { useState, useEffect } from "react";
import "../styles/Chat.css";
import logo from './stonky_logo.png';
import MetaLogo from './Meta Logo.jpg';

function Chat({ ticker }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [alert, setAlert] = useState("");
    const baseURL = import.meta.env.VITE_API;
    const key = import.meta.env.VITE_KEY;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert("");
        const socket = new WebSocket(`${baseURL}/ask`);

        socket.onopen = () => {
            // Send the query when the socket is open
            socket.send(JSON.stringify({ query, ticker, key }));

            // Initialize the last message with the query
            setMessages((prevMessages) => [
                ...prevMessages,
                { query, response: "" }
            ]);
        };

        socket.onmessage = (res) => {
            const data = JSON.parse(res.data);
            console.log("Received data:", data); // Log incoming data for debugging
        
            if (data.event_type === 'bad_request') {
                setQuery("");
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    const lastMessageIndex = updatedMessages.length - 1;
        
                    // Create a new message object for immutability
                    const lastMessage = {
                        ...updatedMessages[lastMessageIndex], // Spread operator to copy previous message
                        response: updatedMessages[lastMessageIndex].response + "Sorry, either we dont have information on your query or it wasn't specific enough." // Append new content
                    };
        
                    // Replace the last message with the updated one
                    updatedMessages[lastMessageIndex] = lastMessage;
        
                    console.log("After updating messages:", updatedMessages); // Log updated messages
                    return updatedMessages; // Return the updated messages
                });
            } else if (data.event_type === 'on_llm_stream') {
                setQuery("");
                console.log("Before updating messages:", messages); // Log current messages
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    const lastMessageIndex = updatedMessages.length - 1;
        
                    // Create a new message object for immutability
                    const lastMessage = {
                        ...updatedMessages[lastMessageIndex], // Spread operator to copy previous message
                        response: updatedMessages[lastMessageIndex].response + data.content // Append new content
                    };
        
                    // Replace the last message with the updated one
                    updatedMessages[lastMessageIndex] = lastMessage;
        
                    console.log("After updating messages:", updatedMessages); // Log updated messages
                    return updatedMessages; // Return the updated messages
                });
            }
        };

        socket.onclose = () => {
            setLoading(false); // Set loading to false when the socket closes
            setQuery("");
        };

        socket.onerror = (err) => {
            setLoading(false);
            setAlert("WebSocket error: " + err.message);
            setQuery("");
        };
    };

    return (
        <>
            <div className="Chat__title">
                <p>Chat with Stonky made with</p>
                <img src={MetaLogo} alt="Meta Logo" />
                <p>Llama 3.2:1b</p>
            </div>

            <div className="Chatbox">
                {alert && <div className="alert">{alert}</div>}
                {messages.length === 0 && (
                    <>
                        <h1>No messages yet...</h1>
                        <h3>
                            Response times may take a few minutes depending if you are the first person to request this stock in the last 12 hours.
                            If you are, we are gathering updated data about {ticker} and making it accessible to Llama 3.2:1b. Chatting after this 
                            process should take much less time for all users accessing {ticker}.
                        </h3>
                    </>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className="message-container">
                        <div className="last_query">{msg.query}</div>
                        <div className="last_response" style={{ whiteSpace: "pre-wrap" }}>
                            {msg.response || "Loading..."} {/* Show loading text if response is empty */}
                        </div>
                    </div>
                ))}
            </div>

            <form className="Chat__form" onSubmit={handleSubmit}>
                <textarea
                    className="Chat__input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Enter a question about ${ticker}`}
                />
                {!loading && query.length > 5 && query.length <= 200 && (
                    <button className="Chat__button" type="submit" disabled={loading}>
                        <img className="image_send" src={logo} alt="Send" />
                    </button>
                )}
                {loading && <div className="loading"></div>} {/* Loading indicator */}
            </form>
        </>
    );
}

export default Chat;
