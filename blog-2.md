# Writing DRY Code using`Pick` and `Omit` — TypeScript Utility Types

## Introduction

In a large Typescript project one of the common problem is **code duplication**, writing the same type or interface again and again. Lets assume we have a `User` interface but we need some of the fields of that interface in multiple places in our codebase. Should we create new interfaces of those specific fields every time we need them??

TypeScripts **`Pick`** and **`Omit`** utility types fixes this issue. They helps us create multiple slices from one "master interface" as we need them without writing new interfaces each time. This is called the **DRY (Don't Repeat Yourself)** principle.

## Understanding: Code Duplication

First lets see what happens when we dont follow DRY:

```typescript
// Master interface
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  isAdmin: boolean;
}

// ❌ bad approach — সব জায়গায় আলাদা করে type লেখা
interface UserProfile {
  id: number; // User থেকে copy 
  name: string; // User থেকে copy
  email: string; // User থেকে copy 
}

interface UserPreview {
  id: number; // আবার copy
  name: string; // আবার copy
}

interface UserForRegistration {
  name: string; // আবার!
  email: string;
  password: string;
}
```

In this approach if the name of the user changes we have to manually change it everywhere. This type of code is more pron to error and hard to mantain.

## `Pick` — We only take what we need

`Pick<Type, Keys>` takes a specific fields from an type and creates a new type.

### Syntax:

```typescript
Pick<OriginalType, "field1" | "field2" | "field3">;
```

### Example:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  isAdmin: boolean;
}

// ✅ শুধু public profile fields
type UserProfile = Pick<User, "id" | "name" | "email">;
// Result: { id: number; name: string; email: string; }

// ✅ শুধু preview-এর জন্য প্রয়োজনীয় fields
type UserPreview = Pick<User, "id" | "name">;
// Result: { id: number; name: string; }

// ✅ Registration form-এর fields
type UserRegistrationForm = Pick<User, "name" | "email" | "password">;
// Result: { name: string; email: string; password: string; }
```

Now lets use them:

```typescript
function showUserProfile(user: UserProfile) {
  console.log(`${user.id}: ${user.name} (${user.email})`);
  // user.password — এখানে access করা যাবে না! TypeScript error দেবে। 
}

function renderUserCard(user: UserPreview) {
  return `<div class="card"><h2>${user.name}</h2></div>`;
}

async function registerUser(formData: UserRegistrationForm): Promise<void> {
  // password আছে, কিন্তু id বা isAdmin নেই 
  await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}
```

---

## `Omit` — Removing what we dont need

`Omit<Type, Keys>` is the complete oposite of `Pick`. it removes the fields we dont need and creates a new type. When we need most of the fields of an object but dont need all of them we use `Omit`.

### Syntax:

```typescript
Omit<OriginalType, "fieldToExclude1" | "fieldToExclude2">;
```

### Example:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  isAdmin: boolean;
}

// ✅ password বাদ দিয়ে public user data
type PublicUser = Omit<User, "password">;
// Result: { id: number; name: string; email: string; createdAt: Date; isAdmin: boolean; }

// ✅ নতুন user তৈরির সময় id এবং createdAt বাদ 
type CreateUserInput = Omit<User, "id" | "createdAt">;
// Result: { name: string; email: string; password: string; isAdmin: boolean; }

// ✅ Database update-এর জন্য — id পরিবর্তন করা যাবে না
type UpdateUserInput = Omit<User, "id" | "createdAt" | "password">;
// Result: { name: string; email: string; isAdmin: boolean; }
```

---

## Combine use of `Pick` and `Omit`

Sometimes we need nested or combined type:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pick ও Omit একসাথে — e-commerce cart item
type CartItem = Pick<Product, "id" | "name" | "price"> & {
  quantity: number; // নতুন field added
};

// Partial ও Omit মিলিয়ে — update form যেখানে সব field optional
type UpdateProductInput = Partial<
  Omit<Product, "id" | "createdAt" | "updatedAt">
>;

const cartItem: CartItem = {
  id: "prod-123",
  name: "Laptop",
  price: 75000,
  quantity: 2,
};

const updateData: UpdateProductInput = {
  price: 70000, // শুধু price update করছি — অন্য fields optional
};
```

---

## `Pick` vs `Omit` — When to use which one??

```typescript
interface BigInterface {
  a: string;
  b: number;
  c: boolean;
  d: Date;
  e: string[];
  f: object;
  // ...etc
}

// ✅ যদি কম field দরকার হয় —  use Pick 
type SmallSlice = Pick<BigInterface, "a" | "b">; // মাত্র ২টি field চাই

// ✅ যদি বেশিরভাগ field দরকার হয় — use Omit 
type AlmostAll = Omit<BigInterface, "f">; // শুধু একটি বাদ দিতে চাই
```

| Scenario                                     | Preferred Choice |
| -------------------------------------------- | ---------------- |
| Only need 2-3 fields                         | `Pick`           |
| Need to use most of the field except for few | `Omit`           |
| Excluding sensitive data (password)          | `Omit`           |
| Specific subset select                       | `Pick`           |

---

## Conclusion

`Pick` and `Omit` are two powerful utility type of Typescript that helps us follow the **DRY principle**.

- **`Pick`**: Takes neccessary fields from Master type.
- **`Omit`**: Removes unecessary fields from Master type.

To conclude, if we use `Pick` and `Omit`:

- We dont need to write the same type information again and again.
- When we change master interface every derived type gets automatically updated
- Code maintainance becomes easier
- Ensures Type safety  

