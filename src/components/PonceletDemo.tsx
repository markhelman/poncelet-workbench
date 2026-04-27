import { useState, useEffect, useRef, useMemo } from 'react'
import { Complex, getTriangleVertices, getInnerConicInfo, getTriangleCenters, getCenterLocus, getTriangleProperties } from '../math'
import { WorkbenchSidebar } from './WorkbenchSidebar'
import { Milestone } from '../milestones'

export function PonceletDemo() {
  const [fx, setFx] = useState(0.2)
  const [fy, setFy] = useState(0)
  const [gx, setGx] = useState(-0.2)
  const [gy, setGy] = useState(0)
  const [A, setA] = useState(250)
  const [B, setB] = useState(200)
  const [theta, setTheta] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showG, setShowG] = useState(true)
  const [showH, setShowH] = useState(false)
  const [showO, setShowO] = useState(false)
  const [showI, setShowI] = useState(false)
  const [speed, setSpeed] = useState(0.01)
  const [dragging, setDragging] = useState<'f' | 'g' | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(null)

  const f = useMemo(() => new Complex(fx, fy), [fx, fy])
  const g = useMemo(() => new Complex(gx, gy), [gx, gy])

  const vertices = useMemo(() => {
    try {
      const lambda = Complex.fromAngle(theta)
      return getTriangleVertices({ f, g, lambda, A, B })
    } catch (e) {
      return null
    }
  }, [f, g, theta, A, B])

  const triangleProps = useMemo(() => {
    if (!vertices || vertices.length < 3) return null
    return getTriangleProperties(vertices as [Complex, Complex, Complex])
  }, [vertices])

  const [dimensions, setDimensions] = useState({ 
    width: 800, 
    height: 700 
  })

  useEffect(() => {
    const updateDimensions = () => {
      const parent = canvasRef.current?.parentElement
      if (parent) {
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight || 650
        })
      }
    }
    // Run after a short delay to ensure parent layout is complete
    const timer = setTimeout(updateDimensions, 100)
    window.addEventListener('resize', updateDimensions)
    return () => {
      window.removeEventListener('resize', updateDimensions)
      clearTimeout(timer)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX - canvas.width / 2
    const y = canvas.height / 2 - (e.clientY - rect.top) * scaleY
    const mouseNorm = { r: x / A, i: y / B }
    const distF = Math.hypot(mouseNorm.r - fx, mouseNorm.i - fy)
    const distG = Math.hypot(mouseNorm.r - gx, mouseNorm.i - gy)
    if (distF < 0.15) setDragging('f')
    else if (distG < 0.15) setDragging('g')
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX - canvas.width / 2
    const y = canvas.height / 2 - (e.clientY - rect.top) * scaleY
    const nx = Math.max(-0.99, Math.min(0.99, x / A))
    const ny = Math.max(-0.99, Math.min(0.99, y / B))
    if (dragging === 'f') { setFx(nx); setFy(ny) }
    else { setGx(nx); setGy(ny) }
  }

  const handleMouseUp = () => setDragging(null)

  const animate = () => {
    if (isPlaying) {
      setTheta(prev => (prev + speed) % (2 * Math.PI))
    }
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [isPlaying, speed])

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const colors = {
      outer: '#334155',
      inner: '#fb7185',
      triangle: '#8b5cf6',
      vertices: '#f8fafc',
      foci: '#fb7185'
    }

    ctx.beginPath()
    ctx.ellipse(centerX, centerY, A, B, 0, 0, 2 * Math.PI)
    ctx.strokeStyle = colors.outer
    ctx.lineWidth = 2
    ctx.stroke()

    const causticPoints = getInnerConicInfo(f, g, A, B)
    ctx.beginPath()
    causticPoints.forEach((p, i) => {
      const x = centerX + p.r
      const y = centerY - p.i
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.strokeStyle = colors.inner
    ctx.setLineDash([8, 4])
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.setLineDash([])

    const lambda = Complex.fromAngle(theta)
    const params = { f, g, lambda, A, B }

    if (showG || showH || showO || showI) {
      const drawLocus = (locusPoints: Complex[], color: string) => {
        ctx.beginPath()
        locusPoints.forEach((p, i) => {
          const x = centerX + p.r
          const y = centerY - p.i
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      }

      if (showG) drawLocus(getCenterLocus(params, 'G'), '#10b981')
      if (showH) drawLocus(getCenterLocus(params, 'H'), '#f59e0b')
      if (showO) drawLocus(getCenterLocus(params, 'O'), '#06b6d4')
      if (showI) drawLocus(getCenterLocus(params, 'I'), '#ec4899')
    }

    try {
      const vertices = getTriangleVertices(params)
      
      ctx.shadowBlur = 15
      ctx.shadowColor = 'rgba(139, 92, 246, 0.4)'
      ctx.beginPath()
      vertices.forEach((v, i) => {
        const x = centerX + v.r
        const y = centerY - v.i
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.strokeStyle = colors.triangle
      ctx.lineWidth = 4
      ctx.lineJoin = 'round'
      ctx.stroke()
      
      const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, A)
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.1)')
      grad.addColorStop(1, 'rgba(139, 92, 246, 0.02)')
      ctx.fillStyle = grad
      ctx.fill()
      ctx.shadowBlur = 0

      vertices.forEach(v => {
        const x = centerX + v.r
        const y = centerY - v.i
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, 2 * Math.PI)
        ctx.fillStyle = colors.vertices
        ctx.fill()
        ctx.strokeStyle = colors.triangle
        ctx.lineWidth = 2
        ctx.stroke()
      })

      const centers = getTriangleCenters(params)
      const drawCenter = (p: Complex, color: string, label: string) => {
        const x = centerX + p.r
        const y = centerY - p.i
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = colors.vertices
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.fillStyle = color
        ctx.font = 'bold 12px Inter'
        ctx.fillText(label, x + 8, y + 4)
      }

      if (showG) drawCenter(centers.G, '#10b981', 'G')
      if (showH) drawCenter(centers.H, '#f59e0b', 'H')
      if (showO) drawCenter(centers.O, '#06b6d4', 'O')
      if (showI) drawCenter(centers.I, '#ec4899', 'I')

      const alpha = (A + B) / 2
      const beta = (A - B) / 2
      const transformedF = f.mul(new Complex(alpha, 0)).add(f.conj().mul(new Complex(beta, 0)))
      const transformedG = g.mul(new Complex(alpha, 0)).add(g.conj().mul(new Complex(beta, 0)))

      const drawFocus = (p: Complex, label: string) => {
        const x = centerX + p.r
        const y = centerY - p.i
        ctx.beginPath()
        ctx.arc(x, y, 4.5, 0, 2 * Math.PI)
        ctx.fillStyle = colors.foci
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgba(251, 113, 133, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = colors.vertices
        ctx.font = 'bold 12px Inter'
        ctx.fillText(label, x + 10, y + 4)
      }
      drawFocus(transformedF, 'f')
      drawFocus(transformedG, 'g')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    draw()
  }, [f, g, A, B, theta, dimensions])

  return (
    <div className="demo-card">
      <div className="demo-canvas-container">
        <canvas 
          ref={canvasRef} 
          width={dimensions.width} 
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: dragging ? 'grabbing' : 'crosshair' }}
        />
        <div className="demo-hud">
          <span>λ = {(theta / Math.PI).toFixed(2)}π</span>
          <span>A = {A}, B = {B}</span>
        </div>
      </div>
      
      <WorkbenchSidebar 
        fx={fx} setFx={setFx}
        fy={fy} setFy={setFy}
        gx={gx} setGx={setGx}
        gy={gy} setGy={setGy}
        A={A} setA={setA}
        B={B} setB={setB}
        isPlaying={isPlaying} setIsPlaying={setIsPlaying}
        speed={speed} setSpeed={setSpeed}
        theta={theta} setTheta={setTheta}
        showG={showG} setShowG={setShowG}
        showH={showH} setShowH={setShowH}
        showO={showO} setShowO={setShowO}
        showI={showI} setShowI={setShowI}
        triangleProps={triangleProps}
        onApplyMilestone={(m) => {
          setFx(m.params.fx)
          setFy(m.params.fy)
          setGx(m.params.gx)
          setGy(m.params.gy)
        }}
      />
    </div>
  )
}
