// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v6 — Design Minimaliste + Graph View
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://candidate-offshore-utilities-eventually.trycloudflare.com';

// ═══════════════════════════════════════════════════════════════════════════════
// GRAPH VIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function GraphView({ contents, onNodeClick, hoveredNode, setHoveredNode }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [nodes, setNodes] = useState([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ width: rect.width || 800, height: 400 });
  }, []);

  useEffect(() => {
    if (!contents || contents.length === 0) return;

    const tagGroups = {};
    const contentNodes = contents.map((c, i) => {
      const angle = (2 * Math.PI * i) / contents.length;
      const radius = 120 + Math.random() * 60;
      const tags = c.tags || [];
      tags.forEach(tag => {
        if (!tagGroups[tag]) tagGroups[tag] = [];
        tagGroups[tag].push(c.id);
      });
      return {
        id: `content-${c.id}`,
        contentId: c.id,
        label: c.title?.slice(0, 25) || 'Sans titre',
        type: c.content_type,
        x: dimensions.width / 2 + Math.cos(angle) * radius,
        y: dimensions.height / 2 + Math.sin(angle) * radius,
        vx: 0, vy: 0,
        radius: 5
      };
    });

    const tagNodes = Object.keys(tagGroups).map((tag, i) => {
      const angle = (2 * Math.PI * i) / Object.keys(tagGroups).length + 0.5;
      return {
        id: `tag-${tag}`,
        label: `#${tag}`,
        type: 'tag',
        x: dimensions.width / 2 + Math.cos(angle) * 60,
        y: dimensions.height / 2 + Math.sin(angle) * 60,
        vx: 0, vy: 0,
        radius: 8
      };
    });

    const links = [];
    contents.forEach(c => {
      (c.tags || []).forEach(tag => {
        links.push({ source: `content-${c.id}`, target: `tag-${tag}` });
      });
    });

    const allNodes = [...contentNodes, ...tagNodes];
    
    // Simple physics simulation
    let alpha = 1;
    const simulate = () => {
      if (alpha < 0.01) return;
      
      // Repulsion
      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const dx = allNodes[j].x - allNodes[i].x;
          const dy = allNodes[j].y - allNodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (100 * alpha) / dist;
          allNodes[i].vx -= (dx / dist) * force;
          allNodes[i].vy -= (dy / dist) * force;
          allNodes[j].vx += (dx / dist) * force;
          allNodes[j].vy += (dy / dist) * force;
        }
      }

      // Attraction
      for (const link of links) {
        const source = allNodes.find(n => n.id === link.source);
        const target = allNodes.find(n => n.id === link.target);
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 60) * 0.03 * alpha;
        source.vx += (dx / dist) * force;
        source.vy += (dy / dist) * force;
        target.vx -= (dx / dist) * force;
        target.vy -= (dy / dist) * force;
      }

      // Center gravity
      for (const node of allNodes) {
        node.vx += (dimensions.width / 2 - node.x) * 0.008 * alpha;
        node.vy += (dimensions.height / 2 - node.y) * 0.008 * alpha;
        node.vx *= 0.6;
        node.vy *= 0.6;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(40, Math.min(dimensions.width - 40, node.x));
        node.y = Math.max(40, Math.min(dimensions.height - 40, node.y));
      }

      alpha -= 0.015;
      setNodes([...allNodes]);
      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [contents, dimensions]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Links
    const links = [];
    contents?.forEach(c => {
      (c.tags || []).forEach(tag => {
        links.push({ source: `content-${c.id}`, target: `tag-${tag}` });
      });
    });

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (const link of links) {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    }

    // Nodes
    for (const node of nodes) {
      const isHovered = hoveredNode === node.id;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? node.radius + 3 : node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'tag' ? '#000' : (isHovered ? '#000' : '#666');
      ctx.fill();

      if (isHovered) {
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - node.radius - 10);
      }
    }
  }, [nodes, hoveredNode, dimensions, contents]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = null;
    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 8) {
        found = node.id;
        break;
      }
    }
    setHoveredNode(found);
  };

  const handleClick = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 8) {
        if (node.contentId) {
          const content = contents.find(c => c.id === node.contentId);
          if (content) onNodeClick(content);
        }
        break;
      }
    }
  };

  return (
    <div ref={containerRef} className="graph-container">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={handleClick}
        style={{ cursor: hoveredNode ? 'pointer' : 'default' }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MatiereGrise() {
  const [lang, setLang] = useState('fr');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  
  const [view, setView] = useState('landing');
  const [section, setSection] = useState('accueil');
  
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  const [contents, setContents] = useState([]);
  const [publicContents, setPublicContents] = useState([]);
  const [collectiveContents, setCollectiveContents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [chatInput, setChatInput] = useState('');
  const [searchWeb, setSearchWeb] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  
  const chatRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('mg_token');
      if (t) setToken(t);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      fetchPublic();
      if (token) {
        fetchProfile();
        fetchContents();
        fetchConversations();
      }
    }
  }, [token, ready]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const api = useCallback(async (endpoint, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
    if (res.status === 401) { logout(); throw new Error('Session expirée'); }
    return res;
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await api('/api/profile/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (!data.is_profile_complete) openModal('profile');
      }
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
        alert((await res.json()).detail || 'Erreur');
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
        alert((await res.json()).detail || 'Erreur');
      }
    } catch (e) { alert('Erreur de connexion'); }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('mg_token');
    setToken(null);
    setUser(null);
    setContents([]);
    setView('landing');
  };

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

  const handleGlissement = async (contentId, target) => {
    try {
      const res = await api('/api/glissements', {
        method: 'POST',
        body: JSON.stringify({ content_id: contentId, target_visibility: target })
      });
      if (res.ok) { fetchContents(); fetchPublic(); closeModal(); }
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
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatInput('');
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
          sources: data.sources
        }]);
        if (!currentConv) {
          setCurrentConv({ id: data.conversation_id });
          fetchConversations();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion.' }]);
    }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (!ready) return null;

  return (
    <div className="app">
      <style>{styles}</style>

      {/* HEADER */}
      <header className="header">
        <span className="logo" onClick={() => setView('landing')}>Matière Grise</span>
        
        <nav className="nav">
          {view === 'landing' && (
            <>
              <button className={section === 'accueil' ? 'active' : ''} onClick={() => setSection('accueil')}>Accueil</button>
              <button className={section === 'recherche' ? 'active' : ''} onClick={() => setSection('recherche')}>Recherche</button>
              <button className={section === 'concept' ? 'active' : ''} onClick={() => setSection('concept')}>Concept</button>
              <button className={section === 'apropos' ? 'active' : ''} onClick={() => setSection('apropos')}>À propos</button>
            </>
          )}
        </nav>

        <div className="header-right">
          {token && user ? (
            <>
              <button onClick={() => setView('workspace')}>Mon espace</button>
              <button onClick={() => { setView('collective'); fetchCollective(user.strate); }}>Collectif</button>
              <button onClick={() => openModal('profile')}>{user.display_name}</button>
              <button onClick={logout}>Sortir</button>
            </>
          ) : (
            <>
              <button onClick={() => openModal('login')}>Connexion</button>
              <button className="primary" onClick={() => openModal('register')}>Inscription</button>
            </>
          )}
          <button className="lang" onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}>
            {lang === 'fr' ? 'ع' : 'Fr'}
          </button>
        </div>
      </header>

      {/* LANDING */}
      {view === 'landing' && (
        <main className="landing">
          {section === 'accueil' && (
            <>
              <section className="hero">
                <h1>Matière Grise</h1>
                <p className="tagline">Les origines terrestres de l'intelligence artificielle</p>
                <p className="intro">
                  Une plateforme de recherche-création explorant les fondements 
                  matériels et épistémologiques de l'IA.
                </p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => openModal('register')}>Rejoindre</button>
                  <button onClick={() => setSection('concept')}>En savoir plus</button>
                </div>
              </section>

              <section className="section">
                <h2>Publications</h2>
                {publicContents.length > 0 ? (
                  <GraphView 
                    contents={publicContents}
                    onNodeClick={(c) => openModal('content', c)}
                    hoveredNode={hoveredNode}
                    setHoveredNode={setHoveredNode}
                  />
                ) : (
                  <div className="empty">Aucune publication</div>
                )}
              </section>

              <section className="section">
                <h2>Partenaires</h2>
                <div className="partners">
                  <div><strong>INBA</strong><br/>Institut National des Beaux-Arts de Tétouan</div>
                  <div><strong>ENSP</strong><br/>École Nationale Supérieure de la Photographie d'Arles</div>
                  <div><strong>ISBAS</strong><br/>Institut Supérieur des Beaux-Arts de Sousse</div>
                </div>
              </section>
            </>
          )}

          {section === 'recherche' && (
            <section className="page">
              <h1>Recherche</h1>
              <p>Nos axes explorent les intersections entre savoirs traditionnels et technologies contemporaines.</p>
              
              <div className="grid">
                <div className="card">
                  <h3>Archéologie des savoirs</h3>
                  <p>Traditions mathématiques et optiques du monde arabo-islamique médiéval.</p>
                </div>
                <div className="card">
                  <h3>Matérialité du calcul</h3>
                  <p>Substrats physiques de l'intelligence : silicium, terres rares, géologie.</p>
                </div>
                <div className="card">
                  <h3>Création algorithmique</h3>
                  <p>Pratiques artistiques croisant traditions artisanales et systèmes génératifs.</p>
                </div>
              </div>

              {publicContents.length > 0 && (
                <>
                  <h2>Publications</h2>
                  <GraphView 
                    contents={publicContents}
                    onNodeClick={(c) => openModal('content', c)}
                    hoveredNode={hoveredNode}
                    setHoveredNode={setHoveredNode}
                  />
                </>
              )}
            </section>
          )}

          {section === 'concept' && (
            <section className="page">
              <h1>Concept</h1>
              <p>Matière Grise est structurée en strates géologiques, reflétant la sédimentation des savoirs.</p>

              <div className="strates">
                <div className="strate"><span>0m</span><div><strong>Surface</strong> — Publications ouvertes</div></div>
                <div className="strate"><span>−500m</span><div><strong>Épistémè</strong> — Espace pédagogues</div></div>
                <div className="strate"><span>−2km</span><div><strong>Sédiment</strong> — Espace chercheurs</div></div>
                <div className="strate"><span>−∞</span><div><strong>Manteau</strong> — IA autonome</div></div>
              </div>

              <div className="concept-box">
                <h3>Glissement</h3>
                <p>Les contenus circulent entre strates par "glissement" : de l'espace privé vers le collectif, puis vers la surface.</p>
              </div>
            </section>
          )}

          {section === 'apropos' && (
            <section className="page">
              <h1>À propos</h1>
              <p>Projet inter-institutionnel initié en 2025, réunissant artistes, chercheurs et pédagogues.</p>
              <h3>Contact</h3>
              <p>matiere.grise@ensp-arles.fr</p>
            </section>
          )}
        </main>
      )}

      {/* WORKSPACE */}
      {view === 'workspace' && token && user && (
        <div className="workspace">
          <aside className="sidebar">
            <div className="sb-group">
              <span className="sb-title">Importer</span>
              <button onClick={() => openModal('upload')}>+ Document</button>
              <button onClick={() => openModal('note')}>+ Note</button>
            </div>
            <div className="sb-group">
              <span className="sb-title">Navigation</span>
              <button onClick={() => { setView('collective'); fetchCollective(user.strate); }}>→ Collectif</button>
              <button onClick={() => setView('landing')}>→ Surface</button>
            </div>
          </aside>

          <main className="main">
            <h1>Mon espace {selected.length > 0 && <span className="badge">{selected.length}</span>}</h1>

            {contents.length === 0 ? (
              <div className="empty">
                <p>Espace vide</p>
                <button onClick={() => openModal('upload')}>Importer</button>
              </div>
            ) : (
              <div className="list">
                {contents.map(c => (
                  <div key={c.id} className={`item ${selected.includes(c.id) ? 'selected' : ''}`} onClick={() => toggleSelect(c.id)}>
                    <span className="check">{selected.includes(c.id) && '✓'}</span>
                    <span className="type">{c.content_type}</span>
                    <span className="title">{c.title}</span>
                    <span className="status">{c.is_indexed ? '●' : '○'}</span>
                    <div className="actions">
                      <button onClick={(e) => { e.stopPropagation(); openModal('content', c); }}>Voir</button>
                      <button onClick={(e) => { e.stopPropagation(); openModal('glissement', c); }}>Glisser</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          <aside className="chat">
            <div className="chat-head">
              <span>Chat IA</span>
              <label><input type="checkbox" checked={searchWeb} onChange={e => setSearchWeb(e.target.checked)} /> Web</label>
            </div>
            <div className="chat-body" ref={chatRef}>
              {messages.length === 0 && <p className="hint">Posez une question</p>}
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <strong>{m.role === 'user' ? 'Vous' : 'IA'}</strong>
                  <p>{m.content}</p>
                </div>
              ))}
              {loading && <p className="loading">...</p>}
            </div>
            <div className="chat-input">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} placeholder="Question..." />
              <button onClick={handleChat}>→</button>
            </div>
          </aside>
        </div>
      )}

      {/* COLLECTIVE */}
      {view === 'collective' && token && user && (
        <div className="collective">
          <h1>Espace collectif — {user.strate}</h1>
          {collectiveContents.length > 0 ? (
            <GraphView 
              contents={collectiveContents}
              onNodeClick={(c) => openModal('content', c)}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
            />
          ) : (
            <div className="empty">Aucun contenu partagé</div>
          )}
          <button onClick={() => setView('workspace')}>← Retour</button>
        </div>
      )}

      {/* MODALS */}
      {modal && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={closeModal}>×</button>

            {modal === 'login' && (
              <>
                <h2>Connexion</h2>
                <LoginForm onSubmit={login} loading={loading} />
              </>
            )}

            {modal === 'register' && (
              <>
                <h2>Inscription</h2>
                <RegisterForm onSubmit={register} loading={loading} />
              </>
            )}

            {modal === 'profile' && user && (
              <>
                <h2>Profil</h2>
                <ProfileForm user={user} token={token} apiUrl={API_URL} onClose={closeModal} onUpdate={fetchProfile} />
              </>
            )}

            {modal === 'upload' && (
              <>
                <h2>Importer</h2>
                <UploadForm onSubmit={handleUpload} loading={loading} onClose={closeModal} />
              </>
            )}

            {modal === 'note' && (
              <>
                <h2>Nouvelle note</h2>
                <NoteForm onSubmit={handleCreateNote} loading={loading} onClose={closeModal} />
              </>
            )}

            {modal === 'glissement' && modalData && (
              <>
                <h2>Glisser</h2>
                <p>{modalData.title}</p>
                <button onClick={() => handleGlissement(modalData.id, 'strate')}>→ Collectif</button>
                <button onClick={() => handleGlissement(modalData.id, 'public')}>→ Surface</button>
              </>
            )}

            {modal === 'content' && modalData && (
              <ContentView content={modalData} apiUrl={API_URL} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// FORMS
function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(email, password); }}>
      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label>Mot de passe</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>Connexion</button>
    </form>
  );
}

