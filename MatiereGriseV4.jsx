// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v4.0 — Refonte Complète
// ═══════════════════════════════════════════════════════════════════════════════
//
// Design : Manuscrit/Journal — Blanc, lignes fines, lumineux
// Animations : Transitions strates (descente/montée)
// Auth : Comptes isolés, token vérifié
// Features : PDF viewer, Mindmaps, Commentaires, Accès inter-strates
//
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';

// ⚠️ CHANGE CETTE URL
const API_URL = 'https://estimated-next-regardless-existence.trycloudflare.com';

// ═══════════════════════════════════════════════════════════════════════════════
// TRADUCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  fr: {
    title: 'Matière Grise',
    subtitle: 'Les origines terrestres de l\'intelligence artificielle',
    institutions: 'Institutions partenaires',
    inba: 'Institut National des Beaux-Arts de Tétouan',
    ensp: 'École Nationale Supérieure de la Photographie d\'Arles',
    isbas: 'Institut Supérieur des Beaux-Arts de Sousse',
    publications: 'Publications récentes',
    connect: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    mySpace: 'Espace Personnel',
    collective: 'Espace Collectif',
    surface: 'Surface',
    email: 'Email',
    password: 'Mot de passe',
    role: 'Rôle',
    invitationCode: 'Code d\'invitation',
    researcher: 'Chercheur·e',
    pedagogue: 'Pédagogue',
    cancel: 'Annuler',
    save: 'Enregistrer',
    close: 'Fermer',
    import: 'Importer',
    newNote: 'Note',
    addLink: 'Lien',
    conversations: 'Conversations',
    newConv: 'Nouvelle',
    askQuestion: 'Posez une question...',
    send: 'Envoyer',
    analyzing: 'Analyse...',
    selected: 'sélectionné(s)',
    generateMindmap: 'Mindmap',
    slideTo: 'Glisser vers',
    toStrate: 'Espace Collectif',
    toPublic: 'Surface Publique',
    profile: 'Profil',
    displayName: 'Nom',
    bio: 'Bio',
    institution: 'Institution',
    title_label: 'Titre',
    description: 'Description',
    content: 'Contenu',
    url: 'URL',
    tags: 'Tags',
    create: 'Créer',
    add: 'Ajouter',
    upload: 'Importer',
    file: 'Fichier',
    episteme: 'Épistémè',
    sediment: 'Sédiment',
    manteau: 'Manteau',
    extraction: 'Extraction',
    strate1: 'Strate I — Pédagogues',
    strate2: 'Strate II — Chercheurs',
    strate3: 'Strate III — IA Autonome',
    strate4: 'Strate IV — Curation',
    comment: 'Commenter',
    comments: 'Commentaires',
    addComment: 'Ajouter un commentaire...',
    by: 'par'
  },
  ar: {
    title: 'المادة الرمادية',
    subtitle: 'الأصول الأرضية للذكاء الاصطناعي',
    institutions: 'المؤسسات الشريكة',
    inba: 'المعهد الوطني للفنون الجميلة بتطوان',
    ensp: 'المدرسة الوطنية العليا للتصوير بآرل',
    isbas: 'المعهد العالي للفنون الجميلة بسوسة',
    publications: 'المنشورات الأخيرة',
    connect: 'دخول',
    register: 'تسجيل',
    logout: 'خروج',
    mySpace: 'فضائي الشخصي',
    collective: 'الفضاء المشترك',
    surface: 'السطح',
    email: 'البريد',
    password: 'كلمة المرور',
    role: 'الدور',
    invitationCode: 'رمز الدعوة',
    researcher: 'باحث/ة',
    pedagogue: 'مُربّي/ة',
    cancel: 'إلغاء',
    save: 'حفظ',
    close: 'إغلاق',
    import: 'استيراد',
    newNote: 'ملاحظة',
    addLink: 'رابط',
    conversations: 'المحادثات',
    newConv: 'جديد',
    askQuestion: 'اطرح سؤالاً...',
    send: 'إرسال',
    analyzing: 'تحليل...',
    selected: 'محدد',
    generateMindmap: 'خريطة ذهنية',
    slideTo: 'نقل إلى',
    toStrate: 'الفضاء المشترك',
    toPublic: 'السطح العام',
    profile: 'الملف',
    displayName: 'الاسم',
    bio: 'السيرة',
    institution: 'المؤسسة',
    title_label: 'العنوان',
    description: 'الوصف',
    content: 'المحتوى',
    url: 'الرابط',
    tags: 'الوسوم',
    create: 'إنشاء',
    add: 'إضافة',
    upload: 'استيراد',
    file: 'ملف',
    episteme: 'الإبستيمي',
    sediment: 'الرواسب',
    manteau: 'الوشاح',
    extraction: 'الاستخراج',
    strate1: 'الطبقة الأولى — المُربّون',
    strate2: 'الطبقة الثانية — الباحثون',
    strate3: 'الطبقة الثالثة — الذكاء الاصطناعي',
    strate4: 'الطبقة الرابعة — التنسيق',
    comment: 'تعليق',
    comments: 'التعليقات',
    addComment: 'أضف تعليقاً...',
    by: 'بواسطة'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MatiereGrise() {
  // Language
  const [lang, setLang] = useState('fr');
  const t = T[lang];
  
  // Auth
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  
  // Navigation avec animation
  const [currentView, setCurrentView] = useState('surface');
  const [viewTransition, setViewTransition] = useState(null);
  const [depth, setDepth] = useState(0); // 0=surface, 1-4=strates
  
  // Modals
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  // Data
  const [contents, setContents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [collectiveContents, setCollectiveContents] = useState([]);
  const [publicContents, setPublicContents] = useState([]);
  
  // Chat
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // INIT & AUTH
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('mg_token');
      const savedUserId = localStorage.getItem('mg_user_id');
      if (savedToken && savedUserId) {
        setToken(savedToken);
      }
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (isReady) {
      fetchPublic();
      if (token) {
        fetchProfile();
        fetchContents();
        fetchConversations();
      }
    }
  }, [token, isReady]);

  // ═══════════════════════════════════════════════════════════════════════════
  // API
  // ═══════════════════════════════════════════════════════════════════════════

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
        localStorage.setItem('mg_user_id', data.id.toString());
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

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH ACTIONS
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
        localStorage.setItem('mg_user_id', data.user_id.toString());
        setToken(data.access_token);
        closeModal();
        navigateTo('workspace', 0);
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
        localStorage.setItem('mg_user_id', data.user_id.toString());
        setToken(data.access_token);
        closeModal();
        navigateTo('workspace', 0);
      } else {
        const err = await res.json();
        alert(err.detail || 'Erreur');
      }
    } catch (e) { alert('Erreur'); }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('mg_token');
    localStorage.removeItem('mg_user_id');
    setToken(null);
    setUser(null);
    setContents([]);
    setConversations([]);
    setMessages([]);
    setCurrentConv(null);
    setSelectedIds([]);
    navigateTo('surface', 0);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NAVIGATION AVEC ANIMATION
  // ═══════════════════════════════════════════════════════════════════════════

  const navigateTo = (view, newDepth, strate = null) => {
    const direction = newDepth > depth ? 'descend' : newDepth < depth ? 'ascend' : 'fade';
    setViewTransition(direction);
    
    setTimeout(() => {
      setCurrentView(view);
      setDepth(newDepth);
      if (strate) fetchCollective(strate);
      setViewTransition(null);
    }, 300);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODAL
  // ═══════════════════════════════════════════════════════════════════════════

  const openModal = (type, data = null) => { setModal(type); setModalData(data); };
  const closeModal = () => { setModal(null); setModalData(null); };

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

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
      else alert('Erreur');
    } catch (e) { alert('Erreur'); }
    setLoading(false);
  };

  const handleCreateNote = async (title, text) => {
    setLoading(true);
    try {
      const res = await api('/api/contents', {
        method: 'POST',
        body: JSON.stringify({ content_type: 'note', title, text_content: text })
      });
      if (res.ok) { fetchContents(); closeModal(); }
    } catch (e) {}
    setLoading(false);
  };

  const handleCreateLink = async (title, url, desc) => {
    setLoading(true);
    try {
      const type = (url.includes('youtube') || url.includes('vimeo')) ? 'video' : 'link';
      const res = await api('/api/contents', {
        method: 'POST',
        body: JSON.stringify({ content_type: type, title, file_url: url, description: desc })
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

  const handleMindmap = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await api('/api/mindmaps/generate', {
        method: 'POST',
        body: JSON.stringify({ content_ids: selectedIds, topic: 'Synthèse' })
      });
      if (res.ok) {
        const data = await res.json();
        openModal('mindmap', data.mindmap);
      }
    } catch (e) {}
    setLoading(false);
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
          content_ids: selectedIds.length > 0 ? selectedIds : null,
          conversation_id: currentConv?.id
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, sources: data.sources }]);
        if (!currentConv) {
          setCurrentConv({ id: data.conversation_id });
          fetchConversations();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur.' }]);
    }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getFileUrl = (c) => c.file_url?.startsWith('http') ? c.file_url : `${API_URL}${c.file_url}`;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (!isReady) return null;

  return (
    <div className={`app ${lang === 'ar' ? 'rtl' : ''} ${viewTransition || ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          --bg: #FEFDFB;
          --fg: #1A1A1A;
          --line: #E8E4DC;
          --line-dark: #D0C8BC;
          --accent: #8B7355;
          --muted: #A09080;
          --paper: #FAF8F5;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .app {
          min-height: 100vh;
          background: var(--bg);
          color: var(--fg);
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 17px;
          line-height: 1.65;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .app.rtl { direction: rtl; font-family: 'Amiri', serif; }
        .app.descend { transform: translateY(-20px); opacity: 0; }
        .app.ascend { transform: translateY(20px); opacity: 0; }
        .app.fade { opacity: 0; }
        
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8em; }
        
        /* ═══════════════════════════════════════════════════════════════════
           HEADER — Style manuscrit/journal
        ═══════════════════════════════════════════════════════════════════ */
        .header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--bg);
          border-bottom: 1px solid var(--line);
          height: 52px; padding: 0 2rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .header::after {
          content: '';
          position: absolute; bottom: 3px; left: 2rem; right: 2rem;
          border-bottom: 1px solid var(--line);
        }
        .logo {
          font-size: 1.1rem; font-weight: 500;
          letter-spacing: 0.05em;
        }
        .nav { display: flex; gap: 0.25rem; align-items: center; }
        .nav-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.08em;
          text-transform: uppercase;
          background: transparent; border: none;
          color: var(--muted); padding: 0.6rem 1rem;
          cursor: pointer; position: relative;
          transition: color 0.2s;
        }
        .nav-btn:hover { color: var(--fg); }
        .nav-btn.active { color: var(--fg); }
        .nav-btn.active::after {
          content: '';
          position: absolute; bottom: 0; left: 1rem; right: 1rem;
          border-bottom: 1.5px solid var(--fg);
        }
        .nav-btn.primary {
          background: var(--fg); color: var(--bg);
          padding: 0.5rem 1rem;
        }
        .lang-switch {
          font-family: 'Amiri', serif; font-size: 1rem;
          background: transparent; border: 1px solid var(--line);
          color: var(--muted); padding: 0.2rem 0.6rem;
          cursor: pointer; margin-left: 0.5rem;
        }
        .lang-switch:hover { border-color: var(--fg); color: var(--fg); }
        
        /* ═══════════════════════════════════════════════════════════════════
           SURFACE — Page publique style journal
        ═══════════════════════════════════════════════════════════════════ */
        .surface {
          padding-top: 52px;
        }
        .surface-hero {
          max-width: 800px; margin: 0 auto;
          padding: 5rem 2rem 4rem;
          text-align: center;
          border-bottom: 1px solid var(--line);
        }
        .hero-title {
          font-size: 3rem; font-weight: 400;
          letter-spacing: 0.08em;
          margin-bottom: 1rem;
        }
        .rtl .hero-title { letter-spacing: 0; }
        .hero-subtitle {
          font-size: 1.1rem; color: var(--muted);
          font-style: italic;
          max-width: 500px; margin: 0 auto 3rem;
        }
        .hero-line {
          width: 40px; height: 1px;
          background: var(--line-dark);
          margin: 0 auto 2rem;
        }
        
        /* Strates visuelles — lignes manuscrit */
        .strata-diagram {
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
          margin: 2rem 0;
        }
        .strata-row {
          display: flex; align-items: center;
          width: 280px; padding: 0.6rem 0;
          border-top: 1px solid var(--line);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          transition: all 0.3s;
          cursor: default;
        }
        .strata-row:last-child { border-bottom: 1px solid var(--line); }
        .strata-row:hover { color: var(--fg); padding-left: 1rem; }
        .rtl .strata-row:hover { padding-left: 0; padding-right: 1rem; }
        .strata-depth {
          width: 50px; text-align: right; padding-right: 1rem;
          color: var(--line-dark);
        }
        .rtl .strata-depth { text-align: left; padding-right: 0; padding-left: 1rem; }
        
        /* Institutions */
        .institutions {
          max-width: 900px; margin: 0 auto;
          padding: 4rem 2rem;
          border-bottom: 1px solid var(--line);
        }
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--muted);
          text-align: center; margin-bottom: 2.5rem;
        }
        .inst-grid {
          display: flex; justify-content: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .inst-item { text-align: center; max-width: 220px; }
        .inst-abbr {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.15em;
          color: var(--accent); margin-bottom: 0.5rem;
        }
        .inst-name { font-size: 0.9rem; color: var(--muted); line-height: 1.5; }
        
        /* Publications */
        .publications {
          max-width: 900px; margin: 0 auto;
          padding: 4rem 2rem;
        }
        .pub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem; margin-top: 2rem;
        }
        .pub-card {
          background: var(--paper);
          border: 1px solid var(--line);
          padding: 1.5rem;
          transition: all 0.25s;
          cursor: pointer;
        }
        .pub-card:hover {
          border-color: var(--fg);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .pub-type {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 0.5rem;
        }
        .pub-title { font-size: 1.05rem; margin-bottom: 0.5rem; }
        .pub-author { font-size: 0.8rem; color: var(--muted); font-style: italic; }
        
        /* ═══════════════════════════════════════════════════════════════════
           WORKSPACE — Espace personnel
        ═══════════════════════════════════════════════════════════════════ */
        .workspace {
          display: flex; padding-top: 52px; min-height: 100vh;
        }
        
        /* Sidebar strates */
        .strate-bar {
          width: 48px; background: var(--paper);
          border-right: 1px solid var(--line);
          position: fixed; top: 52px; left: 0; bottom: 0;
          display: flex; flex-direction: column;
          padding-top: 1rem;
        }
        .rtl .strate-bar { left: auto; right: 0; border-right: none; border-left: 1px solid var(--line); }
        .strate-item {
          height: 56px; display: flex;
          flex-direction: column; align-items: center;
          justify-content: center;
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          border-left: 2px solid transparent;
          transition: all 0.2s;
        }
        .rtl .strate-item { border-left: none; border-right: 2px solid transparent; }
        .strate-item:hover { background: var(--bg); color: var(--fg); }
        .strate-item.active { color: var(--fg); border-left-color: var(--fg); background: var(--bg); }
        .rtl .strate-item.active { border-left-color: transparent; border-right-color: var(--fg); }
        .strate-item-icon { font-size: 1.1rem; }
        .strate-item-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; color: var(--line-dark);
          margin-top: 0.15rem;
        }
        
        /* Sidebar actions */
        .sidebar {
          width: 200px; background: var(--bg);
          border-right: 1px solid var(--line);
          position: fixed; top: 52px; left: 48px; bottom: 0;
          padding: 1.5rem 1rem; overflow-y: auto;
        }
        .rtl .sidebar { left: auto; right: 48px; border-right: none; border-left: 1px solid var(--line); }
        .sb-section { margin-bottom: 2rem; }
        .sb-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.75rem;
        }
        .sb-btn {
          display: flex; align-items: center; gap: 0.5rem;
          width: 100%; text-align: left;
          padding: 0.5rem 0.75rem; margin-bottom: 0.2rem;
          background: transparent; border: none;
          font-family: inherit; font-size: 0.85rem;
          color: var(--fg); cursor: pointer;
          border-radius: 3px; transition: background 0.15s;
        }
        .rtl .sb-btn { text-align: right; }
        .sb-btn:hover { background: var(--paper); }
        .sb-btn.active { background: var(--fg); color: var(--bg); }
        .sb-btn-icon { font-size: 0.9rem; opacity: 0.6; }
        
        /* Content area */
        .content-area {
          flex: 1; margin-left: 248px; padding: 2rem;
          padding-bottom: 340px;
        }
        .rtl .content-area { margin-left: 0; margin-right: 248px; }
        .content-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.5rem; padding-bottom: 1rem;
          border-bottom: 1px solid var(--line);
        }
        .content-title { font-size: 1.2rem; }
        
        /* Grid de cartes */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .card {
          background: var(--paper); border: 1px solid var(--line);
          padding: 1.25rem; position: relative;
          transition: all 0.2s;
        }
        .card:hover { border-color: var(--fg); }
        .card.selected { border-color: var(--fg); box-shadow: 0 0 0 1px var(--fg); }
        .card-checkbox {
          position: absolute; top: 1rem; left: 1rem;
          width: 16px; height: 16px;
          border: 1px solid var(--line-dark);
          background: var(--bg); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; color: transparent;
          transition: all 0.15s;
        }
        .rtl .card-checkbox { left: auto; right: 1rem; }
        .card.selected .card-checkbox { background: var(--fg); border-color: var(--fg); color: var(--bg); }
        .card-type {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 0.5rem; margin-left: 1.5rem;
        }
        .rtl .card-type { margin-left: 0; margin-right: 1.5rem; }
        .card-title { font-size: 0.95rem; margin-bottom: 0.4rem; }
        .card-preview {
          font-size: 0.75rem; color: var(--muted);
          font-style: italic; margin-top: 0.5rem;
          max-height: 40px; overflow: hidden;
        }
        .card-actions {
          position: absolute; top: 0.75rem; right: 0.75rem;
          display: flex; gap: 0.25rem; opacity: 0;
          transition: opacity 0.15s;
        }
        .rtl .card-actions { right: auto; left: 0.75rem; }
        .card:hover .card-actions { opacity: 1; }
        .card-action {
          width: 24px; height: 24px;
          background: var(--bg); border: 1px solid var(--line);
          cursor: pointer; font-size: 0.65rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .card-action:hover { background: var(--fg); color: var(--bg); border-color: var(--fg); }
        
        /* Selection bar */
        .selection-bar {
          position: fixed; bottom: 300px;
          left: 248px; right: 0;
          padding: 0.6rem 1.5rem;
          background: var(--fg); color: var(--bg);
          display: flex; justify-content: space-between; align-items: center;
          z-index: 50;
        }
        .rtl .selection-bar { left: 0; right: 248px; }
        .sel-info {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.08em;
        }
        .sel-btns { display: flex; gap: 0.5rem; }
        .sel-btn {
          padding: 0.4rem 0.75rem;
          background: transparent; border: 1px solid var(--bg);
          color: var(--bg);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.08em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.15s;
        }
        .sel-btn:hover { background: var(--bg); color: var(--fg); }
        
        /* Chat panel */
        .chat-panel {
          position: fixed; bottom: 0; right: 0;
          left: 248px; height: 300px;
          background: var(--bg); border-top: 1px solid var(--fg);
          display: flex; flex-direction: column;
        }
        .rtl .chat-panel { left: 0; right: 248px; }
        .chat-header {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid var(--line);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted);
        }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 1rem;
        }
        .chat-msg { margin-bottom: 1rem; }
        .chat-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.25rem;
        }
        .chat-content { font-size: 0.9rem; white-space: pre-wrap; }
        .chat-content.assistant {
          padding-left: 1rem;
          border-left: 1.5px solid var(--accent);
        }
        .rtl .chat-content.assistant { padding-left: 0; padding-right: 1rem; border-left: none; border-right: 1.5px solid var(--accent); }
        .chat-input-row {
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--line);
          display: flex; gap: 0.5rem;
        }
        .chat-input {
          flex: 1; padding: 0.6rem;
          border: 1px solid var(--line);
          font-family: inherit; font-size: 0.9rem;
          background: var(--paper);
        }
        .chat-input:focus { border-color: var(--fg); outline: none; }
        .chat-send {
          padding: 0.6rem 1.25rem;
          background: var(--fg); color: var(--bg); border: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.08em;
          text-transform: uppercase; cursor: pointer;
        }
        .chat-send:disabled { opacity: 0.3; }
        
        /* Empty state */
        .empty-state {
          text-align: center; padding: 4rem 2rem;
          color: var(--muted);
        }
        .empty-icon { font-size: 2rem; margin-bottom: 1rem; opacity: 0.4; }
        
        /* Loading */
        .loading-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; color: var(--muted);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        
        /* ═══════════════════════════════════════════════════════════════════
           MODAL
        ═══════════════════════════════════════════════════════════════════ */
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(250,248,245,0.95);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: var(--bg);
          border: 1px solid var(--fg);
          padding: 2rem; max-width: 460px; width: 90%;
          max-height: 85vh; overflow-y: auto;
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-title {
          font-size: 1.15rem; margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--line);
        }
        .form-group { margin-bottom: 1.25rem; }
        .form-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.5rem;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 0.7rem;
          border: 1px solid var(--line);
          font-family: inherit; font-size: 0.95rem;
          background: var(--paper);
        }
        .form-input:focus, .form-textarea:focus { border-color: var(--fg); outline: none; }
        .form-textarea { min-height: 100px; resize: vertical; }
        .form-row { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        .form-btn {
          flex: 1; padding: 0.8rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer; border: 1px solid var(--fg);
          transition: all 0.15s;
        }
        .form-btn.primary { background: var(--fg); color: var(--bg); }
        .form-btn.secondary { background: transparent; color: var(--fg); }
        .form-btn:hover { opacity: 0.85; }
        .form-link {
          display: block; text-align: center;
          margin-top: 1rem; font-size: 0.85rem;
          color: var(--muted);
        }
        .form-link button {
          background: none; border: none;
          text-decoration: underline; cursor: pointer;
          color: var(--fg);
        }
        
        /* PDF Viewer */
        .pdf-viewer {
          width: 100%; height: 70vh;
          border: 1px solid var(--line);
        }
        
        /* Mindmap */
        .mindmap-display {
          background: var(--paper);
          border: 1px solid var(--line);
          padding: 1.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          white-space: pre-wrap;
          max-height: 400px;
          overflow-y: auto;
        }
        .mm-node { margin: 0.4rem 0; }
        .mm-node-0 { font-weight: 500; font-size: 0.9rem; }
        .mm-node-1 { margin-left: 1.5rem; }
        .mm-node-2 { margin-left: 3rem; color: var(--muted); font-size: 0.7rem; }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="logo">{t.title}</div>
        <nav className="nav">
          <button 
            className={`nav-btn ${currentView === 'surface' ? 'active' : ''}`}
            onClick={() => navigateTo('surface', 0)}
          >
            {t.surface}
          </button>
          {token && user && (
            <>
              <button 
                className={`nav-btn ${currentView === 'workspace' ? 'active' : ''}`}
                onClick={() => navigateTo('workspace', 0)}
              >
                {t.mySpace}
              </button>
              <button 
                className={`nav-btn ${currentView === 'collective' ? 'active' : ''}`}
                onClick={() => navigateTo('collective', user.role === 'pedagogue' ? 1 : 2, user.strate)}
              >
                {t.collective}
              </button>
              <button className="nav-btn" onClick={() => openModal('profile')}>
                {user.display_name}
              </button>
              <button className="nav-btn" onClick={logout}>{t.logout}</button>
            </>
          )}
          {!token && (
            <>
              <button className="nav-btn" onClick={() => openModal('login')}>{t.connect}</button>
              <button className="nav-btn primary" onClick={() => openModal('register')}>{t.register}</button>
            </>
          )}
          <button className="lang-switch" onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}>
            {lang === 'fr' ? 'ع' : 'Fr'}
          </button>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          SURFACE
      ═══════════════════════════════════════════════════════════════════ */}
      {currentView === 'surface' && (
        <div className="surface">
          <section className="surface-hero">
            <h1 className="hero-title">{t.title}</h1>
            <p className="hero-subtitle">{t.subtitle}</p>
            <div className="hero-line" />
            
            <div className="strata-diagram">
              <div className="strata-row">
                <span className="strata-depth">0m</span>
                <span>{t.surface}</span>
              </div>
              <div className="strata-row">
                <span className="strata-depth">−500m</span>
                <span>{t.extraction}</span>
              </div>
              <div className="strata-row">
                <span className="strata-depth">−2km</span>
                <span>{t.sediment}</span>
              </div>
              <div className="strata-row">
                <span className="strata-depth">−5km</span>
                <span>{t.episteme}</span>
              </div>
              <div className="strata-row">
                <span className="strata-depth">−∞</span>
                <span>{t.manteau}</span>
              </div>
            </div>
          </section>

          <section className="institutions">
            <h2 className="section-label">{t.institutions}</h2>
            <div className="inst-grid">
              <div className="inst-item">
                <div className="inst-abbr">INBA</div>
                <div className="inst-name">{t.inba}</div>
              </div>
              <div className="inst-item">
                <div className="inst-abbr">ENSP</div>
                <div className="inst-name">{t.ensp}</div>
              </div>
              <div className="inst-item">
                <div className="inst-abbr">ISBAS</div>
                <div className="inst-name">{t.isbas}</div>
              </div>
            </div>
          </section>

          {publicContents.length > 0 && (
            <section className="publications">
              <h2 className="section-label">{t.publications}</h2>
              <div className="pub-grid">
                {publicContents.map(c => (
                  <div key={c.id} className="pub-card" onClick={() => openModal('viewContent', c)}>
                    <div className="pub-type">{c.content_type}</div>
                    <div className="pub-title">{c.title}</div>
                    <div className="pub-author">{t.by} {c.owner_name}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          WORKSPACE
      ═══════════════════════════════════════════════════════════════════ */}
      {currentView === 'workspace' && token && user && (
        <div className="workspace">
          <nav className="strate-bar">
            <button className={`strate-item ${depth === 0 ? 'active' : ''}`} onClick={() => navigateTo('workspace', 0)}>
              <span className="strate-item-icon">◉</span>
              <span className="strate-item-num">0</span>
            </button>
            {user.role === 'pedagogue' && (
              <button className="strate-item" onClick={() => navigateTo('collective', 1, 'episteme')}>
                <span className="strate-item-icon">◎</span>
                <span className="strate-item-num">I</span>
              </button>
            )}
            <button className="strate-item" onClick={() => navigateTo('collective', 2, 'sediment')}>
              <span className="strate-item-icon">○</span>
              <span className="strate-item-num">II</span>
            </button>
            <button className="strate-item" onClick={() => navigateTo('collective', 3, 'manteau')}>
              <span className="strate-item-icon">◌</span>
              <span className="strate-item-num">III</span>
            </button>
            <button className="strate-item" onClick={() => navigateTo('collective', 4, 'extraction')}>
              <span className="strate-item-icon">·</span>
              <span className="strate-item-num">IV</span>
            </button>
          </nav>
          
          <aside className="sidebar">
            <div className="sb-section">
              <div className="sb-label">{t.import}</div>
              <button className="sb-btn" onClick={() => openModal('upload')}>
                <span className="sb-btn-icon">📄</span> PDF / Image
              </button>
              <button className="sb-btn" onClick={() => openModal('note')}>
                <span className="sb-btn-icon">📝</span> {t.newNote}
              </button>
              <button className="sb-btn" onClick={() => openModal('link')}>
                <span className="sb-btn-icon">🔗</span> {t.addLink}
              </button>
            </div>
            
            <div className="sb-section">
              <div className="sb-label">{t.conversations}</div>
              {conversations.slice(0, 4).map(c => (
                <button 
                  key={c.id}
                  className={`sb-btn ${currentConv?.id === c.id ? 'active' : ''}`}
                  onClick={() => setCurrentConv(c)}
                >
                  {c.title?.slice(0, 25)}...
                </button>
              ))}
              <button className="sb-btn" onClick={() => { setCurrentConv(null); setMessages([]); }}>
                + {t.newConv}
              </button>
            </div>
          </aside>
          
          <div className="content-area">
            <div className="content-header">
              <h1 className="content-title">{t.mySpace}</h1>
            </div>
            
            {contents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◇</div>
                <p style={{ fontStyle: 'italic' }}>{t.import}...</p>
              </div>
            ) : (
              <div className="cards-grid">
                {contents.map(c => (
                  <div key={c.id} className={`card ${selectedIds.includes(c.id) ? 'selected' : ''}`}>
                    <div className="card-checkbox" onClick={() => toggleSelect(c.id)}>
                      {selectedIds.includes(c.id) && '✓'}
                    </div>
                    <div className="card-type">
                      {c.content_type} {c.is_indexed && <span style={{ color: '#6B8E6B' }}>✓</span>}
                    </div>
                    <div className="card-title">{c.title}</div>
                    {c.text_content && <div className="card-preview">{c.text_content}</div>}
                    <div className="card-actions">
                      {(c.content_type === 'pdf' || c.content_type === 'image') && c.file_url && (
                        <button className="card-action" onClick={() => openModal('viewPdf', c)}>👁</button>
                      )}
                      <button className="card-action" onClick={() => openModal('glissement', c)}>→</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedIds.length > 0 && (
            <div className="selection-bar">
              <span className="sel-info">{selectedIds.length} {t.selected}</span>
              <div className="sel-btns">
                <button className="sel-btn" onClick={handleMindmap}>{t.generateMindmap}</button>
                <button className="sel-btn" onClick={() => setSelectedIds([])}>✕</button>
              </div>
            </div>
          )}
          
          <div className="chat-panel">
            <div className="chat-header">💬 {t.askQuestion}</div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className="chat-msg">
                  <div className="chat-role">{m.role === 'user' ? 'Vous' : 'IA'}</div>
                  <div className={`chat-content ${m.role}`}>{m.content}</div>
                </div>
              ))}
              {loading && <div className="loading-text">{t.analyzing}</div>}
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input"
                placeholder={t.askQuestion}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
              />
              <button className="chat-send" onClick={handleChat} disabled={loading}>{t.send}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          COLLECTIVE
      ═══════════════════════════════════════════════════════════════════ */}
      {currentView === 'collective' && token && user && (
        <div className="workspace">
          <nav className="strate-bar">
            <button className="strate-item" onClick={() => navigateTo('workspace', 0)}>
              <span className="strate-item-icon">◉</span>
              <span className="strate-item-num">0</span>
            </button>
            {user.role === 'pedagogue' && (
              <button className={`strate-item ${depth === 1 ? 'active' : ''}`} onClick={() => navigateTo('collective', 1, 'episteme')}>
                <span className="strate-item-icon">◎</span>
                <span className="strate-item-num">I</span>
              </button>
            )}
            <button className={`strate-item ${depth === 2 ? 'active' : ''}`} onClick={() => navigateTo('collective', 2, 'sediment')}>
              <span className="strate-item-icon">○</span>
              <span className="strate-item-num">II</span>
            </button>
            <button className={`strate-item ${depth === 3 ? 'active' : ''}`} onClick={() => navigateTo('collective', 3, 'manteau')}>
              <span className="strate-item-icon">◌</span>
              <span className="strate-item-num">III</span>
            </button>
            <button className={`strate-item ${depth === 4 ? 'active' : ''}`} onClick={() => navigateTo('collective', 4, 'extraction')}>
              <span className="strate-item-icon">·</span>
              <span className="strate-item-num">IV</span>
            </button>
          </nav>
          
          <aside className="sidebar">
            <div className="sb-section">
              <div className="sb-label">{t.collective}</div>
              {user.role === 'pedagogue' && (
                <button className={`sb-btn ${depth === 1 ? 'active' : ''}`} onClick={() => navigateTo('collective', 1, 'episteme')}>
                  {t.strate1}
                </button>
              )}
              <button className={`sb-btn ${depth === 2 ? 'active' : ''}`} onClick={() => navigateTo('collective', 2, 'sediment')}>
                {t.strate2}
              </button>
              <button className={`sb-btn ${depth === 3 ? 'active' : ''}`} onClick={() => navigateTo('collective', 3, 'manteau')}>
                {t.strate3}
              </button>
              <button className={`sb-btn ${depth === 4 ? 'active' : ''}`} onClick={() => navigateTo('collective', 4, 'extraction')}>
                {t.strate4}
              </button>
            </div>
          </aside>
          
          <div className="content-area" style={{ paddingBottom: '2rem' }}>
            <div className="content-header">
              <h1 className="content-title">
                {depth === 1 && t.strate1}
                {depth === 2 && t.strate2}
                {depth === 3 && t.strate3}
                {depth === 4 && t.strate4}
              </h1>
            </div>
            
            {collectiveContents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◇</div>
              </div>
            ) : (
              <div className="cards-grid">
                {collectiveContents.map(c => (
                  <div key={c.id} className="card" onClick={() => openModal('viewContent', c)}>
                    <div className="card-type">{c.content_type}</div>
                    <div className="card-title">{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      {t.by} {c.owner_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════════════════════════ */}
      
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            
            {/* LOGIN */}
            {modal === 'login' && (
              <>
                <h2 className="modal-title">{t.connect}</h2>
                <LoginForm t={t} onSubmit={login} loading={loading} />
                <div className="form-link">
                  <button onClick={() => { closeModal(); openModal('register'); }}>{t.register}</button>
                </div>
              </>
            )}
            
            {/* REGISTER */}
            {modal === 'register' && (
              <>
                <h2 className="modal-title">{t.register}</h2>
                <RegisterForm t={t} onSubmit={register} loading={loading} />
                <div className="form-link">
                  <button onClick={() => { closeModal(); openModal('login'); }}>{t.connect}</button>
                </div>
              </>
            )}
            
            {/* PROFILE */}
            {modal === 'profile' && user && (
              <>
                <h2 className="modal-title">{t.profile}</h2>
                <ProfileForm t={t} user={user} token={token} apiUrl={API_URL} onClose={closeModal} onUpdate={fetchProfile} />
              </>
            )}
            
            {/* UPLOAD */}
            {modal === 'upload' && (
              <>
                <h2 className="modal-title">{t.upload}</h2>
                <UploadForm t={t} onSubmit={handleUpload} loading={loading} onClose={closeModal} />
              </>
            )}
            
            {/* NOTE */}
            {modal === 'note' && (
              <>
                <h2 className="modal-title">{t.newNote}</h2>
                <NoteForm t={t} onSubmit={handleCreateNote} loading={loading} onClose={closeModal} />
              </>
            )}
            
            {/* LINK */}
            {modal === 'link' && (
              <>
                <h2 className="modal-title">{t.addLink}</h2>
                <LinkForm t={t} onSubmit={handleCreateLink} loading={loading} onClose={closeModal} />
              </>
            )}
            
            {/* GLISSEMENT */}
            {modal === 'glissement' && modalData && (
              <>
                <h2 className="modal-title">{t.slideTo}</h2>
                <p style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>{modalData.title}</p>
                <button className="form-btn secondary" style={{ marginBottom: '0.5rem', textAlign: 'left', display: 'block', width: '100%' }} onClick={() => handleGlissement(modalData.id, 'strate')}>
                  → {t.toStrate}
                </button>
                <button className="form-btn secondary" style={{ textAlign: 'left', display: 'block', width: '100%' }} onClick={() => handleGlissement(modalData.id, 'public')}>
                  → {t.toPublic}
                </button>
                <div className="form-row">
                  <button className="form-btn secondary" onClick={closeModal}>{t.cancel}</button>
                </div>
              </>
            )}
            
            {/* VIEW PDF */}
            {modal === 'viewPdf' && modalData && (
              <>
                <h2 className="modal-title">{modalData.title}</h2>
                <iframe 
                  className="pdf-viewer"
                  src={getFileUrl(modalData)}
                  title={modalData.title}
                />
                <div className="form-row">
                  <button className="form-btn secondary" onClick={() => window.open(getFileUrl(modalData), '_blank')}>
                    ↗ {lang === 'fr' ? 'Ouvrir' : 'فتح'}
                  </button>
                  <button className="form-btn primary" onClick={closeModal}>{t.close}</button>
                </div>
              </>
            )}
            
            {/* VIEW CONTENT */}
            {modal === 'viewContent' && modalData && (
              <>
                <h2 className="modal-title">{modalData.title}</h2>
                <div className="pub-type" style={{ marginBottom: '1rem' }}>{modalData.content_type}</div>
                {modalData.description && <p style={{ marginBottom: '1rem' }}>{modalData.description}</p>}
                {modalData.text_content && <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{modalData.text_content}</p>}
                <div className="form-row">
                  <button className="form-btn primary" onClick={closeModal}>{t.close}</button>
                </div>
              </>
            )}
            
            {/* MINDMAP */}
            {modal === 'mindmap' && modalData && (
              <>
                <h2 className="modal-title">🧠 Mindmap</h2>
                <div className="mindmap-display">
                  {modalData.nodes ? (
                    modalData.nodes.map((n, i) => (
                      <div key={i} className={`mm-node mm-node-${n.parent ? (modalData.nodes.find(p => p.id === n.parent)?.parent ? 2 : 1) : 0}`}>
                        {n.parent && '└ '}{n.label}
                      </div>
                    ))
                  ) : (
                    <pre>{JSON.stringify(modalData, null, 2)}</pre>
                  )}
                </div>
                <div className="form-row">
                  <button className="form-btn primary" onClick={closeModal}>{t.close}</button>
                </div>
              </>
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
    <form onSubmit={e => { e.preventDefault(); onSubmit(email, password); }}>
      <div className="form-group">
        <label className="form-label">{t.email}</label>
        <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.password}</label>
        <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="form-row">
        <button type="submit" className="form-btn primary" disabled={loading}>{t.connect}</button>
      </div>
    </form>
  );
}

function RegisterForm({ t, onSubmit, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chercheur');
  const [code, setCode] = useState('');
  
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(email, password, role, code); }}>
      <div className="form-group">
        <label className="form-label">{t.email}</label>
        <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.password}</label>
        <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.role}</label>
        <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
          <option value="chercheur">{t.researcher}</option>
          <option value="pedagogue">{t.pedagogue}</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">{t.invitationCode}</label>
        <input type="text" className="form-input" value={code} onChange={e => setCode(e.target.value)} required placeholder="CHERCHEUR2026" />
      </div>
      <div className="form-row">
        <button type="submit" className="form-btn primary" disabled={loading}>{t.register}</button>
      </div>
    </form>
  );
}

function ProfileForm({ t, user, token, apiUrl, onClose, onUpdate }) {
  const [name, setName] = useState(user.display_name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [inst, setInst] = useState(user.institution || '');
  const [loading, setLoading] = useState(false);
  
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${apiUrl}/api/profile/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ display_name: name, bio, institution: inst })
    });
    onUpdate();
    onClose();
  };
  
  return (
    <form onSubmit={submit}>
      <div style={{ background: 'var(--paper)', padding: '0.75rem', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--muted)' }}>
        {user.email} · {user.role} · {user.strate}
      </div>
      <div className="form-group">
        <label className="form-label">{t.displayName}</label>
        <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.bio}</label>
        <textarea className="form-textarea" value={bio} onChange={e => setBio(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.institution}</label>
        <input type="text" className="form-input" value={inst} onChange={e => setInst(e.target.value)} />
      </div>
      <div className="form-row">
        <button type="button" className="form-btn secondary" onClick={onClose}>{t.close}</button>
        <button type="submit" className="form-btn primary" disabled={loading}>{t.save}</button>
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
    <form onSubmit={e => { e.preventDefault(); if (file && title) onSubmit(file, title, desc, tags.split(',').map(x => x.trim()).filter(Boolean)); }}>
      <div className="form-group">
        <label className="form-label">{t.file}</label>
        <input type="file" accept=".pdf,image/*" onChange={e => { setFile(e.target.files[0]); if (!title && e.target.files[0]) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, '')); }} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.title_label}</label>
        <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.description}</label>
        <textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">{t.tags}</label>
        <input type="text" className="form-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2" />
      </div>
      <div className="form-row">
        <button type="button" className="form-btn secondary" onClick={onClose}>{t.cancel}</button>
        <button type="submit" className="form-btn primary" disabled={loading || !file}>{t.upload}</button>
      </div>
    </form>
  );
}

function NoteForm({ t, onSubmit, loading, onClose }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  
  return (
    <form onSubmit={e => { e.preventDefault(); if (title && text) onSubmit(title, text); }}>
      <div className="form-group">
        <label className="form-label">{t.title_label}</label>
        <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.content}</label>
        <textarea className="form-textarea" value={text} onChange={e => setText(e.target.value)} required style={{ minHeight: '120px' }} />
      </div>
      <div className="form-row">
        <button type="button" className="form-btn secondary" onClick={onClose}>{t.cancel}</button>
        <button type="submit" className="form-btn primary" disabled={loading}>{t.create}</button>
      </div>
    </form>
  );
}

function LinkForm({ t, onSubmit, loading, onClose }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  
  return (
    <form onSubmit={e => { e.preventDefault(); if (title && url) onSubmit(title, url, desc); }}>
      <div className="form-group">
        <label className="form-label">{t.title_label}</label>
        <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.url}</label>
        <input type="url" className="form-input" value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://" />
      </div>
      <div className="form-group">
        <label className="form-label">{t.description}</label>
        <textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} />
      </div>
      <div className="form-row">
        <button type="button" className="form-btn secondary" onClick={onClose}>{t.cancel}</button>
        <button type="submit" className="form-btn primary" disabled={loading}>{t.add}</button>
      </div>
    </form>
  );
}
