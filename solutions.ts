// problem 1:
const filterEvenNumbers = (arr: number[]): number[] => {
  const newArr: number[] = arr.filter((num) => num % 2 === 0);
  return newArr;
};

filterEvenNumbers([1, 2, 3, 4, 5, 6]);

// problem 2:

const reverseString = (inp: string): string => {
  let newStr: string = "";
  for (let i = inp.length - 1; i >= 0; i--) {
    newStr += inp[i];
  }

  return newStr;
};

reverseString("typescript");
