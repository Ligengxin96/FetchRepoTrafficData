import axios from 'axios';

const API_PATH = 'https://www.ligengxin-server.top/getrepoinfo/v1/getrepoinfo';

const fetchRepoData = (repoName) => axios.get(`${API_PATH}/${repoName}`);

export default fetchRepoData;