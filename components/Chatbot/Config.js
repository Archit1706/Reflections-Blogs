import { createChatBotMessage } from "react-chatbot-kit";
import { BsRobot } from 'react-icons/bs';

const config = {
    initialMessages: [createChatBotMessage(`Welcome to Idea Bot! I'm here to help you generate creative and compelling ideas for your blog posts. Let's get started!`)],
    botName: "IdeaBot",
    botAvatar: <BsRobot />,

}

export default config