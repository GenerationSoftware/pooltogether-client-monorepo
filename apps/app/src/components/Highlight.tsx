import { HighlightInit } from '@highlight-run/next/client'

export const Highlight = () => {
  const projectId = process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID

  if (!!projectId) {
    return (
      <HighlightInit
        excludedHostnames={['localhost']}
        projectId={projectId}
        serviceName='cabana-app'
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: []
        }}
        storageMode='sessionStorage'
      />
    )
  }

  return <></>
}
