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
  const translateMock = (val: string): string => val;
  beforeEach(() => {
    updateFieldMock.mockClear();
    render(
      <Sentry
        observable={expectedObservable}
        index={expectedIndex}
        updateFieldWithValue={updateFieldMock}
        translate={translateMock}
      />
    );
  });
  describe('organization', () => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId('textField-Organization');
      expect(textfield).toHaveAttribute('label', 'Organization');
      expect(textfield).toHaveAttribute('variant', 'outlined');
      expect(textfield).toHaveAttribute('value', expectedObservable.organization);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.random.word();
      const textfield = screen.getByTestId('textField-Organization');
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith('organization', expectedIndex, expectedValue);
    });
  });
  describe('Project', () => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId('textField-Project');
      expect(textfield).toHaveAttribute('label', 'Project');
      expect(textfield).toHaveAttribute('variant', 'outlined');
      expect(textfield).toHaveAttribute('value', expectedObservable.project);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.random.word();
      const textfield = screen.getByTestId('textField-Project');
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith('project', expectedIndex, expectedValue);
    });
  });
  describe('authorization Token', () => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId('textField-Authorization Token');
      expect(textfield).toHaveAttribute('label', 'Authorization Token');
      expect(textfield).toHaveAttribute('variant', 'outlined');
      expect(textfield).toHaveAttribute('value', expectedObservable.authToken);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.random.word();
      const textfield = screen.getByTestId('textField-Authorization Token');
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith('authToken', expectedIndex, expectedValue);
    });
  });
});
