import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageQueueVisualizer = ({ simulationState, selectedMechanism }) => {
    const { producers, consumers, queues, topics } = simulationState;

    const renderActors = (actorType, actors, color) => (
        <div className="flex justify-center items-center flex-wrap gap-4 min-h-[80px]">
            {actors.map((actor) => (
                <div key={`${actorType}-${actor.id}`} className="flex flex-col items-center">
                    <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white/20`}>
                        {actorType === 'producer' ? `P${actor.id}` : `C${actor.id}`}
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                        {actorType} {actor.id}
                    </span>
                </div>
            ))}
        </div>
    );

    const renderMessagesInQueue = (queue) => (
        <AnimatePresence>
            <div className="flex flex-row-reverse justify-start items-center h-full p-2 gap-2">
                {queue.map((msg) => (
                    <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-12 h-12 flex-shrink-0 bg-indigo-500 rounded-lg shadow-md flex items-center justify-center font-bold text-white"
                    >
                        {`M${msg.id}`}
                    </motion.div>
                ))}
            </div>
        </AnimatePresence>
    );
    
    const QueueContainer = ({ title, queue }) => (
         <div className="flex flex-col items-center w-full">
            <h4 className="font-semibold text-md mb-2 text-slate-600 dark:text-slate-300">{title} (Length: {queue.length})</h4>
            <div className="w-full bg-slate-100 dark:bg-slate-700/50 h-20 rounded-lg shadow-inner overflow-x-auto">
                {renderMessagesInQueue(queue)}
            </div>
        </div>
    );

    const renderMainContent = () => {
        switch (selectedMechanism) {
            case 'Producer-Consumer':
            case 'Competing Consumers':
                return <QueueContainer title="Message Queue" queue={queues.mainQueue || []} />;
            
            case 'Publish-Subscribe':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {Object.entries(topics).map(([topicName, topicQueue]) => (
                            <div key={topicName} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                                <h4 className="font-semibold text-center text-md mb-2 text-slate-600 dark:text-slate-300 capitalize">{topicName}</h4>
                                <div className="w-full h-16 flex overflow-x-auto rounded">
                                    {renderMessagesInQueue(topicQueue)}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'Request-Reply':
                return (
                    <div className="flex flex-col w-full space-y-6">
                       <QueueContainer title="Request Queue" queue={queues.requestQueue || []} />
                       <QueueContainer title="Reply Queue" queue={queues.replyQueue || []} />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 min-h-[350px]">
            {renderActors('producer', producers, 'bg-blue-600')}
            
            <div className="w-full py-4">
                {renderMainContent()}
            </div>

            {renderActors('consumer', consumers, 'bg-emerald-600')}
        </div>
    );
};

export default MessageQueueVisualizer;