---
name: Types
---
# Types

This page is an appendix of [v2](v2), showing the types most commonly used in the Delta API.

<!-- toc -->

* [Chat Channel](#chat-channel)
* [Client](#client)

<!-- tocstop -->

## Chat Channel

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`connected_clients`| `integer`  | Number of clients connected to the channel
`description` | `string`  | Description of the channel
`display_name` | `string`  | Chat channel displayed on the game client. Relevant only for `#multiplayer` and `#spectator`, otherwise it's the same as the `name` field.
`moderated` | `bool` | Whether the channel is in moderated mode or not. When a channel is in moderated mode, only admins can write to it. Normal users can still read that channel.
`name` | `string` | Name of the channel. Multiplayer channels have the following name: `#multi_{match_id}`. Spectator channels have the following name:  `#spect_{host_user_id}`.
`public_read` | `bool` | Whether this channel is publicly accessible (can be joined by non-admins).
`public_write` | `bool` | Whether normal users can send messages to this channel. This is different than `moderated`! The only channel that has `public_write = true` as of right now is `#announce`.
`temporary` | `bool` | Whether the channel is temporary or not. Temporary channel are special channels that get disposed when all users leave it. `#spect_*` and `#multi_*` channels are temporary channels.

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

The following fields are present ONLY if the client is a game client:

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`action`| [Action](#action)  | Current action
`bancho_privileges`| `integer` | [Bancho Privileges](appendix#bancho-privileges) of this client

The following fields always present:

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`api_identifier`| `integer` | The [API Identifier] of this client.
`location` | `null`;`object` | Client's [Location](#location), or `null` if it was disabled by the client.
`privileges` | `integer` | The user privileges (from the database)
`silence_end_time` | `null`;`integer` | UNIX timestamp of when the silence of this user expires. `null` if the client is not silenced. Please note that this field may take a moment to update from the correct value in the database if the user has just been silenced.
`type` | `integer` | [Client type](#appendix#client-types) (tldr: `0 = game; 1 = irc`)
`user_id` | `integer` | 
`username` | `string` | **Non-safe** username


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

* **†:** Always present, but relevant only when playing/multiplaying/editing/etc. Is 0 if it's not relevant for the current action of if it's not set.

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

[API Identifier]: appendix#api-identifiers
[Game Mode]: appendix#mode-ids
[Mods]: https://github.com/ppy/osu-api/wiki#mods