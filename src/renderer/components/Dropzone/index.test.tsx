/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DropZone } from './index';
import { faker } from '@faker-js/faker';

jest.mock('@mui/material/Backdrop', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`backdrop`} {...props} />,
}));
jest.mock('@mui/material/Box', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`box`} {...props} />,
}));

describe('dropzone', () => {
  const childrenText = faker.datatype.uuid();
  const onDragOverMock = jest.fn();
  const onDragLeaveMock = jest.fn();
  const onDropMock = jest.fn();
  beforeEach(() => {
    onDragOverMock.mockClear();
    onDragLeaveMock.mockClear();
    onDropMock.mockClear();
    render(
      <DropZone open={true} onDragOver={onDragOverMock} onDragLeave={onDragLeaveMock} onDrop={onDropMock}>
        <div>{childrenText}</div>
      </DropZone>
    );
  });
  it('should have correct herachy with child', () => {
    const dropbox = screen.getByTestId('backdrop');
    expect(dropbox).toHaveAttribute('open');
    const box = within(dropbox).getByTestId('box');
    expect(within(box).getByText(childrenText)).toBeInTheDocument();
  });

  it('should call dragOver on dragOver event', () => {
    const dropbox = screen.getByTestId('backdrop');
    fireEvent.dragOver(dropbox);
    expect(onDragOverMock).toBeCalled();
  });

  it('should call dragOverMock on dragOver event', () => {
    const dropbox = screen.getByTestId('backdrop');
    fireEvent.dragOver(dropbox);
    expect(onDragOverMock).toBeCalled();
  });

  it('should call dragLeaveMock on dragLeave event', () => {
    const dropbox = screen.getByTestId('backdrop');
    fireEvent.dragLeave(dropbox);
    expect(onDragLeaveMock).toBeCalled();
  });

  it('should call dropMock on drop event', () => {
    const dropbox = screen.getByTestId('backdrop');
    fireEvent.drop(dropbox);
    expect(onDropMock).toBeCalled();
  });
});
