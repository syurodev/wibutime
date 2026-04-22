## Project Structure

```text
├── app/                # Next.js App Router (pages and layouts)
│   ├── [locale]/       # Internationalized routes
│   └── api/            # API routes
├── components/         # Shared UI components
│   └── ui/             # shadcn/ui components
├── features/           # Feature-based logic and components
│   ├── auth/           # Authentication feature
│   └── anime/          # Anime feature
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization configuration
├── lib/                # Utility functions and library wrappers
├── messages/           # Translation files (JSON)
├── providers/          # Context providers
├── queries/            # React Query keys and custom hooks
├── public/             # Static assets
├── stores/             # State management (Zustand)
└── proxy.ts            # Proxy configuration
```
