import React from 'react';

export type DropZoneParams = {
  open: boolean;
  onDragOver: React.DragEventHandler<HTMLElement>;
  onDrop: React.DragEventHandler<HTMLElement>;
  onDragLeave: React.DragEventHandler<HTMLElement>;
  children: JSX.Element;
};
