---
name: Hanayo BBCode
---
# Hanayo BBCode

This document contains information about Hanayo's (Ripple's) version of BBCode.

Ripple uses [frustra/bbcode](https://github.com/frustra/bbcode) as its BBCode parser, and so it uses the [default tags](https://github.com/frustra/bbcode#default-tags), which are to say the classic `[b]`, `[i]`, `[u]`, `[s]`, `[img]`, `[url]`, `[center]`, `[color]`, `[quote]`, and `[code]`. Everything else is documented here.

## Emoji

Yes, we do support emoji. [Use getemoji.com](http://getemoji.com/) if you want a list of emojis to copy and paste. We still do not support the GitHub-style `:joy:`, but that will happen some day.

We also have a few custom emojis, that can be indeed invoked using the colon syntax. Those are:

```bash
:peppy:
:barney:
:akerino:
:foka:
:kappy:
:creepypeppy:
:peppyfiero:
:djpeppy:
:kappa:
```

It's up to you to experiment with these.

## `list`, `*`

To create an unordered list, use `[list]`, together with `[*]` to make elements.

```bash
[list]
[*] Element
[*] Another element
[*] Yet another element
[/list]
```

## `youtube`

To embed a youtube video, use `[youtube]`, and insert the video URL, or video ID, inside the tag. Links can also have useless stuff inside of them, and it will be ignored. What is important is for there to be a `v` parameter.

```bash
[youtube]https://www.youtube.com/watch?v=dQw4w9WgXcQ[/youtube]
[youtube]dQw4w9WgXcQ[/youtube]
[youtube]https://www.youtube.com/watch?v=dQw4w9WgXcQ&UselessJargon=Nicemme[/youtube]
```

Default video side will be 100% width of the container. If you want to make it smaller, use a [container](#container).

## `left`, `right`

Basically the same as `[center]`. They respectively left-align or right-align text.

```bash
[right]right aligned text[/right]
```

## `container`

A container allows to put some text or youtube video or image in a restricted width.

```bash
[container width=150]150px wide container![/youtube]
```

## `hr`

A divider. Remember to close the tag!

```bash
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget odio hendrerit, ultricies felis sit amet, dictum nisl.
[hr][/hr]
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget odio hendrerit, ultricies felis sit amet, dictum nisl.
```

## `email`

A clickable email address.

```bash
[email]support@ripple.moe[/email]
[email=support@ripple.moe]contact support[/email]
```

## `size`

Changes font size. Values can range from 1 to 15. The amount of pts are the size * 6.

```bash
[size=12]Large text[/size]
```
