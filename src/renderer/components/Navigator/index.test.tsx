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
jest.mock('@mui/icons-material/Public', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`public-icon`} {...props} />,
}));
jest.mock('@mui/material/ListItemText', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`list-item-text`} {...props} />,
}));

describe('navigator', () => {
  it('should render navigator correctly', () => {
    render(<Navigator />);
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('variant', 'permanent');
    const list = within(drawer).getByTestId('list');
    const listItems = within(list).getAllByTestId('list-item');
    const listItemIcon = within(listItems[0]).getByTestId('list-item-icon');
    expect(within(listItemIcon).getByTestId('public-icon')).toBeInTheDocument();
    const listItemText = within(listItems[0]).getByTestId('list-item-text');
    expect(listItemText).toHaveTextContent('Projects');
    const listItem2Icon = within(listItems[1]).getByTestId('list-item-icon');
    expect(within(listItem2Icon).getByTestId('public-icon')).toBeInTheDocument();
    const listItem2Text = within(listItems[1]).getByTestId('list-item-text');
    expect(listItem2Text).toHaveTextContent('General');
  });
});
