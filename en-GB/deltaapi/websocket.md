---
name: Delta Websocket API
---
# Delta Websocket API

> If you're browsing this on GitHub or zxq.co, please note that this is not final until you see it on docs.ripple.moe. Some stuff needs to be implemented, some stuff will be renamed, some stuff behaves differently in production compared to what's written in this document.

Delta has a Websocket API that's mainly used to interact with the chat. The conventional way of creating Ripple Chat Bots is by using IRC. This is still possible in Delta, but the recommended way of creating chatbots is using the Websocket API. This is because the Websocket API provides more information about clients (like their api identifiers), making it possible to identify which client sent a particular message, rather than just their username.

To start a connection, you must connect to this websocket URL:
```
wss://c.ripple.moe/api/v2/ws
```

or

```
ws://c.ripple.moe/api/v2/ws
```

The recommended one is, of course, wss (WebSocket Secure).

Do not get scared by the Table of Contents, you can set up a working chat bot by adding support for just a few messages. If you want to get quickly started, we recommend you reading the [Messages](#messages), [Pinging](#pinging) and [Authenticating](#authenticating) sections and read the rest as you need it. You can also check the source code for our Chat Bot, [FokaBot](https://zxq.co/ripple/fokabot), which uses the Delta Websocket API to enstablish a connection to our bancho server emulator.

## Table of Contents

<!-- toc -->

* [Messages](#messages)
* [Simple Messages](#simple-messages)
* [Pinging](#pinging)
* [General](#general)
  * [echo (client)](#echo-(client))
  * [ohce (client)](#ohce-(client))
  * [goodbye (server)](#goodbye-(client))
  * [server_announce (server)](#server_announce-(server))
* [General Errors](#)
  * [json_error (server)](#)
  * [forbidden (server)](#)
  * [not_acceptable (server)](#)
  * [invalid_arguments (server)](#)
* [Authenticating](#authenticating)
  * [auth (client)](#auth-(client))
  * [auth_success (server)](#auth_success-(server))
  * [auth_failure (server)](#auth_failure-(server))
  * [whoami (client)](#whoami-(client))
  * [your_user_info (server)](#your_user_info-(server))
* [Chat](#chat)
  * [join_chat_channel (client)](#join_chat_channel-(client))
  * [chat_channel_joined (server)](#chat_channel_joined-(server))
  * [chat_channel_join_failed (server)](#chat_channel_join_failed-(server))
  * [leave_chat_channel (client)](#leave_chat_channel-(client))
  * [chat_channel_left (server)](#chat_channel_left-(server))
  * [chat_channel_leave_failed (server)](#chat_channel_leave_failed-(server))
  * [chat_message (server)](#chat_message-(server))
  * [chat_message (client)](#chat_message-(client))
  * [channel_not_found (server)](#channel_not_found-(server))
  * [channel_forbidden (server)](#channel_forbidden-(server))
  * [you_are_spamming (server)](#you_are_spamming-(server))
  * [you_are_silenced (server)](#you_are_silenced-(server))
  * [target_not_found (server)](#target_not_found-(server))
  * [target_silenced (server)](#target_silenced-(server))
  * [target_restricted (server)](#target_restricted-(server))
  * [target_blocking_pms (server)](#target_blocking_pms-(server))
  * [target_away (server)](#target_away-(server))
  * [silence_info (server)](#silence_info-(server))
  * [user_joined_channel (server)](#user_joined_channel-(server))
  * [user_left_channel (server)](#user_left_channel-(server))
* [Events](#events)
  * [subscribe (client)](#subscribe-(client))
  * [subscribed (server)](#subscribed-(server))
  * [unsubscribe (client)](#unsubscribe-(client))
  * [unsubscribed (server)](#unsubscribed-(server))
* [Chat Channels Events](#chat-channels-events)
  * [chat_channel_added (server)](#chat_channel_added-(server))
  * [chat_channel_removed (server)](#chat_channel_removed-(server))


<!-- tocstop -->


## Messages

Delta's Websocket API has a very simple protocol based on [JSON](https://en.wikipedia.org/wiki/JSON). Each information exchanged between the client and the server (and vice versa) is called a "Message".

**All** messages have the following structure:

Field name | Type | Value
-----------|------|-------
`type` | `string` | A string identifying the type of this message
`data` | `[]object` | A JSON object containing additional data carried by the message

The structure of the `data` field varies based on the `type` of the message. The `data` field is always present, even for messages that do not carry additional data. In this case, the `data` field will be an empty JSON object (`{}`).

## Simple Messages
Quite a few messages used by the Websocket API only carry some text. They are often used to report errors back to the client. These messages are called "Simple Messages" and their `data` field has the following structure:

Field name | Type     | Value
-----------|----------|-----------------
`message`  | `string` | Information text

### Example
```
{
    "type": "auth_failure",
    "data": {
        "message": "You must provide an API token with the 'BANCHO' privileges to log in to bancho through the ws API."
    }
}
```

## Pinging
The server will periodically ping every Websocket client that hasn't sent any message to the server to make sure they're still alive and working correctly.  
Whenever you send a valid message, the server will mark you as 'alive' and will not attempt to ping you for a while.

When you get a 'ping' message from the server, you should reply with a 'pong' (or any other valid message) as soon as possible (S is the sever, C is the client):  
```
S: {"type": "ping", "data": {}}
C: {"type": "pong", "data": {}}
```
Sending a 'pong' message (or any other message, really) is sufficient for the server to mark you as 'alive'.  

If you want to be 100% sure the server got your pong message, you can also ask the server to reply to your pong with an ack message:
```
S: {"type": "ping", "data": {}}
C: {"type": "pong", "data": {"reply": true}}
S: {"type": "pong_ack", "data": {"last_ping_time": 1567608532}}
```
`last_ping_time` will contain the UNIX timestamp of when the server received your most recent valid message.  

Finally, you can also ping the server to make sure it is alive
```
C: {"type": "ping", "data": {}}
S: {"type": "pong", "data": {}}
```

You can also send a 'ping' or 'pong' to the server periodically to mark yourself as alive, without waiting for the server to 'ping' you.

## General

### echo (client)

Test message that will make the server repeat whatever you send it

#### Privileges
None.

#### Data

Name | Type | Description | Required? | Default
-----|------|-------------|-----------|---------
`message` | `string` | The message the server will send you back. | Yes |

#### Responses

The server will reply with a [ohce](#ohce-(server)) message.

---

### ohce (server)

Response-like message to an [echo](#echo-(client)) message.

#### Data

Name | Type | Description
-----|------|-------------
`message` | `string` | The message you originally sent to the server.

#### Example
```
C: {"type": "echo", "data": {"message": "Hello!"}}
S: {"type": "ohce", "data": {"message": "Hello!"}}
```

---

### goodbye (server)

The server will attempt to send this message right before closing the Websocket connection, whether the connection is closed by the client or by the server itself (eg: timeout, server restarting, getting kicked...). Trying to send a message after a 'goodbye' message will have no effect.

#### Data

No additional data is sent (`{}`)

#### Example
```
S: {"type": "goodbye", "data": {}}
--- connection closed ---
```

---

### server_announce (server)

TODO maybe rename

Server notifications (those that appear as yellow notifications in-game). They usually originate from the server itself (login news, server restarting alerts, ...) but they can also originate from API applications (see [POST /clients/{api_identifier}/alert](v2#post-%2Fclients%2F%7Bapi_identifier%7D%2Falert) HTTP API handler)

#### Data

Name | Type | Description
-----|------|-------------
`message` | `string` | Announce message.

---


## Authenticating

### auth (client)

The first thing you should do after you enstablish a Websocket connection to the Delta Websocket API is authenticate yourself. This message is the one that must be used to do so. It can be used only when the current Websocket client is not authenticated. You must authenticate before you can use most of the Websocket API features.

#### Privileges
The provided token must not be already authenticated and the user linked to it must not be restricted, banned or pending verification.

#### Data

Name | Type | Description | Required? | Default
-----|------|-------------|-----------|---------
`token` | `string` | The API token you want to use to authenticate. | Yes |

* **The token must have the [PrivilegeBancho](/docs/api/appendix#privileges) privilege.**
* Bearer tokens are supported as well, and they must be prefixed with `Bearer ` (eg: if your token is `abcd`, you'll have to set `token` to `Bearer 123`).
* You must wait for an `auth_success` message before sending any message that requires you be authenticated

#### Responses

One of these messages will be sent by the server as a response:

Code  | Meaning
------|------------------------------------------------
[auth_success](#auth_success-(server)) | Logged in successfully
[auth_failure](#failure-(server)) | Could not log in (wrong token, server restarting, account banned...)
forbidden    | You are already authenticated

#### Examples
```
TODO
```

---

### auth_success (server)

Response-like message sent by the server after authenticating successfully. **Once you receive this message, you'll appear online in-game** (with no information on your user panel, like an IRC client) and you'll be able to send messages and trigger actions that require authentication. Before you ask, the ability to change your user panel through the Websocket API will come in future releases 😉.

#### Data
The `data` field contains your WebSocket [Client] you've just authenticated.

#### Examples
```
TODO
```

---

### auth_failure (server)

Response-like [Simple Message] sent by the server after an [auth](#auth-(client)) message, in case the client could not be authenticated:

- Invalid token provided
- The provided token does not have the `PrivilegeBancho` privilege
- The server is restarting and it's not accepting connections anymore
- The account linked to the token is pending verification
- Banned or restricted account
- The server is in maintenance mode and does not accept connections from regular users

---

### whoami (client)

Once you're authenticated, you can send this message to retreive information about your Websocket client.

#### Privileges
The provided token must be authenticated.

#### Data

No additional data required (`{}`)

#### Responses

The server will reply with a [your_user_info](#your_user_info-(server)) message.

---

### your_user_info (server)

Response-like message sent by the server after a [whoami](#whoami-(client)) message.

#### Data

The `data` field contains the [Client] object relative to your Websocket client.

---

## Chat

### join_chat_channel (client)

This message can be used to join chat channels. Once you join a channel, you'll receive [chat_message](#TODO) messages send to that channel. You can join however many channels you want, as long as you have the required privileges to join them. You can also join `#multi_*` and `#spect_*` channels. You can get a list of the available chat channels using the [GET /chat_channels](v2#get-%2Fchat_channels) HTTP API handler.

#### Privileges
- The provided token must be authenticated.
- Additional user privileges may be required to join special channels such as `#admin`. Long story short, if you can't join a channel from in-game, you can't join it from the Websocket API either.

#### Data

Name | Type | Description | Required? | Default
-----|------|-------------|-----------|---------
`name` | `string` | Name of the channel you want to join. | Yes |

#### Responses

One of these messages will be sent by the server as a response:

Code  | Meaning
------|------------------------------------------------
[chat_channel_joined](#chat_channel_joined-(server)) | Chat channel joined successfully.
[invalid_arguments] | The specified chat channel does not exist
[chat_channel_join_failed](#chat_channel_join_failed-(server)) | The specified chat channel exists, but it's not possible to join it.

---

### chat_channel_joined (server)

Response-like message sent by the server after joining a chat channel successfully through [join_chat_channel](#join_chat_channel-(client)).


#### Data
The `data` field contains the [Chat Channel] you've just joined.

---

### chat_channel_join_failed (server)

Response-like message sent by the server after a [join_chat_channel](#join_chat_channel-(client)) message, in case the client could not join the specified chat channel:

- The client doesn't have the required privileges to join the specified chat channel
- The client is already in the specified chat channel

#### Data

Name | Type | Description
-----|------|-------------
`channel` | `object` | [Chat Channel] that you attempted to join
`reason` | `string` | Additional information about why the join action failed.

---

### leave_chat_channel (client)

This message can be used to leave a chat channel that you've previously joined with a [join_chat_channel](#join_chat_channel-(client)) message. Once you leave a channel, you will not receive [chat_message] relative to that chat channel anymore.

#### Privileges
The provided token must be authenticated

#### Data

Name | Type | Description | Required? | Default
-----|------|-------------|-----------|---------
`name` | `string` | Name of the channel you want to leave. | Yes |

#### Responses

One of these messages will be sent by the server as a response:

Code  | Meaning
------|------------------------------------------------
[chat_channel_left](#chat_channel_left-(server)) | Chat channel left successfully.
[invalid_arguments] | The specified chat channel does not exist
[chat_channel_leave_failed](#chat_channel_leave_failed-(server)) | Could not leave the specified channel

---

### chat_channel_left (server)

Response-like message sent by the server after leaving a chat channel successfully through [leave_chat_channel](#leave_chat_channel-(client)).


#### Data
The `data` field contains the [Chat Channel] you've just left.

---

### chat_channel_leave_failed (server)

TODO: Implement this!

Response-like message sent by the server after a [leave_chat_channel](#leave_chat_channel-(client)) message, in case the client could not leave the specified chat channel.

#### Data

Name | Type | Description
-----|------|-------------
`channel` | `object` | [Chat Channel] that you attempted to leave
`reason` | `string` | Additional information about why the leave action failed.

---

### chat_message (server)

This message is sent by the server whenever a message is sent to a channel you've joined or someone sends you a private message.

#### Privileges
The provided token must be authenticated

#### Data

Name | Type | Description
-----|------|-------------
`sender` | `object` | Sender [Client].
`recipient` | `object` | Either your [Client] (if it's a PM) or the [Chat Channel] this message was sent to (if it's a public message).
`pm` | `boolean` | `true` if and only if the message is a PM (if and only if the recipient is a [Client])
`message` | `string` | The actual message

---

### chat_message (client)

This message can be used to send a private message or a public message to a channel you've previously joined with a [join_chat_channel](#join_chat_channel-(client)) message.

#### Privileges
The provided token must be authenticated

#### Data

Name | Type | Description | Required? | Default
-----|------|-------------|-----------|---------
`message` | `string` | Content of the message | Yes |
`target` | `string`\|`integer` | Recipient. It can be:<ul><li>The name of a chat channel (it must start with `#`)</li><li>A user ID</li><li>A username (safe or non-safe, case insensitive)</li></ul>  | Yes |

#### Responses

One of these messages may be sent by the server shortly after:

TODO get rid of all "messages" in chat_message response-like messages

TODO implement you_are_restricted and add its docs

TODO There's a double 'except' on target_silenced that prevents target_restricted from being sent

Code  | Meaning
------|------------------------------------------------
[channel_not_found](#channel_not_found-(server)) | The specified channel does not exist (†)
[channel_forbidden](#channel_forbidden-(server)) | The requesting client does not have the required privileges or status to send messages to the specified channel. This is usually because you forgot to join the channel. (†)
[you_are_spamming](#you_are_spamming-(server)) | The requesting client have exceeded the anti-spam rate limit. The message wasn't send.
[you_are_silenced](#you_are_silenced-(server)) | The requesting client is silenced. The message wasn't send.
[target_not_found](#target_not_found-(server)) | The recipient client could not be found (they're offline or the recipient does not exist). (‡)
[target_silenced](#target_silenced-(server)) | The message was sent successfully, but the recipient user is silenced, so they can't reply (‡)
[target_restricted](#target_restricted-(server)) | The message was not sent because the recipient is restricted (‡)
[target_blocking_pms](#target_blocking_pms-(server)) | The message was not sent because the recipient user have disabled PMs from non-friends, and the requesting client is not in the recipient's friends list (‡).
[target_away](#target_away-(server)) | The message was sent, and the recipient have marked themselves as "away" (with the /away in-game command) (‡).

- †: Public messages only
- ‡: PMs only

---

### channel_not_found (server)

Response-like message sent by the server when you try to send a public message to a non-existing channel via [chat_message](#chat_message-(client))

#### Data

Name | Type | Description
-----|------|-------------
`target` | `string` | The Chat Channel you've tried to send a message to, as a string

---

### channel_forbidden (server)

Response-like message sent by the server when you try to send a public message to a channel via [chat_message](#chat_message-(client)), but you don't have the required privileges to send messages to that channel. For example: you haven't joined that channel, or you try to send a message to a `public_write = false` channel, like `#announce` (see the section about [Chat Channel]s for more information on this)

#### Data

Name | Type | Description
-----|------|-------------
`target` | `string` | The Chat Channel you've tried to send a message to, as a string

---

### you_are_spamming (server)

Response-like message sent by the server when you try to send a public message to a channel via [chat_message](#chat_message-(client)), but you've sent too many messages in a short period of time and you've exceeded the anti-spam limit. This will result in a 30 minutes silence. An additional [silence_info](#silence_info-(server)) message will be sent as well, of course. This was added so you can easily distinct whenever you get silenced by the antispam or manually for other reasons.

#### Data

Name | Type | Description
-----|------|-------------
`user_info` | `object` | Your [Client], which contains up-to-date information about your silence as well.

---

### you_are_silenced (server)

Response-like message sent by the server when you try to send a public message to a channel via [chat_message](#chat_message-(client)), but you're silenced.

#### Data

Name | Type | Description
-----|------|-------------
`user_info` | `object` | Your [Client], which contains up-to-date information about your silence as well.

---

### target_not_found (server)

Response-like message sent by the server when you try to send a private message via [chat_message](#chat_message-(client)), but the target user could not be found.

#### Data

Name | Type | Description
-----|------|-------------
`target` | `string`\|`integer` | The recipient you tried to send the message to. Either their user ID or username, based on what you provided in the respective [chat_message](#chat_message-(client)) message.

---

### target_silenced (server)

Response-like message sent by the server when you try to send a private message via [chat_message](#chat_message-(client)), but the target user is silenced. The respective message gets send to the recipient, but this message notifies you that they can't reply due to being silenced.

#### Data

Name | Type | Description
-----|------|-------------
`target` | `string`\|`integer` | The recipient you tried to send the message to. Either their user ID or username, based on what you provided in the respective [chat_message](#chat_message-(client)) message.

---

### target_restricted (server)

Response-like message sent by the server when you try to send a private message via [chat_message](#chat_message-(client)), but the target user is restricted. The respective message does NOT get sent to the recipient, because restricted users can't use the chat.

#### Data

Name | Type | Description
-----|------|-------------
`target` | `string`\|`integer` | The recipient you tried to send the message to. Either their user ID or username, based on what you provided in the respective [chat_message](#chat_message-(client)) message.

---

### target_blocking_pms (server)

Response-like message sent by the server when you try to send a private message via [chat_message](#chat_message-(client)), but the target is blocking PMs and the sending client is not in the recipient's friend list.

#### Data

Name | Type | Description
-----|------|-------------
`target` | `string`\|`integer` | The recipient you tried to send the message to. Either their user ID or username, based on what you provided in the respective [chat_message](#chat_message-(client)) message.

---

### target_away (server)

Response-like message sent by the server after a [chat_message](#chat_message-(client)) message, in case the recipient have marked themselves as "away" (with the /away in-game command).
This message will be sent only once after the user have marked themselves as "away", not each time you send them a message. If the recipient changes their "away" message, you'll be notified again.

#### Data

Name | Type | Description
-----|------|-------------
`away_message` | `string` | Away message (eg: `/away brb, dinner` => `away_message = "brb, dinner"`)
`target` | `object` | [Client] that's marked itself as away (the recipient of the message you've sent)

---

### silence_info (server)

This message is sent by the server to notify you about your silence status. It's sent:

- When authenticating
- When your silence status changed (eg: you get unsilenced, or you get silenced multiple times while already being silenced)

TODO: Send on unsilence AND AUTH is not implemented yet

#### Data

Name | Type | Description
-----|------|-------------
`is_silenced` | `boolean` | Whether you're silenced or not
`end_time` | `integer` | UNIX timestamp of when your silence ends.
`reason` | `string` | Reason why you are silenced

---

### user_joined_channel (server)

This message is sent by the server when someone joins a channel you've joined.

#### Data

Name | Type | Description
-----|------|-------------
`client` | `object` | The [Client]
`channel` | `object` | The [Chat Channel] they have joined

---

### user_parted_channel (server)

TODO rename to user_left_channel to comply with leave_chat_channel

This message is sent by the server when someone leaves a channel you've joined.

#### Data

Name | Type | Description
-----|------|-------------
`client` | `object` | The [Client]
`channel` | `object` | The [Chat Channel] they have joined


## Events
You can ask the server to notify you when something happens. In order get notified, you must **subscribe** to an event.  
Supported events:


Event name                             | Messages
---------------------------------------|-------------
[chat_channels](#chat-channels-events) | <ul><li>[chat_channel_added (server)](#chat_channel_added-(server))</li><li>[chat_channel_removed (server)](#chat_channel_removed-(server))</ul>

---

### subscribe (client)

This message can be used to subscribe to a specific event. Once you're subscribed to an event, you'll reveice all messages related to that event. A list of supported events and their respective messages is available [here](#events).

#### Privileges
The provided token must be authenticated.

#### Data

Name | Type | Description | Required? | Default
-----|------|-------------|-----------|---------
`event` | `string` | Name of the event you want to subscribe to. | Yes |

#### Responses

Code  | Meaning
------|------------------------------------------------
[subscribed](#subscribed-(server)) | Subscribed successfully
TODO: Invalid event reply? | 

---

### subscribed (server)

Response-like message sent by the server after a successfully elaborated [subscribe](#subscribe-(client)) message..

#### Data

Name | Type | Description
-----|------|-------------
`event` | `string` | Name of the event you have successfully subscribed to.

---

### unsubscribe (client)

This message can be used to unsubscribe from an event you've previously subscribed to. You'll not reveice any more messages related to that event once you unsubscribe from it. A list of supported events and their respective messages is available [here](#events).

#### Privileges
The provided token must be authenticated.

#### Data

Name | Type | Description | Required? | Default
-----|------|-------------|-----------|---------
`event` | `string` | Name of the event you want to unsubscribe from. | Yes |

#### Responses

Code  | Meaning
------|------------------------------------------------
[unsubscribed](#unsubscribed-(server)) | Subscribed successfully
TODO: Invalid event reply? | 

---

### unsubscribed (server)

Response-like message sent by the server after a successfully elaborated [unsubscribe](#unsubscribe-(client)) message.

#### Data

Name | Type | Description
-----|------|-------------
`event` | `string` | Name of the event you have successfully unsubscribed from.


## Chat Channels Events
You can subscribe to the `chat_channels` events to ask the server to be notified whenever a new chat channel is added or removed. `#multi_*` and `#spect_*` channels will trigger these events as well.  
Subscribing to this event is the best way to make a chat bot present in every chat channel (`#multiplayer` and `#spectator` channels as well): you [join](#join_chat_channel-(client)) to all available chat channels when you authenticate (you can get a list of all chat channels via [GET /chat_channels](v2#get-%2Fchat_channels)), then you [subscribe](#subscribe-(client)) to the `chat_channels` event and you [join](#join_chat_channel-(client)) every channel that gets added to the server by listening for [chat_channel_added](#chat_channel_added-(server)) messages.

---

## chat_channel_added (server)
**You must be subscribed to the [chat_channels](#chat-channels-events) event to receive this type of message.**

Message sent by the server whenever a new chat channel is registered. Please note that **NO [chat_channel_added](#chat_channel_added-(server)) messages will be sent for already existing channels.** You should listen to this event if you want to join a channel as soon as it's created (useful for `#multi_*` and `#spect_*`). If you want to join all channels currently available (for example, right after authenticating), you should simply send a [join_chat_channel](#join_chat_channel-(client)) message for each available chat channel. You can retreive a list of all available channels via the [GET /chat_channels](v2#get-%2Fchat_channels) HTTP API handler.

#### Data
The `data` field contains the new [Chat Channel] that has just been registered on the server.

---

## chat_channel_removed (server)
**You must be subscribed to the [chat_channels](#chat-channels-events) event to receive this type of message.**

Message sent by the server whenever an existing chat channel is removed. Usually, the only chat channels that get removed are `#multi_*` and `#spect_*` channels.

- `#spect_*` channels get disposed when nobody is spectating a user anymore
- `#multi_*` channels get disposed when the respective match is disposed

If you've joined a channel and that channel is removed, the server will automatically remove you from that channel and send you a [chat_channel_left](#chat_channel_left-(server)) message, so you don't have to manually send a [leave_chat_channel](#leave_chat_channel-(client)) message for each channel that gets removed.

#### Data
The `data` field contains the [Chat Channel] that has just been unregistered from the server.





[Client]: types#client
[Simple Message]: #simple-messages
[Chat Channel]: types#chat-channel