---
name: Types
---
# Types

This page is an appendix of [v1](v1), showing the types most commonly used in
the API, like "user" and such.

<!-- toc -->

- [User](#user)
- [ModeStats](#modestats)
- [Badge](#badge)

<!-- tocstop -->

## User

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`id`         | `int`     | The ID of the user.
`username`   | `string`  | The username.
`username_aka` | `string`| Alternative username of the user (cannot be used for login).
`registered_on` | [time](appendix#time) | Date and time of when the user signed up on Ripple.
`privileges` | `uint64`  | Privileges of the user.
`latest_activity` | [time](appendix#time) | Date and time of when the user was last active on Ripple.
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
    "global_leaderboard_rank": 1418
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

