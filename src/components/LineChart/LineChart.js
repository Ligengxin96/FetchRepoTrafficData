/* eslint-disable no-loop-func */
import { useState, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { Card, Col } from 'antd';
import { LineChart as EchartSLineChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, DataZoomComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import moment from 'moment';

import fetchRepoData from '../../fetchRepoData';

echarts.use([GridComponent, TooltipComponent, DataZoomComponent, LegendComponent, EchartSLineChart, CanvasRenderer]);

const processData = ({ viewsData = [], clonesData = [] }) => {
  const result = { views: [], uniqueViews: [], clones: [], uniqueClones: [], date: [] };

  let minDate = viewsData[viewsData.length - 1].date < clonesData[clonesData.length - 1].date ? viewsData[viewsData.length - 1].date : clonesData[clonesData.length - 1].date;
  let maxDate = viewsData[0].date > clonesData[0].date ? viewsData[0].date : clonesData[0].date;
  minDate = moment(minDate);
  maxDate = moment(maxDate);

  while (minDate.isBefore(maxDate)) {
    result.uniqueViews.push({
      date: minDate.format('YYYY-MM-DD'),
      value: viewsData.find((item) => minDate.isSame(item.date))?.uniques || 0,
    });
    result.views.push({
      date: minDate.format('YYYY-MM-DD'),
      value: viewsData.find((item) => minDate.isSame(item.date))?.count || 0,
    });
    result.uniqueClones.push({
      date: minDate.format('YYYY-MM-DD'),
      value: clonesData.find((item) => minDate.isSame(item.date))?.uniques || 0,
    });
    result.clones.push({
      date: minDate.format('YYYY-MM-DD'),
      value: clonesData.find((item) => minDate.isSame(item.date))?.count || 0,
    });
    result.date.push(minDate.format('YYYY-MM-DD'));
    minDate = moment(minDate).add(1, 'days');
  }

  return { 
    ...result, 
    totalViews: result.views.reduce((acc, val) => { return { value: acc.value + val.value }}, { value: 0 }).value,
    totalClones: result.clones.reduce((acc, val) => { return { value: acc.value + val.value }}, { value: 0 }).value,
    totalUniqueViews: result.uniqueViews.reduce((acc, val) => { return { value: acc.value + val.value }}, { value: 0 }).value,
    totalUniqueClones: result.uniqueClones.reduce((acc, val) => { return { value: acc.value + val.value }}, { value: 0 }).value,
  };
}

const getOption = (repoData) => {
  if (!repoData) {
    return {};
  }
  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Views', 'Clones', 'Unique Views', 'Unique Clones'],
      itemGap: 7
    },
    grid: {
      top: '15%',
      left: '3%',
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
        name: 'Unique Views',
        type: 'line',
        data: repoData.uniqueViews
      },
      {
        name: 'Unique Clones',
        type: 'line',
        data: repoData.uniqueClones
      },
      {
        name: 'Views',
        type: 'line',
        data: repoData.views,
      },
      {
        name: 'Clones',
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

  const { totalViews, totalClones, totalUniqueViews, totalUniqueClones } = repoData || {};

  return (
    <Card bordered={false}>
      <Card
        bordered 
        loading={loading}
        type="inner"
        title={<h2>{`${repoName} ${repoData?.date[0]} To ${repoData?.date[repoData.date.length - 1]} Traffic Data`}</h2>}
      >
        <Card.Grid style={{ width: '100%' }} hoverable={false}>
          <ReactEChartsCore
            style={{ height: '50vh' }}
            echarts={echarts}
            option={getOption(repoData)}
            notMerge={true}
            lazyUpdate={true}
          />
        </Card.Grid>
        <Card.Grid style={{ width: '100%', paddingTop: '10px', paddingBottom: '5px' }} hoverable={false}>
          <h4 style={{ display: 'flex' }}>
            <Col span={2}>
              <span>{`${totalViews || '-'} Views`}</span>
            </Col>
            <Col span={2}>
              <span>{`${totalClones || '-'} Clones`}</span>
            </Col>
            <Col span={2}>
              <span>{`${totalUniqueViews || '-'} Unique visitors`}</span>
            </Col>
            <Col span={2}>
              <span>{`${totalUniqueClones || '-'} Unique cloners`}</span>
            </Col>
          </h4>
        </Card.Grid>
      </Card>
    </Card>
  );
}


export default LineChart;
