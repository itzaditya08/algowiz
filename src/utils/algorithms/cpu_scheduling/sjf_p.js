export const sjf_p = (processes) => {
    // Make a deep copy to avoid modifying original objects and track remaining burst time
    const processQueue = processes.map(p => ({ ...p, remainingBurstTime: p.burstTime, isCompleted: false, startTime: -1 }));
    const completedProcesses = [];
    let currentTime = 0;
    const ganttChart = [];

    // Loop until all processes are completed
    while (completedProcesses.length < processes.length) {
        // Find all processes that have arrived and are not yet completed
        const arrivedProcesses = processQueue.filter(p => p.arrivalTime <= currentTime && !p.isCompleted);

        if (arrivedProcesses.length === 0) {
            // If no processes are ready, increment time to the next arrival
            if (completedProcesses.length === processes.length) break;
            const nextArrival = Math.min(...processQueue.filter(p => !p.isCompleted).map(p => p.arrivalTime));
            if (nextArrival > currentTime) {
                 // Add an idle block to the Gantt chart if needed
                if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === 'Idle') {
                    ganttChart[ganttChart.length - 1].end = nextArrival;
                } else {
                    ganttChart.push({ processId: 'Idle', start: currentTime, end: nextArrival });
                }
                currentTime = nextArrival;
            }
            continue;
        }

        // Find the process with the minimum remaining burst time
        arrivedProcesses.sort((a, b) => a.remainingBurstTime - b.remainingBurstTime);
        const currentProcess = arrivedProcesses[0];

        // Check for preemption
        if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId !== currentProcess.name) {
            // New process with shorter burst time arrived, preempt
            ganttChart.push({
                processId: currentProcess.name,
                start: currentTime,
                end: currentTime + 1,
            });
        } else if (ganttChart.length === 0) {
            // First process to run
            ganttChart.push({
                processId: currentProcess.name,
                start: currentTime,
                end: currentTime + 1,
            });
        } else {
            // Continue running the same process
            ganttChart[ganttChart.length - 1].end += 1;
        }

        // Update response time on first run
        if (currentProcess.startTime === -1) {
            currentProcess.startTime = currentTime;
        }

        // Decrement remaining burst time and increment time
        currentProcess.remainingBurstTime -= 1;
        currentTime += 1;

        // Check if the process is completed
        if (currentProcess.remainingBurstTime === 0) {
            currentProcess.isCompleted = true;
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
    
    // Sort completed processes by original name for consistent display
    completedProcesses.sort((a, b) => a.name.localeCompare(b.name));

    // Calculate final metrics
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