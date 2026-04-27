import { useEffect, useRef } from 'react'
import katex from 'katex'

export function Math({ math, block = false }: { math: string; block?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, {
        throwOnError: false,
        displayMode: block
      })
    }
  }, [math, block])

  return <span ref={ref} />
}