function RegisterForm({ onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chercheur');
  const [code, setCode] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(email, password, role, code); }}>
      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label>Mot de passe</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <label>Rôle</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="chercheur">Chercheur</option>
        <option value="pedagogue">Pédagogue</option>
      </select>
      <label>Code</label>
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="CHERCHEUR2026" required />
      <button type="submit" disabled={loading}>S'inscrire</button>
    </form>
  );
}

function ProfileForm({ user, token, apiUrl, onClose, onUpdate }) {
  const [name, setName] = useState(user.display_name || '');
  const [bio, setBio] = useState(user.bio || '');
  const submit = async (e) => {
    e.preventDefault();
    await fetch(`${apiUrl}/api/profile/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ display_name: name, bio })
    });
    onUpdate();
    onClose();
  };
  return (
    <form onSubmit={submit}>
      <p className="meta">{user.email} · {user.role}</p>
      <label>Nom</label>
      <input value={name} onChange={e => setName(e.target.value)} required />
      <label>Bio</label>
      <textarea value={bio} onChange={e => setBio(e.target.value)} />
      <button type="submit">Enregistrer</button>
    </form>
  );
}

function UploadForm({ onSubmit, loading, onClose }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); if (file) onSubmit(file, title, '', tags.split(',').map(t=>t.trim()).filter(Boolean)); }}>
      <label>Fichier</label>
      <input type="file" accept=".pdf,image/*" onChange={e => { setFile(e.target.files[0]); if (!title) setTitle(e.target.files[0]?.name?.replace(/\.[^/.]+$/, '') || ''); }} required />
      <label>Titre</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />
      <label>Tags</label>
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2" />
      <button type="submit" disabled={loading || !file}>Importer</button>
    </form>
  );
}

function NoteForm({ onSubmit, loading, onClose }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(title, text, tags.split(',').map(t=>t.trim()).filter(Boolean)); }}>
      <label>Titre</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />
      <label>Contenu</label>
      <textarea value={text} onChange={e => setText(e.target.value)} required />
      <label>Tags</label>
      <input value={tags} onChange={e => setTags(e.target.value)} />
      <button type="submit" disabled={loading}>Créer</button>
    </form>
  );
}

function ContentView({ content, apiUrl }) {
  const fileUrl = content.file_url ? (content.file_url.startsWith('http') ? content.file_url : `${apiUrl}${content.file_url}`) : null;
  return (
    <div className="content-view">
      <span className="type">{content.content_type}</span>
      <h2>{content.title}</h2>
      {fileUrl && content.content_type === 'pdf' && <iframe src={fileUrl} />}
      {fileUrl && content.content_type === 'image' && <img src={fileUrl} alt="" />}
      {content.vision_description && <div className="vision"><strong>Vision:</strong> {content.vision_description}</div>}
      {content.text_content && <div className="text">{content.text_content}</div>}
    </div>
  );
}

// STYLES
const styles = `
*{margin:0;padding:0;box-sizing:border-box}
.app{min-height:100vh;background:#fff;color:#000;font-family:system-ui,sans-serif;font-size:16px;line-height:1.5}

.header{position:fixed;top:0;left:0;right:0;z-index:100;height:56px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #000}
.logo{font-size:18px;font-weight:600;cursor:pointer}
.nav{display:flex;gap:4px}
.nav button,.header-right button{background:none;border:none;padding:8px 16px;font-size:14px;cursor:pointer}
.nav button:hover,.header-right button:hover{background:#f0f0f0}
.nav button.active{border-bottom:2px solid #000}
.header-right{display:flex;gap:8px}
.header-right button{border:1px solid #ddd}
.header-right button.primary{background:#000;color:#fff;border-color:#000}
.header-right button.lang{width:32px;padding:0;font-family:serif}

.landing{padding-top:56px}
.hero{max-width:600px;margin:0 auto;padding:80px 24px;text-align:center}
.hero h1{font-size:48px;font-weight:600;letter-spacing:-0.02em}
.hero .tagline{font-size:20px;color:#666;margin:16px 0}
.hero .intro{color:#444;margin-bottom:32px}
.hero-actions{display:flex;gap:12px;justify-content:center}
.hero-actions button{padding:12px 24px;border:1px solid #000;background:none;cursor:pointer}
.hero-actions button.primary{background:#000;color:#fff}

.section,.page{max-width:900px;margin:0 auto;padding:60px 24px;border-top:1px solid #eee}
.section h2,.page h2,.page h3{font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px}
.page h1{font-size:36px;margin-bottom:16px}
.page p{margin-bottom:16px;color:#444}

.graph-container{width:100%;height:400px;border:1px solid #eee;background:#fafafa}
.empty{padding:60px;text-align:center;color:#999;border:1px dashed #ddd}

.partners{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.partners div{padding:20px;border:1px solid #eee}

.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px}
.card{padding:24px;border:1px solid #eee}
.card h3{margin-bottom:8px}
.card p{color:#666;margin:0;font-size:14px}

.strates{border:1px solid #000;margin-bottom:32px}
.strate{display:flex;border-bottom:1px solid #eee}
.strate:last-child{border:none}
.strate span{width:80px;padding:16px;background:#f5f5f5;text-align:right;font-family:monospace;font-size:13px}
.strate div{padding:16px;flex:1}
.concept-box{padding:24px;border:1px solid #000}

.workspace{display:flex;padding-top:56px;min-height:100vh}
.sidebar{width:180px;border-right:1px solid #eee;padding:16px;position:fixed;top:56px;bottom:0}
.sb-group{margin-bottom:24px}
.sb-title{display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:8px}
.sidebar button{display:block;width:100%;text-align:left;padding:8px;background:none;border:none;cursor:pointer}
.sidebar button:hover{background:#f5f5f5}

.main{flex:1;margin-left:180px;margin-right:280px;padding:24px}
.main h1{font-size:24px;margin-bottom:24px;display:flex;align-items:center;gap:12px}
.badge{font-size:12px;background:#000;color:#fff;padding:2px 8px}

.list{display:flex;flex-direction:column;gap:1px}
.item{display:flex;align-items:center;padding:12px;gap:12px;border:1px solid #eee;cursor:pointer}
.item:hover{border-color:#000}
.item.selected{background:#f5f5f5;border-color:#000}
.item .check{width:16px;height:16px;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;font-size:10px}
.item.selected .check{background:#000;color:#fff}
.item .type{font-size:11px;text-transform:uppercase;color:#999;width:60px}
.item .title{flex:1}
.item .status{font-size:10px;color:#ccc}
.item .actions{display:flex;gap:8px;opacity:0}
.item:hover .actions{opacity:1}
.item .actions button{padding:4px 8px;font-size:12px;background:#fff;border:1px solid #ddd;cursor:pointer}

.chat{width:280px;position:fixed;top:56px;bottom:0;right:0;border-left:1px solid #000;display:flex;flex-direction:column}
.chat-head{padding:12px;border-bottom:1px solid #eee;display:flex;justify-content:space-between}
.chat-body{flex:1;overflow-y:auto;padding:12px}
.hint{color:#999;text-align:center;padding:40px 0}
.msg{margin-bottom:12px}
.msg strong{font-size:11px;text-transform:uppercase;color:#999}
.msg p{font-size:14px}
.msg.assistant p{padding-left:12px;border-left:2px solid #000}
.loading{color:#999}
.chat-input{padding:12px;border-top:1px solid #eee;display:flex;gap:8px}
.chat-input input{flex:1;padding:8px;border:1px solid #ddd}
.chat-input button{padding:8px 16px;background:#000;color:#fff;border:none;cursor:pointer}

.collective{padding:80px 24px;max-width:900px;margin:0 auto}
.collective h1{margin-bottom:24px}
.collective>button{margin-top:24px;padding:8px 16px;border:1px solid #ddd;background:none;cursor:pointer}

.overlay{position:fixed;inset:0;background:rgba(255,255,255,0.95);z-index:200;display:flex;align-items:center;justify-content:center}
.modal{background:#fff;border:1px solid #000;padding:32px;max-width:400px;width:100%;position:relative}
.close{position:absolute;top:12px;right:12px;background:none;border:none;font-size:24px;cursor:pointer}
.modal h2{margin-bottom:24px}
.modal form{display:flex;flex-direction:column;gap:12px}
.modal label{font-size:12px;text-transform:uppercase;color:#666}
.modal input,.modal textarea,.modal select{padding:10px;border:1px solid #ddd;font-size:15px}
.modal input:focus,.modal textarea:focus{outline:none;border-color:#000}
.modal textarea{min-height:100px}
.modal button[type=submit],.modal>button{padding:12px;background:#000;color:#fff;border:none;cursor:pointer;margin-top:8px}
.modal .meta{font-size:13px;color:#666;margin-bottom:16px}

.content-view .type{font-size:11px;text-transform:uppercase;background:#f5f5f5;padding:4px 8px}
.content-view h2{margin:12px 0}
.content-view iframe{width:100%;height:350px;border:1px solid #eee}
.content-view img{max-width:100%;border:1px solid #eee}
.content-view .vision{margin-top:16px;padding:12px;background:#f9f9f9;border-left:2px solid #000}
.content-view .text{margin-top:16px;padding:12px;background:#f9f9f9;max-height:200px;overflow-y:auto;white-space:pre-wrap}

@media(max-width:900px){.main{margin-right:0}.chat{display:none}}
@media(max-width:600px){.nav{display:none}.sidebar{display:none}.main{margin-left:0}.partners,.grid{grid-template-columns:1fr}}
`;
