export const mergeSort = (arr) => {
    const steps = [];

    function merge(tempArr, left, mid, right) {
        let i = left;
        let j = mid + 1;
        let k = left;

        steps.push({ array: [...arr], type: 'round', message: `Merging subarray from ${left} to ${right}` });

        while (i <= mid && j <= right) {
            steps.push({ array: [...arr], type: 'compare', indices: [i, j] });
            if (arr[i] <= arr[j]) {
                tempArr[k] = arr[i];
                i++;
            } else {
                tempArr[k] = arr[j];
                j++;
            }
            k++;
        }
        while (i <= mid) {
            tempArr[k] = arr[i];
            i++;
            k++;
        }
        while (j <= right) {
            tempArr[k] = arr[j];
            j++;
            k++;
        }
        for (let l = left; l <= right; l++) {
            // Visualize the sorted elements being placed back
            arr[l] = tempArr[l];
            steps.push({ array: [...arr], type: 'swap', indices: [l] });
        }
    }

    function sort(tempArr, left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            sort(tempArr, left, mid);
            sort(tempArr, mid + 1, right);
            merge(tempArr, left, mid, right);
        }
    }

    const tempArr = [...arr];
    steps.push({ array: [...arr], type: 'start' });
    sort(tempArr, 0, arr.length - 1);
    steps.push({ array: [...arr], type: 'sorted', indices: Array.from({length: arr.length}, (_, i) => i) });

    return steps;
};
