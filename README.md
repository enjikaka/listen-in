# LastFM Scrobbles over Server-Sent Events

Small Deno service, deployed on Deno Deploy, for getting scrobbles live over SSE.

Deployed on: `https://listen-in.deno.dev/:username` (check mine: [https://listen-in.deno.dev/enjikaka](https://listen-in.deno.dev/enjikaka))

This is what powers the "nowe playing"-bubble that exists on the top right of [my website](https://jeremy.se/) when I listen to music.

## Events

### user-info

On first connection you get the [user information](https://github.com/enjikaka/listen-in/blob/ea221947bb8c0f97b7d86757980b9ca1507b371b/lastfm.ts#L6) as an event

```ts
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
```

with data from [https://www.last.fm/api/show/user.getInfo](https://www.last.fm/api/show/user.getInfo)

Example:
```
event: user-info
data: {"name":"enjikaka","age":"0","subscriber":"0","realname":"Jeremy Karlsson","bootstrap":"0","playcount":"62161","artist_count":"8592","playlists":"0","track_count":"18317","album_count":"13875","image":[{"url":"https://lastfm.freetls.fastly.net/i/u/34s/6c7b1d3e6e4c1f13282d2aff44d83334.png","size":34},{"url":"https://lastfm.freetls.fastly.net/i/u/64s/6c7b1d3e6e4c1f13282d2aff44d83334.png","size":64},{"url":"https://lastfm.freetls.fastly.net/i/u/174s/6c7b1d3e6e4c1f13282d2aff44d83334.png","size":174},{"url":"https://lastfm.freetls.fastly.net/i/u/300x300/6c7b1d3e6e4c1f13282d2aff44d83334.png","size":300}],"registered":{"unixtime":"1341093986","#text":1341093986},"country":"Sweden","gender":"n","url":"https://www.last.fm/user/enjikaka","type":"user"}
```

### scrobble

When tracks begin scrobbling, you'll get a scrobble event

```ts
interface Scrobble {
   url: string,
   title: string,
   artist: string,
   image: Array<{ url: string, size: number }>,
   checksum: string,
   tidal: number,
}
```

Example:
```
id: 4a2d9c44104963e3caf8c9cef5e01620b79f3b35
event: scrobble
data: {"url":"https://www.last.fm/music/Pegboard+Nerds,+EMEL,+Rayhem/_/With+You","title":"With You","artist":"Pegboard Nerds, EMEL, Rayhem","image":[{"url":"https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png","size":34},{"url":"https://lastfm.freetls.fastly.net/i/u/64s/2a96cbd8b46e442fc41c2b86b821562f.png","size":64},{"url":"https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png","size":174},{"url":"https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png","size":300}],"tidal":380270409,"checksum":"4a2d9c44104963e3caf8c9cef5e01620b79f3b35"}
```
