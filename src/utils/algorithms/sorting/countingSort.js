export const countingSort = (arr) => {
    const steps = [];
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    steps.push({ array: [...arr], type: 'start', message: 'Counting occurrences...' });

    // Store count of each character
    for (let i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
        steps.push({ array: [...arr], type: 'round', round: 1, message: 'Counting step' });
    }
    steps.push({ array: [...arr], type: 'place', countArray: [...count] });

    // Store cumulative count
    steps.push({ array: [...arr], type: 'round', round: 2, message: 'Calculating cumulative counts...' });
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    steps.push({ array: [...arr], type: 'place', countArray: [...count] });


    // Place elements in sorted order
    steps.push({ array: [...arr], type: 'round', round: 3, message: 'Placing elements...' });
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
        steps.push({ array: [...output], type: 'place', indices: [count[arr[i] - min] + 1], originalIndex: i });
    }
    
    // Copy output array to arr
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
    }
    steps.push({ array: [...arr], type: 'sorted', indices: Array.from({length: arr.length}, (_, k) => k) });

    return steps;
};
