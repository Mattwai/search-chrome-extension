import { AccessTokenResponse } from '../types';

async function getSearchData(
  value: string,
  tokenResponse: AccessTokenResponse
): Promise<any> {
  try {
    if (tokenResponse) {
      const AUTH_TOKEN =
        'eyJhbGciOiJSUzI1NiIsImtpZCI6Im1pY3Jvcy9lZGdlLWF1dGhlbnRpY2F0b3IvbXdhaS1leHRlbnNpb24iLCJ0eXAiOiJKV1QifQ.eyJhY2NvdW50SWQiOiI3MTIwMjA6MjJmMWEzNjMtZjBkYy00YmRkLWJmZGYtNzUwMmQ5NjcwZTFiIiwiYXVkIjoieHBzZWFyY2gtYWdncmVnYXRvciIsImV4cCI6MTcwNjE0NjQ4MCwiaWF0IjoxNzA2MTQyODgwLCJpc3MiOiJtaWNyb3MvZWRnZS1hdXRoZW50aWNhdG9yIiwianRpIjoiYzU3ZTdjNWUtYWU2ZS00YTk0LWFkYjUtOTlhMjcxMTk3OGMzIn0.WQhfX_dZZABm6Z4BSkRUCZ1_vc5PZY9o_PGa0v-2QA2IhyxlCs2j7FTd82s93aAL9VqQU0To6Bez2cHaDEfQPeZ3X3s3RflGSCNA0i71TbFRCN7GAPfnbyMLXVzKaP6AN5NDlSyEZabg_VBfH7Cjhukqz5OuisbrXRKFeys2353IAshxZbxH2fVuBOsu8cIJDayWqRguL98bipEitz3qedZH20USea81zPE_RQZQD3sXO9Dy13ZAevyVC4u33Jk7Z6aPDyY0JHn-wdQ8RoLuRRObiBH3jR28qEw1gpCQFVmAQuK_FAVvV1K0sJdbEa47Fv8LKPFII0M_02usBhqHTQ';
      const UCT =
        'eyJhbGciOiJSUzI1NiIsImtpZCI6Im1pY3Jvcy9lZGdlLWF1dGhlbnRpY2F0b3IvbXdhaS1leHRlbnNpb24iLCJ0eXAiOiJKV1QifQ.eyJhY2NvdW50SWQiOiI3MTIwMjA6MjJmMWEzNjMtZjBkYy00YmRkLWJmZGYtNzUwMmQ5NjcwZTFiIiwiYXVkIjoiYXRsYXNzaWFuLWludGVybmFsIiwiZXhwIjoxNzA2MTQ2NTA4LCJpYXQiOjE3MDYxNDI5MDgsImlzcyI6Im1pY3Jvcy9lZGdlLWF1dGhlbnRpY2F0b3IiLCJqdGkiOiI1ZWYzZGJlZS0xNmRhLTQwZmEtODQwNi1hNzU2YTU3MWU5ZjkifQ.LyvkiUxGvX_JOXv4bnWvkvUPF2kj7r1Cw-ZG0seiVCzhzRQ_TYn3fZNvwKZgLkU3-4EuYEW-dqhAGDnL8zN8u4gdcmVCUjFy3pYSPGREa6VyOqELGHMdL3K7_NAYVE_cqx2sSjXpTBjhP4jR0Eh4ly9IW4zUOItApeeU1UoGSqEUnHdV6AghAfS6Jeyen4tRcZE22GXfJ04hzpgCy-L2KOciAw-Xhc-7kd_JCy3AfD5wdIZUpo3dDZaPnt08p5YIjD-JLj7RCvCF_LAAYuxHIgh9s5mtUM7ZSKxEopOBGeMnPHZHgcAoWei4e-Sw7O9K9iSlL7tYBWB5TkeR4LgfpA';
      const searchResponse = await fetch('', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + AUTH_TOKEN,
          'User-Context': UCT,
        },
        body: JSON.stringify({
          query: value,
          cloudId: 'DUMMY-7c8a2b74-595a-41c7-960c-fd32f8572cea',
          limit: 50,
          scopes: ['confluence.page'],
          filters: [],
          experience: 'nav.confluence-v3',
          searchSession: {
            sessionId: '',
            referredId: '',
          },
          cloudIds: [],
        }),
      });

      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }
      const searchData = await searchResponse.json();
      return searchData;
    } else {
      console.error('No Access token');
    }
  } catch (error) {
    console.error(
      'An error occurred while fetching data from the endpoint: ',
      error
    );
    throw error;
  }
}

async function getSearchDataJira(
  value: string,
  tokenResponse: AccessTokenResponse
): Promise<any> {
  try {
    if (tokenResponse) {
      const data = {
        query: value,
        cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
        scopes: ['jira.issue', 'jira.board,project,filter,plan'],
        filters: [],
        searchSession: {
          sessionId: '',
          referrerId: '',
        },
        experience: 'product-search-dialog',
        cloudIds: [],
      };
      const searchResponse = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + tokenResponse.access_token,
        },
        body: JSON.stringify(data),
      });

      if (!searchResponse.ok) {
        throw new Error(`HTTP error! status: ${searchResponse.status}`);
      }
      const searchData = await searchResponse.json();
      return searchData;
    } else {
      console.error('No Access token');
    }
  } catch (error) {
    console.error(
      'An error occurred while fetching data from the endpoint: ',
      error
    );
    throw error;
  }
}

export default getSearchData;
