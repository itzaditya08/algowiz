import React, { useState, useEffect, useRef } from 'react';
import MessageQueueVisualizer from '../../components/visualizers/MessageQueueVisualizer';
import {
    producerConsumer,
    publishSubscribe,
    requestReply,
    competingConsumers
} from '../../utils/algorithms/messagequeue';
import { Boxes, Settings2, PlayCircle, History, BarChart2 } from 'lucide-react';

const messageQueueMechanisms = [
    { name: 'Producer-Consumer', func: producerConsumer, desc: 'Single queue, producers add, consumers take from front.' },
    { name: 'Publish-Subscribe', func: publishSubscribe, desc: 'Topic-based. Publishers send, all subscribers get a copy.' },
    { name: 'Request-Reply', func: requestReply, desc: 'Requester sends and waits for a reply on a dedicated queue.' },
    { name: 'Competing Consumers', func: competingConsumers, desc: 'Multiple consumers process from a single queue.' },
];

const ControlCard = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
        <div className="p-4 space-y-4">
            {children}
        </div>
    </div>
);


const MessageQueuePage = () => {
    const [numProducers, setNumProducers] = useState(1);
    const [numConsumers, setNumConsumers] = useState(1);
    const [maxQueueSize, setMaxQueueSize] = useState(5);
    const [topicsInput, setTopicsInput] = useState('news, finance');
    const [selectedMechanism, setSelectedMechanism] = useState(messageQueueMechanisms[0].name);

    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [simulationState, setSimulationState] = useState({
        producers: [], consumers: [], queues: { mainQueue: [] }, topics: {},
    });
    const [simulationEvents, setSimulationEvents] = useState([]);
    const [metrics, setMetrics] = useState({ totalProduced: 0, totalConsumed: 0, maxQueueSizeReached: 0 });

    const intervalRef = useRef(null);
    const messageIdRef = useRef(0);

    const getNewMessageId = () => {
        messageIdRef.current++;
        return messageIdRef.current;
    };

    const resetSimulation = () => {
        clearInterval(intervalRef.current);
        setIsSimulationRunning(false);
        messageIdRef.current = 0;
        const producers = Array.from({ length: numProducers }, (_, i) => ({ id: i + 1 }));
        const consumers = Array.from({ length: numConsumers }, (_, i) => ({ id: i + 1 }));
        
        let initialQueues = {};
        let initialTopics = {};
        if (selectedMechanism === 'Request-Reply') {
            initialQueues = { requestQueue: [], replyQueue: [] };
        } else if (selectedMechanism === 'Publish-Subscribe') {
            const topicsArray = topicsInput.split(/[,\s]+/).filter(t => t);
            topicsArray.forEach(topic => initialTopics[topic] = []);
        } else {
            initialQueues = { mainQueue: [] };
        }

        setSimulationState({ producers, consumers, queues: initialQueues, topics: initialTopics });
        setSimulationEvents([]);
        setMetrics({ totalProduced: 0, totalConsumed: 0, maxQueueSizeReached: 0 });
    };

    useEffect(() => {
        resetSimulation();
        return () => clearInterval(intervalRef.current);
    }, [selectedMechanism, numProducers, numConsumers, maxQueueSize, topicsInput]);

    const handleStartSimulation = () => setIsSimulationRunning(!isSimulationRunning);

    const runSimulationStep = () => {
        const algo = messageQueueMechanisms.find(a => a.name === selectedMechanism).func;
        const { newState, events } = algo(simulationState, numProducers, numConsumers, maxQueueSize, getNewMessageId);

        const producedCount = events.filter(e => e.event === 'Message Sent' || e.event === 'Request Sent').length;
        const consumedCount = events.filter(e => e.event === 'Message Received' || e.event === 'Reply Sent' || e.event === 'Reply Received').length;

        setSimulationState(newState);
        setSimulationEvents(prevEvents => [...events.reverse(), ...prevEvents]);
        setMetrics(prevMetrics => ({
            totalProduced: prevMetrics.totalProduced + producedCount,
            totalConsumed: prevMetrics.totalConsumed + consumedCount,
            maxQueueSizeReached: Math.max(prevMetrics.maxQueueSizeReached, Object.values(newState.queues).reduce((sum, q) => sum + q.length, 0))
        }));
    };
    
    useEffect(() => {
        if (isSimulationRunning) {
            intervalRef.current = setInterval(runSimulationStep, 1500);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isSimulationRunning, simulationState]);
    
    const inputBaseClass = "w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";
    const labelBaseClass = "block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300";

    return (
        <div className="p-4 sm:p-6 space-y-6 dark:bg-slate-900 min-h-screen">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Message Queues</h1>
                <p className="text-md text-slate-600 dark:text-slate-400">Visualize message queue data structures and their behavior.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <ControlCard title="Mechanism Selection" icon={<Boxes className="text-slate-500" size={20}/>}>
                        <div className="grid grid-cols-2 gap-2">
                            {messageQueueMechanisms.map(mechanism => (
                                <div key={mechanism.name}>
                                    <input type="radio" id={mechanism.name} name="messageQueueMechanism" value={mechanism.name} checked={selectedMechanism === mechanism.name} onChange={(e) => setSelectedMechanism(e.target.value)} className="hidden peer"/>
                                    <label htmlFor={mechanism.name} className="p-3 block w-full bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 cursor-pointer peer-checked:border-indigo-500 peer-checked:shadow-sm transition-all duration-200">
                                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{mechanism.name}</div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{mechanism.desc}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ControlCard>

                    <ControlCard title="Simulation Configuration" icon={<Settings2 className="text-slate-500" size={20}/>}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="numProducers" className={labelBaseClass}>Producers</label>
                                <input type="number" id="numProducers" value={numProducers} onChange={(e) => setNumProducers(Math.max(1, parseInt(e.target.value)))} min="1" className={inputBaseClass}/>
                            </div>
                            <div>
                                <label htmlFor="numConsumers" className={labelBaseClass}>Consumers</label>
                                <input type="number" id="numConsumers" value={numConsumers} onChange={(e) => setNumConsumers(Math.max(1, parseInt(e.target.value)))} min="1" className={inputBaseClass}/>
                            </div>
                        </div>
                        {(selectedMechanism !== 'Publish-Subscribe') && (
                            <div>
                                <label htmlFor="maxQueueSize" className={labelBaseClass}>Max Queue Size</label>
                                <input type="number" id="maxQueueSize" value={maxQueueSize} onChange={(e) => setMaxQueueSize(Math.max(1, parseInt(e.target.value)))} min="1" className={inputBaseClass}/>
                            </div>
                        )}
                        {selectedMechanism === 'Publish-Subscribe' && (
                            <div>
                                <label htmlFor="topics" className={labelBaseClass}>Topics (comma-separated)</label>
                                <input type="text" id="topics" value={topicsInput} onChange={(e) => setTopicsInput(e.target.value)} placeholder="e.g., news, finance" className={inputBaseClass}/>
                            </div>
                        )}
                    </ControlCard>

                    <ControlCard title="Action Buttons" icon={<PlayCircle className="text-slate-500" size={20}/>}>
                        <div className="flex flex-col space-y-2">
                            <button onClick={handleStartSimulation} className={`p-3 rounded-md transition-colors font-bold text-lg shadow-sm ${isSimulationRunning ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
                                {isSimulationRunning ? 'Stop Simulation' : 'Start Simulation'}
                            </button>
                            <button onClick={resetSimulation} className="bg-slate-200 text-slate-700 p-3 rounded-md hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold">
                                Reset
                            </button>
                        </div>
                    </ControlCard>
                </div>

                {/* Right Column: Visualizer & Metrics */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                           <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Simulation</h2>
                        </div>
                        <div className="p-4">
                            <MessageQueueVisualizer simulationState={simulationState} selectedMechanism={selectedMechanism} />
                        </div>
                         <hr className="border-slate-200 dark:border-slate-700"/>
                        {/* Metrics and History Section */}
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <BarChart2 className="text-slate-500" size={20}/>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Performance Summary</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                    <p className="text-slate-500 dark:text-slate-400">Total Produced</p>
                                    <p className="font-bold text-xl text-slate-700 dark:text-slate-200">{metrics.totalProduced}</p>
                                </div>
                                <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                    <p className="text-slate-500 dark:text-slate-400">Total Consumed</p>
                                    <p className="font-bold text-xl text-slate-700 dark:text-slate-200">{metrics.totalConsumed}</p>
                                </div>
                                 <div className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                    <p className="text-slate-500 dark:text-slate-400">Max Queue Size</p>
                                    <p className="font-bold text-xl text-slate-700 dark:text-slate-200">{metrics.maxQueueSizeReached}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="border-slate-200 dark:border-slate-700"/>
                        <div className="p-4 space-y-4">
                             <div className="flex items-center gap-3">
                                <History className="text-slate-500" size={20}/>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Step-by-Step History</h3>
                            </div>
                            <div className="overflow-y-auto max-h-80 text-sm w-full">
                                {simulationEvents.length > 0 ? (
                                    <table className="min-w-full table-auto">
                                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-700">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Time</th>
                                                <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Event</th>
                                                <th className="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            {simulationEvents.map((event, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 text-slate-500 dark:text-slate-400 font-mono">{event.time}</td>
                                                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{event.event}</td>
                                                    <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{event.details}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center py-4 text-slate-500">Run the simulation to see history.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageQueuePage;