const { contributors } = require('./package.json')
//Co-authored-by: name <name@example.com>
  /**
   * @typedef {{type: string; scope: string; subject: string; body: string; isBreaking: boolean; breakingBody: string; breaking: string; isIssueAffected: boolean; issuesBody: string; issues: string;}} Answers
   */
const types = [
    {
      "name": "feat: A new feature",
      "value": "feat"
    },
    {
      "name": "fix: A bug fix",
      "value": "fix"
    },
    {
      "name": "docs: Documentation only changes",
      "value": "docs"
    },
    {
      "name": "style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
      "value": "style"
    },
    {
      "name": "refactor: A code change that neither fixes a bug nor adds a feature",
      "value": "refactor"
    },
    {
      "name": "perf: A code change that improves performance",
      "value": "perf"
    },
    {
      "name": "test: Adding missing tests or correcting existing tests",
      "value": "test"
    },
    {
      "name": "chore: Other changes that don't modify src or test files",
      "value": "chore"
    },
    {
      "name": "revert: Reverts a previous commit",
      "value": "revert"
    }
  ]
const scopes = [
    {
      "name": "core: base system of the application",
      "value": "core"
    },
    {
      "name": "extensions: systems that are observed",
      "value": "extensions"
    },
    {
      "name": "tools: other things in the project",
      "value": "tools"
    },
]
/** @type import('cz-format-extension').Config<Answers> */
module.exports = {
  questions({inquirer}) {
    return [
      {
        type: "list",
        name: "type",
        message: "'What is the type of this change:",
        choices: types
      },
      {
        type: 'list',
        name: 'scope',
        message: 'What is the scope of this change:',
        choices: scopes
      },
      {
        type: 'input',
        name: 'subject',
        message: "Write a short, imperative tense description of the change\n",
        validate: (subject) => subject.length === 0 ? 'subject is required' : true
      },
      {
        type: 'input',
        name: 'body',
        message: 'Provide a longer description of the change: (press enter to skip)\n',
      },
      {
        type: 'confirm',
        name: 'isBreaking',
        message: 'Are there any breaking changes?',
        default: false
      },
      {
        type: 'input',
        name: 'breaking',
        message: 'Describe the breaking changes:\n',
        when: answers => answers.isBreaking
      },
      {
        type: 'confirm',
        name: 'isIssueAffected',
        message: 'Does this change affect any open issues?',
        default: false
      },
      {
        type: 'input',
        name: 'issues',
        message: 'Add issue references:\n',
        when: answers => answers.isIssueAffected,
        default: undefined,
        validate: (issues) => issues.length === 0 ? 'issues is required' : true
      },
      {
        type: 'checkbox',
        name: 'coauthors',
        message: 'Select Co-Authors if any:',
        choices: contributors.map(contributor => ({
            name: contributor.name,
            value: `Co-authored-by: ${contributor.name} <${contributor.email}>`,
        }))
      },
    ]
  },
  commitMessage({answers}) {
    const scope = answers.scope ? `(${answers.scope})` : '';
    const head = `${answers.type}${scope}: ${answers.subject}`;
    const body = answers.body ? answers.body : '';
    const breaking = answers.breaking ? `BREAKING CHANGE: ${answers.breaking}` : '';
    const issues = answers.issues ? answers.issues : '';
    const coauthors = answers.coauthors.join('\n');

    return [head, body, breaking, issues, coauthors].join('\n\n').trim()
  }
}