---
name: Types
---
# Types

This page is an appendix of [v1](v1), showing the types most commonly used in
the API, like "user" and such.

<!-- toc -->

- [User](#user)

<!-- tocstop -->

## User

Field name   | Type      | Value
-------------|-----------|-----------------------------------------------------------------
`id`         | `int`     | The ID of the user.
`username`   | `string`  | The username.
`username_aka` | `string`| Alternative username of the user (cannot be used for login).
`registered_on` | [time](overview#time) | Date and time of when the user signed up on Ripple.
`privileges` | `uint64`  | Privileges of the user.
`latest_activity` | [time](overview#time) | Date and time of when the user was last active on Ripple.
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


