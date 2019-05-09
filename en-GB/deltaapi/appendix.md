---
name: Appendix
---
# Appendix

This file contains further information explaining additional stuff on the Delta API not explained in the [main document](v2).

If you'd want to see something implemented in the API, you can open an issue at [this GitHub repository](https://github.com/osuripple/api-features), and we'll look into it.

<!-- toc -->

* [Rate limiting](#rate-limiting)
* [Stability](#stability)
* [Authorization](#authorization)
* [Privileges](#privileges)
* [API Identifiers](#api-identifiers)
* [Multiplayer match IDs](#multiplayer-match-ids)
* [Parameters](#parameters)
* [Pretty printing](#parameters)
* [Response format](#response-format)
* [Arrays](#arrays)
* Enums
  * [Modes IDs](#modes-ids)
  * [Client types](#client-types)
  * [Actions](#actions)
  * [Bancho Privileges](#bancho-privileges)
  * [Multiplayer scoring types](#multiplayer-scoring-types)
  * [Multiplayer team types](#multiplayer-team-types)
  * [Multiplayer Teams](#multiplayer-teams)

<!-- tocstop -->

## Rate limiting

TODO

## Stability

This API release is still in major version 0. Please note that none of the following is final, and subject to change while we are still in version 0.

## Authorization

You can use a Ripple API Token to identify yourself to the API. You can get a Ripple API Token from the following URL: https://ripple.moe/dev/tokens.

When required, the token can be passed (in order of priority):

* With the HTTP header `X-Ripple-Token`
* With the querystring parameter `token`
* With the querystring parameter `k`

If you're using an OAuth bearer token, please use the the `Authorization` header
and prefix it with `Bearer `.

## Privileges

The privileges used by the Delta API are the same as the ones used by the Ripple API. Please refer to [this section of the Ripple API documentation appendix](../api/appendix#privileges) for more information.

## API Identifiers
In the Delta API, there's the concept of API Identifiers: strings identifiying tokens in a unique way. They're largely used in the `clients` and `multiplayer` API handlers. They are in the format `@uuid`. An example of an API identifier may be `@0f23d692-ee91-4a68-af68-080bcfdc1dcf`.  
Note that **the API Identifiers are not the tokens used by the Bancho Protocol to authenticate game clients**, they're different and API Identifiers can only used in the Delta API. API Identifiers are needed because a user may be connected from multiple clients at the same time (eg: two IRC clients and one game client), and sometimes you may want to do something on a specific client, not on all clients that belong to a specific user.

## Multiplayer match IDs
A "Multiplayer Match" is a the multiplayer "room". Each match is identified in the API by an ID. Multiplayer match IDs go from 1 to 2147483647. The counter is reset each time the bancho server emulator is restarted. You can use this ID to manipulate matches through the Delta API (see the [Multiplayer](v2#multiplayer) section). When the first game of a multiplayer room is completed, the match is stored permanently in [vinse](https://vinse.ripple.moe), and a new ID, the vinse ID, is generated. The vinse ID is available through the Delta API as well, but it cannot be used to identify a match.  
For the courious out there, the vinse ID is calculated like this:  
```python
(u // (60 * 15)) << 32 | id
```
Where:

  * `u` is the UNIX timestamp, in seconds, of when the first game in that match was completed;
  * `id` is the "Delta API" match id, the one the one relative to the counter that is reset when the server restarts.

However, you don't need to care about the Vinse ID, since the Ripple stack takes care of generating it.

## Parameters

In GET requests, all parameters are passed through the querystring, while in POST they are passed through a JSON-encoded request body.

## Pretty printing
You can pass the `pretty=1` GET parameter to pretty-print the JSON response:
```
$ curl http://c.vinococc.co/api/v2/ping
{"code":200,"version":"19.0.0"}

$ curl http://c.vinococc.co/api/v2/ping?pretty=1
{
    "code":200,
    "version":"19.0.0"
}
```

## Response format
The HTTP response will always have `Content-Type: application/json; charset=utf-8` and thus it'll always be a JSON object. A `code` field is in **every** response (even when not specified) and it coincides with the HTTP response code. When an error occurrs or when no "response" section is specified in the documentation of a specifid API handler, a `message` field will be present as well, describing the outcome of the request.

The HTTP response codes will always be the same as the internal `code` of the response, if any.
* `404` is used, apart from when a method is missing, also when a specified resource is not found.
* Other used response codes are: TODO

## Arrays

Unlike the Ripple API, the Delta API returns empty JSON arrays (`[]`) instead of `null` when an empty list is returned.


<!--
## Pagination

Pagination is very common in the API, and can be used to get a specific amount of elements, or get all of them in different "chunks". It follows the same pattern: querystring parameters `p` and `l`, which stand for page and limit (possibly one of the few abbreviated querystring parameters in the API). If a request implements pagination, `Implements pagination.` will be written on the description of a request. If the limit maximum is not 50, it will be specified (``Implements pagination (1 < x <= 100)``, in case there's a maximum of 100).

## Time

Time is a tool you can put on the wall, or wear it on your wrist. And, apart from that, it's also that stupid thing humans use to calculate in which part of the day they are.

Time is passed as JSON strings, and formatted using RFC3339. This makes it super-easy to translate times into your programming language's native time, for instance in JavaScript:

```js
> new Date("2016-10-28T21:10:55+02:00")
Fri Oct 28 2016 21:10:55 GMT+0200 (CEST)
```


## IN Parameters

These have a peculiarity. They can be passed multiple times in a query string. What it basically means is that you can look for values being "in a certain group". If you pass in the querystring: `ids=1000&ids=1001&ids=1002`, you will get results for IDs 1000, 1001 and 1002.

## Sorting

The API allows sorting elements. To do so, you will need to pass the parameter `sort`, with the value being the field being sorted, a comma and then asc/desc. By default everything is sorted desc. For instance, `sort=id,desc` will sort by `id` descendently, and also `sort=id` will. When there's a sorting section in an endpoint, the fields that can be sorted will be specified.

## Play style

Play style sometimes appears in the stats of an user. The bitwise enum for it can be found [Here](https://git.zxq.co/ripple/playstyle/src/master/playstyle.go#L11-L21). Must be read as explained in [Privileges](#privileges)
-->

## Enums
These are the enum-like fields used by the Delta API.

### Modes IDs
Just like on the Ripple API:

Game Mode     | Value
--------------|----------
osu! standard | 0
Taiko | 1
Catch the Beat | 2
osu!mania | 3

### Client types

Client type    | Value
---------------|----------
Game | 0
IRC | 1

### Actions

Action     | Value
-----------|----------
Idle | 0
Afk | 1
Playing | 2
Editing a beatmap| 3
Modding a beatmap| 4
In a multiplayer match | 5
Watching | 6
~~UNUSED~~ | ~~7~~
Testing a beatmap | 8
Submitting a beatmap | 9
Paused | 10
In multiplayer lobby | 11
Playing in a multiplayer match | 12
Using osu!direct | 13

### Bancho Privileges

Privilege     | Value | Username colour
--------------|-------|----------------
Normal | 1 | Pale yellow
Community Manager/Chat Mod | 2 | Red
Donor | 4 | Bright yellow
Developer | 8 | Blue
Tournament Staff | 16 |

* _Please note that these can be combined. Eg: `20 <=> 16 | 4` is a Tournament Staff who has Donor._
* _Username color priority: `Blue > Red > Bright Yellow > Pale Yellow`_
* _Also note that the Pink name that "BanchoBot" has on the official server is hardcoded in the client, based on the username, so it's not possible to give any other user a pink name if their name is not "BanchoBot"_


### Multiplayer scoring types

Scoring type     | Value
-----------------|----------
Score | 0
Accuracy | 1
Combo | 2
Score v2 | 3

### Multiplayer team types

Team type     | Value
--------------|----------
Head to head | 0
Tag coop | 1
Team vs | 2
Tag Team vs | 3

### Multiplayer teams

Team      | Value
----------|----------
No team | 0
Red | 1
Blue | 2

* _Please note that `No team (0)` is used only for empty slots or if the team type is "Head to Head" or "Tag Coop" (which have no teams). When the team type is "Team vs" or "Tag Team Vs", all empty slots will be either in the blue or the red team._