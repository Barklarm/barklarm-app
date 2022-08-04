/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Observers } from './index';
import { faker } from '@faker-js/faker';
import { observersComponentBuilderMap } from './helpers/observersComponentBuilderMap';
import { observersTitleBuilderMap } from './helpers/observersTitleBuilderMap';

jest.mock('./helpers/observersComponentBuilderMap', () => ({
  __esModule: true,
  observersComponentBuilderMap: {
    githubAction: jest.fn(),
    ccTray: jest.fn(),
    datadogMonitor: jest.fn(),
    sentry: jest.fn(),
    newRelic: jest.fn(),
  },
}));
jest.mock('./helpers/observersTitleBuilderMap', () => ({
  __esModule: true,
  observersTitleBuilderMap: {
    githubAction: jest.fn(),
    ccTray: jest.fn(),
    datadogMonitor: jest.fn(),
    sentry: jest.fn(),
    newRelic: jest.fn(),
  },
}));
jest.mock('@mui/material/Stack', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`stack`} {...props} />,
}));
jest.mock('@mui/material/Button', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`button`} {...props} />,
}));
jest.mock('@mui/material/Accordion', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`accordion`} {...props} />,
}));
jest.mock('@mui/material/AccordionSummary', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`accordion-summary`} {...props} />,
}));
jest.mock('@mui/material/AccordionDetails', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`accordion-details`} {...props} />,
}));
jest.mock('@mui/material/Typography', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`typography`} {...props} />,
}));
jest.mock('@mui/material/Select', () => ({
  __esModule: true,
  default: (props: any) => <select data-testid={`select`} {...props} />,
}));
jest.mock('@mui/material/MenuItem', () => ({
  __esModule: true,
  default: (props: any) => <option data-testid={`menu-item`} {...props} />,
}));
jest.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: (props: any) => <input data-testid={`text-field`} {...props} />,
}));

