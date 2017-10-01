---
name: CheeseGull API
---
# CheeseGull API (v2)

To learn more about CheeseGull, read the [GitHub README](https://github.com/osuripple/cheesegull#cheesegull).

## Table of Contents

<!-- toc -->

* [Topics](#topics)
  * [Security Key](#security-key)
  * [Time](#time)
  * [Ok-Message response](#ok-message-response)
  * [Arrays](#arrays)
* [Types](#types)
  * [Beatmap](#beatmap)
  * [BeatmapSet](#beatmapset)
* [Beatmaps and sets](#beatmaps-and-sets)
  * [GET /api/b/:id](#get-%2Fapi%2Fb%2F%3Aid)
  * [GET /api/s/:id](#get-%2Fapi%2Fs%2F%3Aid)
* [Search](#search)
  * [GET /api/search](#get-%2Fapi%2Fsearch)
* [Beatmap requesting](#beatmap-requesting)
  * [POST /api/request](#post-%2Fapi%2Frequest)

<!-- tocstop -->

## Topics

### Time

Time is a tool you can put on the wall, or wear it on your wrist. And, apart from that, it's also that stupid thing humans use to calculate in which part of the day they are.

Time is passed as JSON strings, and formatted using RFC3339. This makes it super-easy to translate times into your programming language's native time, for instance in JavaScript:

```js
> new Date("2016-10-28T21:10:55+02:00")
Fri Oct 28 2016 21:10:55 GMT+0200 (CEST)
```

### Arrays

This is a very short topic to basically say Arrays (which are specified when talking about types with a `[]` in front of the type they array, e.g. `[]Set`) can be `null`.

## Types

### Beatmap

Field name         | Type    | Description
-------------------|---------|-------------------------------------
`BeatmapID`        | `int`   | ID of the beatmap.
`ParentSetID`      | `int`   | ID of the parent beatmap set.
`DiffName`         | `string` | Name of the difficulty.
`FileMD5`          | `string` | MD5 hash of the .osu file.
`Mode`             | `int`   | osu! game mode of this beatmap.
`BPM`              | `float64` | Beats per minute of the song. Probably inaccurate and wrong, and you probably shouldn't use this for any calculation, just for display.
`AR`               | `float32` | Approach rate.
`OD`               | `float32` | Overall difficulty.
`CS`               | `float32` | Circle size.
`HP`               | `float32` | Health drain.
`TotalLength`      | `int`   | The total length of the song in seconds.
`HitLength`        | `int`   | The length of the part with objects in the beatmap.
`Playcount`        | `int`   | Number of plays on this beatmap.
`Passcount`        | `int`   | Number of passes on this beatmap.
`MaxCombo`         | `int`   | Maximum combo someone can achieve.
`DifficultyRating` | `float64` | Star difficulty rating of the map. If this is an osu! standard map, this is the star rating for osu! standard. There's no way to get the star rating for other modes in converted beatmaps.

### Set

Field name          | Type     | Description
--------------------|----------|------------------
`SetID`             | `int`    | ID of the beatmap set.
`ChildrenBeatmaps`  | `[]Beatmap` | Singular beatmaps children of the Set.
`RankedStatus`      | `int`    | Ranked status, as specified in the [osu! API documentation](https://github.com/ppy/osu-api/wiki#response)
`ApprovedDate`      | [`Time`](#time) | Date this beatmap was approved (ranked).
`LastUpdate`        | [`Time`](#time) | Date this beatmap was last qualified.
`LastChecked`       | [`Time`](#time) | Date this beatmap was last checked by CheeseGull.
`Artist`            | `string` | Artist of the song.
`Title`             | `string` | Title of the song.
`Creator`           | `string` | Creator of the beatmap.
`Source`            | `string` | Source of the beatmap (e.g. Vocaloid).
`Tags`              | `string` | ...
`HasVideo`          | `bool`   | ...
`Genre`             | `int`    | Genre, as specified in the [osu! API documentation](https://github.com/ppy/osu-api/wiki#response)
`Language`          | `int`    | Language, as specified in the [osu! API documentation](https://github.com/ppy/osu-api/wiki#response)
`Favourites`        | `int`    | Number of people who favourited this beatmap.

## Beatmaps and sets

### GET /api/b/:id

Retrieves information about a beatmap with the given ID.

#### Response

Returns a [`Beatmap`](#beatmap) (null-able).

#### Examples

```json
$ http 'https://storage.ripple.moe/api/b/75'
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 256
Content-Type: application/json; charset=utf-8
Date: Sun, 01 Oct 2017 17:22:46 GMT
Server: nginx/1.10.3

{
    "AR": 6,
    "BPM": 119.999,
    "BeatmapID": 75,
    "CS": 4,
    "DiffName": "Normal",
    "DifficultyRating": 2,
    "FileMD5": "a5b99395a42bd55bc5eb1d2411cbdf8b",
    "HP": 6,
    "HitLength": 108,
    "MaxCombo": 314,
    "Mode": 0,
    "OD": 6,
    "ParentSetID": 1,
    "Passcount": 35204,
    "Playcount": 267053,
    "TotalLength": 141
}
```

```json
$ http 'https://storage.ripple.moe/api/b/75511151059'
HTTP/1.1 404 Not Found
Connection: keep-alive
Content-Length: 5
Content-Type: application/json; charset=utf-8
Date: Sun, 01 Oct 2017 17:23:21 GMT
Server: nginx/1.10.3

null
```

### GET /api/s/:id

Retrieve information about a set, as well as its children, knowing its ID.

#### Response

Returns a [`Set`](#set) (null-able).

#### Examples

```json
$ http 'https://storage.ripple.moe/api/s/1'
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 569
Content-Type: application/json; charset=utf-8
Date: Sun, 01 Oct 2017 17:23:54 GMT
Server: nginx/1.10.3

{
    "ApprovedDate": "2007-10-07T01:46:31Z",
    "Artist": "Kenji Ninuma",
    "ChildrenBeatmaps": [
        {
            "AR": 6,
            "BPM": 119.999,
            "BeatmapID": 75,
            "CS": 4,
            "DiffName": "Normal",
            "DifficultyRating": 2,
            "FileMD5": "a5b99395a42bd55bc5eb1d2411cbdf8b",
            "HP": 6,
            "HitLength": 108,
            "MaxCombo": 314,
            "Mode": 0,
            "OD": 6,
            "ParentSetID": 1,
            "Passcount": 35204,
            "Playcount": 267053,
            "TotalLength": 141
        }
    ],
    "Creator": "peppy",
    "Favourites": 227,
    "Genre": 2,
    "HasVideo": false,
    "Language": 3,
    "LastChecked": "2017-09-29T21:33:18Z",
    "LastUpdate": "2007-10-07T01:46:31Z",
    "RankedStatus": 1,
    "SetID": 1,
    "Source": "",
    "Tags": "katamari",
    "Title": "DISCO PRINCE"
}
```

```json
$ http 'https://storage.ripple.moe/api/s/1849281'
HTTP/1.1 404 Not Found
Connection: keep-alive
Content-Length: 5
Content-Type: application/json; charset=utf-8
Date: Sun, 01 Oct 2017 17:24:34 GMT
Server: nginx/1.10.3

null
```

## Search

### GET /api/search

Returns sets based on the searched query and details passed.

#### GET Parameters

- `amount`: amount of results to return. Defaults to 50. Can be a value from 1 to 100.
- `offset`: offset of the results. In a classic pagination system, this would be  `amount * (page - 1)`, assuming page starts from 1.
- `status`: beatmap ranked status. If not passed, all statuses are good. Multiple statuses can be passed to specify that multiple statuses are accepted.
- `mode`: game mode. If not passed, all game modes are good. Multiple game modes can be passed - for instance, you can pass `1` and `3`, and only sets that have both taiko and mania beatmaps will be shown.
- `query`: the search query.

#### Response

Returns a [`[]Set`](#set). Results will be ordered by relevance if a query is
given, by ID otherwise.

#### Examples

```json
$ http 'https://storage.ripple.moe/api/search?amount=5'
HTTP/1.1 200 OK
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Sun, 01 Oct 2017 17:25:09 GMT
Server: nginx/1.10.3
Transfer-Encoding: chunked

[
    {
        "ApprovedDate": "2007-10-07T01:46:31Z",
        "Artist": "Kenji Ninuma",
        "ChildrenBeatmaps": [
            {
                "AR": 6,
                "BPM": 119.999,
                "BeatmapID": 75,
                "CS": 4,
                "DiffName": "Normal",
                "DifficultyRating": 2,
                "FileMD5": "a5b99395a42bd55bc5eb1d2411cbdf8b",
                "HP": 6,
                "HitLength": 108,
                "MaxCombo": 314,
                "Mode": 0,
                "OD": 6,
                "ParentSetID": 1,
                "Passcount": 35204,
                "Playcount": 267053,
                "TotalLength": 141
            }
        ],
        "Creator": "peppy",
        "Favourites": 227,
        "Genre": 2,
        "HasVideo": false,
        "Language": 3,
        "LastChecked": "2017-09-29T21:33:18Z",
        "LastUpdate": "2007-10-07T01:46:31Z",
        "RankedStatus": 1,
        "SetID": 1,
        "Source": "",
        "Tags": "katamari",
        "Title": "DISCO PRINCE"
    },
    {
        "ApprovedDate": "2007-10-07T03:32:02Z",
        "Artist": "Ni-Ni",
        "ChildrenBeatmaps": [
            {
                "AR": 4,
                "BPM": 172,
                "BeatmapID": 53,
                "CS": 5,
                "DiffName": "-Crusin-",
                "DifficultyRating": 2,
                "FileMD5": "1d23c37a2fda439be752ae2bca06c0cd",
                "HP": 3,
                "HitLength": 76,
                "MaxCombo": 124,
                "Mode": 0,
                "OD": 4,
                "ParentSetID": 3,
                "Passcount": 35196,
                "Playcount": 70101,
                "TotalLength": 82
            },
            {
                "AR": 7,
                "BPM": 172,
                "BeatmapID": 54,
                "CS": 7,
                "DiffName": "-Hardrock-",
                "DifficultyRating": 3,
                "FileMD5": "e6f48da7f132c909accc677b77f231b8",
                "HP": 5,
                "HitLength": 76,
                "MaxCombo": 189,
                "Mode": 0,
                "OD": 7,
                "ParentSetID": 3,
                "Passcount": 18835,
                "Playcount": 84208,
                "TotalLength": 82
            },
            {
                "AR": 6,
                "BPM": 172,
                "BeatmapID": 55,
                "CS": 6,
                "DiffName": "-Sweatin-",
                "DifficultyRating": 2,
                "FileMD5": "a5372216d0902bacc7eb081e15e36bb9",
                "HP": 4,
                "HitLength": 76,
                "MaxCombo": 182,
                "Mode": 0,
                "OD": 6,
                "ParentSetID": 3,
                "Passcount": 23747,
                "Playcount": 71759,
                "TotalLength": 82
            },
            {
                "AR": 3,
                "BPM": 172,
                "BeatmapID": 91,
                "CS": 4,
                "DiffName": "-Breezin-",
                "DifficultyRating": 1,
                "FileMD5": "c9c306c319e004d98f3121d85eaa17ed",
                "HP": 2,
                "HitLength": 76,
                "MaxCombo": 96,
                "Mode": 0,
                "OD": 3,
                "ParentSetID": 3,
                "Passcount": 64392,
                "Playcount": 98700,
                "TotalLength": 82
            }
        ],
        "Creator": "MCXD",
        "Favourites": 83,
        "Genre": 2,
        "HasVideo": false,
        "Language": 2,
        "LastChecked": "2017-09-29T21:33:18Z",
        "LastUpdate": "2007-10-07T03:32:02Z",
        "RankedStatus": 1,
        "SetID": 3,
        "Source": "",
        "Tags": "",
        "Title": "1,2,3,4, 007 [Wipeout Series]"
    },
    {
        "ApprovedDate": "2007-10-07T21:19:10Z",
        "Artist": "Brandy",
        "ChildrenBeatmaps": [
            {
                "AR": 5,
                "BPM": 125,
                "BeatmapID": 119,
                "CS": 4,
                "DiffName": "Normal",
                "DifficultyRating": 3,
                "FileMD5": "61ab916b295db85aec045d355e1447fb",
                "HP": 3,
                "HitLength": 130,
                "MaxCombo": 453,
                "Mode": 0,
                "OD": 5,
                "ParentSetID": 16,
                "Passcount": 16458,
                "Playcount": 75492,
                "TotalLength": 134
            }
        ],
        "Creator": "FFFanatic",
        "Favourites": 29,
        "Genre": 2,
        "HasVideo": false,
        "Language": 6,
        "LastChecked": "2017-09-29T21:33:18Z",
        "LastUpdate": "2007-10-07T21:19:10Z",
        "RankedStatus": 1,
        "SetID": 16,
        "Source": "",
        "Tags": "",
        "Title": "Love Fighter"
    },
    {
        "ApprovedDate": "2007-10-08T06:16:55Z",
        "Artist": "Scatman John",
        "ChildrenBeatmaps": [
            {
                "AR": 4,
                "BPM": 136.016,
                "BeatmapID": 80,
                "CS": 5,
                "DiffName": "Insane",
                "DifficultyRating": 4,
                "FileMD5": "ea43709e1e9056879e59860b286895be",
                "HP": 4,
                "HitLength": 155,
                "MaxCombo": 466,
                "Mode": 0,
                "OD": 4,
                "ParentSetID": 18,
                "Passcount": 216097,
                "Playcount": 1411727,
                "TotalLength": 184
            }
        ],
        "Creator": "Extor",
        "Favourites": 397,
        "Genre": 5,
        "HasVideo": false,
        "Language": 2,
        "LastChecked": "2017-09-29T21:33:18Z",
        "LastUpdate": "2007-10-08T06:16:55Z",
        "RankedStatus": 1,
        "SetID": 18,
        "Source": "",
        "Tags": "",
        "Title": "Scatman"
    },
    {
        "ApprovedDate": "2007-10-08T06:37:19Z",
        "Artist": "Ken Hirai",
        "ChildrenBeatmaps": [
            {
                "AR": 2,
                "BPM": 139.867,
                "BeatmapID": 86,
                "CS": 5,
                "DiffName": "Normal",
                "DifficultyRating": 2,
                "FileMD5": "bfe8f7ccd03253bf36d7faabd61be2e0",
                "HP": 5,
                "HitLength": 259,
                "MaxCombo": 432,
                "Mode": 0,
                "OD": 2,
                "ParentSetID": 23,
                "Passcount": 24109,
                "Playcount": 169217,
                "TotalLength": 267
            }
        ],
        "Creator": "Chan",
        "Favourites": 48,
        "Genre": 5,
        "HasVideo": false,
        "Language": 3,
        "LastChecked": "2017-09-29T21:33:18Z",
        "LastUpdate": "2007-10-08T06:37:19Z",
        "RankedStatus": 1,
        "SetID": 23,
        "Source": "",
        "Tags": "",
        "Title": "Pop Star"
    }
]
```

```json
$ http 'https://storage.ripple.moe/api/search?amount=5&query=cheesegull'
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 3
Content-Type: application/json; charset=utf-8
Date: Sun, 01 Oct 2017 17:26:52 GMT
Server: nginx/1.10.3

[]
```

```json
$ http 'https://storage.ripple.moe/api/search?amount=5&status=4&status=3'
HTTP/1.1 200 OK
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Sun, 01 Oct 2017 17:27:33 GMT
Server: nginx/1.10.3
Transfer-Encoding: chunked

[
    {
        "ApprovedDate": "2009-09-03T08:11:06Z",
        "Artist": "DJ Sharpnel",
        "ChildrenBeatmaps": [
            {
                "AR": 8,
                "BPM": 215,
                "BeatmapID": 27737,
                "CS": 5,
                "DiffName": "Lesjuh's TAG",
                "DifficultyRating": 5,
                "FileMD5": "6d31dee3bdaa77a2d3a1907e7d23ad20",
                "HP": 4,
                "HitLength": 177,
                "MaxCombo": 1352,
                "Mode": 0,
                "OD": 8,
                "ParentSetID": 5774,
                "Passcount": 83463,
                "Playcount": 592475,
                "TotalLength": 213
            },
            {
                "AR": 8,
                "BPM": 215,
                "BeatmapID": 28065,
                "CS": 5,
                "DiffName": "HappyMiX",
                "DifficultyRating": 5,
                "FileMD5": "805affa147f2f927507865344fbd530c",
                "HP": 3,
                "HitLength": 178,
                "MaxCombo": 1423,
                "Mode": 0,
                "OD": 8,
                "ParentSetID": 5774,
                "Passcount": 100372,
                "Playcount": 829811,
                "TotalLength": 213
            },
            {
                "AR": 2,
                "BPM": 215,
                "BeatmapID": 35781,
                "CS": 3,
                "DiffName": "Baby Difficulty",
                "DifficultyRating": 1,
                "FileMD5": "3a81594a28b255cb998113dd52cb7871",
                "HP": 1,
                "HitLength": 109,
                "MaxCombo": 152,
                "Mode": 0,
                "OD": 2,
                "ParentSetID": 5774,
                "Passcount": 88448,
                "Playcount": 191209,
                "TotalLength": 132
            },
            {
                "AR": 7,
                "BPM": 215,
                "BeatmapID": 36349,
                "CS": 5,
                "DiffName": "Roko-Don's Taiko",
                "DifficultyRating": 4,
                "FileMD5": "11372543cd8b45c905bd699f2081ec9a",
                "HP": 10,
                "HitLength": 210,
                "MaxCombo": 1026,
                "Mode": 1,
                "OD": 7,
                "ParentSetID": 5774,
                "Passcount": 7333,
                "Playcount": 64655,
                "TotalLength": 224
            }
        ],
        "Creator": "happy30",
        "Favourites": 533,
        "Genre": 10,
        "HasVideo": false,
        "Language": 3,
        "LastChecked": "2017-09-29T22:32:55Z",
        "LastUpdate": "2009-09-03T02:10:19Z",
        "RankedStatus": 4,
        "SetID": 5774,
        "Source": "",
        "Tags": "",
        "Title": "StrangeProgram"
    },
    {
        "ApprovedDate": "2017-01-26T21:54:52Z",
        "Artist": "Noisia",
        "ChildrenBeatmaps": [
            {
                "AR": 9,
                "BPM": 270.66,
                "BeatmapID": 47353,
                "CS": 5,
                "DiffName": "DJ LaRTo",
                "DifficultyRating": 5,
                "FileMD5": "cccaa12cbc4cd95c399d53d8c4cb57cd",
                "HP": 4,
                "HitLength": 174,
                "MaxCombo": 1030,
                "Mode": 0,
                "OD": 9,
                "ParentSetID": 12448,
                "Passcount": 839,
                "Playcount": 9835,
                "TotalLength": 255
            },
            {
                "AR": 9,
                "BPM": 270.66,
                "BeatmapID": 47356,
                "CS": 5,
                "DiffName": "Insane",
                "DifficultyRating": 5,
                "FileMD5": "acd1fbdf12da83fb08d819478b091b24",
                "HP": 7,
                "HitLength": 173,
                "MaxCombo": 977,
                "Mode": 0,
                "OD": 9,
                "ParentSetID": 12448,
                "Passcount": 588,
                "Playcount": 9803,
                "TotalLength": 255
            },
            {
                "AR": 8,
                "BPM": 270.66,
                "BeatmapID": 47359,
                "CS": 4,
                "DiffName": "SPIN'S TAG!!",
                "DifficultyRating": 6,
                "FileMD5": "d35c7c0fd480d7c9fcdffd6f6005e9eb",
                "HP": 4,
                "HitLength": 173,
                "MaxCombo": 1197,
                "Mode": 0,
                "OD": 8,
                "ParentSetID": 12448,
                "Passcount": 1953,
                "Playcount": 23262,
                "TotalLength": 255
            },
            {
                "AR": 7,
                "BPM": 270.66,
                "BeatmapID": 50141,
                "CS": 4,
                "DiffName": "Doomsday's Hard",
                "DifficultyRating": 4,
                "FileMD5": "e9c9213d98df393657b64f56935a1fa9",
                "HP": 4,
                "HitLength": 173,
                "MaxCombo": 973,
                "Mode": 0,
                "OD": 7,
                "ParentSetID": 12448,
                "Passcount": 2106,
                "Playcount": 20317,
                "TotalLength": 255
            },
            {
                "AR": 8,
                "BPM": 270.66,
                "BeatmapID": 63133,
                "CS": 4,
                "DiffName": "!ignore this",
                "DifficultyRating": 6,
                "FileMD5": "ae7bb386fa4fedc5b46006675d8b707c",
                "HP": 2,
                "HitLength": 182,
                "MaxCombo": 1016,
                "Mode": 0,
                "OD": 8,
                "ParentSetID": 12448,
                "Passcount": 2140,
                "Playcount": 14678,
                "TotalLength": 255
            },
            {
                "AR": 6,
                "BPM": 270.66,
                "BeatmapID": 69058,
                "CS": 4,
                "DiffName": "Emdyion's Level",
                "DifficultyRating": 5,
                "FileMD5": "2cfdcacdfc42ed77b7a85935482ab832",
                "HP": 4,
                "HitLength": 174,
                "MaxCombo": 961,
                "Mode": 0,
                "OD": 6,
                "ParentSetID": 12448,
                "Passcount": 772,
                "Playcount": 10438,
                "TotalLength": 255
            }
        ],
        "Creator": "Takuma",
        "Favourites": 224,
        "Genre": 1,
        "HasVideo": false,
        "Language": 1,
        "LastChecked": "2017-09-29T23:41:46Z",
        "LastUpdate": "2011-05-01T06:06:48Z",
        "RankedStatus": 4,
        "SetID": 12448,
        "Source": "DJ Hero OST",
        "Tags": "agent spin here mashley larto emdyion doomsday ignorethis dj hero",
        "Title": "Groundhog (Beat Juggle)"
    },
    {
        "ApprovedDate": "2016-12-15T19:27:33Z",
        "Artist": "Shiki mixed by Djsmalls",
        "ChildrenBeatmaps": [
            {
                "AR": 7,
                "BPM": 178,
                "BeatmapID": 48386,
                "CS": 5,
                "DiffName": "Best map ever created",
                "DifficultyRating": 5,
                "FileMD5": "ffb472adfd6c68a88e59412e57431089",
                "HP": 4,
                "HitLength": 114,
                "MaxCombo": 735,
                "Mode": 0,
                "OD": 7,
                "ParentSetID": 13008,
                "Passcount": 2631,
                "Playcount": 26901,
                "TotalLength": 145
            }
        ],
        "Creator": "MegaManEXE",
        "Favourites": 67,
        "Genre": 1,
        "HasVideo": false,
        "Language": 1,
        "LastChecked": "2017-09-29T23:46:56Z",
        "LastUpdate": "2010-02-18T12:42:37Z",
        "RankedStatus": 4,
        "SetID": 13008,
        "Source": "",
        "Tags": "wow meow woof cat dog monkey screech banana peel slip frog ribbit croak emoticon bakaru best map in the universe shitty bad awful troll lol streams proven mapping expertise professional storyboard 1 2 3 4 5 6 do it wa wa wa wasuremono i'm all out of ideas for tags now",
        "Title": "Air"
    },
    {
        "ApprovedDate": "2016-10-17T00:00:00Z",
        "Artist": "DM Ashura",
        "ChildrenBeatmaps": [
            {
                "AR": 9,
                "BPM": 100,
                "BeatmapID": 69129,
                "CS": 4,
                "DiffName": "DooMAX",
                "DifficultyRating": 6,
                "FileMD5": "661bde34541504904e2206b36b860b15",
                "HP": 6,
                "HitLength": 104,
                "MaxCombo": 539,
                "Mode": 0,
                "OD": 7,
                "ParentSetID": 18315,
                "Passcount": 4259,
                "Playcount": 71277,
                "TotalLength": 114
            },
            {
                "AR": 9,
                "BPM": 100,
                "BeatmapID": 69131,
                "CS": 4,
                "DiffName": "ignore's Another",
                "DifficultyRating": 6,
                "FileMD5": "04717d0cb356cf0b49ec3360a5fc480d",
                "HP": 5,
                "HitLength": 105,
                "MaxCombo": 599,
                "Mode": 0,
                "OD": 8,
                "ParentSetID": 18315,
                "Passcount": 2922,
                "Playcount": 42093,
                "TotalLength": 114
            },
            {
                "AR": 6,
                "BPM": 100,
                "BeatmapID": 106961,
                "CS": 3.7,
                "DiffName": "Difficult",
                "DifficultyRating": 4,
                "FileMD5": "c10c45bedc1637335bfe9caa05e08218",
                "HP": 4,
                "HitLength": 102,
                "MaxCombo": 494,
                "Mode": 0,
                "OD": 5,
                "ParentSetID": 18315,
                "Passcount": 10663,
                "Playcount": 64472,
                "TotalLength": 114
            },
            {
                "AR": 9.6,
                "BPM": 100,
                "BeatmapID": 106965,
                "CS": 4,
                "DiffName": "Challenge",
                "DifficultyRating": 7,
                "FileMD5": "1207cf3ee59cbf82df118a4d6421ddc5",
                "HP": 7,
                "HitLength": 104,
                "MaxCombo": 636,
                "Mode": 0,
                "OD": 7,
                "ParentSetID": 18315,
                "Passcount": 24032,
                "Playcount": 162957,
                "TotalLength": 114
            },
            {
                "AR": 4,
                "BPM": 100,
                "BeatmapID": 793626,
                "CS": 2,
                "DiffName": "Basic",
                "DifficultyRating": 2,
                "FileMD5": "4e78de1d6433812ab9dd35cd11fed59e",
                "HP": 4,
                "HitLength": 86,
                "MaxCombo": 239,
                "Mode": 0,
                "OD": 3,
                "ParentSetID": 18315,
                "Passcount": 9751,
                "Playcount": 33329,
                "TotalLength": 114
            },
            {
                "AR": 9,
                "BPM": 100,
                "BeatmapID": 801663,
                "CS": 4.5,
                "DiffName": "Expert",
                "DifficultyRating": 5,
                "FileMD5": "1af15fe7d1223357145f4c655ec3b6f4",
                "HP": 5,
                "HitLength": 104,
                "MaxCombo": 564,
                "Mode": 0,
                "OD": 5,
                "ParentSetID": 18315,
                "Passcount": 9245,
                "Playcount": 139577,
                "TotalLength": 114
            }
        ],
        "Creator": "rustbell",
        "Favourites": 633,
        "Genre": 1,
        "HasVideo": false,
        "Language": 1,
        "LastChecked": "2017-09-30T00:39:20Z",
        "LastUpdate": "2015-10-13T18:34:32Z",
        "RankedStatus": 4,
        "SetID": 18315,
        "Source": "DDR Forever",
        "Tags": "stepmania ignorethis doomsday",
        "Title": "deltaMAX"
    },
    {
        "ApprovedDate": "2016-12-01T20:04:11Z",
        "Artist": "t+pazolite",
        "ChildrenBeatmaps": [
            {
                "AR": 9,
                "BPM": 220,
                "BeatmapID": 71737,
                "CS": 5,
                "DiffName": "Extra Stage",
                "DifficultyRating": 5,
                "FileMD5": "0e9471053ca8bc6424bc9a810fb1c846",
                "HP": 6,
                "HitLength": 187,
                "MaxCombo": 1010,
                "Mode": 0,
                "OD": 7,
                "ParentSetID": 20533,
                "Passcount": 2973,
                "Playcount": 18028,
                "TotalLength": 239
            },
            {
                "AR": 8,
                "BPM": 220,
                "BeatmapID": 74845,
                "CS": 5,
                "DiffName": "Verdi's CTB",
                "DifficultyRating": 6,
                "FileMD5": "a9245d6ff2881de3aea540da624c45bc",
                "HP": 7,
                "HitLength": 183,
                "MaxCombo": 1243,
                "Mode": 2,
                "OD": 6,
                "ParentSetID": 20533,
                "Passcount": 282,
                "Playcount": 5346,
                "TotalLength": 241
            },
            {
                "AR": 9,
                "BPM": 220,
                "BeatmapID": 75773,
                "CS": 5,
                "DiffName": "APOCALYPSE",
                "DifficultyRating": 5,
                "FileMD5": "faee25dbeadbb034e37870d7d8171064",
                "HP": 5,
                "HitLength": 137,
                "MaxCombo": 758,
                "Mode": 0,
                "OD": 5,
                "ParentSetID": 20533,
                "Passcount": 1760,
                "Playcount": 20188,
                "TotalLength": 189
            }
        ],
        "Creator": "wakarimasenlol",
        "Favourites": 33,
        "Genre": 1,
        "HasVideo": false,
        "Language": 1,
        "LastChecked": "2017-09-30T01:00:54Z",
        "LastUpdate": "2010-11-12T14:15:26Z",
        "RankedStatus": 4,
        "SetID": 20533,
        "Source": "",
        "Tags": "t+pazolite",
        "Title": "to luv me I *** for u"
    }
]
```
