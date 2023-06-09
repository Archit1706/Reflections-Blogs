class ActionProvider {
    constructor(
        createChatBotMessage,
        setStateFunc,
        createClientMessage,
        stateRef,
        createCustomMessage,
        ...rest
    ) {
        this.createChatBotMessage = createChatBotMessage;
        this.setState = setStateFunc;
        this.createClientMessage = createClientMessage;
        this.stateRef = stateRef;
        this.createCustomMessage = createCustomMessage;
    }

    ResponseHandler = (message) => {
        let prompt = `You are an IdeaBot for the Reflections Blogging Website that helps users generate creative and compelling ideas for their blog posts. The ideas I have are ${message}. Suugest some possible ideas related to it or brainstorm a new idea.`;
        console.log(prompt);

        const apiKey = process.env.OPENAI_API_KEY;
        fetch(
            "https://api.openai.com/v1/engines/text-davinci-003/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 512,
                }),
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data.choices[0].text);
                this.setChatbotMessage(
                    this.createChatBotMessage(data.choices[0].text)
                );
            });
    };
    setChatbotMessage = (message) => {
        this.setState((state) => ({
            ...state,
            messages: [...state.messages, message],
        }));
    };
}

export default ActionProvider;
