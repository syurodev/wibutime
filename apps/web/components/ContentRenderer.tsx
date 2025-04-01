import { EditorContent } from '@workspace/types';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import React from 'react';

type ContentRendererProps = {
  content: EditorContent[];
  boxClassName?: string;
  textClassName?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
};

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  boxClassName,
  textClassName,
  imageClassName,
  style,
}) => {
  return (
    <div
      className={cn(
        'relative text-pretty w-fit mx-auto max-w-5xl p-4 rounded-xl',
        boxClassName,
      )}
      style={style}
    >
      {content.map((node) => {
        // Xử lý các phần tử đoạn văn
        if (node.type === 'p') {
          return (
            <p key={node.id} className={cn(textClassName)}>
              {node.children.map((child) => (
                <React.Fragment key={child.text}>{child.text}</React.Fragment>
              ))}
            </p>
          );
        }

        // Xử lý các phần tử hình ảnh
        if (node.type === 'img' && node.url) {
          return (
            <div key={node.id} className="my-4 mx-auto">
              <Image
                src={node.url}
                alt={node.children[0]?.text || ''}
                className={cn(
                  'w-full max-w-md mx-auto rounded-lg object-cover',
                  imageClassName,
                )}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ContentRenderer;
