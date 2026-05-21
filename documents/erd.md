# E-commerce Database ERD (W2)

## Tables

### USER
- id (PK)
- email (UNIQUE, NOT NULL)
- password_hash (NOT NULL)
- name (NOT NULL)
- created_at, updated_at

### EVENT (Products)
- id (PK)
- title
- description
- price
- currency
- date, time, venue, capacity
- created_at, updated_at

### CART
- id (PK)
- user_id (FK → USER, NULLABLE)
- session_id (VARCHAR, NULLABLE)
- total_price (DECIMAL, calculated)
- created_at, updated_at
- UNIQUE: Either user_id OR session_id (one cart per user max)

### CART_ITEM
- id (PK)
- cart_id (FK → CART, NOT NULL)
- event_id (FK → EVENT, NOT NULL)
- quantity (INT, NOT NULL)
- unit_price (DECIMAL, NOT NULL, snapshot at purchase time)
- created_at, updated_at

### CUSTOMER_ORDER
- id (PK)
- user_id (FK → USER, NOT NULL) - orders always belong to users
- total_amount (DECIMAL, snapshot)
- status (ENUM: pending, completed, cancelled)
- created_at, updated_at

### ORDER_ITEM
- id (PK)
- customer_order_id (FK → CUSTOMER_ORDER, NOT NULL)
- event_id (FK → EVENT, NOT NULL)
- quantity (INT, NOT NULL)
- unit_price (DECIMAL, NOT NULL, snapshot)
- created_at, updated_at

## Relationships
- USER → EVENT (one user creates many events)
- USER → CART (one user has one active cart)
- CART → CART_ITEM (one cart has many items)
- EVENT → CART_ITEM (one event appears in many carts)
- USER → CUSTOMER_ORDER (one user has many orders)
- CUSTOMER_ORDER → ORDER_ITEM (one order has many items)