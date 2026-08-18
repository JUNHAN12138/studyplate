import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { SortView } from './views/SortView';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

type ViewKey =
  | 'ds-sort'
  | 'ds-search'
  | 'ds-linear'
  | 'ds-tree'
  | 'ds-graph'
  | 'co-booth'
  | 'co-float'
  | 'os-cpu'
  | 'os-proc'
  | 'net-route'
  | 'net-tcp'
  | 'math-limit'
  | 'math-deriv'
  | 'math-integ';

const menuItems: MenuProps['items'] = [
  {
    key: '408',
    label: '408',
    type: 'group',
    children: [
      {
        key: 'ds',
        label: '数据结构',
        children: [
          { key: 'ds-sort', label: '排序' },
          { key: 'ds-search', label: '查找' },
          { key: 'ds-linear', label: '栈/队列' },
          { key: 'ds-tree', label: '树' },
          { key: 'ds-graph', label: '图' },
        ],
      },
      {
        key: 'co',
        label: '计组',
        children: [
          { key: 'co-booth', label: 'Booth 乘法' },
          { key: 'co-float', label: '浮点加减' },
        ],
      },
      {
        key: 'os',
        label: '操统',
        children: [
          { key: 'os-cpu', label: 'CPU 调度' },
          { key: 'os-proc', label: '进程状态转换' },
        ],
      },
      {
        key: 'net',
        label: '计网',
        children: [
          { key: 'net-route', label: 'Dijkstra 最短路' },
          { key: 'net-tcp', label: 'TCP 三次握手' },
        ],
      },
    ],
  },
  {
    key: '数学',
    label: '数学',
    type: 'group',
    children: [
      { key: 'math-limit', label: '初等函数与极限' },
      { key: 'math-deriv', label: '连续与导数' },
      { key: 'math-integ', label: '定积分与应用' },
    ],
  },
];

function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ padding: 32, color: '#888', fontSize: 16 }}>
      【{title}】模块开发中，敬请期待…
    </div>
  );
}

function ViewRouter({ viewKey }: { viewKey: ViewKey }) {
  switch (viewKey) {
    case 'ds-sort':
      return <SortView />;
    default:
      return <Placeholder title={viewKey} />;
  }
}

const App: React.FC = () => {
  const [current, setCurrent] = useState<ViewKey>('ds-sort');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        theme="light"
        style={{ borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>StudyPlate</Title>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>考研可视化学习</div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[current]}
          defaultOpenKeys={['ds', 'co', 'os', 'net']}
          items={menuItems}
          onClick={({ key }) => setCurrent(key as ViewKey)}
          style={{ border: 'none' }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', height: 48, lineHeight: '48px' }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            {current === 'ds-sort' ? '排序算法可视化' : current}
          </span>
        </Header>
        <Content style={{ padding: 24, overflowY: 'auto' }}>
          <ViewRouter viewKey={current} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
