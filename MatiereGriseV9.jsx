// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v9 — Obsidian-style Graph + Backlinks + Quick Search
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const API_URL = 'https://hampshire-rugs-purposes-semester.trycloudflare.com';

// ═══════════════════════════════════════════════════════════════════════════════
// FORCE-DIRECTED GRAPH ENGINE (D3-style)
// ═══════════════════════════════════════════════════════════════════════════════

class ForceGraph {
  constructor(nodes, links, width, height) {
    this.width = width;
    this.height = height;
    this.nodes = nodes.map(n => ({
      ...n,
      x: n.x || width/2 + (Math.random() - 0.5) * 300,
      y: n.y || height/2 + (Math.random() - 0.5) * 300,
      vx: 0,
      vy: 0
    }));
    this.links = links.map(l => ({
      ...l,
      source: this.nodes.find(n => n.id === l.source),
      target: this.nodes.find(n => n.id === l.target)
    })).filter(l => l.source && l.target);
    
    this.alpha = 1;
    this.alphaMin = 0.001;
    this.alphaDecay = 0.02;
    this.velocityDecay = 0.6;
    this.centerStrength = 0.02;
    this.chargeStrength = -300;
    this.linkDistance = 100;
    this.linkStrength = 0.5;
  }

  tick() {
    if (this.alpha < this.alphaMin) return false;

    // Center force
    const cx = this.width / 2;
    const cy = this.height / 2;
    
    for (const node of this.nodes) {
      node.vx += (cx - node.x) * this.centerStrength * this.alpha;
      node.vy += (cy - node.y) * this.centerStrength * this.alpha;
    }

    // Many-body force (repulsion)
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeA = this.nodes[i];
        const nodeB = this.nodes[j];
        let dx = nodeB.x - nodeA.x;
        let dy = nodeB.y - nodeA.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) d2 = 1;
        const d = Math.sqrt(d2);
        const force = this.chargeStrength * this.alpha / d2;
        const fx = dx / d * force;
        const fy = dy / d * force;
        nodeA.vx -= fx;
        nodeA.vy -= fy;
        nodeB.vx += fx;
        nodeB.vy += fy;
      }
    }

    // Link force
    for (const link of this.links) {
      const source = link.source;
      const target = link.target;
      let dx = target.x - source.x;
      let dy = target.y - source.y;
      let d = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = this.linkStrength * (link.strength || 1);
      const force = (d - this.linkDistance) * strength * this.alpha;
      const fx = dx / d * force;
      const fy = dy / d * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }

    // Update positions
    for (const node of this.nodes) {
      if (node.fx !== undefined) {
        node.x = node.fx;
        node.vx = 0;
      } else {
        node.vx *= this.velocityDecay;
        node.x += node.vx;
      }
      if (node.fy !== undefined) {
        node.y = node.fy;
        node.vy = 0;
      } else {
        node.vy *= this.velocityDecay;
        node.y += node.vy;
      }
      
      // Bounds
      const margin = 50;
      node.x = Math.max(margin, Math.min(this.width - margin, node.x));
      node.y = Math.max(margin, Math.min(this.height - margin, node.y));
    }

    this.alpha += (this.alphaMin - this.alpha) * this.alphaDecay;
    return true;
  }

  reheat() {
    this.alpha = 0.3;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRAPH VIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function GraphView({ graphData, onNodeClick, onNodeHover, selectedNode, width, height }) {
  const canvasRef = useRef(null);
  const graphRef = useRef(null);
  const animRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dragNode, setDragNode] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  // Initialize graph
  useEffect(() => {
    if (!graphData?.nodes?.length) {
      graphRef.current = null;
      return;
    }
    
    graphRef.current = new ForceGraph(
      graphData.nodes,
      graphData.links || [],
      width,
      height
    );
  }, [graphData, width, height]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const render = () => {
      const graph = graphRef.current;
      if (!graph) {
        animRef.current = requestAnimationFrame(render);
        return;
      }

      graph.tick();

      // Clear
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw links
      for (const link of graph.links) {
        const isHighlighted = hoveredNode && 
          (link.source.id === hoveredNode || link.target.id === hoveredNode);
        const isSelected = selectedNode &&
          (link.source.id === selectedNode || link.target.id === selectedNode);

        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        
        if (isHighlighted || isSelected) {
          ctx.strokeStyle = link.type === 'semantic' ? '#888' : '#000';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = link.type === 'semantic' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.25)';
          ctx.lineWidth = 1;
        }
        
        if (link.type === 'semantic') {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw nodes
      for (const node of graph.nodes) {
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode === node.id;
        const isConnected = hoveredNode && graph.links.some(l =>
          (l.source.id === hoveredNode && l.target.id === node.id) ||
          (l.target.id === hoveredNode && l.source.id === node.id)
        );

        // Calculate node size based on connections
        const connectionCount = graph.links.filter(l => 
          l.source.id === node.id || l.target.id === node.id
        ).length;
        const baseRadius = 6;
        const radius = baseRadius + Math.min(connectionCount * 1.5, 10);

        // Glow effect
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 12, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            node.x, node.y, radius,
            node.x, node.y, radius + 12
          );
          gradient.addColorStop(0, isSelected ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        if (isSelected) {
          ctx.fillStyle = '#000';
        } else if (isHovered) {
          ctx.fillStyle = '#222';
        } else if (isConnected) {
          ctx.fillStyle = '#444';
        } else if (hoveredNode) {
          ctx.fillStyle = '#bbb';
        } else {
          ctx.fillStyle = '#666';
        }
        ctx.fill();

        // Type indicator
        const typeColors = { 
          pdf: '#c0392b', 
          image: '#27ae60', 
          note: '#2980b9', 
          audio: '#8e44ad', 
          video: '#e67e22',
          document: '#34495e'
        };
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = typeColors[node.type] || '#fff';
        ctx.fill();

        // Label
        if (isHovered || isSelected || isConnected) {
          const label = node.title.length > 30 ? node.title.slice(0, 30) + '...' : node.title;
          ctx.font = isHovered || isSelected ? 'bold 12px system-ui' : '11px system-ui';
          const metrics = ctx.measureText(label);
          const padding = 6;
          const labelY = node.y - radius - 12;

          // Background
          ctx.fillStyle = 'rgba(255,255,255,0.95)';
          ctx.fillRect(
            node.x - metrics.width/2 - padding,
            labelY - 10,
            metrics.width + padding * 2,
            16
          );
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(
            node.x - metrics.width/2 - padding,
            labelY - 10,
            metrics.width + padding * 2,
            16
          );

          // Text
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, node.x, labelY - 2);
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [graphData, width, height, hoveredNode, selectedNode, transform]);

  // Mouse handlers
  const getNodeAt = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || !graphRef.current) return null;
    
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - transform.x) / transform.k;
    const y = (clientY - rect.top - transform.y) / transform.k;

    for (const node of graphRef.current.nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      const connectionCount = graphRef.current.links.filter(l => 
        l.source.id === node.id || l.target.id === node.id
      ).length;
      const radius = 6 + Math.min(connectionCount * 1.5, 10);
      
      if (Math.sqrt(dx*dx + dy*dy) < radius + 5) {
        return node;
      }
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const node = getNodeAt(e.clientX, e.clientY);
    setHoveredNode(node?.id || null);
    onNodeHover?.(node);

    if (dragNode && graphRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - transform.x) / transform.k;
      const y = (e.clientY - rect.top - transform.y) / transform.k;
      
      const n = graphRef.current.nodes.find(n => n.id === dragNode);
      if (n) {
        n.fx = x;
        n.fy = y;
        graphRef.current.reheat();
      }
    }
  };

  const handleMouseDown = (e) => {
    const node = getNodeAt(e.clientX, e.clientY);
    if (node) {
      setDragNode(node.id);
      if (graphRef.current) {
        const n = graphRef.current.nodes.find(n => n.id === node.id);
        if (n) {
          n.fx = n.x;
          n.fy = n.y;
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (dragNode && graphRef.current) {
      const n = graphRef.current.nodes.find(n => n.id === dragNode);
      if (n) {
        delete n.fx;
        delete n.fy;
      }
    }
    setDragNode(null);
  };

  const handleClick = (e) => {
    if (dragNode) return;
    const node = getNodeAt(e.clientX, e.clientY);
    if (node) {
      onNodeClick?.(node);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    setTransform(t => {
      const newK = Math.max(0.1, Math.min(4, t.k * delta));
      return {
        x: mx - (mx - t.x) * (newK / t.k),
        y: my - (my - t.y) * (newK / t.k),
        k: newK
      };
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { setHoveredNode(null); handleMouseUp(); }}
      onClick={handleClick}
      onWheel={handleWheel}
      style={{ 
        cursor: dragNode ? 'grabbing' : (hoveredNode ? 'pointer' : 'default'),
        background: '#fafafa'
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK SEARCH (Ctrl+O style)
// ═══════════════════════════════════════════════════════════════════════════════

function QuickSearch({ isOpen, onClose, onSelect, token, apiUrl }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || !token) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(query)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setResults(await res.json());
          setSelectedIndex(0);
        }
      } catch (e) {}
    };

    const timeout = setTimeout(search, 150);
    return () => clearTimeout(timeout);
  }, [query, token, apiUrl]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      onSelect(results[selectedIndex]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="quick-search-overlay" onClick={onClose}>
      <div className="quick-search" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un document..."
          className="quick-search-input"
        />
        {results.length > 0 && (
          <div className="quick-search-results">
            {results.map((r, i) => (
              <div
                key={r.id}
                className={`quick-search-item ${i === selectedIndex ? 'selected' : ''}`}
                onClick={() => { onSelect(r); onClose(); }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span className={`item-type ${r.type}`}>{r.type}</span>
                <span className="item-title">{r.title}</span>
                {r.tags?.length > 0 && (
                  <span className="item-tags">{r.tags.slice(0, 2).join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {query && results.length === 0 && (
          <div className="quick-search-empty">Aucun résultat</div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKLINKS PANEL
// ═══════════════════════════════════════════════════════════════════════════════

function BacklinksPanel({ content, backlinks, outlinks, onNavigate }) {
  if (!content) return null;

  return (
    <div className="backlinks-panel">
      <div className="backlinks-header">
        <h3>Liens</h3>
      </div>
      
      <div className="backlinks-section">
        <div className="backlinks-title">
          <span className="backlinks-icon">←</span>
          Backlinks ({backlinks?.length || 0})
        </div>
        {backlinks?.length > 0 ? (
          <ul className="backlinks-list">
            {backlinks.map(bl => (
              <li key={bl.id} onClick={() => onNavigate(bl)}>
                <span className={`bl-type ${bl.content_type}`}>{bl.content_type}</span>
                <span className="bl-title">{bl.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="backlinks-empty">Aucun backlink</p>
        )}
      </div>

      <div className="backlinks-section">
        <div className="backlinks-title">
          <span className="backlinks-icon">→</span>
          Liens sortants ({outlinks?.length || 0})
        </div>
        {outlinks?.length > 0 ? (
          <ul className="backlinks-list">
            {outlinks.map(ol => (
              <li key={ol.id} onClick={() => onNavigate(ol)}>
                <span className={`bl-type ${ol.content_type}`}>{ol.content_type}</span>
                <span className="bl-title">{ol.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="backlinks-empty">Aucun lien sortant</p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function MatiereGrise() {
  // State
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  
  const [view, setView] = useState('landing');
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  const [contents, setContents] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [publicGraphData, setPublicGraphData] = useState({ nodes: [], links: [] });
  const [selectedContent, setSelectedContent] = useState(null);
  
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [searchWeb, setSearchWeb] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 500 });
  
  const graphContainerRef = useRef(null);
  const chatRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('mg_token');
      if (savedToken) setToken(savedToken);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      fetchPublicGraph();
      if (token) {
        fetchProfile();
        fetchContents();
        fetchGraph();
        fetchConversations();
      }
    }
  }, [token, ready]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        if (token) setQuickSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [token]);

  // Graph dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (graphContainerRef.current) {
        const rect = graphContainerRef.current.getBoundingClientRect();
        setGraphDimensions({ width: rect.width || 800, height: rect.height || 500 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [view]);

  // ═══════════════════════════════════════════════════════════════════════════
  // API CALLS
  // ═══════════════════════════════════════════════════════════════════════════

  const api = useCallback(async (endpoint, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
    if (res.status === 401) { logout(); throw new Error('Session expired'); }
    return res;
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await api('/api/profile/me');
      if (res.ok) setUser(await res.json());
    } catch (e) {}
  };

  const fetchContents = async () => {
    try {
      const res = await api('/api/contents');
      if (res.ok) setContents(await res.json());
    } catch (e) {}
  };

  const fetchGraph = async () => {
    try {
      const res = await api('/api/graph');
      if (res.ok) setGraphData(await res.json());
    } catch (e) {}
  };

  const fetchPublicGraph = async () => {
    try {
      const res = await fetch(`${API_URL}/api/graph/public`);
      if (res.ok) setPublicGraphData(await res.json());
    } catch (e) {}
  };

  const fetchConversations = async () => {
    try {
      const res = await api('/api/conversations');
      if (res.ok) setConversations(await res.json());
    } catch (e) {}
  };

  const fetchContentDetails = async (contentId) => {
    try {
      const res = await api(`/api/contents/${contentId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedContent(data);
        return data;
      }
    } catch (e) {}
    return null;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════════════════

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('mg_token', data.access_token);
        setToken(data.access_token);
        closeModal();
        setView('workspace');
      } else {
        alert('Identifiants incorrects');
      }
    } catch (e) { alert('Erreur de connexion'); }
    setLoading(false);
  };

  const register = async (email, password, role, code) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, invitation_code: code })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('mg_token', data.access_token);
        setToken(data.access_token);
        closeModal();
        setView('workspace');
      } else {
        const err = await res.json();
        alert(err.detail || 'Erreur');
      }
    } catch (e) { alert('Erreur de connexion'); }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('mg_token');
    setToken(null);
    setUser(null);
    setContents([]);
    setGraphData({ nodes: [], links: [] });
    setSelectedContent(null);
    setView('landing');
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  const openModal = (type, data = null) => { setModal(type); setModalData(data); };
  const closeModal = () => { setModal(null); setModalData(null); };

  const handleUpload = async (file, title, description, tags) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('tags', JSON.stringify(tags || []));
      
      const res = await fetch(`${API_URL}/api/contents/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) { 
        fetchContents(); 
        fetchGraph();
        closeModal(); 
      }
    } catch (e) { alert('Erreur'); }
    setLoading(false);
  };

  const handleCreateNote = async (title, text, tags) => {
    setLoading(true);
    try {
      const res = await api('/api/contents', {
        method: 'POST',
        body: JSON.stringify({ content_type: 'note', title, text_content: text, tags })
      });
      if (res.ok) { 
        fetchContents(); 
        fetchGraph();
        closeModal(); 
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleDelete = async (contentId) => {
    if (!confirm('Supprimer ?')) return;
    try {
      await api(`/api/contents/${contentId}`, { method: 'DELETE' });
      fetchContents();
      fetchGraph();
      if (selectedContent?.id === contentId) setSelectedContent(null);
    } catch (e) {}
  };

  const handleNodeClick = async (node) => {
    await fetchContentDetails(node.id);
    openModal('content');
  };

  const handleQuickSearchSelect = async (item) => {
    await fetchContentDetails(item.id);
    openModal('content');
  };

  const handleChat = async () => {
    if (!chatInput.trim() || loading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const res = await api('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: msg,
          content_ids: selectedContent ? [selectedContent.id] : null,
          conversation_id: currentConv?.id,
          search_web: searchWeb
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response, 
          sources: data.sources,
          web_results: data.web_results
        }]);
        if (!currentConv && data.conversation_id) {
          setCurrentConv({ id: data.conversation_id });
          fetchConversations();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion.' }]);
    }
    setLoading(false);
  };

  const newConversation = () => {
    setCurrentConv(null);
    setMessages([]);
  };

  const loadConversation = async (conv) => {
    setCurrentConv(conv);
    try {
      const res = await api(`/api/conversations/${conv.id}/messages`);
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      setMessages([]);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (!ready) return null;

  return (
    <div className="app">
      <style>{styles}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-brand" onClick={() => { setView('landing'); setSelectedContent(null); }}>
          <span className="logo">●</span>
          <span>Matière Grise</span>
        </div>
        
        <div className="header-center">
          {token && (
            <button className="search-btn" onClick={() => setQuickSearchOpen(true)}>
              <span>Rechercher...</span>
              <kbd>⌘O</kbd>
            </button>
          )}
        </div>

        <div className="header-actions">
          {token && user ? (
            <>
              <button className="nav-btn" onClick={() => setView('workspace')}>Graph</button>
              <button className="user-btn">{user.display_name?.[0] || '?'}</button>
              <button className="nav-btn subtle" onClick={logout}>Sortir</button>
            </>
          ) : (
            <>
              <button className="nav-btn" onClick={() => openModal('login')}>Connexion</button>
              <button className="nav-btn primary" onClick={() => openModal('register')}>Inscription</button>
            </>
          )}
        </div>
      </header>

      {/* LANDING */}
      {view === 'landing' && (
        <main className="landing">
          <section className="hero">
            <h1>Matière Grise</h1>
            <p>Les origines terrestres de l'intelligence artificielle</p>
            <div className="hero-actions">
              <button onClick={() => openModal('register')}>Commencer</button>
            </div>
          </section>

          <section className="landing-graph" ref={graphContainerRef}>
            <div className="section-title">Publications</div>
            <GraphView 
              graphData={publicGraphData}
              onNodeClick={handleNodeClick}
              width={graphDimensions.width}
              height={500}
            />
            <div className="graph-hint">
              {publicGraphData.nodes?.length || 0} documents · {publicGraphData.links?.length || 0} connexions
            </div>
          </section>
        </main>
      )}

      {/* WORKSPACE */}
      {view === 'workspace' && token && (
        <div className="workspace">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">Créer</div>
              <button onClick={() => openModal('upload')}>+ Document</button>
              <button onClick={() => openModal('note')}>+ Note</button>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Conversations</div>
              <button className="new-conv" onClick={newConversation}>+ Nouvelle</button>
              {conversations.slice(0, 8).map(c => (
                <button 
                  key={c.id}
                  className={currentConv?.id === c.id ? 'active' : ''}
                  onClick={() => loadConversation(c)}
                >
                  {c.title?.slice(0, 25) || 'Sans titre'}
                </button>
              ))}
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Mes documents</div>
              {contents.slice(0, 10).map(c => (
                <button 
                  key={c.id}
                  className={selectedContent?.id === c.id ? 'active' : ''}
                  onClick={() => fetchContentDetails(c.id)}
                >
                  <span className={`doc-type ${c.content_type}`}>•</span>
                  {c.title.slice(0, 22)}
                </button>
              ))}
            </div>
          </aside>

          {/* Main - Graph View */}
          <main className="workspace-main" ref={graphContainerRef}>
            <div className="workspace-header">
              <h1>Mon espace</h1>
              <div className="workspace-stats">
                {graphData.nodes?.length || 0} documents · {graphData.links?.length || 0} liens
              </div>
            </div>
            <div className="graph-container">
              <GraphView
                graphData={graphData}
                onNodeClick={handleNodeClick}
                selectedNode={selectedContent?.id}
                width={graphDimensions.width - 40}
                height={graphDimensions.height - 100}
              />
            </div>
          </main>

          {/* Right Panel - Backlinks or Chat */}
          <aside className="right-panel">
            {selectedContent ? (
              <BacklinksPanel
                content={selectedContent}
                backlinks={selectedContent.backlinks}
                outlinks={selectedContent.outgoing_links}
                onNavigate={(item) => fetchContentDetails(item.id)}
              />
            ) : (
              <div className="chat-panel">
                <div className="chat-header">
                  <span>Assistant IA</span>
                  <label className="toggle">
                    <input type="checkbox" checked={searchWeb} onChange={e => setSearchWeb(e.target.checked)} />
                    <span>Web</span>
                  </label>
                </div>
                <div className="chat-messages" ref={chatRef}>
                  {messages.length === 0 ? (
                    <div className="chat-empty">Posez une question...</div>
                  ) : messages.map((m, i) => (
                    <div key={i} className={`message ${m.role}`}>
                      <div className="message-content">{m.content}</div>
                      {m.sources?.length > 0 && (
                        <div className="message-sources">
                          Sources: {m.sources.map(s => s.title).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && <div className="message assistant loading">...</div>}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                    placeholder="Message..."
                  />
                  <button onClick={handleChat} disabled={loading}>↑</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Quick Search */}
      <QuickSearch
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        onSelect={handleQuickSearchSelect}
        token={token}
        apiUrl={API_URL}
      />

      {/* Modals */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {modal === 'login' && <LoginForm onSubmit={login} loading={loading} />}
            {modal === 'register' && <RegisterForm onSubmit={register} loading={loading} />}
            {modal === 'upload' && <UploadForm onSubmit={handleUpload} onClose={closeModal} loading={loading} />}
            {modal === 'note' && <NoteForm onSubmit={handleCreateNote} onClose={closeModal} loading={loading} />}
            {modal === 'content' && selectedContent && (
              <ContentView 
                content={selectedContent} 
                apiUrl={API_URL}
                onDelete={() => { handleDelete(selectedContent.id); closeModal(); }}
                onNavigate={(item) => fetchContentDetails(item.id)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORM COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form className="form" onSubmit={e => { e.preventDefault(); onSubmit(email, password); }}>
      <h2>Connexion</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>Connexion</button>
    </form>
  );
}

function RegisterForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  return (
    <form className="form" onSubmit={e => { e.preventDefault(); onSubmit(email, password, 'chercheur', code); }}>
      <h2>Inscription</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
      <input placeholder="Code d'invitation" value={code} onChange={e => setCode(e.target.value)} required />
      <button type="submit" disabled={loading}>S'inscrire</button>
    </form>
  );
}

function UploadForm({ onSubmit, onClose, loading }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');

  return (
    <form className="form" onSubmit={e => {
      e.preventDefault();
      if (file) onSubmit(file, title, desc, tags.split(',').map(t => t.trim()).filter(Boolean));
    }}>
      <h2>Importer un document</h2>
      <input type="file" onChange={e => {
        const f = e.target.files?.[0];
        setFile(f);
        if (f && !title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
      }} required />
      <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
      <input placeholder="Tags (séparés par des virgules)" value={tags} onChange={e => setTags(e.target.value)} />
      <div className="form-actions">
        <button type="button" onClick={onClose}>Annuler</button>
        <button type="submit" disabled={loading || !file}>Importer</button>
      </div>
    </form>
  );
}

function NoteForm({ onSubmit, onClose, loading }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');

  return (
    <form className="form" onSubmit={e => {
      e.preventDefault();
      onSubmit(title, text, tags.split(',').map(t => t.trim()).filter(Boolean));
    }}>
      <h2>Nouvelle note</h2>
      <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Contenu (utilisez [[titre]] pour créer des liens)" value={text} onChange={e => setText(e.target.value)} rows={10} required />
      <input placeholder="Tags" value={tags} onChange={e => setTags(e.target.value)} />
      <div className="form-actions">
        <button type="button" onClick={onClose}>Annuler</button>
        <button type="submit" disabled={loading}>Créer</button>
      </div>
    </form>
  );
}

function ContentView({ content, apiUrl, onDelete, onNavigate }) {
  const fileUrl = content.file_path ? `${apiUrl}/uploads/${content.file_path}` : null;

  return (
    <div className="content-view">
      <div className="content-header">
        <span className={`content-type ${content.content_type}`}>{content.content_type}</span>
        <h2>{content.title}</h2>
      </div>

      <div className="content-body">
        {content.content_type === 'pdf' && fileUrl && (
          <iframe src={fileUrl} title={content.title} />
        )}
        {content.content_type === 'image' && fileUrl && (
          <img src={fileUrl} alt={content.title} />
        )}
        {content.content_type === 'note' && content.text_content && (
          <div className="content-text">{content.text_content}</div>
        )}
        {content.description && (
          <p className="content-desc">{content.description}</p>
        )}
        {content.tags?.length > 0 && (
          <div className="content-tags">
            {content.tags.map((t, i) => <span key={i}>{t}</span>)}
          </div>
        )}
      </div>

      {/* Backlinks dans la modal */}
      {(content.backlinks?.length > 0 || content.outgoing_links?.length > 0) && (
        <div className="content-links">
          {content.backlinks?.length > 0 && (
            <div className="links-section">
              <h4>← Backlinks</h4>
              {content.backlinks.map(bl => (
                <button key={bl.id} onClick={() => onNavigate(bl)}>{bl.title}</button>
              ))}
            </div>
          )}
          {content.outgoing_links?.length > 0 && (
            <div className="links-section">
              <h4>→ Liens</h4>
              {content.outgoing_links.map(ol => (
                <button key={ol.id} onClick={() => onNavigate(ol)}>{ol.title}</button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="content-actions">
        <button className="danger" onClick={onDelete}>Supprimer</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = `
* { margin: 0; padding: 0; box-sizing: border-box; }

.app {
  min-height: 100vh;
  background: #fff;
  color: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 14px;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  z-index: 100;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
}

.logo { font-size: 18px; }

.header-center { flex: 1; display: flex; justify-content: center; }

.search-btn {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.search-btn:hover { border-color: #ccc; }

.search-btn kbd {
  background: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  border: 1px solid #ddd;
}

.header-actions { display: flex; gap: 8px; align-items: center; }

.nav-btn {
  padding: 8px 14px;
  background: none;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.nav-btn:hover { border-color: #000; }
.nav-btn.primary { background: #000; color: #fff; border-color: #000; }
.nav-btn.subtle { border: none; color: #666; }

.user-btn {
  width: 32px;
  height: 32px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
}

/* Landing */
.landing { padding-top: 52px; }

.hero {
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 20px 60px;
  text-align: center;
}

.hero h1 {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.hero p {
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
}

.hero-actions button {
  padding: 14px 32px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

.landing-graph {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  margin-bottom: 20px;
}

.graph-hint {
  text-align: center;
  font-size: 12px;
  color: #888;
  margin-top: 16px;
}

/* Workspace */
.workspace {
  display: flex;
  padding-top: 52px;
  height: 100vh;
}

.sidebar {
  width: 220px;
  height: calc(100vh - 52px);
  border-right: 1px solid #e5e5e5;
  padding: 16px;
  overflow-y: auto;
  background: #fafafa;
}

.sidebar-section { margin-bottom: 24px; }

.sidebar-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 8px;
}

.sidebar button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  background: none;
  border: none;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  color: #333;
}

.sidebar button:hover { background: #e5e5e5; }
.sidebar button.active { background: #000; color: #fff; }
.sidebar button.new-conv { color: #666; }

.doc-type {
  font-size: 16px;
}
.doc-type.pdf { color: #c0392b; }
.doc-type.image { color: #27ae60; }
.doc-type.note { color: #2980b9; }
.doc-type.audio { color: #8e44ad; }
.doc-type.video { color: #e67e22; }

.workspace-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 52px);
  padding: 20px;
  overflow: hidden;
}

.workspace-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.workspace-header h1 { font-size: 20px; }
.workspace-stats { font-size: 12px; color: #888; }

.graph-container {
  flex: 1;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
}

.right-panel {
  width: 280px;
  height: calc(100vh - 52px);
  border-left: 1px solid #e5e5e5;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* Backlinks Panel */
.backlinks-panel { padding: 16px; }

.backlinks-header {
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 16px;
}

.backlinks-header h3 { font-size: 14px; }

.backlinks-section { margin-bottom: 20px; }

.backlinks-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.backlinks-icon { font-size: 14px; }

.backlinks-list {
  list-style: none;
}

.backlinks-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.backlinks-list li:hover { background: #f5f5f5; }

.bl-type {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.bl-type.pdf { background: #c0392b; }
.bl-type.image { background: #27ae60; }
.bl-type.note { background: #2980b9; }

.bl-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.backlinks-empty { font-size: 12px; color: #999; }

/* Chat */
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 13px;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.toggle input { margin: 0; }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
}

.message { margin-bottom: 16px; }

.message-content {
  font-size: 13px;
  line-height: 1.5;
}

.message.user .message-content {
  background: #f0f0f0;
  padding: 10px 14px;
  border-radius: 12px 12px 4px 12px;
}

.message.assistant .message-content {
  padding: 10px 0;
}

.message.loading { color: #999; }

.message-sources {
  font-size: 11px;
  color: #666;
  margin-top: 8px;
}

.chat-input {
  padding: 12px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 13px;
}

.chat-input input:focus { outline: none; border-color: #000; }

.chat-input button {
  width: 36px;
  height: 36px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.chat-input button:disabled { opacity: 0.3; }

/* Quick Search */
.quick-search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
}

.quick-search {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden;
}

.quick-search-input {
  width: 100%;
  padding: 16px 20px;
  border: none;
  font-size: 16px;
  outline: none;
}

.quick-search-results {
  max-height: 400px;
  overflow-y: auto;
  border-top: 1px solid #e5e5e5;
}

.quick-search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
}

.quick-search-item:hover,
.quick-search-item.selected {
  background: #f5f5f5;
}

.item-type {
  font-size: 10px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: #e5e5e5;
}

.item-type.pdf { background: #fef2f2; color: #c0392b; }
.item-type.note { background: #eff6ff; color: #2980b9; }
.item-type.image { background: #f0fdf4; color: #27ae60; }

.item-title { flex: 1; font-size: 14px; }
.item-tags { font-size: 12px; color: #888; }

.quick-search-empty {
  padding: 20px;
  text-align: center;
  color: #888;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.9);
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 24px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.modal-close:hover { background: #e0e0e0; }

/* Forms */
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form h2 {
  font-size: 20px;
  margin-bottom: 8px;
}

.form input,
.form textarea {
  padding: 12px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form input:focus,
.form textarea:focus {
  outline: none;
  border-color: #000;
}

.form textarea {
  resize: vertical;
  min-height: 80px;
}

.form button {
  padding: 12px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.form button:disabled { opacity: 0.3; }

.form-actions {
  display: flex;
  gap: 12px;
}

.form-actions button:first-child {
  background: #f0f0f0;
  color: #333;
}

/* Content View */
.content-view {}

.content-header {
  margin-bottom: 20px;
}

.content-type {
  display: inline-block;
  font-size: 10px;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: #f0f0f0;
  margin-bottom: 8px;
}

.content-type.pdf { background: #fef2f2; color: #c0392b; }
.content-type.note { background: #eff6ff; color: #2980b9; }
.content-type.image { background: #f0fdf4; color: #27ae60; }

.content-view h2 { font-size: 22px; }

.content-body iframe {
  width: 100%;
  height: 400px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
}

.content-body img {
  max-width: 100%;
  border-radius: 8px;
}

.content-text {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
  max-height: 300px;
  overflow-y: auto;
}

.content-desc {
  margin-top: 16px;
  color: #666;
  font-style: italic;
}

.content-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.content-tags span {
  font-size: 12px;
  padding: 4px 10px;
  background: #f0f0f0;
  border-radius: 20px;
}

.content-links {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
}

.links-section {
  margin-bottom: 16px;
}

.links-section h4 {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.links-section button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 4px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
}

.links-section button:hover { background: #e5e5e5; }

.content-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
}

.content-actions .danger {
  background: #fff;
  color: #c0392b;
  border: 1px solid #c0392b;
}

.content-actions .danger:hover {
  background: #fef2f2;
}

/* Responsive */
@media (max-width: 900px) {
  .right-panel { display: none; }
  .sidebar { width: 180px; }
}

@media (max-width: 600px) {
  .sidebar { display: none; }
  .workspace-main { padding: 12px; }
}
`;
