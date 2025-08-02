export const quickSort = (arr) => {
    const steps = [];
    let roundCount = 0;

    function partition(low, high) {
        roundCount++;
        const pivot = arr[high];
        let i = low - 1;
        steps.push({ array: [...arr], type: 'round', round: roundCount, pivotIndex: high });

        for (let j = low; j < high; j++) {
            steps.push({ array: [...arr], type: 'compare', indices: [j, high] });
            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    steps.push({ array: [...arr], type: 'swap', indices: [i, j] });
                }
            }
        }
        if (i + 1 !== high) {
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            steps.push({ array: [...arr], type: 'swap', indices: [i + 1, high] });
        }
        steps.push({ array: [...arr], type: 'sorted', indices: [i + 1] });
        return i + 1;
    }

    function sort(low, high) {
        if (low < high) {
            const pi = partition(low, high);
            sort(low, pi - 1);
            sort(pi + 1, high);
        }
        if (low === high) {
            steps.push({ array: [...arr], type: 'sorted', indices: [low] });
        }
    }

    steps.push({ array: [...arr], type: 'start' });
    sort(0, arr.length - 1);

    return steps;
};
