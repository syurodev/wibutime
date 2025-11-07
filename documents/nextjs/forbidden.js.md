# forbidden.js
@doc-version: 16.0.1



> This feature is currently experimental and subject to change, it is not recommended for production.

The **forbidden** file is used to render UI when the [`forbidden`](/docs/app/api-reference/functions/forbidden.md) function is invoked during authentication. Along with allowing you to customize the UI, Next.js will return a `403` status code.

```tsx filename="app/forbidden.tsx" switcher
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div>
      <h2>Forbidden</h2>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

```jsx filename="app/forbidden.jsx" switcher
import Link from 'next/link'

export default function Forbidden() {
  return (
    <div>
      <h2>Forbidden</h2>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

## Reference

### Props

`forbidden.js` components do not accept any props.

## Version History

| Version   | Changes                    |
| --------- | -------------------------- |
| `v15.1.0` | `forbidden.js` introduced. |
- [forbidden](/docs/app/api-reference/functions/forbidden.md)
  - API Reference for the forbidden function.
