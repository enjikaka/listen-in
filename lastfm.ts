interface UserImage {
  size: number,
  url: string
}

interface UserInfo {
 playlists: string,
 playcount: number,
 gender: string,
 name: string,
 subscriber: string,
 url: string,
 country: string,
 image: UserImage[],
 registered: { unixtime: number },
 type: string,
 age: string,
 bootstrap: string,
 realname: string
}

interface LastFMUserImage {
  '#text': string,
  url: string,
  size: 'small' | 'medium' | 'large' | 'extralarge'
}

function rewriteImageFormat(image: LastFMUserImage) {
  const sizeToPixel = {
    small: 34,
    medium: 64,
    large: 174,
    extralarge: 300
  };

  image.url = image['#text'];

  return {
    url: image['#text'] || 'https://lastfm-img2.akamaized.net/i/u/64s/c6f59c1e5e7240a4c0d427abd71f3dbb',
    size: sizeToPixel[image.size]
  };
}

function parseUserInfo(user: any): UserInfo {
  const image = user.image.map(rewriteImageFormat);

  return {
    ...user,
    image
  };
}

const apiKey = Deno.env.get('LASTFM_API_KEY');

export default class LastFM {
  static async getInfo (user: string) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${user}&api_key=${apiKey}&format=json`;
    const response = await fetch(url);
    const json = await response.json();

    /** @type {UserInfo} */
    const userInfo = parseUserInfo(json.user);

    return userInfo;
  }

  static async getScrobblingTrack (user: string) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&limit=1&extended=1&format=json`;
    const response = await fetch(url);
    const json = await response.json();
    const latestTrack = json.recenttracks.track[0];

    const image = latestTrack.image.map(rewriteImageFormat);

    // Already played
    if (latestTrack.date !== undefined) {
      return undefined;
    }

    return {
      url: latestTrack.url,
      title: latestTrack.name,
      artist: latestTrack.artist,
      image
    };
  }
}