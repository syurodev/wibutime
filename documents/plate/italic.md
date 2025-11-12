Italic

Source: https://platejs.org/docs/italic

## Registry URLs

- All components index: https://platejs.org/r/registry.json
- All docs index: https://platejs.org/r/registry-docs.json
- Component content: https://platejs.org/r/{name}

Note: Any <ComponentSource name="..." /> or <ComponentPreview name="..." /> in the documentation can be accessed at https://platejs.org/r/{name}

I'm going to ask questions from the following Plate documentation:

---

<ComponentPreview name="basic-marks-demo" />

<PackageInfo>

## Features

- Apply italic formatting for emphasis or stylistic purposes
- Keyboard shortcut support for quick formatting (`Cmd + I`)
- Renders as `<em>` HTML element by default

</PackageInfo>

## Kit Usage

<Steps>

### Installation

The fastest way to add the italic plugin is with the `BasicMarksKit`, which includes pre-configured `ItalicPlugin` along with other basic marks and their [Plate UI](/docs/installation/plate-ui) components.

<ComponentSource name="basic-marks-kit" />

### Add Kit

Add the kit to your plugins:

```tsx
import { createPlateEditor } from "platejs/react";
import { BasicMarksKit } from "@/components/editor/plugins/basic-marks-kit";

const editor = createPlateEditor({
  plugins: [
    // ...otherPlugins,
    ...BasicMarksKit,
  ],
});
```

</Steps>

## Manual Usage

<Steps>

### Installation

```bash
npm install @platejs/basic-nodes
```

### Add Plugin

Include `ItalicPlugin` in your Plate plugins array when creating the editor.

```tsx
import { ItalicPlugin } from "@platejs/basic-nodes/react";
import { createPlateEditor } from "platejs/react";

const editor = createPlateEditor({
  plugins: [
    // ...otherPlugins,
    ItalicPlugin,
  ],
});
```

### Configure Plugin

You can configure the `ItalicPlugin` with custom keyboard shortcuts.

```tsx
import { ItalicPlugin } from "@platejs/basic-nodes/react";
import { createPlateEditor } from "platejs/react";

const editor = createPlateEditor({
  plugins: [
    // ...otherPlugins,
    ItalicPlugin.configure({
      shortcuts: { toggle: "mod+i" },
    }),
  ],
});
```

- `shortcuts.toggle`: Defines a keyboard [shortcut](/docs/plugin-shortcuts) to toggle italic formatting.

### Add Toolbar Button

You can add [`MarkToolbarButton`](/docs/components/mark-toolbar-button) to your [Toolbar](/docs/toolbar) to toggle italic formatting.

</Steps>

## Plugins

### `ItalicPlugin`

Plugin for italic text formatting. Renders as `<em>` HTML element by default.

## Transforms

### `tf.italic.toggle`

Toggles the italic formatting for the selected text.

Default Shortcut: `Cmd + I`
