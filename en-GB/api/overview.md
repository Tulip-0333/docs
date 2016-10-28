---
name: Overview
---
# Overview

If you'd want to see something implemented in the API, you can open an issue at [this GitHub repository](https://github.com/osuripple/api-features), and we'll look into it.

Currently no API clients are available, however they are planned for Go and node.js. If you've made an API client, please inform us about it and we'll add it to an eventual list that will be put here in the next API documentation versions.

<!-- toc -->

- [Rate limiting](#rate-limiting)
- [Stability](#stability)
- [Authorization](#authorization)
- [Privileges](#privileges)
- [404](#404)
- [Parameters](#parameters)
- [Arrays](#arrays)
- [Response codes](#response-codes)
- [Response JSON fields](#response-json-fields)
- [JSONP](#jsonp)
- [Examples](#examples)
- [Pagination](#pagination)

<!-- tocstop -->

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

