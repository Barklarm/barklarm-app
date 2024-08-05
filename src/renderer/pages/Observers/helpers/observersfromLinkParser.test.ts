import { observersfromLinkParser } from './observersfromLinkParser';
import { expect, describe, it } from 'vitest';

describe('observersfromLinkParser', () => {
  describe.each([
    [
      'https://github.com/barklarm/barklarm-app/actions/workflows/build.yml',
      {
        type: 'githubAction',
        owner: 'barklarm',
        repo: 'barklarm-app',
        workflowId: 'build.yml',
      },
    ],
    [
      'https://api.travis-ci.com/repos/kanekotic/web-threads/cc.xml?branch=master',
      {
        type: 'ccTray',
        url: 'https://api.travis-ci.com/repos/kanekotic/web-threads/cc.xml?branch=master',
      },
    ],
    [
      'https://app.datadoghq.eu/monitors/4005341',
      {
        type: 'datadogMonitor',
        site: 'datadoghq.eu',
        monitorId: '4005341',
      },
    ],
    [
      'https://sentry.io/organizations/climatepartner/projects/website/',
      {
        type: 'sentry',
        organization: 'climatepartner',
        project: 'website',
      },
    ],
  ])('%s parsed', (url: string, expectedParse: any) => {
    it('should have correct textfield attributes', () => {
      const result = observersfromLinkParser
        .map((strategy) => {
          if (strategy.canApply(url))
            return {
              canApply: true,
              apply: strategy.apply(url),
            };
          return {
            canApply: false,
          };
        })
        .filter((result) => result.canApply)[0];

      expect(result.canApply).toBeTruthy();
      expect(result.apply).toEqual(expectedParse);
    });
  });
});
