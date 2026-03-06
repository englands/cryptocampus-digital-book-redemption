import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, UserLibraryEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { MOCK_BOOKS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/health-check', (c) => c.json({ success: true, data: { status: 'healthy' }}));
  // BOOK CATALOG API
  app.get('/api/books', (c) => {
    return ok(c, MOCK_BOOKS);
  });
  // USER LIBRARY
  app.get('/api/library/:address', async (c) => {
    const address = c.req.param('address').toLowerCase();
    if (!address) return bad(c, 'address required');
    const library = new UserLibraryEntity(c.env, address);
    // Check if user has a library, if not return empty array instead of failing
    if (!await library.exists()) {
      return ok(c, []);
    }
    const books = await library.getOwnedBooks();
    return ok(c, books);
  });
  app.post('/api/library/:address/add', async (c) => {
    const address = c.req.param('address').toLowerCase();
    const { bookId } = (await c.req.json()) as { bookId?: string };
    if (!address || !bookId) return bad(c, 'address and bookId required');
    const library = new UserLibraryEntity(c.env, address);
    // Ensure the record exists in index if it doesn't
    if (!await library.exists()) {
      await UserLibraryEntity.create(c.env, { id: address, bookIds: [] });
    }
    const updatedBooks = await library.addOpenBook(bookId);
    return ok(c, updatedBooks);
  });
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // DELETE HELPERS
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
}