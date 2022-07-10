/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sentry } from './';
import { faker } from '@faker-js/faker';

jest.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: (props: any) => <input data-testid={`textField-${props.label}`} {...props} />,
}));

describe('Sentry', () => {
  const expectedObservable = {
    organization: faker.random.word(),
    project: faker.random.word(),
    authToken: faker.random.word(),
  };
  const expectedIndex = faker.random.numeric();
  const updateFieldMock = jest.fn();
  beforeEach(() => {
    updateFieldMock.mockClear();
    render(<Sentry observable={expectedObservable} index={expectedIndex} updateFieldWithValue={updateFieldMock} />);
  });
  describe('organization', () => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId('textField-organization');
      expect(textfield).toHaveAttribute('label', 'organization');
      expect(textfield).toHaveAttribute('variant', 'outlined');
      expect(textfield).toHaveAttribute('value', expectedObservable.organization);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.random.word();
      const textfield = screen.getByTestId('textField-organization');
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith('organization', expectedIndex, expectedValue);
    });
  });
  describe('Project', () => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId('textField-project');
      expect(textfield).toHaveAttribute('label', 'project');
      expect(textfield).toHaveAttribute('variant', 'outlined');
      expect(textfield).toHaveAttribute('value', expectedObservable.project);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.random.word();
      const textfield = screen.getByTestId('textField-project');
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith('project', expectedIndex, expectedValue);
    });
  });
  describe('authorization Token', () => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId('textField-authorization Token');
      expect(textfield).toHaveAttribute('label', 'authorization Token');
      expect(textfield).toHaveAttribute('variant', 'outlined');
      expect(textfield).toHaveAttribute('value', expectedObservable.authToken);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.random.word();
      const textfield = screen.getByTestId('textField-authorization Token');
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith('authToken', expectedIndex, expectedValue);
    });
  });
});
