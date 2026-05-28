// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v8 — Graph View Interactif + UX Soigné
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const API_URL = 'https://forums-activity-bon-decision.trycloudflare.com';

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  fr: {
    title: 'Matière Grise',
    tagline: 'Les origines terrestres de l\'intelligence artificielle',
    nav: { home: 'Accueil', research: 'Recherche', concept: 'Concept', about: 'À propos' },
    auth: { login: 'Connexion', register: 'Inscription', logout: 'Sortir', email: 'Email', password: 'Mot de passe', code: 'Code d\'invitation' },
    roles: { researcher: 'Chercheur·e', pedagogue: 'Pédagogue' },
    workspace: { mySpace: 'Mon espace', collective: 'Collectif', import: 'Importer', syntheses: 'Synthèses' },
    actions: { view: 'Voir', slide: 'Glisser', delete: 'Supprimer', save: 'Enregistrer', cancel: 'Annuler', close: 'Fermer', back: 'Retour' },
    content: { title: 'Titre', description: 'Description', tags: 'Tags', file: 'Fichier', note: 'Note', document: 'Document' },
    chat: { title: 'Assistant IA', placeholder: 'Posez une question...', web: 'Recherche web', sources: 'Sources', thinking: 'Réflexion...' },
    graph: { explore: 'Explorer', clickToOpen: 'Cliquer pour ouvrir', connections: 'connexions' },
    glissement: { title: 'Glisser vers...', parent: 'Sous quel élément ?', none: 'Aucun (racine)', collective: 'Espace collectif', surface: 'Surface publique' },
    empty: 'Aucun contenu',
    profile: 'Profil',
    selected: 'sélectionné(s)'
  },
  en: {
    title: 'Grey Matter',
    tagline: 'The terrestrial origins of artificial intelligence',
    nav: { home: 'Home', research: 'Research', concept: 'Concept', about: 'About' },
    auth: { login: 'Login', register: 'Register', logout: 'Logout', email: 'Email', password: 'Password', code: 'Invitation code' },
    roles: { researcher: 'Researcher', pedagogue: 'Pedagogue' },
    workspace: { mySpace: 'My space', collective: 'Collective', import: 'Import', syntheses: 'Syntheses' },
    actions: { view: 'View', slide: 'Slide', delete: 'Delete', save: 'Save', cancel: 'Cancel', close: 'Close', back: 'Back' },
    content: { title: 'Title', description: 'Description', tags: 'Tags', file: 'File', note: 'Note', document: 'Document' },
    chat: { title: 'AI Assistant', placeholder: 'Ask a question...', web: 'Web search', sources: 'Sources', thinking: 'Thinking...' },
    graph: { explore: 'Explore', clickToOpen: 'Click to open', connections: 'connections' },
    glissement: { title: 'Slide to...', parent: 'Under which element?', none: 'None (root)', collective: 'Collective space', surface: 'Public surface' },
    empty: 'No content',
    profile: 'Profile',
    selected: 'selected'
  },
  ar: {
    title: 'المادة الرمادية',
    tagline: 'الأصول الأرضية للذكاء الاصطناعي',
    nav: { home: 'الرئيسية', research: 'البحث', concept: 'المفهوم', about: 'حول' },
    auth: { login: 'دخول', register: 'تسجيل', logout: 'خروج', email: 'البريد', password: 'كلمة المرور', code: 'رمز الدعوة' },
    roles: { researcher: 'باحث', pedagogue: 'مربّي' },
    workspace: { mySpace: 'فضائي', collective: 'المشترك', import: 'استيراد', syntheses: 'التركيبات' },
    actions: { view: 'عرض', slide: 'نقل', delete: 'حذف', save: 'حفظ', cancel: 'إلغاء', close: 'إغلاق', back: 'رجوع' },
    content: { title: 'العنوان', description: 'الوصف', tags: 'الوسوم', file: 'ملف', note: 'ملاحظة', document: 'وثيقة' },
    chat: { title: 'مساعد الذكاء', placeholder: 'اطرح سؤالاً...', web: 'بحث الويب', sources: 'المصادر', thinking: 'تفكير...' },
    graph: { explore: 'استكشف', clickToOpen: 'انقر للفتح', connections: 'روابط' },
    glissement: { title: 'نقل إلى...', parent: 'تحت أي عنصر؟', none: 'لا شيء (جذر)', collective: 'الفضاء المشترك', surface: 'السطح العام' },
    empty: 'لا يوجد محتوى',
    profile: 'الملف',
    selected: 'محدد'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE GRAPH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function InteractiveGraph({ contents, onNodeClick, lang }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const nodesRef = useRef([]);
  const linksRef = useRef([]);

  // Build nodes and links
  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ width: rect.width || 900, height: 500 });
  }, []);

  useEffect(() => {
    if (!contents || contents.length === 0) {
      setNodes([]);
      setLinks([]);
      return;
    }

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;

    // Create nodes
    const newNodes = contents.map((c, i) => {
      const angle = (2 * Math.PI * i) / contents.length;
      const radius = 150 + Math.random() * 100;
      return {
        id: c.id,
        content: c,
        label: c.title?.slice(0, 25) || 'Sans titre',
        type: c.content_type,
        tags: c.tags || [],
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 8 + Math.min((c.tags?.length || 0) * 2, 8)
      };
    });

    // Create links based on shared tags
    const newLinks = [];
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const sharedTags = newNodes[i].tags.filter(t => newNodes[j].tags.includes(t));
        if (sharedTags.length > 0) {
          newLinks.push({
            source: newNodes[i].id,
            target: newNodes[j].id,
            strength: sharedTags.length,
            tags: sharedTags
          });
        }
      }
    }

    // If no links exist, create a minimal connected network
    if (newLinks.length === 0 && newNodes.length > 1) {
      // Connect each node to 1-2 nearest neighbors
      for (let i = 0; i < newNodes.length; i++) {
        const next = (i + 1) % newNodes.length;
        newLinks.push({
          source: newNodes[i].id,
          target: newNodes[next].id,
          strength: 0.5,
          tags: []
        });
      }
    }

    // Also connect by parent_id if exists
    contents.forEach(c => {
      if (c.parent_id) {
        const exists = newLinks.find(l => 
          (l.source === c.id && l.target === c.parent_id) ||
          (l.source === c.parent_id && l.target === c.id)
        );
        if (!exists) {
          newLinks.push({
            source: c.id,
            target: c.parent_id,
            strength: 2,
            tags: ['parent']
          });
        }
      }
    });

    nodesRef.current = newNodes;
    linksRef.current = newLinks;
    setNodes(newNodes);
    setLinks(newLinks);

  }, [contents, dimensions]);

  // Physics simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const simulate = () => {
      const n = nodesRef.current;
      const l = linksRef.current;
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;

      // Repulsion between all nodes
      for (let i = 0; i < n.length; i++) {
        for (let j = i + 1; j < n.length; j++) {
          const dx = n[j].x - n[i].x;
          const dy = n[j].y - n[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = 60;
          if (dist < minDist * 3) {
            const force = (minDist * 2) / (dist * dist) * 2;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (n[i].id !== draggedNode) { n[i].vx -= fx; n[i].vy -= fy; }
            if (n[j].id !== draggedNode) { n[j].vx += fx; n[j].vy += fy; }
          }
        }
      }

      // Attraction along links
      for (const link of l) {
        const source = n.find(node => node.id === link.source);
        const target = n.find(node => node.id === link.target);
        if (!source || !target) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const idealDist = 120 / (link.strength || 1);
        const force = (dist - idealDist) * 0.02 * (link.strength || 1);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (source.id !== draggedNode) { source.vx += fx; source.vy += fy; }
        if (target.id !== draggedNode) { target.vx -= fx; target.vy -= fy; }
      }

      // Center gravity
      for (const node of n) {
        if (node.id === draggedNode) continue;
        node.vx += (cx - node.x) * 0.001;
        node.vy += (cy - node.y) * 0.001;

        // Apply velocity with damping
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;

        // Bounds
        const margin = 40;
        node.x = Math.max(margin, Math.min(dimensions.width - margin, node.x));
        node.y = Math.max(margin, Math.min(dimensions.height - margin, node.y));
      }

      setNodes([...n]);
      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [nodes.length, dimensions, draggedNode]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw links
    for (const link of links) {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (!source || !target) continue;

      const isHighlighted = hoveredNode && (source.id === hoveredNode || target.id === hoveredNode);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = isHighlighted ? '#000' : `rgba(0,0,0,${0.1 + (link.strength || 0.5) * 0.1})`;
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();

      // Draw link label on hover
      if (isHighlighted && link.tags.length > 0 && link.tags[0] !== 'parent') {
        const mx = (source.x + target.x) / 2;
        const my = (source.y + target.y) / 2;
        ctx.font = '10px system-ui';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(link.tags.join(', '), mx, my - 5);
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredNode === node.id;
      const isDragged = draggedNode === node.id;
      const isConnected = hoveredNode && links.some(l => 
        (l.source === hoveredNode && l.target === node.id) ||
        (l.target === hoveredNode && l.source === node.id)
      );

      // Glow effect on hover
      if (isHovered || isDragged) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 15, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, node.radius + 15);
        gradient.addColorStop(0, 'rgba(0,0,0,0.1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? node.radius + 3 : node.radius, 0, Math.PI * 2);
      
      if (isHovered || isDragged) {
        ctx.fillStyle = '#000';
      } else if (isConnected) {
        ctx.fillStyle = '#333';
      } else if (hoveredNode) {
        ctx.fillStyle = '#ccc';
      } else {
        ctx.fillStyle = '#555';
      }
      ctx.fill();

      // Node border
      ctx.strokeStyle = isHovered ? '#000' : 'transparent';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Type indicator
      const typeColors = { pdf: '#c0392b', image: '#27ae60', note: '#2980b9', audio: '#8e44ad', video: '#e67e22' };
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = typeColors[node.type] || '#fff';
      ctx.fill();
    }

    // Draw labels for hovered node and connected
    for (const node of nodes) {
      const isHovered = hoveredNode === node.id;
      const isConnected = hoveredNode && links.some(l => 
        (l.source === hoveredNode && l.target === node.id) ||
        (l.target === hoveredNode && l.source === node.id)
      );

      if (isHovered || isConnected) {
        // Background
        ctx.font = isHovered ? 'bold 13px system-ui' : '12px system-ui';
        const text = node.label;
        const metrics = ctx.measureText(text);
        const padding = 6;
        const bgX = node.x - metrics.width / 2 - padding;
        const bgY = node.y - node.radius - 24;
        
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.fillRect(bgX, bgY, metrics.width + padding * 2, 18);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(bgX, bgY, metrics.width + padding * 2, 18);

        // Text
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(text, node.x, node.y - node.radius - 10);

        // Type label below
        if (isHovered) {
          ctx.font = '10px system-ui';
          ctx.fillStyle = '#666';
          ctx.fillText(node.type, node.x, node.y + node.radius + 16);
        }
      }
    }

  }, [nodes, links, hoveredNode, draggedNode, dimensions]);

  // Mouse handlers
  const getNodeAt = (x, y) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 5) {
        return node;
      }
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggedNode) {
      const node = nodesRef.current.find(n => n.id === draggedNode);
      if (node) {
        node.x = x;
        node.y = y;
        node.vx = 0;
        node.vy = 0;
      }
    } else {
      const node = getNodeAt(x, y);
      setHoveredNode(node?.id || null);
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const node = getNodeAt(x, y);
    if (node) {
      setDraggedNode(node.id);
    }
  };

  const handleMouseUp = (e) => {
    if (draggedNode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const node = getNodeAt(x, y);
        // If released on same node without much movement, open it
        if (node && node.id === draggedNode) {
          const dragNode = nodesRef.current.find(n => n.id === draggedNode);
          if (dragNode) {
            onNodeClick(dragNode.content);
          }
        }
      }
      setDraggedNode(null);
    }
  };

  const handleClick = (e) => {
    if (draggedNode) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const node = getNodeAt(x, y);
    if (node) {
      onNodeClick(node.content);
    }
  };

  const t = T[lang];

  return (
    <div ref={containerRef} className="graph-wrapper">
      {nodes.length === 0 ? (
        <div className="graph-empty">
          <div className="empty-icon">◯</div>
          <p>{t.empty}</p>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setHoveredNode(null); setDraggedNode(null); }}
            onClick={handleClick}
            style={{ cursor: draggedNode ? 'grabbing' : (hoveredNode ? 'pointer' : 'default') }}
          />
          <div className="graph-stats">
            {nodes.length} éléments · {links.length} {t.graph.connections}
          </div>
          {hoveredNode && (
            <div className="graph-tooltip" style={{ left: mousePos.x, top: mousePos.y - 50 }}>
              {t.graph.clickToOpen}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function MatiereGrise() {
  const [lang, setLang] = useState('fr');
  const t = T[lang];
  
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  
  const [view, setView] = useState('landing');
  const [section, setSection] = useState('home');
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  const [contents, setContents] = useState([]);
  const [publicContents, setPublicContents] = useState([]);
  const [collectiveContents, setCollectiveContents] = useState([]);
  const [syntheses, setSyntheses] = useState([]);
  const [selected, setSelected] = useState([]);
  
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [searchWeb, setSearchWeb] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const chatRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('mg_token');
      const savedLang = localStorage.getItem('mg_lang');
      if (savedToken) setToken(savedToken);
      if (savedLang && T[savedLang]) setLang(savedLang);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      fetchPublic();
      fetchSyntheses();
      if (token) {
        fetchProfile();
        fetchContents();
        fetchConversations();
      }
    }
  }, [token, ready]);

  useEffect(() => {
    localStorage.setItem('mg_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // ═══════════════════════════════════════════════════════════════════════════
  // API CALLS
  // ═══════════════════════════════════════════════════════════════════════════

  const api = useCallback(async (endpoint, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
      if (res.status === 401) { logout(); throw new Error('Session expired'); }
      return res;
    } catch (e) {
      console.error('API Error:', e);
      throw e;
    }
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

  const fetchConversations = async () => {
    try {
      const res = await api('/api/conversations');
      if (res.ok) setConversations(await res.json());
    } catch (e) {}
  };

  const fetchCollective = async (strate) => {
    try {
      const res = await api(`/api/strate/${strate}/contents`);
      if (res.ok) setCollectiveContents(await res.json());
    } catch (e) {}
  };

  const fetchPublic = async () => {
    try {
      const res = await fetch(`${API_URL}/api/surface/contents`);
      if (res.ok) setPublicContents(await res.json());
    } catch (e) {}
  };

  const fetchSyntheses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/syntheses`);
      if (res.ok) setSyntheses(await res.json());
    } catch (e) {}
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
        const err = await res.json();
        alert(err.detail || 'Erreur');
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
    setConversations([]);
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
      if (res.ok) { fetchContents(); closeModal(); }
      else alert('Erreur upload');
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
      if (res.ok) { fetchContents(); closeModal(); }
    } catch (e) {}
    setLoading(false);
  };

  const handleGlissement = async (contentId, target, parentId = null) => {
    try {
      const res = await api('/api/glissements', {
        method: 'POST',
        body: JSON.stringify({ content_id: contentId, target_visibility: target, parent_id: parentId })
      });
      if (res.ok) { 
        fetchContents(); 
        fetchPublic(); 
        if (user?.strate) fetchCollective(user.strate);
        closeModal(); 
      }
    } catch (e) {}
  };

  const handleDelete = async (contentId) => {
    if (!confirm('Supprimer ?')) return;
    try {
      await api(`/api/contents/${contentId}`, { method: 'DELETE' });
      fetchContents();
    } catch (e) {}
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
          content_ids: selected.length > 0 ? selected : null,
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

  const loadConversation = async (conv) => {
    setCurrentConv(conv);
    try {
      const res = await api(`/api/conversations/${conv.id}/messages`);
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      setMessages([]);
    }
  };

  const newConversation = () => {
    setCurrentConv(null);
    setMessages([]);
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const cycleLang = () => {
    const langs = ['fr', 'en', 'ar'];
    setLang(langs[(langs.indexOf(lang) + 1) % langs.length]);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (!ready) return null;

  const isRTL = lang === 'ar';

  return (
    <div className={`app ${isRTL ? 'rtl' : ''}`}>
      <style>{styles}</style>

      {/* ═══ HEADER ═══ */}
      <header className="header">
        <div className="header-brand" onClick={() => { setView('landing'); setSection('home'); }}>
          <span className="logo-dot"></span>
          <span className="logo-text">{t.title}</span>
        </div>
        
        {view === 'landing' && (
          <nav className="header-nav">
            {['home', 'research', 'concept', 'about'].map(s => (
              <button key={s} className={section === s ? 'active' : ''} onClick={() => setSection(s)}>
                {t.nav[s]}
              </button>
            ))}
          </nav>
        )}

        <div className="header-actions">
          {token && user ? (
            <>
              <button className="nav-btn" onClick={() => setView('workspace')}>{t.workspace.mySpace}</button>
              <button className="nav-btn" onClick={() => { setView('collective'); fetchCollective(user.strate); }}>{t.workspace.collective}</button>
              <button className="user-btn" onClick={() => openModal('profile')}>
                <span className="user-avatar">{user.display_name?.[0] || '?'}</span>
              </button>
              <button className="nav-btn subtle" onClick={logout}>{t.auth.logout}</button>
            </>
          ) : (
            <>
              <button className="nav-btn" onClick={() => openModal('login')}>{t.auth.login}</button>
              <button className="nav-btn primary" onClick={() => openModal('register')}>{t.auth.register}</button>
            </>
          )}
          <button className="lang-btn" onClick={cycleLang}>{lang.toUpperCase()}</button>
        </div>
      </header>

      {/* ═══ LANDING ═══ */}
      {view === 'landing' && (
        <main className="landing">
          {section === 'home' && (
            <>
              <section className="hero">
                <h1>{t.title}</h1>
                <p className="hero-tagline">{t.tagline}</p>
                <div className="hero-cta">
                  <button className="btn-primary" onClick={() => openModal('register')}>
                    {t.auth.register}
                  </button>
                  <button className="btn-secondary" onClick={() => setSection('concept')}>
                    {t.nav.concept}
                  </button>
                </div>
              </section>

              <section className="section-graph">
                <div className="section-header">
                  <h2>Publications</h2>
                  <span className="section-line"></span>
                </div>
                <InteractiveGraph 
                  contents={publicContents} 
                  onNodeClick={(c) => openModal('content', c)} 
                  lang={lang}
                />
              </section>

              {syntheses.length > 0 && (
                <section className="section-syntheses">
                  <div className="section-header">
                    <h2>{t.workspace.syntheses}</h2>
                    <span className="section-line"></span>
                  </div>
                  <div className="syntheses-grid">
                    {syntheses.slice(0, 3).map(s => (
                      <article key={s.id} className="synthesis-card">
                        <span className="synthesis-meta">{s.scope}</span>
                        <h3>{s.title}</h3>
                        <p>{s.summary?.slice(0, 120)}...</p>
                        {s.key_themes?.length > 0 && (
                          <div className="synthesis-tags">
                            {s.key_themes.slice(0, 3).map((th, i) => <span key={i}>{th}</span>)}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <section className="section-partners">
                <div className="section-header">
                  <h2>Partenaires</h2>
                  <span className="section-line"></span>
                </div>
                <div className="partners-grid">
                  <div className="partner"><strong>INBA</strong>Tétouan</div>
                  <div className="partner"><strong>ENSP</strong>Arles</div>
                  <div className="partner"><strong>ISBAS</strong>Sousse</div>
                </div>
              </section>
            </>
          )}

          {section === 'research' && (
            <section className="page-content">
              <h1>{t.nav.research}</h1>
              <div className="research-areas">
                <article>
                  <h3>Archéologie des savoirs</h3>
                  <p>Traditions mathématiques et optiques du monde arabo-islamique médiéval.</p>
                </article>
                <article>
                  <h3>Matérialité du calcul</h3>
                  <p>Substrats physiques de l'intelligence : silicium, terres rares, géologie.</p>
                </article>
                <article>
                  <h3>Création algorithmique</h3>
                  <p>Pratiques artistiques croisant traditions artisanales et systèmes génératifs.</p>
                </article>
              </div>
              {publicContents.length > 0 && (
                <InteractiveGraph contents={publicContents} onNodeClick={(c) => openModal('content', c)} lang={lang} />
              )}
            </section>
          )}

          {section === 'concept' && (
            <section className="page-content">
              <h1>{t.nav.concept}</h1>
              <p className="page-intro">Plateforme structurée en strates géologiques, reflétant la sédimentation des savoirs.</p>
              <div className="strates-visual">
                <div className="strate"><span>0m</span><div><strong>Surface</strong>Publications ouvertes</div></div>
                <div className="strate"><span>−500m</span><div><strong>Épistémè</strong>Espace pédagogues</div></div>
                <div className="strate"><span>−2km</span><div><strong>Sédiment</strong>Espace chercheurs</div></div>
                <div className="strate"><span>−∞</span><div><strong>Manteau</strong>IA autonome</div></div>
              </div>
            </section>
          )}

          {section === 'about' && (
            <section className="page-content">
              <h1>{t.nav.about}</h1>
              <p>Projet inter-institutionnel initié en 2025.</p>
              <p>Contact : matiere.grise@ensp-arles.fr</p>
            </section>
          )}
        </main>
      )}

      {/* ═══ WORKSPACE ═══ */}
      {view === 'workspace' && token && user && (
        <div className="workspace">
          <aside className="sidebar">
            <div className="sidebar-section">
              <span className="sidebar-title">{t.workspace.import}</span>
              <button onClick={() => openModal('upload')}>+ {t.content.document}</button>
              <button onClick={() => openModal('note')}>+ {t.content.note}</button>
            </div>
            
            <div className="sidebar-section">
              <span className="sidebar-title">Conversations</span>
              <button className="new-conv" onClick={newConversation}>+ Nouvelle</button>
              {conversations.slice(0, 5).map(c => (
                <button 
                  key={c.id} 
                  className={currentConv?.id === c.id ? 'active' : ''}
                  onClick={() => loadConversation(c)}
                >
                  {c.title?.slice(0, 20) || 'Conv...'}
                </button>
              ))}
            </div>

            <div className="sidebar-section">
              <button onClick={() => { setView('collective'); fetchCollective(user.strate); }}>→ {t.workspace.collective}</button>
              <button onClick={() => setView('landing')}>→ {t.nav.home}</button>
            </div>
          </aside>

          <main className="workspace-main">
            <div className="workspace-header">
              <h1>{t.workspace.mySpace}</h1>
              {selected.length > 0 && <span className="selection-count">{selected.length} {t.selected}</span>}
            </div>

            {contents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">+</div>
                <p>{t.empty}</p>
                <button onClick={() => openModal('upload')}>{t.workspace.import}</button>
              </div>
            ) : (
              <div className="content-grid">
                {contents.map(c => (
                  <div 
                    key={c.id} 
                    className={`content-card ${selected.includes(c.id) ? 'selected' : ''}`}
                    onClick={() => toggleSelect(c.id)}
                  >
                    <div className="card-header">
                      <span className={`card-type ${c.content_type}`}>{c.content_type}</span>
                      <span className={`card-status ${c.is_indexed ? 'indexed' : ''}`}></span>
                    </div>
                    <h3>{c.title}</h3>
                    {c.tags?.length > 0 && (
                      <div className="card-tags">
                        {c.tags.slice(0, 3).map((tag, i) => <span key={i}>{tag}</span>)}
                      </div>
                    )}
                    <div className="card-actions">
                      <button onClick={(e) => { e.stopPropagation(); openModal('content', c); }}>{t.actions.view}</button>
                      <button onClick={(e) => { e.stopPropagation(); openModal('glissement', c); }}>{t.actions.slide}</button>
                      <button className="danger" onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          <aside className="chat-panel">
            <div className="chat-header">
              <span>{t.chat.title}</span>
              <label className="chat-toggle">
                <input type="checkbox" checked={searchWeb} onChange={e => setSearchWeb(e.target.checked)} />
                <span>{t.chat.web}</span>
              </label>
            </div>

            <div className="chat-messages" ref={chatRef}>
              {messages.length === 0 ? (
                <div className="chat-empty">
                  <p>{t.chat.placeholder}</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`message ${m.role}`}>
                    <div className="message-content">{m.content}</div>
                    {m.sources?.length > 0 && (
                      <div className="message-sources">
                        <strong>{t.chat.sources}:</strong> {m.sources.map(s => s.title).join(', ')}
                      </div>
                    )}
                    {m.web_results?.length > 0 && (
                      <div className="message-web">
                        {m.web_results.slice(0, 3).map((r, j) => (
                          <a key={j} href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
              {loading && <div className="message assistant loading">{t.chat.thinking}</div>}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChat()}
                placeholder={t.chat.placeholder}
              />
              <button onClick={handleChat} disabled={loading || !chatInput.trim()}>↑</button>
            </div>
          </aside>
        </div>
      )}

      {/* ═══ COLLECTIVE ═══ */}
      {view === 'collective' && token && user && (
        <div className="collective-view">
          <div className="collective-header">
            <button className="back-btn" onClick={() => setView('workspace')}>← {t.actions.back}</button>
            <h1>{t.workspace.collective} — {user.strate}</h1>
          </div>
          <InteractiveGraph contents={collectiveContents} onNodeClick={(c) => openModal('content', c)} lang={lang} />
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>

            {modal === 'login' && (
              <div className="modal-content">
                <h2>{t.auth.login}</h2>
                <LoginForm t={t} onSubmit={login} loading={loading} />
              </div>
            )}

            {modal === 'register' && (
              <div className="modal-content">
                <h2>{t.auth.register}</h2>
                <RegisterForm t={t} onSubmit={register} loading={loading} />
              </div>
            )}

            {modal === 'profile' && user && (
              <div className="modal-content">
                <h2>{t.profile}</h2>
                <ProfileForm t={t} user={user} token={token} apiUrl={API_URL} onClose={closeModal} onUpdate={fetchProfile} />
              </div>
            )}

            {modal === 'upload' && (
              <div className="modal-content">
                <h2>{t.workspace.import}</h2>
                <UploadForm t={t} onSubmit={handleUpload} loading={loading} onClose={closeModal} />
              </div>
            )}

            {modal === 'note' && (
              <div className="modal-content">
                <h2>{t.content.note}</h2>
                <NoteForm t={t} onSubmit={handleCreateNote} loading={loading} onClose={closeModal} />
              </div>
            )}

            {modal === 'glissement' && modalData && (
              <div className="modal-content">
                <h2>{t.glissement.title}</h2>
                <GlissementForm t={t} content={modalData} allContents={contents} onSubmit={handleGlissement} onClose={closeModal} />
              </div>
            )}

            {modal === 'content' && modalData && (
              <div className="modal-content modal-large">
                <ContentViewer t={t} content={modalData} apiUrl={API_URL} />
              </div>
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

function LoginForm({ t, onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form className="form" onSubmit={e => { e.preventDefault(); onSubmit(email, password); }}>
      <div className="form-field">
        <label>{t.auth.email}</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
      </div>
      <div className="form-field">
        <label>{t.auth.password}</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="btn-submit" disabled={loading}>{t.auth.login}</button>
    </form>
  );
}

function RegisterForm({ t, onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chercheur');
  const [code, setCode] = useState('');
  return (
    <form className="form" onSubmit={e => { e.preventDefault(); onSubmit(email, password, role, code); }}>
      <div className="form-field">
        <label>{t.auth.email}</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
      </div>
      <div className="form-field">
        <label>{t.auth.password}</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="form-field">
        <label>Rôle</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="chercheur">{t.roles.researcher}</option>
          <option value="pedagogue">{t.roles.pedagogue}</option>
        </select>
      </div>
      <div className="form-field">
        <label>{t.auth.code}</label>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="CHERCHEUR2026" required />
      </div>
      <button type="submit" className="btn-submit" disabled={loading}>{t.auth.register}</button>
    </form>
  );
}

function ProfileForm({ t, user, token, apiUrl, onClose, onUpdate }) {
  const [name, setName] = useState(user.display_name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${apiUrl}/api/profile/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ display_name: name, bio })
    });
    onUpdate();
    onClose();
  };

  return (
    <form className="form" onSubmit={submit}>
      <div className="profile-meta">{user.email} · {user.role} · {user.strate}</div>
      <div className="form-field">
        <label>Nom</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-field">
        <label>Bio</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>{t.actions.cancel}</button>
        <button type="submit" className="btn-submit" disabled={loading}>{t.actions.save}</button>
      </div>
    </form>
  );
}

function UploadForm({ t, onSubmit, loading, onClose }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');

  return (
    <form className="form" onSubmit={e => {
      e.preventDefault();
      if (file) onSubmit(file, title, desc, tags.split(',').map(t => t.trim()).filter(Boolean));
    }}>
      <div className="form-field">
        <label>{t.content.file}</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,image/*,audio/*,video/*"
          onChange={e => {
            const f = e.target.files?.[0];
            setFile(f);
            if (f && !title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
          }}
          required
        />
      </div>
      <div className="form-field">
        <label>{t.content.title}</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-field">
        <label>{t.content.description}</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} />
      </div>
      <div className="form-field">
        <label>{t.content.tags}</label>
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2, tag3" />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>{t.actions.cancel}</button>
        <button type="submit" className="btn-submit" disabled={loading || !file}>{t.workspace.import}</button>
      </div>
    </form>
  );
}

function NoteForm({ t, onSubmit, loading, onClose }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');

  return (
    <form className="form" onSubmit={e => {
      e.preventDefault();
      onSubmit(title, text, tags.split(',').map(t => t.trim()).filter(Boolean));
    }}>
      <div className="form-field">
        <label>{t.content.title}</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
      </div>
      <div className="form-field">
        <label>Contenu</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={8} required />
      </div>
      <div className="form-field">
        <label>{t.content.tags}</label>
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2" />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>{t.actions.cancel}</button>
        <button type="submit" className="btn-submit" disabled={loading}>{t.actions.save}</button>
      </div>
    </form>
  );
}

function GlissementForm({ t, content, allContents, onSubmit, onClose }) {
  const [target, setTarget] = useState('strate');
  const [parentId, setParentId] = useState('');

  const parents = allContents.filter(c => c.id !== content.id);

  return (
    <div className="form">
      <div className="glissement-content-title">{content.title}</div>
      
      <div className="form-field">
        <label>{t.glissement.parent}</label>
        <select value={parentId} onChange={e => setParentId(e.target.value)}>
          <option value="">{t.glissement.none}</option>
          {parents.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="form-field">
        <label>Destination</label>
        <div className="glissement-targets">
          <button type="button" className={target === 'strate' ? 'active' : ''} onClick={() => setTarget('strate')}>
            {t.glissement.collective}
          </button>
          <button type="button" className={target === 'public' ? 'active' : ''} onClick={() => setTarget('public')}>
            {t.glissement.surface}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>{t.actions.cancel}</button>
        <button type="button" className="btn-submit" onClick={() => onSubmit(content.id, target, parentId || null)}>
          {t.actions.slide}
        </button>
      </div>
    </div>
  );
}

function ContentViewer({ t, content, apiUrl }) {
  const fileUrl = content.file_url
    ? (content.file_url.startsWith('http') ? content.file_url : `${apiUrl}${content.file_url}`)
    : null;

  const type = content.content_type || '';
  const mime = content.mime_type || '';

  return (
    <div className="content-viewer">
      <div className="viewer-header">
        <span className={`viewer-type ${type}`}>{type}</span>
        <h2>{content.title}</h2>
        {content.owner_name && <span className="viewer-author">par {content.owner_name}</span>}
      </div>

      <div className="viewer-body">
        {type === 'pdf' && fileUrl && <iframe src={fileUrl} title={content.title} />}
        {(type === 'image' || mime.startsWith('image/')) && fileUrl && <img src={fileUrl} alt={content.title} />}
        {(type === 'audio' || mime.startsWith('audio/')) && fileUrl && <audio controls src={fileUrl} />}
        {(type === 'video' || mime.startsWith('video/')) && fileUrl && <video controls src={fileUrl} />}
        
        {content.vision_description && (
          <div className="viewer-vision">
            <strong>Analyse IA</strong>
            <p>{content.vision_description}</p>
          </div>
        )}

        {content.text_content && (
          <div className="viewer-text">
            <p>{content.text_content}</p>
          </div>
        )}

        {content.description && <p className="viewer-desc">{content.description}</p>}

        {content.tags?.length > 0 && (
          <div className="viewer-tags">
            {content.tags.map((tag, i) => <span key={i}>{tag}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = `
:root {
  --black: #000;
  --white: #fff;
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-400: #a3a3a3;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #262626;
  --gray-900: #171717;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.app {
  min-height: 100vh;
  background: var(--white);
  color: var(--black);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.app.rtl { direction: rtl; }

/* ═══ HEADER ═══ */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-dot {
  width: 10px;
  height: 10px;
  background: var(--black);
  border-radius: 50%;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.header-nav {
  display: flex;
  gap: 8px;
}

.header-nav button {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--gray-600);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.header-nav button:hover {
  background: var(--gray-100);
  color: var(--black);
}

.header-nav button.active {
  background: var(--black);
  color: var(--white);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-btn {
  background: none;
  border: 1px solid var(--gray-200);
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.nav-btn:hover {
  border-color: var(--black);
}

.nav-btn.primary {
  background: var(--black);
  color: var(--white);
  border-color: var(--black);
}

.nav-btn.subtle {
  border: none;
  color: var(--gray-500);
}

.user-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--black);
  color: var(--white);
  border-radius: 50%;
  font-size: 14px;
  font-weight: 500;
}

.lang-btn {
  background: var(--gray-100);
  border: none;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
}

/* ═══ LANDING ═══ */
.landing {
  padding-top: 60px;
}

.hero {
  max-width: 600px;
  margin: 0 auto;
  padding: 100px 32px 80px;
  text-align: center;
}

.hero h1 {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 20px;
}

.hero-tagline {
  font-size: 20px;
  color: var(--gray-500);
  margin-bottom: 40px;
}

.hero-cta {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--black);
  color: var(--white);
  border: 1px solid var(--black);
}

.btn-primary:hover {
  background: var(--gray-800);
}

.btn-secondary {
  background: var(--white);
  color: var(--black);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  border-color: var(--black);
}

.section-graph, .section-syntheses, .section-partners {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray-500);
}

.section-line {
  flex: 1;
  height: 1px;
  background: var(--gray-200);
}

/* ═══ GRAPH ═══ */
.graph-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
}

.graph-wrapper canvas {
  display: block;
}

.graph-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.graph-stats {
  position: absolute;
  bottom: 16px;
  left: 16px;
  font-size: 12px;
  color: var(--gray-400);
}

.graph-tooltip {
  position: absolute;
  background: var(--black);
  color: var(--white);
  padding: 4px 10px;
  font-size: 11px;
  border-radius: 4px;
  pointer-events: none;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* ═══ SYNTHESES ═══ */
.syntheses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.synthesis-card {
  padding: 24px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  transition: border-color 0.15s ease;
}

.synthesis-card:hover {
  border-color: var(--black);
}

.synthesis-meta {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray-400);
}

.synthesis-card h3 {
  font-size: 16px;
  margin: 8px 0;
}

.synthesis-card p {
  font-size: 14px;
  color: var(--gray-600);
}

.synthesis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
}

.synthesis-tags span {
  font-size: 11px;
  padding: 3px 8px;
  background: var(--gray-100);
  border-radius: 4px;
}

/* ═══ PARTNERS ═══ */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.partner {
  padding: 24px;
  text-align: center;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
}

.partner strong {
  display: block;
  font-size: 18px;
  margin-bottom: 4px;
}

/* ═══ PAGE CONTENT ═══ */
.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 32px 60px;
}

.page-content h1 {
  font-size: 40px;
  margin-bottom: 24px;
}

.page-intro {
  font-size: 18px;
  color: var(--gray-600);
  margin-bottom: 48px;
}

.research-areas {
  display: grid;
  gap: 24px;
  margin-bottom: 48px;
}

.research-areas article {
  padding: 24px;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
}

.research-areas h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.research-areas p {
  color: var(--gray-600);
}

.strates-visual {
  border: 1px solid var(--black);
  border-radius: 12px;
  overflow: hidden;
}

.strate {
  display: flex;
  border-bottom: 1px solid var(--gray-200);
}

.strate:last-child {
  border-bottom: none;
}

.strate span {
  width: 80px;
  padding: 20px;
  background: var(--gray-100);
  font-family: monospace;
  font-size: 13px;
  text-align: right;
}

.strate > div {
  flex: 1;
  padding: 20px;
}

.strate strong {
  display: block;
  margin-bottom: 4px;
}

/* ═══ WORKSPACE ═══ */
.workspace {
  display: flex;
  padding-top: 60px;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  padding: 20px;
  border-right: 1px solid var(--gray-200);
  overflow-y: auto;
  background: var(--white);
}

.sidebar-section {
  margin-bottom: 28px;
}

.sidebar-title {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gray-400);
  margin-bottom: 12px;
}

.sidebar button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: none;
  border: none;
  font-size: 14px;
  color: var(--gray-700);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.1s ease;
  margin-bottom: 2px;
}

