// problem 1:
const filterEvenNumbers = (arr: number[]): number[] => {
  const newArr: number[] = arr.filter((num) => num % 2 === 0);
  return newArr;
};
// Sample Input:
filterEvenNumbers([1, 2, 3, 4, 5, 6]);

// problem 2:
const reverseString = (inp: string): string => {
  let newStr: string = "";
  for (let i = inp.length - 1; i >= 0; i--) {
    newStr += inp[i];
  }

  return newStr;
};
// Sample Input:
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
// Sample Input:
checkType("Hello");
checkType(42);

// problem 4:
const getProperty = <x>(obj: x, key: keyof x) => {
  return obj[key];
};

// Sample Input:
const user = { id: 1, name: "John Doe", age: 21 };
getProperty(user, "name");
