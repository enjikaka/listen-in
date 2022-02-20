import { serve } from 'https://deno.land/std@0.126.0/http/server.ts';
import LastFM from './lastfm.ts';

const textEncoder = new TextEncoder();
const createEvent = (eventName: string, data: Object) =>
  textEncoder.encode(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);

const eventTarget = new EventTarget();

async function checksum (data: string) {
  const encodedData = textEncoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-1', encodedData.buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

function observeScrobbles(user: string) {
  let lastUpdateChecksum: string;

  async function checkScrobble() {
    const scrobblingTrack = await LastFM.getScrobblingTrack(user);
    const newChecksum = await checksum(JSON.stringify(scrobblingTrack));

    if (scrobblingTrack !== undefined && newChecksum !== lastUpdateChecksum) {
      lastUpdateChecksum = newChecksum;
      eventTarget.dispatchEvent(new CustomEvent('scrobble', {
        detail: scrobblingTrack
      }));
    }
  }

  checkScrobble();
  setInterval(() => checkScrobble(), 5000);
}

async function userFeed (user: string): Promise<Response> {
  const userInfo = await LastFM.getInfo(user);

  const body = new ReadableStream<Uint8Array>({
    start: (controller) => {
      controller.enqueue(createEvent("user-info", userInfo));

      eventTarget.addEventListener('scrobble', e => {
        if (e instanceof CustomEvent) {
          controller.enqueue(createEvent('scrobble', e.detail));
        }
      });
    },
  });

  observeScrobbles(user);

  return new Response(body, {
    status: 200,
    headers: new Headers({
      "Connection": "Keep-Alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    }),
  });
}

function handleRequest (request: Request) {
  const url = new URL(request.url);
  const [, user] = url.pathname.split('/');

  if (!user) {
    throw new TypeError('You did not specify a user name.');
  }

  try {
    return userFeed(user);
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}

console.log("http://localhost:5000/");
serve(handleRequest, { port: 5000 });
