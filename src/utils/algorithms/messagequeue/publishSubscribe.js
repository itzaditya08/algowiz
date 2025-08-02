export const publishSubscribe = (state, numProducers, numConsumers, messageIdRef) => {
    let newState = JSON.parse(JSON.stringify(state));
    let events = [];

    // Producer/Publisher Logic
    if (Math.random() < 0.5) {
        const producerId = Math.floor(Math.random() * numProducers) + 1;
        const messageId = messageIdRef();
        const newMessage = { id: messageId, content: `Msg-${messageId}`, timestamp: Date.now() };
        
        const topicsArray = Object.keys(newState.topics);
        const randomTopic = topicsArray[Math.floor(Math.random() * topicsArray.length)];

        if (randomTopic) {
            newState.topics[randomTopic].push(newMessage);
            events.push({ time: new Date().toLocaleTimeString(), event: 'Message Sent', details: `Publisher ${producerId} sent '${newMessage.content}' to topic '${randomTopic}'.` });

            // Consumer/Subscriber Logic
            newState.consumers.forEach(consumer => {
                // In a real system, consumers would subscribe. Here, we simulate all consumers receiving it.
                events.push({ time: new Date().toLocaleTimeString(), event: 'Message Received', details: `Subscriber ${consumer.id} received '${newMessage.content}' from topic '${randomTopic}'.` });
            });
        }
    }

    return { newState, events };
};
