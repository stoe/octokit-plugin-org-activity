# @stoe/octokit-plugin-org-activity

[![test](https://github.com/stoe/ghec-report-node/workflows/test/badge.svg)](https://github.com/stoe/ghec-report-node/actions?query=workflow%3Atest) [![publish](https://github.com/stoe/ghec-report-node/workflows/publish/badge.svg)](https://github.com/stoe/ghec-report-node/actions?query=workflow%3Apublish) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Octokit plugin to fetch member activity for a given GitHub organization

## Install

```sh
$ npm install @stoe/octokit-plugin-org-activity
```

## Usage

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

## Output

```js
[
  {
    login: 'monalisa',
    emails: [],
    role: 'MEMBER',
    contribution: {
      periodStart: '2019-08-24T22:00:00Z',
      periosEnd: '2020-08-25T21:59:59Z',
      isSingleDay: false,
      hasAnyContributions: false,
      hasAnyPrivateContributions: false,
      hasPastContributions: true,
      commitContributions: 0,
      issuesOpened: 0,
      pullRequestsOpened: 0,
      repositoriesCreated: 0
    }
  },
  {
    login: 'stoe',
    emails: [ 'stoe@github.com' ],
    role: 'ADMIN',
    contribution: {
      periodStart: '2019-08-24T22:00:00Z',
      periosEnd: '2020-08-25T21:59:59Z',
      isSingleDay: false,
      hasAnyContributions: true,
      hasAnyPrivateContributions: false,
      hasPastContributions: true,
      commitContributions: 78,
      issuesOpened: 0,
      pullRequestsOpened: 1,
      repositoriesCreated: 0
    }
  }
]
```

## License

- [MIT License](./license)
