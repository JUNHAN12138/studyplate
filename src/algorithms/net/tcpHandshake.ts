import type { Step } from '../types';

export interface TcpState {
  clientState: string;
  serverState: string;
  message?: { from: 'client' | 'server'; text: string; flags: string };
  messages: { from: 'client' | 'server'; text: string; flags: string }[];
}

export function tcpThreeWayHandshake(): Step<TcpState>[] {
  const steps: Step<TcpState>[] = [];
  const messages: TcpState['messages'] = [];

  steps.push({
    state: { clientState: 'CLOSED', serverState: 'LISTEN', messages: [] },
    desc: '初始状态：客户端 CLOSED，服务端 LISTEN',
    lines: [1],
  });

  // SYN
  const syn = { from: 'client' as const, text: 'SYN, seq=x', flags: 'SYN' };
  messages.push(syn);
  steps.push({
    state: { clientState: 'SYN_SENT', serverState: 'LISTEN', message: syn, messages: [...messages] },
    desc: '第一次握手：客户端发送 SYN，进入 SYN_SENT',
    lines: [2],
  });

  // SYN+ACK
  const synack = { from: 'server' as const, text: 'SYN+ACK, seq=y, ack=x+1', flags: 'SYN+ACK' };
  messages.push(synack);
  steps.push({
    state: { clientState: 'SYN_SENT', serverState: 'SYN_RCVD', message: synack, messages: [...messages] },
    desc: '第二次握手：服务端回复 SYN+ACK，进入 SYN_RCVD',
    lines: [3],
  });

  // ACK
  const ack = { from: 'client' as const, text: 'ACK, ack=y+1', flags: 'ACK' };
  messages.push(ack);
  steps.push({
    state: { clientState: 'ESTABLISHED', serverState: 'ESTABLISHED', message: ack, messages: [...messages] },
    desc: '第三次握手：客户端发送 ACK，双方进入 ESTABLISHED',
    lines: [4],
  });

  steps.push({
    state: { clientState: 'ESTABLISHED', serverState: 'ESTABLISHED', messages: [...messages] },
    desc: '三次握手完成，连接建立',
    lines: [5],
  });

  return steps;
}

export const tcpCode = `TCP 三次握手:
Client: CLOSED → SYN_SENT             // 1
Client → Server: SYN, seq=x           // 2
Server → Client: SYN+ACK, seq=y, ack=x+1  // 3
Client → Server: ACK, ack=y+1         // 4
Both: ESTABLISHED                      // 5`;
