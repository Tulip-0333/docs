---
name: Types
---
# Types

This page is an appendix of [v2](v2), showing the types most commonly used in the Delta API.

<!-- toc -->

* [Chat Channel](#chat-channel)
* [Client](#client)
* [Location](#location)
* [Action](#action)
* [Multiplayer Match](#multiplayer-match)
* [Multiplayer Match Slot](#multiplayer-match-slow)
* [Multiplayer Match Beatmap](#multiplayer-match-beatmap)

<!-- tocstop -->

## Chat Channel

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`connected_clients`| `integer`  | Number of clients connected to the channel
`description` | `string`  | Description of the channel
`display_name` | `string`  | Chat channel displayed on the game client. Relevant only for `#multiplayer` and `#spectator`, otherwise it's the same as the `name` field.
`moderated` | `bool` | Whether the channel is in moderated mode or not. When a channel is in moderated mode, only admins can write to it. Normal users can still read that channel.
`name` | `string` | Name of the channel. Special cases: <ul><li>Multiplayer channels have the following name: `#multi_MATCHID` (eg: `#multi_10`).</li><li>Spectator channels have the following name:  `#spect_HOSTUSERID` (eg: `#spect_1000`).</li></ul>
`public_read` | `bool` | Whether this channel is publicly accessible (can be joined by non-admins).
`public_write` | `bool` | Whether normal users can send messages to this channel. This is different than `moderated`! The only channel that has `public_write = true` as of right now is `#announce`.
`temporary` | `bool` | Whether the channel is temporary or not. Temporary channel are special channels that get disposed on particular conditions. `#spect_*` and `#multi_*` channels are _usually_ temporary channels. `#spectator` channels get disposed when all spectators stop spectating, `#multiplayer` channels get disposed when the multiplayer match is disposed. The only exception are special matches (created through the API), whose `#multiplayer` channel gets disposed when disposing the match through the API or when the Multiplayer Manager disposes the match automatically for being inactive for too long.

```json
{
    "connected_clients": 1,
    "description": "Main ripple channel",
    "display_name": "#osu",
    "moderated": false,
    "name": "#osu",
    "public_read": true,
    "public_write": true,
    "temporary": false
}
```

## Client

The following fields are present for Game clients, IRC clients and Web socket clients:

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`api_identifier`| `string` | The [API Identifier] of this client.
`location` | `null`;`object` | Client's [Location](#location), or `null` if it was disabled by the client.
`privileges` | `number` | The user privileges (from the database)
`silence_end_time` | `null`;`number` | UNIX timestamp of when the silence of this user expires. `null` if the client is not silenced. Please note that this field may take a moment to update from the correct value in the database if the user has just been silenced.
`type` | `number` | [Client type](#appendix#client-types) (tldr: `0 = game; 1 = irc; 2 = fake; 3 = websocket;`)
`user_id` | `number` | 
`username` | `string` | **Non-safe** username

---

The following additional fields are present ONLY if the client is a game client:

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`action`| `object`  | Current [Action](#action)
`bancho_privileges`| `number` | [Bancho Privileges](appendix#bancho-privileges) of this client

---

A Fake client has ONLY THE FOLLOWING fields:

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`type`| `number`  | Always `2`.
`user_id`| `number` | User ID of this Fake client
`username`| `number`  | Username of the Fake Client

_[More info on Fake clients](appendix#†%3A-a-note-on-fake-clients)_.

tldr: you'll almost never see Fake clients. Only some FokaBot messages in the websocket API will be sent by a Fake client. You'll never see a fake client in the HTTP API.

---


```json
{
    "action": {
        "beatmap": {
            "id": 0,
            "md5": ""
        },
        "game_mode": 0,
        "id": 0,
        "mods": 0,
        "text": ""
    },
    "api_identifier": "@0f23d692-ee91-4a68-af68-080bcfdc1dcf",
    "bancho_privileges": 54,
    "location": null,
    "privileges": 15728639,
    "silence_end_time": null,
    "type": 0,
    "user_id": 1000,
    "username": "Nyo"
}
```

## Location


Field name   | Type | Value
-------------|------|-------
`latitude` | `number`  | 
`longitude` | `number`  | 
`country_code` | `string`  | TODO

* Is `null` if the server could not determine an appoximate location of the client or if the client has disabled the world map feature.

```json
{
    "country_code": 16,
    "latitude": -33.494,
    "longitude": 143.2104
}
```

## Action


Field name   | Type | Value
-------------|------|-------
`beatmap.id` | `number`  | Beatmap ID (†)
`beatmap.md5` | `string`  | MD5 hash of the .osu file of the beatmap being played (†)
`game_mode` | `number`  | [Game Mode]
`id` | `number`  | [Action ID](appendix#actions)
`mods` | `number`  | Currently selected [Mods]. (†)
`text` | `str` | Additional text displayed in the "user panel" in-game. When playing, it contains the name of the song.

* **†:** Always present, but relevant only when playing/multiplaying/editing/etc. It's `0` or `""` (empty string) if it's not relevant for the current action or if it was not set by the client.

```json
{
    "beatmap": {
        "id": 1619338,
        "md5": "1382e11330b22f7f8bdb467719cd4e32"
    },
    "game_mode": 0,
    "id": 2,
    "mods": 0,
    "text": "Yoko Takahashi - Zankoku na Tenshi no These <TV.Size Version> [Extreme]"
}
```

## Multiplayer Match

Field name   | Type | Value
-------------|------|-------
`api_owner_user_id` | `null`;`number` | <ul><li>If the match was created from the game, this field is `null`.</li><li>If the match was created through the API, it contains the user id of whoever created the match</li></ul>
`beatmap` | `object`  | [Multiplayer Beatmap](#multiplayer-beatmap) object of the current song
`free_mod` | `bool`  | Whether the match has free mods enabled or not
`game_mode` | `number`  | Current [Game Mode]
`has_password` | `bool` | Whether the match is password protected
`host_api_identifier` | `null`;`string` | [API Identifier] of the host of this match. An hostless match will have this field equal to `null` (matches can be turned hostless only through the API)
`id` | `number`  | Internal ID of this match. **This is the ID you must use to identify the match within the API**. More information on Match IDs can be found [in the appendix](appendix#multiplayer-match-ids)
`in_progress` | `bool` | Whether this match is in progress or not
`mods` | `number` | Current [Mods]
`name` | `string` | Name of the multiplayer match
`private_match_history` | `bool` | Whether the match history for this match is private or not.
`scoring_type` | `number` | Current [Scoring Type]
`slots` | `[16]object` | List of [Slot]s that make up the match. _This list always contains 16 Slot objects_
`special` | `bool` | Whether this is a special match. Special matches don't get destroyed when all clients leave. Match created through the API iff special matches.
`team_type` | `number` | Current [Team Type]
`vinse_id` | `number` | The Vinse ID (multiplayer match history) of this match. Note that the Vinse ID is generated when the first game of the match finishes and is **never** generated for matches whose history is private. In those cases, this field will be `null`. More information on Vinse IDs can be found [in the appendix](appendix#multiplayer-match-ids)

```json
{
    "code": 200,
    "matches": [
        {
            "api_owner_user_id": null,
            "beatmap": {
                "id": 1221602,
                "md5": "ca637f9791736695472141689c95b8f6",
                "name": "Saiya - Remote Control [Take Control!]"
            },
            "free_mod": 0,
            "game_mode": 0,
            "has_password": false,
            "host_api_identifier": "@035a6247-c541-45be-9813-82f2e041b3b1",
            "id": 3,
            "in_progress": true,
            "mods": 0,
            "name": "Aventusxxx's game",
            "private_match_history": false,
            "scoring_type": 0,
            "slots": [
                {
                    "mods": 0,
                    "status": 32,
                    "team": 0,
                    "user": {
                        "action": {
                            "beatmap": {
                                "id": 1221602,
                                "md5": "ca637f9791736695472141689c95b8f6"
                            },
                            "game_mode": 0,
                            "id": 12,
                            "mods": 0,
                            "text": "Saiya - Remote Control [Take Control!]"
                        },
                        "api_identifier": "@035a6247-c541-45be-9813-82f2e041b3b1",
                        "bancho_privileges": 0,
                        "location": null,
                        "privileges": 3,
                        "silence_end_time": null,
                        "type": 0,
                        "user_id": 84169,
                        "username": "Aventusxxx"
                    }
                },
                {
                    "mods": 0,
                    "status": 32,
                    "team": 0,
                    "user": {
                        "action": {
                            "beatmap": {
                                "id": 1221602,
                                "md5": "ca637f9791736695472141689c95b8f6"
                            },
                            "game_mode": 0,
                            "id": 12,
                            "mods": 0,
                            "text": "Saiya - Remote Control [Take Control!]"
                        },
                        "api_identifier": "@c76e3671-9887-4a94-8374-e50dc65e1fb4",
                        "bancho_privileges": 0,
                        "location": null,
                        "privileges": 3,
                        "silence_end_time": null,
                        "type": 0,
                        "user_id": 84246,
                        "username": "NoHandNoSkill"
                    }
                },
                {
                    "mods": 0,
                    "status": 1,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 1,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 1,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 1,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 1,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 1,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                },
                {
                    "mods": 0,
                    "status": 2,
                    "team": 0,
                    "user": null
                }
            ],
            "special": false,
            "team_type": 0
        }
    ]
}
```

## Multiplayer Match Slot
Field name   | Type | Value
-------------|------|-------
`mods` | `number` | This slot's [Mods]. <ul><li>If `free_mod = false`, all `slot`s will have their `mods` equal to the match `mods`.</li><li>If `free_mod = true`, each slot `mods` will contain the global mods AND the slot specific mods (`slot.mods = match.mods | mods_specific_to_this_slot if match.free_mods else match.mods`).</li></ul>
`status` | `number` | [Slot Status] of this slot
`team` | `number` | [Team] of this slot
`user` | `null`;`object` | [Client](#client) object of this slot, `null` if there's nobody in this slot (the slot is either open but empty, or locked).

An occupied slot:
```json
{
    "mods": 0,
    "status": 32,
    "team": 0,
    "user": {
        "action": {
            "beatmap": {
                "id": 1221602,
                "md5": "ca637f9791736695472141689c95b8f6"
            },
            "game_mode": 0,
            "id": 12,
            "mods": 0,
            "text": "Saiya - Remote Control [Take Control!]"
        },
        "api_identifier": "@035a6247-c541-45be-9813-82f2e041b3b1",
        "bancho_privileges": 0,
        "location": null,
        "privileges": 3,
        "silence_end_time": null,
        "type": 0,
        "user_id": 84169,
        "username": "Aventusxxx"
    }
}
```

A free slot:
```json
{
    "mods": 0,
    "status": 1,
    "team": 0,
    "user": null
}
```

A locked slot:
```json
{
    "mods": 0,
    "status": 2,
    "team": 0,
    "user": null
}
```

## Multiplayer Beatmap
_Please note that a Multiplayer Beatmap object has an extra field (`name`) compared to the Beatmap object found in [Action](#action)s_

Field name   | Type | Value
-------------|------|-------
`id` | `number` | Beatmap ID
`md5` | `string` | MD5 hash of the .osu file of this beatmap. Can be used to identify the beatmap on the official osu!api as well.
`name` | `string` | Readable name of the beatmap, _usually_ formatted as `<ARTIST> - <SONG_NAME> [<DIFFICULTY>]`

```json
{
    "id": 1221602,
    "md5": "ca637f9791736695472141689c95b8f6",
    "name": "Saiya - Remote Control [Take Control!]"
}
```



[API Identifier]: appendix#api-identifiers
[Game Mode]: appendix#modes-ids
[Mods]: https://github.com/ppy/osu-api/wiki#mods
[Team]: appendix#multiplayer-teams
[Slot Status]: appendix#multiplayer-slot-statuses
[Scoring Type]: appendix#multiplayer-scoring-types
[Team Type]: appendix#multiplayer-team-types
[Slot]: #multiplayer-match-slot
[Beatmap]: #beatmap