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

## Errors

Message type       | Explanation
-------------------|------------------------------------------------------------
`invalid_message_type` | The message sent is invalid. It contains either malformed JSON, a non-existing `type`, or was sent incorrectly.
`unexpected_error` | Equivalent of an HTTP 500. An error occurred and the server was unable to fulfill your request.
`not_found`        | Equivalent of an HTTP 404. The resource requested could not be found. For instance, in Identify this means the token doesn't exist.

## Identify

States the token of the client, so that requests for further information may be
requested.

### Data structure

Message type: `identify`

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

Message type: `subscribe_scores`

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
will be broadcasted, containing in the same object also:

- `user_id`, `int`, the ID of the user.
- `user`, `object`, the actual user.
  - `id`, `int`.
  - `username`, `string`.
  - `privileges`, [Privileges](appendix#privileges).

### Example

```json
> {"type":"subscribe_scores", "data": []}
< {"type":"subscribed_to_scores","data":[]}
< {"type":"new_score","data":{"id":1,"beatmap_md5":"3c8b50ebd781978beb39160c6aaf148c","score":25154,"max_combo":28,"full_combo":true,"mods":0,"count_300":8,"count_100":0,"count_50":0,"count_geki":3,"count_k
atu":0,"count_miss":0,"time":"2016-01-11T22:38:25+01:00","play_mode":0,"accuracy":100,"pp":0,"rank":"SS","completed":2,"user_id":1002,"user":{"id":1002,"username":"marcostudios","privileges":978427}}}
< {"type":"new_score","data":{"id":9,"beatmap_md5":"bed18c058f9c14a34f3ae2cf5602f907","score":16671380,"max_combo":648,"full_combo":false,"mods":0,"count_300":936,"count_100":13,"count_50":0,"count_geki":13
7,"count_katu":7,"count_miss":5,"time":"2016-01-12T03:00:10+01:00","play_mode":0,"accuracy":98.56744,"pp":150.9,"rank":"A","completed":3,"user_id":1001,"user":{"id":1001,"username":"Cammo29","privileges":
3}}}
< {"type":"new_score","data":{"id":24,"beatmap_md5":"aa6c411be1ec57732da09bea284bd200","score":419394,"max_combo":158,"full_combo":true,"mods":0,"count_300":102,"count_100":0,"count_50":0,"count_geki":31,"c
ount_katu":0,"count_miss":0,"time":"2016-01-12T10:03:57+01:00","play_mode":0,"accuracy":100,"pp":24.47,"rank":"SS","completed":3,"user_id":1002,"user":{"id":1002,"username":"marcostudios","privileges":978
427}}}
< {"type":"new_score","data":{"id":26,"beatmap_md5":"3e3bcf5780fceea9db861486e17e4e3f","score":4257994,"max_combo":540,"full_combo":true,"mods":0,"count_300":321,"count_100":3,"count_50":0,"count_geki":79,"
count_katu":3,"count_miss":0,"time":"2016-01-12T10:11:36+01:00","play_mode":0,"accuracy":99.38271,"pp":28.07,"rank":"S","completed":3,"user_id":1002,"user":{"id":1002,"username":"marcostudios","privileges
":978427}}}
```

## Set Restricted Visibility

Through this message, you can set whether you want to see information (such as
scores) pertaining to restricted users.

Please note that this only works if you have identified yourself and you have
the user privilege `AdminPrivilegeManageUsers`.

### Data structure

Message type: `set_restricted_visibility`.

A boolean. Set to true if you want to see restricted users, false if you don't.
If this command is not called, the default is always false.

### Response

A message of type `restricted_visibility_set`, containing as data the boolean,
which should be the same to that of the `set_restricted_visibility` message,
unless the condition specified in the introduction is not respected.

```json
{
 "data": true,
 "type": "restricted_visibility_set"
}
```

### Example

```json
> {"type":"set_restricted_visibility", "data": true}
< {"type":"restricted_visibility_set", "data": true}
```
