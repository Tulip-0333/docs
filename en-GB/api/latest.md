---
name: Latest
---
# Ripple API documentation
### Latest version, 2016

<!--
Reminder to self:
markdown-toc -i en-GB/api/latest.md
-->

<!-- toc -->

- [Overview](#overview)
  * [Rate limiting](#rate-limiting)
  * [Stability](#stability)
  * [Authorization](#authorization)
  * [Privileges](#privileges)
  * [404](#404)
  * [Parameters](#parameters)
  * [Arrays](#arrays)
  * [Response codes](#response-codes)
  * [Response JSON fields](#response-json-fields)
  * [JSONP](#jsonp)
- [Ripple API](#ripple-api)
  * [Miscellaneous](#miscellaneous)
    + [GET /ping](#get-ping)
      - [Response](#response)
      - [Examples](#examples)
    + [GET /surprise_me](#get-surprise_me)
      - [Response](#response-1)
      - [Examples](#examples-1)
  * [Tokens](#tokens)
    + [POST /tokens](#post-tokens)
      - [JSON fields](#json-fields)
      - [Response](#response-2)
      - [Errors](#errors)
      - [Examples](#examples-2)
    + [POST /tokens/new](#post-tokensnew)
    + [GET /tokens](#get-tokens)
    + [GET /tokens/self](#get-tokensself)
    + [GET /tokens/self/delete](#get-tokensselfdelete)
- [peppy API](#peppy-api)
  * [User](#user)
    + [GET /get_user](#get-get_user)
      - [Parameters](#parameters-1)
      - [Examples](#examples-3)
  * [User scores](#user-scores)
    + [GET /get_user_recent](#get-get_user_recent)
      - [Parameters](#parameters-2)
      - [Examples](#examples-4)
    + [GET /get_user_best](#get-get_user_best)
      - [Parameters](#parameters-3)
      - [Examples](#examples-5)
- [Notes](#notes)
  * [Modes IDs](#modes-ids)
  * [Ranked statuses on Ripple](#ranked-statuses-on-ripple)

<!-- tocstop -->

# Overview

If you'd want to see something implemented in the API, you can open an issue at [this GitHub repository](https://github.com/osuripple/api-features), and we'll look into it.

Currently no API clients are available, however they are planned for Go and node.js. If you've made an API client, please inform us about it and we'll add it to an eventual list that will be put here in the next API documentation versions.

## Rate limiting

All requests are rate limited. There is a global limit of 5000 requests per second, and then if a token is passed and is valid, the user (not the token) is limited to 2000 requests per minute. If no token is passed or the token is invalid, there is a limit of 60 requests per minute per IP address. If with the request you made you're over your limit, your request will hang until you can make requests again. No 429 response with a Retry-After header, or anything like that. We handle the waiting. You wait in line. Plain and simple.

## Stability

This API release is still in major version 0. Please note that none of the following is final, and subject to change while we are still in version 0.

## Authorization

To perform certain actions on the Ripple API, you'll need a token. A token can be retrieved through the API itself using the method POST /tokens (documented afterwards). This is currently the only method, please note, though, that oAuth is guaranteed to be implemented by the API stable release (1.0.0), and also this method will disappear as soon as it's possible to create tokens from the website itself with a simple click. Applications made before the API stable release should be prepared to accept the change of functionality in the API, while we are still in the major version 0.

When required, the token can be passed (in order of priority):

* With the HTTP header `X-Ripple-Token`
* With the querystring parameter `token`
* With the querystring parameter `k`
* With the cookie `rt`

A token SHOULD match the regular expression `^[0-9a-f]{32}$`.

## Privileges

Associated with a Token will also be a series of privileges. The current privileges for the API are the following:

```go
const (
	PrivilegeReadDEPRECATED   = 1 << iota // deprecated, methods with PrivilegeRead used to be the ones that now are "auth-free"
	PrivilegeReadConfidential             // (eventual) private messages, reports... of self
	PrivilegeWrite                        // change user information, write into confidential stuff...
	PrivilegeManageBadges                 // can change various users' badges.
	PrivilegeBetaKeys                     // can add, remove, upgrade/downgrade, make public beta keys.
	PrivilegeManageSettings               // maintainance, set registrations, global alerts, bancho settings
	PrivilegeViewUserAdvanced             // can see user email, and perhaps warnings in the future, basically.
	PrivilegeManageUser                   // can change user email, allowed status, userpage, rank, username...
	PrivilegeManageRoles                  // translates as admin, as they can basically assign roles to anyone, even themselves
	PrivilegeManageAPIKeys                // admin permission to manage user permission, not only self permissions. Only ever do this if you completely trust the application, because this essentially means to put the entire ripple database in the hands of a (potentially evil?) application.
	PrivilegeBlog                         // can do pretty much anything to the blog, and the documentation.
	PrivilegeAPIMeta                      // can do /meta API calls. basically means they can restart the API server.
	PrivilegeBeatmap                      // rank/unrank beatmaps. also BAT when implemented
)
```

In case you don't know Go: PrivilegeReadDEPRECATED is `1 << 0` (1), PrivilegeReadConfidential `1 << 1` (2), PrivilegeWrite `1 << 2` (4), PrivilegeManageBadges `1 << 3` (8), and so on.

Applications accessing public data, such as leaderboards, documentation files, user data, user scores will not require any privilege. They will not require any API token, for that matter (though the requests they can do will be highly limited). Either way, at the moment normal users can only request for ReadConfidential and Write. Combining privileges can be done with a bitwise OR: `PrivilegeWrite | PrivilegeReadConfidential` (= 5). If you want to test the API and always want to have the most of the privileges you can possibly have, requesting a token with a very high power of 2 minus one will basically enable all the privileges you're allowed to have. For instance, `1 << 31 - 1` (2147483647), which if you're not familiar with bit shifting, it essentially means `2^31 - 1`.

## 404

When using the Ripple API, you may receive a JSON object with `"code": 404` either because the API call doesn't exist or because the requested information could not be found. To help you detect this, the header `X-Real-404` with `yes` is passed when, you guessed it, it's a real 404 and it's not that data could not be found.

If you get a 404 response for a request listed on this API specification, then you should double-check the method is correct. The web framework we use for the API ([gin](https://github.com/gin-gonic/gin)) makes a distinction between GET requests and POST requests, which means if you use GET on a request documented as a POST request or vice versa, you will receive a 404 and everything is normal and intended.

## Parameters

In GET requests, all parameters are passed through the querystring, while in POST they are passed through a JSON-encoded request body.

## Arrays

Often in the API responses you will encounter JSON arrays. They are particular: if they are empty, they are `null`. This is due to Go's slices, because they are always `nil`-lable. If you think this is a problem, hit me at the GitHub issue tracker provided before.

## Response codes

The HTTP response codes will always be the same as the internal `code` of the response, if any. If you require requests to be always 200, pass `pls200` in the GET parameters. (This will only be overridden by 500 errors and 404 errors for non-existing methods).

## Response JSON fields

These are only explained in the documentation when they are not obvious from the examples. Also, in the Peppyapi, they are not explained at all, because they're already documented on the official API documentation.

## JSONP

If you want to use JSONP, pass a `callback` in the GET parameters, like [this](https://ripple.moe/api/v1/ping?callback=yourFunction). callback names are very restrictive for security reasons, and they must match the regular expression `^[a-zA-Z_\$][a-zA-Z0-9_\$]*$`. If you have problems with this, make an issue at the issue tracker.

# Ripple API

The Ripple API is an API built and designed specifically for Ripple. The base URL is:

<!-- Dirty hack to not have any formatting -->
```bash
https://ripple.moe/api/v1
```

E.g., the URL for a GET /ping request would be

```bash
https://ripple.moe/api/v1/ping
```

## Miscellaneous

### GET /ping

Check the API is alive, and check your token's privileges.

#### Response

Field name     | Type     | Value
---------------|----------|-----------------------------------------------------------------
`message`      | `string` | A human-readable message, notifying you about a token not given or telling you a message taken straight from surprise_me.
`privileges`   | `uint64` | [Privileges](#privileges) of the token.
`privileges_string` | `string` | A string representation of `privieges`, for easily understanding the token's privileges.
`user_id`      | `int`    | The token's user ID.
`user_privileges` | `uint64` | A bitwise enum containing the privileges of the user (not the token!).
`user_privileges_string` | `string` | A string representation of the privileges of `user_privileges`.

#### Examples

```http
$ http 'ripple.moe/api/v1/ping'
HTTP/1.1 200 OK
CF-RAY: 2f76f6d2f0990e2a-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 208
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:14:53 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

{
    "code": 200,
    "message": "You have not given us a token, so we don't know who you are! But you can still login with POST /tokens ヽ( ★ω★)ノ",
    "privileges": 0,
    "privileges_string": "",
    "user_id": 0,
    "user_privileges": 0,
    "user_privileges_string": ""
}
```

```http
$ http 'ripple.moe/api/v1/ping' 'X-Ripple-Token:<strip>'
HTTP/1.1 200 OK
CF-RAY: 2f76fb0ef4a63d7d-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 302
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:17:47 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

{
    "code": 200,
    "message": "The brace is on fire! ＼(=^‥^)/’`",
    "privileges": 1048576,
    "privileges_string": "",
    "user_id": 1009,
    "user_privileges": 3141499,
    "user_privileges_string": "UserPublic, UserNormal, AdminAccessRAP, AdminManageUsers, AdminBanUsers, AdminSilenceUsers, AdminManageBeatmap, AdminManageServer, AdminManageSetting, AdminManageBetaKey, AdminManageDocs, AdminManageBadges, AdminViewRAPLogs, AdminManagePrivilege, AdminSendAlerts, AdminChatMod, AdminKickUsers, UserTournamentStaff"
}
```

### GET /surprise_me

A test API endpoint that spits some random sentences.

#### Response

Field name | Type       | Value
-----------|------------|-----------------------------------------------------------------
`cats`     | `[]string` | Random sentences and cats and things.

#### Examples

```http
$ http 'ripple.moe/api/v1/surprise_me'
HTTP/1.1 200 OK
CF-RAY: 2f77065604df0e18-MXP
Connection: keep-alive
Content-Encoding: gzip
Content-Length: 1155
Content-Type: application/json; charset=utf-8
Date: Tue, 25 Oct 2016 16:25:29 GMT
Server: cloudflare-nginx
Vary: Accept-Encoding

{
    "cats": [
        "Hi! I'm Flowey! Flowey the flower! o(^・x・^)o",
        "sudo rm -rf / (=｀ェ´=)",
        "PP when? Σ(*ﾉ´>ω<｡`)ﾉ",
        "Ripple devs are actually cats d(=^･ω･^=)b",
        "Ripple devs are actually cats ((≡^⚲͜^≡))",
        "Hi! I'm Flowey! Flowey the flower! （ﾉ｡≧◇≦）ﾉ",
        "deverupa ga daisuki! (=ＴェＴ=)",
        "PP when? Σ(*ﾉ´>ω<｡`)ﾉ",
        "sudo rm -rf / d(=^･ω･^=)b",
		...
    ],
    "code": 200
}
```

## Tokens

### POST /tokens

Create a new token using username and password. This **will** work differently in the future, because of reasons explained in the overview. Also, this is useful only if you want to make a token for yourself. Do not use this in your public application to authorize users. Use oAuth instead (when it will be ready).

With this request, you can pass the parameter `privileges` to select the privileges to get for your token. Please note, however, that privileges the user may not have will be silently removed.

#### JSON fields

Field name    | Description                                                               | Required?
--------------|---------------------------------------------------------------------------|----------
`username`    | Username of the user we should generate the token of.                     | Only if `id` is not given
`id`          | User ID of the user we should generate the token of.                      | Only if `username` is not given
`password`    | Password of the user.                                                     | Yes
`privileges`  | Privileges of the token, as defined in [Privileges](#privileges).         | No (defaults 0)
`description` | Optional description of the token.                                        | No (defaults "")

#### Response

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`username`   | `string`  | The username of the token's user.
`id`         | `int`     | The ID of the token's user.
`privileges` | `uint64`  | Accepted privileges of the token.
`token`      | `string`  | Generated token. It will be shown only in this response, so store it!
`banned`     | `bool`    | Whether the user is banned. If this is true, token will be an empty string.

#### Errors

Code  | Meaning
------|------------------------
`404` | No user with that username/id.
`429` | Too many login attempts.
`418` | Teapots: the user's password is so old, that it still uses password version 1, and for the user to be able to use the API, they need to first login through the website.
`400` | Bad JSON
`422` | Missing either username/id or password.
`403` | Invalid password.
`402` | User banned. This is 402 just to differentiate it from 403. We do not actually require a payment. No, you can not evade your ban with a payment.

#### Examples

```
$ curl -X POST -d '{"username": "Howl", "password": "<strip>"}' ripple.moe/api/v1/tokens
{
        "code": 200,
        "username": "Howl",
        "id": 1009,
        "privileges": 0,
        "token": "<strip>",
        "banned": false
}
```

### POST /tokens/new

Alias of `POST /tokens`

### GET /tokens

### GET /tokens/self

### GET /tokens/self/delete

# peppy API

The peppy API is an API built to mimic the behaviour of the official osu! API. Currently most requests are supported, however there are a few that for various reasons are still left out. In case you've never used the osu! API: this is a **very** simple API, and from analysing the official one you can easily understand that it's just a couple of PHP scripts smashed together that return the JSON-encoded values of what is returned by a database query. Nevertheless, we try to mimic it as much as possible, to make it's 100% backwards-compatible with the osu! API.

In-depth documentation can be found at https://github.com/ppy/osu-api/wiki

The base url is:

```text
https://ripple.moe/api
```

E.g., the URL for a GET /get_user request would be

```text
https://ripple.moe/api/get_user
```

As this API aims to mimic the osu! API, you can also access it using osu.ppy.sh (having osu.ppy.sh redirected to the Ripple server in the hosts file).

```text
https://osu.ppy.sh/api/get_user
```

The peppy API has no authorization whatsoever. Further, Rate Limiting is IP-only, meaning the API token passed is completely disregarded and does not influence the rate limiting. All requests are limited to 60 requests per minute per IP, period.

All requests will result in a 200 response, except for: 404 for requests not implemented yet, 500 in case something went **horribly** wrong, 502/503 in case we fucked up something on our webserver.

```
[x] get_beatmaps (partially)
[x] get_user
[x] get_scores
[x] get_user_best
[x] get_user_recent
[ ] get_match (empty array is always returned)
[ ] get_replay
```

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

