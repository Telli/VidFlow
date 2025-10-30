import React, { useState } from 'react';
import { streamSSE } from '../../lib/api';

export default function RightSidebar() {
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'google' | 'stability'>('openai');
  const [model, setModel] = useState('gpt-4o-mini');
  const [prompt, setPrompt] = useState('Say hello from VidFlow');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobProgress, setJobProgress] = useState<number | null>(null);

  const onGenerate = async () => {
    setLoading(true);
    setOutput('');
    try {
      await streamSSE('/api/ai/stream', { provider, model, prompt }, (msg) => {
        if (msg.done) return;
        setOutput((o) => o + msg.text);
      });
    } finally {
      setLoading(false);
    }
  };

  const startJob = async () => {
    setJobProgress(0);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const { jobId } = await res.json();
    const interval = setInterval(async () => {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/video/${jobId}/progress`, {
        credentials: 'include',
      });
      const data = await r.json();
      setJobProgress(data.progress ?? 0);
      if (data.state === 'completed' || data.state === 'failed') {
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <aside className="w-80 border-l p-3 bg-white space-y-3">
      <h2 className="text-sm font-semibold">Inspector</h2>
      <div className="space-y-2">
        <label className="block text-xs font-medium">Provider</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as any)}
          className="w-full rounded border px-2 py-1 text-sm"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="google">Google AI</option>
          <option value="stability">Stability AI</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-medium">Model</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-medium">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded border px-2 py-1 text-sm"
          rows={4}
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full rounded bg-blue-600 text-white py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Test AI stream'}
      </button>

      <div className="border rounded p-2 h-40 overflow-auto text-xs whitespace-pre-wrap bg-gray-50">
        {output || 'Output will stream here...'}
      </div>

      <div className="pt-2 space-y-2">
        <button
          onClick={startJob}
          className="w-full rounded bg-green-600 text-white py-2 text-sm hover:bg-green-700"
        >
          Start Video Job
        </button>
        {jobProgress !== null && (
          <div className="text-xs">Progress: {jobProgress}%</div>
        )}
      </div>
    </aside>
  );
}
