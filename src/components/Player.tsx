
import { Button, Slider, Space, Select } from 'antd';
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { PlayerControls } from '../hooks/usePlayer';

interface Props<S> {
  player: PlayerControls<S>;
}

export function Player<S>({ player }: Props<S>) {
  const { index, total, playing, speed, prev, next, reset, togglePlay, setSpeed, seek } = player;

  return (
    <div style={{ padding: '12px 0' }}>
      <Space size={8} wrap>
        <Button icon={<ReloadOutlined />} onClick={reset} size="small">重置</Button>
        <Button icon={<StepBackwardOutlined />} onClick={prev} size="small" disabled={index === 0}>上一帧</Button>
        <Button
          icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={togglePlay}
          size="small"
          color="primary"
          variant="solid"
        >
          {playing ? '暂停' : '播放'}
        </Button>
        <Button icon={<StepForwardOutlined />} onClick={next} size="small" disabled={index === total - 1}>下一帧</Button>
        <span style={{ fontSize: 12, color: '#888' }}>帧 {index + 1}/{total}</span>
        <Select
          size="small"
          value={speed}
          onChange={setSpeed}
          style={{ width: 90 }}
          options={[
            { value: 0.5, label: '0.5×' },
            { value: 1, label: '1×' },
            { value: 2, label: '2×' },
            { value: 4, label: '4×' },
          ]}
        />
      </Space>
      <Slider
        min={0}
        max={total - 1}
        value={index}
        onChange={seek}
        tooltip={{ formatter: (v) => `帧 ${(v ?? 0) + 1}` }}
        style={{ marginTop: 8 }}
      />
    </div>
  );
}
