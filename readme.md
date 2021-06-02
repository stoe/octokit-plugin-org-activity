# @stoe/octokit-plugin-org-activity

[![test](https://github.com/stoe/octokit-plugin-org-activity/actions/workflows/test.yml/badge.svg)](https://github.com/stoe/octokit-plugin-org-activity/actions/workflows/test.yml) [![codeql](https://github.com/stoe/octokit-plugin-org-activity/actions/workflows/codeql.yml/badge.svg)](https://github.com/stoe/octokit-plugin-org-activity/actions/workflows/codeql.yml) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Octokit plugin to fetch member activity for a given GitHub organization

## Install

```sh
$ npm install @stoe/octokit-plugin-org-activity
```

## Usage

**Personal Access Token authentication**:

```js
const {Octokit} = require('@octokit/core')
const MyOctokit = Octokit.plugin(
  require('@stoe/octokit-plugin-org-activity')
)

const octokit = new MyOctokit({
  auth: 'GITHUB_TOKEN',
})

const data = await octokit.listMemberActivityByOrganization({org: 'my-org'})

console.log(data)
```

**GitHub App installation authentication**:

```js
const {Octokit} = require('@octokit/core')
const MyOctokit = Octokit.plugin(
  require('@stoe/octokit-plugin-org-activity')
)
const {createAppAuth} = require('@octokit/auth-app')

const auth = createAppAuth({
  id: APP_ID,
  privateKey: Buffer.from(PRIVATE_KEY_BASE64.trim(), 'base64').toString('ascii'),
  installationId: INSTALLATION_ID
})

const {token} = await auth({type: 'installation'})

const octokit = new MyOctokit({
  auth: token
})

const data = await octokit.listMemberActivityByOrganization({org: 'my-org'})

console.log(data)
```

## Output

```js
[
  {
    login: 'monalisa',
    emails: [],
    role: 'MEMBER',
    contributions: {
      periodStart: '2020-07-31T22:00:00Z',
      periodEnd: '2020-09-29T09:55:47Z',
      isSingleDay: false,
      hasAnyContributions: true,
      hasAnyRestrictedContributions: false,
      hasActivityInThePast: true,
      totalCommitContributions: 1,
      totalRepositoriesWithContributedCommits: 1,
      totalIssueContributions: 1,
      totalRepositoriesWithContributedIssues: 1,
      totalPullRequestContributions: 0,
      totalRepositoriesWithContributedPullRequests: 0,
      totalPullRequestReviewContributions: 0,
      totalRepositoriesWithContributedPullRequestReviews: 0,
      totalRepositoryContributions: 0
    }
  },
  {
    login: 'stoe',
    emails: [ 'stoe@github.com' ],
    role: 'ADMIN',
    contributions: {
      periodStart: '2020-07-31T22:00:00Z',
      periodEnd: '2020-09-29T09:55:47Z',
      isSingleDay: false,
      hasAnyContributions: true,
      hasAnyRestrictedContributions: false,
      hasActivityInThePast: true,
      totalCommitContributions: 4,
      totalRepositoriesWithContributedCommits: 2,
      totalIssueContributions: 2,
      totalRepositoriesWithContributedIssues: 1,
      totalPullRequestContributions: 1,
      totalRepositoriesWithContributedPullRequests: 1,
      totalPullRequestReviewContributions: 0,
      totalRepositoriesWithContributedPullRequestReviews: 0,
      totalRepositoryContributions: 0
    }
  }
]
```

## License

- [MIT License](./license)
