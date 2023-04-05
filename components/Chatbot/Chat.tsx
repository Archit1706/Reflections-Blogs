import React from "react";
import { Chatbot } from "react-chatbot-kit";
import { useEffect } from "react";
import "./Chat.css";
import "./ChatMessage.css";
import "./UserMessage.css";
import "./ErrorMessage.css";
import config from "./Config";
import MessageParser from "./MessageParser.jsx";
import ActionProvider from "./ActionProvider";

const handleUserMessage = (message: any, botMessage: any) => {
    // Do something with the message
    console.log(message);

    // Send a message back to the user
    botMessage("Hello, thanks for your message!");
};

const HealthChatBot = () => {
    const header = document.getElementsByClassName(
        "react-chatbot-kit-chat-header"
    )[0];

    return (
        <center>
            <div>
                {window.innerWidth > 575 ? (
                    <div className="mockup-phone">
                        <div className="camera"></div>
                        <div className="display">
                            <div className="artboard artboard-demo phone-1">
                                <Chatbot
                                    config={config}
                                    messageParser={MessageParser}
                                    handleUserMessage={handleUserMessage}
                                    actionProvider={ActionProvider}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        handleUserMessage={handleUserMessage}
                        actionProvider={ActionProvider}
                    />
                )}
            </div>
        </center>
    );
};

export default HealthChatBot;
