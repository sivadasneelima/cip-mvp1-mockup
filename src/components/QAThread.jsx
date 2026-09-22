import React, { useState } from 'react'
import { useDemo } from '../data/DemoContext.jsx'

export default function QAThread({ threadKey, roleScope }) {
  const { qaThreads, addQaPost } = useDemo()
  const [draft, setDraft] = useState('')

  const thread = (qaThreads[threadKey] || []).find((t) => t.role === roleScope)
  const posts = thread ? thread.posts : []

  function submit(e) {
    e.preventDefault()
    if (!draft.trim()) return
    addQaPost(threadKey, roleScope, draft.trim())
    setDraft('')
  }

  return (
    <div className="card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Clarifying questions</h3>
        <span className="text-xs text-ink-400">Visible to {roleScope} contributors on this mission only</span>
      </div>

      <div className="mt-3 space-y-3">
        {posts.length === 0 && (
          <p className="text-sm text-ink-400">No questions yet. Be the first to ask.</p>
        )}
        {posts.map((p) => (
          <div key={p.id} className="rounded-lg bg-ink-50 px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <span className="font-medium text-ink-700">{p.author}</span>
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink-500 ring-1 ring-ink-200">
                {p.authorRole}
              </span>
              <span>{p.timestamp}</span>
            </div>
            <p className="mt-1 text-sm text-ink-800">{p.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          className="input"
          placeholder="Ask a clarifying question about this mission…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="btn-secondary shrink-0">
          Post
        </button>
      </form>
    </div>
  )
}
