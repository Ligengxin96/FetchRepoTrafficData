import { useState, Suspense } from 'react';
import { Col } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import LineChart from './components/LineChart/LineChart';
import Menus from './components/Menus/Menus';

const REPOS = [
  'FetchBingDailyImage',
  'Ours-Album',
  'FetchRepoTrafficData',
  'SQL-in-MongoDB'
]

const App = () => {
  const [currentMenus, setCurrentMenus] = useState(REPOS[0]);
  return (
    <>
      <Col>
        <Menus repos={REPOS} currentMenus={currentMenus} setCurrentMenus={setCurrentMenus} />
      </Col>
      <Col>
        <GridContent>
          <>
            <Suspense fallback={null}>
              <LineChart repoName={currentMenus} />
            </Suspense>
          </>
        </GridContent>
      </Col>
    </>
  );
};

export default App;
