// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v5.0 — Frontend Professionnel
// ═══════════════════════════════════════════════════════════════════════════════
//
// - Icônes SVG (pas d'emojis)
// - Design manuscrit/journal lumineux
// - Surface publique avec vision "profondeur"
// - Mindmap interactif (canvas)
// - Recherche web intégrée
// - Animations strates
//
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://accent-leone-genre-housing.trycloudflare.com';

// ═══════════════════════════════════════════════════════════════════════════════
// ICÔNES SVG
// ═══════════════════════════════════════════════════════════════════════════════

const Icons = {
  document: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  note: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  video: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  upload: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  globe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  mindmap: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="4" cy="6" r="2"/>
      <circle cx="20" cy="6" r="2"/>
      <circle cx="4" cy="18" r="2"/>
      <circle cx="20" cy="18" r="2"/>
      <line x1="9.5" y1="10" x2="5.5" y2="7.5"/>
      <line x1="14.5" y1="10" x2="18.5" y2="7.5"/>
      <line x1="9.5" y1="14" x2="5.5" y2="16.5"/>
      <line x1="14.5" y1="14" x2="18.5" y2="16.5"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  message: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  layers: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  comment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRADUCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const T = {
  fr: {
    title: 'Matière Grise',
    subtitle: 'Les origines terrestres de l\'intelligence artificielle',
    surface: 'Surface',
    mySpace: 'Mon Espace',
    collective: 'Collectif',
    connect: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    email: 'Email',
    password: 'Mot de passe',
    role: 'Rôle',
    code: 'Code d\'invitation',
    researcher: 'Chercheur·e',
    pedagogue: 'Pédagogue',
    cancel: 'Annuler',
    save: 'Enregistrer',
    close: 'Fermer',
    import: 'Importer',
    newNote: 'Note',
    addLink: 'Lien',
    newConv: 'Nouvelle conversation',
    askQuestion: 'Posez une question...',
    send: 'Envoyer',
    searchWeb: 'Rechercher sur le web',
    selected: 'sélectionné(s)',
    mindmap: 'Mindmap',
    slideTo: 'Glisser vers',
    toCollective: 'Espace Collectif',
    toPublic: 'Surface Publique',
    profile: 'Profil',
    name: 'Nom',
    bio: 'Biographie',
    institution: 'Institution',
    titleLabel: 'Titre',
    description: 'Description',
    content: 'Contenu',
    url: 'URL',
    tags: 'Tags',
    create: 'Créer',
    add: 'Ajouter',
    upload: 'Importer',
    open: 'Ouvrir',
    delete: 'Supprimer',
    reindex: 'Réindexer',
    indexed: 'indexé',
    notIndexed: 'non indexé',
    by: 'par',
    institutions: 'Institutions partenaires',
    inba: 'Institut National des Beaux-Arts de Tétouan',
    ensp: 'École Nationale Supérieure de la Photographie d\'Arles',
    isbas: 'Institut Supérieur des Beaux-Arts de Sousse',
    publications: 'Publications',
    strate1: 'Épistémè — Pédagogues',
    strate2: 'Sédiment — Chercheurs',
    strate3: 'Manteau — IA Autonome',
    strate4: 'Extraction — Curation',
    depthHint: 'En dessous, des strates de recherche s\'accumulent...',
    visionAnalysis: 'Analyse visuelle',
    webResults: 'Résultats web',
    sources: 'Sources',
    noResults: 'Aucun résultat',
    loading: 'Chargement...'
  },
  ar: {
    title: 'المادة الرمادية',
    subtitle: 'الأصول الأرضية للذكاء الاصطناعي',
    surface: 'السطح',
    mySpace: 'فضائي',
    collective: 'المشترك',
    connect: 'دخول',
    register: 'تسجيل',
    logout: 'خروج',
    email: 'البريد',
    password: 'كلمة المرور',
    role: 'الدور',
    code: 'رمز الدعوة',
    researcher: 'باحث/ة',
    pedagogue: 'مُربّي/ة',
    cancel: 'إلغاء',
    save: 'حفظ',
    close: 'إغلاق',
    import: 'استيراد',
    newNote: 'ملاحظة',
    addLink: 'رابط',
    newConv: 'محادثة جديدة',
    askQuestion: 'اطرح سؤالاً...',
    send: 'إرسال',
    searchWeb: 'البحث في الويب',
    selected: 'محدد',
    mindmap: 'خريطة ذهنية',
    slideTo: 'نقل إلى',
    toCollective: 'الفضاء المشترك',
    toPublic: 'السطح العام',
    profile: 'الملف',
    name: 'الاسم',
    bio: 'السيرة',
    institution: 'المؤسسة',
    titleLabel: 'العنوان',
    description: 'الوصف',
    content: 'المحتوى',
    url: 'الرابط',
    tags: 'الوسوم',
    create: 'إنشاء',
    add: 'إضافة',
    upload: 'استيراد',
    open: 'فتح',
    delete: 'حذف',
    reindex: 'إعادة الفهرسة',
    indexed: 'مُفهرس',
    notIndexed: 'غير مُفهرس',
    by: 'بواسطة',
    institutions: 'المؤسسات الشريكة',
    inba: 'المعهد الوطني للفنون الجميلة بتطوان',
    ensp: 'المدرسة الوطنية العليا للتصوير بآرل',
    isbas: 'المعهد العالي للفنون الجميلة بسوسة',
    publications: 'المنشورات',
    strate1: 'الإبستيمي — المُربّون',
    strate2: 'الرواسب — الباحثون',
    strate3: 'الوشاح — الذكاء الاصطناعي',
    strate4: 'الاستخراج — التنسيق',
    depthHint: 'في الأسفل، تتراكم طبقات من البحث...',
    visionAnalysis: 'التحليل البصري',
    webResults: 'نتائج الويب',
    sources: 'المصادر',
    noResults: 'لا توجد نتائج',
    loading: 'جاري التحميل...'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MatiereGrise() {
  const [lang, setLang] = useState('fr');
  const t = T[lang];
  
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  
  const [view, setView] = useState('surface');
  const [depth, setDepth] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  const [contents, setContents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [collectiveContents, setCollectiveContents] = useState([]);
  const [publicContents, setPublicContents] = useState([]);
  
  const [chatInput, setChatInput] = useState('');
  const [searchWeb, setSearchWeb] = useState(false);
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════════════════

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
        localStorage.setItem('mg_user_id', data.user_id.toString());
        setToken(data.access_token);
        closeModal();
        navigateTo('workspace', 0);
      } else {
        alert((await res.json()).detail || 'Erreur');
      }
    } catch (e) { alert('Erreur'); }
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
        alert((await res.json()).detail || 'Erreur');
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
    setSelected([]);
    navigateTo('surface', 0);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════

  const navigateTo = (newView, newDepth, strate = null) => {
    setTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setDepth(newDepth);
      if (strate) fetchCollective(strate);
      setTransitioning(false);
    }, 250);
  };

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
      if (res.ok) { 
        const data = await res.json();
        fetchContents(); 
        closeModal();
        if (data.vision_analyzed) {
          alert(`Image analysée par IA vision !`);
        }
      }
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

  const handleDelete = async (contentId) => {
    if (!confirm('Supprimer ce contenu ?')) return;
    try {
      await api(`/api/contents/${contentId}`, { method: 'DELETE' });
      fetchContents();
    } catch (e) {}
  };

  const handleReindex = async (contentId) => {
    setLoading(true);
    try {
      const res = await api(`/api/contents/${contentId}/reindex`, { method: 'POST' });
      if (res.ok) {
        fetchContents();
        alert('Réindexation réussie');
      }
    } catch (e) { alert('Erreur'); }
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
          web_results: data.web_results,
          context_found: data.context_found
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

  const getFileUrl = (c) => c.file_url?.startsWith('http') ? c.file_url : `${API_URL}${c.file_url}`;
  
  const getContentIcon = (type) => {
    switch(type) {
      case 'pdf': return Icons.document;
      case 'image': return Icons.image;
      case 'note': return Icons.note;
      case 'link': return Icons.link;
      case 'video': return Icons.video;
      default: return Icons.document;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (!ready) return null;

  return (
    <div className={`app ${lang === 'ar' ? 'rtl' : ''} ${transitioning ? 'transitioning' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          --bg: #FEFDFB;
          --fg: #1A1A1A;
          --line: #E8E4DC;
          --line-dark: #D0C8BC;
          --accent: #8B7355;
          --muted: #9A9080;
          --paper: #FAF8F5;
          --success: #6B8E6B;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .app {
          min-height: 100vh;
          background: var(--bg);
          color: var(--fg);
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 17px;
          line-height: 1.65;
          transition: opacity 0.25s ease;
        }
        .app.rtl { direction: rtl; font-family: 'Amiri', serif; }
        .app.transitioning { opacity: 0.3; }
        
        .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8em; }
        
        /* ═══════════════════════════════════════════════════════════════════
           HEADER
        ═══════════════════════════════════════════════════════════════════ */
        .header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--bg);
          border-bottom: 1px solid var(--line);
          height: 48px; padding: 0 1.5rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .logo {
          font-size: 1rem; font-weight: 500;
          letter-spacing: 0.03em;
        }
        .nav { display: flex; gap: 0.15rem; align-items: center; }
        .nav-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.06em;
          text-transform: uppercase;
          background: transparent; border: none;
          color: var(--muted); padding: 0.5rem 0.75rem;
          cursor: pointer; display: flex; align-items: center; gap: 0.4rem;
          transition: color 0.15s;
        }
        .nav-btn:hover { color: var(--fg); }
        .nav-btn.active { color: var(--fg); }
        .nav-btn.primary {
          background: var(--fg); color: var(--bg);
          padding: 0.4rem 0.75rem;
        }
        .nav-btn.primary:hover { opacity: 0.85; }
        .lang-btn {
          font-family: 'Amiri', serif; font-size: 0.9rem;
          background: transparent; border: 1px solid var(--line);
          color: var(--muted); padding: 0.15rem 0.5rem;
          cursor: pointer; margin-left: 0.5rem;
        }
        .lang-btn:hover { border-color: var(--fg); color: var(--fg); }
        
        /* ═══════════════════════════════════════════════════════════════════
           SURFACE — Page publique
        ═══════════════════════════════════════════════════════════════════ */
        .surface { padding-top: 48px; }
        
        .surface-hero {
          max-width: 720px; margin: 0 auto;
          padding: 4rem 2rem 3rem;
          text-align: center;
          position: relative;
        }
        .hero-title {
          font-size: 2.5rem; font-weight: 400;
          letter-spacing: 0.06em;
          margin-bottom: 0.75rem;
        }
        .rtl .hero-title { letter-spacing: 0; }
        .hero-subtitle {
          font-size: 1rem; color: var(--muted);
          font-style: italic;
          margin-bottom: 2.5rem;
        }
        
        /* Indicateur de profondeur */
        .depth-indicator {
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid var(--line);
          background: linear-gradient(180deg, var(--bg) 0%, var(--paper) 100%);
          position: relative;
          overflow: hidden;
        }
        .depth-lines {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
        }
        .depth-line {
          position: absolute; left: 0; right: 0;
          border-top: 1px solid var(--line);
          opacity: 0.5;
        }
        .depth-line:nth-child(1) { top: 20%; }
        .depth-line:nth-child(2) { top: 40%; }
        .depth-line:nth-child(3) { top: 60%; }
        .depth-line:nth-child(4) { top: 80%; }
        
        .depth-labels {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .depth-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.4rem 0;
          transition: all 0.2s;
          cursor: default;
        }
        .depth-label:hover { color: var(--fg); padding-left: 0.5rem; }
        .rtl .depth-label:hover { padding-left: 0; padding-right: 0.5rem; }
        .depth-num { width: 40px; text-align: right; color: var(--line-dark); }
        .rtl .depth-num { text-align: left; }
        
        .depth-hint {
          margin-top: 1rem;
          font-size: 0.8rem; color: var(--muted);
          font-style: italic;
        }
        
        /* Institutions */
        .institutions {
          max-width: 800px; margin: 0 auto;
          padding: 3rem 2rem;
          border-top: 1px solid var(--line);
        }
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted);
          text-align: center; margin-bottom: 2rem;
        }
        .inst-grid {
          display: flex; justify-content: center;
          gap: 2.5rem; flex-wrap: wrap;
        }
        .inst-item { text-align: center; max-width: 200px; }
        .inst-abbr {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.1em;
          color: var(--accent); margin-bottom: 0.4rem;
        }
        .inst-name { font-size: 0.85rem; color: var(--muted); line-height: 1.4; }
        
        /* Publications */
        .publications {
          max-width: 900px; margin: 0 auto;
          padding: 3rem 2rem;
          border-top: 1px solid var(--line);
        }
        .pub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem; margin-top: 1.5rem;
        }
        .pub-card {
          background: var(--paper);
          border: 1px solid var(--line);
          padding: 1.25rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        .pub-card:hover {
          border-color: var(--fg);
          transform: translateY(-1px);
        }
        .pub-type {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 0.4rem;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .pub-title { font-size: 0.95rem; margin-bottom: 0.3rem; }
        .pub-author { font-size: 0.75rem; color: var(--muted); font-style: italic; }
        .pub-empty {
          text-align: center; padding: 3rem;
          color: var(--muted); font-style: italic;
          border: 1px dashed var(--line);
        }
        
        /* ═══════════════════════════════════════════════════════════════════
           WORKSPACE
        ═══════════════════════════════════════════════════════════════════ */
        .workspace { display: flex; padding-top: 48px; min-height: 100vh; }
        
        /* Strate nav */
        .strate-nav {
          width: 44px; background: var(--paper);
          border-right: 1px solid var(--line);
          position: fixed; top: 48px; left: 0; bottom: 0;
          display: flex; flex-direction: column;
          padding-top: 0.75rem;
        }
        .rtl .strate-nav { left: auto; right: 0; border-right: none; border-left: 1px solid var(--line); }
        .strate-btn {
          height: 48px; display: flex;
          flex-direction: column; align-items: center;
          justify-content: center;
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          border-left: 2px solid transparent;
          transition: all 0.15s;
        }
        .rtl .strate-btn { border-left: none; border-right: 2px solid transparent; }
        .strate-btn:hover { background: var(--bg); color: var(--fg); }
        .strate-btn.active { color: var(--fg); border-left-color: var(--fg); background: var(--bg); }
        .rtl .strate-btn.active { border-left-color: transparent; border-right-color: var(--fg); }
        .strate-btn-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; color: var(--line-dark);
          margin-top: 0.1rem;
        }
        
        /* Sidebar */
        .sidebar {
          width: 180px; background: var(--bg);
          border-right: 1px solid var(--line);
          position: fixed; top: 48px; left: 44px; bottom: 0;
          padding: 1.25rem 0.75rem; overflow-y: auto;
        }
        .rtl .sidebar { left: auto; right: 44px; border-right: none; border-left: 1px solid var(--line); }
        .sb-section { margin-bottom: 1.5rem; }
        .sb-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.5rem; padding: 0 0.5rem;
        }
        .sb-btn {
          display: flex; align-items: center; gap: 0.4rem;
          width: 100%; text-align: left;
          padding: 0.4rem 0.5rem;
          background: transparent; border: none;
          font-family: inherit; font-size: 0.8rem;
          color: var(--fg); cursor: pointer;
          border-radius: 2px; transition: background 0.1s;
        }
        .rtl .sb-btn { text-align: right; }
        .sb-btn:hover { background: var(--paper); }
        .sb-btn.active { background: var(--fg); color: var(--bg); }
        .sb-btn svg { opacity: 0.5; flex-shrink: 0; }
        .sb-btn.active svg { opacity: 1; }
        
        /* Content */
        .content-area {
          flex: 1; margin-left: 224px; padding: 1.5rem;
          padding-bottom: 320px;
        }
        .rtl .content-area { margin-left: 0; margin-right: 224px; }
        .content-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1.25rem; padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--line);
        }
        .content-title { font-size: 1.1rem; }
        
        /* Cards */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
        }
        .card {
          background: var(--paper); border: 1px solid var(--line);
          padding: 1rem; position: relative;
          transition: all 0.15s;
        }
        .card:hover { border-color: var(--fg); }
        .card.selected { border-color: var(--fg); box-shadow: 0 0 0 1px var(--fg); }
        .card-check {
          position: absolute; top: 0.75rem; left: 0.75rem;
          width: 14px; height: 14px;
          border: 1px solid var(--line-dark);
          background: var(--bg); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .rtl .card-check { left: auto; right: 0.75rem; }
        .card.selected .card-check { background: var(--fg); border-color: var(--fg); color: var(--bg); }
        .card-type {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 0.4rem; margin-left: 1.25rem;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .rtl .card-type { margin-left: 0; margin-right: 1.25rem; }
        .card-type svg { width: 12px; height: 12px; }
        .card-title { font-size: 0.9rem; margin-bottom: 0.3rem; }
        .card-preview {
          font-size: 0.7rem; color: var(--muted);
          font-style: italic; margin-top: 0.4rem;
          max-height: 36px; overflow: hidden;
        }
        .card-vision {
          font-size: 0.65rem; color: var(--accent);
          margin-top: 0.3rem; padding: 0.3rem;
          background: rgba(139,115,85,0.08);
          border-left: 2px solid var(--accent);
        }
        .card-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.4rem; letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 0.4rem;
        }
        .card-status.indexed { color: var(--success); }
        .card-status.not-indexed { color: var(--muted); }
        .card-actions {
          position: absolute; top: 0.5rem; right: 0.5rem;
          display: flex; gap: 0.15rem; opacity: 0;
          transition: opacity 0.1s;
        }
        .rtl .card-actions { right: auto; left: 0.5rem; }
        .card:hover .card-actions { opacity: 1; }
        .card-action {
          width: 22px; height: 22px;
          background: var(--bg); border: 1px solid var(--line);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.1s;
        }
        .card-action svg { width: 12px; height: 12px; }
        .card-action:hover { background: var(--fg); color: var(--bg); border-color: var(--fg); }
        
        /* Selection bar */
        .selection-bar {
          position: fixed; bottom: 280px;
          left: 224px; right: 0;
          padding: 0.5rem 1rem;
          background: var(--fg); color: var(--bg);
          display: flex; justify-content: space-between; align-items: center;
          z-index: 50;
        }
        .rtl .selection-bar { left: 0; right: 224px; }
        .sel-info {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.06em;
        }
        .sel-btns { display: flex; gap: 0.4rem; }
        .sel-btn {
          padding: 0.3rem 0.6rem;
          background: transparent; border: 1px solid var(--bg);
          color: var(--bg);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .sel-btn:hover { background: var(--bg); color: var(--fg); }
        
        /* Chat panel */
        .chat-panel {
          position: fixed; bottom: 0; right: 0;
          left: 224px; height: 280px;
          background: var(--bg); border-top: 1px solid var(--fg);
          display: flex; flex-direction: column;
        }
        .rtl .chat-panel { left: 0; right: 224px; }
        .chat-header {
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid var(--line);
          display: flex; justify-content: space-between; align-items: center;
        }
        .chat-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--muted);
          display: flex; align-items: center; gap: 0.4rem;
        }
        .chat-web-toggle {
          display: flex; align-items: center; gap: 0.3rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; color: var(--muted);
          cursor: pointer;
        }
        .chat-web-toggle input { margin: 0; }
        .chat-web-toggle.active { color: var(--accent); }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 0.75rem;
        }
        .chat-msg { margin-bottom: 0.75rem; }
        .chat-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.15rem;
        }
        .chat-content { font-size: 0.85rem; white-space: pre-wrap; }
        .chat-content.assistant {
          padding-left: 0.75rem;
          border-left: 1.5px solid var(--accent);
        }
        .rtl .chat-content.assistant { 
          padding-left: 0; padding-right: 0.75rem; 
          border-left: none; border-right: 1.5px solid var(--accent); 
        }
        .chat-sources {
          margin-top: 0.4rem; padding: 0.4rem;
          background: var(--paper); font-size: 0.7rem;
        }
        .chat-sources-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.25rem;
        }
        .chat-source { color: var(--accent); margin-bottom: 0.15rem; }
        .chat-web-result {
          padding: 0.3rem 0;
          border-bottom: 1px solid var(--line);
        }
        .chat-web-result:last-child { border-bottom: none; }
        .chat-web-result a { color: var(--accent); text-decoration: none; }
        .chat-web-result a:hover { text-decoration: underline; }
        .chat-input-row {
          padding: 0.6rem 0.75rem;
          border-top: 1px solid var(--line);
          display: flex; gap: 0.4rem;
        }
        .chat-input {
          flex: 1; padding: 0.5rem;
          border: 1px solid var(--line);
          font-family: inherit; font-size: 0.85rem;
          background: var(--paper);
        }
        .chat-input:focus { border-color: var(--fg); outline: none; }
        .chat-send {
          padding: 0.5rem 1rem;
          background: var(--fg); color: var(--bg); border: none;
          cursor: pointer; display: flex; align-items: center; gap: 0.3rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .chat-send:disabled { opacity: 0.3; }
        
        /* Empty */
        .empty {
          text-align: center; padding: 3rem 1.5rem;
          color: var(--muted);
          border: 1px dashed var(--line);
        }
        .empty svg { opacity: 0.3; margin-bottom: 0.75rem; }
        
        /* Loading */
        .loading-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; color: var(--muted);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        
        /* ═══════════════════════════════════════════════════════════════════
           MODAL
        ═══════════════════════════════════════════════════════════════════ */
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(250,248,245,0.95);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-box {
          background: var(--bg);
          border: 1px solid var(--fg);
          padding: 1.5rem; max-width: 420px; width: 90%;
          max-height: 85vh; overflow-y: auto;
        }
        .modal-title {
          font-size: 1rem; margin-bottom: 1.25rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid var(--line);
        }
        .form-group { margin-bottom: 1rem; }
        .form-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 0.35rem;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 0.6rem;
          border: 1px solid var(--line);
          font-family: inherit; font-size: 0.9rem;
          background: var(--paper);
        }
        .form-input:focus, .form-textarea:focus { border-color: var(--fg); outline: none; }
        .form-textarea { min-height: 80px; resize: vertical; }
        .form-row { display: flex; gap: 0.6rem; margin-top: 1.25rem; }
        .form-btn {
          flex: 1; padding: 0.65rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer; border: 1px solid var(--fg);
        }
        .form-btn.primary { background: var(--fg); color: var(--bg); }
        .form-btn.secondary { background: transparent; color: var(--fg); }
        .form-link {
          display: block; text-align: center;
          margin-top: 0.75rem; font-size: 0.8rem; color: var(--muted);
        }
        .form-link button {
          background: none; border: none;
          text-decoration: underline; cursor: pointer; color: var(--fg);
        }
        
        /* PDF Viewer */
        .pdf-viewer {
          width: 100%; height: 60vh;
          border: 1px solid var(--line);
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="logo">{t.title}</div>
        <nav className="nav">
          <button className={`nav-btn ${view === 'surface' ? 'active' : ''}`} onClick={() => navigateTo('surface', 0)}>
            {Icons.layers} {t.surface}
          </button>
          {token && user && (
            <>
              <button className={`nav-btn ${view === 'workspace' ? 'active' : ''}`} onClick={() => navigateTo('workspace', 0)}>
                {Icons.document} {t.mySpace}
              </button>
              <button className={`nav-btn ${view === 'collective' ? 'active' : ''}`} onClick={() => navigateTo('collective', user.role === 'pedagogue' ? 1 : 2, user.strate)}>
                {Icons.layers} {t.collective}
              </button>
              <button className="nav-btn" onClick={() => openModal('profile')}>
                {Icons.user} {user.display_name}
              </button>
              <button className="nav-btn" onClick={logout}>
                {Icons.logout}
              </button>
            </>
          )}
          {!token && (
            <>
              <button className="nav-btn" onClick={() => openModal('login')}>{t.connect}</button>
              <button className="nav-btn primary" onClick={() => openModal('register')}>{t.register}</button>
            </>
          )}
          <button className="lang-btn" onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}>
            {lang === 'fr' ? 'ع' : 'Fr'}
          </button>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          SURFACE
      ═══════════════════════════════════════════════════════════════════ */}
      {view === 'surface' && (
        <div className="surface">
          <section className="surface-hero">
            <h1 className="hero-title">{t.title}</h1>
            <p className="hero-subtitle">{t.subtitle}</p>
            
            <div className="depth-indicator">
              <div className="depth-lines">
                <div className="depth-line" />
                <div className="depth-line" />
                <div className="depth-line" />
                <div className="depth-line" />
              </div>
              <div className="depth-labels">
                <div className="depth-label"><span className="depth-num">0m</span> {t.surface}</div>
                <div className="depth-label"><span className="depth-num">−500m</span> {t.strate4.split('—')[0]}</div>
                <div className="depth-label"><span className="depth-num">−2km</span> {t.strate2.split('—')[0]}</div>
                <div className="depth-label"><span className="depth-num">−5km</span> {t.strate1.split('—')[0]}</div>
                <div className="depth-label"><span className="depth-num">−∞</span> {t.strate3.split('—')[0]}</div>
              </div>
              <p className="depth-hint">{t.depthHint}</p>
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

          <section className="publications">
            <h2 className="section-label">{t.publications}</h2>
            {publicContents.length === 0 ? (
              <div className="pub-empty">{t.noResults}</div>
            ) : (
              <div className="pub-grid">
                {publicContents.map(c => (
                  <div key={c.id} className="pub-card" onClick={() => openModal('viewContent', c)}>
                    <div className="pub-type">{getContentIcon(c.content_type)} {c.content_type}</div>
                    <div className="pub-title">{c.title}</div>
                    <div className="pub-author">{t.by} {c.owner_name}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          WORKSPACE
      ═══════════════════════════════════════════════════════════════════ */}
      {view === 'workspace' && token && user && (
        <div className="workspace">
          <nav className="strate-nav">
            <button className={`strate-btn ${depth === 0 ? 'active' : ''}`} onClick={() => navigateTo('workspace', 0)}>
              {Icons.user}
              <span className="strate-btn-num">0</span>
            </button>
            {user.role === 'pedagogue' && (
              <button className="strate-btn" onClick={() => navigateTo('collective', 1, 'episteme')}>
                {Icons.layers}
                <span className="strate-btn-num">I</span>
              </button>
            )}
            <button className="strate-btn" onClick={() => navigateTo('collective', 2, 'sediment')}>
              {Icons.layers}
              <span className="strate-btn-num">II</span>
            </button>
          </nav>
          
          <aside className="sidebar">
            <div className="sb-section">
              <div className="sb-label">{t.import}</div>
              <button className="sb-btn" onClick={() => openModal('upload')}>
                {Icons.upload} PDF / Image
              </button>
              <button className="sb-btn" onClick={() => openModal('note')}>
                {Icons.note} {t.newNote}
              </button>
              <button className="sb-btn" onClick={() => openModal('link')}>
                {Icons.link} {t.addLink}
              </button>
            </div>
            
            <div className="sb-section">
              <div className="sb-label">{t.mindmap}</div>
              <button className="sb-btn" onClick={() => openModal('mindmap')}>
                {Icons.mindmap} {t.create}
              </button>
            </div>
            
            <div className="sb-section">
              <div className="sb-label">Conversations</div>
              {conversations.slice(0, 3).map(c => (
                <button 
                  key={c.id}
                  className={`sb-btn ${currentConv?.id === c.id ? 'active' : ''}`}
                  onClick={() => setCurrentConv(c)}
                >
                  {Icons.message} {c.title?.slice(0, 18)}...
                </button>
              ))}
              <button className="sb-btn" onClick={() => { setCurrentConv(null); setMessages([]); }}>
                {Icons.plus} {t.newConv}
              </button>
            </div>
          </aside>
          
          <div className="content-area">
            <div className="content-header">
              <h1 className="content-title">{t.mySpace}</h1>
            </div>
            
            {contents.length === 0 ? (
              <div className="empty">
                {Icons.document}
                <p>{t.import}...</p>
              </div>
            ) : (
              <div className="cards-grid">
                {contents.map(c => (
                  <div key={c.id} className={`card ${selected.includes(c.id) ? 'selected' : ''}`}>
                    <div className="card-check" onClick={() => toggleSelect(c.id)}>
                      {selected.includes(c.id) && Icons.check}
                    </div>
                    <div className="card-type">
                      {getContentIcon(c.content_type)} {c.content_type}
                    </div>
                    <div className="card-title">{c.title}</div>
                    {c.text_content && <div className="card-preview">{c.text_content}</div>}
                    {c.vision_description && (
                      <div className="card-vision">{t.visionAnalysis}: {c.vision_description}</div>
                    )}
                    <div className={`card-status ${c.is_indexed ? 'indexed' : 'not-indexed'}`}>
                      {c.is_indexed ? t.indexed : t.notIndexed}
                    </div>
                    <div className="card-actions">
                      {(c.content_type === 'pdf' || c.content_type === 'image') && c.file_url && (
                        <button className="card-action" onClick={() => openModal('viewPdf', c)}>
                          {Icons.eye}
                        </button>
                      )}
                      <button className="card-action" onClick={() => openModal('glissement', c)}>
                        {Icons.arrow}
                      </button>
                      {!c.is_indexed && (
                        <button className="card-action" onClick={() => handleReindex(c.id)}>
                          {Icons.search}
                        </button>
                      )}
                      <button className="card-action" onClick={() => handleDelete(c.id)}>
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selected.length > 0 && (
            <div className="selection-bar">
              <span className="sel-info">{selected.length} {t.selected}</span>
              <div className="sel-btns">
                <button className="sel-btn" onClick={() => openModal('mindmap')}>
                  {Icons.mindmap} {t.mindmap}
                </button>
                <button className="sel-btn" onClick={() => setSelected([])}>
                  {Icons.x}
                </button>
              </div>
            </div>
          )}
          
          <div className="chat-panel">
            <div className="chat-header">
              <span className="chat-title">{Icons.message} Chat RAG</span>
              <label className={`chat-web-toggle ${searchWeb ? 'active' : ''}`}>
                <input type="checkbox" checked={searchWeb} onChange={e => setSearchWeb(e.target.checked)} />
                {Icons.globe} {t.searchWeb}
              </label>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className="chat-msg">
                  <div className="chat-role">{m.role === 'user' ? 'Vous' : 'IA'}</div>
                  <div className={`chat-content ${m.role}`}>{m.content}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="chat-sources">
                      <div className="chat-sources-title">{t.sources}</div>
                      {m.sources.map((s, j) => (
                        <div key={j} className="chat-source">{s.title} ({Math.round(s.similarity * 100)}%)</div>
                      ))}
                    </div>
                  )}
                  {m.web_results && m.web_results.length > 0 && (
                    <div className="chat-sources">
                      <div className="chat-sources-title">{t.webResults}</div>
                      {m.web_results.map((r, j) => (
                        <div key={j} className="chat-web-result">
                          <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
                          <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{r.snippet}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && <div className="loading-text">{t.loading}</div>}
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input"
                placeholder={t.askQuestion}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
              />
              <button className="chat-send" onClick={handleChat} disabled={loading}>
                {Icons.send} {t.send}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          COLLECTIVE
      ═══════════════════════════════════════════════════════════════════ */}
      {view === 'collective' && token && user && (
        <div className="workspace">
          <nav className="strate-nav">
            <button className="strate-btn" onClick={() => navigateTo('workspace', 0)}>
              {Icons.user}
              <span className="strate-btn-num">0</span>
            </button>
            {user.role === 'pedagogue' && (
              <button className={`strate-btn ${depth === 1 ? 'active' : ''}`} onClick={() => navigateTo('collective', 1, 'episteme')}>
                {Icons.layers}
                <span className="strate-btn-num">I</span>
              </button>
            )}
            <button className={`strate-btn ${depth === 2 ? 'active' : ''}`} onClick={() => navigateTo('collective', 2, 'sediment')}>
              {Icons.layers}
              <span className="strate-btn-num">II</span>
            </button>
          </nav>
          
          <aside className="sidebar">
            <div className="sb-section">
              <div className="sb-label">{t.collective}</div>
              {user.role === 'pedagogue' && (
                <button className={`sb-btn ${depth === 1 ? 'active' : ''}`} onClick={() => navigateTo('collective', 1, 'episteme')}>
                  {Icons.layers} {t.strate1}
                </button>
              )}
              <button className={`sb-btn ${depth === 2 ? 'active' : ''}`} onClick={() => navigateTo('collective', 2, 'sediment')}>
                {Icons.layers} {t.strate2}
              </button>
            </div>
          </aside>
          
          <div className="content-area" style={{ paddingBottom: '2rem' }}>
            <div className="content-header">
              <h1 className="content-title">
                {depth === 1 && t.strate1}
                {depth === 2 && t.strate2}
              </h1>
            </div>
            
            {collectiveContents.length === 0 ? (
              <div className="empty">
                {Icons.layers}
                <p>{t.noResults}</p>
              </div>
            ) : (
              <div className="cards-grid">
                {collectiveContents.map(c => (
                  <div key={c.id} className="card" onClick={() => openModal('viewContent', c)}>
                    <div className="card-type">{getContentIcon(c.content_type)} {c.content_type}</div>
                    <div className="card-title">{c.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
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
            
            {modal === 'login' && (
              <>
                <h2 className="modal-title">{t.connect}</h2>
                <LoginForm t={t} onSubmit={login} loading={loading} />
                <div className="form-link">
                  <button onClick={() => { closeModal(); openModal('register'); }}>{t.register}</button>
                </div>
              </>
            )}
            
            {modal === 'register' && (
              <>
                <h2 className="modal-title">{t.register}</h2>
                <RegisterForm t={t} onSubmit={register} loading={loading} />
                <div className="form-link">
                  <button onClick={() => { closeModal(); openModal('login'); }}>{t.connect}</button>
                </div>
              </>
            )}
            
            {modal === 'profile' && user && (
              <>
                <h2 className="modal-title">{t.profile}</h2>
                <ProfileForm t={t} user={user} token={token} apiUrl={API_URL} onClose={closeModal} onUpdate={fetchProfile} />
              </>
            )}
            
            {modal === 'upload' && (
              <>
                <h2 className="modal-title">{t.upload}</h2>
                <UploadForm t={t} onSubmit={handleUpload} loading={loading} onClose={closeModal} />
              </>
            )}
            
            {modal === 'note' && (
              <>
                <h2 className="modal-title">{t.newNote}</h2>
                <NoteForm t={t} onSubmit={handleCreateNote} loading={loading} onClose={closeModal} />
              </>
            )}
            
            {modal === 'link' && (
              <>
                <h2 className="modal-title">{t.addLink}</h2>
                <LinkForm t={t} onSubmit={handleCreateLink} loading={loading} onClose={closeModal} />
              </>
            )}
            
            {modal === 'glissement' && modalData && (
              <>
                <h2 className="modal-title">{t.slideTo}</h2>
                <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--muted)' }}>{modalData.title}</p>
                <button className="form-btn secondary" style={{ marginBottom: '0.4rem', display: 'block', width: '100%' }} onClick={() => handleGlissement(modalData.id, 'strate')}>
                  {Icons.arrow} {t.toCollective}
                </button>
                <button className="form-btn secondary" style={{ display: 'block', width: '100%' }} onClick={() => handleGlissement(modalData.id, 'public')}>
                  {Icons.globe} {t.toPublic}
                </button>
                <div className="form-row">
                  <button className="form-btn secondary" onClick={closeModal}>{t.cancel}</button>
                </div>
              </>
            )}
            
            {modal === 'viewPdf' && modalData && (
              <>
                <h2 className="modal-title">{modalData.title}</h2>
                <iframe className="pdf-viewer" src={getFileUrl(modalData)} title={modalData.title} />
                <div className="form-row">
                  <button className="form-btn secondary" onClick={() => window.open(getFileUrl(modalData), '_blank')}>
                    {Icons.download} {t.open}
                  </button>
                  <button className="form-btn primary" onClick={closeModal}>{t.close}</button>
                </div>
              </>
            )}
            
            {modal === 'viewContent' && modalData && (
              <>
                <h2 className="modal-title">{modalData.title}</h2>
                <div className="pub-type" style={{ marginBottom: '0.75rem' }}>{getContentIcon(modalData.content_type)} {modalData.content_type}</div>
                {modalData.description && <p style={{ marginBottom: '0.75rem' }}>{modalData.description}</p>}
                <div className="form-row">
                  <button className="form-btn primary" onClick={closeModal}>{t.close}</button>
                </div>
              </>
            )}
            
            {modal === 'mindmap' && (
              <>
                <h2 className="modal-title">{t.mindmap}</h2>
                <MindmapEditor 
                  t={t} 
                  token={token} 
                  apiUrl={API_URL} 
                  selectedContents={selected} 
                  onClose={closeModal} 
                />
              </>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORMS
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
        <label className="form-label">{t.code}</label>
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
      <div style={{ background: 'var(--paper)', padding: '0.5rem', marginBottom: '1rem', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--muted)' }}>
        {user.email} · {user.role} · {user.strate}
      </div>
      <div className="form-group">
        <label className="form-label">{t.name}</label>
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
        <label className="form-label">Fichier</label>
        <input type="file" accept=".pdf,image/*" onChange={e => { setFile(e.target.files[0]); if (!title && e.target.files[0]) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, '')); }} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.titleLabel}</label>
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
        <label className="form-label">{t.titleLabel}</label>
        <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label className="form-label">{t.content}</label>
        <textarea className="form-textarea" value={text} onChange={e => setText(e.target.value)} required style={{ minHeight: '100px' }} />
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
        <label className="form-label">{t.titleLabel}</label>
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

// ═══════════════════════════════════════════════════════════════════════════════
// MINDMAP EDITOR (Interactive Canvas)
// ═══════════════════════════════════════════════════════════════════════════════

function MindmapEditor({ t, token, apiUrl, selectedContents, onClose }) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [mindmapId] = useState(() => `mm_${Date.now()}`);
  
  // Créer un nœud
  const addNode = async (x, y, label = 'Nouveau nœud') => {
    const newNode = { id: Date.now(), label, x, y, parent_node_id: null };
    setNodes(prev => [...prev, newNode]);
    
    // Sauvegarder
    try {
      const res = await fetch(`${apiUrl}/api/mindmaps/nodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ mindmap_id: mindmapId, label, x, y })
      });
      if (res.ok) {
        const data = await res.json();
        setNodes(prev => prev.map(n => n.id === newNode.id ? { ...n, id: data.id } : n));
      }
    } catch (e) {}
  };
  
  // Double-click pour ajouter
  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addNode(x, y);
  };
  
  // Drag
  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    setDragging({ node, offsetX: e.clientX - node.x, offsetY: e.clientY - node.y });
  };
  
  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setNodes(prev => prev.map(n => n.id === dragging.node.id ? { ...n, x, y } : n));
    }
  };
  
  const handleMouseUp = async () => {
    if (dragging) {
      const node = nodes.find(n => n.id === dragging.node.id);
      if (node && typeof node.id === 'number') {
        try {
          await fetch(`${apiUrl}/api/mindmaps/nodes/${node.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ x: node.x, y: node.y })
          });
        } catch (e) {}
      }
    }
    setDragging(null);
  };
  
  // Éditer le label
  const editLabel = (node) => {
    const newLabel = prompt('Nouveau label:', node.label);
    if (newLabel) {
      setNodes(prev => prev.map(n => n.id === node.id ? { ...n, label: newLabel } : n));
      if (typeof node.id === 'number') {
        fetch(`${apiUrl}/api/mindmaps/nodes/${node.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ label: newLabel })
        });
      }
    }
  };
  
  // Supprimer
  const deleteNode = async (node) => {
    setNodes(prev => prev.filter(n => n.id !== node.id));
    if (typeof node.id === 'number') {
      try {
        await fetch(`${apiUrl}/api/mindmaps/nodes/${node.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {}
    }
  };
  
  // Connecter des nœuds
  const startConnect = (node) => {
    setConnecting(node);
  };
  
  const endConnect = async (targetNode) => {
    if (connecting && connecting.id !== targetNode.id) {
      setNodes(prev => prev.map(n => n.id === targetNode.id ? { ...n, parent_node_id: connecting.id } : n));
      if (typeof targetNode.id === 'number') {
        try {
          await fetch(`${apiUrl}/api/mindmaps/nodes/${targetNode.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ parent_node_id: connecting.id })
          });
        } catch (e) {}
      }
    }
    setConnecting(null);
  };
  
  return (
    <div>
      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
        Double-clic pour ajouter un nœud. Glissez pour déplacer. Clic droit pour connecter.
      </p>
      
      <div
        ref={canvasRef}
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '300px',
          border: '1px solid var(--line)',
          background: 'var(--paper)',
          position: 'relative',
          overflow: 'hidden',
          cursor: dragging ? 'grabbing' : 'crosshair'
        }}
      >
        {/* Lignes de connexion */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {nodes.filter(n => n.parent_node_id).map(n => {
            const parent = nodes.find(p => p.id === n.parent_node_id);
            if (!parent) return null;
            return (
              <line
                key={`line-${n.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={n.x}
                y2={n.y}
                stroke="var(--line-dark)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        {/* Nœuds */}
        {nodes.map(node => (
          <div
            key={node.id}
            onMouseDown={e => handleMouseDown(e, node)}
            onDoubleClick={e => { e.stopPropagation(); editLabel(node); }}
            onContextMenu={e => { e.preventDefault(); connecting ? endConnect(node) : startConnect(node); }}
            style={{
              position: 'absolute',
              left: node.x - 40,
              top: node.y - 15,
              width: '80px',
              padding: '0.3rem',
              background: connecting?.id === node.id ? 'var(--accent)' : 'var(--bg)',
              color: connecting?.id === node.id ? 'var(--bg)' : 'var(--fg)',
              border: '1px solid var(--fg)',
              fontSize: '0.65rem',
              textAlign: 'center',
              cursor: 'grab',
              userSelect: 'none'
            }}
          >
            {node.label}
            <button
              onClick={e => { e.stopPropagation(); deleteNode(node); }}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '14px',
                height: '14px',
                background: 'var(--fg)',
                color: 'var(--bg)',
                border: 'none',
                fontSize: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="form-row">
        <button className="form-btn secondary" onClick={() => addNode(150, 150)}>
          + Ajouter nœud
        </button>
        <button className="form-btn primary" onClick={onClose}>{t.close}</button>
      </div>
    </div>
  );
}
