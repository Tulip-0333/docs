---
name: Websocket API
---
# Websocket API

> This is currently very beta. It may change anytime.

As a branch of the v1 API, there is also an endpoint that gives the possibility
to enstabilish an ongoing connection with the server through a websocket. This
is mostly useful when you want to be notified when an user you follow sets a
score. This way you don't consume your bandwith constantly polling our server
and our server doesn't get stressed by the huge amount of connections we get.
Everybody wins!

To start a connection, you must connect to this websocket URL:

```
wss://api.ripple.moe/api/v1/ws
```

Once you're connected, you should get a `{"type":"connected"}` to say you're
connected to the websocket, and you can do all of your magic.

**IMPORTANT:** If you want to avoid getting disconnected for a timeout, it is
recommended to send every 1 minute a message of type `"ping"` with no `"data"`.
This will get a response with a message of type `"pong"`.

If you want to see an example of an application done using websockets, you can
take a look at [ppstream](https://thehowl.github.io/ppstream/). It's pretty
straightforward, and is about 113 lines of JavaScript. You can take a look at
the source code [here](https://github.com/thehowl/ppstream/blob/gh-pages/index.html#L55-L171).

## Table of Contents

<!-- toc -->

* [Message structure](#message-structure)
* [Subscribe to score submission](#subscribe-to-score-submission)
  * [Data structure](#data-structure)
  * [Response](#response)
  * [Example](#example)

<!-- tocstop -->

## Message structure

All messages exchanged between client and server must always have a `type` as a
string. They may then optionally require or have a field `data`, which contains
the actual data to be passed.

For example:

```json
{
  "type": "new_score",
  "data": {
    "id": 1550231,
    "beatmap_md5": "d53c5651228156963e518ebffb207106",
    "score": 839982,
    "max_combo": 210,
    "full_combo": false,
    "mods": 1,
    "count_300": 478,
    "count_100": 72,
    "count_50": 6,
    "count_geki": 66,
    "count_katu": 31,
    "count_miss": 23,
    "time": "2017-02-19T19:04:24+01:00",
    "play_mode": 0,
    "accuracy": 86.873924,
    "pp": 18.3,
    "completed": 3,
    "user_id": 7904
  }
}
```

Or:

```json
{
  "type": "subscribe_scores",
  "data": []
}
```

## Identify

States the token of the client, so that requests for further information may be
requested.

### Data structure

JSON object containing the following fields:

- `token`, `string`, the API token to be used to identify.
- `is_bearer`, `bool`, set to true if the token comes from a login using OAuth.

### Response

It will trigger a response of type `identified`, containing some information
about the user.

```json
{
 "type": "identified",
 "data": {
  "id": 1009,
  "username": "Howl",
  "user_privileges": 1048575,
  "token_privileges": 0,
  "application_id": null
 }
}
```

### Example

```json
> {"type":"identify", "data": {"token": "dabb3a57b71ed2f92a08e9ee288b163d", "is_bearer": false}}
< {"type":"identified","data":{"id":1009,"username":"Howl","user_privileges":1048575,"token_privileges":0,"application_id":null}}
```

## Subscribe to score submission

Subscribes to score submission on the specified users and on the specified game modes.

### Data structure

Array of objects with the following fields:

- `user`, `int`, the user to track
- `modes`, `[]int`, the modes of the user of which scores to get. If not passed or an empty array `[]` is passed, it will subscribe to all scores, regardless of game mode.

if `null` or an empty array `[]` is passed, the client will get all submitted
scores.

### Response

Immediately, it will trigger a response to notify the client has been subscribed.

```json
{
  "type": "subscribed_to_scores",
  "data": []
}
```

After that, messages of type `new_score` containing data of type [Score](types#score)
will be broadcasted.

### Example

```json
> {"type": "subscribe_scores", "data": []}
< {"type":"subscribed","data":[]}
< {"type":"new_score","data":{"id":1550548,"beatmap_md5":"54b57ba3e5fc96c7e333979324a7928e","score":4280876,"max_combo":514,"full_combo":false,"mods":0,"count_300":334,"count_100":11,"count_50":0,"count_geki":50,"count_katu":11,"count_miss":0,"time":"2017-02-19T19:44:50+01:00","play_mode":0,"accuracy":97.8744,"pp":111,"completed":3,"user_id":25630}}
< {"type":"new_score","data":{"id":1550549,"beatmap_md5":"79f0fc11cffe5da06df2fb07062fec9f","score":2800850,"max_combo":368,"full_combo":false,"mods":0,"count_300":541,"count_100":38,"count_50":2,"count_geki":83,"count_katu":21,"count_miss":8,"time":"2017-02-19T19:44:57+01:00","play_mode":0,"accuracy":94.057724,"pp":0,"completed":2,"user_id":11267}}
< {"type":"new_score","data":{"id":1550550,"beatmap_md5":"aa33d46ffe640dfe2ee7106f52633f1e","score":118914,"max_combo":43,"full_combo":false,"mods":8,"count_300":101,"count_100":14,"count_50":4,"count_geki":31,"count_katu":10,"count_miss":5,"time":"2017-02-19T19:45:01+01:00","play_mode":0,"accuracy":85.752686,"pp":29.9,"completed":3,"user_id":1990}}
< {"type":"new_score","data":{"id":1550551,"beatmap_md5":"cb2d158708233552c4af0c5bbbb56248","score":534218,"max_combo":136,"full_combo":false,"mods":8,"count_300":613,"count_100":105,"count_50":16,"count_geki":515,"count_katu":389,"count_miss":71,"time":"2017-02-19T19:45:02+01:00","play_mode":3,"accuracy":83.382095,"pp":32.33863,"completed":3,"user_id":25550}}
< {"type":"new_score","data":{"id":1550552,"beatmap_md5":"e714d7a3188e4a44ed018886cbdc35ad","score":2911530,"max_combo":283,"full_combo":false,"mods":0,"count_300":347,"count_100":36,"count_50":3,"count_geki":63,"count_katu":14,"count_miss":6,"time":"2017-02-19T19:45:09+01:00","play_mode":0,"accuracy":91.70918,"pp":0,"completed":2,"user_id":13045}}
< {"type":"new_score","data":{"id":1550553,"beatmap_md5":"91cbc22713457f02e1b3a5fdcd9764a9","score":980738,"max_combo":588,"full_combo":true,"mods":0,"count_300":52,"count_100":0,"count_50":0,"count_geki":179,"count_katu":6,"count_miss":0,"time":"2017-02-19T19:45:09+01:00","play_mode":3,"accuracy":99.15612,"pp":20.51701,"completed":3,"user_id":4238}}
```
