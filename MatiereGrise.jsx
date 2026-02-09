// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v5.1 — Frontend Professionnel
// ═══════════════════════════════════════════════════════════════════════════════
//
// Améliorations v5.1:
// - Consultation des contenus partout (PDF, images, texte)
// - Système d'annotations complet
// - Chat RAG intelligent avec contexte automatique
// - Affichage des synthèses IA autonome
// - Design manuscrit lumineux avec icônes SVG
//
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://prep-membrane-vocational-connect.trycloudflare.com';

// ═══════════════════════════════════════════════════════════════════════════════
// ICÔNES SVG
// ═══════════════════════════════════════════════════════════════════════════════

const Icons = {
  document: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  image: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
  note: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
  video: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>,
  upload: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  message: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  layers: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  comment: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  brain: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04" /></svg>,
  highlight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
  bookmark: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
  zap: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>,
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
    send: 'Envoyer',
    searchWeb: 'Recherche web',
    selected: 'sélectionné(s)',
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
    depthHint: 'En dessous, des strates de recherche s\'accumulent...',
    visionAnalysis: 'Analyse visuelle',
    webResults: 'Résultats web',
    sources: 'Sources utilisées',
    noResults: 'Aucun résultat',
    loading: 'Chargement...',
    annotations: 'Annotations',
    addAnnotation: 'Ajouter une annotation',
    comment: 'Commentaire',
    highlight: 'Surligner',
    question: 'Question',
    syntheses: 'Synthèses IA',
    noSyntheses: 'Aucune synthèse disponible',
    documentsContext: 'documents en contexte',
    askQuestion: 'Posez votre question...',
    chatContextInfo: 'L\'IA utilise automatiquement vos documents sélectionnés',
    viewContent: 'Voir le contenu',
    fullText: 'Texte complet',
    preview: 'Aperçu'
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
    send: 'إرسال',
    searchWeb: 'البحث في الويب',
    selected: 'محدد',
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
    depthHint: 'في الأسفل، تتراكم طبقات من البحث...',
    visionAnalysis: 'التحليل البصري',
    webResults: 'نتائج الويب',
    sources: 'المصادر المستخدمة',
    noResults: 'لا توجد نتائج',
    loading: 'جاري التحميل...',
    annotations: 'التعليقات',
    addAnnotation: 'إضافة تعليق',
    comment: 'تعليق',
    highlight: 'تمييز',
    question: 'سؤال',
    syntheses: 'تركيبات الذكاء',
    noSyntheses: 'لا توجد تركيبات',
    documentsContext: 'وثائق في السياق',
    askQuestion: 'اطرح سؤالك...',
    chatContextInfo: 'الذكاء يستخدم تلقائياً وثائقك المحددة',
    viewContent: 'عرض المحتوى',
    fullText: 'النص الكامل',
    preview: 'معاينة'
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
  const [syntheses, setSyntheses] = useState([]);

  const [chatInput, setChatInput] = useState('');
  const [searchWeb, setSearchWeb] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

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
        fetchSyntheses();
      }
    }
  }, [token, ready]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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
    } catch (e) { }
  };

  const fetchContents = async () => {
    try {
      const res = await api('/api/contents');
      if (res.ok) setContents(await res.json());
    } catch (e) { }
  };

  const fetchConversations = async () => {
    try {
      const res = await api('/api/conversations');
      if (res.ok) setConversations(await res.json());
    } catch (e) { }
  };

  const fetchCollective = async (strate) => {
    try {
      const res = await api(`/api/strate/${strate}/contents`);
      if (res.ok) setCollectiveContents(await res.json());
    } catch (e) { }
  };

  const fetchPublic = async () => {
    try {
      const res = await fetch(`${API_URL}/api/surface/contents`);
      if (res.ok) setPublicContents(await res.json());
    } catch (e) { }
  };

  const fetchSyntheses = async () => {
    try {
      const res = await api('/api/syntheses');
      if (res.ok) setSyntheses(await res.json());
    } catch (e) { }
  };

  const fetchContentDetail = async (contentId) => {
    try {
      const res = await api(`/api/contents/${contentId}`);
      if (res.ok) return await res.json();
    } catch (e) { }
    return null;
  };

  const fetchAnnotations = async (contentId) => {
    try {
      const res = await api(`/api/contents/${contentId}/annotations`);
      if (res.ok) return await res.json();
    } catch (e) { }
    return [];
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
        alert((await res.json()).detail || 'Erreur');
      }
    } catch (e) { alert('Erreur de connexion'); }
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
    }, 200);
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
        fetchContents();
        closeModal();
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
    } catch (e) { }
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
    } catch (e) { }
    setLoading(false);
  };

  const handleGlissement = async (contentId, target) => {
    try {
      const res = await api('/api/glissements', {
        method: 'POST',
        body: JSON.stringify({ content_id: contentId, target_visibility: target })
      });
      if (res.ok) { fetchContents(); fetchPublic(); closeModal(); }
    } catch (e) { }
  };

  const handleDelete = async (contentId) => {
    if (!confirm('Supprimer ce contenu ?')) return;
    try {
      await api(`/api/contents/${contentId}`, { method: 'DELETE' });
      fetchContents();
    } catch (e) { }
  };

  const handleReindex = async (contentId) => {
    setLoading(true);
    try {
      const res = await api(`/api/contents/${contentId}/reindex`, { method: 'POST' });
      if (res.ok) {
        fetchContents();
      }
    } catch (e) { }
    setLoading(false);
  };

  const handleAddAnnotation = async (contentId, text, type = 'comment') => {
    try {
      const res = await api('/api/annotations', {
        method: 'POST',
        body: JSON.stringify({
          content_id: contentId,
          text,
          annotation_type: type,
          visibility: 'strate'
        })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
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
          documents_used: data.documents_used
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

  const getFileUrl = (c) => {
    if (!c.file_url) return null;
    return c.file_url.startsWith('http') ? c.file_url : `${API_URL}${c.file_url}`;
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'pdf': return Icons.document;
      case 'image': return Icons.image;
      case 'note': return Icons.note;
      case 'link': return Icons.link;
      case 'video': return Icons.video;
      default: return Icons.file;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (!ready) return null;

  return (
    <div className={`app ${lang === 'ar' ? 'rtl' : ''} ${transitioning ? 'trans' : ''}`}>
      <style>{styles}</style>

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
              <button className="nav-btn" onClick={() => openModal('syntheses')}>
                {Icons.brain}
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
              <div className="depth-labels">
                <div className="depth-label"><span className="depth-num">0m</span> {t.surface}</div>
                <div className="depth-label"><span className="depth-num">−500m</span> Épistémè</div>
                <div className="depth-label"><span className="depth-num">−2km</span> Sédiment</div>
                <div className="depth-label"><span className="depth-num">−∞</span> Manteau</div>
              </div>
              <p className="depth-hint">{t.depthHint}</p>
            </div>
          </section>

          <section className="institutions">
            <h2 className="section-label">{t.institutions}</h2>
            <div className="inst-grid">
              <div className="inst-item"><div className="inst-abbr">INBA</div><div className="inst-name">{t.inba}</div></div>
              <div className="inst-item"><div className="inst-abbr">ENSP</div><div className="inst-name">{t.ensp}</div></div>
              <div className="inst-item"><div className="inst-abbr">ISBAS</div><div className="inst-name">{t.isbas}</div></div>
            </div>
          </section>

          <section className="publications">
            <h2 className="section-label">{t.publications}</h2>
            {publicContents.length === 0 ? (
              <div className="empty-box">{t.noResults}</div>
            ) : (
              <div className="pub-grid">
                {publicContents.map(c => (
                  <div key={c.id} className="pub-card" onClick={() => openModal('contentViewer', c)}>
                    <div className="pub-type">{getContentIcon(c.content_type)} {c.content_type}</div>
                    <div className="pub-title">{c.title}</div>
                    {c.description && <div className="pub-desc">{c.description}</div>}
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
              {Icons.user}<span className="strate-num">0</span>
            </button>
            {user.role === 'pedagogue' && (
              <button className="strate-btn" onClick={() => navigateTo('collective', 1, 'episteme')}>
                {Icons.layers}<span className="strate-num">I</span>
              </button>
            )}
            <button className="strate-btn" onClick={() => navigateTo('collective', 2, 'sediment')}>
              {Icons.layers}<span className="strate-num">II</span>
            </button>
          </nav>

          <aside className="sidebar">
            <div className="sb-section">
              <div className="sb-label">{t.import}</div>
              <button className="sb-btn" onClick={() => openModal('upload')}>{Icons.upload} PDF / Image</button>
              <button className="sb-btn" onClick={() => openModal('note')}>{Icons.note} {t.newNote}</button>
              <button className="sb-btn" onClick={() => openModal('link')}>{Icons.link} {t.addLink}</button>
            </div>

            <div className="sb-section">
              <div className="sb-label">Conversations</div>
              {conversations.slice(0, 4).map(c => (
                <button
                  key={c.id}
                  className={`sb-btn ${currentConv?.id === c.id ? 'active' : ''}`}
                  onClick={() => { setCurrentConv(c); setMessages([]); }}
                >
                  {Icons.message} {c.title?.slice(0, 16)}...
                </button>
              ))}
              <button className="sb-btn" onClick={() => { setCurrentConv(null); setMessages([]); }}>
                {Icons.plus} Nouvelle
              </button>
            </div>
          </aside>

          <div className="content-area">
            <div className="content-header">
              <h1 className="content-title">{t.mySpace}</h1>
              {selected.length > 0 && (
                <div className="selection-info">
                  {selected.length} {t.selected}
                  <button className="clear-sel" onClick={() => setSelected([])}>{Icons.x}</button>
                </div>
              )}
            </div>

            {contents.length === 0 ? (
              <div className="empty-box">{Icons.document}<p>Importez vos premiers documents</p></div>
            ) : (
              <div className="cards-grid">
                {contents.map(c => (
                  <ContentCard
                    key={c.id}
                    content={c}
                    selected={selected.includes(c.id)}
                    onSelect={() => toggleSelect(c.id)}
                    onView={() => openModal('contentViewer', c)}
                    onSlide={() => openModal('glissement', c)}
                    onReindex={() => handleReindex(c.id)}
                    onDelete={() => handleDelete(c.id)}
                    getIcon={getContentIcon}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Chat Panel */}
          <div className="chat-panel">
            <div className="chat-header">
              <span className="chat-title">{Icons.message} Chat IA</span>
              {selected.length > 0 && (
                <span className="chat-context">{selected.length} {t.documentsContext}</span>
              )}
              <label className={`web-toggle ${searchWeb ? 'active' : ''}`}>
                <input type="checkbox" checked={searchWeb} onChange={e => setSearchWeb(e.target.checked)} />
                {Icons.globe} {t.searchWeb}
              </label>
            </div>

            <div className="chat-messages" ref={chatRef}>
              {messages.length === 0 && (
                <div className="chat-empty">
                  <p>{t.chatContextInfo}</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role}`}>
                  <div className="msg-role">{m.role === 'user' ? 'Vous' : 'IA'}</div>
                  <div className="msg-content">{m.content}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="msg-sources">
                      <div className="sources-title">{t.sources}</div>
                      {m.sources.map((s, j) => (
                        <div key={j} className="source-item">
                          {getContentIcon(s.type)} {s.title}
                          {s.from_rag && <span className="rag-badge">RAG</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {m.web_results && m.web_results.length > 0 && (
                    <div className="msg-web">
                      <div className="sources-title">{t.webResults}</div>
                      {m.web_results.map((r, j) => (
                        <a key={j} className="web-result" href={r.url} target="_blank" rel="noopener noreferrer">
                          {r.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && <div className="loading-indicator">{t.loading}</div>}
            </div>

            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input"
                placeholder={t.askQuestion}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChat()}
              />
              <button className="chat-send" onClick={handleChat} disabled={loading || !chatInput.trim()}>
                {Icons.send}
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
              {Icons.user}<span className="strate-num">0</span>
            </button>
            {user.role === 'pedagogue' && (
              <button className={`strate-btn ${depth === 1 ? 'active' : ''}`} onClick={() => navigateTo('collective', 1, 'episteme')}>
                {Icons.layers}<span className="strate-num">I</span>
              </button>
            )}
            <button className={`strate-btn ${depth === 2 ? 'active' : ''}`} onClick={() => navigateTo('collective', 2, 'sediment')}>
              {Icons.layers}<span className="strate-num">II</span>
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

          <div className="content-area full">
            <div className="content-header">
              <h1 className="content-title">{depth === 1 ? t.strate1 : t.strate2}</h1>
            </div>

            {collectiveContents.length === 0 ? (
              <div className="empty-box">{Icons.layers}<p>{t.noResults}</p></div>
            ) : (
              <div className="cards-grid">
                {collectiveContents.map(c => (
                  <div key={c.id} className="card" onClick={() => openModal('contentViewer', c)}>
                    <div className="card-type">{getContentIcon(c.content_type)} {c.content_type}</div>
                    <div className="card-title">{c.title}</div>
                    {c.text_content && <div className="card-preview">{c.text_content}</div>}
                    <div className="card-meta">
                      {t.by} {c.owner?.display_name || 'Anonyme'}
                      {c.annotations_count > 0 && (
                        <span className="annotations-badge">{Icons.comment} {c.annotations_count}</span>
                      )}
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
          <div className={`modal-box ${modal === 'contentViewer' ? 'large' : ''}`} onClick={e => e.stopPropagation()}>

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
                <p className="modal-subtitle">{modalData.title}</p>
                <div className="glissement-btns">
                  <button className="glissement-btn" onClick={() => handleGlissement(modalData.id, 'strate')}>
                    {Icons.layers} {t.toCollective}
                  </button>
                  <button className="glissement-btn" onClick={() => handleGlissement(modalData.id, 'public')}>
                    {Icons.globe} {t.toPublic}
                  </button>
                </div>
                <button className="form-btn secondary full" onClick={closeModal}>{t.cancel}</button>
              </>
            )}

            {modal === 'contentViewer' && modalData && (
              <ContentViewer
                content={modalData}
                token={token}
                apiUrl={API_URL}
                onClose={closeModal}
                onAddAnnotation={handleAddAnnotation}
                fetchDetail={fetchContentDetail}
                fetchAnnotations={fetchAnnotations}
                t={t}
                getIcon={getContentIcon}
              />
            )}

            {modal === 'syntheses' && (
              <>
                <h2 className="modal-title">{t.syntheses}</h2>
                <SynthesesList syntheses={syntheses} t={t} />
                <button className="form-btn primary full" onClick={closeModal}>{t.close}</button>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT CARD
// ═══════════════════════════════════════════════════════════════════════════════

function ContentCard({ content, selected, onSelect, onView, onSlide, onReindex, onDelete, getIcon, t }) {
  return (
    <div className={`card ${selected ? 'selected' : ''}`}>
      <div className="card-check" onClick={onSelect}>
        {selected && Icons.check}
      </div>
      <div className="card-type">{getIcon(content.content_type)} {content.content_type}</div>
      <div className="card-title">{content.title}</div>
      {content.text_content && <div className="card-preview">{content.text_content}</div>}
      {content.vision_description && (
        <div className="card-vision">{Icons.eye} {content.vision_description}</div>
      )}
      <div className={`card-status ${content.is_indexed ? 'indexed' : ''}`}>
        {content.is_indexed ? t.indexed : t.notIndexed}
      </div>
      <div className="card-actions">
        <button className="card-action" onClick={onView} title={t.viewContent}>{Icons.eye}</button>
        <button className="card-action" onClick={onSlide} title={t.slideTo}>{Icons.arrow}</button>
        {!content.is_indexed && (
          <button className="card-action" onClick={onReindex} title={t.reindex}>{Icons.search}</button>
        )}
        <button className="card-action danger" onClick={onDelete} title={t.delete}>{Icons.trash}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT VIEWER
// ═══════════════════════════════════════════════════════════════════════════════

function ContentViewer({ content, token, apiUrl, onClose, onAddAnnotation, fetchDetail, fetchAnnotations, t, getIcon }) {
  const [detail, setDetail] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [annotationType, setAnnotationType] = useState('comment');
  const [tab, setTab] = useState('content');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [content.id]);

  const loadData = async () => {
    setLoading(true);
    const d = await fetchDetail(content.id);
    if (d) setDetail(d);
    const a = await fetchAnnotations(content.id);
    setAnnotations(a);
    setLoading(false);
  };

  const handleSubmitAnnotation = async () => {
    if (!newAnnotation.trim()) return;
    const success = await onAddAnnotation(content.id, newAnnotation, annotationType);
    if (success) {
      setNewAnnotation('');
      loadData();
    }
  };

  const fileUrl = detail?.file_url ? (detail.file_url.startsWith('http') ? detail.file_url : `${apiUrl}${detail.file_url}`) : null;

  return (
    <div className="content-viewer">
      <div className="viewer-header">
        <div className="viewer-type">{getIcon(content.content_type)} {content.content_type}</div>
        <h2 className="viewer-title">{content.title}</h2>
        {detail?.owner && (
          <div className="viewer-author">{t.by} {detail.owner.display_name} {detail.owner.institution && `· ${detail.owner.institution}`}</div>
        )}
        <button className="viewer-close" onClick={onClose}>{Icons.x}</button>
      </div>

      <div className="viewer-tabs">
        <button className={`viewer-tab ${tab === 'content' ? 'active' : ''}`} onClick={() => setTab('content')}>
          {Icons.file} {t.content}
        </button>
        <button className={`viewer-tab ${tab === 'annotations' ? 'active' : ''}`} onClick={() => setTab('annotations')}>
          {Icons.comment} {t.annotations} ({annotations.length})
        </button>
      </div>

      {loading ? (
        <div className="viewer-loading">{t.loading}</div>
      ) : (
        <div className="viewer-body">
          {tab === 'content' && (
            <div className="viewer-content">
              {/* PDF */}
              {content.content_type === 'pdf' && fileUrl && (
                <div className="viewer-pdf">
                  <iframe src={fileUrl} title={content.title} />
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="open-external">
                    {Icons.download} {t.open}
                  </a>
                </div>
              )}

              {/* Image */}
              {content.content_type === 'image' && fileUrl && (
                <div className="viewer-image">
                  <img src={fileUrl} alt={content.title} />
                </div>
              )}

              {/* Vision description */}
              {detail?.vision_description && (
                <div className="viewer-vision">
                  <div className="vision-label">{Icons.eye} {t.visionAnalysis}</div>
                  <p>{detail.vision_description}</p>
                </div>
              )}

              {/* Text content */}
              {detail?.text_content && (
                <div className="viewer-text">
                  <div className="text-label">{t.fullText}</div>
                  <div className="text-content">{detail.text_content}</div>
                </div>
              )}

              {/* Link / Video */}
              {(content.content_type === 'link' || content.content_type === 'video') && detail?.file_url && (
                <div className="viewer-link">
                  <a href={detail.file_url} target="_blank" rel="noopener noreferrer">
                    {Icons.link} {detail.file_url}
                  </a>
                </div>
              )}

              {/* Description */}
              {detail?.description && (
                <div className="viewer-description">
                  <p>{detail.description}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'annotations' && (
            <div className="viewer-annotations">
              <div className="annotation-form">
                <div className="annotation-types">
                  {['comment', 'highlight', 'question'].map(type => (
                    <button
                      key={type}
                      className={`type-btn ${annotationType === type ? 'active' : ''}`}
                      onClick={() => setAnnotationType(type)}
                    >
                      {type === 'comment' && Icons.comment}
                      {type === 'highlight' && Icons.highlight}
                      {type === 'question' && Icons.search}
                      {t[type] || type}
                    </button>
                  ))}
                </div>
                <textarea
                  className="annotation-input"
                  placeholder={t.addAnnotation}
                  value={newAnnotation}
                  onChange={e => setNewAnnotation(e.target.value)}
                />
                <button className="annotation-submit" onClick={handleSubmitAnnotation} disabled={!newAnnotation.trim()}>
                  {Icons.send} {t.add}
                </button>
              </div>

              <div className="annotations-list">
                {annotations.length === 0 ? (
                  <div className="no-annotations">{t.noResults}</div>
                ) : (
                  annotations.map(a => (
                    <div key={a.id} className={`annotation-item ${a.annotation_type}`}>
                      <div className="annotation-header">
                        <span className="annotation-author">{a.author?.display_name}</span>
                        <span className="annotation-type-badge">{a.annotation_type}</span>
                      </div>
                      <p className="annotation-text">{a.text}</p>
                      <div className="annotation-date">{new Date(a.created_at).toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYNTHESES LIST
// ═══════════════════════════════════════════════════════════════════════════════

function SynthesesList({ syntheses, t }) {
  if (syntheses.length === 0) {
    return <div className="no-syntheses">{t.noSyntheses}</div>;
  }

  return (
    <div className="syntheses-list">
      {syntheses.map(s => (
        <div key={s.id} className="synthesis-item">
          <div className="synthesis-header">
            <span className="synthesis-scope">{s.scope}: {s.scope_id}</span>
            <span className="synthesis-date">{new Date(s.created_at).toLocaleDateString()}</span>
          </div>
          <h3 className="synthesis-title">{s.title}</h3>
          <p className="synthesis-summary">{s.summary}</p>
          {s.key_themes && s.key_themes.length > 0 && (
            <div className="synthesis-themes">
              {s.key_themes.map((theme, i) => (
                <span key={i} className="theme-tag">{theme}</span>
              ))}
            </div>
          )}
          <div className="synthesis-stats">{s.contents_analyzed} documents analysés</div>
        </div>
      ))}
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
      <button type="submit" className="form-btn primary full" disabled={loading}>{t.connect}</button>
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
        <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
          <option value="chercheur">{t.researcher}</option>
          <option value="pedagogue">{t.pedagogue}</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">{t.code}</label>
        <input type="text" className="form-input" value={code} onChange={e => setCode(e.target.value)} required placeholder="CHERCHEUR2026" />
      </div>
      <button type="submit" className="form-btn primary full" disabled={loading}>{t.register}</button>
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
      <div className="profile-info">{user.email} · {user.role} · {user.strate}</div>
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
      <div className="form-actions">
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
  return (
    <form onSubmit={e => { e.preventDefault(); if (file && title) onSubmit(file, title, desc, []); }}>
      <div className="form-group">
        <label className="form-label">Fichier (PDF ou Image)</label>
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
      <div className="form-actions">
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
        <textarea className="form-textarea tall" value={text} onChange={e => setText(e.target.value)} required />
      </div>
      <div className="form-actions">
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
      <div className="form-actions">
        <button type="button" className="form-btn secondary" onClick={onClose}>{t.cancel}</button>
        <button type="submit" className="form-btn primary" disabled={loading}>{t.add}</button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  --bg: #FEFDFB;
  --fg: #1A1A1A;
  --line: #E8E4DC;
  --line-dark: #D0C8BC;
  --accent: #8B7355;
  --muted: #9A9080;
  --paper: #FAF8F5;
  --success: #5A8F5A;
  --danger: #A65050;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

.app {
  min-height: 100vh;
  background: var(--bg);
  color: var(--fg);
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 17px;
  line-height: 1.6;
  transition: opacity 0.2s;
}
.app.rtl { direction: rtl; font-family: 'Amiri', serif; }
.app.trans { opacity: 0.4; }

.mono { font-family: 'JetBrains Mono', monospace; font-size: 0.75em; }

/* ═══ HEADER ═══ */
.header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--line);
  height: 48px; padding: 0 1.5rem;
  display: flex; justify-content: space-between; align-items: center;
}
.logo { font-size: 1rem; font-weight: 500; letter-spacing: 0.03em; }
.nav { display: flex; gap: 0.15rem; align-items: center; }
.nav-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem; letter-spacing: 0.05em;
  text-transform: uppercase;
  background: transparent; border: none;
  color: var(--muted); padding: 0.5rem 0.7rem;
  cursor: pointer; display: flex; align-items: center; gap: 0.35rem;
  transition: color 0.15s;
}
.nav-btn:hover, .nav-btn.active { color: var(--fg); }
.nav-btn.primary { background: var(--fg); color: var(--bg); }
.lang-btn {
  font-family: 'Amiri', serif; font-size: 0.9rem;
  background: transparent; border: 1px solid var(--line);
  color: var(--muted); padding: 0.1rem 0.4rem;
  cursor: pointer; margin-left: 0.5rem;
}
.lang-btn:hover { border-color: var(--fg); color: var(--fg); }

/* ═══ SURFACE ═══ */
.surface { padding-top: 48px; }
.surface-hero {
  max-width: 700px; margin: 0 auto;
  padding: 4rem 2rem 2rem;
  text-align: center;
}
.hero-title { font-size: 2.4rem; font-weight: 400; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.hero-subtitle { font-size: 1rem; color: var(--muted); font-style: italic; margin-bottom: 2rem; }
.depth-indicator {
  padding: 1.5rem;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, var(--bg) 0%, var(--paper) 100%);
}
.depth-labels { display: flex; flex-direction: column; gap: 0.4rem; }
.depth-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem; letter-spacing: 0.06em;
  color: var(--muted);
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.3rem 0;
}
.depth-num { width: 40px; text-align: right; color: var(--line-dark); }
.depth-hint { margin-top: 1rem; font-size: 0.8rem; color: var(--muted); font-style: italic; }

.institutions, .publications {
  max-width: 800px; margin: 0 auto;
  padding: 2.5rem 2rem;
  border-top: 1px solid var(--line);
}
.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--muted);
  text-align: center; margin-bottom: 1.5rem;
}
.inst-grid { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
.inst-item { text-align: center; max-width: 180px; }
.inst-abbr { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 0.3rem; }
.inst-name { font-size: 0.8rem; color: var(--muted); line-height: 1.4; }

.pub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
.pub-card {
  background: var(--paper); border: 1px solid var(--line);
  padding: 1rem; cursor: pointer; transition: all 0.15s;
}
.pub-card:hover { border-color: var(--fg); transform: translateY(-1px); }
.pub-type { font-family: 'JetBrains Mono', monospace; font-size: 0.45rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.3rem; }
.pub-title { font-size: 0.9rem; margin-bottom: 0.2rem; }
.pub-desc { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.3rem; }
.pub-author { font-size: 0.7rem; color: var(--muted); font-style: italic; }

.empty-box {
  text-align: center; padding: 3rem; color: var(--muted);
  border: 1px dashed var(--line); font-style: italic;
}
.empty-box svg { margin-bottom: 0.5rem; opacity: 0.4; }

/* ═══ WORKSPACE ═══ */
.workspace { display: flex; padding-top: 48px; min-height: 100vh; }

.strate-nav {
  width: 44px; background: var(--paper);
  border-right: 1px solid var(--line);
  position: fixed; top: 48px; left: 0; bottom: 0;
  display: flex; flex-direction: column; padding-top: 0.5rem;
}
.strate-btn {
  height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: transparent; border: none; border-left: 2px solid transparent;
  color: var(--muted); cursor: pointer; transition: all 0.15s;
}
.strate-btn:hover { background: var(--bg); color: var(--fg); }
.strate-btn.active { color: var(--fg); border-left-color: var(--fg); background: var(--bg); }
.strate-num { font-family: 'JetBrains Mono', monospace; font-size: 0.5rem; color: var(--line-dark); margin-top: 0.1rem; }

.sidebar {
  width: 160px; background: var(--bg);
  border-right: 1px solid var(--line);
  position: fixed; top: 48px; left: 44px; bottom: 0;
  padding: 1rem 0.6rem; overflow-y: auto;
}
.sb-section { margin-bottom: 1.25rem; }
.sb-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 0.4rem; padding: 0 0.4rem;
}
.sb-btn {
  display: flex; align-items: center; gap: 0.35rem;
  width: 100%; text-align: left;
  padding: 0.35rem 0.4rem;
  background: transparent; border: none;
  font-family: inherit; font-size: 0.75rem;
  color: var(--fg); cursor: pointer;
  transition: background 0.1s;
}
.sb-btn:hover { background: var(--paper); }
.sb-btn.active { background: var(--fg); color: var(--bg); }
.sb-btn svg { opacity: 0.5; flex-shrink: 0; }

.content-area {
  flex: 1; margin-left: 204px; padding: 1.25rem;
  padding-bottom: 300px;
}
.content-area.full { padding-bottom: 2rem; }
.content-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--line);
}
.content-title { font-size: 1.05rem; }
.selection-info {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem; color: var(--accent);
  display: flex; align-items: center; gap: 0.4rem;
}
.clear-sel { background: none; border: none; cursor: pointer; color: var(--muted); }

/* ═══ CARDS ═══ */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.6rem; }
.card {
  background: var(--paper); border: 1px solid var(--line);
  padding: 0.9rem; position: relative; cursor: pointer;
  transition: all 0.15s;
}
.card:hover { border-color: var(--fg); }
.card.selected { border-color: var(--fg); box-shadow: 0 0 0 1px var(--fg); }
.card-check {
  position: absolute; top: 0.6rem; left: 0.6rem;
  width: 14px; height: 14px;
  border: 1px solid var(--line-dark); background: var(--bg);
  display: flex; align-items: center; justify-content: center;
}
.card.selected .card-check { background: var(--fg); border-color: var(--fg); color: var(--bg); }
.card-type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--accent);
  margin-bottom: 0.3rem; margin-left: 1.1rem;
  display: flex; align-items: center; gap: 0.25rem;
}
.card-title { font-size: 0.85rem; margin-bottom: 0.2rem; }
.card-preview { font-size: 0.7rem; color: var(--muted); font-style: italic; max-height: 32px; overflow: hidden; }
.card-vision {
  font-size: 0.6rem; color: var(--accent); margin-top: 0.25rem;
  padding: 0.25rem; background: rgba(139,115,85,0.06);
  border-left: 2px solid var(--accent);
  display: flex; align-items: flex-start; gap: 0.25rem;
  max-height: 40px; overflow: hidden;
}
.card-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.4rem; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted); margin-top: 0.3rem;
}
.card-status.indexed { color: var(--success); }
.card-meta { font-size: 0.65rem; color: var(--muted); margin-top: 0.3rem; display: flex; align-items: center; gap: 0.5rem; }
.annotations-badge { display: flex; align-items: center; gap: 0.2rem; color: var(--accent); }
.card-actions {
  position: absolute; top: 0.4rem; right: 0.4rem;
  display: flex; gap: 0.15rem; opacity: 0;
  transition: opacity 0.1s;
}
.card:hover .card-actions { opacity: 1; }
.card-action {
  width: 20px; height: 20px;
  background: var(--bg); border: 1px solid var(--line);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.1s;
}
.card-action svg { width: 11px; height: 11px; }
.card-action:hover { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.card-action.danger:hover { background: var(--danger); border-color: var(--danger); }

/* ═══ CHAT PANEL ═══ */
.chat-panel {
  position: fixed; bottom: 0; right: 0;
  left: 204px; height: 280px;
  background: var(--bg); border-top: 1px solid var(--fg);
  display: flex; flex-direction: column;
}
.chat-header {
  padding: 0.4rem 0.7rem;
  border-bottom: 1px solid var(--line);
  display: flex; align-items: center; gap: 0.75rem;
}
.chat-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted);
  display: flex; align-items: center; gap: 0.3rem;
}
.chat-context {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem; color: var(--accent);
  background: rgba(139,115,85,0.1);
  padding: 0.15rem 0.4rem;
}
.web-toggle {
  margin-left: auto;
  display: flex; align-items: center; gap: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem; color: var(--muted);
  cursor: pointer;
}
.web-toggle input { margin: 0; }
.web-toggle.active { color: var(--accent); }
.chat-messages { flex: 1; overflow-y: auto; padding: 0.6rem; }
.chat-empty { text-align: center; padding: 2rem; color: var(--muted); font-size: 0.8rem; font-style: italic; }
.chat-msg { margin-bottom: 0.6rem; }
.msg-role {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 0.1rem;
}
.msg-content { font-size: 0.8rem; white-space: pre-wrap; }
.chat-msg.assistant .msg-content {
  padding-left: 0.6rem; border-left: 1.5px solid var(--accent);
}
.msg-sources, .msg-web {
  margin-top: 0.3rem; padding: 0.3rem;
  background: var(--paper); font-size: 0.65rem;
}
.sources-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.4rem; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 0.2rem;
}
.source-item { display: flex; align-items: center; gap: 0.25rem; color: var(--accent); margin-bottom: 0.1rem; }
.rag-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.35rem; background: var(--accent); color: var(--bg);
  padding: 0.05rem 0.2rem;
}
.web-result { display: block; color: var(--accent); text-decoration: none; margin-bottom: 0.1rem; }
.web-result:hover { text-decoration: underline; }
.loading-indicator {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem; color: var(--muted);
  animation: pulse 1.5s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.chat-input-row {
  padding: 0.5rem 0.6rem;
  border-top: 1px solid var(--line);
  display: flex; gap: 0.3rem;
}
.chat-input {
  flex: 1; padding: 0.45rem;
  border: 1px solid var(--line);
  font-family: inherit; font-size: 0.8rem;
  background: var(--paper);
}
.chat-input:focus { border-color: var(--fg); outline: none; }
.chat-send {
  padding: 0.45rem 0.8rem;
  background: var(--fg); color: var(--bg); border: none;
  cursor: pointer; display: flex; align-items: center;
}
.chat-send:disabled { opacity: 0.3; }

/* ═══ MODAL ═══ */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(250,248,245,0.95);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.modal-box {
  background: var(--bg);
  border: 1px solid var(--fg);
  padding: 1.25rem; max-width: 400px; width: 100%;
  max-height: 85vh; overflow-y: auto;
}
.modal-box.large { max-width: 700px; }
.modal-title {
  font-size: 1rem; margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line);
}
.modal-subtitle { font-size: 0.85rem; color: var(--muted); font-style: italic; margin-bottom: 1rem; }
.form-group { margin-bottom: 0.85rem; }
.form-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 0.25rem;
}
.form-input, .form-textarea {
  width: 100%; padding: 0.5rem;
  border: 1px solid var(--line);
  font-family: inherit; font-size: 0.85rem;
  background: var(--paper);
}
.form-input:focus, .form-textarea:focus { border-color: var(--fg); outline: none; }
.form-textarea { min-height: 70px; resize: vertical; }
.form-textarea.tall { min-height: 120px; }
.form-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.form-btn {
  flex: 1; padding: 0.55rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem; letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer; border: 1px solid var(--fg);
}
.form-btn.primary { background: var(--fg); color: var(--bg); }
.form-btn.secondary { background: transparent; color: var(--fg); }
.form-btn.full { width: 100%; margin-top: 0.5rem; }
.form-link {
  display: block; text-align: center;
  margin-top: 0.6rem; font-size: 0.75rem; color: var(--muted);
}
.form-link button {
  background: none; border: none;
  text-decoration: underline; cursor: pointer; color: var(--fg);
}
.profile-info {
  background: var(--paper); padding: 0.4rem;
  margin-bottom: 0.85rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem; color: var(--muted);
}
.glissement-btns { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
.glissement-btn {
  padding: 0.6rem;
  background: transparent; border: 1px solid var(--line);
  font-family: inherit; font-size: 0.85rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  transition: all 0.15s;
}
.glissement-btn:hover { border-color: var(--fg); background: var(--paper); }

/* ═══ CONTENT VIEWER ═══ */
.content-viewer { min-height: 400px; }
.viewer-header { position: relative; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--line); }
.viewer-type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--accent);
  display: flex; align-items: center; gap: 0.25rem;
  margin-bottom: 0.25rem;
}
.viewer-title { font-size: 1.1rem; margin-bottom: 0.2rem; padding-right: 2rem; }
.viewer-author { font-size: 0.75rem; color: var(--muted); font-style: italic; }
.viewer-close {
  position: absolute; top: 0; right: 0;
  background: none; border: none; cursor: pointer;
  color: var(--muted); padding: 0.25rem;
}
.viewer-close:hover { color: var(--fg); }
.viewer-tabs { display: flex; gap: 0.25rem; margin-bottom: 1rem; }
.viewer-tab {
  padding: 0.4rem 0.75rem;
  background: transparent; border: 1px solid var(--line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem; letter-spacing: 0.04em;
  cursor: pointer; display: flex; align-items: center; gap: 0.3rem;
  transition: all 0.15s;
}
.viewer-tab:hover { border-color: var(--fg); }
.viewer-tab.active { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.viewer-loading { text-align: center; padding: 2rem; color: var(--muted); }
.viewer-body { min-height: 200px; }
.viewer-pdf { margin-bottom: 1rem; }
.viewer-pdf iframe { width: 100%; height: 350px; border: 1px solid var(--line); }
.open-external {
  display: inline-flex; align-items: center; gap: 0.3rem;
  margin-top: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem; color: var(--accent);
  text-decoration: none;
}
.open-external:hover { text-decoration: underline; }
.viewer-image { margin-bottom: 1rem; text-align: center; }
.viewer-image img { max-width: 100%; max-height: 350px; border: 1px solid var(--line); }
.viewer-vision {
  margin-bottom: 1rem; padding: 0.75rem;
  background: rgba(139,115,85,0.06);
  border-left: 2px solid var(--accent);
}
.vision-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--accent);
  display: flex; align-items: center; gap: 0.25rem;
  margin-bottom: 0.4rem;
}
.viewer-text { margin-bottom: 1rem; }
.text-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted);
  margin-bottom: 0.4rem;
}
.text-content {
  font-size: 0.8rem; line-height: 1.6;
  max-height: 200px; overflow-y: auto;
  padding: 0.5rem; background: var(--paper);
  border: 1px solid var(--line);
  white-space: pre-wrap;
}
.viewer-link { margin-bottom: 1rem; }
.viewer-link a { color: var(--accent); word-break: break-all; }
.viewer-description { font-size: 0.85rem; color: var(--muted); margin-bottom: 1rem; }

/* ═══ ANNOTATIONS ═══ */
.viewer-annotations { }
.annotation-form { margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--line); }
.annotation-types { display: flex; gap: 0.25rem; margin-bottom: 0.5rem; }
.type-btn {
  padding: 0.3rem 0.5rem;
  background: transparent; border: 1px solid var(--line);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.2rem;
}
.type-btn:hover { border-color: var(--fg); }
.type-btn.active { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.annotation-input {
  width: 100%; padding: 0.5rem;
  border: 1px solid var(--line);
  font-family: inherit; font-size: 0.8rem;
  min-height: 60px; resize: vertical;
  margin-bottom: 0.5rem;
}
.annotation-input:focus { border-color: var(--fg); outline: none; }
.annotation-submit {
  padding: 0.4rem 0.75rem;
  background: var(--fg); color: var(--bg); border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.25rem;
}
.annotation-submit:disabled { opacity: 0.3; }
.annotations-list { }
.no-annotations { text-align: center; padding: 1.5rem; color: var(--muted); font-style: italic; }
.annotation-item {
  padding: 0.6rem; margin-bottom: 0.5rem;
  border: 1px solid var(--line); background: var(--paper);
}
.annotation-item.highlight { border-left: 3px solid #E8C547; }
.annotation-item.question { border-left: 3px solid #5A8FA8; }
.annotation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
.annotation-author { font-size: 0.75rem; font-weight: 500; }
.annotation-type-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.4rem; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--muted);
  background: var(--bg); padding: 0.1rem 0.3rem;
}
.annotation-text { font-size: 0.8rem; margin-bottom: 0.25rem; }
.annotation-date { font-size: 0.6rem; color: var(--muted); }

/* ═══ SYNTHESES ═══ */
.no-syntheses { text-align: center; padding: 2rem; color: var(--muted); font-style: italic; }
.syntheses-list { max-height: 400px; overflow-y: auto; }
.synthesis-item {
  padding: 0.75rem; margin-bottom: 0.5rem;
  border: 1px solid var(--line); background: var(--paper);
}
.synthesis-header { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }
.synthesis-scope {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--accent);
}
.synthesis-date { font-size: 0.6rem; color: var(--muted); }
.synthesis-title { font-size: 0.9rem; margin-bottom: 0.3rem; }
.synthesis-summary { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.4rem; }
.synthesis-themes { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.3rem; }
.theme-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.45rem; background: var(--bg);
  border: 1px solid var(--line); padding: 0.15rem 0.35rem;
}
.synthesis-stats { font-size: 0.6rem; color: var(--muted); font-style: italic; }
`;
