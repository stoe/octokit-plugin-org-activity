import dayjs from 'dayjs'

/**
 * @module stoe/octokit-plugin-org-activity
 */
export default function plugin(octokit) {
  const ACTIVITY_QUERY = `query ($org: String!, $node_id: ID, $from: DateTime, $to: DateTime, $cursor: String) {
  organization(login: $org) {
    id
    membersWithRole(first: 10, after: $cursor) {
      totalCount
      edges {
        node {
          login
          organizationVerifiedDomainEmails(login: $org)
          contributionsCollection(from: $from, to: $to, organizationID: $node_id) {
            periodStart: startedAt
            periodEnd: endedAt
            isSingleDay
            hasAnyContributions
            hasAnyRestrictedContributions
            hasActivityInThePast
            totalCommitContributions
            totalRepositoriesWithContributedCommits
            totalIssueContributions
            totalRepositoriesWithContributedIssues
            totalPullRequestContributions
            totalRepositoriesWithContributedPullRequests
            totalPullRequestReviewContributions
            totalRepositoriesWithContributedPullRequestReviews
            totalRepositoryContributions
          }
        }
        role
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}`

  /**
   * List member activity by organization options object.
   * @typedef {Object} ListMemberActivityByOrganizationOptions
   *
   * @property {string} org - The organization's login.
   * @property {string} [from=null] - Only contributions made at this time or later will be counted. If omitted, defaults to a year ago.
   * @property {string} [to=null] - Only contributions made before and up to and including this time will be counted. If omitted, defaults to the current time.
   */

  /**
   * Contributions a user has made.
   * @typedef {Object} Contributions
   * @readonly
   *
   * @property {string} periodStart - The beginning date and time of this collection.
   * @property {string} periodEnd - The ending date and time of this collection.
   * @property {boolean} isSingleDay - Whether or not the collection's time span is all within the same day.
   * @property {boolean} hasAnyContributions - Determine if there are any contributions in this collection.
   * @property {boolean} hasAnyRestrictedContributions - Determine if the user made any contributions in this time frame whose details are not visible because they were made in a private repository. Can only be true if the user enabled private contribution counts.
   * @property {boolean} hasActivityInThePast - Does the user have any more activity in the timeline that occurred prior to the collection's time range?
   * @property {number} totalCommitContributions - How many commits were made by the user in this time span.
   * @property {number} totalRepositoriesWithContributedCommits - How many different repositories the user committed to.
   * @property {number} totalIssueContributions - How many issues the user opened.
   * @property {number} totalRepositoriesWithContributedIssues - How many different repositories the user opened issues in.
   * @property {number} totalPullRequestContributions - How many pull requests the user opened.
   * @property {number} totalRepositoriesWithContributedPullRequests - How many different repositories the user opened pull requests in.
   * @property {number} totalPullRequestReviewContributions -How many pull request reviews the user left.
   * @property {number} totalRepositoriesWithContributedPullRequestReviews - How many different repositories the user left pull request reviews in.
   * @property {number} totalRepositoryContributions - How many repositories the user created.
   */

  /**
   * A contribution record object.
   * @typedef {Object} ContributionRecord
   * @readonly
   *
   * @property {string} login - The username used to login.
   * @property {string[]} emails - Array of verified email addresses that match verified domains for the specified organization the user is a member of.
   * @property {('MEMBER'|'ADMIN')} role - The role this user has in the organization. MEMBER (The user is a member of the organization) or ADMIN (The user is an administrator of the organization)
   * @property {Contributions} contributions - Contributions a user has made.
   */

  /**
   * Activity options object.
   * @typedef {Object} ActivityOptions
   * @private
   *
   * @property {string} org - The organization's login.
   * @property {string} node_id - The ID of the organization used to filter contributions.
   * @property {string} [from=null] - Only contributions made at this time or later will be counted. If omitted, defaults to a year ago.
   * @property {string} [to=null] - Only contributions made before and up to and including this time will be counted. If omitted, defaults to the current time.
   * @property {string} [cursor=null] - Returns the elements in the list that come after the specified cursor.
   */

  /**
   * @async
   * @private
   * @function getActivity
   *
   * @param {ActivityOptions} options
   * @param {ContributionRecord[]} records
   *
   * @yields {ContributionRecord[]}
   */
  async function* getActivity({org, node_id, from = null, to = null, cursor = null}, records = []) {
    const {
      organization: {membersWithRole},
    } = await octokit.graphql(ACTIVITY_QUERY, {org, node_id, from, to, cursor})

    membersWithRole.edges.map(data => {
      /**@type Contributions */
      records.push({
        login: data.node.login,
        emails: data.node.organizationVerifiedDomainEmails,
        role: data.role,
        contributions: data.node.contributionsCollection,
      })
    })

    if (membersWithRole.pageInfo.hasNextPage) {
      await getActivity({org, node_id, from, to, cursor: membersWithRole.pageInfo.endCursor}, records).next()
    }

    yield records
  }

  return {
    /**
     * @async
     * @public
     * @function listMemberActivityByOrganization
     * @description List member activity for a given GitHub organization.
     *
     * @param {ListMemberActivityByOrganizationOptions} options
     *
     * @returns {Promise<ContributionRecord[]>}
     */
    listMemberActivityByOrganization: async ({org, from = null, to = null}) => {
      // get the orgs node_id needed for the GraphQL query
      const {
        data: {node_id},
      } = await octokit.request(`GET /orgs/${org}`)

      // set to now as default
      let _to = dayjs()
      if (to) {
        _to = dayjs(to, ['YYYY-MM-DD', dayjs.ISO_8601])
      }

      let _from
      if (from) {
        _from = dayjs(from, ['YYYY-MM-DD', dayjs.ISO_8601])
      } else {
        _from = _to.subtract(1, 'year')
      }

      _to = _to.toISOString()
      _from = _from.toISOString()

      octokit.log.debug(`getting contributions for ${org} between ${_from} and ${_to}`)

      const {value} = await getActivity({org, node_id, from: _from, to: _to}).next()

      return value
    },
  }
}
