// Server-Sent Events (SSE) broadcaster registry

const globalForSse = globalThis;

if (!globalForSse.sseClients) {
  globalForSse.sseClients = new Set();
}

/**
 * Register a client response controller
 */
export function addSseClient(controller) {
  globalForSse.sseClients.add(controller);
}

/**
 * Remove a client response controller
 */
export function removeSseClient(controller) {
  globalForSse.sseClients.delete(controller);
}

/**
 * Broadcast event to all active SSE subscribers
 */
export function broadcastSseEvent(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  const encoder = new TextEncoder();
  const encoded = encoder.encode(payload);

  for (const controller of globalForSse.sseClients) {
    try {
      controller.enqueue(encoded);
    } catch {
      globalForSse.sseClients.delete(controller);
    }
  }
}
