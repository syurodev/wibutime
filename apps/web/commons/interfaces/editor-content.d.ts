export interface EditorContentChild {
  text: string;
  italic: boolean;
  bold: boolean;
}

export interface EditorContent {
  id: string;
  url: string;
  type: string;
  children: EditorContentChild[];
}
