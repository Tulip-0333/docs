---
name: CheeseGull API migration guide
---

# CheeseGull API migration guide

On 2017-10-01, we changed our beatmap mirror from using CheeseGull v1 to using
CheeseGull v2 - consequently, the API changed, with some breaking changes.

* In the type `Set`, `ChildrenBeatmaps2` became `ChildrenBeatmaps` and what was
  `ChildrenBeatmaps` has been removed.
* Security key is currently not used. This is also because the only method which
  used it, `/api/request`, has been removed for the moment. There is no way to
  request an update of a beatmap (mostly because CheeseGull v2 should be better
  at keeping beatmaps up to date).
* You can no longer requests beatmap through `/:id.osz` - you can only requests
  beatmaps by requesting `/d/:id`. If you want to request novideo, you will need
  to add `?novideo` to the URL.
* /api/search no longer returns an Ok-Message response - it simply returns an
  array of sets.
* /api/search is now smarter and returns results ordered by relevance. Also, it
  will order by ID if no query is given, and by relevance if one is given.
