---
name: CheeseGull API
---
# CheeseGull API

CheeseGull is the successor of [mirror](https://zxq.co/ripple/mirror), and it is an osu! mirror designed to be easily adoptable by everyone, not just Ripple. It is currently still unstable and in beta phase, though the current API is frozen so you're free to use it however you like with the guarantee it won't change. The API was designed with backwards-compatibility in mind, so if it worked with mirror, it works with CheeseGull.

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

### Security Key

Some requests on the API require a Security Key, which you can only obtain if you get it from the mirror's owner. It is given in the second line of the program's output.

```bash
CheeseGull API v1.0.0
Security key: PBSAaVfXgnItPwXpyWbkvShpO
Listening on :62011
```

The Security Key can then be passed (in order of priority):

- Using the GET parameter `k`
- Using the header `Api-Secret`
- Using the header `Authorization`

### Time

Time is a tool you can put on the wall, or wear it on your wrist. And, apart from that, it's also that stupid thing humans use to calculate in which part of the day they are.

Time is passed as JSON strings, and formatted using RFC3339. This makes it super-easy to translate times into your programming language's native time, for instance in JavaScript:

```js
> new Date("2016-10-28T21:10:55+02:00")
Fri Oct 28 2016 21:10:55 GMT+0200 (CEST)
```

### Ok-Message response

In the new API methods (those that are not /s/:id or /b/:id), an `Ok` field in the JSON struct is always passed, to specify if the call was successful or not. Of course, if it's successfull it will be `true`, if not it will be `false`. If it's false, a `Message` will also be returned, saying what the error was in a human-readable way. The only field guaranteed to always be there when `Ok` is false is `Message`. 

### Arrays

This is a very short topic to basically say Arrays (which are specified when talking about types with a `[]` in front of the type they array, e.g. `[]BeatmapSet`) can be `null`.

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

### BeatmapSet

Field name          | Type     | Description
--------------------|----------|------------------
`SetID`             | `int`    | ID of the beatmap set.
`ChildrenBeatmaps`  | `[]int`  | IDs of the children beatmaps. This is kept only for backwards compatibility with mirror.
`ChildrenBeatmaps2` | `[]Beatmap` | Actual children beatmaps, with all the information.
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
$ http http://test/api/b/75
HTTP/1.1 200 OK
Content-Length: 264
Content-Type: application/json; charset=UTF-8
Date: Sun, 15 Jan 2017 21:07:04 GMT

{
    "AR": 6,
    "BPM": 119.999,
    "BeatmapID": 75,
    "CS": 4,
    "DiffName": "Normal",
    "DifficultyRating": 2.2919927,
    "FileMD5": "a5b99395a42bd55bc5eb1d2411cbdf8b",
    "HP": 6,
    "HitLength": 108,
    "MaxCombo": 314,
    "Mode": 0,
    "OD": 6,
    "ParentSetID": 0,
    "Passcount": 31459,
    "Playcount": 231169,
    "TotalLength": 141
}
```

```json
$ http http://test/api/b/755111
HTTP/1.1 404 Not Found
Content-Length: 5
Content-Type: application/json; charset=UTF-8
Date: Sun, 15 Jan 2017 21:07:54 GMT

null
```

### GET /api/s/:id

Retrieve information about a beatmapset, as well as its children, knowing its ID.

#### Response

Returns a [`BeatmapSet`](#beatmapset) (null-able).

#### Examples

```json
$ http http://test/api/s/1     
HTTP/1.1 200 OK
Content-Length: 600
Content-Type: application/json; charset=UTF-8
Date: Sun, 15 Jan 2017 21:11:28 GMT

{
    "ApprovedDate": "2007-10-07T01:46:31Z",
    "Artist": "Kenji Ninuma",
    "ChildrenBeatmaps": [
        75
    ],
    "ChildrenBeatmaps2": [
        {
            "AR": 6,
            "BPM": 119.999,
            "BeatmapID": 75,
            "CS": 4,
            "DiffName": "Normal",
            "DifficultyRating": 2.2919927,
            "FileMD5": "a5b99395a42bd55bc5eb1d2411cbdf8b",
            "HP": 6,
            "HitLength": 0,
            "MaxCombo": 314,
            "Mode": 0,
            "OD": 6,
            "ParentSetID": 1,
            "Passcount": 31459,
            "Playcount": 231169,
            "TotalLength": 108
        }
    ],
    "Creator": "peppy",
    "Favourites": 171,
    "Genre": 2,
    "HasVideo": false,
    "Language": 3,
    "LastChecked": "2017-01-15T19:25:03Z",
    "LastUpdate": "2007-10-07T01:46:31Z",
    "RankedStatus": 1,
    "SetID": 1,
    "Source": "",
    "Tags": "katamari",
    "Title": "DISCO PRINCE"
}
```

```json
$ http http://test/api/s/591859
HTTP/1.1 404 Not Found
Content-Length: 5
Content-Type: application/json; charset=UTF-8
Date: Sun, 15 Jan 2017 21:11:54 GMT

null
```

## Search

### GET /api/search

Returns beatmaps based on the searched query and details passed.

#### GET Parameters

- `amount`: amount of results to return. Defaults to 50. Can be a value from 1 to 100.
- `offset`: offset of the results. In a classic pagination system, this would be  `amount * (page - 1)`, assuming page starts from 1.
- `status`: beatmap ranked status. If not passed, all statuses are good. Multiple statuses can be passed to specify that multiple statuses are accepted.
- `mode`: game mode. If not passed, all game modes are good. Multiple game modes can be passed to specify that multiple game modes are accepted.
- `query`: the search query.

#### Response

Returns an [Ok-Message Response](#ok-message-response), with a `Sets` field that is a [`[]BeatmapSet`](#beatmapset).

#### Examples

```json
$ http 'http://test/api/search?amount=5'
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Date: Mon, 16 Jan 2017 17:08:48 GMT
Transfer-Encoding: chunked

{
    "Ok": true,
    "Sets": [
        {
            "ApprovedDate": "2007-10-29T01:55:27Z",
            "Artist": "Lisa Locheed",
            "ChildrenBeatmaps": [
                283,
                554242
            ],
            "ChildrenBeatmaps2": [
                {
                    "AR": 5,
                    "BPM": 136.34,
                    "BeatmapID": 283,
                    "CS": 5,
                    "DiffName": "Normal",
                    "DifficultyRating": 2.381,
                    "FileMD5": "97f3780beee23dcac25fb58d2a31f103",
                    "HP": 5,
                    "HitLength": 0,
                    "MaxCombo": 389,
                    "Mode": 0,
                    "OD": 5,
                    "ParentSetID": 126,
                    "Passcount": 202,
                    "Playcount": 828,
                    "TotalLength": 206
                },
                {
                    "AR": 2,
                    "BPM": 136.34,
                    "BeatmapID": 554242,
                    "CS": 5,
                    "DiffName": "Easy",
                    "DifficultyRating": 1.62103,
                    "FileMD5": "8904a3ed9ac76644a6f4356669540c04",
                    "HP": 2,
                    "HitLength": 0,
                    "MaxCombo": 289,
                    "Mode": 0,
                    "OD": 2,
                    "ParentSetID": 126,
                    "Passcount": 556,
                    "Playcount": 1541,
                    "TotalLength": 208
                }
            ],
            "Creator": "Bonesnake",
            "Favourites": 7,
            "Genre": 5,
            "HasVideo": false,
            "Language": 2,
            "LastChecked": "2017-01-15T20:25:02Z",
            "LastUpdate": "2014-12-03T23:22:22Z",
            "RankedStatus": 1,
            "SetID": 126,
            "Source": "",
            "Tags": "",
            "Title": "The Raccoons - Run with us"
        },
        {
            "ApprovedDate": "2007-12-17T02:00:57Z",
            "Artist": "Die Aerzte",
            "ChildrenBeatmaps": [
                2199,
                2200
            ],
            "ChildrenBeatmaps2": [
                {
                    "AR": 5,
                    "BPM": 105.498,
                    "BeatmapID": 2199,
                    "CS": 3,
                    "DiffName": "Normal",
                    "DifficultyRating": 2.21638,
                    "FileMD5": "1e6042070f136c76d05f702bfec84e08",
                    "HP": 5,
                    "HitLength": 0,
                    "MaxCombo": 230,
                    "Mode": 0,
                    "OD": 5,
                    "ParentSetID": 453,
                    "Passcount": 6614,
                    "Playcount": 15949,
                    "TotalLength": 118
                },
                {
                    "AR": 7,
                    "BPM": 105.498,
                    "BeatmapID": 2200,
                    "CS": 3,
                    "DiffName": "Hard",
                    "DifficultyRating": 2.36691,
                    "FileMD5": "1f80645c63012adb4aa4acf09da1ae78",
                    "HP": 7,
                    "HitLength": 0,
                    "MaxCombo": 372,
                    "Mode": 0,
                    "OD": 7,
                    "ParentSetID": 453,
                    "Passcount": 5032,
                    "Playcount": 19301,
                    "TotalLength": 172
                }
            ],
            "Creator": "Fox",
            "Favourites": 38,
            "Genre": 4,
            "HasVideo": false,
            "Language": 8,
            "LastChecked": "2017-01-15T20:28:46Z",
            "LastUpdate": "2013-03-01T11:21:02Z",
            "RankedStatus": 1,
            "SetID": 453,
            "Source": "",
            "Tags": "",
            "Title": "Junge"
        },
        {
            "ApprovedDate": "2008-04-21T23:30:01Z",
            "Artist": "AKITO",
            "ChildrenBeatmaps": [
                261
            ],
            "ChildrenBeatmaps2": [
                {
                    "AR": 6,
                    "BPM": 138,
                    "BeatmapID": 261,
                    "CS": 6,
                    "DiffName": "Hard",
                    "DifficultyRating": 2.74412,
                    "FileMD5": "b9bb0473a2a0ba7fcbbf68678b23c115",
                    "HP": 6,
                    "HitLength": 0,
                    "MaxCombo": 255,
                    "Mode": 0,
                    "OD": 6,
                    "ParentSetID": 119,
                    "Passcount": 42623,
                    "Playcount": 197574,
                    "TotalLength": 101
                }
            ],
            "Creator": "Kharl",
            "Favourites": 145,
            "Genre": 2,
            "HasVideo": true,
            "Language": 5,
            "LastChecked": "2017-01-15T20:24:59Z",
            "LastUpdate": "2009-04-06T05:33:38Z",
            "RankedStatus": 1,
            "SetID": 119,
            "Source": "DJMAX",
            "Tags": "J-Trance Pasonia",
            "Title": "Sakura Kagetsu"
        }
    ]
}
```

```json
$ http 'http://test/api/search?amount=5&query=meme'
HTTP/1.1 200 OK
Content-Length: 24
Content-Type: text/plain; charset=utf-8
Date: Mon, 16 Jan 2017 17:10:20 GMT

{
    "Ok": true,
    "Sets": null
}
```

```json
$ http 'http://test/api/search?amount=5&status=1&status=-2'
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Date: Mon, 16 Jan 2017 17:39:42 GMT
Transfer-Encoding: chunked

{
    "Ok": true,
    "Sets": [
        {
            "ApprovedDate": "2007-10-29T01:55:27Z",
            "Artist": "Lisa Locheed",
            "ChildrenBeatmaps": [
                283,
                554242
            ],
            "ChildrenBeatmaps2": [
                {
                    "AR": 5,
                    "BPM": 136.34,
                    "BeatmapID": 283,
                    "CS": 5,
                    "DiffName": "Normal",
                    "DifficultyRating": 2.3809981,
                    "FileMD5": "97f3780beee23dcac25fb58d2a31f103",
                    "HP": 5,
                    "HitLength": 0,
                    "MaxCombo": 389,
                    "Mode": 0,
                    "OD": 5,
                    "ParentSetID": 126,
                    "Passcount": 202,
                    "Playcount": 828,
                    "TotalLength": 206
                },
                {
                    "AR": 2,
                    "BPM": 136.34,
                    "BeatmapID": 554242,
                    "CS": 5,
                    "DiffName": "Easy",
                    "DifficultyRating": 1.6210282,
                    "FileMD5": "8904a3ed9ac76644a6f4356669540c04",
                    "HP": 2,
                    "HitLength": 0,
                    "MaxCombo": 289,
                    "Mode": 0,
                    "OD": 2,
                    "ParentSetID": 126,
                    "Passcount": 556,
                    "Playcount": 1541,
                    "TotalLength": 208
                }
            ],
            "Creator": "Bonesnake",
            "Favourites": 7,
            "Genre": 5,
            "HasVideo": false,
            "Language": 2,
            "LastChecked": "2017-01-15T20:25:02Z",
            "LastUpdate": "2014-12-03T23:22:22Z",
            "RankedStatus": 1,
            "SetID": 126,
            "Source": "",
            "Tags": "",
            "Title": "The Raccoons - Run with us"
        },
        {
            "ApprovedDate": "2007-12-17T02:00:57Z",
            "Artist": "Die Aerzte",
            "ChildrenBeatmaps": [
                2199,
                2200
            ],
            "ChildrenBeatmaps2": [
                {
                    "AR": 5,
                    "BPM": 105.498,
                    "BeatmapID": 2199,
                    "CS": 3,
                    "DiffName": "Normal",
                    "DifficultyRating": 2.2163832,
                    "FileMD5": "1e6042070f136c76d05f702bfec84e08",
                    "HP": 5,
                    "HitLength": 0,
                    "MaxCombo": 230,
                    "Mode": 0,
                    "OD": 5,
                    "ParentSetID": 453,
                    "Passcount": 6614,
                    "Playcount": 15949,
                    "TotalLength": 118
                },
                {
                    "AR": 7,
                    "BPM": 105.498,
                    "BeatmapID": 2200,
                    "CS": 3,
                    "DiffName": "Hard",
                    "DifficultyRating": 2.3669055,
                    "FileMD5": "1f80645c63012adb4aa4acf09da1ae78",
                    "HP": 7,
                    "HitLength": 0,
                    "MaxCombo": 372,
                    "Mode": 0,
                    "OD": 7,
                    "ParentSetID": 453,
                    "Passcount": 5032,
                    "Playcount": 19301,
                    "TotalLength": 172
                }
            ],
            "Creator": "Fox",
            "Favourites": 38,
            "Genre": 4,
            "HasVideo": false,
            "Language": 8,
            "LastChecked": "2017-01-15T20:28:46Z",
            "LastUpdate": "2013-03-01T11:21:02Z",
            "RankedStatus": 1,
            "SetID": 453,
            "Source": "",
            "Tags": "",
            "Title": "Junge"
        },
        {
            "ApprovedDate": "2008-04-21T23:30:01Z",
            "Artist": "AKITO",
            "ChildrenBeatmaps": [
                262
            ],
            "ChildrenBeatmaps2": [
                {
                    "AR": 3,
                    "BPM": 138,
                    "BeatmapID": 262,
                    "CS": 5,
                    "DiffName": "Normal",
                    "DifficultyRating": 2.0250409,
                    "FileMD5": "74aa0c2284ddf57f7b27823bbdb2fd16",
                    "HP": 4,
                    "HitLength": 0,
                    "MaxCombo": 262,
                    "Mode": 0,
                    "OD": 3,
                    "ParentSetID": 119,
                    "Passcount": 22378,
                    "Playcount": 83281,
                    "TotalLength": 101
                }
            ],
            "Creator": "Kharl",
            "Favourites": 145,
            "Genre": 2,
            "HasVideo": true,
            "Language": 5,
            "LastChecked": "2017-01-15T20:24:59Z",
            "LastUpdate": "2009-04-06T05:33:38Z",
            "RankedStatus": 1,
            "SetID": 119,
            "Source": "DJMAX",
            "Tags": "J-Trance Pasonia",
            "Title": "Sakura Kagetsu"
        }
    ]
}
```

## Beatmap requesting

### POST /api/request

[Requires Security Key.](#security-key)

Allows to force an update of a certain beatmap. This is a fire-and-forget method: once you call it, the beatmap may get queued, however you can't really know for sure. If a CheeseGull server is listening and the beatmap exists, then yes, the download is indeed queued.

#### POST Form parameters

You can pass the beatmap set to request throught the POST form value `set_id`.

#### Response

Returns an [Ok-Message Response](#ok-message-response), with a `BeatmapSet` containing a [`*BeatmapSet`](#beatmapset) (null-able).

#### Examples

```json
$ http --form POST 'http://test/api/request' Authorization:sVmEkaZpEGgdjYVyuIGxWrIFN set_id=1
HTTP/1.1 200 OK
Content-Length: 625
Content-Type: text/plain; charset=utf-8
Date: Mon, 16 Jan 2017 17:49:50 GMT

{
    "BeatmapSet": {
        "ApprovedDate": "2007-10-07T01:46:31Z",
        "Artist": "Kenji Ninuma",
        "ChildrenBeatmaps": [
            75
        ],
        "ChildrenBeatmaps2": [
            {
                "AR": 6,
                "BPM": 119.999,
                "BeatmapID": 75,
                "CS": 4,
                "DiffName": "Normal",
                "DifficultyRating": 2.2919927,
                "FileMD5": "a5b99395a42bd55bc5eb1d2411cbdf8b",
                "HP": 6,
                "HitLength": 0,
                "MaxCombo": 314,
                "Mode": 0,
                "OD": 6,
                "ParentSetID": 1,
                "Passcount": 31459,
                "Playcount": 231169,
                "TotalLength": 108
            }
        ],
        "Creator": "peppy",
        "Favourites": 171,
        "Genre": 2,
        "HasVideo": false,
        "Language": 3,
        "LastChecked": "2017-01-15T19:25:03Z",
        "LastUpdate": "2007-10-07T01:46:31Z",
        "RankedStatus": 1,
        "SetID": 1,
        "Source": "",
        "Tags": "katamari",
        "Title": "DISCO PRINCE"
    },
    "Ok": true
}
```
