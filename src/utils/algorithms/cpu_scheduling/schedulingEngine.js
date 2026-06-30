export const generateSchedulingSteps = (processes, algorithm, quantum = 2) => {
    const steps = [];
    // Deep copy and setup
    let procs = processes.map(p => ({ ...p, remainingTime: p.burstTime, completionTime: 0, waitingTime: 0, turnaroundTime: 0, started: false }));
    let currentTime = 0;
    let readyQueue = [];
    let currentProcess = null;
    let ganttChart = [];
    let completed = 0;
    let quantCount = 0;

    const snap = (msg) => {
        steps.push({
            time: currentTime,
            readyQueue: readyQueue.map(p => p.id),
            activeProcessId: currentProcess ? currentProcess.id : null,
            ganttChart: [...ganttChart],
            processesState: JSON.parse(JSON.stringify(procs)),
            message: msg
        });
    };

    snap("System Initialized. Awaiting process arrivals.");

    while (completed < procs.length || currentTime < 100) { // hard limit to prevent infinite loops
        if (completed === procs.length) break;

        // 1. Enqueue newly arrived processes
        procs.filter(p => p.arrivalTime === currentTime && p.remainingTime > 0 && !readyQueue.find(rq => rq.id === p.id) && p.id !== currentProcess?.id)
             .forEach(p => readyQueue.push(p));

        // 2. Preemption & Completion Logic
        if (currentProcess) {
            if (currentProcess.remainingTime === 0) {
                currentProcess.completionTime = currentTime;
                currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
                currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
                completed++;
                ganttChart.push({ id: currentProcess.id, end: currentTime });
                currentProcess = null;
                quantCount = 0;
            } else if (algorithm === 'Round Robin' && quantCount === quantum) {
                readyQueue.push(currentProcess);
                ganttChart.push({ id: currentProcess.id, end: currentTime });
                currentProcess = null;
                quantCount = 0;
            } else if (algorithm === 'SJF (Preemptive)') {
                const shorter = readyQueue.find(p => p.remainingTime < currentProcess.remainingTime);
                if (shorter) {
                    readyQueue.push(currentProcess);
                    ganttChart.push({ id: currentProcess.id, end: currentTime });
                    currentProcess = null;
                }
            } else if (algorithm === 'Priority (Preemptive)') {
                const higher = readyQueue.find(p => p.priority < currentProcess.priority); // lower number = higher priority
                if (higher) {
                    readyQueue.push(currentProcess);
                    ganttChart.push({ id: currentProcess.id, end: currentTime });
                    currentProcess = null;
                }
            }
        }

        // 3. Dispatch Next Process
        if (!currentProcess && readyQueue.length > 0) {
            // Sort Ready Queue based on algorithm
            if (algorithm === 'SJF (Non-Preemptive)' || algorithm === 'SJF (Preemptive)') {
                readyQueue.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
            } else if (algorithm === 'Priority (Non-Preemptive)' || algorithm === 'Priority (Preemptive)') {
                readyQueue.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
            } // FCFS and RR use default FIFO push/shift order

            currentProcess = readyQueue.shift();
            quantCount = 0;
            ganttChart.push({ id: currentProcess.id, start: currentTime });
        }

        snap(currentProcess ? `Executing P${currentProcess.id} at Time ${currentTime}` : `Time ${currentTime}: CPU Idle`);

        // 4. Tick Clock
        if (currentProcess) {
            currentProcess.remainingTime--;
            quantCount++;
        }
        currentTime++;
    }

    snap("All processes completed.");
    return steps;
};