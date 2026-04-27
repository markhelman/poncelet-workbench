import { Play, Pause, RotateCcw, Settings, Activity, Target, Minimize2, CircleDot, BarChart3, Flag, BookOpen } from 'lucide-react'
import { useState } from 'react'
import type { Milestone } from '../milestones'
import { MILESTONES } from '../milestones'
import TheorySlideshow from './TheorySlideshow'

interface WorkbenchSidebarProps {
  // Foci
  fx: number; setFx: (v: number) => void;
  fy: number; setFy: (v: number) => void;
  gx: number; setGx: (v: number) => void;
  gy: number; setGy: (v: number) => void;
  
  // Outer Ellipse
  A: number; setA: (v: number) => void;
  B: number; setB: (v: number) => void;
  
  // Animation
  isPlaying: boolean; setIsPlaying: (v: boolean) => void;
  speed: number; setSpeed: (v: number) => void;
  theta: number; setTheta: (v: number) => void;
  
  // Centers
  showG: boolean; setShowG: (v: boolean) => void;
  showH: boolean; setShowH: (v: boolean) => void;
  showO: boolean; setShowO: (v: boolean) => void;
  showI: boolean; setShowI: (v: boolean) => void;
  
  // Properties (Analysis)
  triangleProps: {
    sideA: number;
    sideB: number;
    sideC: number;
    perimeter: number;
    area: number;
  } | null;
  vertices: {r: number, i: number}[] | null;
  centers: { G: {r: number, i: number}, H: {r: number, i: number}, O: {r: number, i: number}, I: {r: number, i: number} } | null;

  // Presets
  onApplyMilestone: (m: Milestone) => void;
}

type Tab = 'milestones' | 'controls' | 'analysis' | 'theory'

