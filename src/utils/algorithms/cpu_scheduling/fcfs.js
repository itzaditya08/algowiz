export const fcfs = (processes) => {
    // Sort processes by arrival time to simulate FCFS
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    // Initialize metrics
    let currentTime = 0;
    const ganttChart = [];
    const processMetrics = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let totalResponseTime = 0;

    for (const process of sortedProcesses) {
        // Wait time for the current process
        const waitingTime = Math.max(0, currentTime - process.arrivalTime);
        totalWaitingTime += waitingTime;

        // Response time is the waiting time for the first time the process gets the CPU
        const responseTime = waitingTime;
        totalResponseTime += responseTime;

        // Completion time for the current process
        const completionTime = currentTime + process.burstTime;

        // Turnaround time is the completion time minus the arrival time
        const turnaroundTime = completionTime - process.arrivalTime;
        totalTurnaroundTime += turnaroundTime;

        // Add to Gantt chart data
        ganttChart.push({
            processId: process.name,
            start: currentTime,
            end: completionTime,
        });

        // Add to process metrics table
        processMetrics.push({
            ...process,
            completionTime,
            waitingTime,
            turnaroundTime,
            responseTime,
        });

        // Update current time for the next process
        currentTime = completionTime;
    }

    const totalExecutionTime = currentTime;
    const avgWaitingTime = totalWaitingTime / processes.length;
    const avgTurnaroundTime = totalTurnaroundTime / processes.length;
    const avgResponseTime = totalResponseTime / processes.length;

    return {
        ganttChart,
        processMetrics,
        avgWaitingTime,
        avgTurnaroundTime,
        avgResponseTime,
        totalExecutionTime,
    };
};