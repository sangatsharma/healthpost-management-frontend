import { TAny } from '@/types/global';
import { Extension } from '@tiptap/core';
import Image from '@tiptap/extension-image';

// Custom Font Size Extension
export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: TAny) =>
        ({ chain }: { chain: TAny }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: { chain: TAny }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .updateAttributes('textStyle', { fontSize: null })
            .run();
        },
    } as Partial<import('@tiptap/core').RawCommands>;
  },
});

// Custom Line Height Extension
export const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: TAny) =>
        ({ chain }: { chain: TAny }) => {
          return chain()
            .updateAttributes('paragraph', { lineHeight })
            .updateAttributes('heading', { lineHeight })
            .run();
        },
      unsetLineHeight:
        () =>
        ({ chain }: { chain: TAny }) => {
          return chain()
            .updateAttributes('paragraph', { lineHeight: null })
            .updateAttributes('heading', { lineHeight: null })
            .run();
        },
    } as Partial<import('@tiptap/core').RawCommands>;
  },
});

// Enhanced Image Extension with independent width/height adjustment
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('width') ||
          element.style.width?.replace('px', ''),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            width: attributes.width,
            style: `width: ${attributes.width}px`,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('height') ||
          element.style.height?.replace('px', ''),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {};
          }
          return {
            height: attributes.height,
            style: `height: ${attributes.height}px`,
          };
        },
      },
      align: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-align') || 'left',
        renderHTML: (attributes) => {
          return { 'data-align': attributes.align };
        },
      },
    };
  },
  addNodeView() {
    return ({ node, editor }) => {
      const container = document.createElement('span');
      container.className = 'relative group inline-block mx-2';

      // Apply alignment
      const alignment = node.attrs.align || 'left';
      if (alignment === 'center') {
        container.style.margin = '0 auto';
        container.style.display = 'block';
        container.style.textAlign = 'center';
      } else if (alignment === 'right') {
        container.style.marginLeft = 'auto';
        container.style.marginRight = '0';
        container.style.display = 'block';
        container.style.textAlign = 'right';
      } else {
        container.style.marginLeft = '0';
        container.style.marginRight = 'auto';
        container.style.display = 'inline-block';
      }

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || '';
      img.className = 'rounded-lg inline-block';
      img.style.maxWidth = '100%';

      // Set initial dimensions
      if (node.attrs.width) {
        img.style.width = `${node.attrs.width}px`;
      }
      if (node.attrs.height) {
        img.style.height = `${node.attrs.height}px`;
      }

      // Resize handles
      const resizeHandleCorner = document.createElement('div');
      resizeHandleCorner.className =
        'absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-tl';
      resizeHandleCorner.title = 'Resize proportionally';

      const resizeHandleWidth = document.createElement('div');
      resizeHandleWidth.className =
        'absolute top-1/2 right-0 w-2 h-8 bg-green-500 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-l transform -translate-y-1/2';
      resizeHandleWidth.title = 'Resize width only';

      const resizeHandleHeight = document.createElement('div');
      resizeHandleHeight.className =
        'absolute bottom-0 left-1/2 w-8 h-2 bg-orange-500 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity rounded-t transform -translate-x-1/2';
      resizeHandleHeight.title = 'Resize height only';

      let isResizing = false;
      let resizeType = '';
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;

      const handleMouseDown = (e: MouseEvent, type: string) => {
        isResizing = true;
        resizeType = type;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = img.offsetWidth;
        startHeight = img.offsetHeight;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
        e.stopPropagation();
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        if (resizeType === 'corner') {
          // Proportional resize
          const newWidth = Math.max(50, startWidth + deltaX);
          const aspectRatio = startHeight / startWidth;
          const newHeight = newWidth * aspectRatio;

          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
        } else if (resizeType === 'width') {
          // Width only
          const newWidth = Math.max(50, startWidth + deltaX);
          img.style.width = `${newWidth}px`;
        } else if (resizeType === 'height') {
          // Height only
          const newHeight = Math.max(50, startHeight + deltaY);
          img.style.height = `${newHeight}px`;
        }
      };

      const handleMouseUp = () => {
        if (isResizing) {
          const finalWidth = img.offsetWidth;
          const finalHeight = img.offsetHeight;

          editor
            .chain()
            .focus()
            .updateAttributes('image', {
              width: finalWidth,
              height: finalHeight,
            })
            .run();
        }
        isResizing = false;
        resizeType = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      resizeHandleCorner.addEventListener('mousedown', (e) =>
        handleMouseDown(e, 'corner'),
      );
      resizeHandleWidth.addEventListener('mousedown', (e) =>
        handleMouseDown(e, 'width'),
      );
      resizeHandleHeight.addEventListener('mousedown', (e) =>
        handleMouseDown(e, 'height'),
      );

      container.appendChild(img);
      container.appendChild(resizeHandleCorner);
      container.appendChild(resizeHandleWidth);
      container.appendChild(resizeHandleHeight);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;

          img.src = updatedNode.attrs.src;
          img.alt = updatedNode.attrs.alt || '';

          // Update alignment
          const newAlignment = updatedNode.attrs.align || 'left';
          if (newAlignment === 'center') {
            container.style.margin = '0 auto';
            container.style.display = 'block';
            container.style.textAlign = 'center';
          } else if (newAlignment === 'right') {
            container.style.marginLeft = 'auto';
            container.style.marginRight = '0';
            container.style.display = 'block';
            container.style.textAlign = 'right';
          } else {
            container.style.marginLeft = '0';
            container.style.marginRight = 'auto';
            container.style.display = 'inline-block';
          }

          if (updatedNode.attrs.width) {
            img.style.width = `${updatedNode.attrs.width}px`;
          }
          if (updatedNode.attrs.height) {
            img.style.height = `${updatedNode.attrs.height}px`;
          }

          return true;
        },
      };
    };
  },
});
