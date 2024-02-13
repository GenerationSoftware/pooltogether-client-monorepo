/**
 * Basic config to avoid refetching data
 */
export const NO_REFETCH = {
  refetchInterval: false,
  refetchIntervalInBackground: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false
} as const
