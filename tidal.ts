
const apiKey = Deno.env.get('TIDAL_API_KEY');

export async function search (query: string) {
  const url = new URL('https://listen.tidal.com/v1/search');

  url.searchParams.append('query', query);
  url.searchParams.append('types', 'TRACKS');
  url.searchParams.append('countryCode', 'NO');

  if (apiKey) {
    url.searchParams.append('token', apiKey);
  }

  const response = await fetch(url.toString());

  return response.json();
}