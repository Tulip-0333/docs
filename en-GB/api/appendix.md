---
name: Appendix
---
# Appendix

This file contains further information explaining additional stuff on the Ripple API not explained in the [main document](v1).

If you'd want to see something implemented in the API, you can open an issue at [this GitHub repository](https://github.com/osuripple/api-features), and we'll look into it.

Currently no API clients are available, however they are planned for Go and node.js. If you've made an API client, please inform us about it and we'll add it to an eventual list that will be put here in the next API documentation versions.

<!-- toc -->

* [Rate limiting](#rate-limiting)
* [Stability](#stability)
* [Authorization](#authorization)
* [Privileges](#privileges)
* [OAuth](#oauth)
* [404](#404)
* [Parameters](#parameters)
* [Arrays](#arrays)
* [Response codes](#response-codes)
* [Response JSON fields](#response-json-fields)
* [JSONP](#jsonp)
* [Examples](#examples)
* [Pagination](#pagination)
* [Time](#time)
* [Usernames](#usernames)
* [IN Parameters](#in-parameters)
* [Sorting](#sorting)
* [Play style](#play-style)
* [Modes IDs](#modes-ids)

<!-- tocstop -->

## Rate limiting

All requests are rate limited. There is a global limit of 5000 requests per second, and then if a token is passed and is valid, the user (not the token) is limited to 2000 requests per minute. If no token is passed or the token is invalid, there is a limit of 60 requests per minute per IP address. If with the request you made you're over your limit, your request will hang until you can make requests again. No 429 response with a Retry-After header, or anything like that. We handle the waiting. You wait in line. Plain and simple.

## Stability

This API release is still in major version 0. Please note that none of the following is final, and subject to change while we are still in version 0.

## Authorization

To perform certain actions on the Ripple API, you'll need a token. A token can be requested through the Ripple website at the following URL: https://ripple.moe/dev/tokens.

When required, the token can be passed (in order of priority):

* With the HTTP header `X-Ripple-Token`
* With the querystring parameter `token`
* With the querystring parameter `k`
* With the cookie `rt`

A token SHOULD match the regular expression `^[0-9a-f]{32}$`.

Please note that you can not use an OAuth bearer token the same way as a regular
token, in order to access the API with a bearer token you'll need to pass it in
the `Authorization` header, prefixed by `Bearer `.

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
	PrivilegeBancho                       // can log in to bancho and use the chat through the delta ws api
)
```

In case you don't know Go: PrivilegeReadDEPRECATED is `1 << 0` (1), PrivilegeReadConfidential `1 << 1` (2), PrivilegeWrite `1 << 2` (4), PrivilegeManageBadges `1 << 3` (8), and so on.

Applications accessing public data, such as leaderboards, documentation files, user data, user scores will not require any privilege. They will not require any API token, for that matter (though the requests they can do will be highly limited). Either way, at the moment normal users can only request for ReadConfidential and Write. Combining privileges can be done with a bitwise OR: `PrivilegeWrite | PrivilegeReadConfidential` (= 5). If you want to test the API and always want to have the most of the privileges you can possibly have, requesting a token with a very high power of 2 minus one will basically enable all the privileges you're allowed to have. For instance, `1 << 31 - 1` (2147483647), which if you're not familiar with bit shifting, it essentially means `2^31 - 1`.

## OAuth

If you're developing a service and you want to identify users, you're likely
gonna need to use OAuth. Ripple aims to follow the OAuth 2 RFCs as closely as
possible; if you notice a discrepancy, don't hesitate to
[create an issue](https://github.com/osuripple/api-features).

At the moment OAuth has the scopes `read_confidential` and `write`. They match
the privileges PrivilegeReadConfidential and PrivilegeWrite. To concatenate
privileges, you need to join them with a space, [as defined in RFC6749](https://tools.ietf.org/html/rfc6749#section-3.3).

The Ripple OAuth implementation does not make use of refresh tokens. Access
tokens are valid until an user revokes it from the
[Authorized applications page](https://ripple.moe/settings/authorized_applications),
the application is deleted or the token is deleted through `POST /tokens/self/delete`.

In order to register an OAuth application, you'll need to request it from
the following page on the Ripple website: https://ripple.moe/dev/apps. Once you
obtain your `client_id` and `client_secret`, you should be able to simply plug
them in inside the OAuth 2 implementatin in your programming language, and using
the following URLs:

- Authorization URL: `https://ripple.moe/oauth/authorize`
- Token URL: `https://ripple.moe/oauth/token`
- Resource owner details: `https://ripple.moe/api/v1/ping`

An example of an OAuth implementation can be seen on [GitHub](https://github.com/osuripple/oauth-example).

Once you have obtained a token, you may access resources on the Ripple API on
behalf of the user by passing the token in the `Authorization` HTTP header,
prefixed by `Bearer`, followed by a space.

## 404

When using the Ripple API, you may receive a JSON object with `"code": 404` either because the API call doesn't exist or because the requested information could not be found. To help you detect this, the header `X-Real-404` with `yes` is passed when, you guessed it, it's a real 404 and it's not that data could not be found.

If you get a 404 response for a request listed on this API specification, then you should double-check the method is correct. The web framework we use for the API ([gin](https://github.com/gin-gonic/gin)) makes a distinction between GET requests and POST requests, which means if you use GET on a request documented as a POST request or vice versa, you will receive a 404 and everything is normal and intended.

## Parameters

In GET requests, all parameters are passed through the querystring, while in POST they are passed through a JSON-encoded request body.

## Arrays

Often in the API responses you will encounter JSON arrays. They are particular: if they are empty, they are `null`. This is due to Go's slices, because they are always `nil`-lable. If you think this is a problem for your purpose, hit me at the GitHub issue tracker provided before.

## Response codes

The HTTP response codes will always be the same as the internal `code` of the response, if any. If you require requests to be always 200, pass `pls200` in the GET parameters. (This will only be overridden by 500 errors and 404 errors for non-existing methods).

As already mentioned before, `404`s in the API are used, apart from when a method is missing, also when a specified resource is not found in the database. Because of the fact that they're only second to `200`s when it comes to the most common response codes, they are often omitted in the requests documentation.

Generally speaking, though, requests that return multiple results will return an empty array ([`null`](#arrays)), and those that only return one will return a 404 if the requested element is not found.

POST requests may also return a `422` if there are missing fields, as recommended by our lord and saviour [Stack Overflow](http://stackoverflow.com/a/10323055/5328069).

## Response JSON fields

These are only explained in the documentation when they are not obvious from the examples. Also, in the Peppyapi, they are not explained at all, because they're already documented on the official API documentation.

## JSONP

If you want to use JSONP, pass a `callback` in the GET parameters, like [this](https://ripple.moe/api/v1/ping?callback=yourFunction). callback names are very restrictive for security reasons, and they must match the regular expression `^[a-zA-Z_\$][a-zA-Z0-9_\$]*$`. If you have problems with this, make an issue at the issue tracker.

## Examples

All examples are done using [HTTPie](https://github.com/jkbrzt/httpie), which is basically curl for humans, which is to say for people who can't ever remember what curl's arguments are. Basically makes visualising examples much easier. Also, the `Set-Cookie` header is removed from all responses, for security purposes, otherwise there'd be my cloudflare IDs in there.

## Pagination

Pagination is very common in the API, and can be used to get a specific amount of elements, or get all of them in different "chunks". It follows the same pattern: querystring parameters `p` and `l`, which stand for page and limit (possibly one of the few abbreviated querystring parameters in the API). If a request implements pagination, `Implements pagination.` will be written on the description of a request. If the limit maximum is not 50, it will be specified (``Implements pagination (1 < x <= 100)``, in case there's a maximum of 100).

## Time

Time is a tool you can put on the wall, or wear it on your wrist. And, apart from that, it's also that stupid thing humans use to calculate in which part of the day they are.

Time is passed as JSON strings, and formatted using RFC3339. This makes it super-easy to translate times into your programming language's native time, for instance in JavaScript:

```js
> new Date("2016-10-28T21:10:55+02:00")
Fri Oct 28 2016 21:10:55 GMT+0200 (CEST)
```

## Usernames

Just like the osu! API, there is no difference between an underscore and a space in an username.

## IN Parameters

These have a peculiarity. They can be passed multiple times in a query string. What it basically means is that you can look for values being "in a certain group". If you pass in the querystring: `ids=1000&ids=1001&ids=1002`, you will get results for IDs 1000, 1001 and 1002.

## Sorting

The API allows sorting elements. To do so, you will need to pass the parameter `sort`, with the value being the field being sorted, a comma and then asc/desc. By default everything is sorted desc. For instance, `sort=id,desc` will sort by `id` descendently, and also `sort=id` will. When there's a sorting section in an endpoint, the fields that can be sorted will be specified.

## Play style

Play style sometimes appears in the stats of an user. The bitwise enum for it can be found [Here](https://git.zxq.co/ripple/playstyle/src/master/playstyle.go#L11-L21). Must be read as explained in [Privileges](#privileges)

## Modes IDs

```
osu! standard  = 0
Taiko          = 1
Catch the Beat = 2
osu!mania      = 3
```
