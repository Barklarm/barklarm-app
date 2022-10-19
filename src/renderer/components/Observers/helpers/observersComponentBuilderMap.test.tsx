/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { observersComponentBuilderMap } from './observersComponentBuilderMap';
import { faker } from '@faker-js/faker';
import { GithubAction } from '../../GithubAction';

jest.mock('../../GithubAction', () => ({
  __esModule: true,
  GithubAction: (props: any) => <input data-testid={`githubAction`} {...props} />,
}));
jest.mock('../../CCTray', () => ({
  __esModule: true,
  CCTray: (props: any) => <input data-testid={`ccTray`} {...props} />,
}));
jest.mock('../../DatadogMonitor', () => ({
  __esModule: true,
  DatadogMonitor: (props: any) => <input data-testid={`datadogMonitor`} {...props} />,
}));
jest.mock('../../Sentry', () => ({
  __esModule: true,
  Sentry: (props: any) => <input data-testid={`sentry`} {...props} />,
}));
jest.mock('../../NewRelic', () => ({
  __esModule: true,
  NewRelic: (props: any) => <input data-testid={`newRelic`} {...props} />,
}));

describe('observersComponentBuilderMap', () => {
  describe.each([['githubAction'], ['ccTray'], ['datadogMonitor'], ['sentry'], ['newRelic']])('%s', (type: string) => {
    it('should have correct textfield attributes', () => {
      const expectedObservable = faker.datatype.uuid();
      const expectedIndex = faker.datatype.number();
      const expectedUpdateFn = faker.datatype.uuid();
      const expectedTranslateFn = faker.datatype.uuid();
      const component = observersComponentBuilderMap[type](
        expectedObservable,
        expectedIndex,
        expectedUpdateFn,
        expectedTranslateFn
      );
      render(component);
      const textfield = screen.getByTestId(type);
      expect(textfield).toHaveAttribute('observable', expectedObservable);
      expect(textfield).toHaveAttribute('index', expectedIndex.toString());
      expect(textfield).toHaveAttribute('updateFieldWithValue', expectedUpdateFn);
      expect(textfield).toHaveAttribute('translate', expectedTranslateFn);
    });
  });
});
