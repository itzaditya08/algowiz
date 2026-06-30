import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import MessageQueueVisualizer from '../../components/visualizers/MessageQueueVisualizer';
import { generateMQSteps } from '../../utils/algorithms/messagequeue/mqEngine';

const MessageQueuesPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(60);
    const [pattern, setPattern] = useState('Producer-Consumer');
    
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const initVisualizer = useCallback(() => {
        setIsPlaying(false);
        const generatedSteps = generateMQSteps(pattern);
        setSteps(generatedSteps);
        setCurrentStepIndex(0);
    }, [pattern]);

    useEffect(() => { initVisualizer(); }, [initVisualizer]);

    // Playback loop
    useEffect(() => {
        let timer;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timer = setTimeout(() => { setCurrentStepIndex(p => p + 1); }, 1800 - (speed * 15));
        } else if (currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const frame = steps[currentStepIndex] || null;

    const getPatternDescription = (p) => {
        switch(p) {
            case 'Producer-Consumer': return "A fundamental pattern where producers place work on a queue, and a consumer pulls work off at its own pace.";
            case 'Publish-Subscribe': return "Message is sent to an exchange/topic, which duplicates and routes the message to all bound subscribers (e.g., Kafka, RabbitMQ Fanout).";
            case 'Competing Consumers': return "Multiple workers listen to the same queue. Messages are load-balanced among them to process tasks concurrently.";
            case 'Request-Reply': return "Simulates synchronous RPC over asynchronous queues. Client sends a request and waits for a routed response on a private reply queue.";
            default: return "";
        }
    };

    const customControls = (
        <select 
            value={pattern} 
            onChange={(e) => setPattern(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none cursor-pointer font-medium"
        >
            <option>Producer-Consumer</option>
            <option>Publish-Subscribe</option>
            <option>Competing Consumers</option>
            <option>Request-Reply</option>
        </select>
    );

    return (
        <VisualizerLayout 
            controls={
                <ControlPanel 
                    isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)}
                    onReset={initVisualizer}
                    onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }}
                    speed={speed} onSpeedChange={setSpeed}
                >
                    {customControls}
                </ControlPanel>
            }
            info={
                <div className="flex flex-col gap-4 h-full">
                    <InfoPanel 
                        title={pattern}
                        description={getPatternDescription(pattern)}
                        timeComplexity="O(1) routing"
                        spaceComplexity="O(N) messages"
                        currentStepMsg={frame ? frame.description : "Ready."}
                    />
                </div>
            }
            canvas={
                <CanvasArea>
                    <MessageQueueVisualizer stepData={frame} />
                </CanvasArea>
            }
        />
    );
};

export default MessageQueuesPage;