/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Observers } from './';
import { faker } from '@faker-js/faker';

const mutationsMock = {
  addObserver: jest.fn(),
  removeObserver: jest.fn(),
  updateObserver: jest.fn(),
  parseDataransfer: jest.fn(),
};

jest.mock('./helpers/mutations', () => ({
  __esModule: true,
  mutations: jest.fn().mockImplementation(() => mutationsMock),
}));
jest.mock('../../components/Observers', () => ({
  __esModule: true,
  Observers: (props: any) => <div data-testid={`observers`} {...props} />,
}));
jest.mock('../../components/Dropzone', () => ({
  __esModule: true,
  DropZone: (props: any) => <div data-testid={`dropzone`} {...props} />,
}));
jest.mock('@mui/icons-material/Link', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`link`} {...props} />,
}));
jest.mock('@mui/material/Box', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`box`} {...props} />,
}));
jest.mock('@mui/material/Typography', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`typography`} {...props} />,
}));
jest.mock('@mui/material/Stack', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`stack`} {...props} />,
}));

describe('Observers', () => {
  let ORIGINAL_WINDOW: any;
  beforeAll(() => {
    ORIGINAL_WINDOW = window;
  });

  afterAll(() => {
    window = ORIGINAL_WINDOW; // eslint-disable-line no-global-assign
  });
  beforeEach(() => {
    window.electron = {
      // eslint-disable-line no-global-assign
      store: {
        get: jest.fn(),
        set: jest.fn(),
      },
      app: {
        refreshObservers: jest.fn(),
      },
    };
    mutationsMock.addObserver.mockClear();
    mutationsMock.removeObserver.mockClear();
    mutationsMock.updateObserver.mockClear();
    mutationsMock.parseDataransfer.mockClear();
  });
  it('should have box with ObserverComponent', () => {
    const expectedObservers = faker.datatype.uuid();
    (window.electron.store.get as any).mockReturnValue(expectedObservers);
    render(<Observers />);
    const box = screen.getByTestId('box');
    const observersComponent = within(box).getByTestId('observers');
    expect(observersComponent).toHaveAttribute('observables', expectedObservers);
  });
  it('should have DropZone on drag', async () => {
    const expectedObservers = faker.datatype.uuid();
    (window.electron.store.get as any).mockReturnValue(expectedObservers);
    render(<Observers />);
    const box = screen.getByTestId('box');
    fireEvent.dragEnter(box, {});
    await waitFor(() => screen.getByTestId('dropzone'));
    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toHaveAttribute('open');
    const stack = within(dropzone).getByTestId('stack');
    const linkIcon = within(stack).getByTestId('link');
    expect(linkIcon).toHaveAttribute('font-size', 'large');
    const typography = within(stack).getByTestId('typography');
    const expectedText = within(typography).getByText('Drop Link Here');
    expect(linkIcon).toBeInTheDocument();
    expect(expectedText).toBeInTheDocument();
  });
  it('should hide DropZone on drop', async () => {
    const expectedObservers = faker.datatype.uuid();
    const expectedDataTransferText = faker.datatype.uuid();
    (window.electron.store.get as any).mockReturnValue(expectedObservers);
    render(<Observers />);
    const box = screen.getByTestId('box');
    fireEvent.dragEnter(box);
    await waitFor(() => screen.getByTestId('dropzone'));
    fireEvent.drop(screen.getByTestId('dropzone'), {
      dataTransfer: {
        text: expectedDataTransferText,
      },
    });
    await waitFor(() => screen.getByTestId('box'));
    expect(mutationsMock.parseDataransfer).toBeCalledWith({
      text: expectedDataTransferText,
    });
  });
  it('should hide DropZone on leave', async () => {
    const expectedObservers = faker.datatype.uuid();
    (window.electron.store.get as any).mockReturnValue(expectedObservers);
    render(<Observers />);
    const box = screen.getByTestId('box');
    fireEvent.dragEnter(box);
    await waitFor(() => screen.getByTestId('dropzone'));
    fireEvent.dragOver(screen.getByTestId('dropzone'));
    await waitFor(() => screen.getByTestId('dropzone'));
    fireEvent.dragLeave(screen.getByTestId('dropzone'));
    await waitFor(() => screen.getByTestId('box'));
    expect(screen.getByTestId('box')).toBeInTheDocument();
  });
});
