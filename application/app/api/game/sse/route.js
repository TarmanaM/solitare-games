import { addSseClient, removeSseClient } from '@/lib/sse';


// Handle Server-Sent Events stream connection
export async function GET() {
  let clientController = null;

  const stream = new ReadableStream({
    start(controller) {
      clientController = controller;
      addSseClient(controller);

      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('event: connected\ndata: {"status":"connected"}\n\n'));
    },
    cancel() {
      if (clientController) {
        removeSseClient(clientController);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
