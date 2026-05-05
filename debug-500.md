```javascript
fetch('https://asterley-sommelier.onrender.com/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: 'hello', history: [], sessionId: 'test'})
}).then(r => r.json()).then(d => console.log(d._debug))
```