.sidebar button:hover {
  background: var(--gray-100);
}

.sidebar button.active {
  background: var(--black);
  color: var(--white);
}

.sidebar button.new-conv {
  color: var(--gray-500);
}

.workspace-main {
  flex: 1;
  margin-left: 220px;
  margin-right: 340px;
  padding: 32px;
}

.workspace-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.workspace-header h1 {
  font-size: 28px;
}

.selection-count {
  font-size: 13px;
  background: var(--black);
  color: var(--white);
  padding: 4px 12px;
  border-radius: 20px;
}

.empty-state {
  text-align: center;
  padding: 80px 32px;
}

.empty-state .empty-icon {
  font-size: 64px;
  color: var(--gray-200);
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--gray-400);
  margin-bottom: 24px;
}

.empty-state button {
  padding: 12px 24px;
  background: var(--black);
  color: var(--white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.content-card {
  padding: 20px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.content-card:hover {
  border-color: var(--gray-400);
}

.content-card.selected {
  border-color: var(--black);
  box-shadow: 0 0 0 1px var(--black);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-type {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  background: var(--gray-100);
  border-radius: 4px;
}

.card-type.pdf { background: #fef2f2; color: #dc2626; }
.card-type.image { background: #f0fdf4; color: #16a34a; }
.card-type.note { background: #eff6ff; color: #2563eb; }
.card-type.audio { background: #faf5ff; color: #9333ea; }
.card-type.video { background: #fff7ed; color: #ea580c; }

.card-status {
  width: 8px;
  height: 8px;
  background: var(--gray-200);
  border-radius: 50%;
}

.card-status.indexed {
  background: var(--black);
}

.content-card h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.card-tags span {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--gray-100);
  border-radius: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.content-card:hover .card-actions {
  opacity: 1;
}

.card-actions button {
  padding: 6px 12px;
  font-size: 12px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 6px;
  cursor: pointer;
}

.card-actions button:hover {
  border-color: var(--black);
}

.card-actions button.danger:hover {
  border-color: #dc2626;
  color: #dc2626;
}

/* ═══ CHAT ═══ */
.chat-panel {
  width: 340px;
  position: fixed;
  top: 60px;
  bottom: 0;
  right: 0;
  background: var(--white);
  border-left: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header span {
  font-weight: 500;
}

.chat-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-500);
  cursor: pointer;
}

.chat-toggle input {
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.chat-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
}

.message {
  margin-bottom: 20px;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
}

.message.user .message-content {
  background: var(--gray-100);
  padding: 12px 16px;
  border-radius: 12px 12px 4px 12px;
}

.message.assistant .message-content {
  padding: 12px 0;
  border-bottom: 1px solid var(--gray-100);
}

.message.loading {
  color: var(--gray-400);
  font-style: italic;
}

.message-sources, .message-web {
  margin-top: 12px;
  padding: 12px;
  background: var(--gray-50);
  border-radius: 8px;
  font-size: 12px;
}

.message-web a {
  display: block;
  color: var(--gray-600);
  text-decoration: none;
  padding: 4px 0;
}

.message-web a:hover {
  color: var(--black);
}

.chat-input-area {
  padding: 16px 20px;
  border-top: 1px solid var(--gray-200);
  display: flex;
  gap: 8px;
}

.chat-input-area input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
}

.chat-input-area input:focus {
  outline: none;
  border-color: var(--black);
}

.chat-input-area button {
  width: 44px;
  height: 44px;
  background: var(--black);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
}

.chat-input-area button:disabled {
  opacity: 0.3;
}

/* ═══ COLLECTIVE ═══ */
.collective-view {
  padding: 100px 32px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.collective-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.back-btn {
  background: none;
  border: 1px solid var(--gray-200);
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
}

.collective-header h1 {
  font-size: 28px;
}

/* ═══ MODAL ═══ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.modal-container {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-container.modal-large {
  max-width: 700px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: var(--gray-100);
  border: none;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  color: var(--gray-500);
}

.modal-close:hover {
  background: var(--gray-200);
  color: var(--black);
}

.modal-content {
  padding: 32px;
}

.modal-content h2 {
  font-size: 24px;
  margin-bottom: 24px;
}

/* ═══ FORMS ═══ */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray-500);
  margin-bottom: 8px;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: var(--black);
}

.form-field textarea {
  resize: vertical;
  min-height: 100px;
}

.profile-meta {
  padding: 12px 16px;
  background: var(--gray-50);
  border-radius: 8px;
  font-size: 13px;
  color: var(--gray-600);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel, .btn-submit {
  flex: 1;
  padding: 14px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-cancel {
  background: var(--white);
  border: 1px solid var(--gray-200);
  color: var(--gray-700);
}

.btn-cancel:hover {
  border-color: var(--gray-400);
}

.btn-submit {
  background: var(--black);
  border: 1px solid var(--black);
  color: var(--white);
}

.btn-submit:disabled {
  opacity: 0.3;
}

/* ═══ GLISSEMENT ═══ */
.glissement-content-title {
  font-weight: 500;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 20px;
}

.glissement-targets {
  display: flex;
  gap: 12px;
}

.glissement-targets button {
  flex: 1;
  padding: 16px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.glissement-targets button:hover {
  border-color: var(--gray-400);
}

.glissement-targets button.active {
  background: var(--black);
  color: var(--white);
  border-color: var(--black);
}

/* ═══ CONTENT VIEWER ═══ */
.content-viewer {
}

.viewer-header {
  margin-bottom: 24px;
}

.viewer-type {
  display: inline-block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  background: var(--gray-100);
  border-radius: 4px;
  margin-bottom: 12px;
}

.viewer-header h2 {
  font-size: 24px;
  margin-bottom: 4px;
}

.viewer-author {
  font-size: 14px;
  color: var(--gray-500);
}

.viewer-body iframe {
  width: 100%;
  height: 400px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
}

.viewer-body img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.viewer-body audio,
.viewer-body video {
  width: 100%;
  border-radius: 8px;
}

.viewer-vision {
  margin-top: 24px;
  padding: 16px;
  background: var(--gray-50);
  border-left: 3px solid var(--black);
  border-radius: 0 8px 8px 0;
}

.viewer-vision strong {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.viewer-vision p {
  font-size: 14px;
  color: var(--gray-700);
}

.viewer-text {
  margin-top: 24px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 14px;
  white-space: pre-wrap;
}

.viewer-desc {
  margin-top: 24px;
  font-style: italic;
  color: var(--gray-600);
}

.viewer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}

.viewer-tags span {
  font-size: 12px;
  padding: 4px 12px;
  background: var(--gray-100);
  border-radius: 20px;
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 1100px) {
  .workspace-main { margin-right: 0; }
  .chat-panel { display: none; }
}

@media (max-width: 800px) {
  .header-nav { display: none; }
  .sidebar { display: none; }
  .workspace-main { margin-left: 0; }
  .syntheses-grid, .partners-grid { grid-template-columns: 1fr; }
  .hero h1 { font-size: 40px; }
}
`;
