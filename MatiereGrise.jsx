// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v2 — Frontend Complet
// ═══════════════════════════════════════════════════════════════════════════════
// 
// Fonctionnalités :
// - Inscription avec code d'invitation
// - Profil customisable
// - Espace personnel privé (type NotebookLM)
// - Upload fichiers (PDF, images)
// - Import vidéos/liens
// - Notes personnelles
// - Chat RAG avec documents
// - Création de mindmaps
// - Système de glissement
// - Navigation entre strates
// - Zone d'extraction
// - Surface publique
//
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';

// Configuration - À CHANGER selon ton tunnel
const API_URL = 'notepad C:\Users\ouali\matiere-grise\matiere-grise-frontend\MatiereGrise.jsx';

export default function MatiereGriseV2() {
  // Auth state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  
  // Navigation
  const [currentView, setCurrentView] = useState('workspace'); // workspace, strate, extraction, surface
  const [currentStrate, setCurrentStrate] = useState(null);
  const [lang, setLang] = useState('fr');
  
  // Modals
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, register
  const [showProfile, setShowProfile] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showMindmap, setShowMindmap] = useState(false);
  const [showGlissement, setShowGlissement] = useState(null);
  
  // Data
  const [contents, setContents] = useState([]);
  const [selectedContents, setSelectedContents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [strateContents, setStrateContents] = useState([]);
  
  // Chat
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchContents();
      fetchConversations();
    }
  }, [token]);

  useEffect(() => {
    if (token && currentStrate) {
      fetchStrateContents(currentStrate);
    }
  }, [currentStrate]);

  // ═══════════════════════════════════════════════════════════════════════════
  // API CALLS
  // ═══════════════════════════════════════════════════════════════════════════

  const api = async (endpoint, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
    if (res.status === 401) {
      setToken(null);
      localStorage.removeItem('mg_token');
      throw new Error('Non autorisé');
    }
    return res;
  };

  const fetchProfile = async () => {
    try {
      const res = await api('/api/profile/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (!data.is_profile_complete) setShowProfile(true);
      }
    } catch (e) { console.error(e); }
  };

  const fetchContents = async () => {
    try {
      const res = await api('/api/contents');
      if (res.ok) setContents(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchConversations = async () => {
    try {
      const res = await api('/api/conversations');
      if (res.ok) setConversations(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchStrateContents = async (strate) => {
    try {
      const res = await api(`/api/strate/${strate}/contents`);
      if (res.ok) setStrateContents(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem('mg_token', data.access_token);
        setShowAuth(false);
      } else {
        alert('Identifiants incorrects');
      }
    } catch (e) {
      alert('Erreur de connexion');
    }
    setIsLoading(false);
  };

  const handleRegister = async (email, password, role, code) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, invitation_code: code })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem('mg_token', data.access_token);
        setShowAuth(false);
      } else {
        const err = await res.json();
        alert(err.detail || 'Erreur d\'inscription');
      }
    } catch (e) {
      alert('Erreur de connexion');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mg_token');
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const res = await api('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
          content_ids: selectedContents.length > 0 ? selectedContents : null,
          conversation_id: currentConversation?.id
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          sources: data.sources 
        }]);
        if (!currentConversation) {
          setCurrentConversation({ id: data.conversation_id });
          fetchConversations();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur.' }]);
    }
    setIsLoading(false);
  };

  const handleUpload = async (file, title, description, tags) => {
    setIsLoading(true);
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
        setShowUpload(false);
      } else {
        alert('Erreur lors de l\'upload');
      }
    } catch (e) {
      alert('Erreur');
    }
    setIsLoading(false);
  };

  const handleCreateNote = async (title, content) => {
    try {
      const res = await api('/api/contents', {
        method: 'POST',
        body: JSON.stringify({
          content_type: 'note',
          title,
          text_content: content
        })
      });
      if (res.ok) fetchContents();
    } catch (e) { console.error(e); }
  };

  const handleCreateLink = async (title, url, description) => {
    try {
      const res = await api('/api/contents', {
        method: 'POST',
        body: JSON.stringify({
          content_type: url.includes('youtube') || url.includes('vimeo') ? 'video' : 'link',
          title,
          file_url: url,
          description
        })
      });
      if (res.ok) fetchContents();
    } catch (e) { console.error(e); }
  };

  const handleGlissement = async (contentId, targetVisibility) => {
    try {
      const res = await api('/api/glissements', {
        method: 'POST',
        body: JSON.stringify({
          content_id: contentId,
          target_visibility: targetVisibility
        })
      });
      if (res.ok) {
        fetchContents();
        setShowGlissement(null);
      }
    } catch (e) { console.error(e); }
  };

  const handleGenerateMindmap = async () => {
    if (selectedContents.length === 0) {
      alert('Sélectionnez des documents d\'abord');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await api(`/api/mindmaps/generate?topic=Synthèse`, {
        method: 'POST',
        body: JSON.stringify(selectedContents)
      });
      if (res.ok) {
        const data = await res.json();
        // TODO: Afficher la mindmap
        console.log(data);
        alert('Mindmap générée ! (voir console)');
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const toggleContentSelection = (id) => {
    setSelectedContents(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400;500&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .app {
          min-height: 100vh;
          background: #FAFAFA;
          color: #0A0A0A;
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .ar { font-family: 'Amiri', serif; direction: rtl; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        /* Header */
        .hd {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: #FAFAFA; border-bottom: 1px solid #0A0A0A;
          padding: 1rem 2rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .logo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
        }
        .hd-nav { display: flex; gap: 1rem; align-items: center; }
        .hd-btn {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: none; border: 1px solid #0A0A0A;
          padding: 0.5rem 1rem; cursor: pointer;
        }
        .hd-btn:hover { background: #0A0A0A; color: #FAFAFA; }
        .hd-btn.active { background: #0A0A0A; color: #FAFAFA; }
        .hd-btn.primary { background: #0A0A0A; color: #FAFAFA; border: none; }
        
        /* Main Layout */
        .main { display: flex; padding-top: 60px; min-height: 100vh; }
        
        /* Sidebar */
        .sidebar {
          width: 280px; border-right: 1px solid #E0E0E0;
          padding: 1.5rem; overflow-y: auto;
          position: fixed; top: 60px; bottom: 0; left: 0;
          background: #FAFAFA;
        }
        .sb-section { margin-bottom: 2rem; }
        .sb-title {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #999; margin-bottom: 1rem;
        }
        .sb-btn {
          display: block; width: 100%; text-align: left;
          padding: 0.75rem; margin-bottom: 0.25rem;
          background: none; border: none; cursor: pointer;
          font-family: inherit; font-size: 0.9rem;
          border-radius: 4px;
        }
        .sb-btn:hover { background: #F0F0F0; }
        .sb-btn.active { background: #0A0A0A; color: #FAFAFA; }
        .sb-meta { font-size: 0.7rem; color: #999; margin-top: 0.25rem; }
        
        /* Content Area */
        .content { flex: 1; margin-left: 280px; padding: 2rem; }
        
        /* Workspace */
        .ws-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 2rem; padding-bottom: 1rem;
          border-bottom: 1px solid #E0E0E0;
        }
        .ws-title { font-size: 1.5rem; }
        .ws-actions { display: flex; gap: 0.5rem; }
        
        /* Content Grid */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        .card {
          border: 1px solid #E0E0E0; padding: 1.25rem;
          cursor: pointer; transition: all 0.15s;
          position: relative;
        }
        .card:hover { border-color: #0A0A0A; }
        .card.selected { border-color: #0A0A0A; background: #F5F5F5; }
        .card-type {
          font-family: 'JetBrains Mono', monospace; font-size: 0.5rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #999; margin-bottom: 0.5rem;
        }
        .card-title { font-size: 1rem; margin-bottom: 0.5rem; }
        .card-desc { font-size: 0.85rem; color: #666; }
        .card-tags { margin-top: 0.75rem; display: flex; gap: 0.3rem; flex-wrap: wrap; }
        .tag {
          font-family: 'JetBrains Mono', monospace; font-size: 0.5rem;
          padding: 0.2rem 0.4rem; background: #F0F0F0;
        }
        .card-actions {
          position: absolute; top: 0.75rem; right: 0.75rem;
          display: none; gap: 0.25rem;
        }
        .card:hover .card-actions { display: flex; }
        .card-action {
          width: 24px; height: 24px; border: 1px solid #CCC;
          background: #FFF; cursor: pointer; font-size: 0.7rem;
          display: flex; align-items: center; justify-content: center;
        }
        .card-action:hover { background: #0A0A0A; color: #FFF; border-color: #0A0A0A; }
        .card-check {
          position: absolute; top: 0.75rem; left: 0.75rem;
          width: 18px; height: 18px; border: 1px solid #CCC;
          background: #FFF; cursor: pointer;
        }
        .card.selected .card-check { background: #0A0A0A; border-color: #0A0A0A; }
        .card.selected .card-check::after {
          content: '✓'; color: #FFF; font-size: 0.7rem;
          display: flex; align-items: center; justify-content: center;
          height: 100%;
        }
        
        /* Chat Panel */
        .chat-panel {
          position: fixed; bottom: 0; right: 0;
          width: calc(100% - 280px); max-height: 400px;
          background: #FAFAFA; border-top: 1px solid #0A0A0A;
          display: flex; flex-direction: column;
        }
        .chat-header {
          padding: 0.75rem 1rem; border-bottom: 1px solid #E0E0E0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .chat-title {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.15em; text-transform: uppercase;
        }
        .chat-msgs {
          flex: 1; overflow-y: auto; padding: 1rem;
          max-height: 250px;
        }
        .chat-msg { margin-bottom: 1rem; }
        .msg-role {
          font-family: 'JetBrains Mono', monospace; font-size: 0.5rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #999; margin-bottom: 0.25rem;
        }
        .msg-content { font-size: 0.9rem; }
        .msg-content.assistant {
          padding-left: 1rem; border-left: 2px solid #0A0A0A;
        }
        .chat-input-area {
          padding: 1rem; border-top: 1px solid #E0E0E0;
          display: flex; gap: 0.5rem;
        }
        .chat-input {
          flex: 1; padding: 0.75rem;
          border: 1px solid #0A0A0A; font-family: inherit;
          font-size: 0.9rem; resize: none;
        }
        .chat-send {
          padding: 0.75rem 1.5rem;
          background: #0A0A0A; color: #FAFAFA; border: none;
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
        }
        .chat-send:disabled { opacity: 0.3; }
        
        /* Modal */
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 200;
          display: flex; align-items: center; justify-content: center;
        }
        .modal {
          background: #FAFAFA; padding: 2rem;
          max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;
        }
        .modal-title { font-size: 1.25rem; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1.25rem; }
        .form-label {
          display: block;
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #666; margin-bottom: 0.5rem;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 0.75rem;
          border: 1px solid #0A0A0A; font-family: inherit;
          font-size: 0.95rem; background: #FFF;
        }
        .form-textarea { resize: vertical; min-height: 100px; }
        .form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        .btn {
          flex: 1; padding: 0.85rem;
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; border: 1px solid #0A0A0A;
        }
        .btn.primary { background: #0A0A0A; color: #FAFAFA; }
        .btn.secondary { background: transparent; }
        
        /* Selection Bar */
        .selection-bar {
          position: fixed; bottom: 400px; right: 0;
          width: calc(100% - 280px); padding: 0.75rem 1rem;
          background: #0A0A0A; color: #FAFAFA;
          display: flex; justify-content: space-between; align-items: center;
        }
        .sel-text {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em;
        }
        .sel-actions { display: flex; gap: 0.5rem; }
        .sel-btn {
          padding: 0.5rem 1rem;
          background: transparent; color: #FAFAFA;
          border: 1px solid #FAFAFA;
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
        }
        .sel-btn:hover { background: #FAFAFA; color: #0A0A0A; }
        
        /* Empty State */
        .empty {
          text-align: center; padding: 4rem 2rem;
          color: #999;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
        
        /* Loading */
        .loading {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          color: #999; animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        
        /* User Info */
        .user-chip {
          display: flex; align-items: center; gap: 0.5rem;
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
        }
        .user-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: #E0E0E0; display: flex; align-items: center;
          justify-content: center; font-size: 0.7rem;
        }
        
        /* Tabs */
        .tabs { display: flex; gap: 0; margin-bottom: 1.5rem; }
        .tab {
          padding: 0.75rem 1.5rem;
          background: none; border: 1px solid #E0E0E0; border-bottom: none;
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; margin-right: -1px;
        }
        .tab:hover { background: #F5F5F5; }
        .tab.active { background: #0A0A0A; color: #FAFAFA; border-color: #0A0A0A; }
        
        /* Strate Header */
        .strate-hd {
          padding: 2rem 0; border-bottom: 1px solid #0A0A0A; margin-bottom: 2rem;
        }
        .strate-label {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #666; margin-bottom: 0.5rem;
        }
        .strate-title { font-size: 1.75rem; }
      `}</style>

      {/* Header */}
      <header className="hd">
        <div className="logo">Matière Grise</div>
        <nav className="hd-nav">
          {token && user ? (
            <>
              <button 
                className={`hd-btn ${currentView === 'workspace' ? 'active' : ''}`}
                onClick={() => setCurrentView('workspace')}
              >
                Mon Espace
              </button>
              <button 
                className={`hd-btn ${currentView === 'strate' ? 'active' : ''}`}
                onClick={() => { setCurrentView('strate'); setCurrentStrate(user.strate); }}
              >
                Ma Strate
              </button>
              <button 
                className={`hd-btn ${currentView === 'surface' ? 'active' : ''}`}
                onClick={() => setCurrentView('surface')}
              >
                Surface
              </button>
              <div className="user-chip" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }}>
                <div className="user-avatar">
                  {user.avatar_url ? <img src={user.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : user.display_name?.[0]?.toUpperCase()}
                </div>
                <span>{user.display_name}</span>
              </div>
              <button className="hd-btn" onClick={handleLogout}>Déconnexion</button>
            </>
          ) : (
            <>
              <button className="hd-btn" onClick={() => { setShowAuth(true); setAuthMode('login'); }}>
                Connexion
              </button>
              <button className="hd-btn primary" onClick={() => { setShowAuth(true); setAuthMode('register'); }}>
                S'inscrire
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Main Content */}
      {token && user ? (
        <main className="main">
          {/* Sidebar */}
          <aside className="sidebar">
            {currentView === 'workspace' && (
              <>
                <div className="sb-section">
                  <div className="sb-title">Documents</div>
                  <button className="sb-btn" onClick={() => setShowUpload(true)}>
                    + Importer un fichier
                  </button>
                  <button className="sb-btn" onClick={() => {
                    const title = prompt('Titre de la note:');
                    if (title) {
                      const content = prompt('Contenu:');
                      if (content) handleCreateNote(title, content);
                    }
                  }}>
                    + Nouvelle note
                  </button>
                  <button className="sb-btn" onClick={() => {
                    const title = prompt('Titre:');
                    if (title) {
                      const url = prompt('URL (YouTube, Vimeo, ou lien):');
                      if (url) handleCreateLink(title, url);
                    }
                  }}>
                    + Ajouter un lien
                  </button>
                </div>
                
                <div className="sb-section">
                  <div className="sb-title">Conversations</div>
                  {conversations.length === 0 ? (
                    <div style={{ color: '#999', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Aucune conversation
                    </div>
                  ) : (
                    conversations.map(c => (
                      <button 
                        key={c.id} 
                        className={`sb-btn ${currentConversation?.id === c.id ? 'active' : ''}`}
                        onClick={() => setCurrentConversation(c)}
                      >
                        {c.title}
                      </button>
                    ))
                  )}
                  <button 
                    className="sb-btn" 
                    onClick={() => { setCurrentConversation(null); setMessages([]); }}
                    style={{ marginTop: '0.5rem', borderTop: '1px solid #E0E0E0', paddingTop: '0.75rem' }}
                  >
                    + Nouvelle conversation
                  </button>
                </div>
              </>
            )}
            
            {currentView === 'strate' && (
              <div className="sb-section">
                <div className="sb-title">Strates</div>
                {user.role !== 'chercheur' && (
                  <button 
                    className={`sb-btn ${currentStrate === 'episteme' ? 'active' : ''}`}
                    onClick={() => setCurrentStrate('episteme')}
                  >
                    Épistémè
                    <div className="sb-meta">Pédagogues</div>
                  </button>
                )}
                <button 
                  className={`sb-btn ${currentStrate === 'sediment' ? 'active' : ''}`}
                  onClick={() => setCurrentStrate('sediment')}
                >
                  Sédiment
                  <div className="sb-meta">Chercheurs</div>
                </button>
                <button 
                  className={`sb-btn ${currentStrate === 'extraction' ? 'active' : ''}`}
                  onClick={() => setCurrentStrate('extraction')}
                >
                  Extraction
                  <div className="sb-meta">Curation</div>
                </button>
              </div>
            )}
          </aside>

          {/* Content Area */}
          <div className="content" style={{ paddingBottom: selectedContents.length > 0 ? '500px' : '450px' }}>
            
            {/* WORKSPACE VIEW */}
            {currentView === 'workspace' && (
              <>
                <div className="ws-header">
                  <h1 className="ws-title">Mon Espace Personnel</h1>
                  <div className="ws-actions">
                    {selectedContents.length > 0 && (
                      <button className="hd-btn" onClick={() => setSelectedContents([])}>
                        Désélectionner ({selectedContents.length})
                      </button>
                    )}
                  </div>
                </div>

                <div className="tabs">
                  <button className="tab active">Tous</button>
                  <button className="tab">PDF</button>
                  <button className="tab">Images</button>
                  <button className="tab">Notes</button>
                  <button className="tab">Liens</button>
                </div>

                {contents.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📁</div>
                    <p>Votre espace est vide</p>
                    <p style={{ fontSize: '0.85rem' }}>Importez des documents, créez des notes, ou ajoutez des liens</p>
                  </div>
                ) : (
                  <div className="grid">
                    {contents.map(c => (
                      <div 
                        key={c.id} 
                        className={`card ${selectedContents.includes(c.id) ? 'selected' : ''}`}
                      >
                        <div 
                          className="card-check"
                          onClick={(e) => { e.stopPropagation(); toggleContentSelection(c.id); }}
                        />
                        <div className="card-type">{c.content_type}</div>
                        <div className="card-title">{c.title}</div>
                        {c.description && <div className="card-desc">{c.description}</div>}
                        {c.tags?.length > 0 && (
                          <div className="card-tags">
                            {c.tags.map(t => <span key={t} className="tag">{t}</span>)}
                          </div>
                        )}
                        <div className="card-actions">
                          <button 
                            className="card-action" 
                            title="Glisser vers collectif"
                            onClick={(e) => { e.stopPropagation(); setShowGlissement(c); }}
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STRATE VIEW */}
            {currentView === 'strate' && currentStrate && (
              <>
                <div className="strate-hd">
                  <div className="strate-label">
                    {currentStrate === 'episteme' && 'Strate 1 — Pédagogues'}
                    {currentStrate === 'sediment' && 'Strate 2 — Chercheurs'}
                    {currentStrate === 'extraction' && 'Strate 4 — Curation'}
                  </div>
                  <h1 className="strate-title">
                    {currentStrate === 'episteme' && 'Épistémè'}
                    {currentStrate === 'sediment' && 'Sédiment'}
                    {currentStrate === 'extraction' && 'Extraction'}
                  </h1>
                </div>

                {strateContents.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🌍</div>
                    <p>Aucun contenu partagé dans cette strate</p>
                    <p style={{ fontSize: '0.85rem' }}>Les contenus apparaissent ici quand ils sont glissés depuis les espaces personnels</p>
                  </div>
                ) : (
                  <div className="grid">
                    {strateContents.map(c => (
                      <div key={c.id} className="card">
                        <div className="card-type">{c.content_type}</div>
                        <div className="card-title">{c.title}</div>
                        {c.description && <div className="card-desc">{c.description}</div>}
                        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#999' }}>
                          Par {c.owner_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SURFACE VIEW */}
            {currentView === 'surface' && (
              <>
                <div className="strate-hd">
                  <div className="strate-label">Publication</div>
                  <h1 className="strate-title">Surface</h1>
                </div>
                <div className="empty">
                  <div className="empty-icon">🌐</div>
                  <p>La Surface publique</p>
                  <p style={{ fontSize: '0.85rem' }}>Les pages publiées apparaîtront ici</p>
                </div>
              </>
            )}
          </div>

          {/* Selection Bar */}
          {selectedContents.length > 0 && (
            <div className="selection-bar">
              <span className="sel-text">{selectedContents.length} élément(s) sélectionné(s)</span>
              <div className="sel-actions">
                <button className="sel-btn" onClick={handleGenerateMindmap}>
                  Générer Mindmap
                </button>
                <button className="sel-btn" onClick={() => setSelectedContents([])}>
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Chat Panel */}
          <div className="chat-panel">
            <div className="chat-header">
              <span className="chat-title">
                Dialogue avec {selectedContents.length > 0 ? `${selectedContents.length} document(s)` : 'tous mes documents'}
              </span>
            </div>
            <div className="chat-msgs">
              {messages.length === 0 && (
                <div style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Posez une question sur vos documents...
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className="chat-msg">
                  <div className="msg-role">{m.role === 'user' ? 'Vous' : 'IA'}</div>
                  <div className={`msg-content ${m.role}`}>{m.content}</div>
                </div>
              ))}
              {isLoading && <div className="loading">Analyse en cours...</div>}
            </div>
            <div className="chat-input-area">
              <textarea
                className="chat-input"
                rows={1}
                placeholder="Votre question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChat();
                  }
                }}
              />
              <button className="chat-send" onClick={handleChat} disabled={isLoading || !chatInput.trim()}>
                Envoyer
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main style={{ paddingTop: '100px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Matière Grise</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Les origines terrestres de l'IA</p>
          <button 
            className="hd-btn primary" 
            style={{ padding: '1rem 2rem' }}
            onClick={() => { setShowAuth(true); setAuthMode('register'); }}
          >
            Commencer
          </button>
        </main>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLoading={isLoading}
        />
      )}

      {/* Profile Modal */}
      {showProfile && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={fetchProfile}
          api={api}
          token={token}
          apiUrl={API_URL}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
          isLoading={isLoading}
        />
      )}

      {/* Glissement Modal */}
      {showGlissement && (
        <GlissementModal
          content={showGlissement}
          onClose={() => setShowGlissement(null)}
          onGlissement={handleGlissement}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════════════

function AuthModal({ mode, setMode, onClose, onLogin, onRegister, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chercheur');
  const [code, setCode] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
        
        <form onSubmit={e => {
          e.preventDefault();
          if (mode === 'login') onLogin(email, password);
          else onRegister(email, password, role, code);
        }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="chercheur">Chercheur·e</option>
                  <option value="pedagogue">Pédagogue</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Code d'invitation</label>
                <input type="text" className="form-input" value={code} onChange={e => setCode(e.target.value)} required placeholder="CHERCHEUR2026 ou PEDAGOGUE2026" />
              </div>
            </>
          )}
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn primary" disabled={isLoading}>
              {isLoading ? '...' : (mode === 'login' ? 'Connexion' : 'S\'inscrire')}
            </button>
          </div>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          {mode === 'login' ? (
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              Pas de compte ? <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>S'inscrire</button>
            </span>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              Déjà un compte ? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Se connecter</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ user, onClose, onUpdate, api, token, apiUrl }) {
  const [displayName, setDisplayName] = useState(user.display_name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [institution, setInstitution] = useState(user.institution || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api('/api/profile/me', {
        method: 'PUT',
        body: JSON.stringify({ display_name: displayName, bio, institution })
      });
      onUpdate();
      onClose();
    } catch (e) { alert('Erreur'); }
    setIsLoading(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${apiUrl}/api/profile/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) onUpdate();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Mon Profil</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', 
            background: '#E0E0E0', margin: '0 auto 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', overflow: 'hidden'
          }}>
            {user.avatar_url ? <img src={user.avatar_url} style={{ width: '100%', height: '100%' }} /> : displayName?.[0]?.toUpperCase()}
          </div>
          <label style={{ 
            fontSize: '0.75rem', color: '#666', cursor: 'pointer',
            textDecoration: 'underline'
          }}>
            Changer l'avatar
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
          </label>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom affiché</label>
            <input type="text" className="form-input" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-textarea" value={bio} onChange={e => setBio(e.target.value)} placeholder="Quelques mots sur vous..." />
          </div>
          
          <div className="form-group">
            <label className="form-label">Institution</label>
            <input type="text" className="form-input" value={institution} onChange={e => setInstitution(e.target.value)} />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn primary" disabled={isLoading}>
              {isLoading ? '...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onUpload, isLoading }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Importer un fichier</h2>
        
        <form onSubmit={e => {
          e.preventDefault();
          if (file && title) onUpload(file, title, description, tags.split(',').map(t => t.trim()).filter(Boolean));
        }}>
          <div className="form-group">
            <label className="form-label">Fichier (PDF ou image)</label>
            <input 
              type="file" 
              accept=".pdf,image/*" 
              onChange={e => {
                setFile(e.target.files[0]);
                if (!title && e.target.files[0]) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
              }} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description (optionnel)</label>
            <textarea className="form-textarea" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tags (séparés par des virgules)</label>
            <input type="text" className="form-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="cobalt, extraction, maroc" />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn primary" disabled={isLoading || !file}>
              {isLoading ? '...' : 'Importer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GlissementModal({ content, onClose, onGlissement }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Glisser vers...</h2>
        
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          <strong>{content.title}</strong><br />
          Choisissez où publier ce contenu :
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            className="btn secondary" 
            onClick={() => onGlissement(content.id, 'strate')}
            style={{ textAlign: 'left', padding: '1rem' }}
          >
            <strong>Ma Strate</strong>
            <br />
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Visible par les membres de ma strate</span>
          </button>
          
          <button 
            className="btn secondary" 
            onClick={() => onGlissement(content.id, 'public')}
            style={{ textAlign: 'left', padding: '1rem' }}
          >
            <strong>Surface (public)</strong>
            <br />
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Visible par tous les visiteurs</span>
          </button>
        </div>
        
        <div className="form-actions" style={{ marginTop: '1.5rem' }}>
          <button className="btn secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
