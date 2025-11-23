import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Trash2, Square, Circle, RefreshCcw, Plus, Grid, Minus, MousePointer2, 
  Layers, Eye, EyeOff, Eraser, Group, Hand, ZoomIn, ZoomOut, Maximize, 
  PenTool, Edit3, Undo, Redo, Combine, MousePointerClick, Check,
  Copy, Clipboard, PaintBucket, Scaling, Type, RotateCw, Calculator, Move,
  Download, FileImage, Printer, X, Ruler, FileJson, FolderOpen, Image as ImageIcon,
  Magnet, Lock, Unlock, ChevronsUp, ChevronUp, ChevronDown, ChevronsDown,
  Target 
} from 'lucide-react';

// --- Helper Components ---
const ZoomButton = ({ onClick, title, children }) => (
  <button 
    onClick={onClick} 
    title={title}
    className="no-print"
    style={{
      backgroundColor: '#ffffff',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem',
      color: '#4b5563'
    }}
  >
    {children}
  </button>
);

// Tuval üzerinde açılan mini düzenleme penceresi (Düzenleme Modu için)
const FloatingEditor = ({ position, length, angle, onSave, onCancel }) => {
  const [l, setL] = useState(length);
  const [a, setA] = useState(angle);

  return (
    <div className="no-print" style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      backgroundColor: 'white',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
      border: '1px solid #e5e7eb',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      minWidth: '180px'
    }}>
      <h4 style={{margin:0, fontSize:'0.75rem', color:'#374151', borderBottom:'1px solid #eee', paddingBottom:'4px'}}>Kenar Düzenle</h4>
      <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
        <label style={{fontSize:'0.7rem', width:'30px'}}>Uzunluk:</label>
        <input type="number" step="0.1" value={l} onChange={e => setL(e.target.value)} style={{width:'60px', padding:'2px', border:'1px solid #ddd', borderRadius:'3px'}} />
        <span style={{fontSize:'0.7rem'}}>cm</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
        <label style={{fontSize:'0.7rem', width:'30px'}}>Açı:</label>
        <input type="number" step="1" value={a} onChange={e => setA(e.target.value)} style={{width:'60px', padding:'2px', border:'1px solid #ddd', borderRadius:'3px'}} />
        <span style={{fontSize:'0.7rem'}}>°</span>
      </div>
      <div style={{display:'flex', gap:'0.5rem', marginTop:'0.25rem'}}>
        <button onClick={() => onSave(l, a)} style={{flex:1, backgroundColor:'#2563eb', color:'white', border:'none', borderRadius:'3px', padding:'4px', cursor:'pointer', fontSize:'0.7rem'}}>Uygula</button>
        <button onClick={onCancel} style={{flex:1, backgroundColor:'#f3f4f6', color:'#374151', border:'1px solid #d1d5db', borderRadius:'3px', padding:'4px', cursor:'pointer', fontSize:'0.7rem'}}>İptal</button>
      </div>
    </div>
  );
};

// Çizim sırasındaki Canlı Giriş HUD'u (Sağ Alt Köşede Stabil Durur)
const LivePolyInput = ({ position, values, activeField }) => {
    return (
        <div className="no-print" style={{
            // Konum: Container'ın sağ alt köşesine sabitlenir (ekran koordinatları)
            position: 'absolute',
            bottom: '2rem', 
            right: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            padding: '0.5rem', 
            borderRadius: '0.4rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #bfdbfe',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem', 
            pointerEvents: 'none', 
            minWidth: '150px' 
        }}>
            <h4 style={{margin:0, fontSize:'0.75rem', fontWeight:'bold', color:'#2563eb', borderBottom:'1px solid #e5e7eb', paddingBottom:'4px'}}>KLAVYE GİRİŞİ</h4>
            <div style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
                <span style={{fontSize:'0.65rem', fontWeight:'bold', color: activeField === 'length' ? '#2563eb' : '#6b7280', width:'15px'}}>L:</span>
                <div style={{
                    backgroundColor: activeField === 'length' ? '#eff6ff' : '#f9fafb',
                    border: activeField === 'length' ? '1px solid #3b82f6' : '1px solid #d1d5db',
                    borderRadius: '3px', 
                    padding: '2px 6px', 
                    flex: 1,
                    fontSize: '0.75rem', 
                    color: '#1f2937',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    transition: 'all 0.1s'
                }}>
                    {values.length || '0.0'} <span style={{fontSize:'0.6rem', color:'#9ca3af', fontWeight:'normal'}}>cm</span>
                </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'0.4rem'}}>
                <span style={{fontSize:'0.65rem', fontWeight:'bold', color: activeField === 'angle' ? '#2563eb' : '#6b7280', width:'15px'}}>A:</span>
                <div style={{
                    backgroundColor: activeField === 'angle' ? '#eff6ff' : '#f9fafb',
                    border: activeField === 'angle' ? '1px solid #3b82f6' : '1px solid #d1d5db',
                    borderRadius: '3px', 
                    padding: '2px 6px', 
                    flex: 1,
                    fontSize: '0.75rem', 
                    color: '#1f2937',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    transition: 'all 0.1s'
                }}>
                    {values.angle || '0'} <span style={{fontSize:'0.6rem', color:'#9ca3af', fontWeight:'normal'}}>°</span>
                </div>
            </div>
            <div style={{fontSize:'0.65rem', color:'#6b7280', marginTop:'4px', borderTop:'1px solid #e5e7eb', paddingTop:'4px', display:'flex', justifyContent:'space-between', fontWeight:'500'}}>
                <span>TAB: Geçiş | ENTER: Ekle</span>
            </div>
        </div>
    );
}

