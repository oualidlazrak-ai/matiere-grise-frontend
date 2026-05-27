// ═══════════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE v7 — Rhizome Fractal + Trilingue
// ═══════════════════════════════════════════════════════════════════════════════
//
// - Navigation fractale : points → sous-points → contenu
// - Glissement hiérarchique : choisir le parent
// - Support: PDF, images, audio, vidéo, Excel, texte
// - Trilingue: FR / AR / EN avec traduction IA
// - Synthèses IA visibles
// - Recherche web fonctionnelle
//
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://candidate-offshore-utilities-eventually.trycloudflare.com';

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const TRANSLATIONS = {
  fr: {
    title: 'Matière Grise',
    tagline: 'Les origines terrestres de l\'intelligence artificielle',
    home: 'Accueil',
    research: 'Recherche',
    concept: 'Concept',
    about: 'À propos',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Sortir',
    mySpace: 'Mon espace',
    collective: 'Collectif',
    publications: 'Publications',
    partners: 'Partenaires',
    syntheses: 'Synthèses IA',
    email: 'Email',
    password: 'Mot de passe',
    role: 'Rôle',
    code: 'Code d\'invitation',
    researcher: 'Chercheur',
    pedagogue: 'Pédagogue',
    import: 'Importer',
    document: 'Document',
    note: 'Note',
    audio: 'Audio',
    video: 'Vidéo',
    title_field: 'Titre',
    description: 'Description',
    tags: 'Tags',
    create: 'Créer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    delete: 'Supprimer',
    view: 'Voir',
    slide: 'Glisser',
    slideTo: 'Glisser vers...',
    selectParent: 'Choisir le parent',
    noParent: 'Racine (sans parent)',
    toCollective: 'Espace collectif',
    toSurface: 'Surface publique',
    chat: 'Chat IA',
    webSearch: 'Recherche web',
    askQuestion: 'Posez une question...',
    sources: 'Sources',
    webResults: 'Résultats web',
    loading: 'Chargement...',
    empty: 'Aucun contenu',
    clickToExpand: 'Cliquez pour explorer',
    back: 'Retour',
    profile: 'Profil',
    name: 'Nom',
    bio: 'Biographie',
    selected: 'sélectionné(s)',
    indexed: 'indexé',
    notIndexed: 'non indexé',
    file: 'Fichier',
    conceptDesc: 'Plateforme structurée en strates géologiques, reflétant la sédimentation des savoirs.',
    surface: 'Surface — Publications ouvertes',
    episteme: 'Épistémè — Espace pédagogues',
    sediment: 'Sédiment — Espace chercheurs',
    mantle: 'Manteau — IA autonome',
    glissementDesc: 'Les contenus circulent entre strates par glissement.',
    contactEmail: 'matiere.grise@ensp-arles.fr',
    inba: 'Institut National des Beaux-Arts de Tétouan',
    ensp: 'École Nationale Supérieure de la Photographie d\'Arles',
    isbas: 'Institut Supérieur des Beaux-Arts de Sousse',
    researchAreas: 'Axes de recherche',
    archaeology: 'Archéologie des savoirs',
    archaeologyDesc: 'Traditions mathématiques et optiques du monde arabo-islamique médiéval.',
    materiality: 'Matérialité du calcul',
    materialityDesc: 'Substrats physiques de l\'intelligence : silicium, terres rares, géologie.',
    algorithmic: 'Création algorithmique',
    algorithmicDesc: 'Pratiques artistiques croisant traditions artisanales et systèmes génératifs.',
    noSyntheses: 'Aucune synthèse disponible',
    analyzedDocs: 'documents analysés',
    themes: 'Thèmes',
    translateContent: 'Traduire',
    translating: 'Traduction en cours...'
  },
  en: {
    title: 'Grey Matter',
    tagline: 'The terrestrial origins of artificial intelligence',
    home: 'Home',
    research: 'Research',
    concept: 'Concept',
    about: 'About',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    mySpace: 'My Space',
    collective: 'Collective',
    publications: 'Publications',
    partners: 'Partners',
    syntheses: 'AI Syntheses',
    email: 'Email',
    password: 'Password',
    role: 'Role',
    code: 'Invitation code',
    researcher: 'Researcher',
    pedagogue: 'Pedagogue',
    import: 'Import',
    document: 'Document',
    note: 'Note',
    audio: 'Audio',
    video: 'Video',
    title_field: 'Title',
    description: 'Description',
    tags: 'Tags',
    create: 'Create',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    view: 'View',
    slide: 'Slide',
    slideTo: 'Slide to...',
    selectParent: 'Select parent',
    noParent: 'Root (no parent)',
    toCollective: 'Collective space',
    toSurface: 'Public surface',
    chat: 'AI Chat',
    webSearch: 'Web search',
    askQuestion: 'Ask a question...',
    sources: 'Sources',
    webResults: 'Web results',
    loading: 'Loading...',
    empty: 'No content',
    clickToExpand: 'Click to explore',
    back: 'Back',
    profile: 'Profile',
    name: 'Name',
    bio: 'Biography',
    selected: 'selected',
    indexed: 'indexed',
    notIndexed: 'not indexed',
    file: 'File',
    conceptDesc: 'Platform structured in geological strata, reflecting the sedimentation of knowledge.',
    surface: 'Surface — Open publications',
    episteme: 'Episteme — Pedagogue space',
    sediment: 'Sediment — Researcher space',
    mantle: 'Mantle — Autonomous AI',
    glissementDesc: 'Content circulates between strata through sliding.',
    contactEmail: 'matiere.grise@ensp-arles.fr',
    inba: 'National Institute of Fine Arts of Tetouan',
    ensp: 'National School of Photography of Arles',
    isbas: 'Higher Institute of Fine Arts of Sousse',
    researchAreas: 'Research Areas',
    archaeology: 'Archaeology of Knowledge',
    archaeologyDesc: 'Mathematical and optical traditions of the medieval Arab-Islamic world.',
    materiality: 'Materiality of Computation',
    materialityDesc: 'Physical substrates of intelligence: silicon, rare earths, geology.',
    algorithmic: 'Algorithmic Creation',
    algorithmicDesc: 'Artistic practices crossing craft traditions and generative systems.',
    noSyntheses: 'No syntheses available',
    analyzedDocs: 'documents analyzed',
    themes: 'Themes',
    translateContent: 'Translate',
    translating: 'Translating...'
  },
  ar: {
    title: 'المادة الرمادية',
    tagline: 'الأصول الأرضية للذكاء الاصطناعي',
    home: 'الرئيسية',
    research: 'البحث',
    concept: 'المفهوم',
    about: 'حول',
    login: 'دخول',
    register: 'تسجيل',
    logout: 'خروج',
    mySpace: 'فضائي',
    collective: 'المشترك',
    publications: 'المنشورات',
    partners: 'الشركاء',
    syntheses: 'تركيبات الذكاء',
    email: 'البريد',
    password: 'كلمة المرور',
    role: 'الدور',
    code: 'رمز الدعوة',
    researcher: 'باحث',
    pedagogue: 'مربّي',
    import: 'استيراد',
    document: 'وثيقة',
    note: 'ملاحظة',
    audio: 'صوت',
    video: 'فيديو',
    title_field: 'العنوان',
    description: 'الوصف',
    tags: 'الوسوم',
    create: 'إنشاء',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    delete: 'حذف',
    view: 'عرض',
    slide: 'نقل',
    slideTo: 'نقل إلى...',
    selectParent: 'اختر الأصل',
    noParent: 'الجذر (بدون أصل)',
    toCollective: 'الفضاء المشترك',
    toSurface: 'السطح العام',
    chat: 'محادثة الذكاء',
    webSearch: 'بحث الويب',
    askQuestion: 'اطرح سؤالاً...',
    sources: 'المصادر',
    webResults: 'نتائج الويب',
    loading: 'جاري التحميل...',
    empty: 'لا يوجد محتوى',
    clickToExpand: 'انقر للاستكشاف',
    back: 'رجوع',
    profile: 'الملف',
    name: 'الاسم',
    bio: 'السيرة',
    selected: 'محدد',
    indexed: 'مفهرس',
    notIndexed: 'غير مفهرس',
    file: 'ملف',
    conceptDesc: 'منصة منظمة في طبقات جيولوجية، تعكس ترسب المعارف.',
    surface: 'السطح — منشورات مفتوحة',
    episteme: 'الإبستيمي — فضاء المربين',
    sediment: 'الرواسب — فضاء الباحثين',
    mantle: 'الوشاح — ذكاء ذاتي',
    glissementDesc: 'المحتويات تنتقل بين الطبقات عبر الانزلاق.',
    contactEmail: 'matiere.grise@ensp-arles.fr',
    inba: 'المعهد الوطني للفنون الجميلة بتطوان',
    ensp: 'المدرسة الوطنية العليا للتصوير بآرل',
    isbas: 'المعهد العالي للفنون الجميلة بسوسة',
    researchAreas: 'محاور البحث',
    archaeology: 'أركيولوجيا المعارف',
    archaeologyDesc: 'التقاليد الرياضية والبصرية للعالم العربي الإسلامي في العصور الوسطى.',
    materiality: 'مادية الحساب',
    materialityDesc: 'الركائز المادية للذكاء: السيليكون، المعادن النادرة، الجيولوجيا.',
    algorithmic: 'الإبداع الخوارزمي',
    algorithmicDesc: 'ممارسات فنية تجمع بين التقاليد الحرفية والأنظمة التوليدية.',
    noSyntheses: 'لا توجد تركيبات',
    analyzedDocs: 'وثائق محللة',
    themes: 'المواضيع',
    translateContent: 'ترجمة',
    translating: 'جاري الترجمة...'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// RHIZOME GRAPH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function RhizomeGraph({ contents, onNodeClick, expandedNode, setExpandedNode, lang }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const [nodes, setNodes] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ width: rect.width || 800, height: 450 });
  }, []);

  useEffect(() => {
    if (!contents || contents.length === 0) {
      setNodes([]);
      return;
    }

    // Build hierarchy: root nodes + children
    const rootContents = contents.filter(c => !c.parent_id);
    const childMap = {};
    contents.forEach(c => {
      if (c.parent_id) {
        if (!childMap[c.parent_id]) childMap[c.parent_id] = [];
        childMap[c.parent_id].push(c);
      }
    });

    let allNodes = [];
    
    if (expandedNode) {
      // Show expanded node in center + its children around
      const parent = contents.find(c => c.id === expandedNode);
      const children = childMap[expandedNode] || [];
      
      if (parent) {
        allNodes.push({
          id: `content-${parent.id}`,
          contentId: parent.id,
          label: parent.title?.slice(0, 20) || '...',
          type: parent.content_type,
          x: dimensions.width / 2,
          y: dimensions.height / 2,
          vx: 0, vy: 0,
          radius: 12,
          isCenter: true,
          hasChildren: children.length > 0
        });

        children.forEach((c, i) => {
          const angle = (2 * Math.PI * i) / Math.max(children.length, 1);
          const dist = 100 + Math.random() * 40;
          allNodes.push({
            id: `content-${c.id}`,
            contentId: c.id,
            label: c.title?.slice(0, 18) || '...',
            type: c.content_type,
            x: dimensions.width / 2 + Math.cos(angle) * dist,
            y: dimensions.height / 2 + Math.sin(angle) * dist,
            vx: 0, vy: 0,
            radius: 6,
            parentId: parent.id,
            hasChildren: (childMap[c.id] || []).length > 0
          });
        });
      }
    } else {
      // Show root nodes
      rootContents.forEach((c, i) => {
        const angle = (2 * Math.PI * i) / Math.max(rootContents.length, 1);
        const dist = 80 + Math.random() * 80;
        allNodes.push({
          id: `content-${c.id}`,
          contentId: c.id,
          label: c.title?.slice(0, 20) || '...',
          type: c.content_type,
          x: dimensions.width / 2 + Math.cos(angle) * dist,
          y: dimensions.height / 2 + Math.sin(angle) * dist,
          vx: 0, vy: 0,
          radius: 8,
          hasChildren: (childMap[c.id] || []).length > 0
        });
      });
    }

    // Physics simulation
    let alpha = 1;
    const simulate = () => {
      if (alpha < 0.01) {
        setNodes([...allNodes]);
        return;
      }

      for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
          const dx = allNodes[j].x - allNodes[i].x;
          const dy = allNodes[j].y - allNodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (80 * alpha) / dist;
          if (!allNodes[i].isCenter) {
            allNodes[i].vx -= (dx / dist) * force;
            allNodes[i].vy -= (dy / dist) * force;
          }
          if (!allNodes[j].isCenter) {
            allNodes[j].vx += (dx / dist) * force;
            allNodes[j].vy += (dy / dist) * force;
          }
        }
      }

      for (const node of allNodes) {
        if (node.isCenter) continue;
        node.vx += (dimensions.width / 2 - node.x) * 0.005 * alpha;
        node.vy += (dimensions.height / 2 - node.y) * 0.005 * alpha;
        node.vx *= 0.7;
        node.vy *= 0.7;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(50, Math.min(dimensions.width - 50, node.x));
        node.y = Math.max(50, Math.min(dimensions.height - 50, node.y));
      }

      alpha -= 0.02;
      setNodes([...allNodes]);
      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [contents, expandedNode, dimensions]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw connections
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    const centerNode = nodes.find(n => n.isCenter);
    if (centerNode) {
      nodes.filter(n => !n.isCenter).forEach(n => {
        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      });
    }

    // Draw nodes
    for (const node of nodes) {
      const isHovered = hoveredNode === node.id;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isHovered ? node.radius + 4 : node.radius, 0, Math.PI * 2);
      
      if (node.isCenter) {
        ctx.fillStyle = '#000';
      } else if (node.hasChildren) {
        ctx.fillStyle = isHovered ? '#000' : '#444';
      } else {
        ctx.fillStyle = isHovered ? '#000' : '#888';
      }
      ctx.fill();

      // Children indicator
      if (node.hasChildren && !node.isCenter) {
        ctx.beginPath();
        ctx.arc(node.x + node.radius, node.y - node.radius, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
      }

      // Label on hover
      if (isHovered || node.isCenter) {
        ctx.font = node.isCenter ? 'bold 14px system-ui' : '12px system-ui';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - node.radius - 8);
        
        // Type badge
        ctx.font = '10px system-ui';
        ctx.fillStyle = '#666';
        ctx.fillText(node.type, node.x, node.y + node.radius + 14);
      }
    }
  }, [nodes, hoveredNode, dimensions]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = null;
    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 10) {
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
      if (Math.sqrt(dx * dx + dy * dy) < node.radius + 10) {
        if (node.hasChildren) {
          // Expand to show children
          setExpandedNode(node.contentId);
        } else {
          // Open content
          const content = contents.find(c => c.id === node.contentId);
          if (content) onNodeClick(content);
        }
        break;
      }
    }
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className="rhizome-container" ref={containerRef}>
      {expandedNode && (
        <button className="back-btn" onClick={() => setExpandedNode(null)}>
          ← {t.back}
        </button>
      )}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={handleClick}
        style={{ cursor: hoveredNode ? 'pointer' : 'default' }}
      />
      {nodes.length === 0 && (
        <div className="empty-graph">{t.empty}</div>
      )}
      {hoveredNode && (
        <div className="graph-hint">{t.clickToExpand}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function MatiereGrise() {
  const [lang, setLang] = useState('fr');
  const t = TRANSLATIONS[lang];
  
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
  const [expandedNode, setExpandedNode] = useState(null);
  
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [searchWeb, setSearchWeb] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const chatRef = useRef(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // INIT & API
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('mg_token');
      const savedLang = localStorage.getItem('mg_lang');
      if (savedToken) setToken(savedToken);
      if (savedLang) setLang(savedLang);
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
        alert((await res.json()).detail || 'Error');
      }
    } catch (e) { alert('Connection error'); }
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
        alert((await res.json()).detail || 'Error');
      }
    } catch (e) { alert('Connection error'); }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('mg_token');
    setToken(null);
    setUser(null);
    setContents([]);
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
      else { alert('Upload failed'); }
    } catch (e) { alert('Error'); }
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
        body: JSON.stringify({ 
          content_id: contentId, 
          target_visibility: target,
          parent_id: parentId 
        })
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
    if (!confirm(t.delete + '?')) return;
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
          sources: data.sources,
          web_results: data.web_results
        }]);
        if (!currentConv) {
          setCurrentConv({ id: data.conversation_id });
          fetchConversations();
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error.' }]);
    }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const cycleLang = () => {
    const langs = ['fr', 'en', 'ar'];
    const idx = langs.indexOf(lang);
    setLang(langs[(idx + 1) % langs.length]);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (!ready) return null;

  const isRTL = lang === 'ar';

  return (
    <div className={`app ${isRTL ? 'rtl' : ''}`}>
      <style>{styles}</style>

      {/* HEADER */}
      <header className="header">
        <span className="logo" onClick={() => { setView('landing'); setSection('home'); }}>
          {t.title}
        </span>
        
        <nav className="nav">
          {view === 'landing' && (
            <>
              <button className={section === 'home' ? 'active' : ''} onClick={() => setSection('home')}>{t.home}</button>
              <button className={section === 'research' ? 'active' : ''} onClick={() => setSection('research')}>{t.research}</button>
              <button className={section === 'concept' ? 'active' : ''} onClick={() => setSection('concept')}>{t.concept}</button>
              <button className={section === 'about' ? 'active' : ''} onClick={() => setSection('about')}>{t.about}</button>
            </>
          )}
        </nav>

        <div className="header-right">
          {token && user ? (
            <>
              <button onClick={() => setView('workspace')}>{t.mySpace}</button>
              <button onClick={() => { setView('collective'); fetchCollective(user.strate); }}>{t.collective}</button>
              <button onClick={() => openModal('profile')}>{user.display_name}</button>
              <button onClick={logout}>{t.logout}</button>
            </>
          ) : (
            <>
              <button onClick={() => openModal('login')}>{t.login}</button>
              <button className="primary" onClick={() => openModal('register')}>{t.register}</button>
            </>
          )}
          <button className="lang-btn" onClick={cycleLang}>
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* LANDING */}
      {view === 'landing' && (
        <main className="landing">
          {section === 'home' && (
            <>
              <section className="hero">
                <h1>{t.title}</h1>
                <p className="tagline">{t.tagline}</p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => openModal('register')}>{t.register}</button>
                  <button onClick={() => setSection('concept')}>{t.concept}</button>
                </div>
              </section>

              {/* Publications Graph */}
              <section className="section">
                <h2>{t.publications}</h2>
                <RhizomeGraph 
                  contents={publicContents}
                  onNodeClick={(c) => openModal('content', c)}
                  expandedNode={expandedNode}
                  setExpandedNode={setExpandedNode}
                  lang={lang}
                />
              </section>

              {/* Syntheses */}
              {syntheses.length > 0 && (
                <section className="section">
                  <h2>{t.syntheses}</h2>
                  <div className="syntheses-grid">
                    {syntheses.slice(0, 3).map(s => (
                      <div key={s.id} className="synthesis-card">
                        <span className="synthesis-scope">{s.scope}: {s.scope_id}</span>
                        <h3>{s.title}</h3>
                        <p>{s.summary?.slice(0, 150)}...</p>
                        {s.key_themes?.length > 0 && (
                          <div className="themes">
                            {s.key_themes.slice(0, 3).map((th, i) => (
                              <span key={i} className="theme">{th}</span>
                            ))}
                          </div>
                        )}
                        <span className="meta">{s.contents_analyzed} {t.analyzedDocs}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Partners */}
              <section className="section">
                <h2>{t.partners}</h2>
                <div className="partners">
                  <div><strong>INBA</strong><br/>{t.inba}</div>
                  <div><strong>ENSP</strong><br/>{t.ensp}</div>
                  <div><strong>ISBAS</strong><br/>{t.isbas}</div>
                </div>
              </section>
            </>
          )}

          {section === 'research' && (
            <section className="page">
              <h1>{t.research}</h1>
              <h2>{t.researchAreas}</h2>
              <div className="research-grid">
                <div className="research-card">
                  <h3>{t.archaeology}</h3>
                  <p>{t.archaeologyDesc}</p>
                </div>
                <div className="research-card">
                  <h3>{t.materiality}</h3>
                  <p>{t.materialityDesc}</p>
                </div>
                <div className="research-card">
                  <h3>{t.algorithmic}</h3>
                  <p>{t.algorithmicDesc}</p>
                </div>
              </div>

              {publicContents.length > 0 && (
                <>
                  <h2>{t.publications}</h2>
                  <RhizomeGraph 
                    contents={publicContents}
                    onNodeClick={(c) => openModal('content', c)}
                    expandedNode={expandedNode}
                    setExpandedNode={setExpandedNode}
                    lang={lang}
                  />
                </>
              )}
            </section>
          )}

          {section === 'concept' && (
            <section className="page">
              <h1>{t.concept}</h1>
              <p className="intro">{t.conceptDesc}</p>

              <div className="strates">
                <div className="strate"><span>0m</span><div>{t.surface}</div></div>
                <div className="strate"><span>−500m</span><div>{t.episteme}</div></div>
                <div className="strate"><span>−2km</span><div>{t.sediment}</div></div>
                <div className="strate"><span>−∞</span><div>{t.mantle}</div></div>
              </div>

              <div className="concept-box">
                <h3>{t.slide}</h3>
                <p>{t.glissementDesc}</p>
              </div>
            </section>
          )}

          {section === 'about' && (
            <section className="page">
              <h1>{t.about}</h1>
              <p>{t.contactEmail}</p>
            </section>
          )}
        </main>
      )}

      {/* WORKSPACE */}
      {view === 'workspace' && token && user && (
        <div className="workspace">
          <aside className="sidebar">
            <div className="sb-group">
              <span className="sb-title">{t.import}</span>
              <button onClick={() => openModal('upload')}>+ {t.document}</button>
              <button onClick={() => openModal('note')}>+ {t.note}</button>
            </div>
            <div className="sb-group">
              <span className="sb-title">{t.syntheses}</span>
              <button onClick={() => openModal('syntheses')}>{t.view}</button>
            </div>
            <div className="sb-group">
              <button onClick={() => { setView('collective'); fetchCollective(user.strate); }}>→ {t.collective}</button>
              <button onClick={() => setView('landing')}>→ {t.home}</button>
            </div>
          </aside>

          <main className="main">
            <div className="main-header">
              <h1>{t.mySpace}</h1>
              {selected.length > 0 && <span className="badge">{selected.length} {t.selected}</span>}
            </div>

            {contents.length === 0 ? (
              <div className="empty-state">
                <p>{t.empty}</p>
                <button onClick={() => openModal('upload')}>{t.import}</button>
              </div>
            ) : (
              <div className="content-list">
                {contents.map(c => (
                  <div key={c.id} className={`content-item ${selected.includes(c.id) ? 'selected' : ''}`}>
                    <span className="check" onClick={() => toggleSelect(c.id)}>
                      {selected.includes(c.id) && '✓'}
                    </span>
                    <span className="type">{c.content_type}</span>
                    <span className="title">{c.title}</span>
                    <span className={`status ${c.is_indexed ? 'indexed' : ''}`}>
                      {c.is_indexed ? t.indexed : t.notIndexed}
                    </span>
                    <div className="actions">
                      <button onClick={() => openModal('content', c)}>{t.view}</button>
                      <button onClick={() => openModal('glissement', c)}>{t.slide}</button>
                      <button className="danger" onClick={() => handleDelete(c.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          <aside className="chat-panel">
            <div className="chat-header">
              <span>{t.chat}</span>
              <label className="web-toggle">
                <input type="checkbox" checked={searchWeb} onChange={e => setSearchWeb(e.target.checked)} />
                {t.webSearch}
              </label>
            </div>
            
            <div className="chat-body" ref={chatRef}>
              {messages.length === 0 && <p className="hint">{t.askQuestion}</p>}
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <strong>{m.role === 'user' ? (lang === 'ar' ? 'أنت' : 'You') : 'IA'}</strong>
                  <p>{m.content}</p>
                  {m.sources?.length > 0 && (
                    <div className="msg-sources">
                      <strong>{t.sources}:</strong> {m.sources.map(s => s.title).join(', ')}
                    </div>
                  )}
                  {m.web_results?.length > 0 && (
                    <div className="msg-web">
                      <strong>{t.webResults}:</strong>
                      {m.web_results.map((r, j) => (
                        <a key={j} href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && <p className="loading">{t.loading}</p>}
            </div>

            <div className="chat-input">
              <input 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleChat()} 
                placeholder={t.askQuestion} 
              />
              <button onClick={handleChat} disabled={loading}>→</button>
            </div>
          </aside>
        </div>
      )}

      {/* COLLECTIVE */}
      {view === 'collective' && token && user && (
        <div className="collective-view">
          <h1>{t.collective} — {user.strate}</h1>
          
          <RhizomeGraph 
            contents={collectiveContents}
            onNodeClick={(c) => openModal('content', c)}
            expandedNode={expandedNode}
            setExpandedNode={setExpandedNode}
            lang={lang}
          />

          <button className="back-btn-main" onClick={() => setView('workspace')}>
            ← {t.back}
          </button>
        </div>
      )}

      {/* MODALS */}
      {modal && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>

            {modal === 'login' && (
              <>
                <h2>{t.login}</h2>
                <LoginForm t={t} onSubmit={login} loading={loading} />
              </>
            )}

            {modal === 'register' && (
              <>
                <h2>{t.register}</h2>
                <RegisterForm t={t} onSubmit={register} loading={loading} />
              </>
            )}

            {modal === 'profile' && user && (
              <>
                <h2>{t.profile}</h2>
                <ProfileForm t={t} user={user} token={token} apiUrl={API_URL} onClose={closeModal} onUpdate={fetchProfile} />
              </>
            )}

            {modal === 'upload' && (
              <>
                <h2>{t.import} {t.document}</h2>
                <UploadForm t={t} onSubmit={handleUpload} loading={loading} onClose={closeModal} />
              </>
            )}

            {modal === 'note' && (
              <>
                <h2>{t.note}</h2>
                <NoteForm t={t} onSubmit={handleCreateNote} loading={loading} onClose={closeModal} />
              </>
            )}

            {modal === 'glissement' && modalData && (
              <>
                <h2>{t.slideTo}</h2>
                <GlissementForm 
                  t={t} 
                  content={modalData} 
                  allContents={[...contents, ...collectiveContents, ...publicContents]}
                  onSubmit={handleGlissement} 
                  onClose={closeModal} 
                />
              </>
            )}

            {modal === 'content' && modalData && (
              <ContentView t={t} content={modalData} apiUrl={API_URL} lang={lang} />
            )}

            {modal === 'syntheses' && (
              <>
                <h2>{t.syntheses}</h2>
                <SynthesesView t={t} syntheses={syntheses} />
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
      <label>{t.email}</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label>{t.password}</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>{t.login}</button>
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
      <label>{t.email}</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <label>{t.password}</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <label>{t.role}</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="chercheur">{t.researcher}</option>
        <option value="pedagogue">{t.pedagogue}</option>
      </select>
      <label>{t.code}</label>
      <input value={code} onChange={e => setCode(e.target.value)} placeholder="CHERCHEUR2026" required />
      <button type="submit" disabled={loading}>{t.register}</button>
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
    <form onSubmit={submit}>
      <p className="meta">{user.email} · {user.role} · {user.strate}</p>
      <label>{t.name}</label>
      <input value={name} onChange={e => setName(e.target.value)} required />
      <label>{t.bio}</label>
      <textarea value={bio} onChange={e => setBio(e.target.value)} />
      <div className="form-actions">
        <button type="button" onClick={onClose}>{t.cancel}</button>
        <button type="submit" disabled={loading}>{t.save}</button>
      </div>
    </form>
  );
}

function UploadForm({ t, onSubmit, loading, onClose }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  
  const acceptTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,image/*,audio/*,video/*';
  
  return (
    <form onSubmit={e => { 
      e.preventDefault(); 
      if (file) onSubmit(file, title, desc, tags.split(',').map(t=>t.trim()).filter(Boolean)); 
    }}>
      <label>{t.file} (PDF, Image, Audio, Video, Excel...)</label>
      <input 
        type="file" 
        accept={acceptTypes}
        onChange={e => { 
          setFile(e.target.files[0]); 
          if (!title) setTitle(e.target.files[0]?.name?.replace(/\.[^/.]+$/, '') || ''); 
        }} 
        required 
      />
      <label>{t.title_field}</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />
      <label>{t.description}</label>
      <textarea value={desc} onChange={e => setDesc(e.target.value)} />
      <label>{t.tags}</label>
      <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tag1, tag2, tag3" />
      <div className="form-actions">
        <button type="button" onClick={onClose}>{t.cancel}</button>
        <button type="submit" disabled={loading || !file}>{t.import}</button>
      </div>
    </form>
  );
}

function NoteForm({ t, onSubmit, loading, onClose }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  
  return (
    <form onSubmit={e => { 
      e.preventDefault(); 
      onSubmit(title, text, tags.split(',').map(t=>t.trim()).filter(Boolean)); 
    }}>
      <label>{t.title_field}</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />
      <label>Contenu</label>
      <textarea value={text} onChange={e => setText(e.target.value)} className="tall" required />
      <label>{t.tags}</label>
      <input value={tags} onChange={e => setTags(e.target.value)} />
      <div className="form-actions">
        <button type="button" onClick={onClose}>{t.cancel}</button>
        <button type="submit" disabled={loading}>{t.create}</button>
      </div>
    </form>
  );
}

function GlissementForm({ t, content, allContents, onSubmit, onClose }) {
  const [target, setTarget] = useState('strate');
  const [parentId, setParentId] = useState(null);
  
  // Filter possible parents (not self, not already children)
  const possibleParents = allContents.filter(c => c.id !== content.id);
  
  return (
    <div className="glissement-form">
      <p className="content-title">{content.title}</p>
      
      <div className="glissement-section">
        <label>{t.selectParent}</label>
        <select value={parentId || ''} onChange={e => setParentId(e.target.value || null)}>
          <option value="">{t.noParent}</option>
          {possibleParents.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="glissement-section">
        <label>Destination</label>
        <div className="glissement-options">
          <button 
            className={target === 'strate' ? 'active' : ''} 
            onClick={() => setTarget('strate')}
          >
            {t.toCollective}
          </button>
          <button 
            className={target === 'public' ? 'active' : ''} 
            onClick={() => setTarget('public')}
          >
            {t.toSurface}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={onClose}>{t.cancel}</button>
        <button className="primary" onClick={() => onSubmit(content.id, target, parentId)}>
          {t.slide}
        </button>
      </div>
    </div>
  );
}

function ContentView({ t, content, apiUrl, lang }) {
  const fileUrl = content.file_url 
    ? (content.file_url.startsWith('http') ? content.file_url : `${apiUrl}${content.file_url}`) 
    : null;
  
  const isImage = content.content_type === 'image' || content.mime_type?.startsWith('image/');
  const isPdf = content.content_type === 'pdf' || content.mime_type === 'application/pdf';
  const isAudio = content.content_type === 'audio' || content.mime_type?.startsWith('audio/');
  const isVideo = content.content_type === 'video' || content.mime_type?.startsWith('video/');
  
  return (
    <div className="content-view">
      <span className="type-badge">{content.content_type}</span>
      <h2>{content.title}</h2>
      
      {content.owner_name && <p className="author">by {content.owner_name}</p>}

      {/* PDF */}
      {isPdf && fileUrl && <iframe src={fileUrl} className="pdf-frame" title={content.title} />}
      
      {/* Image */}
      {isImage && fileUrl && <img src={fileUrl} alt={content.title} className="content-image" />}
      
      {/* Audio */}
      {isAudio && fileUrl && (
        <audio controls className="audio-player">
          <source src={fileUrl} />
        </audio>
      )}
      
      {/* Video */}
      {isVideo && fileUrl && (
        <video controls className="video-player">
          <source src={fileUrl} />
        </video>
      )}

      {/* Vision description */}
      {content.vision_description && (
        <div className="vision-box">
          <strong>Vision AI:</strong>
          <p>{content.vision_description}</p>
        </div>
      )}

      {/* Text content */}
      {content.text_content && (
        <div className="text-box">
          <p>{content.text_content}</p>
        </div>
      )}

      {/* Description */}
      {content.description && (
        <p className="description">{content.description}</p>
      )}

      {/* Tags */}
      {content.tags?.length > 0 && (
        <div className="tags">
          {content.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
        </div>
      )}
    </div>
  );
}

function SynthesesView({ t, syntheses }) {
  if (syntheses.length === 0) {
    return <p className="empty">{t.noSyntheses}</p>;
  }
  
  return (
    <div className="syntheses-list">
      {syntheses.map(s => (
        <div key={s.id} className="synthesis-item">
          <span className="scope">{s.scope}: {s.scope_id}</span>
          <h3>{s.title}</h3>
          <p>{s.summary}</p>
          {s.key_themes?.length > 0 && (
            <div className="themes">
              <strong>{t.themes}:</strong>
              {s.key_themes.map((th, i) => <span key={i} className="theme">{th}</span>)}
            </div>
          )}
          <span className="meta">{s.contents_analyzed} {t.analyzedDocs}</span>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = `
*{margin:0;padding:0;box-sizing:border-box}
.app{min-height:100vh;background:#fff;color:#000;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6}
.app.rtl{direction:rtl;font-family:'Amiri',serif}

/* HEADER */
.header{position:fixed;top:0;left:0;right:0;z-index:100;height:56px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #000}
.logo{font-size:18px;font-weight:600;cursor:pointer}
.nav{display:flex;gap:4px}
.nav button,.header-right button{background:none;border:none;padding:8px 16px;font-size:14px;cursor:pointer;font-family:inherit}
.nav button:hover,.header-right button:hover{background:#f0f0f0}
.nav button.active{border-bottom:2px solid #000}
.header-right{display:flex;gap:8px;align-items:center}
.header-right button{border:1px solid #ddd}
.header-right button.primary{background:#000;color:#fff;border-color:#000}
.lang-btn{font-weight:600!important;min-width:40px}

/* LANDING */
.landing{padding-top:56px}
.hero{max-width:600px;margin:0 auto;padding:80px 24px;text-align:center}
.hero h1{font-size:48px;font-weight:600;letter-spacing:-0.02em}
.hero .tagline{font-size:20px;color:#666;margin:16px 0 32px}
.hero-actions{display:flex;gap:12px;justify-content:center}
.hero-actions button{padding:12px 24px;border:1px solid #000;background:none;cursor:pointer;font-size:15px}
.hero-actions button.primary{background:#000;color:#fff}

.section,.page{max-width:900px;margin:0 auto;padding:60px 24px;border-top:1px solid #eee}
.section h2,.page h2{font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:24px;color:#666}
.page h1{font-size:36px;margin-bottom:16px}
.page .intro{font-size:18px;color:#444;margin-bottom:32px}

/* RHIZOME GRAPH */
.rhizome-container{position:relative;width:100%;height:450px;border:1px solid #eee;background:#fafafa}
.rhizome-container canvas{display:block}
.rhizome-container .back-btn{position:absolute;top:12px;left:12px;padding:6px 12px;background:#fff;border:1px solid #000;cursor:pointer;font-size:13px;z-index:10}
.empty-graph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#999}
.graph-hint{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:4px 12px;font-size:12px}

/* SYNTHESES */
.syntheses-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.synthesis-card{padding:20px;border:1px solid #eee;background:#fafafa}
.synthesis-card .synthesis-scope{font-size:11px;text-transform:uppercase;color:#666}
.synthesis-card h3{font-size:16px;margin:8px 0}
.synthesis-card p{font-size:14px;color:#444}
.synthesis-card .themes{margin-top:12px;display:flex;flex-wrap:wrap;gap:6px}
.synthesis-card .theme{font-size:12px;background:#fff;border:1px solid #ddd;padding:2px 8px}
.synthesis-card .meta{display:block;margin-top:12px;font-size:12px;color:#999}

/* PARTNERS */
.partners{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.partners div{padding:20px;border:1px solid #eee}
.partners strong{font-size:14px}

/* RESEARCH */
.research-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px}
.research-card{padding:24px;border:1px solid #eee}
.research-card h3{font-size:16px;margin-bottom:8px}
.research-card p{font-size:14px;color:#666}

/* STRATES */
.strates{border:1px solid #000;margin-bottom:32px}
.strate{display:flex;border-bottom:1px solid #eee}
.strate:last-child{border:none}
.strate span{width:80px;padding:16px;background:#f5f5f5;text-align:right;font-family:monospace;font-size:13px}
.strate div{padding:16px;flex:1}
.concept-box{padding:24px;border:1px solid #000}
.concept-box h3{margin-bottom:8px}

/* WORKSPACE */
.workspace{display:flex;padding-top:56px;min-height:100vh}
.sidebar{width:180px;border-right:1px solid #eee;padding:16px;position:fixed;top:56px;bottom:0;overflow-y:auto}
.sb-group{margin-bottom:24px}
.sb-title{display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:8px}
.sidebar button{display:block;width:100%;text-align:left;padding:8px;background:none;border:none;cursor:pointer;font-size:14px}
.sidebar button:hover{background:#f5f5f5}

.main{flex:1;margin-left:180px;margin-right:300px;padding:24px}
.main-header{display:flex;align-items:center;gap:16px;margin-bottom:24px}
.main-header h1{font-size:24px}
.badge{font-size:12px;background:#000;color:#fff;padding:2px 10px}

.empty-state{text-align:center;padding:60px;color:#666}
.empty-state button{margin-top:16px;padding:10px 20px;border:1px solid #000;background:none;cursor:pointer}

.content-list{display:flex;flex-direction:column;gap:1px}
.content-item{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #eee;transition:all 0.1s}
.content-item:hover{border-color:#000}
.content-item.selected{background:#f5f5f5;border-color:#000}
.content-item .check{width:18px;height:18px;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px}
.content-item.selected .check{background:#000;color:#fff}
.content-item .type{font-size:11px;text-transform:uppercase;color:#999;width:50px}
.content-item .title{flex:1;font-weight:500}
.content-item .status{font-size:11px;color:#ccc}
.content-item .status.indexed{color:#000}
.content-item .actions{display:flex;gap:6px;opacity:0;transition:opacity 0.1s}
.content-item:hover .actions{opacity:1}
.content-item .actions button{padding:4px 10px;font-size:12px;background:#fff;border:1px solid #ddd;cursor:pointer}
.content-item .actions button:hover{border-color:#000}
.content-item .actions button.danger:hover{border-color:#c00;color:#c00}

/* CHAT */
.chat-panel{width:300px;position:fixed;top:56px;bottom:0;right:0;border-left:1px solid #000;display:flex;flex-direction:column;background:#fff}
.chat-header{padding:12px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}
.web-toggle{font-size:12px;display:flex;align-items:center;gap:4px}
.web-toggle input{margin:0}
.chat-body{flex:1;overflow-y:auto;padding:12px}
.hint{color:#999;text-align:center;padding:40px 0;font-size:14px}
.msg{margin-bottom:16px}
.msg strong{font-size:11px;text-transform:uppercase;color:#999;display:block;margin-bottom:4px}
.msg p{font-size:14px}
.msg.assistant p{padding-left:12px;border-left:2px solid #000}
.msg-sources,.msg-web{font-size:12px;color:#666;margin-top:8px;padding:8px;background:#f9f9f9}
.msg-web a{display:block;color:#000}
.loading{color:#999;text-align:center}
.chat-input{padding:12px;border-top:1px solid #eee;display:flex;gap:8px}
.chat-input input{flex:1;padding:10px;border:1px solid #ddd;font-size:14px}
.chat-input input:focus{outline:none;border-color:#000}
.chat-input button{padding:10px 16px;background:#000;color:#fff;border:none;cursor:pointer}
.chat-input button:disabled{opacity:0.3}

/* COLLECTIVE */
.collective-view{padding:80px 24px 24px;max-width:1000px;margin:0 auto}
.collective-view h1{font-size:24px;margin-bottom:24px}
.back-btn-main{margin-top:24px;padding:10px 20px;border:1px solid #000;background:none;cursor:pointer}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(255,255,255,0.95);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.modal{background:#fff;border:1px solid #000;padding:32px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;position:relative}
.close-btn{position:absolute;top:12px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;color:#666}
.close-btn:hover{color:#000}
.modal h2{font-size:20px;margin-bottom:24px}

.modal form{display:flex;flex-direction:column;gap:12px}
.modal label{font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#666}
.modal input,.modal textarea,.modal select{padding:10px;border:1px solid #ddd;font-size:15px;font-family:inherit}
.modal input:focus,.modal textarea:focus{outline:none;border-color:#000}
.modal textarea{min-height:100px;resize:vertical}
.modal textarea.tall{min-height:180px}
.modal button[type=submit]{padding:12px;background:#000;color:#fff;border:none;cursor:pointer;font-size:14px}
.modal button[type=submit]:disabled{opacity:0.3}
.modal .meta{font-size:13px;color:#666;padding:8px;background:#f5f5f5;margin-bottom:12px}
.form-actions{display:flex;gap:12px;margin-top:12px}
.form-actions button{flex:1;padding:12px;border:1px solid #000;background:none;cursor:pointer}
.form-actions button.primary,.form-actions button:last-child{background:#000;color:#fff}

/* GLISSEMENT */
.glissement-form .content-title{font-weight:600;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #eee}
.glissement-section{margin-bottom:20px}
.glissement-section label{display:block;font-size:12px;text-transform:uppercase;color:#666;margin-bottom:8px}
.glissement-section select{width:100%;padding:10px;border:1px solid #ddd;font-size:14px}
.glissement-options{display:flex;gap:8px}
.glissement-options button{flex:1;padding:12px;border:1px solid #ddd;background:none;cursor:pointer}
.glissement-options button:hover{border-color:#000}
.glissement-options button.active{background:#000;color:#fff;border-color:#000}

/* CONTENT VIEW */
.content-view .type-badge{display:inline-block;font-size:11px;text-transform:uppercase;background:#f5f5f5;padding:4px 10px;margin-bottom:8px}
.content-view h2{font-size:20px;margin-bottom:8px}
.content-view .author{color:#666;margin-bottom:16px}
.content-view .pdf-frame{width:100%;height:400px;border:1px solid #eee;margin:16px 0}
.content-view .content-image{max-width:100%;max-height:400px;border:1px solid #eee;margin:16px 0}
.content-view .audio-player,.content-view .video-player{width:100%;margin:16px 0}
.content-view .vision-box{margin:16px 0;padding:16px;background:#f9f9f9;border-left:3px solid #000}
.content-view .vision-box p{margin-top:8px;font-size:14px}
.content-view .text-box{margin:16px 0;padding:16px;background:#f9f9f9;max-height:250px;overflow-y:auto;font-size:14px;white-space:pre-wrap}
.content-view .description{color:#666;font-style:italic;margin:16px 0}
.content-view .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
.content-view .tag{font-size:12px;background:#fff;border:1px solid #ddd;padding:3px 10px}

/* SYNTHESES */
.syntheses-list{display:flex;flex-direction:column;gap:16px;max-height:400px;overflow-y:auto}
.synthesis-item{padding:16px;border:1px solid #eee}
.synthesis-item .scope{font-size:11px;text-transform:uppercase;color:#666}
.synthesis-item h3{font-size:16px;margin:8px 0}
.synthesis-item p{font-size:14px;color:#444}
.synthesis-item .themes{margin-top:12px}
.synthesis-item .theme{display:inline-block;font-size:12px;background:#f5f5f5;padding:2px 8px;margin:2px}
.synthesis-item .meta{display:block;margin-top:12px;font-size:12px;color:#999}

.empty{text-align:center;padding:40px;color:#999}

/* RESPONSIVE */
@media(max-width:900px){
  .main{margin-right:0}
  .chat-panel{display:none}
  .partners,.research-grid{grid-template-columns:1fr}
}
@media(max-width:600px){
  .nav{display:none}
  .sidebar{display:none}
  .main{margin-left:0}
  .hero h1{font-size:32px}
}
`;
