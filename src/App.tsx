import { useRef, useState } from "react";
import { flushSync } from "react-dom";

const initialBoardValue = [
  16, 37, 31, 25, 14, 11, 15, 32, 34, 24, 8, 13, 17, 40, 33, 10, 7, 23, 36, 15,
  22, 19, 36, 7, 40, 27, 9, 29, 35, 26, 1, 17, 20, 4, 9, 17, 25, 27, 38, 18,
];
// const initialBoardValue = Array.from({length: 40}, () => Math.floor(Math.random() * 40 +1));

export default function App() {
  const [sortedArray, setSortedArray] = useState(initialBoardValue);

  const currentArray = useRef(sortedArray);
  currentArray.current = sortedArray;

  function sleep() {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  const bubbleSort_ = async (sArray: any) => {
    //todo break early if nothing has been swapped

    for (var i = 0; i < sArray.length; i++) {
      // Last i elements are already in place
      for (var j = 0; j < sArray.length - i - 1; j++) {
        // Checking if the item at present iteration
        // is greater than the next iteration
        if (sArray[j] > sArray[j + 1]) {
          // If the condition is true then swap them
          var temp = sArray[j];
          sArray[j] = sArray[j + 1];
          sArray[j + 1] = temp;
          console.log("should sleep");
          await sleep();
          flushSync(() => {
            //doesn work
            //setSortedArray(prev => sArray)
            //works
            setSortedArray((prev) => [...sArray]);
          });
        }
      }
    }
  };

  const quickSort = async (arr: number[], low: number, high: number) => {
    async function swap(arr: number[], i: number, j: number) {
      //notes: as number because
      //Type 'number | undefined' is not assignable to type 'number'.
      // Type 'undefined' is not assignable to type 'number'.ts(2322)
      let temp = arr[i] as number;
      arr[i] = arr[j] as number; //notes
      arr[j] = temp; //notes
      await sleep();
      flushSync(() => {
        setSortedArray((prev) => [...arr]);
      });
    }

    async function partition(
      arr: number[],
      low: number,
      high: number
    ): Promise<number> {
      let pivot = arr[high] as number;

      // Index of smaller element and
      // indicates the right position
      // of pivot found so far
      let i = low - 1;

      for (let j = low; j <= high - 1; j++) {
        // If current element is smaller
        // than the pivot
        if ((arr[j] as number) < pivot) {
          // Increment index of
          // smaller element
          i++;
          await swap(arr, i, j);
        }
      }
      await swap(arr, i + 1, high);
      return i + 1;
    }

    if (low < high) {
      // pi is partitioning index, arr[p]
      // is now at right place
      let pi = await partition(arr, low, high);

      // Separately sort elements before
      // partition and after partition
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }

    flushSync(() => {
      setSortedArray((prev) => [...arr]);
    });
  };

  async function partition(arr: number[], start: number, end: number) {
    // Taking the last element as the pivot
    const pivotValue = arr[end] as number;
    let pivotIndex = start;

    for (let i = start; i < end; i++) {
      let a = await sleep();
      flushSync(() => {
        setSortedArray((prev) => [...arr]);
      });

      if ((arr[i] as number) < pivotValue) {
        // Swapping elements
        [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]] as [
          number,
          number
        ];
        // Moving to next element
        pivotIndex++;
      }
    }

    // Putting the pivot value in the middle
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]] as [
      number,
      number
    ];
    return pivotIndex;
  }

  async function quickSortIterative(array: number[]) {
    let arr = [...array];
    // Creating an array that we'll use as a stack, using the push() and pop() functions
    let stack: number[] = [];
    // Adding the entire initial array as an "unsorted subarray"
    stack.push(0);
    stack.push(arr.length - 1);

    // There isn't an explicit peek() function
    // The loop repeats as long as we have unsorted subarrays
    while ((stack[stack.length - 1] as number) >= 0) {
      // Extracting the top unsorted subarray
      let end = stack.pop() as number;
      let start = stack.pop() as number;

      let pivotIndex: number = await partition(arr, start, end);

      // If there are unsorted elements to the "left" of the pivot,
      // we add that subarray to the stack so we can sort it later
      if (pivotIndex - 1 > start) {
        stack.push(start);
        stack.push(pivotIndex - 1);
      }

      // If there are unsorted elements to the "right" of the pivot,
      // we add that subarray to the stack so we can sort it later
      if (pivotIndex + 1 < end) {
        stack.push(pivotIndex + 1);
        stack.push(end);
      }
    }
    await sleep();
    flushSync(() => {
      setSortedArray((prev) => [...arr]);
    });

    console.log(
      "🚀 ~ file: sort.tsx ~ line 202 ~ quickSortIterative ~ stack",
      stack
    );
  }

  const sortAlgos: { [key: string]: Function } = {
    bubbleSort: bubbleSort_,
    quickSort: quickSort,
    quickSortIterative: quickSortIterative,
  };

  const runSorting = async (sortType: string) => {
    let sArray: number[] = [...currentArray.current];

    sortAlgos[sortType]!(sArray);
  };

  return (
    <div>
      {/* {JSON.stringify(sortedArray)} */}
      <button
        className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => runSorting("bubbleSort")}
      >
        Bubble sort
      </button>
      <button
        className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => runSorting("quickSortIterative")}
      >
        Quick Sort Interative
      </button>

      <div className="flex flex-col">
        {sortedArray.map((number, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#16324F",
              height: 20,
              width: 10 * number,
            }}
          >
            <span className="text-white">{number}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
