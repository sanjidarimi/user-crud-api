# User CRUD REST API

A scalable, modular RESTful API built with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **MongoDB**.

## Features

- **Full CRUD Support**: Endpoints to Create, Read (all and single), Update, and Delete users.
- **Modular 3-Layer Architecture**: Clear separation of concerns across `Routes`, `Controllers`, and `Services`.
- **Database Modeling**: MongoDB integration via Prisma ORM utilizing native `ObjectId` mapping.
- **Type Safety**: Strict TypeScript configurations without `any` types.
- **Robust Error Handling**: Handles duplicate emails (`409 Conflict`), invalid MongoDB ObjectIds (`400 Bad Request`), and missing records (`404 Not Found`).

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma ORM
- **Database**: MongoDB (Atlas)
- **Development Tooling**: `tsx`, `dotenv`

---

## Database Model

Defined in `prisma/schema.prisma`:

| Field | Type | Attributes / Constraints | Description |
|---|---|---|---|
| `id` | `String` | `@id @default(auto()) @map("_id") @db.ObjectId` | MongoDB Native ObjectId |
| `name` | `String` | — | User's full name |
| `email` | `String` | `@unique` | Unique email address |
| `age` | `Int` | — | Age (non-negative integer) |

---

## Project Structure

```text
user-crud-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.ts
│   ├── modules/
│   │   └── user/
│   │       ├── user.interface.ts
│   │       ├── user.service.ts
│   │       ├── user.controller.ts
│   │       └── user.route.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json