describe('dropzone', () => {
  const addMock = jest.fn();
  const removeMock = jest.fn();
  const updateMock = jest.fn();
  const saveMock = jest.fn();
  const observersComponentBuilderMapMock = observersComponentBuilderMap as any;
  const observersTitleBuilderMapMock = observersTitleBuilderMap as any;

  beforeEach(() => {
    addMock.mockClear();
    removeMock.mockClear();
    updateMock.mockClear();
    saveMock.mockClear();
  });
  it('should render only buttons on empty observers', () => {
    const observables: any[] = [];
    render(
      <Observers observables={observables} add={addMock} remove={removeMock} update={updateMock} save={saveMock} />
    );
    const stack = screen.getAllByTestId('stack');
    expect(stack).toHaveLength(1);
    const buttonsStack = stack[0];
    expect(buttonsStack).toHaveAttribute('spacing', '2');
    expect(buttonsStack).toHaveAttribute('direction', 'row');
    expect(buttonsStack).toHaveAttribute('justifyContent', 'flex-end');
    const buttons = within(buttonsStack).getAllByTestId('button');
    expect(buttons).toHaveLength(2);
    const buttonSave = buttons[0];
    const buttonAdd = buttons[1];
    expect(buttonSave).toHaveAttribute('variant', 'contained');
    expect(buttonAdd).toHaveAttribute('variant', 'contained');
  });

  it('should call save when save button click', () => {
    const observables: any[] = [];
    render(
      <Observers observables={observables} add={addMock} remove={removeMock} update={updateMock} save={saveMock} />
    );
    const buttons = screen.getAllByTestId('button');
    expect(buttons).toHaveLength(2);
    const buttonSave = buttons[0];
    fireEvent.click(buttonSave);
    expect(saveMock).toBeCalledWith(observables);
    expect(buttonSave).toHaveTextContent('Save');
  });

  it('should call add when add button click', () => {
    const observables: any[] = [];
    render(
      <Observers observables={observables} add={addMock} remove={removeMock} update={updateMock} save={saveMock} />
    );
    const buttons = screen.getAllByTestId('button');
    expect(buttons).toHaveLength(2);
    const buttonAdd = buttons[1];
    fireEvent.click(buttonAdd);
    expect(addMock).toBeCalledWith({ type: '' });
    expect(buttonAdd).toHaveTextContent('Add');
  });

  it('renders know type observables correctly', () => {
    const expectedComponent = <div data-testid={'githubAction'} />;
    const expectedTitle = faker.datatype.uuid();
    const expectedAlias = faker.datatype.uuid();
    const observables: any[] = [
      {
        type: 'githubAction',
        alias: expectedAlias,
      },
    ];
    observersComponentBuilderMapMock['githubAction'].mockReturnValue(expectedComponent);
    observersTitleBuilderMapMock['githubAction'].mockReturnValue(expectedTitle);
    render(
      <Observers observables={observables} add={addMock} remove={removeMock} update={updateMock} save={saveMock} />
    );
    const accordion = screen.getByTestId('accordion');
    const accordionSummary = within(accordion).getByTestId('accordion-summary');
    const accordionDetails = within(accordion).getByTestId('accordion-details');
    const stacks = within(accordionDetails).getAllByTestId('stack');
    const detailsStack = stacks[0];
    const typography = within(accordionSummary).getByTestId('typography');
    expect(within(typography).getByText(expectedTitle)).toBeInTheDocument();
    const select = within(detailsStack).getByTestId('select');
    expect(select).toHaveAttribute('label', 'Observer Type');
    const menuItems = within(select).getAllByTestId('menu-item');
    expect(menuItems).toHaveLength(5);
    expect(menuItems[0]).toHaveAttribute('value', 'githubAction');
    expect(menuItems[1]).toHaveAttribute('value', 'ccTray');
    expect(menuItems[2]).toHaveAttribute('value', 'datadogMonitor');
    expect(menuItems[3]).toHaveAttribute('value', 'sentry');
    expect(menuItems[4]).toHaveAttribute('value', 'newRelic');
    expect(within(detailsStack).getByTestId('githubAction')).toBeInTheDocument();
    const alias = within(detailsStack).getByTestId('text-field');
    expect(alias).toHaveAttribute('label', 'alias');
    expect(alias).toHaveAttribute('variant', 'outlined');
    expect(alias).toHaveAttribute('value', expectedAlias);
    const buttonStack = stacks[1];
    expect(buttonStack).toHaveAttribute('direction', 'row');
    expect(buttonStack).toHaveAttribute('justifycontent', 'flex-end');
    expect(buttonStack).toHaveAttribute('spacing', '2');
    const deleteButton = within(buttonStack).getByTestId('button');
    expect(deleteButton).toHaveAttribute('variant', 'contained');
    expect(deleteButton).toHaveTextContent('Delete');
  });
  it('renders empty type observables correctly', () => {
    const expectedAlias = faker.datatype.uuid();
    const observables: any[] = [
      {
        type: 'githubAction',
        alias: expectedAlias,
      },
    ];
    observersComponentBuilderMapMock['githubAction'].mockImplementation(() => {
      throw new Error();
    });
    observersTitleBuilderMapMock['githubAction'].mockImplementation(() => {
      throw new Error();
    });
    render(
      <Observers observables={observables} add={addMock} remove={removeMock} update={updateMock} save={saveMock} />
    );
    const accordion = screen.getByTestId('accordion');
    const accordionSummary = within(accordion).getByTestId('accordion-summary');
    const accordionDetails = within(accordion).getByTestId('accordion-details');
    const stacks = within(accordionDetails).getAllByTestId('stack');
    const detailsStack = stacks[0];
    const typography = within(accordionSummary).getByTestId('typography');
    expect(within(typography).getByText('Unkown')).toBeInTheDocument();
    const select = within(detailsStack).getByTestId('select');
    expect(select).toHaveAttribute('label', 'Observer Type');
    const menuItems = within(select).getAllByTestId('menu-item');
    expect(menuItems).toHaveLength(5);
    expect(menuItems[0]).toHaveAttribute('value', 'githubAction');
    expect(menuItems[1]).toHaveAttribute('value', 'ccTray');
    expect(menuItems[2]).toHaveAttribute('value', 'datadogMonitor');
    expect(menuItems[3]).toHaveAttribute('value', 'sentry');
    expect(menuItems[4]).toHaveAttribute('value', 'newRelic');
    const alias = within(detailsStack).getByTestId('text-field');
    expect(alias).toHaveAttribute('label', 'alias');
    expect(alias).toHaveAttribute('variant', 'outlined');
    expect(alias).toHaveAttribute('value', expectedAlias);
    const buttonStack = stacks[1];
    expect(buttonStack).toHaveAttribute('direction', 'row');
    expect(buttonStack).toHaveAttribute('justifycontent', 'flex-end');
    expect(buttonStack).toHaveAttribute('spacing', '2');
    const deleteButton = within(buttonStack).getByTestId('button');
    expect(deleteButton).toHaveAttribute('variant', 'contained');
    expect(deleteButton).toHaveTextContent('Delete');
  });
});