export function WorkbenchSidebar({
  fx, setFx, fy, setFy, gx, setGx, gy, setGy,
  A, setA, B, setB,
  isPlaying, setIsPlaying, speed, setSpeed, theta, setTheta,
  showG, setShowG, showH, setShowH, showO, setShowO, showI, setShowI,
  triangleProps, vertices, centers,
  onApplyMilestone
}: WorkbenchSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('controls')

  return (
    <div className="demo-controls">
      <nav className="sidebar-tabs">
        <button 
          className={activeTab === 'milestones' ? 'active' : ''} 
          onClick={() => setActiveTab('milestones')}
          title="Milestones"
        >
          <Flag size={20} />
          <span>Milestones</span>
        </button>
        <button 
          className={activeTab === 'controls' ? 'active' : ''} 
          onClick={() => setActiveTab('controls')}
          title="Controls"
        >
          <Settings size={20} />
          <span>Controls</span>
        </button>
        <button 
          className={activeTab === 'analysis' ? 'active' : ''} 
          onClick={() => setActiveTab('analysis')}
          title="Analysis"
        >
          <BarChart3 size={20} />
          <span>Analysis</span>
        </button>
        <button 
          className={activeTab === 'theory' ? 'active' : ''} 
          onClick={() => setActiveTab('theory')}
          title="Theory"
        >
          <BookOpen size={20} />
          <span>Theory</span>
        </button>
      </nav>

      <div className="tab-content">
        {activeTab === 'milestones' && (
          <div className="demo-section">
            <header><Flag size={16}/> Milestones</header>
            <p className="section-help">Preset configurations and saved states for guided discovery.</p>
            <div className="milestones-list">
              {MILESTONES.map(m => (
                <button 
                  key={m.id} 
                  className="milestone-card"
                  onClick={() => onApplyMilestone(m)}
                >
                  <div className="milestone-title">{m.title}</div>
                  <div className="milestone-desc">{m.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <>
            <div className="demo-section">
              <header><Target size={16}/> Foci</header>
              <div className="slider-stack">
                <div className="slider-row">
                  <label>f.x</label>
                  <input type="range" min="-0.95" max="0.95" step="0.01" value={fx} onChange={e => setFx(parseFloat(e.target.value))} />
                </div>
                <div className="slider-row">
                  <label>f.y</label>
                  <input type="range" min="-0.95" max="0.95" step="0.01" value={fy} onChange={e => setFy(parseFloat(e.target.value))} />
                </div>
                <div className="slider-row">
                  <label>g.x</label>
                  <input type="range" min="-0.95" max="0.95" step="0.01" value={gx} onChange={e => setGx(parseFloat(e.target.value))} />
                </div>
                <div className="slider-row">
                  <label>g.y</label>
                  <input type="range" min="-0.95" max="0.95" step="0.01" value={gy} onChange={e => setGy(parseFloat(e.target.value))} />
                </div>
              </div>
            </div>

            <div className="demo-section">
              <header><Minimize2 size={16}/> Outer Ellipse</header>
              <div className="slider-stack">
                <div className="slider-row">
                  <label>A</label>
                  <input type="range" min="100" max="300" step="1" value={A} onChange={e => setA(parseInt(e.target.value))} />
                </div>
                <div className="slider-row">
                  <label>B</label>
                  <input type="range" min="100" max="300" step="1" value={B} onChange={e => setB(parseInt(e.target.value))} />
                </div>
              </div>
            </div>

            <div className="demo-section">
              <header><Activity size={16}/> Animation</header>
              <div className="stat-item mini">
                <span className="stat-label">λ</span>
                <span className="stat-value">{(theta / Math.PI).toFixed(2)}π</span>
              </div>
              <div className="button-group">
                <button className="icon-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={20}/> : <Play size={20}/>}
                </button>
                <button className="icon-btn" onClick={() => setTheta(0)}><RotateCcw size={20}/></button>
              </div>
              <div className="slider-row">
                <label>Speed</label>
                <input type="range" min="0.001" max="0.05" step="0.001" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} />
              </div>
            </div>

            <div className="demo-section">
              <header><CircleDot size={16}/> Centers</header>
              <div className="button-group horizontal">
                <button 
                  className={showG ? 'active' : ''} 
                  onClick={() => setShowG(!showG)}
                  style={{ borderColor: showG ? '#10b981' : '', backgroundColor: showG ? 'rgba(16, 185, 129, 0.1)' : '' }}
                >
                  G
                </button>
                <button 
                  className={showH ? 'active' : ''} 
                  onClick={() => setShowH(!showH)}
                  style={{ borderColor: showH ? '#f59e0b' : '', backgroundColor: showH ? 'rgba(245, 158, 11, 0.1)' : '' }}
                >
                  H
                </button>
                <button 
                  className={showO ? 'active' : ''} 
                  onClick={() => setShowO(!showO)}
                  style={{ borderColor: showO ? '#06b6d4' : '', backgroundColor: showO ? 'rgba(6, 182, 212, 0.1)' : '' }}
                >
                  O
                </button>
                <button 
                  className={showI ? 'active' : ''} 
                  onClick={() => setShowI(!showI)}
                  style={{ borderColor: showI ? '#ec4899' : '', backgroundColor: showI ? 'rgba(236, 72, 153, 0.1)' : '' }}
                >
                  I
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analysis' && (
          <div className="demo-section">
            <header><BarChart3 size={16}/> Analysis</header>
            <button 
              className="export-btn"
              onClick={() => {
                const data = {
                    ...vertices?.reduce((acc, v, i) => ({...acc, [`w${i+1}`]: `${v.r.toFixed(2)},${v.i.toFixed(2)}`}), {}),
                    ...centers && Object.entries(centers).reduce((acc, [k, v]) => ({...acc, [k]: `${v.r.toFixed(2)},${v.i.toFixed(2)}`}), {})
                };
                const csv = "data:text/csv;charset=utf-8," + Object.entries(data).map(([k, v]) => `${k},${v}`).join("\n");
                const encodedUri = encodeURI(csv);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "poncelet_data.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Export CSV
            </button>
            {triangleProps ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Area</span>
                  <span className="stat-value">{triangleProps.area.toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Perimeter</span>
                  <span className="stat-value">{triangleProps.perimeter.toFixed(2)}</span>
                </div>
              </div>
            ) : null}
            
            <div className="demo-section">
              <header>Vertices & Centers</header>
              <table className="stats-table" style={{ width: '100%', fontSize: '0.85rem' }}>
                <thead><tr><th>Pt</th><th>x</th><th>y</th></tr></thead>
                <tbody>
                  {vertices && vertices.map((v, i) => (
                    <tr key={`v${i}`}><td>w{i+1}</td><td>{v.r.toFixed(2)}</td><td>{v.i.toFixed(2)}</td></tr>
                  ))}
                  {centers && Object.entries(centers).map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v.r.toFixed(2)}</td><td>{v.i.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="demo-section">
            <header><BookOpen size={16}/> Theory</header>
            <TheorySlideshow onStateChange={console.log} />
          </div>
        )}
      </div>
    </div>
  )
}
