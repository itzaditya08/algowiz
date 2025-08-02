export const rr = (processes, quantum) => {
    // Make a deep copy of the processes to avoid modifying original objects
    const processQueue = processes.map(p => ({ ...p, remainingBurstTime: p.burstTime, isCompleted: false, startTime: -1 }));
    const completedProcesses = [];
    const readyQueue = [];
    let currentTime = 0;
    const ganttChart = [];

    // Initially add all processes that arrive at time 0
    let processIndex = 0;
    while (processIndex < processQueue.length && processQueue[processIndex].arrivalTime === 0) {
        readyQueue.push(processQueue[processIndex]);
        processIndex++;
    }
    
    while (completedProcesses.length < processes.length) {
        if (readyQueue.length === 0) {
            // CPU is idle, find the next arriving process
            if (processIndex < processQueue.length) {
                const nextArrival = processQueue[processIndex].arrivalTime;
                if (nextArrival > currentTime) {
                    if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === 'Idle') {
                        ganttChart[ganttChart.length - 1].end = nextArrival;
                    } else {
                        ganttChart.push({ processId: 'Idle', start: currentTime, end: nextArrival });
                    }
                    currentTime = nextArrival;
                }
            } else {
                break; // All processes have been completed
            }
        }

        const currentProcess = readyQueue.shift();
        const executionTime = Math.min(currentProcess.remainingBurstTime, quantum);

        if (currentProcess.startTime === -1) {
            currentProcess.startTime = currentTime;
        }

        const startTime = currentTime;
        currentTime += executionTime;
        currentProcess.remainingBurstTime -= executionTime;

        ganttChart.push({
            processId: currentProcess.name,
            start: startTime,
            end: currentTime,
        });

        // Add newly arrived processes to the ready queue during this quantum
        while (processIndex < processQueue.length && processQueue[processIndex].arrivalTime <= currentTime) {
            readyQueue.push(processQueue[processIndex]);
            processIndex++;
        }

        // If the process is not finished, add it back to the end of the queue
        if (currentProcess.remainingBurstTime > 0) {
            readyQueue.push(currentProcess);
        } else {
            // Process is finished, calculate its metrics
            const completionTime = currentTime;
            const waitingTime = completionTime - currentProcess.burstTime - currentProcess.arrivalTime;
            const turnaroundTime = completionTime - currentProcess.arrivalTime;
            const responseTime = currentProcess.startTime - currentProcess.arrivalTime;

            completedProcesses.push({
                ...currentProcess,
                completionTime,
                waitingTime,
                turnaroundTime,
                responseTime,
            });
        }
    }
    
    // Sort completed processes by original name for consistent display
    completedProcesses.sort((a, b) => a.name.localeCompare(b.name));

    // Consolidate the Gantt chart blocks
    const consolidatedGanttChart = [];
    if (ganttChart.length > 0) {
        let lastBlock = { ...ganttChart[0] };
        for (let i = 1; i < ganttChart.length; i++) {
            if (ganttChart[i].processId === lastBlock.processId) {
                lastBlock.end = ganttChart[i].end;
            } else {
                consolidatedGanttChart.push(lastBlock);
                lastBlock = { ...ganttChart[i] };
            }
        }
        consolidatedGanttChart.push(lastBlock);
    }


    const totalWaitingTime = completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaroundTime = completedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);
    const totalResponseTime = completedProcesses.reduce((sum, p) => sum + p.responseTime, 0);
    const avgWaitingTime = totalWaitingTime / processes.length;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const avgResponseTime = totalResponseTime / processes.length;
    const totalExecutionTime = currentTime;

    return {
        ganttChart: consolidatedGanttChart,
        processMetrics: completedProcesses,
        avgWaitingTime,
        avgTurnaroundTime,
        avgResponseTime,
        totalExecutionTime,
    };
};