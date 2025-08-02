export const competingConsumers = (state, numProducers, numConsumers, maxQueueSize, messageIdRef) => {
    let newState = JSON.parse(JSON.stringify(state));
    let events = [];

    // Producer Logic (randomly produce)
    if (Math.random() < 0.5) {
        if (newState.queues.mainQueue.length < maxQueueSize) {
            const producerId = Math.floor(Math.random() * numProducers) + 1;
            const messageId = messageIdRef();
            const newMessage = { id: messageId, content: `Msg-${messageId}`, timestamp: Date.now() };
            newState.queues.mainQueue.push(newMessage);
            events.push({ time: new Date().toLocaleTimeString(), event: 'Message Sent', details: `Producer ${producerId} sent '${newMessage.content}'.` });
        }
    }

    // Competing Consumer Logic (multiple consumers try to consume)
    newState.consumers.forEach(consumer => {
        if (newState.queues.mainQueue.length > 0 && Math.random() < 0.8) {
            const message = newState.queues.mainQueue.shift();
            events.push({ time: new Date().toLocaleTimeString(), event: 'Message Received', details: `Consumer ${consumer.id} received '${message.content}'.` });
        }
    });

    return { newState, events };
};
