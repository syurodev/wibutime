# Intercepting Routes
@doc-version: 16.0.1


Intercepting routes allows you to load a route from another part of your application within the current layout. This routing paradigm can be useful when you want to display the content of a route without the user switching to a different context.

For example, when clicking on a photo in a feed, you can display the photo in a modal, overlaying the feed. In this case, Next.js intercepts the `/photo/123` route, masks the URL, and overlays it over `/feed`.

![Intercepting routes soft navigation](https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com/docs/light/intercepting-routes-soft-navigate.png)

However, when navigating to the photo by clicking a shareable URL or by refreshing the page, the entire photo page should render instead of the modal. No route interception should occur.

![Intercepting routes hard navigation](https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com/docs/light/intercepting-routes-hard-navigate.png)

## Convention

Intercepting routes can be defined with the `(..)` convention, which is similar to relative path convention `../` but for route segments.

You can use:

* `(.)` to match segments on the **same level**
* `(..)` to match segments **one level above**
* `(..)(..)` to match segments **two levels above**
* `(...)` to match segments from the **root** `app` directory

For example, you can intercept the `photo` segment from within the `feed` segment by creating a `(..)photo` directory.

![Intercepting routes folder structure](https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com/docs/light/intercepted-routes-files.png)

> **Good to know:** The `(..)` convention is based on *route segments*, not the file-system. For example, it does not consider `@slot` folders in [Parallel Routes](/docs/app/api-reference/file-conventions/parallel-routes.md).

## Examples

### Modals

Intercepting Routes can be used together with [Parallel Routes](/docs/app/api-reference/file-conventions/parallel-routes.md) to create modals. This allows you to solve common challenges when building modals, such as:

* Making the modal content **shareable through a URL**.
* **Preserving context** when the page is refreshed, instead of closing the modal.
* **Closing the modal on backwards navigation** rather than going to the previous route.
* **Reopening the modal on forwards navigation**.

Consider the following UI pattern, where a user can open a photo modal from a gallery using client-side navigation, or navigate to the photo page directly from a shareable URL:

![Intercepting routes modal example](https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com/docs/light/intercepted-routes-modal-example.png)

In the above example, the path to the `photo` segment can use the `(..)` matcher since `@modal` is a slot and **not** a segment. This means that the `photo` route is only one segment level higher, despite being two file-system levels higher.

See the [Parallel Routes](/docs/app/api-reference/file-conventions/parallel-routes.md#modals) documentation for a step-by-step example, or see our [image gallery example](https://github.com/vercel-labs/nextgram).

> **Good to know:**
>
> * Other examples could include opening a login modal in a top navbar while also having a dedicated `/login` page, or opening a shopping cart in a side modal.
## Next Steps

Learn how to create modals with Intercepted and Parallel Routes.

- [Parallel Routes](/docs/app/api-reference/file-conventions/parallel-routes.md)
  - Simultaneously render one or more pages in the same view that can be navigated independently. A pattern for highly dynamic applications.
