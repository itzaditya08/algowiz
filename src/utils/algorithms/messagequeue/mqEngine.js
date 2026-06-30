export const generateMQSteps = (pattern) => {
    const steps = [];
    
    // Helper to deeply copy and push state snapshots
    const snap = (desc, prods, queues, cons) => {
        steps.push({ 
            description: desc, 
            producers: JSON.parse(JSON.stringify(prods)), 
            queues: JSON.parse(JSON.stringify(queues)), 
            consumers: JSON.parse(JSON.stringify(cons)) 
        });
    };

    if (pattern === 'Producer-Consumer') {
        snap("System initialized. 1 Producer, 1 Queue, 1 Consumer.", 
            [{id: 'Producer', state: 'idle'}], 
            { 'Main Queue': [] }, 
            [{id: 'Consumer', state: 'idle'}]);
        
        snap("Producer generates a message and sends it to the Queue.", 
            [{id: 'Producer', state: 'sending Msg-1'}], 
            { 'Main Queue': ['Msg-1'] }, 
            [{id: 'Consumer', state: 'idle'}]);
        
        snap("Consumer detects new message and pulls it from the Queue.", 
            [{id: 'Producer', state: 'idle'}], 
            { 'Main Queue': [] }, 
            [{id: 'Consumer', state: 'processing Msg-1'}]);
            
        snap("Consumer acknowledges message completion.", 
            [{id: 'Producer', state: 'idle'}], 
            { 'Main Queue': [] }, 
            [{id: 'Consumer', state: 'idle'}]);
    } 
    else if (pattern === 'Publish-Subscribe') {
        snap("System initialized. 1 Publisher, Topic Exchange, 2 Subscribers.", 
            [{id: 'Publisher', state: 'idle'}], 
            { 'Topic Exchange': [] }, 
            [{id: 'Sub 1', state: 'idle'}, {id: 'Sub 2', state: 'idle'}]);
        
        snap("Publisher publishes an event to the Topic Exchange.", 
            [{id: 'Publisher', state: 'publishing Event-A'}], 
            { 'Topic Exchange': ['Event-A'] }, 
            [{id: 'Sub 1', state: 'idle'}, {id: 'Sub 2', state: 'idle'}]);
        
        snap("Exchange duplicates and routes the event to ALL bound subscribers.", 
            [{id: 'Publisher', state: 'idle'}], 
            { 'Topic Exchange': [] }, 
            [{id: 'Sub 1', state: 'received Event-A'}, {id: 'Sub 2', state: 'received Event-A'}]);
    }
    else if (pattern === 'Competing Consumers') {
        snap("System initialized. 1 Producer, Task Queue, 2 Competing Consumers.", 
            [{id: 'Producer', state: 'idle'}], 
            { 'Task Queue': [] }, 
            [{id: 'Worker 1', state: 'idle'}, {id: 'Worker 2', state: 'idle'}]);
        
        snap("Producer sends a batch of tasks to the queue.", 
            [{id: 'Producer', state: 'sending batch'}], 
            { 'Task Queue': ['Task-1', 'Task-2'] }, 
            [{id: 'Worker 1', state: 'idle'}, {id: 'Worker 2', state: 'idle'}]);
        
        snap("Worker 1 competes for and locks the first available task.", 
            [{id: 'Producer', state: 'idle'}], 
            { 'Task Queue': ['Task-2'] }, 
            [{id: 'Worker 1', state: 'working on Task-1'}, {id: 'Worker 2', state: 'idle'}]);
        
        snap("Worker 2 pulls the next available task from the queue.", 
            [{id: 'Producer', state: 'idle'}], 
            { 'Task Queue': [] }, 
            [{id: 'Worker 1', state: 'working on Task-1'}, {id: 'Worker 2', state: 'working on Task-2'}]);
            
        snap("Both workers complete their tasks independently.", 
            [{id: 'Producer', state: 'idle'}], 
            { 'Task Queue': [] }, 
            [{id: 'Worker 1', state: 'idle'}, {id: 'Worker 2', state: 'idle'}]);
    }
    else if (pattern === 'Request-Reply') {
        snap("System initialized. Client, Request Queue, Reply Queue, Server.", 
            [{id: 'Client', state: 'idle'}], 
            { 'Req-Q': [], 'Rep-Q': [] }, 
            [{id: 'Server', state: 'idle'}]);
        
        snap("Client sends a request and awaits a reply (RPC style).", 
            [{id: 'Client', state: 'awaiting reply'}], 
            { 'Req-Q': ['Req-1'], 'Rep-Q': [] }, 
            [{id: 'Server', state: 'idle'}]);
        
        snap("Server picks up the request from Req-Q for processing.", 
            [{id: 'Client', state: 'awaiting reply'}], 
            { 'Req-Q': [], 'Rep-Q': [] }, 
            [{id: 'Server', state: 'processing Req-1'}]);
        
        snap("Server finishes processing and routes reply to Rep-Q.", 
            [{id: 'Client', state: 'awaiting reply'}], 
            { 'Req-Q': [], 'Rep-Q': ['Reply-1'] }, 
            [{id: 'Server', state: 'idle'}]);
            
        snap("Client receives the asynchronous reply.", 
            [{id: 'Client', state: 'received Reply-1'}], 
            { 'Req-Q': [], 'Rep-Q': [] }, 
            [{id: 'Server', state: 'idle'}]);
    }

    return steps;
};