// v9.5 - Move Tool Implementation (Pan-like movement for selected objects)
const App = () => {
  
  // --- CONSTANTS ---
  const CM_TO_PX = 37.8; 
  const WORKSPACE_SIZE_CM = 10000; 
  const SNAP_GRID_CM = 10; // 10 cm'lik ızgara
  const POINT_RADIUS_PX = 8; // Noktanın varsayılan görsel yarıçapı (World units)

  // --- INIT & REFS ---
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null); // File Input Reference for JSON Load
  
  // --- STATE ---
  // History System
  const [history, setHistory] = useState([[]]); 
  const [historyStep, setHistoryStep] = useState(0); 

  // Shapes & Selection
  const [shapes, setShapes] = useState([]); 
  const [selectedShapeIds, setSelectedShapeIds] = useState([]); 
  const [clipboard, setClipboard] = useState([]); 

  // Eraser Highlighting
  const [hoveredShapeId, setHoveredShapeId] = useState(null);

  // Layer Editing State
  const [editingLayerId, setEditingLayerId] = useState(null);
  const [editNameValue, setEditNameValue] = useState("");

  // Viewport
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); 
  const [scale, setScale] = useState(0.05); 

  // Modes & Inputs
  const [mode, setMode] = useState('select'); // select, rect, circle, line, polyline, eraser, pan, fill, scale, text, move, dimension, point, angular_dimension
  const [activeTab, setActiveTab] = useState('create'); 
  const [showExportMenu, setShowExportMenu] = useState(false); 
  const [showRotationHandle, setShowRotationHandle] = useState(false); 
  const [dimPreviewPos, setDimPreviewPos] = useState(null); 
  const [isGridSnapEnabled, setIsGridSnapEnabled] = useState(false); 
  
  // Drawing Interaction
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [activePolyline, setActivePolyline] = useState([]); 
  const [activeDimension, setActiveDimension] = useState({ p1: null, p2: null }); 
  const [isDraggingShape, setIsDraggingShape] = useState(false);
  const [isRotatingShape, setIsRotatingShape] = useState(false); 
  
  // ** NEW: Angular Dimension State **
  const [showAngle, setShowAngle] = useState(true); // Açı gösterimini kontrol eder

  // Polyline Input State
  const [polyInput, setPolyInput] = useState({ length: '', angle: '' });
  const [activeInputField, setActiveInputField] = useState('length'); // 'length' | 'angle'
  
  // Store the last mouse screen position for non-SVG live input rendering (Keep, but only for HUD component)
  const [liveInputScreenPos, setLiveInputScreenPos] = useState({ x: 0, y: 0 });

  // On-Canvas Editor State
  const [editingSegment, setEditingSegment] = useState(null); 

  // Refs for interaction
  const lastMousePos = useRef({ x: 0, y: 0 }); // Screen coordinates
  const lastWorldPos = useRef({ x: 0, y: 0 }); // World coordinates (snapped if enabled)
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 }); 
  const dragItem = useRef(null); 
  const rotateCenter = useRef({ x: 0, y: 0 }); 

  // Tool Inputs
  const [rectWidth, setRectWidth] = useState(4);
  const [rectHeight, setRectHeight] = useState(3);
  const [radiusMin, setRadiusMin] = useState(2.0);
  const [radiusMax, setRadiusMax] = useState(2.0);
  const [lineLength, setLineLength] = useState(5);
  const [penWidth, setPenWidth] = useState(2);
  const [angle, setAngle] = useState(0); 
  const [arcDegree, setArcDegree] = useState(90); 
  const [color, setColor] = useState('#3b82f6');
  const [scaleDenominator, setScaleDenominator] = useState(1);
  
  // Quick Arc Inputs
  const [quickRadius, setQuickRadius] = useState(270);

  // Text Tool Inputs
  const [textContent, setTextContent] = useState('Metin');
  const [fontSize, setFontSize] = useState(40);

  // Rotation State (Temporary for UI)
  const [rotationValue, setRotationValue] = useState(0);

  // --- HISTORY MANAGER ---
  const updateShapesWithHistory = (newShapes, addToHistory = true) => {
    setShapes(newShapes);
    if (addToHistory) {
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(newShapes);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setHistoryStep(prevStep);
      setShapes(history[prevStep]);
      setSelectedShapeIds([]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setHistoryStep(nextStep);
      setShapes(history[nextStep]);
      setSelectedShapeIds([]);
    }
  };

  // Sync UI rotation slider with selected shape
  useEffect(() => {
      if (selectedShapeIds.length === 1) {
          const s = shapes.find(sh => sh.id === selectedShapeIds[0]);
          if (s) setRotationValue(s.rotation || 0);
      } else {
          setRotationValue(0);
      }
  }, [selectedShapeIds, shapes]);

  // --- KEYBOARD SHORTCUTS (GENERAL & DRAWING) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ** Polyline Drawing Inputs **
      if (mode === 'polyline' && activePolyline.length > 1) {
          // Numbers & Decimal Point
          if (/^[0-9.]$/.test(e.key)) {
              setPolyInput(prev => ({ ...prev, [activeInputField]: prev[activeInputField] + e.key }));
              return;
          }
          // Backspace
          if (e.key === 'Backspace') {
              setPolyInput(prev => ({ ...prev, [activeInputField]: prev[activeInputField].slice(0, -1) }));
              return;
          }
          // Tab (Switch field)
          if (e.key === 'Tab') {
              e.preventDefault();
              setActiveInputField(prev => prev === 'length' ? 'angle' : 'length');
              return;
          }
          // Enter (Commit point)
          if (e.key === 'Enter') {
              e.preventDefault();
              // Trigger adding the current preview point as a real point
              const currentPreviewPoint = activePolyline[activePolyline.length - 1];
              const fixedPoints = activePolyline.slice(0, -1);
              // Add the current preview point as fixed, and add a new duplicate for next preview
              setActivePolyline([...fixedPoints, currentPreviewPoint, currentPreviewPoint]);
              // Reset inputs
              setPolyInput({ length: '', angle: '' });
              setActiveInputField('length');
              return;
          }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedShapeIds.length > 0) {
          const selected = shapes.filter(s => selectedShapeIds.includes(s.id));
          setClipboard(selected);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipboard.length > 0) {
           handlePaste();
        }
      }
      // Delete shortcut
      if (e.key === 'Delete' || e.key === 'Backspace') {
          if (selectedShapeIds.length > 0 && mode === 'select') {
              deleteSelectedShapes();
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeIds, shapes, clipboard, mode, activePolyline, activeInputField, polyInput]);

  // İlk Yükleme
  useEffect(() => {
    const oldScript = document.getElementById('tailwindcss-script');
    if (oldScript) oldScript.remove();
    
    if (containerRef.current) {
      setPanOffset({ 
        x: containerRef.current.clientWidth / 2, 
        y: containerRef.current.clientHeight / 2 
      });
      setShapes([]);
    }
  }, []);

  // --- GEOMETRY HELPERS ---
  const getWorldMousePos = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - panOffset.x) / scale,
      y: (e.clientY - rect.top - panOffset.y) / scale
    };
  };
  
  // Converts World (SVG) coordinates to Screen (Container) coordinates
  const worldToScreen = (p) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
        x: p.x * scale + panOffset.x + rect.left,
        y: p.y * scale + panOffset.y + rect.top
    };
  };

  const getSnappedPos = (pos) => {
    if (!isGridSnapEnabled) return pos;
    const snapPx = SNAP_GRID_CM * CM_TO_PX;
    return {
      x: Math.round(pos.x / snapPx) * snapPx,
      y: Math.round(pos.y / snapPx) * snapPx
    };
  };

  const getWorldCenterPos = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const center = {
      x: ((containerRef.current.clientWidth / 2) - panOffset.x) / scale,
      y: ((containerRef.current.clientHeight / 2) - panOffset.y) / scale
    };
    return isGridSnapEnabled ? getSnappedPos(center) : center;
  };

  const pxToCmDisplay = (px) => (px / CM_TO_PX).toFixed(1);

  const getSegmentLengthCm = (p1, p2) => {
      const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      return (dist / CM_TO_PX);
  };

  const getSegmentAngle = (p1, p2) => {
      const dy = p2.y - p1.y;
      const dx = p2.x - p1.x;
      let theta = Math.atan2(dy, dx); 
      theta *= 180 / Math.PI; 
      return theta;
  };

  const getPolylineLength = (points) => {
    if (!points || points.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  const getPolygonArea = (points) => {
    if (!points || points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    // Calculate area in cm^2 then convert to m^2
    const areaPx2 = Math.abs(area / 2);
    const areaCm2 = areaPx2 / (CM_TO_PX * CM_TO_PX);
    return areaCm2 / 10000; // m2
  };

  const calculateShapeArea = (s) => {
      if (!s.visible) return 0;
      
      if (s.type === 'rect') {
          const wCm = s.width / CM_TO_PX;
          const hCm = s.height / CM_TO_PX;
          return (wCm * hCm) / 10000; // m2
      }
      if (s.type === 'circle') {
          if (s.arcDegree && s.arcDegree < 360) return 0;
          const rCm = s.radius / CM_TO_PX;
          return (Math.PI * rCm * rCm) / 10000; // m2
      }
      if (s.type === 'polyline') {
          return getPolygonArea(s.points);
      }
      return 0;
  };

  const totalArea = shapes.reduce((acc, s) => acc + calculateShapeArea(s), 0);

  const getShapeCenter = (s) => {
    if (s.type === 'rect') {
      return { x: s.x + s.width / 2, y: s.y + s.height / 2 };
    } else if (s.type === 'circle' || s.type === 'text' || s.type === 'dimension' || s.type === 'angular_dimension' || s.type === 'point') { 
      return { x: s.x, y: s.y };
    } else if (s.type === 'line') {
      return { 
        x: s.x + (Math.cos(s.angle * Math.PI / 180) * s.length) / 2,
        y: s.y + (Math.sin(s.angle * Math.PI / 180) * s.length) / 2
      };
    } else if (s.type === 'polyline' && s.points && s.points.length > 0) {
       const xs = s.points.map(p => p.x);
       const ys = s.points.map(p => p.y);
       const w = Math.max(...xs);
       const h = Math.max(...ys);
       return { x: s.x + w / 2, y: s.y + h / 2 };
    }
    return { x: s.x, y: s.y };
  };

  // --- EXPORT / IMPORT FUNCTIONS ---
  
  const handleSaveJSON = () => {
      const projectData = {
          version: "9.5",
          timestamp: Date.now(),
          shapes: shapes,
          viewport: { pan: panOffset, scale: scale }
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `geocanvas_proje_${Date.now()}.json`);
      document.body.appendChild(downloadAnchorNode); 
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setShowExportMenu(false);
  };

  const handleLoadJSON = (event) => {
      const fileReader = new FileReader();
      const file = event.target.files[0];
      
      if (!file) return;

      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = e => {
          try {
              const content = JSON.parse(e.target.result);
              if (content.shapes && Array.isArray(content.shapes)) {
                  if (shapes.length > 0 && !window.confirm("Mevcut proje silinecek ve yeni proje yüklenecek. Devam etmek istiyor musunuz?")) {
                      return;
                  }
                  
                  updateShapesWithHistory(content.shapes);
                  if (content.viewport) {
                      setPanOffset(content.viewport.pan);
                      setScale(content.viewport.scale);
                  }
              } else {
                  alert("Geçersiz proje dosyası formatı.");
              }
          } catch (err) {
              alert("Dosya okuma hatası: " + err.message);
          }
      };
      event.target.value = '';
      setShowExportMenu(false);
  };

  const handleExportImage = (format = 'png') => {
    if (!svgRef.current || !containerRef.current) return;
    setShowExportMenu(false);
    
    const scaleFactor = 4;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svgClone = svgRef.current.cloneNode(true);
    svgClone.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgClone.setAttribute("width", width * scaleFactor);
    svgClone.setAttribute("height", height * scaleFactor);
    
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const mimeType = format === 'jpeg' ? "image/jpeg" : "image/png";
      const extension = format === 'jpeg' ? "jpg" : "png";
      const quality = format === 'jpeg' ? 0.9 : 1.0;

      const imageDataUrl = canvas.toDataURL(mimeType, quality);
      const downloadLink = document.createElement("a");
      downloadLink.download = `geocanvas_proje_${Date.now()}.${extension}`;
      downloadLink.href = imageDataUrl;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrintPDF = () => {
      setShowExportMenu(false);
      window.print();
  };

  // --- Z-INDEX & LOCKING FUNCTIONS ---
  const handleLockToggle = (id) => {
      const newShapes = shapes.map(s => s.id === id ? { ...s, locked: !s.locked } : s);
      updateShapesWithHistory(newShapes);
  };

  const lockSelected = () => {
      const newShapes = shapes.map(s => selectedShapeIds.includes(s.id) ? { ...s, locked: true } : s);
      updateShapesWithHistory(newShapes);
  };

  const unlockSelected = () => {
      const newShapes = shapes.map(s => selectedShapeIds.includes(s.id) ? { ...s, locked: false } : s);
      updateShapesWithHistory(newShapes);
  };

  const moveZIndex = (direction) => {
      if (selectedShapeIds.length === 0) return;
      let newShapes = [...shapes];
      
      if (direction === 'front') {
          const selected = newShapes.filter(s => selectedShapeIds.includes(s.id));
          const unselected = newShapes.filter(s => !selectedShapeIds.includes(s.id));
          newShapes = [...unselected, ...selected];
      } else if (direction === 'back') {
          const selected = newShapes.filter(s => selectedShapeIds.includes(s.id));
          const unselected = newShapes.filter(s => !selectedShapeIds.includes(s.id));
          newShapes = [...selected, ...unselected];
      } else if (direction === 'forward') {
          if(selectedShapeIds.length === 1) {
              const id = selectedShapeIds[0];
              const idx = newShapes.findIndex(s => s.id === id);
              if(idx < newShapes.length - 1) {
                  const temp = newShapes[idx];
                  newShapes[idx] = newShapes[idx+1];
                  newShapes[idx+1] = temp;
              }
          }
      } else if (direction === 'backward') {
          if(selectedShapeIds.length === 1) {
              const id = selectedShapeIds[0];
              const idx = newShapes.findIndex(s => s.id === id);
              if(idx > 0) {
                  const temp = newShapes[idx];
                  newShapes[idx] = newShapes[idx-1];
                  newShapes[idx-1] = temp;
              }
          }
      }
      
      updateShapesWithHistory(newShapes);
  };

  // --- LAYER MANAGEMENT FUNCTIONS ---

  const startLayerRename = (e, id, currentName) => {
      e.stopPropagation();
      setEditingLayerId(id);
      setEditNameValue(currentName);
  };

  const saveLayerRename = (e, id) => {
      e.stopPropagation();
      if (editNameValue.trim()) {
          const newShapes = shapes.map(s => s.id === id ? { ...s, name: editNameValue } : s);
          updateShapesWithHistory(newShapes);
      }
      setEditingLayerId(null);
  };

  const cancelLayerRename = (e) => {
      e.stopPropagation();
      setEditingLayerId(null);
  };

  const moveLayerStep = (e, id, direction) => {
      e.stopPropagation();
      const index = shapes.findIndex(s => s.id === id);
      if (index === -1) return;
      
      const newShapes = [...shapes];
      
      if (direction === 'up' && index < newShapes.length - 1) {
          [newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]];
          updateShapesWithHistory(newShapes);
      } else if (direction === 'down' && index > 0) {
          [newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]];
          updateShapesWithHistory(newShapes);
      }
  };
  
  // Fonksiyon: Belirli bir id'ye sahip nesneyi siler (Katman panelinde kullanılır)
  const deleteShapeById = (e, id) => {
      e.stopPropagation();
      const shapeToDelete = shapes.find(s => s.id === id);
      
      if (!shapeToDelete) return;

      if (shapeToDelete.locked) {
          alert(`"${shapeToDelete.name}" kilitli olduğu için silinemedi.`);
          return;
      }
      
      if (window.confirm(`"${shapeToDelete.name}" nesnesini silmek istiyor musunuz?`)) {
          const newShapes = shapes.filter(s => s.id !== id);
          updateShapesWithHistory(newShapes);
          setSelectedShapeIds(prev => prev.filter(sid => sid !== id));
      }
  };

  // --- ACTIONS ---

  const addShape = (type, extra = {}) => {
    const pos = getWorldCenterPos(); 
    const newShape = {
      id: Date.now(),
      name: `${type === 'rect' ? 'Dikdörtgen' : type === 'circle' ? 'Daire' : type === 'text' ? 'Metin' : type === 'dimension' ? 'Ölçü' : type === 'angular_dimension' ? 'Açılı Ölçü' : type === 'point' ? 'Nokta' : 'Çizgi'} ${shapes.length + 1}`,
      type,
      x: pos.x,
      y: pos.y,
      color,
      visible: true,
      locked: false, 
      rotation: 0, 
      strokeWidth: 2,
      ...extra
    };
    
    if (type === 'rect') {
        newShape.x -= extra.width / 2;
        newShape.y -= extra.height / 2;
        if(isGridSnapEnabled) {
             const snapped = getSnappedPos({x: newShape.x, y: newShape.y});
             newShape.x = snapped.x;
             newShape.y = snapped.y;
        }
    } else if (type === 'point') {
        // Noktalar için varsayılan görünüm ayarları
        newShape.color = '#059669'; // Yeşil nokta
        newShape.radius = POINT_RADIUS_PX; 
    }

    updateShapesWithHistory([...shapes, newShape]);
    setSelectedShapeIds([newShape.id]);
  };

  const deleteSelectedShapes = () => {
    if (selectedShapeIds.length === 0) return;
    
    const lockedCount = shapes.filter(s => selectedShapeIds.includes(s.id) && s.locked).length;
    if(lockedCount > 0) {
        alert(`${lockedCount} nesne kilitli olduğu için silinemedi.`);
    }

    const shapesToDelete = shapes.filter(s => selectedShapeIds.includes(s.id) && !s.locked);
    
    if (shapesToDelete.length === 0) return;

    if (window.confirm(`${shapesToDelete.length} nesneyi silmek istiyor musunuz?`)) {
        const newShapes = shapes.filter(s => !shapesToDelete.some(del => del.id === s.id));
        updateShapesWithHistory(newShapes);
        setSelectedShapeIds([]);
    }
  };

  const mergeSelectedShapes = () => {
      if (selectedShapeIds.length < 2) {
          alert("Birleştirmek için en az 2 nesne seçmelisiniz.");
          return;
      }
      alert("Gruplama işlemi için görsel birleştirme yapıldı.");
  };

  const handleCopy = () => {
    if (selectedShapeIds.length === 0) return;
    const selected = shapes.filter(s => selectedShapeIds.includes(s.id));
    setClipboard(selected);
  };

  const handlePaste = () => {
      if (clipboard.length === 0) return;
      
      const OFFSET = isGridSnapEnabled ? (SNAP_GRID_CM * CM_TO_PX) : (20 / scale); 
      const newShapes = clipboard.map((s, i) => ({
          ...s,
          id: Date.now() + i, 
          name: `${s.name} (Kopya)`,
          x: s.x + OFFSET,
          y: s.y + OFFSET,
          locked: false 
      }));

      updateShapesWithHistory([...shapes, ...newShapes]);
      setSelectedShapeIds(newShapes.map(s => s.id));
  };

  const handleScale = () => {
      if (selectedShapeIds.length === 0) return;
      
      const denominator = parseFloat(scaleDenominator);
      if (!denominator || denominator === 0) {
          alert("Geçersiz payda değeri.");
          return;
      }

      const factor = 1 / denominator;
      if (factor <= 0) return;

      const newShapes = shapes.map(s => {
          if (selectedShapeIds.includes(s.id) && !s.locked) { 
              const changes = {};
              if (s.type === 'rect') {
                  changes.width = s.width * factor;
                  changes.height = s.height * factor;
              } else if (s.type === 'circle') {
                  changes.radius = s.radius * factor;
              } else if (s.type === 'line') {
                  changes.length = s.length * factor;
              } else if (s.type === 'polyline') {
                  changes.points = s.points.map(p => ({
                      x: p.x * factor,
                      y: p.y * factor
                  }));
              } else if (s.type === 'text') {
                  changes.fontSize = s.fontSize * factor;
              } else if (s.type === 'point') {
                  // Noktaları ölçekleme, görünürlük yarıçapını sabit tut.
              }
              return { ...s, ...changes };
          }
          return s;
      });

      updateShapesWithHistory(newShapes);
  };

  const handleRotationChange = (val) => {
      setRotationValue(val);
      const newShapes = shapes.map(s => {
          if (selectedShapeIds.includes(s.id) && !s.locked) { 
              return { ...s, rotation: Number(val) };
          }
          return s;
      });
      setShapes(newShapes);
  };

  const commitRotation = () => {
      updateShapesWithHistory(shapes, true);
  }

  const applySegmentEdit = (newLengthCm, newAngleDeg) => {
      if (!editingSegment) return;
      const { shapeId, pointIndex } = editingSegment;
      
      const newShapes = shapes.map(shape => {
          if (shape.id !== shapeId || shape.type !== 'polyline') return shape;
          if (shape.locked) return shape;

          const points = [...shape.points];
          if (pointIndex >= points.length - 1) return shape;

          const p1 = points[pointIndex];
          
          const lengthPx = parseFloat(newLengthCm) * CM_TO_PX;
          const angleRad = parseFloat(newAngleDeg) * (Math.PI / 180);

          const newP2x = p1.x + lengthPx * Math.cos(angleRad);
          const newP2y = p1.y + lengthPx * Math.sin(angleRad);

          const shiftX = newP2x - points[pointIndex + 1].x;
          const shiftY = newP2y - points[pointIndex + 1].y;

          for (let i = pointIndex + 1; i < points.length; i++) {
              points[i] = {
                  x: points[i].x + shiftX,
                  y: points[i].y + shiftY
              };
          }
          return { ...shape, points };
      });

      updateShapesWithHistory(newShapes);
      setEditingSegment(null);
  };

  const finishPolyline = () => {
    if (activePolyline.length > 1) {
       const finalPoints = activePolyline.slice(0, -1); 
       if (finalPoints.length < 2) {
           setActivePolyline([]);
           setPolyInput({length:'', angle:''});
           return;
       }

       const first = finalPoints[0];
       const last = finalPoints[finalPoints.length - 1];
       const dist = Math.sqrt(Math.pow(first.x - last.x, 2) + Math.pow(first.y - last.y, 2));
       
       let isClosed = false;
       if (dist < 20 / scale) {
           finalPoints[finalPoints.length - 1] = { x: first.x, y: first.y };
           isClosed = true;
       }

       const xs = finalPoints.map(p => p.x);
       const ys = finalPoints.map(p => p.y);
       const minX = Math.min(...xs);
       const minY = Math.min(...ys);
       
       const relativePoints = finalPoints.map(p => ({ x: p.x - minX, y: p.y - minY }));
       const length = getPolylineLength(finalPoints);
       
       const newShape = {
        id: Date.now(),
        name: isClosed ? `Alan` : `Çizgi (${pxToCmDisplay(length)}cm)`,
        type: 'polyline',
        x: minX,
        y: minY,
        points: relativePoints,
        color: color,
        visible: true,
        locked: false,
        rotation: 0,
        strokeWidth: penWidth,
        isClosed: isClosed
       };
       
       updateShapesWithHistory([...shapes, newShape]);
       setSelectedShapeIds([newShape.id]);
    }
    setActivePolyline([]);
    setPolyInput({length:'', angle:''});
  };

  // --- DIMENSION RENDERING HELPER ---
  const renderDimensionShape = (p1, p2, textPos, isPreview = false, styleColor = color, showAngleDisplay = false) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.sqrt(dx*dx + dy*dy);
      if (length < 0.001) return null;

      const angleRad = Math.atan2(dy, dx);
      let angleDeg = angleRad * 180 / Math.PI;
      if (angleDeg < 0) angleDeg += 360;

      const u = { x: dx/length, y: dy/length };
      const v = { x: textPos.x - p1.x, y: textPos.y - p1.y };
      const proj = v.x * u.x + v.y * u.y;
      const projPoint = { x: p1.x + u.x * proj, y: p1.y + u.y * proj };
      const distVec = { x: textPos.x - projPoint.x, y: textPos.y - projPoint.y };
      
      const p1Ext = { x: p1.x + distVec.x, y: p1.y + distVec.y };
      const p2Ext = { x: p2.x + distVec.x, y: p2.y + distVec.y };
      const arrowSize = 10 / scale;
      const arrowAngle = Math.PI / 6;

      const renderArrow = (tip, direction) => {
         const a1 = { 
             x: tip.x - arrowSize * Math.cos(direction - arrowAngle), 
             y: tip.y - arrowSize * Math.sin(direction - arrowAngle) 
         };
         const a2 = { 
             x: tip.x - arrowSize * Math.cos(direction + arrowAngle), 
             y: tip.y - arrowSize * Math.sin(direction + arrowAngle) 
         };
         return `M ${tip.x} ${tip.y} L ${a1.x} ${a1.y} L ${a2.x} ${a2.y} Z`;
      };

      const lenCm = (length / CM_TO_PX).toFixed(1);
      const midX = (p1Ext.x + p2Ext.x) / 2;
      const midY = (p1Ext.y + p2Ext.y) / 2;

      let textRot = angleRad * 180 / Math.PI;
      if (textRot > 90) textRot -= 180;
      if (textRot < -90) textRot += 180;
      
      const angleDisplay = showAngleDisplay ? ` / ${Math.round(angleDeg)}°` : '';
      const displayContent = `${lenCm} cm${angleDisplay}`;

      return (
          <g pointerEvents="none">
              <line x1={p1.x} y1={p1.y} x2={p1Ext.x} y2={p1Ext.y} stroke={styleColor} strokeWidth={1/scale} opacity={0.5} />
              <line x1={p2.x} y1={p2.y} x2={p2Ext.x} y2={p2Ext.y} stroke={styleColor} strokeWidth={1/scale} opacity={0.5} />
              <line x1={p1Ext.x} y1={p1Ext.y} x2={p2Ext.x} y2={p2Ext.y} stroke={styleColor} strokeWidth={1.5/scale} />
              <path d={renderArrow(p1Ext, angleRad)} fill={styleColor} />
              <path d={renderArrow(p2Ext, angleRad + Math.PI)} fill={styleColor} />
              <g transform={`translate(${midX}, ${midY}) rotate(${textRot})`}>
                  <rect x={-20/scale} y={-12/scale} width={(40/scale + (showAngleDisplay ? 20/scale : 0))} height={24/scale} fill="white" opacity={0.8} rx={2/scale} />
                  <text x={0} y={0} dominantBaseline="middle" textAnchor="middle" fontSize={12/scale} fill={styleColor} fontWeight="bold">
                      {displayContent}
                  </text>
              </g>
          </g>
      );
  };

  // --- INTERACTION HANDLERS ---

  const handleMouseDown = (e, shape = null) => {
    const rawWorldPos = getWorldMousePos(e);
    const worldPos = getSnappedPos(rawWorldPos);
    lastWorldPos.current = worldPos;
    
    if (e.button === 2) {
       if (mode === 'polyline') {
           finishPolyline();
           return;
       }
       if (mode === 'dimension' || mode === 'angular_dimension') {
           setActiveDimension({ p1: null, p2: null });
           setDimPreviewPos(null);
           return;
       }
    }

    if (mode === 'pan' || e.button === 1) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }
    
    // Point Mode Click Handler
    if (mode === 'point' && e.button === 0) {
        e.stopPropagation();
        addShape('point', { x: worldPos.x, y: worldPos.y });
        return;
    }

    // Dimension Tool Handler (Axis-locked)
    if (mode === 'dimension' && e.button === 0) {
        e.stopPropagation();
        if (!activeDimension.p1) {
            setActiveDimension({ ...activeDimension, p1: worldPos });
        } else if (!activeDimension.p2) {
            const dx = Math.abs(worldPos.x - activeDimension.p1.x);
            const dy = Math.abs(worldPos.y - activeDimension.p1.y);
            let snappedPos = { ...worldPos };
            if (dx > dy) snappedPos.y = activeDimension.p1.y;
            else snappedPos.x = activeDimension.p1.x;
            setActiveDimension({ ...activeDimension, p2: snappedPos });
            setDimPreviewPos(null);
        } else {
            const newShape = {
                id: Date.now(),
                name: `Ölçü ${shapes.length + 1}`,
                type: 'dimension',
                p1: activeDimension.p1,
                p2: activeDimension.p2,
                textPos: worldPos,
                color: color,
                visible: true,
                locked: false,
                rotation: 0
            };
            updateShapesWithHistory([...shapes, newShape]);
            setActiveDimension({ p1: null, p2: null });
            setSelectedShapeIds([newShape.id]);
        }
        return;
    }
    
    // Angular Dimension Tool Handler (Free Angle)
    if (mode === 'angular_dimension' && e.button === 0) {
        e.stopPropagation();
        if (!activeDimension.p1) {
            setActiveDimension({ ...activeDimension, p1: worldPos });
        } else if (!activeDimension.p2) {
            setActiveDimension({ ...activeDimension, p2: worldPos });
            // Bu aşamada metin konumunu fareye sabitliyoruz, 3. tıklama ile onaylanacak
            setDimPreviewPos(worldPos); 
        } else {
            const newShape = {
                id: Date.now(),
                name: `Açılı Ölçü ${shapes.length + 1}`,
                type: 'angular_dimension',
                p1: activeDimension.p1,
                p2: activeDimension.p2,
                textPos: worldPos, // Final text position
                color: color,
                visible: true,
                locked: false,
                rotation: 0
            };
            updateShapesWithHistory([...shapes, newShape]);
            setActiveDimension({ p1: null, p2: null });
            setDimPreviewPos(null);
            setSelectedShapeIds([newShape.id]);
        }
        return;
    }

    if (mode === 'move') {
        if (e.button === 0 && selectedShapeIds.length > 0) {
             const isAnyLocked = shapes.some(s => selectedShapeIds.includes(s.id) && s.locked);
             if(!isAnyLocked) {
                setIsDraggingShape(true);
                lastMousePos.current = { x: e.clientX, y: e.clientY };
                dragStartPos.current = { x: e.clientX, y: e.clientY };
             }
             return;
        }
    }

    if (mode === 'eraser') {
        if (shape) { 
            e.stopPropagation();
            if (shape.locked) {
                alert("Bu nesne kilitli!");
                return;
            }
            // Silgi artık tüm nesnelerde (dimension ve angular_dimension dahil) çalışacak
            const newShapes = shapes.filter(s => s.id !== shape.id);
            updateShapesWithHistory(newShapes);
            setHoveredShapeId(null);
        }
        return;
    }

    if (mode === 'fill') {
        if (shape) {
            e.stopPropagation();
            if (shape.locked) return;
            const newShapes = shapes.map(s => s.id === shape.id ? {...s, color: color} : s);
            updateShapesWithHistory(newShapes);
        }
        return;
    }

    if (mode === 'text' && e.button === 0) {
        e.stopPropagation();
        const newShape = {
          id: Date.now(),
          name: `Metin ${shapes.length + 1}`,
          type: 'text',
          x: worldPos.x,
          y: worldPos.y,
          text: textContent,
          fontSize: Number(fontSize),
          color,
          visible: true,
          locked: false,
          rotation: 0
        };
        updateShapesWithHistory([...shapes, newShape]);
        setSelectedShapeIds([newShape.id]);
        return;
    }

    if (mode === 'polyline' && e.button === 0) {
        e.stopPropagation();
        if (activePolyline.length === 0) {
            setActivePolyline([worldPos, worldPos]);
        } else {
            // Click commits the current preview point
            const currentPreviewPoint = activePolyline[activePolyline.length - 1];
            const fixedPoints = activePolyline.slice(0, -1);
            
            // Add the current point as fixed, and add a NEW duplicate for the next preview segment
            setActivePolyline([...fixedPoints, currentPreviewPoint, currentPreviewPoint]);
            
            // Reset Inputs
            setPolyInput({length: '', angle: ''});
            setActiveInputField('length');
        }
        return;
    }

    if (mode === 'select' || mode === 'scale') {
        if (shape && e.button === 0) {
            e.stopPropagation();
            if (e.shiftKey) {
                if (selectedShapeIds.includes(shape.id)) {
                    setSelectedShapeIds(prev => prev.filter(id => id !== shape.id));
                } else {
                    setSelectedShapeIds(prev => [...prev, shape.id]);
                }
            } else {
                if (!selectedShapeIds.includes(shape.id)) {
                    setSelectedShapeIds([shape.id]);
                }
            }

            if (!shape.locked) {
                setIsDraggingShape(true);
                dragStartPos.current = { x: e.clientX, y: e.clientY };
                dragItem.current = shape.id; 
                dragOffset.current = { x: worldPos.x - shape.x, y: worldPos.y - shape.y };
            }
            return;
        } else {
             if (!isRotatingShape && !e.shiftKey) {
                setSelectedShapeIds([]);
                setEditingSegment(null);
            }
            if(!isRotatingShape) {
                setIsPanning(true);
                lastMousePos.current = { x: e.clientX, y: e.clientY };
            }
        }
    }
  };

  const handleRotateMouseDown = (e, shape) => {
      e.stopPropagation();
      if(shape.locked) return;
      setIsRotatingShape(true);
      dragItem.current = shape.id;
      rotateCenter.current = getShapeCenter(shape);
  }

  const handleMouseMove = (e) => {
    // 1. Update mouse screen position (for LivePolyInput HUD)
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
        setLiveInputScreenPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }

    const rawWorldPos = getWorldMousePos(e);
    const worldPos = getSnappedPos(rawWorldPos);
    
    if (mode === 'polyline' && activePolyline.length > 0) {
        // Calculate the new position for the preview point (last point in activePolyline)
        const newPoints = [...activePolyline];
        const fixedPoint = newPoints[newPoints.length - 2];
        
        // Default: follow mouse
        let nextX = worldPos.x;
        let nextY = worldPos.y;

        // If inputs exist, constrain the point
        if (polyInput.length || polyInput.angle) {
             // Calculate mouse vector stats first
             const dx = worldPos.x - fixedPoint.x;
             const dy = worldPos.y - fixedPoint.y;
             const mouseDist = Math.sqrt(dx*dx + dy*dy);
             const mouseAngRad = Math.atan2(dy, dx);

             let targetDistPx = mouseDist;
             let targetAngRad = mouseAngRad;

             // Lock length if input exists
             if (polyInput.length && !isNaN(parseFloat(polyInput.length))) {
                 targetDistPx = parseFloat(polyInput.length) * CM_TO_PX;
             }

             // Lock angle if input exists
             if (polyInput.angle && !isNaN(parseFloat(polyInput.angle))) {
                 targetAngRad = parseFloat(polyInput.angle) * (Math.PI / 180);
             }

             nextX = fixedPoint.x + targetDistPx * Math.cos(targetAngRad);
             nextY = fixedPoint.y + targetDistPx * Math.sin(targetAngRad);
        }

        newPoints[newPoints.length - 1] = { x: nextX, y: nextY };
        setActivePolyline(newPoints);
    }
    
    if ((mode === 'dimension' || mode === 'angular_dimension') && activeDimension.p1) {
        // This is only used for the 2nd click to determine the end point in Dimension tool,
        // and for the 3rd click (text position) in both Dimension and Angular Dimension tools.
        // We set dimPreviewPos to the real mouse pos to drive the preview.
        setDimPreviewPos(rawWorldPos);
    }

    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }
    
    if (isRotatingShape && dragItem.current) {
        const center = rotateCenter.current;
        const deltaX = rawWorldPos.x - center.x;
        const deltaY = rawWorldPos.y - center.y;
        let angleDeg = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
        if (angleDeg < 0) angleDeg += 360;
        
        setRotationValue(Math.round(angleDeg));
        setShapes(prev => prev.map(s => s.id === dragItem.current ? { ...s, rotation: angleDeg } : s));
        return;
    }

    if (isDraggingShape && (mode === 'move' || mode === 'select' || mode === 'scale') && selectedShapeIds.length > 0 && !isRotatingShape) {
        const dx = worldPos.x - lastWorldPos.current.x;
        const dy = worldPos.y - lastWorldPos.current.y;

        if (dx !== 0 || dy !== 0) {
            setShapes(prev => prev.map(s => {
                if (selectedShapeIds.includes(s.id) && !s.locked) {
                    if (s.type === 'dimension' || s.type === 'angular_dimension') {
                         // Dimensions move based on their control points
                         return { ...s, p1: {x: s.p1.x + dx, y: s.p1.y + dy}, p2: {x: s.p2.x + dx, y: s.p2.y + dy}, textPos: {x: s.textPos.x + dx, y: s.textPos.y + dy} };
                    }
                    else if (s.type === 'polyline') {
                        return { ...s, x: s.x + dx, y: s.y + dy, points: s.points };
                    }
                    return { ...s, x: s.x + dx, y: s.y + dy };
                }
                return s;
            }));
            lastWorldPos.current = worldPos;
        }
        return;
    }
  };

  const handleMouseUp = (e) => {
    if (isDraggingShape || isRotatingShape) {
        const dist = Math.sqrt(Math.pow(e.clientX - dragStartPos.current.x, 2) + Math.pow(e.clientY - dragStartPos.current.y, 2));
        if (dist > 2) { 
             updateShapesWithHistory(shapes, true);
        }
    }
    
    setIsPanning(false);
    setIsDraggingShape(false);
    setIsRotatingShape(false);
    dragItem.current = null;
  };

  const handleContextMenu = (e) => {
      e.preventDefault();
      if(mode === 'polyline') finishPolyline();
      if(mode === 'dimension' || mode === 'angular_dimension') {
          setActiveDimension({ p1: null, p2: null });
          setDimPreviewPos(null);
      }
  };

  // --- STYLE OBJECTS ---
  const styles = {
    container: { display: 'flex', height: '100vh', width: '100%', backgroundColor: '#f9fafb', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', color: '#111827', userSelect: 'none' },
    sidebar: { width: '320px', minWidth: '320px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', zIndex: 50, boxShadow: '4px 0 10px rgba(0,0,0,0.05)' },
    header: { padding: '1.25rem', borderBottom: '1px solid #f3f4f6' },
    title: { fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 },
    tabBar: { display: 'flex', borderBottom: '1px solid #e5e7eb' },
    content: { padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    toolGroup: { display: 'flex', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '0.5rem', flexWrap: 'wrap', gap: '4px' },
    settingsBox: { backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #dbeafe', display: 'flex', flexDirection: 'column', gap: '1rem' },
    canvasContainer: { flex: 1, backgroundColor: '#e5e5e5', position: 'relative', overflow: 'hidden', isolation: 'isolate' },
    infoBar: { position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '0.75rem', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none', zIndex: 10 },
    zoomControls: { position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10 },
    summaryBox: { marginTop: 'auto', padding: '1rem', backgroundColor: '#f0fdf4', borderTop: '1px solid #bbf7d0' }
  };

  const getTabStyle = (isActive) => ({ flex: 1, padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', color: isActive ? '#2563eb' : '#6b7280', border: 'none', backgroundColor: 'transparent', borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent' });
  const getToolBtnStyle = (isActive) => ({ flex: 1, minWidth: '40px', padding: '0.5rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', backgroundColor: isActive ? '#ffffff' : 'transparent', color: isActive ? '#2563eb' : '#6b7280', boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none', transition: 'all 0.2s' });

  return (
    <div style={styles.container} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      
      {/* --- CSS FOR PRINTING --- */}
      <style>{`
        @media print {
           .no-print { display: none !important; }
           body { background: white; }
           ::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* HIDDEN FILE INPUT FOR LOADING JSON */}
      <input 
         type="file" 
         ref={fileInputRef} 
         style={{display:'none'}} 
         accept=".json" 
         onChange={handleLoadJSON} 
      />

      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar} className="no-print">
        {/* ... (Sidebar Header) ... */}
        <div style={styles.header}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <h1 style={styles.title}><Grid size={20} color="#2563eb" /> GeoCanvas v9.5</h1>
             <div style={{position:'relative'}}>
                 <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    title="Kaydet / Dışa Aktar"
                    style={{backgroundColor:'#f3f4f6', border:'none', padding:'0.4rem', borderRadius:'0.25rem', cursor:'pointer', color:'#374151'}}
                 >
                    <Download size={20} />
                 </button>
                 {showExportMenu && (
                     <div style={{
                         position:'absolute', top:'100%', right:0, marginTop:'0.5rem', 
                         backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'0.375rem', 
                         boxShadow:'0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex:100, width:'180px', overflow:'hidden'
                     }}>
                         <div style={{padding:'0.5rem', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                             <span style={{fontSize:'0.75rem', fontWeight:'bold', color:'#374151'}}>Dışa Aktar</span>
                             <button onClick={()=>setShowExportMenu(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={14}/></button>
                         </div>
                         <div style={{padding:'0.5rem', fontSize:'0.7rem', fontWeight:'bold', color:'#9ca3af', backgroundColor:'#f9fafb'}}>Proje Dosyası</div>
                         <button onClick={handleSaveJSON} style={{display:'flex', alignItems:'center', gap:'0.5rem', width:'100%', padding:'0.5rem 0.75rem', border:'none', background:'white', cursor:'pointer', textAlign:'left', fontSize:'0.85rem', color:'#4b5563', borderBottom:'1px solid #f3f4f6'}} onMouseEnter={(e)=>e.target.style.backgroundColor='#f9fafb'} onMouseLeave={(e)=>e.target.style.backgroundColor='white'}><FileJson size={16} /><span>Projeyi Kaydet (.json)</span></button>
                         <button onClick={() => fileInputRef.current.click()} style={{display:'flex', alignItems:'center', gap:'0.5rem', width:'100%', padding:'0.5rem 0.75rem', border:'none', background:'white', cursor:'pointer', textAlign:'left', fontSize:'0.85rem', color:'#4b5563', borderBottom:'1px solid #f3f4f6'}} onMouseEnter={(e)=>e.target.style.backgroundColor='#f9fafb'} onMouseLeave={(e)=>e.target.style.backgroundColor='white'}><FolderOpen size={16} /><span>Proje Aç (.json)</span></button>
                         <div style={{padding:'0.5rem', fontSize:'0.7rem', fontWeight:'bold', color:'#9ca3af', backgroundColor:'#f9fafb'}}>Görsel Çıktı</div>
                         <button onClick={() => handleExportImage('png')} style={{display:'flex', alignItems:'center', gap:'0.5rem', width:'100%', padding:'0.5rem 0.75rem', border:'none', background:'white', cursor:'pointer', textAlign:'left', fontSize:'0.85rem', color:'#4b5563', borderBottom:'1px solid #f3f4f6'}} onMouseEnter={(e)=>e.target.style.backgroundColor='#f9fafb'} onMouseLeave={(e)=>e.target.style.backgroundColor='white'}><FileImage size={16} /><span>PNG Olarak İndir</span></button>
                         <button onClick={() => handleExportImage('jpeg')} style={{display:'flex', alignItems:'center', gap:'0.5rem', width:'100%', padding:'0.5rem 0.75rem', border:'none', background:'white', cursor:'pointer', textAlign:'left', fontSize:'0.85rem', color:'#4b5563', borderBottom:'1px solid #f3f4f6'}} onMouseEnter={(e)=>e.target.style.backgroundColor='#f9fafb'} onMouseLeave={(e)=>e.target.style.backgroundColor='white'}><ImageIcon size={16} /><span>JPEG Olarak İndir</span></button>
                         <button onClick={handlePrintPDF} style={{display:'flex', alignItems:'center', gap:'0.5rem', width:'100%', padding:'0.5rem 0.75rem', border:'none', background:'white', cursor:'pointer', textAlign:'left', fontSize:'0.85rem', color:'#4b5563'}} onMouseEnter={(e)=>e.target.style.backgroundColor='#f9fafb'} onMouseLeave={(e)=>e.target.style.backgroundColor='white'}><Printer size={16} /><span>PDF Olarak Kaydet</span></button>
                     </div>
                 )}
             </div>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.5rem'}}>
              <span style={{fontSize:'0.75rem', color:'#6b7280'}}>Pro Sürüm</span>
              <div style={{display:'flex', gap:'0.25rem'}}>
                  <button onClick={handleUndo} disabled={historyStep === 0} title="Geri Al" style={{background:'none', border:'none', cursor:'pointer', opacity: historyStep===0?0.3:1}}><Undo size={16} /></button>
                  <button onClick={handleRedo} disabled={historyStep === history.length-1} title="İleri Al" style={{background:'none', border:'none', cursor:'pointer', opacity: historyStep===history.length-1?0.3:1}}><Redo size={16} /></button>
              </div>
          </div>
        </div>
        
        <div style={styles.tabBar}>
          <button style={getTabStyle(activeTab === 'create')} onClick={() => setActiveTab('create')}><Plus size={16} /> Araçlar</button>
          <button style={getTabStyle(activeTab === 'layers')} onClick={() => setActiveTab('layers')}><Layers size={16} /> Katmanlar</button>
        </div>

        <div style={styles.content}>
          {activeTab === 'create' ? (
            <>
              <div style={styles.toolGroup}>
                 <button style={getToolBtnStyle(mode === 'select')} onClick={() => setMode('select')} title="Seçim"><MousePointerClick size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'move')} onClick={() => setMode('move')} title="Taşıma"><Move size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'scale')} onClick={() => setMode('scale')} title="Ölçek"><Scaling size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'dimension')} onClick={() => setMode('dimension')} title="Ölçü (Yatay/Dikey)"><Ruler size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'angular_dimension')} onClick={() => setMode('angular_dimension')} title="Açılı Ölçü (Eğimli)"><RotateCw size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'point')} onClick={() => setMode('point')} title="Nokta"><Target size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'rect')} onClick={() => setMode('rect')} title="Kutu"><Square size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'circle')} onClick={() => setMode('circle')} title="Daire"><Circle size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'line')} onClick={() => setMode('line')} title="Çizgi"><Minus size={18} style={{transform:'rotate(45deg)'}} /></button>
                 <button style={getToolBtnStyle(mode === 'polyline')} onClick={() => {setMode('polyline'); setActivePolyline([]);}} title="Kalem"><PenTool size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'text')} onClick={() => setMode('text')} title="Metin"><Type size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'fill')} onClick={() => setMode('fill')} title="Boya"><PaintBucket size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'eraser')} onClick={() => setMode('eraser')} title="Silgi"><Eraser size={18} /></button>
                 <button style={getToolBtnStyle(mode === 'pan')} onClick={() => setMode('pan')} title="Kaydır"><Hand size={18} /></button>
                 <button style={{...getToolBtnStyle(isGridSnapEnabled), color: isGridSnapEnabled ? '#ef4444' : '#6b7280'}} onClick={() => setIsGridSnapEnabled(!isGridSnapEnabled)} title="Mıknatıs"><Magnet size={18} /></button>
              </div>

              <div style={styles.settingsBox}>
                 {mode === 'angular_dimension' && (
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                        <p style={{fontSize:'0.75rem', color:'#6b7280', fontWeight:'bold'}}>Açılı Ölçü Aracı Aktif</p>
                        <p style={{fontSize:'0.75rem', color:'#6b7280'}}>1. Tık: Başlangıç, 2. Tık: Bitiş, 3. Tık: Konum.</p>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'0.5rem', borderBottom:'1px solid #dbeafe'}}>
                            <label style={{fontSize:'0.7rem', fontWeight:'700', display:'flex', alignItems:'center', gap:'4px'}}>Açı Gösterimi</label>
                            <button 
                                onClick={() => setShowAngle(!showAngle)}
                                style={{fontSize:'0.65rem', padding:'2px 6px', borderRadius:'4px', border: '1px solid ' + (showAngle ? '#10b981' : '#d1d5db'), backgroundColor: showAngle ? '#ecfdf5' : 'white', color: showAngle ? '#10b981' : '#6b7280', cursor:'pointer'}}
                            >
                                {showAngle ? 'AÇIK' : 'KAPALI'}
                            </button>
                        </div>
                        <div style={{marginTop:'0.5rem', paddingTop:'0.5rem', borderTop:'1px solid #e5e7eb'}}>
                            <label style={{fontSize:'0.7rem', fontWeight:'700'}}>Çizim Rengi</label>
                            <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:'100%', height:'30px', border:'none', cursor:'pointer'}} />
                        </div>
                    </div>
                 )}

                 {mode === 'dimension' && (
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                        <p style={{fontSize:'0.75rem', color:'#6b7280'}}>1. Tık: Başlangıç, 2. Tık: Bitiş (Eksen Kilitli), 3. Tık: Konum</p>
                        <div style={{marginTop:'0.5rem', paddingTop:'0.5rem', borderTop:'1px solid #e5e7eb'}}>
                            <label style={{fontSize:'0.7rem', fontWeight:'700'}}>Ölçü Rengi</label>
                            <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:'100%', height:'30px', border:'none', cursor:'pointer'}} />
                        </div>
                    </div>
                 )}
                 
                 {mode === 'point' && (
                     <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                        <p style={{fontSize:'0.75rem', color:'#6b7280', fontWeight:'bold'}}>Nokta Aracı Aktif</p>
                        <p style={{fontSize:'0.75rem', color:'#6b7280'}}>Tuvale tıklayarak koordinat noktası yerleştirin.</p>
                     </div>
                 )}

                 {mode === 'select' && (
                     <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                         <p style={{fontSize:'0.75rem', color:'#6b7280'}}>Seçim modundasınız. Shift ile çoklu seçim yapabilirsiniz.</p>
                         
                         <div style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem'}}>
                            <button onClick={handleCopy} disabled={selectedShapeIds.length===0} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', padding:'0.5rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem'}}><Copy size={14}/> Kopyala</button>
                            <button onClick={handlePaste} disabled={clipboard.length===0} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', padding:'0.5rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem'}}><Clipboard size={14}/> Yapıştır</button>
                         </div>

                         {selectedShapeIds.length > 0 && (
                             <>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #dbeafe', paddingBottom:'0.5rem'}}>
                                    <span style={{fontSize:'0.8rem', fontWeight:'bold', color:'#2563eb'}}>{selectedShapeIds.length} Nesne Seçili</span>
                                </div>
                                
                                {/* LOCK & ORDER CONTROLS */}
                                <div style={{display:'flex', gap:'0.25rem', marginBottom:'0.5rem', borderBottom:'1px solid #dbeafe', paddingBottom:'0.5rem'}}>
                                    <button onClick={lockSelected} title="Seçilileri Kilitle" style={{flex:1, padding:'0.3rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', display:'flex', justifyContent:'center'}}><Lock size={14}/></button>
                                    <button onClick={unlockSelected} title="Seçililerin Kilidini Aç" style={{flex:1, padding:'0.3rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', display:'flex', justifyContent:'center'}}><Unlock size={14}/></button>
                                    <div style={{width:'1px', backgroundColor:'#e5e7eb', margin:'0 0.25rem'}}></div>
                                    <button onClick={() => moveZIndex('front')} title="En Öne Getir" style={{flex:1, padding:'0.3rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', display:'flex', justifyContent:'center'}}><ChevronsUp size={14}/></button>
                                    <button onClick={() => moveZIndex('forward')} title="Öne Getir" style={{flex:1, padding:'0.3rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', display:'flex', justifyContent:'center'}}><ChevronUp size={14}/></button>
                                    <button onClick={() => moveZIndex('backward')} title="Arkaya Gönder" style={{flex:1, padding:'0.3rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', display:'flex', justifyContent:'center'}}><ChevronDown size={14}/></button>
                                    <button onClick={() => moveZIndex('back')} title="En Arkaya Gönder" style={{flex:1, padding:'0.3rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', display:'flex', justifyContent:'center'}}><ChevronsDown size={14}/></button>
                                </div>

                                {/* ROTATION CONTROLS */}
                                <div style={{padding:'0.5rem 0', borderBottom:'1px solid #dbeafe'}}>
                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <label style={{fontSize:'0.7rem', fontWeight:'700', display:'flex', alignItems:'center', gap:'4px'}}><RotateCw size={12}/> Yön / Döndürme</label>
                                        <button 
                                            onClick={() => setShowRotationHandle(!showRotationHandle)}
                                            style={{fontSize:'0.65rem', padding:'2px 6px', borderRadius:'4px', border: '1px solid ' + (showRotationHandle ? '#2563eb' : '#d1d5db'), backgroundColor: showRotationHandle ? '#eff6ff' : 'white', color: showRotationHandle ? '#2563eb' : '#6b7280', cursor:'pointer'}}
                                        >
                                            {showRotationHandle ? 'Kol Açık' : 'Kol Kapalı'}
                                        </button>
                                    </div>
                                    <div style={{display:'flex', gap:'0.5rem', marginTop:'0.25rem', alignItems:'center'}}>
                                        <input type="range" min="0" max="360" value={rotationValue} onChange={(e) => handleRotationChange(e.target.value)} onMouseUp={commitRotation} style={{flex:1}} />
                                        <input type="number" min="0" max="360" value={Math.round(rotationValue)} onChange={(e) => {handleRotationChange(e.target.value); commitRotation();}} style={{width:'50px', padding:'0.2rem', fontSize:'0.7rem', border:'1px solid #d1d5db', borderRadius:'0.2rem'}} />
                                    </div>
                                </div>

                                <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
                                    <button onClick={mergeSelectedShapes} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', padding:'0.5rem', backgroundColor:'#fff', border:'1px solid #d1d5db', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem'}}><Combine size={14}/> Grupla</button>
                                    <button onClick={deleteSelectedShapes} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', padding:'0.5rem', backgroundColor:'#fff', border:'1px solid #fca5a5', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem', color:'#ef4444'}}><Trash2 size={14}/> Sil</button>
                                </div>
                             </>
                         )}
                     </div>
                 )}

                 {mode === 'move' && (
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                        <p style={{fontSize:'0.75rem', color:'#6b7280'}}>Taşıma Aracı: Seçili nesneleri sürükleyin.</p>
                        {selectedShapeIds.length > 0 ? (
                            <div style={{padding:'0.5rem', backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'0.25rem', color:'#166534', fontSize:'0.75rem', fontWeight:'bold'}}>{selectedShapeIds.length} Nesne Taşınabilir</div>
                        ) : (
                            <div style={{padding:'0.5rem', backgroundColor:'#fff1f2', border:'1px solid #fecdd3', borderRadius:'0.25rem', color:'#be123c', fontSize:'0.75rem', fontWeight:'bold'}}>! Taşımak için nesne seçin</div>
                        )}
                    </div>
                 )}

                 {/* Other modes simplified for brevity, logic remains same */}
                 {mode === 'scale' && (
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                        <label style={{fontSize:'0.7rem', fontWeight:'700'}}>Ölçekle (1/x)</label>
                        <div style={{display:'flex', gap:'0.5rem'}}>
                            <input type="number" value={scaleDenominator} onChange={(e)=>setScaleDenominator(e.target.value)} style={{flex:1, padding:'0.25rem', border:'1px solid #d1d5db', borderRadius:'0.25rem'}} />
                            <button onClick={handleScale} disabled={selectedShapeIds.length === 0} style={{padding:'0.25rem 0.5rem', backgroundColor:'#2563eb', color:'white', border:'none', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem'}}>Uygula</button>
                        </div>
                    </div>
                 )}
                 
                 {(mode === 'rect' || mode === 'circle' || mode === 'line' || mode === 'polyline' || mode === 'text' || mode === 'fill' || mode === 'point') && (
                     <div style={{marginTop:'0.5rem', paddingTop:'0.5rem', borderTop:'1px solid #e5e7eb'}}>
                       {mode === 'text' && (
                           <div style={{marginBottom:'0.5rem'}}>
                               <label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Metin</label>
                               <input type="text" value={textContent} onChange={e => setTextContent(e.target.value)} style={{width:'100%', padding:'0.25rem', border:'1px solid #d1d5db', borderRadius:'0.25rem', marginBottom:'0.25rem'}} />
                               <label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Boyut</label>
                               <input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} style={{width:'100%', padding:'0.25rem', border:'1px solid #d1d5db', borderRadius:'0.25rem', marginBottom:'0.5rem'}} />
                               <button onClick={() => addShape('text', { text: textContent, fontSize: Number(fontSize) })} style={{width:'100%', padding:'0.4rem', backgroundColor:'#2563eb', color:'white', border:'none', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem'}}>Ekle</button>
                           </div>
                       )}
                       
                       {mode === 'circle' && (
                        <>
                         <div style={{display:'flex', gap:'0.5rem'}}>
                           <div style={{flex:1}}><label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Min R (cm)</label><input type="number" value={radiusMin} onChange={e => setRadiusMin(e.target.value)} style={{width:'100%', padding:'0.25rem'}} /></div>
                           <div style={{flex:1}}><label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Max R (cm)</label><input type="number" value={radiusMax} onChange={e => setRadiusMax(e.target.value)} style={{width:'100%', padding:'0.25rem'}} /></div>
                         </div>
                         <div><label style={{fontSize:'0.7rem', fontWeight:'700'}}>Başlangıç Açısı: {angle}°</label><input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} style={{width:'100%'}} /></div>
                         <div><label style={{fontSize:'0.7rem', fontWeight:'700'}}>Yay Genişliği: {arcDegree}°</label><input type="range" min="1" max="360" value={arcDegree} onChange={e => setArcDegree(Number(e.target.value))} style={{width:'100%'}} /></div>
                         <button onClick={() => { const r = radiusMin === radiusMax ? radiusMin : Math.random() * (Number(radiusMax) - Number(radiusMin)) + Number(radiusMin); addShape('circle', { radius: r * CM_TO_PX, angle, arcDegree }); }} style={{width:'100%', padding:'0.5rem', backgroundColor:'#2563eb', color:'white', border:'none', borderRadius:'0.25rem', cursor:'pointer', marginTop:'0.5rem'}}>Ekle</button>
                         
                         {/* Quick Arc Generator */}
                         <div style={{marginTop:'1rem', borderTop:'1px solid #dbeafe', paddingTop:'0.5rem'}}>
                           <label style={{fontSize:'0.7rem', fontWeight:'700', color:'#2563eb'}}>Hızlı Yay Oluşturucu</label>
                           <div style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem', marginTop:'0.25rem'}}>
                               <select 
                                   style={{flex:1, padding:'0.25rem', fontSize:'0.75rem', border:'1px solid #d1d5db', borderRadius:'0.25rem', backgroundColor:'#fff'}}
                                   value={quickRadius}
                                   onChange={(e) => setQuickRadius(Number(e.target.value))}
                               >
                                   {[270, 360, 450, 540, 700, 900].map(r => (
                                       <option key={r} value={r}>
                                           {r === 700 ? "3504 700 cm Yarıçap" : r === 900 ? "5004 900 cm Yarıçap" : `${r} cm Yarıçap`}
                                       </option>
                                   ))}
                               </select>
                           </div>
                           <div style={{display:'flex', gap:'0.25rem', flexWrap:'wrap'}}>
                               {[45, 90, 180, 270, 360].map(deg => (
                                   <button 
                                       key={deg}
                                       onClick={() => {
                                           let shapeColor = color;
                                           if (quickRadius === 360) shapeColor = '#8B4513'; // Kahverengi
                                           else if (quickRadius === 450) shapeColor = '#000000'; // Siyah
                                           
                                           addShape('circle', { 
                                               radius: quickRadius * CM_TO_PX, 
                                               angle: 0, 
                                               arcDegree: deg,
                                               color: shapeColor
                                           });
                                       }}
                                       style={{flex:'1 0 30%', padding:'0.35rem', fontSize:'0.7rem', backgroundColor:'#fff', border:'1px solid #93c5fd', borderRadius:'0.25rem', cursor:'pointer', color:'#2563eb'}}
                                   >
                                       {deg}°
                                   </button>
                               ))}
                           </div>
                         </div>
                       </>
                     )}

                       <label style={{fontSize:'0.7rem', fontWeight:'700'}}>Çizim Rengi</label>
                       <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:'100%', height:'30px', border:'none', cursor:'pointer'}} />
                       {mode === 'rect' && (
                        <>
                            <div style={{display:'flex', gap:'0.5rem'}}>
                            <div style={{flex:1}}><label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Genişlik (cm)</label><input type="number" value={rectWidth} onChange={e=>setRectWidth(e.target.value)} style={{width:'100%', padding:'0.25rem'}} /></div>
                            <div style={{flex:1}}><label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Yükseklik (cm)</label><input type="number" value={rectHeight} onChange={e=>setRectHeight(e.target.value)} style={{width:'100%', padding:'0.25rem'}} /></div>
                            </div>
                            <button onClick={() => addShape('rect', { width: rectWidth * CM_TO_PX, height: rectHeight * CM_TO_PX })} style={{width:'100%', marginTop:'0.5rem', padding:'0.4rem', backgroundColor:'#2563eb', color:'white', border:'none', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem'}}>Kutu Ekle</button>
                        </>
                       )}
                       {mode === 'line' && (
                        <>
                           <div style={{display:'flex', gap:'0.5rem'}}>
                               <div style={{flex:1}}><label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Uzunluk (cm)</label><input type="number" value={lineLength} onChange={e=>setLineLength(e.target.value)} style={{width:'100%', padding:'0.25rem'}} /></div>
                           </div>
                           <div><label style={{fontSize:'0.7rem', fontWeight:'700'}}>Açı: {angle}°</label><input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} style={{width:'100%'}} /></div>
                           <button onClick={() => addShape('line', { length: lineLength * CM_TO_PX, angle })} style={{width:'100%', marginTop:'0.5rem', padding:'0.4rem', backgroundColor:'#2563eb', color:'white', border:'none', borderRadius:'0.25rem', cursor:'pointer', fontSize:'0.75rem'}}>Çizgi Ekle</button>
                        </>
                       )}
                       {mode === 'polyline' && (
                         <>
                            <div style={{display:'flex', gap:'0.5rem'}}>
                                <div style={{flex:1}}><label style={{fontSize:'0.7rem', fontWeight:'700', display:'block'}}>Kalem Kalınlığı (px)</label><input type="number" min="1" max="50" value={penWidth} onChange={e=>setPenWidth(Number(e.target.value))} style={{width:'100%', padding:'0.25rem'}} /></div>
                            </div>
                            <div style={{marginTop:'0.5rem', padding:'0.5rem', backgroundColor:'#fff', borderRadius:'0.25rem', border:'1px solid #e5e7eb', fontSize:'0.7rem'}}>
                                <strong>Toplam Uzunluk:</strong> <span style={{color:'#2563eb'}}>{pxToCmDisplay(getPolylineLength(activePolyline))} cm</span>
                            </div>
                            <p style={{fontSize:'0.7rem', color:'#6b7280', marginTop:'0.25rem'}}>Sol tık: Nokta ekle, Sağ tık: Bitir</p>
                        </>
                       )}
                     </div>
                 )}
              </div>
            </>
          ) : (
            /* LAYERS TAB */
            <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                {shapes.length === 0 && <p style={{textAlign:'center', color:'#9ca3af', fontSize:'0.875rem', marginTop:'2rem'}}>Katman yok.</p>}
                {[...shapes].reverse().map(s => (
                    <div 
                        key={s.id} 
                        onClick={() => {
                            setSelectedShapeIds([s.id]);
                            setMode('select');
                        }}
                        style={{
                            display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem', 
                            backgroundColor: selectedShapeIds.includes(s.id) ? '#eff6ff' : '#fff',
                            border: selectedShapeIds.includes(s.id) ? '1px solid #93c5fd' : '1px solid #e5e7eb',
                            borderRadius:'0.25rem', cursor:'pointer'
                        }}
                    >
                        <button onClick={(e)=>{e.stopPropagation(); const newS = shapes.map(x=>x.id===s.id?{...x, visible:!x.visible}:x); updateShapesWithHistory(newS);}} style={{background:'none', border:'none', cursor:'pointer'}}>{s.visible?<Eye size={14} color="#6b7280"/>:<EyeOff size={14} color="#9ca3af"/>}</button>
                        
                        {editingLayerId === s.id ? (
                            <div style={{flex:1, display:'flex', gap:'4px', alignItems:'center'}}>
                                <input 
                                    type="text" 
                                    value={editNameValue} 
                                    onChange={(e) => setEditNameValue(e.target.value)} 
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => { if(e.key === 'Enter') saveLayerRename(e, s.id); }}
                                    style={{width:'100%', padding:'2px 4px', fontSize:'0.75rem', border:'1px solid #2563eb', borderRadius:'2px'}}
                                    autoFocus
                                />
                                <button onClick={(e)=>saveLayerRename(e, s.id)} style={{border:'none', background:'none', cursor:'pointer', color:'#166534'}}><Check size={14}/></button>
                                <button onClick={cancelLayerRename} style={{border:'none', background:'none', cursor:'pointer', color:'#ef4444'}}><X size={14}/></button>
                            </div>
                        ) : (
                            <span style={{fontSize:'0.75rem', flex:1, color: s.locked ? '#9ca3af' : '#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}} title={s.name}>{s.name}</span>
                        )}
                        
                        {/* Edit Name */}
                        {editingLayerId !== s.id && (
                             <button onClick={(e)=>startLayerRename(e, s.id, s.name)} style={{background:'none', border:'none', cursor:'pointer', opacity:0.6}} title="İsim Değiştir"><Edit3 size={12}/></button>
                        )}

                        {/* Layer Move Up/Down (Inverse logic for visual list) */}
                        <div style={{display:'flex', flexDirection:'column', gap:'0px'}}>
                            <button onClick={(e)=>moveLayerStep(e, s.id, 'up')} style={{background:'none', border:'none', cursor:'pointer', padding:'0'}} title="Yukarı Taşı"><ChevronUp size={10}/></button>
                            <button onClick={(e)=>moveLayerStep(e, s.id, 'down')} style={{background:'none', border:'none', cursor:'pointer', padding:'0'}} title="Aşağı Taşı"><ChevronDown size={10}/></button>
                        </div>

                        {/* Layer Lock Toggle */}
                        <button onClick={(e)=>{e.stopPropagation(); handleLockToggle(s.id);}} style={{background:'none', border:'none', cursor:'pointer'}} title={s.locked ? "Kilidi Aç" : "Kilitle"}>
                            {s.locked ? <Lock size={14} color="#ef4444" /> : <Unlock size={14} color="#d1d5db" />}
                        </button>

                        {/* DELETE BUTTON: Artık deleteShapeById fonksiyonunu çağırıyor */}
                        <button 
                            onClick={(e) => deleteShapeById(e, s.id)} 
                            style={{background:'none', border:'none', cursor: s.locked ? 'not-allowed' : 'pointer', opacity: s.locked ? 0.3 : 1}} 
                            title={s.locked ? "Kilitli olduğu için silinemez" : "Sil"}
                        >
                            <Trash2 size={14} color="#ef4444"/>
                        </button>
                    </div>
                ))}
            </div>
          )}
        </div>

        {/* PROJECT SUMMARY FOOTER */}
        <div style={styles.summaryBox}>
            <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem'}}>
                <Calculator size={16} color="#166534" />
                <span style={{fontSize:'0.75rem', fontWeight:'700', color:'#166534'}}>PROJE ÖZETİ</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#374151'}}>
                <span>Nesne Sayısı:</span>
                <strong>{shapes.length}</strong>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#374151', marginTop:'0.25rem'}}>
                <span>Toplam Alan:</span>
                <strong>{totalArea.toFixed(2)} m²</strong>
            </div>
        </div>
      </div>

      {/* --- MAIN CANVAS --- */}
      <div 
        ref={containerRef} 
        style={{...styles.canvasContainer, cursor: mode === 'eraser' ? 'not-allowed' : mode === 'fill' ? 'crosshair' : mode === 'pan' ? 'grab' : mode === 'text' ? 'text' : mode === 'point' ? 'crosshair' : isRotatingShape ? 'grabbing' : 'default'}}
        onMouseDown={handleMouseDown}
        onWheel={(e) => {
            e.preventDefault();
            const newScale = Math.min(Math.max(0.01, scale - e.deltaY * 0.001), 10);
            setScale(newScale);
        }}
        onContextMenu={handleContextMenu}
      >
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, opacity:0.3, backgroundImage: `radial-gradient(#9ca3af 1px, transparent 1px)`, backgroundSize: `${CM_TO_PX * scale}px ${CM_TO_PX * scale}px`, backgroundPosition: `${panOffset.x}px ${panOffset.y}px` }} />
        
        {/* Info Bar */}
        <div className="no-print" style={{...styles.infoBar, top: 'auto', bottom: '1rem'}}>
            <MousePointer2 size={14} />
            <span>Zoom: {Math.round(scale * 100)}% | Mod: {mode.toUpperCase()} | Seçili: {selectedShapeIds.length}</span>
        </div>

        {/* Zoom Buttons */}
        <div className="no-print" style={styles.zoomControls}>
            <ZoomButton onClick={() => setScale(s => s * 1.2)} title="Yakınlaş"><ZoomIn size={20} /></ZoomButton>
            <ZoomButton onClick={() => {setPanOffset({x:containerRef.current.clientWidth/2, y:containerRef.current.clientHeight/2}); setScale(0.05);}} title="Sıfırla"><Maximize size={20} /></ZoomButton>
            <ZoomButton onClick={() => setScale(s => s / 1.2)} title="Uzaklaş"><ZoomOut size={20} /></ZoomButton>
        </div>

        {/* Floating On-Canvas Editor */}
        {editingSegment && (
            <FloatingEditor 
                position={{ 
                    x: editingSegment.midX * scale + panOffset.x, 
                    y: editingSegment.midY * scale + panOffset.y - 80 // Slightly above
                }}
                length={editingSegment.length}
                angle={Math.round(editingSegment.angle)}
                onSave={applySegmentEdit}
                onCancel={() => setEditingSegment(null)}
            />
        )}
        
        {/* Live Polyline Input (HUD - Right Bottom Corner) */}
        {mode === 'polyline' && activePolyline.length > 0 && (
             (() => {
                const lastPoint = activePolyline[activePolyline.length - 2];
                const mousePoint = activePolyline[activePolyline.length - 1];
                
                const dx = mousePoint.x - lastPoint.x;
                const dy = mousePoint.y - lastPoint.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const angleRad = Math.atan2(dy, dx);
                let angleDeg = angleRad * 180 / Math.PI;
                if (angleDeg < 0) angleDeg += 360;
                
                // Görüntülenecek uzunluk ve açıyı belirle: Klavye girişi varsa onu kullan, yoksa hesaplananı.
                const displayLength = (polyInput.length && !isNaN(parseFloat(polyInput.length))) 
                    ? parseFloat(polyInput.length).toFixed(1) 
                    : (dist / CM_TO_PX).toFixed(1);
                
                const displayAngle = (polyInput.angle && !isNaN(parseFloat(polyInput.angle))) 
                    ? Math.round(parseFloat(polyInput.angle)) 
                    : Math.round(angleDeg);
                
                return (
                    <LivePolyInput 
                        position={{x: 0, y: 0}} // Position is managed by CSS properties (bottom/right)
                        values={{length: displayLength, angle: displayAngle}}
                        activeField={activeInputField}
                    />
                );
             })()
        )}

        {/* SVG Content */}
        <svg ref={svgRef} style={{width:'100%', height:'100%', position:'absolute', top:0, left:0, zIndex:10}}>
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${scale})`}>
                {/* Workspace Boundary */}
                <rect x={-(WORKSPACE_SIZE_CM * CM_TO_PX)/2} y={-(WORKSPACE_SIZE_CM * CM_TO_PX)/2} width={WORKSPACE_SIZE_CM * CM_TO_PX} height={WORKSPACE_SIZE_CM * CM_TO_PX} fill="none" stroke="#d1d5db" strokeWidth={5/scale} strokeDasharray={`${50/scale}`} />
                
                {/* Render Shapes */}
                {shapes.map(s => {
                    if (!s.visible) return null;
                    const isSelected = selectedShapeIds.includes(s.id);
                    const isHoveredForEraser = mode === 'eraser' && hoveredShapeId === s.id;
                    const isMoveTarget = mode === 'move' && isSelected;

                    // Visual styles based on state
                    let finalStrokeColor = isSelected ? '#2563eb' : s.color;
                    let finalStrokeWidth = isSelected ? 4/scale : 2/scale;
                    let strokeDash = undefined;
                    let opacity = 0.5;

                    // Visual indicator for locked shapes when selected
                    if (isSelected && s.locked) {
                        finalStrokeColor = '#ef4444'; // Red selection for locked
                        strokeDash = `${2/scale}`; // Dotted line
                    }

                    if (isHoveredForEraser) {
                        finalStrokeColor = '#ef4444';
                        finalStrokeWidth = 6/scale;
                        strokeDash = `${10/scale}`;
                        opacity = 0.5;
                    } else if (isMoveTarget && !s.locked) {
                        finalStrokeColor = '#f97316'; // Orange for move
                        finalStrokeWidth = 4/scale;
                        strokeDash = `${8/scale}`;
                        opacity = 0.8;
                    } else {
                        opacity = 1;
                    }

                    // Calculate Transform (Rotation around center)
                    let transform = '';
                    let centerX = s.x;
                    let centerY = s.y;

                    if (s.type === 'rect') {
                        centerX = s.x + s.width / 2;
                        centerY = s.y + s.height / 2;
                    } else if (s.type === 'line') {
                         centerX = s.x + (Math.cos(s.angle * Math.PI / 180) * s.length) / 2;
                         centerY = s.y + (Math.sin(s.angle * Math.PI / 180) * s.length) / 2;
                    } else if (s.type === 'polyline') {
                         if (s.points && s.points.length > 0) {
                             const xs = s.points.map(p => p.x);
                             const ys = s.points.map(p => p.y);
                             const w = Math.max(...xs);
                             const h = Math.max(...ys);
                             centerX = s.x + w / 2;
                             centerY = s.y + h / 2;
                             transform = `translate(${s.x}, ${s.y}) rotate(${s.rotation || 0}, ${w/2}, ${h/2})`;
                         }
                    } else if (s.type === 'dimension' || s.type === 'angular_dimension') {
                         // Dimensions need to use a bounding box center for rotation handle placement, 
                         // but they don't move based on x/y properties
                         centerX = (s.p1.x + s.p2.x) / 2;
                         centerY = (s.p1.y + s.p2.y) / 2;
                    } else if (s.type === 'point') { // Point has no rotation
                        centerX = s.x;
                        centerY = s.y;
                    }

                    if (s.type !== 'polyline' && s.rotation) {
                        transform = `rotate(${s.rotation}, ${centerX}, ${centerY})`;
                    }

                    const eventProps = {
                        onMouseEnter: () => mode === 'eraser' && setHoveredShapeId(s.id),
                        onMouseLeave: () => mode === 'eraser' && setHoveredShapeId(null),
                        onMouseDown: (e) => handleMouseDown(e, s)
                    };

                    // --- Shape Render Logic ---
                    let shapeNode = null;
                    if (s.type === 'rect') {
                        const wCm = s.width / CM_TO_PX;
                        const hCm = s.height / CM_TO_PX;
                        const area = (wCm * hCm) / 10000; // m2
                        
                        shapeNode = (
                            <g key={s.id} transform={transform} {...eventProps}>
                                <rect x={s.x} y={s.y} width={s.width} height={s.height} fill={s.color} fillOpacity={0.3} stroke={finalStrokeColor} strokeWidth={finalStrokeWidth} strokeDasharray={strokeDash} opacity={opacity} />
                                {/* Persistent Labels */}
                                <text x={s.x + s.width/2} y={s.y - 10/scale} textAnchor="middle" fontSize={10/scale} fill="#2563eb" fontWeight="bold">{wCm.toFixed(1)} cm</text>
                                <text x={s.x - 10/scale} y={s.y + s.height/2} textAnchor="middle" fontSize={10/scale} fill="#2563eb" fontWeight="bold" transform={`rotate(-90, ${s.x - 10/scale}, ${s.y + s.height/2})`}>{hCm.toFixed(1)} cm</text>
                                <text x={s.x + s.width/2} y={s.y + s.height/2} textAnchor="middle" dominantBaseline="middle" fontSize={12/scale} fill="#374151" fontWeight="bold">{area.toFixed(2)} m²</text>
                                {s.locked && <rect x={s.x} y={s.y} width={16/scale} height={16/scale} fill="transparent"><title>Kilitli</title></rect>} {/* Simple hit area or indicator logic could go here */}
                            </g>
                        );
                    } 
                    // ... (Other shapes similar logic) ...
                    else if (s.type === 'circle') {
                        if (s.arcDegree && s.arcDegree < 360) {
                             // Arc logic...
                             const startRad = (s.angle * Math.PI) / 180;
                             const endRad = ((s.angle + s.arcDegree) * Math.PI) / 180;
                             const x1 = s.radius * Math.cos(startRad);
                             const y1 = s.radius * Math.sin(startRad);
                             const x2 = s.radius * Math.cos(endRad);
                             const y2 = s.radius * Math.sin(endRad);
                             const largeArcFlag = s.arcDegree > 180 ? 1 : 0;
                             // Düz çizgiyi (kirişi) dahil et (L 0 0)
                             const d = `M ${x1} ${y1} A ${s.radius} ${s.radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L 0 0 Z`;
                             const arcTransform = `translate(${s.x}, ${s.y}) rotate(${s.rotation || 0})`;
                             
                             // Kirişin orta noktasını hesapla (x1, y1) ve (x2, y2) arasındaki orta nokta.
                             const midXChord = (x1 + x2) / 2;
                             const midYChord = (y1 + y2) / 2;
                             
                             // ** Özel Model Etiketleme (3504 & 5004) **
                             let labelNode = null;
                             let modelLabel = "";
                             
                             if (Math.abs(s.radius - 700 * CM_TO_PX) < 1) modelLabel = "3504";
                             else if (Math.abs(s.radius - 900 * CM_TO_PX) < 1) modelLabel = "5004";

                             if (modelLabel) { 
                                 const midRad = ((s.angle + s.arcDegree / 2) * Math.PI) / 180;
                                 // Yarıçapın %60'ına yerleştir
                                 const lx = s.radius * 0.6 * Math.cos(midRad);
                                 const ly = s.radius * 0.6 * Math.sin(midRad);
                                 
                                 // Yazı açısını ayarla (okunabilirlik için)
                                 let textRot = (s.angle + s.arcDegree / 2);
                                 if (textRot > 90 && textRot < 270) textRot += 180;
                                 
                                 labelNode = (
                                     <text 
                                         x={lx} 
                                         y={ly} 
                                         textAnchor="middle" 
                                         dominantBaseline="middle" 
                                         fontSize={s.radius / 10} 
                                         fill="#374151" 
                                         fontWeight="bold"
                                         transform={`rotate(${textRot}, ${lx}, ${ly})`}
                                         style={{pointerEvents:'none'}}
                                     >
                                         {modelLabel}
                                     </text>
                                 );
                             }
                             
                             shapeNode = (
                                 <g key={s.id} transform={arcTransform} {...eventProps}>
                                     <path d={d} fill={s.color} fillOpacity={0.3} stroke={finalStrokeColor} strokeWidth={finalStrokeWidth} strokeDasharray={strokeDash} opacity={opacity} />
                                     {labelNode}
                                     {/* Kiriş Orta Noktası İşaretleyici */}
                                     {s.arcDegree <= 180 && ( // Sadece 180 dereceye kadar olan yaylarda göster
                                        <circle 
                                            cx={midXChord} 
                                            cy={midYChord} 
                                            r={4/scale} 
                                            fill={finalStrokeColor} 
                                            stroke="white"
                                            strokeWidth={1/scale}
                                        />
                                     )}
                                 </g>
                             );
                        } else {
                            const rCm = s.radius / CM_TO_PX;
                            const area = (Math.PI * rCm * rCm) / 10000; 
                            shapeNode = (
                                <g key={s.id} transform={transform} {...eventProps}>
                                    <circle cx={s.x} cy={s.y} r={s.radius} fill={s.color} fillOpacity={0.3} stroke={finalStrokeColor} strokeWidth={finalStrokeWidth} strokeDasharray={strokeDash} opacity={opacity} />
                                    <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="middle" fontSize={12/scale} fill="#374151" fontWeight="bold">{area.toFixed(2)} m²</text>
                                </g>
                            );
                        }
                    }
                    else if (s.type === 'line') {
                        const x2 = s.x + Math.cos(s.angle*Math.PI/180)*s.length;
                        const y2 = s.y + Math.sin(s.angle*Math.PI/180)*s.length;
                        const lenCm = s.length / CM_TO_PX;
                        shapeNode = (
                            <g key={s.id} transform={transform} {...eventProps}>
                                <line x1={s.x} y1={s.y} x2={x2} y2={y2} stroke={finalStrokeColor} strokeWidth={finalStrokeWidth} strokeLinecap="round" strokeDasharray={strokeDash} opacity={opacity} />
                                <rect x={(s.x+x2)/2 - 20/scale} y={(s.y+y2)/2 - 10/scale} width={40/scale} height={20/scale} fill="rgba(255,255,255,0.7)" rx={4/scale} />
                                <text x={(s.x+x2)/2} y={(s.y+y2)/2 + 4/scale} textAnchor="middle" fontSize={10/scale} fill="#2563eb" fontWeight="bold">{lenCm.toFixed(1)} cm</text>
                            </g>
                        );
                    }
                    else if (s.type === 'text') {
                        shapeNode = (
                            <text key={s.id} x={s.x} y={s.y} transform={transform} fill={isSelected ? '#2563eb' : s.color} fontSize={s.fontSize} textAnchor="middle" dominantBaseline="middle" style={{userSelect:'none', pointerEvents:'all', cursor: mode==='select' ? 'move' : 'default', opacity: isHoveredForEraser ? 0.5 : 1, fontWeight: isSelected ? 'bold' : 'normal'}} {...eventProps}>
                                {s.text}
                            </text>
                        );
                    }
                    else if (s.type === 'polyline') {
                        const pathD = s.points.map((p, i) => (i===0?`M ${p.x} ${p.y}`:`L ${p.x} ${p.y}`)).join(' ');
                        const area = s.isClosed ? getPolygonArea(s.points) : 0;
                        const cx = s.points.reduce((acc, p) => acc + p.x, 0) / s.points.length;
                        const cy = s.points.reduce((acc, p) => acc + p.y, 0) / s.points.length;

                        shapeNode = (
                            <g key={s.id} transform={transform} {...eventProps}>
                                <path d={pathD} fill={s.isClosed ? s.color : 'none'} fillOpacity={0.3} stroke={finalStrokeColor} strokeWidth={finalStrokeWidth} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeDash} opacity={opacity} />
                                {s.isClosed && (
                                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={12/scale} fill="#374151" fontWeight="bold">{area.toFixed(2)} m²</text>
                                )}
                                {/* Polyline segment labels logic remains but omitted for brevity if unchanged... (actually, better keep it for completeness) */}
                                {s.points.map((p, i) => {
                                    if (i === s.points.length - 1) return null;
                                    const pNext = s.points[i+1];
                                    const midX = (p.x + pNext.x) / 2;
                                    const midY = (p.y + pNext.y) / 2;
                                    const lenCm = getSegmentLengthCm(p, pNext);
                                    
                                    return (
                                        <g key={`seg-${i}`} style={{cursor:'pointer'}} onClick={(e) => { e.stopPropagation(); if (isSelected && !s.locked) { setEditingSegment({ shapeId: s.id, pointIndex: i, midX: midX + s.x, midY: midY + s.y, length: lenCm.toFixed(2), angle: getSegmentAngle(p, pNext) }); } }}>
                                            <rect x={midX - 25/scale} y={midY - 10/scale} width={50/scale} height={20/scale} rx={4/scale} fill="rgba(255, 255, 255, 0.7)" stroke={isSelected ? "#2563eb" : "none"} strokeWidth={1/scale} />
                                            <text x={midX} y={midY + 4/scale} textAnchor="middle" fontSize={9/scale} fill="#2563eb" fontWeight="bold">{lenCm.toFixed(1)} cm</text>
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    } else if (s.type === 'dimension') {
                        // Dimension (Axis-locked ruler)
                        const dimNode = renderDimensionShape(s.p1, s.p2, s.textPos, false, isSelected ? (s.locked ? '#ef4444' : '#2563eb') : s.color);
                        
                        const hitX = (s.p1.x + s.p2.x) / 2;
                        const hitY = (s.p1.y + s.p2.y) / 2;
                        
                        shapeNode = (
                            <g key={s.id} {...eventProps} style={{opacity: isHoveredForEraser ? 0.5 : 1}}>
                                {dimNode}
                                {/* Invisible Hit Target for Selection/Eraser in select/eraser mode */}
                                <circle cx={hitX} cy={hitY} r={20/scale} fill="transparent" strokeWidth={0} style={{pointerEvents: 'all'}}/>
                            </g>
                        );
                    } else if (s.type === 'angular_dimension') {
                        // Angular Dimension (Free Angle ruler)
                        const dimNode = renderDimensionShape(s.p1, s.p2, s.textPos, isSelected ? (s.locked ? false : showAngle) : showAngle, isSelected ? (s.locked ? '#ef4444' : '#10b981') : s.color, showAngle);
                        
                        const hitX = (s.p1.x + s.p2.x) / 2;
                        const hitY = (s.p1.y + s.p2.y) / 2;
                        
                        shapeNode = (
                            <g key={s.id} {...eventProps} style={{opacity: isHoveredForEraser ? 0.5 : 1}}>
                                {dimNode}
                                {/* Invisible Hit Target for Selection/Eraser in select/eraser mode */}
                                <circle cx={hitX} cy={hitY} r={20/scale} fill="transparent" strokeWidth={0} style={{pointerEvents: 'all'}}/>
                            </g>
                        );
                    } else if (s.type === 'point') {
                        shapeNode = (
                            <g key={s.id} transform={transform} {...eventProps}>
                                <circle 
                                    cx={s.x} 
                                    cy={s.y} 
                                    r={s.radius / scale} // Ekran pikselinde sabit kalması için ölçeğe böl
                                    fill={isSelected ? '#f59e0b' : s.color} 
                                    stroke={isSelected ? '#fff' : finalStrokeColor} 
                                    strokeWidth={isSelected ? 3/scale : 1/scale} 
                                    opacity={opacity} 
                                    style={{cursor: mode === 'point' ? 'crosshair' : 'move'}}
                                />
                            </g>
                        );
                    }

                    // --- Rotation Handle Render (Only if unlocked) ---
                    if (isSelected && selectedShapeIds.length === 1 && !isHoveredForEraser && mode !== 'move' && showRotationHandle && !s.locked) {
                        let handleY = centerY - 50/scale; 
                        // ... (same offset logic) ...
                        if (s.type === 'rect') handleY = s.y - 30/scale;
                        else if (s.type === 'circle') handleY = s.y - s.radius - 30/scale;
                        else if (s.type === 'text') handleY = s.y - s.fontSize/2 - 30/scale;
                        else if (s.type === 'line') handleY = centerY - s.length/2 - 30/scale;
                        else if (s.type === 'polyline') {
                             const ys = s.points.map(p => p.y);
                             const minY = Math.min(...ys);
                             handleY = s.y + minY - 30/scale;
                        }

                        return (
                            <g key={`group-${s.id}`}>
                                {shapeNode}
                                <g transform={`rotate(${s.rotation || 0}, ${centerX}, ${centerY})`}>
                                    <line x1={centerX} y1={centerY} x2={centerX} y2={handleY} stroke="#2563eb" strokeWidth={1/scale} strokeDasharray={`${4/scale}`} />
                                    <circle cx={centerX} cy={handleY} r={6/scale} fill="#fff" stroke="#2563eb" strokeWidth={2/scale} style={{cursor: 'grab'}} onMouseDown={(e) => handleRotateMouseDown(e, s)} />
                                </g>
                            </g>
                        );
                    }
                    
                    // If locked and selected, show small lock icon overlay at center
                    if(isSelected && s.locked) {
                         return (
                             <g key={`group-${s.id}`}>
                                 {shapeNode}
                                 <g transform={`translate(${centerX}, ${centerY}) scale(${1/scale})`}>
                                     <circle r="10" fill="white" stroke="#ef4444" strokeWidth="2"/>
                                     <Lock size={12} color="#ef4444" style={{transform: 'translate(-6px, -6px)'}}/>
                                 </g>
                             </g>
                         );
                    }

                    return shapeNode;
                })}

                {/* Active Drawing Preview (Polyline) */}
                {activePolyline.length > 0 && (
                    <g>
                        {/* Guides for Smart Input */}
                        {activePolyline.length > 1 && (() => {
                            const fixedPoint = activePolyline[activePolyline.length - 2];
                            
                            // Length Guide Circle
                            if (polyInput.length && !isNaN(parseFloat(polyInput.length))) {
                                const radius = parseFloat(polyInput.length) * CM_TO_PX;
                                return (
                                    <circle key="guide-circle" cx={fixedPoint.x} cy={fixedPoint.y} r={radius} fill="none" stroke="#3b82f6" strokeWidth={1/scale} strokeDasharray={`${4/scale}`} opacity={0.5} />
                                );
                            }
                            return null;
                        })()}

                        {activePolyline.length > 1 && (() => {
                            const fixedPoint = activePolyline[activePolyline.length - 2];
                            
                            // Angle Guide Line (Infinite Ray)
                            if (polyInput.angle && !isNaN(parseFloat(polyInput.angle))) {
                                const guideLen = WORKSPACE_SIZE_CM * CM_TO_PX; // Very long line
                                const angleRad = parseFloat(polyInput.angle) * (Math.PI / 180);
                                const x2 = fixedPoint.x + guideLen * Math.cos(angleRad);
                                const y2 = fixedPoint.y + guideLen * Math.sin(angleRad);
                                const x1 = fixedPoint.x - guideLen * Math.cos(angleRad); // Backward ray too
                                const y1 = fixedPoint.y - guideLen * Math.sin(angleRad);
                                return (
                                    <line key="guide-line" x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth={1/scale} strokeDasharray={`${8/scale}`} opacity={0.5} />
                                );
                            }
                            return null;
                        })()}

                        <path d={activePolyline.map((p, i) => (i===0?`M ${p.x} ${p.y}`:`L ${p.x} ${p.y}`)).join(' ')} stroke={color} strokeWidth={2/scale} fill="none" strokeDasharray={`${4/scale}`} />

                        {/* Dynamic Segment Label (LIVE INLINE DISPLAY) */}
                        {activePolyline.length > 1 && (() => {
                             const p1 = activePolyline[activePolyline.length - 2];
                             const p2 = activePolyline[activePolyline.length - 1];
                             
                             const dx = p2.x - p1.x;
                             const dy = p2.y - p1.y;
                             const dist = Math.sqrt(dx*dx + dy*dy);
                             const lenCm = (dist / CM_TO_PX).toFixed(1);
                             
                             // Calculate midpoint and rotation for the label
                             const midX = (p1.x + p2.x) / 2;
                             const midY = (p1.y + p2.y) / 2;
                             
                             let angleDeg = getSegmentAngle(p1, p2);
                             let textRotation = angleDeg;
                             if (textRotation < -90 || textRotation > 90) textRotation += 180; // Flip text orientation for readability

                             return (
                                 <g key="live-label" transform={`translate(${midX}, ${midY}) rotate(${textRotation})`} pointerEvents="none">
                                     <rect 
                                        x={-35/scale} y={-8/scale} 
                                        width={70/scale} height={16/scale} 
                                        fill="white" opacity="0.8" rx={4/scale}
                                     />
                                     <text 
                                        x={0} y={0} 
                                        dominantBaseline="middle" textAnchor="middle" 
                                        fontSize={9/scale} fill="#2563eb" fontWeight="bold"
                                     >
                                        {lenCm} cm / {Math.round(angleDeg % 360)}°
                                     </text>
                                 </g>
                             );
                        })()}
                        
                    </g>
                )}
                
                {/* Active Drawing Preview (Dimension - Axis-Locked) */}
                {activeDimension.p1 && mode === 'dimension' && (
                    <g pointerEvents="none">
                        {!activeDimension.p2 && dimPreviewPos && (() => {
                             const p1 = activeDimension.p1;
                             const rawP2 = dimPreviewPos;
                             
                             // Axis Locking Logic:
                             const dx = Math.abs(rawP2.x - p1.x);
                             const dy = Math.abs(rawP2.y - p1.y);
                             let p2Preview = { ...rawP2 };
                             if (dx > dy) p2Preview.y = p1.y; else p2Preview.x = p1.x; // Apply axis lock

                             const dist = Math.sqrt(Math.pow(p2Preview.x - p1.x, 2) + Math.pow(p2Preview.y - p1.y, 2));
                             const lenCm = (dist / CM_TO_PX).toFixed(1);
                             const midX = (p1.x + p2Preview.x) / 2;
                             const midY = (p1.y + p2Preview.y) / 2;
                             return (
                                 <>
                                     <circle cx={p1.x} cy={p1.y} r={4/scale} fill="#ef4444" />
                                     <line x1={p1.x} y1={p1.y} x2={p2Preview.x} y2={p2Preview.y} stroke="#ef4444" strokeWidth={2/scale} strokeDasharray={`${5/scale}`} />
                                     <circle cx={p2Preview.x} cy={p2Preview.y} r={4/scale} fill="#ef4444" />
                                     <rect x={midX - 20/scale} y={midY - 12/scale} width={40/scale} height={24/scale} fill="rgba(255, 255, 255, 0.8)" rx={4/scale} />
                                     <text x={midX} y={midY} dominantBaseline="middle" textAnchor="middle" fontSize={12/scale} fill="#ef4444" fontWeight="bold">{lenCm} cm</text>
                                 </>
                             );
                        })()}
                        {activeDimension.p2 && dimPreviewPos && (() => {
                             // Final step: Render the full dimension based on p1, p2, and current textPos
                             return renderDimensionShape(activeDimension.p1, activeDimension.p2, dimPreviewPos, false, "#ef4444");
                        })()}
                    </g>
                )}
                
                {/* Active Drawing Preview (Angular Dimension - Free Angle) */}
                {activeDimension.p1 && mode === 'angular_dimension' && (
                    <g pointerEvents="none">
                        {!activeDimension.p2 && dimPreviewPos && (() => {
                             const p1 = activeDimension.p1;
                             const p2 = dimPreviewPos;
                             
                             const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
                             const lenCm = (dist / CM_TO_PX).toFixed(1);
                             const midX = (p1.x + p2.x) / 2;
                             const midY = (p1.y + p2.y) / 2;
                             
                             const dx = p2.x - p1.x;
                             const dy = p2.y - p1.y;
                             let angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
                             if (angleDeg < 0) angleDeg += 360;

                             return (
                                 <>
                                     <circle cx={p1.x} cy={p1.y} r={4/scale} fill="#10b981" />
                                     <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#10b981" strokeWidth={2/scale} strokeDasharray={`${5/scale}`} />
                                     <circle cx={p2.x} cy={p2.y} r={4/scale} fill="#10b981" />
                                     <rect x={midX - 20/scale} y={midY - 12/scale} width={40/scale + 20/scale} height={24/scale} fill="rgba(255, 255, 255, 0.8)" rx={4/scale} />
                                     <text x={midX} y={midY} dominantBaseline="middle" textAnchor="middle" fontSize={12/scale} fill="#10b981" fontWeight="bold">
                                         {lenCm} cm / {Math.round(angleDeg)}°
                                     </text>
                                 </>
                             );
                        })()}
                        {activeDimension.p2 && dimPreviewPos && (() => {
                             // Final step: Render the full angular dimension based on p1, p2, and current textPos
                             // Note: We use dimPreviewPos (raw mouse pos) for the final rendering step here
                             return renderDimensionShape(activeDimension.p1, activeDimension.p2, dimPreviewPos, showAngle, "#10b981", showAngle);
                        })()}
                    </g>
                )}
            </g>
        </svg>
      </div>
    </div>
  );
};

export default App;
