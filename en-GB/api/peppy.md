---
name: peppy API
---
<!--
Reminder to self:
for i in en-GB/api/*.md; do markdown-toc -i "$i"; done
-->

# peppy API

The peppy API is an API built to mimic the behaviour of the official osu! API. Currently most requests are supported, however there are a few that for various reasons are still left out. In case you've never used the osu! API: this is a **very** simple API, and from analysing the official one you can easily understand that it's just a couple of PHP scripts smashed together that return the JSON-encoded values of what is returned by a database query. Nevertheless, we try to mimic it as much as possible, to make it's 100% backwards-compatible with the osu! API.

In-depth documentation can be found at https://github.com/ppy/osu-api/wiki

The base url is:

```bash
https://ripple.moe/api
```

E.g., the URL for a GET /get_user request would be

```bash
https://ripple.moe/api/get_user
```

As this API aims to mimic the osu! API, you can also access it using osu.ppy.sh (having osu.ppy.sh redirected to the Ripple server in the hosts file).

```bash
https://osu.ppy.sh/api/get_user
```

The peppy API has no authorization whatsoever. Further, Rate Limiting is IP-only, meaning the API token passed is completely disregarded and does not influence the rate limiting. All requests are limited to 60 requests per minute per IP, period.

All requests will result in a 200 response, except for: 404 for requests not implemented yet, 500 in case something went **horribly** wrong, 502 or 503 in case we fucked up something on our webserver.

Implemented requests:

```
[x] get_beatmaps (partially)
[x] get_user
[x] get_scores
[x] get_user_best
[x] get_user_recent
[ ] get_match (empty array is always returned)
[ ] get_replay
```

## Table of Contents

<!-- toc -->

  * [User](#user)
    + [GET /get_user](#get-get_user)
      - [Parameters](#parameters)
      - [Examples](#examples)
  * [User scores](#user-scores)
    + [GET /get_user_recent](#get-get_user_recent)
      - [Parameters](#parameters-1)
      - [Examples](#examples-1)
    + [GET /get_user_best](#get-get_user_best)
      - [Parameters](#parameters-2)
      - [Examples](#examples-2)
  * [Scores](#scores)
    + [GET /get_scores](#get-get_scores)
      - [Parameters](#parameters-3)
      - [Examples](#examples-3)
  * [Beatmaps](#beatmaps)
    + [GET /get_beatmaps](#get-get_beatmaps)
      - [Parameters](#parameters-4)
      - [Examples](#examples-4)
- [Notes](#notes)
  * [Modes IDs](#modes-ids)
  * [Ranked statuses on Ripple](#ranked-statuses-on-ripple)

<!-- tocstop -->

## User

### GET /get_user

Retrieve an user's information.

#### Parameters

Name | Description                                                              | Required?
-----|--------------------------------------------------------------------------|----------
`u`  | Username or user ID of the requested user.                               | Yes
`m`  | Number of the gamemode for which you are requesting data. [See Modes IDs](#modes-ids) | No (defaults 0)
`type` | Specify whether `u` is an user ID or an username. Use `string` for usernames. By default, if `u` is possibly a number, it is always first checked if an user with such user ID exists in the database. If you're passing an username, make sure to pass it having type=string, otherwise things **will** fuck up sooner or later. | No

(`k` and `eventdays` are discarded)

#### Examples

```http
$ http 'ripple.moe/api/get_user?u=Howl'
HTTP/1.1 200 OK
CF-RAY: 2f77105ea7110e48-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 216
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:32:20 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "accuracy": "97.659744",
        "count100": "0",
        "count300": "0",
        "count50": "0",
        "count_rank_a": "0",
        "count_rank_s": "0",
        "count_rank_ss": "0",
        "country": "IT",
        "events": null,
        "level": "61.17723833993767",
        "playcount": "1104",
        "pp_country_rank": "0",
        "pp_rank": "1389",
        "pp_raw": "2147",
        "ranked_score": "561601521",
        "total_score": "1507798195",
        "user_id": "1009",
        "username": "Howl"
    }
]
```

```http
$ http 'ripple.moe/api/get_user?u=jakads&m=3'
HTTP/1.1 200 OK
CF-RAY: 2f77195d455f0e5a-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 215
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:38:28 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "accuracy": "95.37737",
        "count100": "0",
        "count300": "0",
        "count50": "0",
        "count_rank_a": "0",
        "count_rank_s": "0",
        "count_rank_ss": "0",
        "country": "KR",
        "events": null,
        "level": "28.092912468671678",
        "playcount": "321",
        "pp_country_rank": "0",
        "pp_rank": "3",
        "pp_raw": "65651",
        "ranked_score": "84255667",
        "total_score": "143862883",
        "user_id": "3325",
        "username": "jakads"
    }
]
```

## User scores

### GET /get_user_recent

Get an user's recent scores.

#### Parameters

Name | Description                                                              | Required?
-----|--------------------------------------------------------------------------|----------
`u`  | Username or user ID of the user whose scores you're requesting.          | Yes
`m`  | Number of the gamemode for which you are requesting data. [See Modes IDs](#modes-ids) | No (defaults 0)
`type` | Specify whether `u` is an user ID or an username. Use `string` for usernames. By default, if `u` is possibly a number, it is always first checked if an user with such user ID exists in the database. If you're passing an username, make sure to pass it having type=string, otherwise things **will** fuck up sooner or later. | No
`limit` | Maximum amount of results to return. (0 < x <= 50)                    | No (defaults 10)

(`k` is discarded)

#### Examples

```http
$ http 'ripple.moe/api/get_user_recent?u=Howl&limit=5&type=string' 
HTTP/1.1 200 OK
CF-RAY: 2f772d05413a3dd1-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 370
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:51:53 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "beatmap_id": "104229",
        "count100": "52",
        "count300": "718",
        "count50": "2",
        "countgeki": "89",
        "countkatu": "12",
        "countmiss": "56",
        "date": "2016-06-24 13:04:24",
        "enabled_mods": "0",
        "maxcombo": "112",
        "perfect": "0",
        "pp": "12",
        "rank": "B",
        "score": "1326030",
        "user_id": "1009"
    },
    {
        "beatmap_id": "738063",
        "count100": "2",
        "count300": "281",
        "count50": "0",
        "countgeki": "58",
        "countkatu": "0",
        "countmiss": "5",
        "date": "2016-06-24 12:58:57",
        "enabled_mods": "0",
        "maxcombo": "330",
        "perfect": "0",
        "pp": "115.3",
        "rank": "A",
        "score": "2428260",
        "user_id": "1009"
    },
    {
        "beatmap_id": "130754",
        "count100": "4",
        "count300": "211",
        "count50": "0",
        "countgeki": "36",
        "countkatu": "4",
        "countmiss": "0",
        "date": "2016-06-22 15:23:33",
        "enabled_mods": "64",
        "maxcombo": "340",
        "perfect": "1",
        "pp": "157.1",
        "rank": "S",
        "score": "2061716",
        "user_id": "1009"
    },
    {
        "beatmap_id": "130754",
        "count100": "17",
        "count300": "198",
        "count50": "0",
        "countgeki": "31",
        "countkatu": "9",
        "countmiss": "0",
        "date": "2016-06-22 15:21:25",
        "enabled_mods": "64",
        "maxcombo": "340",
        "perfect": "1",
        "pp": "120.5",
        "rank": "S",
        "score": "1936900",
        "user_id": "1009"
    },
    {
        "beatmap_id": "738063",
        "count100": "0",
        "count300": "286",
        "count50": "0",
        "countgeki": "60",
        "countkatu": "0",
        "countmiss": "2",
        "date": "2016-06-22 15:10:12",
        "enabled_mods": "0",
        "maxcombo": "230",
        "perfect": "0",
        "pp": "115.2",
        "rank": "A",
        "score": "1520280",
        "user_id": "1009"
    }
]
```

```http
$ http 'ripple.moe/api/get_user_recent?u=1000&m=1'
HTTP/1.1 200 OK
CF-RAY: 2f772e1c61b53dad-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 231
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:52:38 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "beatmap_id": "290768",
        "count100": "30",
        "count300": "277",
        "count50": "0",
        "countgeki": "0",
        "countkatu": "0",
        "countmiss": "13",
        "date": "2016-03-20 22:10:55",
        "enabled_mods": "0",
        "maxcombo": "179",
        "perfect": "0",
        "pp": "0",
        "rank": "A",
        "score": "200944",
        "user_id": "1000"
    },
    {
        "beatmap_id": "664472",
        "count100": "22",
        "count300": "101",
        "count50": "0",
        "countgeki": "0",
        "countkatu": "0",
        "countmiss": "14",
        "date": "2016-02-09 10:40:40",
        "enabled_mods": "0",
        "maxcombo": "71",
        "perfect": "0",
        "pp": "0",
        "rank": "B",
        "score": "63285",
        "user_id": "1000"
    }
]
```

### GET /get_user_best

Get an user's best scores. In osu! standard and osu!mania, scores are sorted by pp, while for other game modes, as PP is not implemented yet, they're sorted by score.

#### Parameters

Name | Description                                                              | Required?
-----|--------------------------------------------------------------------------|----------
`u`  | Username or user ID of the user whose scores you're requesting.          | Yes
`m`  | Number of the gamemode for which you are requesting data. [See Modes IDs](#modes-ids) | No (defaults 0)
`type` | Specify whether `u` is an user ID or an username. Use `string` for usernames. By default, if `u` is possibly a number, it is always first checked if an user with such user ID exists in the database. If you're passing an username, make sure to pass it having type=string, otherwise things **will** fuck up sooner or later. | No
`limit` | Maximum amount of results to return. (0 < x <= 100)                   | No (defaults 10)

(`k` is discarded)

#### Examples

```http
$ http 'ripple.moe/api/get_user_best?u=Howl&limit=5&type=string'
HTTP/1.1 200 OK
CF-RAY: 2f772f37e5664304-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 390
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:53:23 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "beatmap_id": "130754",
        "count100": "4",
        "count300": "211",
        "count50": "0",
        "countgeki": "36",
        "countkatu": "4",
        "countmiss": "0",
        "date": "2016-06-22 15:23:33",
        "enabled_mods": "64",
        "maxcombo": "340",
        "perfect": "1",
        "pp": "157.1",
        "rank": "S",
        "score": "2061716",
        "user_id": "1009"
    },
    {
        "beatmap_id": "574471",
        "count100": "17",
        "count300": "830",
        "count50": "0",
        "countgeki": "177",
        "countkatu": "14",
        "countmiss": "0",
        "date": "2016-02-08 20:42:20",
        "enabled_mods": "0",
        "maxcombo": "1183",
        "perfect": "0",
        "pp": "146.03",
        "rank": "S",
        "score": "24015986",
        "user_id": "1009"
    },
    {
        "beatmap_id": "391520",
        "count100": "20",
        "count300": "684",
        "count50": "2",
        "countgeki": "125",
        "countkatu": "12",
        "countmiss": "0",
        "date": "2016-06-20 15:15:45",
        "enabled_mods": "0",
        "maxcombo": "1048",
        "perfect": "0",
        "pp": "132.1",
        "rank": "S",
        "score": "17825382",
        "user_id": "1009"
    },
    {
        "beatmap_id": "309077",
        "count100": "1",
        "count300": "294",
        "count50": "0",
        "countgeki": "74",
        "countkatu": "1",
        "countmiss": "0",
        "date": "2016-05-22 20:27:18",
        "enabled_mods": "0",
        "maxcombo": "435",
        "perfect": "0",
        "pp": "131.41",
        "rank": "S",
        "score": "3158704",
        "user_id": "1009"
    },
    {
        "beatmap_id": "345099",
        "count100": "19",
        "count300": "864",
        "count50": "2",
        "countgeki": "160",
        "countkatu": "11",
        "countmiss": "0",
        "date": "2016-06-08 09:34:13",
        "enabled_mods": "0",
        "maxcombo": "984",
        "perfect": "0",
        "pp": "129.2",
        "rank": "S",
        "score": "17573518",
        "user_id": "1009"
    }
]
```

```http
$ http 'ripple.moe/api/get_user_best?u=1000&m=1'
HTTP/1.1 200 OK
CF-RAY: 2f772fe764653dbf-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 231
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:53:51 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "beatmap_id": "290768",
        "count100": "30",
        "count300": "277",
        "count50": "0",
        "countgeki": "0",
        "countkatu": "0",
        "countmiss": "13",
        "date": "2016-03-20 22:10:55",
        "enabled_mods": "0",
        "maxcombo": "179",
        "perfect": "0",
        "pp": "0",
        "rank": "A",
        "score": "200944",
        "user_id": "1000"
    },
    {
        "beatmap_id": "664472",
        "count100": "22",
        "count300": "101",
        "count50": "0",
        "countgeki": "0",
        "countkatu": "0",
        "countmiss": "14",
        "date": "2016-02-09 10:40:40",
        "enabled_mods": "0",
        "maxcombo": "71",
        "perfect": "0",
        "pp": "0",
        "rank": "B",
        "score": "63285",
        "user_id": "1000"
    }
]
```

## Scores

### GET /get_scores

Retrieve information about the top 100 scores of a beatmap.

#### Parameters

Name | Description                                                              | Required?
-----|--------------------------------------------------------------------------|----------
`b`  | Beatmap ID from which to return score information from.                  | Yes
`u`  | Username or user ID of the user of which you're requesting the score information on the beatmap. | No
`m`  | Number of the gamemode for which you are requesting data. [See Modes IDs](#modes-ids) | No (defaults 0)
`mods` | Specify to filter scores by a certain mod combination.                 | No
`type` | Specify whether `u` is an user ID or an username. Use `string` for usernames. By default, if `u` is possibly a number, it is always first checked if an user with such user ID exists in the database. If you're passing an username, make sure to pass it having type=string, otherwise things **will** fuck up sooner or later. | No
`limit` | Maximum amount of results to return. (0 < x <= 100)                   | No (defaults 10)

(`k` is discarded)

#### Examples

```http
$ http 'ripple.moe/api/get_scores?b=75&limit=2'
HTTP/1.1 200 OK
CF-RAY: 2f77aa98a3283da7-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 269
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 18:17:37 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "count100": "0",
        "count300": "194",
        "count50": "0",
        "countgeki": "45",
        "countkatu": "0",
        "countmiss": "0",
        "date": "2016-10-21 00:49:02",
        "enabled_mods": "88",
        "maxcombo": "314",
        "perfect": "1",
        "pp": "166.3",
        "rank": "SSH",
        "score": "1854375",
        "score_id": "629651",
        "user_id": "7880",
        "username": "Jash"
    },
    {
        "count100": "10",
        "count300": "184",
        "count50": "0",
        "countgeki": "38",
        "countkatu": "7",
        "countmiss": "0",
        "date": "2016-09-22 17:55:44",
        "enabled_mods": "80",
        "maxcombo": "314",
        "perfect": "1",
        "pp": "82.9",
        "rank": "S",
        "score": "1692113",
        "score_id": "485504",
        "user_id": "9464",
        "username": "enjoy game"
    }
]
```

```http
$ http 'ripple.moe/api/get_scores?b=75&u=9464'
HTTP/1.1 200 OK
CF-RAY: 2f77ac5bc3b13d7d-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 204
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 18:18:49 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "count100": "10",
        "count300": "184",
        "count50": "0",
        "countgeki": "38",
        "countkatu": "7",
        "countmiss": "0",
        "date": "2016-09-22 17:55:44",
        "enabled_mods": "80",
        "maxcombo": "314",
        "perfect": "1",
        "pp": "82.9",
        "rank": "S",
        "score": "1692113",
        "score_id": "485504",
        "user_id": "9464",
        "username": "enjoy game"
    }
]
```

## Beatmaps

### GET /get_beatmaps

Retrieves general information about beatmaps. This method on Ripple lacks a
lot of information and is not really backwards-compatible, because a lot of
the information that osu! gives is not cached on Ripple. Please, in case you can,
use osu!'s get_beatmaps rather than Ripple's, as osu!'s is far more accurate.

#### Parameters

Name | Description                                                              | Required?
-----|--------------------------------------------------------------------------|----------
`s`  | Beatmap set ID of which to return the information.                       | No
`b`  | Beatmap ID of which to return the information.                           | No
`m`  | Number of the gamemode for which you are requesting difficulty information. [See Modes IDs](#modes-ids) | No 
`a`  | Specify whether converted beatmaps are included.                         | No (defaults 0)
`h`  | MD5 beatmap hash.                                                        | No
`limit` | Maximum amount of results to return. (0 < x <= 500)                   | No (defaults 500)

(`k`, `since`, `u`, `type` are discarded)

#### Examples

```http
$ http 'ripple.moe/api/get_beatmaps?limit=1'
HTTP/1.1 200 OK
CF-RAY: 2f77e436e6604304-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 353
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 18:56:57 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "approved": "1",
        "approved_date": "2016-10-25 20:56:56",
        "artist": "Dark PHOENiX",
        "beatmap_id": "81995",
        "beatmapset_id": "21204",
        "bpm": "155",
        "creator": "",
        "diff_approach": "6",
        "diff_drain": "0",
        "diff_overall": "5",
        "diff_size": "0",
        "difficultyrating": "2.24463",
        "favourite_count": "0",
        "file_md5": "7d70e707f03b92d6c2f283e65337c131",
        "genre_id": "0",
        "hit_length": "186",
        "language_id": "0",
        "last_update": "2016-10-25 20:56:56",
        "max_combo": "500",
        "mode": "0",
        "passcount": "0",
        "playcount": "0",
        "source": "",
        "tags": "",
        "title": "The Magic Library BARUWA",
        "total_length": "186",
        "version": "Hard"
    }
]
```
```http
$ http 'ripple.moe/api/get_beatmaps?limit=1&m=3&a=1'
HTTP/1.1 200 OK
CF-RAY: 2f77e8c1a53f4304-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 344
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 19:00:03 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

[
    {
        "approved": "0",
        "approved_date": "0001-01-01 00:00:00",
        "artist": "S3RL",
        "beatmap_id": "1035817",
        "beatmapset_id": "485751",
        "bpm": "175",
        "creator": "",
        "diff_approach": "5",
        "diff_drain": "0",
        "diff_overall": "8",
        "diff_size": "0",
        "difficultyrating": "5.34844",
        "favourite_count": "0",
        "file_md5": "605af80713cdd7ad1d60cabd2b2014e3",
        "genre_id": "0",
        "hit_length": "273",
        "language_id": "0",
        "last_update": "2016-10-25 21:00:00",
        "max_combo": "0",
        "mode": "3",
        "passcount": "0",
        "playcount": "0",
        "source": "",
        "tags": "",
        "title": "Doof Doof Untz Untz",
        "total_length": "273",
        "version": "HARD RAVE"
    }
]
```

# Notes

## Modes IDs

```
osu! standard  = 0
Taiko          = 1
Catch the Beat = 2
osu!mania      = 4
```

## Ranked statuses on Ripple

Taken from [here](https://git.zxq.co/ripple/lets/src/master/constants/rankedStatuses.py).
This does not apply to the peppyapi.

```
Pending      = 0
Needs update = 1
Ranked       = 2
Approved     = 3
Qualified    = 4
Loved        = 5
```



