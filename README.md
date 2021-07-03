## About GetRepoTrafficData

This branch project can expose the api so that we can get historical repo traffic data.

This branch project should use with main branch project, or make sure your collections name are same as your repo name.

Your also should make sure add your repo name in `./config/repo.js`;

### `http://getrepootrafficdata.herokuapp.com/v1/getrepoinfo/{repo}`

Get the specified `{repo}` all traffic data.

### `http://getrepootrafficdata.herokuapp.com/v1/getrepoinfo/{repo}/{days}`

Get the specified `{repo}` latest `{days}` traffic data.

Blow example can get `FetchRepooTrafficData` repo latest `7` days traffic data.

example: http://getrepootrafficdata.herokuapp.com/v1/getrepoinfo/FetchRepoTrafficData/7

- `repo` parameter detail
  - description: repo name
  - require: `true`

- `days` parameter detail
  - description: how many days of traffic data you want get.
  - require: `false`
  - default: `0`

### Common parameter `aggregate` and `sort`
- `aggregate` parameter detail
  - description: whether aggregate the traffic data
  - require: `false`
  - value: `true` | `false`
  - default: `false`

- `sort` parameter detail
  - description: use with `{days}` parameter, get latest traffic `{days}` data or oldest `{days}` traffic
  - require: `false`
  - value: `asc` | `desc`
  - default: `desc(latest)`

Blow example can get `FetchRepooTrafficData` repo **oldest** `10` days **aggregated** traffic data.

example: http://getrepootrafficdata.herokuapp.com/v1/getrepoinfo/FetchRepoTrafficData/10?aggregate=true&sort=asc
