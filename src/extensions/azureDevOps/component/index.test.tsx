/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AzureDevOps } from '.';
import { faker } from '@faker-js/faker';
import { expect, describe, it, vi, beforeEach } from 'vitest';

vi.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: (props: any) => <input data-testid={`textField-${props.label}`} {...props} />,
}));

describe('Github Action', () => {
  const expectedObservable = {
    orgUrl: faker.lorem.word(),
    project: faker.lorem.word(),
    pipelineId: faker.lorem.word(),
    authToken: faker.lorem.word(),
  };
  const expectedIndex = faker.number.int();
  const updateFieldMock = vi.fn();
  const translateMock = (val: string): string => val;
  beforeEach(() => {
    updateFieldMock.mockClear();
    render(
      <AzureDevOps
        observable={expectedObservable}
        index={expectedIndex}
        updateFieldWithValue={updateFieldMock}
        translate={translateMock}
      />
    );
  });
  describe.each([
    ['Organization Url', 'orgUrl', undefined],
    ['Project', 'project', undefined],
    ['Pipeline ID', 'pipelineId', undefined],
    ['Authorization Token', 'authToken', 'password'],
  ])('%s', (label: string, value: string, type: string) => {
    it('should have correct textfield attributes', () => {
      const textfield = screen.getByTestId(`textField-${label}`);
      expect(textfield).toHaveAttribute('label', label);
      expect(textfield).toHaveAttribute('variant', 'standard');
      if (type) expect(textfield).toHaveAttribute('type', type);
      expect(textfield).toHaveAttribute('value', (expectedObservable as any)[value]);
    });

    it('should call update field on change event', () => {
      const expectedValue = faker.lorem.word();
      const textfield = screen.getByTestId(`textField-${label}`);
      fireEvent.change(textfield, { target: { value: expectedValue } });
      expect(updateFieldMock).toBeCalledWith(value, expectedIndex, expectedValue);
    });
  });
});
