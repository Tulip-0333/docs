---
name: osu!direct API
---
# Levbod (osu!direct) API
Levbod is an API with osu!direct features that can be used to search for beatmaps or get information for a specific beatmap or beatmapset.  
The base URL is:
```
https://storage.ripple.moe/levbod
```

---

## Table of contents

<!-- toc -->
- General API Info
	- [API Response format](#api-response-format)
	- [API Response status codes](#api-response-status-codes)
	- [Beautify](#beautify)
	- [Beatmap ranked statuses](#beatmap-ranked-statuses)
	- [Game modes](#game-modes)
- Handlers
	- Beatmaps listing
		- [GET /listing](#get-%2Flisting)
	- Beatmaps info
		- [GET /beatmap](#get-%2Fbeatmap)
		- [GET /beatmapset](#get-%2Fbeatmapset)
	
<!-- tocstop -->

---

## API Response format
All API handlers return a JSON object with the following structure:
```
{
	"status": status_code,
	"message": "message that explains what happened during the request"
}
```
Some handlers may add different fields to the response (like `data`), however, `status` and `message` are **always** present.  
In some rare cases, the API might return a non-JSON response containing the Python stacktrace if an unhandled exception occurs.

## API Response status codes
The code in the `status` field is also the HTTP status code of the response.  
The status codes that may be returned by the API are:

Status code | Description
------------|-----------------------------------
200			| Request completed successfully
404			| Resource not found or unexisting handler
400			| Invalid or missing arguments
500			| Internal server error

## Beautify
Normally, the JSON response is not beautified, so reading data by hand can be a bit tricky. If you want to return a beautified response, add `beautify=1` or `pretty=1` as a GET parameter.
Example of a non-beautified response:
```
$ curl https://storage.ripple.moe/levbod/beatmapset\?id\=426743
{"status": 200, "data": {"beatmapset_id": 426743, "title": "furioso melodia", "ranked_status": 1, "artist": "gmtn. (witch's slave)", "creator": "MrDorian"}, "message": "ok"}
```


Same response, but beautified:

```
$ curl https://storage.ripple.moe/levbod/beatmapset\?id\=426743\&beautify\=1
{
    "data": {
        "artist": "gmtn. (witch's slave)",
        "beatmapset_id": 426743,
        "creator": "MrDorian",
        "ranked_status": 1,
        "title": "furioso melodia"
    },
    "message": "ok",
    "status": 200
}
```

## Beatmap ranked statuses
osu!direct and osu!api use different numbers to indicate ranked statuses.  
<a name="osudirect-ranked-statuses"></a>
**osu!direct** ranked statuses IDs are:
```
8: loved
0 or 7: ranked
5: graveyard
4: every status
3: qualified
2: pending
Default: Ranked
```
<a name="osuapi-ranked-statuses"></a>
Instead, **osu!api** ranked statuses IDs are:
```
4: loved
3: qualified
2: approved
1: ranked
0: pending
-1: WIP
-2: graveyard
```

## Game modes
The API uses these numbers to indicate osu! game modes:
```
0: osu!std
1: taiko
2: ctb
3: osu!mania
```

## Beatmaps listing

### GET /listing
Gets a list of beatmaps (optionally) matching a query, game mode and ranked status.

#### Parameters

Name        | Description                                                              | Required?
------------|--------------------------------------------------------------------------|----------
`query`     | Search query, checks for title/artist/creator/source/tags.<br>If not passed, the API will return a list of the latest 100 beatmaps added to the mirror and that match the other parameters. | No
`mode`      | [Game mode](#game-modes) filter (-1 to allow every game mode). Default: -1 | No
`status`    | Ranked status filter, [osu!direct format](#osudirect-ranked-statuses). Default: Ranked| No
`page`      | Page number. Default: 0 (first page) | No

#### Response
Returns beatmapsets matching given parameters in the `data` array.  
Each **beatmapset** has the following structure:  

Name            | Description                                                              
----------------|--------------------------------------------------------------------------
`artist`       	| Song artist
`beatmaps`     	| Array containing the `beatmaps` in this set (see below for beatmap structure)
`beatmapset_id`	| ID of this beatmap set
`creator` 		| Beatmap creator username
`ranked_status` | Ranked status, in [osu!api](#osuapi-ranked-statuses) format
`title`   		| Song title

...and each **beatmap** in the set has the following structure:

Name            | Description                                                              
----------------|--------------------------------------------------------------------------
`beatmap_id`    | ID of the beatmap
`difficulty_name`| Difficulty name
`game_mode`	| Difficulty [game mode](#game-modes).

----

## Beatmaps info

### GET /beatmap
Gets basic beatmapset info by beatmap ID.

#### Parameters

Name     | Description                                                              | Required?
---------|--------------------------------------------------------------------------|----------
`id`     | Beatmap ID 																| Yes


#### Response
If the beatmap doesn't exist, `status` will be `404`.  
If the beatmap exists, `status` will be `200` and beatmapset's info will be returned in a JSON object in the `data` field with the following structure:  

Name            | Description                                                              
----------------|--------------------------------------------------------------------------
`artist`       	| Song artist
`beatmapset_id`	| ID of the beatmapset in which this beatmap is in
`creator` 		| Beatmap creator username
`ranked_status` | Ranked status, in [osu!api](#osuapi-ranked-statuses) format
`title`   		| Song title

----

### GET /beatmapset
Gets basic beatmapset info by beatmapset ID. Same as /beatmap, but search by beatmapset id.

#### Parameters

Name     | Description                                                              | Required?
---------|--------------------------------------------------------------------------|----------
`id`     | Beatmapset ID 															| Yes


#### Response
If the beatmapset doesn't exist, `status` will be `404`.  
If the beatmapset exists, `status` will be `200` and beatmap's info will be returned in a JSON object in the `data` field with the following structure:  

Name            | Description                                                              
----------------|--------------------------------------------------------------------------
`artist`       	| Song artist
`beatmapset_id`	| ID of the beatmapset
`creator` 		| Beatmap creator username
`ranked_status` | Ranked status, in [osu!api](#osuapi-ranked-statuses) format
`title`   		| Song title
