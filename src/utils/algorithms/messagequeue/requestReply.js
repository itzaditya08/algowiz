export const requestReply = (state, numProducers, numConsumers, maxQueueSize, messageIdRef) => {
    let newState = JSON.parse(JSON.stringify(state));
    let events = [];

    // Requester (Producer) Logic
    if (Math.random() < 0.5) {
        if (newState.queues.requestQueue.length < maxQueueSize) {
            const requesterId = Math.floor(Math.random() * numProducers) + 1;
            const messageId = messageIdRef();
            const newMessage = { id: messageId, content: `Request #${messageId}`, timestamp: Date.now() };
            newState.queues.requestQueue.push(newMessage);
            events.push({ time: new Date().toLocaleTimeString(), event: 'Request Sent', details: `Requester ${requesterId} sent '${newMessage.content}'.` });
        }
    }

    // Replier (Consumer) Logic
    newState.consumers.forEach(consumer => {
        if (newState.queues.requestQueue.length > 0 && Math.random() < 0.8) {
            const request = newState.queues.requestQueue.shift();
            const replyContent = `Reply to ${request.content}`;
            const reply = { ...request, content: replyContent, timestamp: Date.now() };

            if (newState.queues.replyQueue.length < maxQueueSize) {
                newState.queues.replyQueue.push(reply);
                events.push({ time: new Date().toLocaleTimeString(), event: 'Reply Sent', details: `Replier ${consumer.id} sent '${reply.content}'.` });
            }
        }
    });

    return { newState, events };
};
