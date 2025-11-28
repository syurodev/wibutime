# Uncached data was accessed outside of `<Suspense>`

## [Why This Error Occurred](https://nextjs.org/docs/messages/blocking-route#why-this-error-occurred)

When the `cacheComponents` feature is enabled, Next.js expects a parent `Suspense` boundary around any component that awaits data that should be accessed on every user request. The purpose of this requirement is so that Next.js can provide a useful fallback while this data is accessed and rendered.

While some data is inherently only available when a user request is being handled, such as request headers, Next.js assumes that by default any asynchronous data is expected to be accessed each time a user request is being handled unless you specifically cache it using `"use cache"`.

The proper fix for this specific error depends on what data you are accessing and how you want your Next.js app to behave.

## [Possible Ways to Fix It](https://nextjs.org/docs/messages/blocking-route#possible-ways-to-fix-it)

### [Accessing Data](https://nextjs.org/docs/messages/blocking-route#accessing-data)

When you access data using `fetch`, a database client, or any other module which does asynchronous IO, Next.js interprets your intent as expecting the data to load on every user request.

If you are expecting this data to be used while fully or partially prerendering a page you must cache is using `"use cache"`.

Before:

app/page.js

```
asyncfunctiongetRecentArticles() {returndb.query(...)}exportdefaultasyncfunctionPage() {constarticles=awaitgetRecentArticles(token);return <ArticleListarticles={articles}>}
```

After:

app/page.js

```
import { cacheTag, cacheLife } from'next/cache'asyncfunctiongetRecentArticles() {"use cache"// This cache can be revalidated by webhook or server action// when you call revalidateTag("articles")cacheTag("articles")// This cache will revalidate after an hour even if no explicit// revalidate instruction was receivedcacheLife('hours')returndb.query(...)}exportdefaultasyncfunctionPage() {constarticles=awaitgetRecentArticles(token);return <ArticleListarticles={articles}>}
```

If this data should be accessed on every user request you must provide a fallback UI using `Suspense` from React. Where you put this Suspense boundary in your application should be informed by the kind of fallback UI you want to render. It can be immediately above the component accessing this data or even in your Root Layout.

Before:

app/page.js

```
asyncfunctiongetLatestTransactions() {returndb.query(...)}exportdefaultasyncfunctionPage() {consttransactions=awaitgetLatestTransactions(token);return <TransactionListtransactions={transactions}>}
```

After:

app/page.js

```
import { Suspense } from'react'asyncfunctionTransactionList() {consttransactions=awaitdb.query(...)return...}functionTransactionSkeleton() {return <ul>...</ul>}exportdefaultasyncfunctionPage() {return (    <Suspensefallback={<TransactionSkeleton />}>      <TransactionList/>    </Suspense>  )}
```

### [Headers](https://nextjs.org/docs/messages/blocking-route#headers)

If you are accessing request headers using `headers()`, `cookies()`, or `draftMode()`. Consider whether you can move the use of these APIs deeper into your existing component tree.

Before:

app/inbox.js

```
exportasyncfunctionInbox({ token }) {constemail=awaitgetEmail(token)return (    <ul>      {email.map((e) => (        <EmailRowkey={e.id} />      ))}    </ul>  )}
```

app/page.js

```
import { cookies } from'next/headers'import { Inbox } from'./inbox'exportdefaultasyncfunctionPage() {consttoken= (awaitcookies()).get('token')return (    <Suspensefallback="loading your inbox...">      <Inboxtoken={token}>    </Suspense>  )}
```

After:

app/inbox.js

```
import { cookies } from'next/headers'exportasyncfunctionInbox() {consttoken= (awaitcookies()).get('token')constemail=awaitgetEmail(token)return (    <ul>      {email.map((e) => (        <EmailRowkey={e.id} />      ))}    </ul>  )}
```

app/page.js

```
import { Inbox } from'./inbox'exportdefaultasyncfunctionPage() {return (    <Suspensefallback="loading your inbox...">      <Inbox>    </Suspense>  )}
```

Alternatively you can add a Suspense boundary above the component that is accessing Request headers.

### [Params and SearchParams](https://nextjs.org/docs/messages/blocking-route#params-and-searchparams)

Layout `params`, and Page `params` and `searchParams` props are promises. If you await them in the Layout or Page component you might be accessing these props higher than is actually required. Try passing these props to deeper components as a promise and awaiting them closer to where the actual param or searchParam is required

Before:

app/map.js

```
exportasyncfunctionMap({ lat, lng }) {constmapData=awaitfetch(`https://...?lat=${lat}&lng=${lng}`)returndrawMap(mapData)}
```

app/page.js

```
import { cookies } from'next/headers'import { Map } from'./map'exportdefaultasyncfunctionPage({ searchParams }) {const { lat,lng } =await searchParams;return (    <Suspensefallback="loading your inbox...">      <Maplat={lat} lng={lng}>    </Suspense>  )}
```

After:

app/map.js

```
exportasyncfunctionMap({ coords }) {const { lat,lng } =await coordsconstmapData=awaitfetch(`https://...?lat=${lat}&lng=${lng}`)returndrawMap(mapData)}
```

app/page.js

```
import { cookies } from'next/headers'import { Map } from'./map'exportdefaultasyncfunctionPage({ searchParams }) {constcoords=searchParams.then(sp => ({ lat:sp.lat, lng:sp.lng }))return (    <Suspensefallback="loading your inbox...">      <Mapcoord={coords}>    </Suspense>  )}
```

Alternatively you can add a Suspense boundary above the component that is accessing `params` or `searchParams` so Next.js understands what UI should be used when while waiting for this request data to be accessed.

### [Short-lived Caches](https://nextjs.org/docs/messages/blocking-route#short-lived-caches)

`"use cache"` allows you to describe a [`cacheLife()`](https://nextjs.org/docs/app/api-reference/functions/cacheLife) that might be too short to be practical to prerender. The utility of doing this is that it can still describe a non-zero caching time for the client router cache to reuse the cache entry in the browser and it can also be useful for protecting upstream APIs while experiencing high request traffic.

If you expected the `"use cache"` entry to be prerenderable try describing a slightly longer `cacheLife()`.

Before:

app/page.js

```
import { cacheLife } from'next/cache'asyncfunctiongetDashboard() {"use cache"// This cache will revalidate after 1 second. It is so short// Next.js won't prerender it on the server but the client router// can reuse the result for up to 30 seconds unless the user manually refreshescacheLife('seconds')returndb.query(...)}exportdefaultasyncfunctionPage() {constdata=awaitgetDashboard(token);return <Dashboarddata={data}>}
```

After:

app/page.js

```
import { cacheLife } from'next/cache'asyncfunctiongetDashboard() {"use cache"// This cache will revalidate after 1 minute. It's long enough that// Next.js will still produce a fully or partially prerendered pagecacheLife('minutes')returndb.query(...)}exportdefaultasyncfunctionPage() {constdata=awaitgetDashboard(token);return <Dashboarddata={data}>}
```

Alternatively you can add a Suspense boundary above the component that is accessing this short-lived cached data so Next.js understands what UI should be used while accessing this data on a user request.
