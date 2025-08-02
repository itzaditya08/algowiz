export const priority_np = (processes) => {
    // Make a copy of the processes to modify
    const processQueue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const completedProcesses = [];
    const readyQueue = [];
    
    // Initialize metrics
    let currentTime = 0;
    const ganttChart = [];

    // Loop until all processes are completed
    while (completedProcesses.length < processes.length) {
        // Add all arrived processes to the ready queue
        while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
            readyQueue.push(processQueue.shift());
        }

        if (readyQueue.length === 0) {
            if (processQueue.length > 0) {
                currentTime = processQueue[0].arrivalTime;
                continue;
            }
            break;
        }

        // Sort the ready queue by priority (lower number = higher priority)
        readyQueue.sort((a, b) => a.priority - b.priority);
        const currentProcess = readyQueue.shift();

        const startTime = currentTime;
        currentTime += currentProcess.burstTime;
        const completionTime = currentTime;

        // Calculate metrics
        const waitingTime = startTime - currentProcess.arrivalTime;
        const turnaroundTime = completionTime - currentProcess.arrivalTime;
        const responseTime = waitingTime;

        // Add to Gantt chart and completed processes list
        ganttChart.push({
            processId: currentProcess.name,
            start: startTime,
            end: completionTime,
        });
        completedProcesses.push({
            ...currentProcess,
            completionTime,
            waitingTime,
            turnaroundTime,
            responseTime,
        });
    }

    // Calculate final metrics
    const totalWaitingTime = completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaroundTime = completedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);
    const totalResponseTime = completedProcesses.reduce((sum, p) => sum + p.responseTime, 0);
    const avgWaitingTime = totalWaitingTime / processes.length;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const avgResponseTime = totalResponseTime / processes.length;
    const totalExecutionTime = currentTime;

    return {
        ganttChart,
        processMetrics: completedProcesses,
        avgWaitingTime,
        avgTurnaroundTime,
        avgResponseTime,
        totalExecutionTime,
    };
};