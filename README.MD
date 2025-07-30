# 🧪 Cypress API Testing for DummyJSON

This project contains end-to-end API tests for the [DummyJSON](https://dummyjson.com) fake REST API using **Cypress + TypeScript**. It covers various endpoints related to `/products`, including searching, sorting, filtering by category, and full CRUD operations.

---

## 🚀 Features

- ✅ GET `/products` - list, pagination, sorting, ordering
- 🔍 GET `/products/search` - search by keyword
- 🔢 GET `/products/:id` - validation and edge cases
- 📦 GET `/products/categories` - list of categories
- 📂 GET `/products/category/:category` - category filtering
- ✍️ POST, PUT, PATCH, DELETE `/products` - full CRUD testing
- 🧰 Modular helper methods in POM-style (`/api` folder)
- 🔎 TypeScript typings for Product entity

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/dummyjson-api-tests.git
cd dummyjson-api-tests
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run tests (all)

```bash
npx cypress run
```

### 4. Run tests in UI mode

```bash
npx cypress open
```

### 5. Run a specific file

To run only the tests from a specific file (e.g., `categories.cy.ts`):

```bash
npx cypress run --spec "cypress/e2e/categories.cy.ts"
```

Or via the Cypress UI by selecting the file manually.

---

## 🧱 Project Structure

```
.
├── cypress/
│   ├── e2e/
│   │   ├── products.cy.ts
│   │   ├── search.cy.ts
│   │   ├── categories.cy.ts
│   │   ├── crud.cy.ts
│   ├── api/
│   │   └── products.ts   # POM-style reusable methods
│   └── types/
│       └── product.ts    # Type definitions
├── tsconfig.json
├── cypress.config.ts
├── README.md
```

---

## ⚠️ Known Issue: Sorting by Title in Ascending Order

### Problem

When testing the endpoint `GET /products` with the query parameters `sortBy=title&order=asc`, the test might fail even though the API returns correctly sorted data.

### Example Failure

```
AssertionError: expected -1 to be at least 0
```

### Cause

JavaScript’s `localeCompare()` method is case-sensitive by default. This means titles like `"Apple"` and `"airpods"` may be evaluated in the wrong order due to their letter casing — capital letters are treated as lower in order than lowercase ones in Unicode comparison.

### Solution in Tests

To fix this issue and make comparisons consistent, convert both titles to lowercase before comparing:

```ts
for (let i = 1; i < products.length; i++) {
  expect(
    products[i].title
      .toLowerCase()
      .localeCompare(products[i - 1].title.toLowerCase()),
  ).to.be.at.least(0);
}
```

### Why It Matters

Without adjusting for casing, the test will throw false negatives even when the API works as expected. Normalizing the casing ensures the test reflects real-world alphabetical expectations.

---

## 📬 Feedback & Contributions

Feel free to open issues or pull requests for improvements, ideas, or bug fixes.

---

## 📄 License

This project is open-source and free to use under the [MIT License](LICENSE).
