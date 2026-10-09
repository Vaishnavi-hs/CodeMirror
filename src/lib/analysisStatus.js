export function getAnalysisStatus({ code, language, loading, lastAnalyzedCode, lastAnalyzedLanguage }) {
  const hasPreviousAnalysis = lastAnalyzedCode !== null
  const hasCurrentAnalysis = hasPreviousAnalysis && code === lastAnalyzedCode && language === lastAnalyzedLanguage
  const isStale = hasPreviousAnalysis && !hasCurrentAnalysis

  let label
  if (loading) label = 'Analyzing...'
  else if (!code.trim()) label = 'Editor ready'
  else if (hasCurrentAnalysis) label = 'Analysis complete'
  else if (hasPreviousAnalysis) label = 'Changes detected — analyze again'
  else label = 'Ready to analyze'

  return { label, isStale, hasCurrentAnalysis }
}