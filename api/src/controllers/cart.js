import { v4 as uuidv4 } from "uuid";
import { Cart } from "#models/cart.js";
import { Order } from "#models/order.js";
import db from "#configs/database.js";

/**
 * Get or create session ID for guest users
 */
function getOrCreateSessionId(req) {
  if (!req.session) {
    req.session = {};
  }
  if (!req.session.id) {
    req.session.id = uuidv4();
  }
  return req.session.id;
}

/**
 * GET /api/cart
 * Get current user's cart (or guest cart)
 */
export async function getCart(req, res, next) {
  try {
    let cart;

    if (req.user) {
      // Authenticated user
      cart = await Cart.getByUserId(req.user.userId);
      if (!cart) {
        // Create cart for authenticated user
        cart = await Cart.create(req.user.userId);
      }
    } else {
      // Guest user
      const sessionId = getOrCreateSessionId(req);
      cart = await Cart.getBySessionId(sessionId);
      if (!cart) {
        // Create cart for guest
        cart = await Cart.create(null, sessionId);
      }
    }

    // Get cart with items
    const cartWithItems = await getCartWithItems(cart.id);

    res.status(200).json({
      data: {
        cart: cartWithItems,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cart/items
 * Add item to cart
 */
export async function addItemToCart(req, res, next) {
  try {
    const { eventId, quantity } = req.body;

    // Validation
    if (!eventId || quantity === undefined) {
      return res.status(400).json({
        error: {
          message: "eventId and quantity are required",
          status: 400,
        },
      });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        error: {
          message: "Quantity must be a positive integer",
          status: 400,
        },
      });
    }

    // Get or create cart
    let cart;
    if (req.user) {
      cart = await Cart.getByUserId(req.user.userId);
      if (!cart) {
        cart = await Cart.create(req.user.userId);
      }
    } else {
      const sessionId = getOrCreateSessionId(req);
      cart = await Cart.getBySessionId(sessionId);
      if (!cart) {
        cart = await Cart.create(null, sessionId);
      }
    }

    // Add item to cart
    await Cart.addItem(cart.id, eventId, quantity);

    // Get updated cart
    const cartWithItems = await getCartWithItems(cart.id);

    res.status(200).json({
      data: {
        cart: cartWithItems,
      },
    });
  } catch (error) {
    if (error.message === "Event not found") {
      return res.status(404).json({
        error: {
          message: "Event not found",
          status: 404,
        },
      });
    }
    next(error);
  }
}

/**
 * PUT /api/cart/items/{itemId}
 * Update cart item quantity or remove it
 */
export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!itemId) {
      return res.status(400).json({
        error: {
          message: "itemId is required",
          status: 400,
        },
      });
    }

    // Get cart item
    const cartItem = await db("cart_item").where("id", itemId).first();
    if (!cartItem) {
      return res.status(404).json({
        error: {
          message: "Cart item not found",
          status: 404,
        },
      });
    }

    // Verify cart ownership
    const cart = await db("cart").where("id", cartItem.cart_id).first();
    if (!cart) {
      return res.status(404).json({
        error: {
          message: "Cart not found",
          status: 404,
        },
      });
    }

    // Check if user has access to this cart
    if (req.user) {
      if (cart.user_id !== req.user.userId) {
        return res.status(403).json({
          error: {
            message: "Forbidden - Cannot modify another user's cart",
            status: 403,
          },
        });
      }
    } else {
      const sessionId = getOrCreateSessionId(req);
      if (cart.session_id !== sessionId) {
        return res.status(403).json({
          error: {
            message: "Forbidden - Cannot modify another user's cart",
            status: 403,
          },
        });
      }
    }

    // Handle removal (quantity = 0) or update
    if (quantity === 0 || quantity === undefined) {
      // Remove item
      await Cart.removeItem(itemId);
    } else {
      // Validate quantity
      if (quantity < 1 || !Number.isInteger(quantity)) {
        return res.status(400).json({
          error: {
            message: "Quantity must be a positive integer or 0 to remove",
            status: 400,
          },
        });
      }

      // Update quantity
      await db("cart_item").where("id", itemId).update("quantity", quantity);
      await Cart.updateTotal(cart.id);
    }

    // Get updated cart
    const cartWithItems = await getCartWithItems(cart.id);

    res.status(200).json({
      data: {
        cart: cartWithItems,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/cart/items/{itemId}
 * Remove cart item
 */
export async function deleteCartItem(req, res, next) {
  try {
    const { itemId } = req.params;

    // Validation
    if (!itemId) {
      return res.status(400).json({
        error: {
          message: "itemId is required",
          status: 400,
        },
      });
    }

    // Get cart item
    const cartItem = await db("cart_item").where("id", itemId).first();
    if (!cartItem) {
      return res.status(404).json({
        error: {
          message: "Cart item not found",
          status: 404,
        },
      });
    }

    // Verify cart ownership
    const cart = await db("cart").where("id", cartItem.cart_id).first();
    if (!cart) {
      return res.status(404).json({
        error: {
          message: "Cart not found",
          status: 404,
        },
      });
    }

    // Check if user has access to this cart
    if (req.user) {
      if (cart.user_id !== req.user.userId) {
        return res.status(403).json({
          error: {
            message: "Forbidden - Cannot modify another user's cart",
            status: 403,
          },
        });
      }
    } else {
      const sessionId = getOrCreateSessionId(req);
      if (cart.session_id !== sessionId) {
        return res.status(403).json({
          error: {
            message: "Forbidden - Cannot modify another user's cart",
            status: 403,
          },
        });
      }
    }

    // Remove item
    await Cart.removeItem(itemId);

    // Get updated cart
    const cartWithItems = await getCartWithItems(cart.id);

    res.status(200).json({
      data: {
        cart: cartWithItems,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cart/checkout
 * Checkout cart and create order (transactional)
 */
export async function checkoutCart(req, res, next) {
  try {
    // Only authenticated users can checkout
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: "Authentication required for checkout",
          status: 401,
        },
      });
    }

    // Get user's cart
    let cart = await Cart.getByUserId(req.user.userId);
    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create(req.user.userId);
    }

    // Check if cart has items
    const cartItems = await db("cart_item").where("cart_id", cart.id);
    if (cartItems.length === 0) {
      return res.status(400).json({
        error: {
          message: "Cart is empty",
          status: 400,
        },
      });
    }

    // Create order from cart (transactional)
    const order = await Order.createFromCart(req.user.userId, cart.id);

    // Get order with items
    const orderWithItems = await Order.getWithItems(order.id);

    res.status(201).json({
      data: {
        order: orderWithItems,
      },
    });
  } catch (error) {
    if (error.message === "Cart is empty") {
      return res.status(400).json({
        error: {
          message: "Cart is empty",
          status: 400,
        },
      });
    }
    next(error);
  }
}

async function getCartWithItems(cartId) {
  const cart = await db("cart").where("id", cartId).first();

  const items = await db("cart_item")
    .where("cart_item.cart_id", cartId)
    .join("event", "cart_item.event_id", "event.id")
    .select(
      "cart_item.id",
      "cart_item.event_id",
      "event.title",
      "cart_item.quantity",
      "cart_item.unit_price",
      db.raw("cart_item.quantity * cart_item.unit_price as total_price"),
    );

  return {
    id: cart.id,
    user_id: cart.user_id,
    session_id: cart.session_id,
    total_price: cart.total_price,
    items: items,
    created_at: cart.created_at,
    updated_at: cart.updated_at,
  };
}
