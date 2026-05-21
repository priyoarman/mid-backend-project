import {
  listEvents,
  countEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "#models/events.js";

/**
 * Event controller (MVC example)
 *
 * This controller intentionally demonstrates how route handlers are grouped
 * for a single domain entity inside an MVC-style backend structure.
 *
 * The trainee is not expected to already be familiar with MVC as a pattern,
 * but they are expected to continue working within the structure established
 * by this skeleton.
 *
 * For that reason, this file serves two purposes:
 * 1. provide a working example of a controller handler used in the project
 * 2. show the expected controller shape as the API grows
 *
 * Important:
 * - Not every exported handler in this file is part of the required trainee scope
 * - Some handlers are placeholders included only to demonstrate controller structure
 * - Optional placeholders should only be implemented if optional/additional
 *   project scope is explicitly taken on
 */

/**
 * GET /api/events
 *
 * Working required example of a controller-layer "list" handler.
 *
 * Query Parameters:
 * - page (number, optional, default = 0)
 *
 * Pagination Strategy:
 * - Fixed page size (PAGE_SIZE)
 * - offset = page * PAGE_SIZE
 * - totalItems calculated via countEvents()
 * - totalPages = ceil(totalItems / PAGE_SIZE)
 *
 * Response Shape:
 * {
 *   data: Array<Event>,
 *   meta: {
 *     page: number,
 *     pageSize: number,
 *     totalItems: number,
 *     totalPages: number
 *   }
 * }
 *
 * Notes:
 * - Filtering can be added later by mapping req.query -> filters object
 * - Sorting validation should be handled before passing orderBy
 */
export async function getEvents(req, res, next) {
  try {
    const PAGE_SIZE = Number(req.query.pageSize) || 20;

    // Parse page safely (ensure positive integer, 1-based)
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const offset = (page - 1) * PAGE_SIZE;

    const filters = {};
    if (req.query.q) {
      filters.search = req.query.q;
    }

    const data = await listEvents(filters, {
      limit: PAGE_SIZE,
      offset,
      orderBy: "id",
      order: "asc",
    });

    const totalItems = await countEvents(filters);
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    res.json({
      data,
      meta: {
        page,
        pageSize: PAGE_SIZE,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * OPTIONAL STRUCTURE PLACEHOLDER
 *
 * This handler is included to demonstrate how a controller file may contain
 * additional entity actions beyond "list".
 *
 * It is NOT part of the required trainee scope unless optional/admin
 * functionality is explicitly added to the project.
 */
export async function getEventById(req, res, next) {
  try {
    const event = await findEventById(req.params.id);

    if (!event) {
      const error = new Error("Event not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ data: event });
  } catch (error) {
    next(error);
  }
}

/**
 * OPTIONAL STRUCTURE PLACEHOLDER
 *
 * This handler exists only to illustrate where a controller-layer "create"
 * action would live in the MVC structure.
 *
 * It is NOT required for the base trainee project unless optional/admin
 * scope is explicitly added.
 */
export async function postEvent(req, res, next) {
  // OPTIONAL TODO: implement this handler only if optional scope is taken on
  try {
    await createEvent(req.body);

    return res.status(501).json({
      error:
        "Optional placeholder: postEvent is intentionally not implemented in the base skeleton",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * OPTIONAL STRUCTURE PLACEHOLDER
 *
 * This handler exists only as an example of expected controller structure
 * for future entity update actions.
 *
 * It is NOT part of the required trainee implementation in the default scope.
 */
export async function patchEvent(req, res, next) {
  // OPTIONAL TODO: implement this handler only if optional scope is taken on
  try {
    await updateEvent(req.params.id, req.body);

    return res.status(501).json({
      error:
        "Optional placeholder: patchEvent is intentionally not implemented in the base skeleton",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * OPTIONAL STRUCTURE PLACEHOLDER
 *
 * This handler exists only to illustrate where a controller-layer "delete"
 * action would be placed in the same MVC controller file.
 *
 * It is NOT part of the required trainee implementation in the default scope.
 */
export async function removeEvent(req, res, next) {
  // OPTIONAL TODO: implement this handler only if optional scope is taken on
  try {
    await deleteEvent(req.params.id);

    return res.status(501).json({
      error:
        "Optional placeholder: removeEvent is intentionally not implemented in the base skeleton",
    });
  } catch (error) {
    next(error);
  }
}
