export class EditorContentChild {
  text: string;
  italic: boolean;
  bold: boolean;
}

export class EditorContent {
  id: string;
  url: string;
  type: string;
  children: EditorContentChild[];
}
