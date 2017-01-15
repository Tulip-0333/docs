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
* [Types](#types)
  * [Beatmap](#beatmap)
* [BeatmapSet](#beatmapset)
* [Beatmaps and sets](#beatmaps-and-sets)
  * [GET /api/b/:id](#get-%2Fapi%2Fb%2Fid)
  * [GET /api/s/:id](#get-%2Fapi%2Fs%2Fid)

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

## BeatmapSet

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
