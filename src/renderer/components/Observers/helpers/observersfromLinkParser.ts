type strategy = {
  canApply: (text: string) => boolean;
  apply: (text: string) => any;
};
const githubRegex = /https:\/\/github.com\/(.+)\/(.+)\/actions\/workflows\/(.+)/;
const ccTrayRegex = /cc.xml/;
const datadogRegex = /https:\/\/app.(.*datadog.*)\/monitors\/(.+)/;
const sentryRegex = /https:\/\/sentry.io\/organizations\/(.+)\/projects\/(.+)\//;

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
];
