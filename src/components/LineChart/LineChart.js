import { useState, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { Card } from 'antd';
import { LineChart as EchartSLineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, TitleComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import moment from 'moment';

import fetchRepoData from '../../fetchRepoData';

import styles from './style.less';

const processData = ({ viewsData = [], clonesData = [] }) => {
  const result = { views: [], clones: [], date: [] };

  let minDate = viewsData[viewsData.length - 1].date < clonesData[clonesData.length - 1].date ? viewsData[viewsData.length - 1].date : clonesData[clonesData.length - 1].date;
  let maxDate = viewsData[0].date > clonesData[0].date ? viewsData[0].date : clonesData[0].date;
  minDate = moment(minDate);
  maxDate = moment(maxDate);

  while (minDate.isBefore(maxDate)) {
    result.views.push({
      date: minDate.format('YYYY-MM-DD'),
      value: viewsData.find((item) => minDate.isSame(item.date))?.uniques || 0,
      type: 'views',
    });
    result.clones.push({
      date: minDate.format('YYYY-MM-DD'),
      value: clonesData.find((item) => minDate.isSame(item.date))?.uniques || 0,
      type: 'clones',
    });
    result.date.push(minDate.format('YYYY-MM-DD'));
    minDate = moment(minDate).add(1, 'days');
  }

  return result;
}

const getOption = (repoData, repoName) => {
  if (!repoData) {
    return {};
  }
  return {
    title: {
      text: `${repoName} ${repoData.date[0]} To ${repoData.date[repoData.date.length - 1]} Traffic Data`
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['clones', 'views'],
      itemGap: 7
    },
    grid: {
      top: '15%',
      left: '1%',
      right: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: repoData.date
      }
    ],
    yAxis: [
      {
        type: 'value',
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        show: true,
        start: 0,
        end: 100,
      },
      {
        type: 'inside',
        start: 0,
        end: 100
      }

    ],
    series: [
      {
        name: 'view',
        type: 'line',
        data: repoData.views
      },
      {
        name: 'clones',
        type: 'line',
        data: repoData.clones
      }
    ]
  };
}

const LineChart = ({ repoName }) => {

  const [loading, setLoading] = useState(false);
  const [repoData, setRepoData] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchRepoData(repoName)
      .then((response) => {
        const { data = [] } = response.data;
        setRepoData(processData(data));
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
      });
  }, [repoName]);

  echarts.use([GridComponent, TooltipComponent, TitleComponent, DataZoomComponent, EchartSLineChart, CanvasRenderer]);

  return (
    <Card
      loading={loading}
      className={styles.repoTrafficCard}
      bordered={false}
    >
      <ReactEChartsCore
        style={{ height: '50vh' }}
        echarts={echarts}
        option={getOption(repoData, repoName)}
        notMerge={true}
        lazyUpdate={true}
      />
    </Card>
  );
}


export default LineChart;
