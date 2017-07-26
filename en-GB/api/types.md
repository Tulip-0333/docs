---
name: Types
---
# Types

This page is an appendix of [v1](v1), showing the types most commonly used in the API, like "user" and such. "..." in a field's value means it's obvious, and no explanation is required.

<!-- toc -->

* [User](#user)
* [ModeStats](#modestats)
* [Badge](#badge)
* [Beatmap](#beatmap)
* [Difficulty](#difficulty)
* [Score](#score)

<!-- tocstop -->

## User

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`id`         | `int`     | The ID of the user.
`username`   | `string`  | The username.
`username_aka` | `string`| Alternative username of the user (cannot be used for login).
`registered_on` | [time] | Date and time of when the user signed up on Ripple.
`privileges` | `uint64`  | Privileges of the user.
`latest_activity` | [time] | Date and time of when the user was last active on Ripple.
`country`    | `string`  | 2-letter country code, ISO 3166

```json
{
    "id": 999,
    "username": "FokaBot",
    "username_aka": "",
    "registered_on": "2016-01-11T21:41:20+01:00",
    "privileges": 3075579,
    "latest_activity": "2016-06-24T13:05:27+02:00",
    "country": "IT"
}
```

## ModeStats

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`ranked_score`| `int64`  | Sum of all the ranked scores done by the user for this mode.
`total_score` | `int64`  | Sum of all scores done in time for this mode.
`playcount`  | `int`     | Number of times the user played a map for this mode.
`replays_watched` | `int`| Number of times a play done by this user in this mode has been watched by someone else.
`total_hits` | `int64`   | Number of elements hit (circles, sliders, spinners, fruits...) for this mode.
`level`      | `float64` | Level of the user for this mode.
`accuracy`   | `float64` | Overall accuracy of the user.
`pp`         | `float64` | Weighted PP for this user in this mode. (Currently just an int, though it will get changed to float64 so consider it as a float, not an int)
`global_leaderboard_rank` | `int` | Position in the leaderboard for this user.
`country_leaderboard_rank` | `int` | Position in the country leaderboard for this user in their country.

```json
{
    "ranked_score": 561601521,
    "total_score": 1507798195,
    "playcount": 1104,
    "replays_watched": 7,
    "total_hits": 52509,
    "level": 61.17723833993767,
    "accuracy": 97.659744,
    "pp": 2147,
    "global_leaderboard_rank": 1418,
    "country_leaderboard_rank": 1
}
```

## Badge

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`id`         | `int`     | Badge ID
`name`       | `string`  | Name/Subtitle of the badge.
`icon`       | `string`  | Fontawesome class of the icon.

```json
{
    "id": 2,
    "name": "Developer",
    "icon": "fa-code"
}
```

## Beatmap

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`beatmap_id` | `int`     | ...
`beatmapset_id` | `int`  | ...
`beatmap_md5`| `string`  | Beatmap file MD5 hash
`song_name`  | `string`  | Name of the song (includes diff name, artist and title)
`ar`         | `float32` | Approach Rate
`od`         | `float32` | Overall Difficulty
`difficulty` | `float64` | Difficulty in osu! standard
`difficulty2`| [Difficulty](#difficulty) | Difficulty in all game modes
`max_combo`  | `int`     | Maximum combo achievable on the beatmap
`hit_length` | `int`     | Hit length of the beatmap (from the osu! API)
`ranked`     | `int`     | Ranked status, see [rankedStatuses.py](https://git.zxq.co/ripple/lets/src/master/constants/rankedStatuses.py)
`ranked_status_frozen` | `int` | There's a reason why it's an int, so store it as an int and not a bool, though of course `1` means it's frozen and `0` means it's not. If this is true, it means that the ranked status cannot change (beatmap ranked manually)
`latest_update` | [time] | datetime of when the beatmap was last updated **from the osu! API**

## Difficulty

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`std`        | `float64` | Difficulty for osu! standard.
`taiko`      | `float64` | Difficulty for Taiko.
`ctb`        | `float64` | Difficulty for Catch the Beat.
`mania`      | `float64` | Difficulty for osu!mania.

## Score

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`id`         | `int`     | The score ID.
`beatmap_md5`| `string`  | Beatmap MD5 hash.
`score`      | `int64`   | Score obtained playing the beatmap.
`max_combo`  | `int`     | Maximum combo achieved in the beatmap.
`full_combo` | `bool`    | Whether the score was a full combo or not.
`mods`       | `int`     | Enabled mods.
`count_300`  | `int`     | Number of 300s hit.
`count_100`  | `int`     | Number of 100s hit.
`count_50`   | `int`     | Number of 50s hit.
`count_geki` | `int`     | Number of gekis hit.
`count_katu` | `int`     | Number of katus hit.
`count_miss` | `int`     | Number of misses.
`time`       | [time]    | Datetime of when the score was achieved.
`play_mode`  | `int`     | Mode in which this score was achieved.
`accuracy`   | `float64` | Accuracy of the score.
`pp`         | `float32` | PP achieved with the score.
`rank`       | `string`  | In-game rank of the score (S, A, SS, SSH...).
`completed`  | `int`     | Whether the beatmap was completed or not (3 or 2)

[time]: appendix#time
