// // # Full brief
// curl -X POST http://localhost:3000/a2a/agent \
//   -H "Content-Type: application/json" \
//   -d '{
//     "jsonrpc": "2.0",
//     "id": "test-001",
//     "method": "message/send",
//     "params": {
//       "message": {
//         "kind": "message",
//         "role": "user",
//         "parts": [{"kind": "text", "text": "Give me my morning brief"}],
//         "messageId": "msg-001"
//       }
//     }
//   }'

// // # News only
// curl -X POST http://localhost:3000/a2a/agent \
//   -H "Content-Type": "application/json" \
//   -d '{
//     "jsonrpc": "2.0",
//     "id": "test-002",
//     "method": "message/send",
//     "params": {
//       "message": {
//         "kind": "message",
//         "role": "user",
//         "parts": [{"kind": "text", "text": "news"}],
//         "messageId": "msg-002"
//       }
//     }
//   }'

// // # Weather for specific city
// curl -X POST http://localhost:3000/a2a/agent \
//   -H "Content-Type: application/json" \
//   -d '{
//     "jsonrpc": "2.0",
//     "id": "test-003",
//     "method": "message/send",
//     "params": {
//       "message": {
//         "kind": "message",
//         "role": "user",
//         "parts": [{"kind": "text", "text": "weather in London"}],
//         "messageId": "msg-003"
//       }
//     }
//   }'