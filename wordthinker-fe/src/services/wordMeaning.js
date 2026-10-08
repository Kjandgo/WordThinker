export async function lookupWordMeaning(word, signal) {
  const response = await fetch('/api/ai/word-meaning', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word }),
    signal,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error || 'AI 조회에 실패했습니다. n8n 실행 및 워크플로우 활성화 상태를 확인해주세요.')
  }
  if (typeof data?.meaning !== 'string' || !data.meaning.trim() || typeof data?.example !== 'string') {
    throw new Error('AI 응답 형식이 올바르지 않습니다. n8n 워크플로우를 확인해주세요.')
  }
  return { meaning: data.meaning.trim(), example: data.example.trim() }
}
