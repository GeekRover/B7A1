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

// problem 3:
type StringOrNumber = string | number;

const checkType = (str: StringOrNumber) => {
  if (typeof str === "string") {
    return "String";
  } else if (typeof str === "number") {
    return "Number";
  }
};

// Sample Input 1:
checkType("Hello");

// Sample Input 2:
checkType(42);


