const LOCAL_SERVER_API = 'http://localhost:3000/api';
const LOCAL_CLIENT_URL = 'http://localhost:4200';
const LOCAL_MAIN_CLIENT_URL = 'http://localhost:4200';
const LOCAL_RESOURCE_URL = 'http://localhost/files';

const REMOTE_TEST_API = 'https://testdts.marathonkids.co.uk';

const OLD_SERVER_API = 'https://dts.kidsrunfree.co.uk';
const OLD_MAIN_SERVER_API = 'https://dts.kidsrunfree.co.uk';

const LIVE_SERVER_API = 'https://dts.marathonkids.co.uk';
const LIVE_MAIN_SERVER_API = 'https://dts.marathonkids.co.uk';

const MAINTENANCE = false;

// export const config = {
//   apiUrl: LOCAL_SERVER_API,
//   CLIENT_URL: LOCAL_CLIENT_URL,
//   MAIN_CLIENT_URL: LOCAL_MAIN_CLIENT_URL,
//   API_RESOURCE_URL: LOCAL_RESOURCE_URL,
//   MAINTENANCE: MAINTENANCE,
// };

export const config = {
  apiUrl: `${REMOTE_TEST_API}/api`,
  CLIENT_URL: REMOTE_TEST_API,
  MAIN_CLIENT_URL: REMOTE_TEST_API,
  API_RESOURCE_URL: `${REMOTE_TEST_API}/files`,
  MAINTENANCE: MAINTENANCE,
};

// export const config = {
//   apiUrl: `${OLD_SERVER_API}/api/v1`,
//   CLIENT_URL: OLD_SERVER_API,
//   MAIN_CLIENT_URL: OLD_MAIN_SERVER_API,
//   API_RESOURCE_URL: `${OLD_SERVER_API}/files`,
//   MAINTENANCE: MAINTENANCE,
// };

// export const config = {
//   apiUrl: `${LIVE_SERVER_API}/api`,
//   CLIENT_URL: LIVE_SERVER_API,
//   MAIN_CLIENT_URL: LIVE_MAIN_SERVER_API,
//   API_RESOURCE_URL: `${LIVE_SERVER_API}/files`,
//   MAINTENANCE: MAINTENANCE,
// };
