export const heapSort = (arr) => {
    const steps = [];
    const n = arr.length;
    let roundCount = 0;

    function heapify(n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            steps.push({ array: [...arr], type: 'compare', indices: [largest, left] });
            if (arr[left] > arr[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            steps.push({ array: [...arr], type: 'compare', indices: [largest, right] });
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            steps.push({ array: [...arr], type: 'swap', indices: [i, largest] });
            heapify(n, largest);
        }
    }

    steps.push({ array: [...arr], type: 'start', message: 'Building max heap...' });
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }
    steps.push({ array: [...arr], type: 'round', round: ++roundCount, message: 'Heap built.' });

    steps.push({ array: [...arr], type: 'start', message: 'Sorting...' });
    for (let i = n - 1; i > 0; i--) {
        roundCount++;
        [arr[0], arr[i]] = [arr[i], arr[0]];
        steps.push({ array: [...arr], type: 'swap', indices: [0, i] });
        steps.push({ array: [...arr], type: 'sorted', indices: [i] });

        heapify(i, 0);
    }
    steps.push({ array: [...arr], type: 'sorted', indices: [0] });
    
    return steps;
};
