type strategy = {
  canApply: (text: string) => boolean;
  apply: (text: string) => any;
};
const githubRegex = /https:\/\/github.com\/(.+)\/(.+)\/actions\/workflows\/(.+)/;
const ccTrayRegex = /cc.xml/;
const datadogRegex = /https:\/\/app.(.*datadog.*)\/monitors\/(.+)/;
const sentryRegex = /https:\/\/sentry.io\/organizations\/(.+)\/projects\/(.+)\//;
const azureDevOpsRegex = /(https:\/\/.*\.visualstudio\.com)\/(.+)\/_build\?definitionId=(.+)/;
const opsgenieRegex = /https:\/\/.*app\.(eu\.opsgenie\.com|opsgenie\.com)\/alert\/detail\/(.+)\/details/;
const graylogRegex = /(.*)\/alerts/;

export const observersfromLinkParser: strategy[] = [
  {
    canApply: (text: string) => githubRegex.test(text),
    apply: (text: string) => {
      const match = text.match(githubRegex);
      return {
        type: 'githubAction',
        owner: match[1],
        repo: match[2],
        workflowId: match[3],
      };
    },
  },
  {
    canApply: (text: string) => ccTrayRegex.test(text),
    apply: (text: string) => ({
      type: 'ccTray',
      url: text,
    }),
  },
  {
    canApply: (text: string) => datadogRegex.test(text),
    apply: (text: string) => {
      const match = text.match(datadogRegex);
      return {
        type: 'datadogMonitor',
        site: match[1],
        monitorId: match[2],
      };
    },
  },
  {
    canApply: (text: string) => sentryRegex.test(text),
    apply: (text: string) => {
      const match = text.match(sentryRegex);
      return {
        type: 'sentry',
        organization: match[1],
        project: match[2],
      };
    },
  },
  {
    canApply: (text: string) => sentryRegex.test(text),
    apply: (text: string) => {
      const match = text.match(sentryRegex);
      return {
        type: 'sentry',
        organization: match[1],
        project: match[2],
      };
    },
  },
  {
    canApply: (text: string) => azureDevOpsRegex.test(text),
    apply: (text: string) => {
      const match = text.match(azureDevOpsRegex);
      return {
        type: 'azureDevOps',
        orgUrl: match[1],
        project: match[2],
        pipelineId: match[3],
      };
    },
  },
  {
    canApply: (text: string) => opsgenieRegex.test(text),
    apply: (text: string) => {
      const match = text.match(opsgenieRegex);
      console.log(match[1], match[2]);
      return {
        type: 'opsgenie',
        host: match[1],
        identifier: match[2],
      };
    },
  },
  {
    canApply: (text: string) => graylogRegex.test(text),
    apply: (text: string) => {
      const match = text.match(graylogRegex);
      return {
        type: 'graylog',
        url: match[1],
      };
    },
  },
];
