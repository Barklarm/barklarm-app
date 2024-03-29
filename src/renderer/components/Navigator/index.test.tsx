/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navigator } from './';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: jest.fn(),
}));
jest.mock('@mui/material/Drawer', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`drawer`} {...props} />,
}));
jest.mock('@mui/material/List', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`list`} {...props} />,
}));
jest.mock('@mui/material/ListItem', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`list-item`} {...props} />,
}));
jest.mock('@mui/material/ListItemIcon', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`list-item-icon`} {...props} />,
}));
jest.mock('@mui/icons-material/Api', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`api-icon`} {...props} />,
}));
jest.mock('@mui/icons-material/Settings', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`settings-icon`} {...props} />,
}));
jest.mock('@mui/material/ListItemText', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`list-item-text`} {...props} />,
}));

describe('navigator', () => {
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
        import: jest.fn(),
        export: jest.fn(),
      },
      translations: {
        translate: jest.fn(),
      },
      app: {
        refreshObservers: jest.fn(),
      },
    };
    (window.electron.translations.translate as any).mockImplementation((val: string): string => val);
  });
  it('should render navigator correctly', () => {
    render(<Navigator />);
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('variant', 'permanent');
    const list = within(drawer).getByTestId('list');
    const listItems = within(list).getAllByTestId('list-item');
    const listItemIcon = within(listItems[0]).getByTestId('list-item-icon');
    expect(within(listItemIcon).getByTestId('api-icon')).toBeInTheDocument();
    const listItemText = within(listItems[0]).getByTestId('list-item-text');
    expect(listItemText).toHaveTextContent('Projects');
    const listItem2Icon = within(listItems[1]).getByTestId('list-item-icon');
    expect(within(listItem2Icon).getByTestId('settings-icon')).toBeInTheDocument();
    const listItem2Text = within(listItems[1]).getByTestId('list-item-text');
    expect(listItem2Text).toHaveTextContent('General');
  });
});
