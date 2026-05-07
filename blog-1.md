# Why `any` is more dangerous than `unknown` data type? - Understanding type narrowing in TypeScript.

## Introduction

The main reason why we use Typescript is ensuring `type-safety`, so that we dont use wrong data types in wrong places. But many developers likes to take the shortcut of using `any` type.

When we use `any` Typescript doesnt check the data type. It creates a **type safety hole** . In this blog we will learn why `any` type should not be used, instead why should we use `unknown` and how does type narrowing in typescript actually works.

---

## `any` — The Type Safety Hole

`any` is the most "relaxed" type in Typescript. When we use `any` type Typescript Compiler doesnt check the type of the variable.

```typescript
function processData(data: any) {
  // TypeScript compile time এ   কোনো error দেবে না — কিন্তু runtime-এ crash হতে পারে!
  console.log(data.name.toUpperCase());
  console.log(data.age + 10);
}

processData(null); // ❌ Runtime Error: Cannot read properties of null
processData(42); // ❌ Runtime Error: data.name is undefined
processData({ name: "Rahim", age: 25 }); // ✅ This will work
```

Here we dont get any eroor in compile-time, but everything breaks at runtime. This is the main problem of `any` type it makes the compiler silent.

---

## `unknown` — The Safer Alternative

`unknown` type is the type-safe version of `any` type. It says I dont know which data type the variable is but i will confirm it before using it.

```typescript
function processData(data: unknown) {
  // ❌ এটি compile time এ error দেবে
  console.log(data.name.toUpperCase()); // Error: Object is of type 'unknown'

  // ✅ আগে type check করতে হবে, তারপর ব্যবহার করা যাবে
  if (typeof data === "object" && data !== null && "name" in data) {
    console.log((data as { name: string }).name.toUpperCase());
  }
}
```

`unknown` type forces us to confirm the data type before using it. This is type safety!

---

## Type Narrowing — Helping Typescript Understand the Data type

**Type Narrowing** is a process where we strictly tell Typescript where which data type which be used where. Typescript then lets us work us in that narrowed type.

### 1. Type Narrowing using `typeof`

```typescript
function formatValue(value: unknown): string {
  if (typeof value === "string") {
    // এখানে TypeScript জানে value একটি string
    return value.toUpperCase();
  }

  if (typeof value === "number") {
    // এখানে TypeScript জানে value একটি number
    return value.toFixed(2);
  }

  return String(value);
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(3.14159)); // "3.14"
```

### 2. Type Narrowing using `instanceof`

```typescript
function handleError(error: unknown): string {
  if (error instanceof Error) {
    // এখানে TypeScript জানে error হলো Error object
    return `Error: ${error.message}`;
  }

  if (typeof error === "string") {
    return `Message: ${error}`;
  }

  return "An unknown error occurred";
}

handleError(new Error("File not found")); // "Error: File not found"
handleError("Something went wrong"); // "Message: Something went wrong"
handleError(404); // "An unknown error occurred"
```

### 3. Type Narrowing using Custom Type Guard

Sometime we need to use custom type check function:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Custom Type Guard — return type হলো "value is User"
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "email" in value
  );
}

function processApiResponse(response: unknown) {
  if (isUser(response)) {
    // এখানে TypeScript জানে response হলো User type
    console.log(`Welcome, ${response.name}!`);
    console.log(`Your email: ${response.email}`);
  } else {
    console.log("Invalid user data received.");
  }
}

// API থেকে আসা অজানা data safely process করা যাচ্ছে
processApiResponse({ id: 1, name: "Rahim", email: "rahim@example.com" }); // ✅
processApiResponse({ id: 1, name: "Karim" }); // email নেই means Invalid
```

---

## `any` vs `unknown` Data type:

```typescript
// ❌ any is dangerous here
function dangerousProcess(input: any) {
  input.someMethod(); // No error at compile time, may crash at runtime
  input.unknownProp; // No error — TypeScript is blind here
  const result: string = input; // No error — the type safety is gone here
}

// ✅ where using unknown is safe
function safeProcess(input: unknown) {
  // input.someMethod();  // ❌ Compile Error — TypeScript protects us

  if (typeof input === "string") {
    console.log(input.toUpperCase()); // ✅ TypeScript confirms: the input is string here
  }

  if (typeof input === "object" && input !== null) {
    console.log(JSON.stringify(input)); // ✅ Safe to stringify
  }
}
```

---

## Conclusion

| বিষয়                        | `any`   | `unknown` |
| ---------------------------- | ------- | --------- |
| Type check                   | ❌ No   | ✅ Yes    |
| Type-safe?                   | ❌ No   | ✅ Yes    |
| Type Narrowing before using? | ❌ No   | ✅ Yes    |
| Risk of runtime crash        | ⚠️ High | ✅ less   |

To sum up, **`any`** type is a safety hole in Typescripts type system which leads to many runtime errors and bugs. On the other hand, **`unknown`** lets us use any data type but it makes us confirm the data type before using it. And **Type Narrowing** is a tool which lets us tell Typescript where to use which type of data.


