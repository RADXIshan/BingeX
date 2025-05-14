export function connectToStream(onMessage) {
  const ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  return ws;
}