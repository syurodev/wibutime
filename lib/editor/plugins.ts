import {
  BlockquotePlugin,
  BoldPlugin,
  CodePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin
} from '@platejs/basic-nodes/react';
import { ListPlugin } from '@platejs/list/react';
import { createPlatePlugin } from 'platejs/react';

// Import components
import { BlockquoteElement } from '@/components/ui/blockquote-node';
import { H1Element, H2Element, H3Element } from '@/components/ui/heading-node';
import { ImageElement } from '@/components/ui/image-node';

// Image plugin with deferred upload
export const ImagePlugin = createPlatePlugin({
  key: 'image',
  node: {
    isElement: true,
    isVoid: true,
    component: ImageElement,
  },
});

// Basic plugins without drag & drop
export const BasicPlugins = [
  // Basic text formatting
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,

  // Block elements with components
  H1Plugin.withComponent(H1Element),
  H2Plugin.withComponent(H2Element),
  H3Plugin.withComponent(H3Element),
  BlockquotePlugin.withComponent(BlockquoteElement),

  // Lists
  ListPlugin,

  // Media
  ImagePlugin,
];

// Default empty value
export const createEmptyValue = () => [
  {
    id: crypto.randomUUID(),
    type: 'p',
    children: [{ text: '' }],
  },
];