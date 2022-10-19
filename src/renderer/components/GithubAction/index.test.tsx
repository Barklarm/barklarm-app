/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GithubAction } from './';
import { faker } from '@faker-js/faker';

jest.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: (props: any) => <input data-testid={`textField-${props.label}`} {...props} />,
}));

describe('Github Action', () => {
  const expectedObservable = {
    owner: faker.random.word(),
    repo: faker.random.word(),
    workflowId: faker.random.word(),
    authToken: faker.random.word(),
  };
  const expectedIndex = faker.random.numeric();
  const updateFieldMock = jest.fn();
  const translateMock = (val: string): string => val;
  beforeEach(() => {
    updateFieldMock.mockClear();
    render(
      <GithubAction
        observable={expectedObservable}
        index={expectedIndex}
        updateFieldWithValue={updateFieldMock}
        translate={translateMock}
      />
    );
  });
  describe.each([
    ['Owner', 'owner', undefined],
    ['Repository', 'repo', undefined],
    ['Workflow ID', 'workflowId', undefined],
    ['Authorization Token', 'authToken', 'password'],
  ])('%s', (label: string, value: string, type: string) => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId(`textField-${label}`);
      expect(textfield).toHaveAttribute('label', label);
      expect(textfield).toHaveAttribute('variant', 'outlined');
      if (type) expect(textfield).toHaveAttribute('type', type);
      expect(textfield).toHaveAttribute('value', (expectedObservable as any)[value]);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.random.word();
      const textfield = screen.getByTestId(`textField-${label}`);
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith(value, expectedIndex, expectedValue);
    });
  });
});
