// ═══════════════════════════════════════════════════════════════════════════
// MATIÈRE GRISE — Frontend
// Les origines terrestres de l'IA
// 
// Esthétique: Mounir Fatmi / Archive / Archéologie
// Noir et blanc strict, typographie comme matière
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';

// Configuration API - À changer selon ton tunnel Cloudflare
const API_URL = 'http://localhost:8000';

export default function MatiereGrise() {
  const [currentStrate, setCurrentStrate] = useState('surface');
  const [lang, setLang] = useState('fr');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const STRATES = [
    { id: 'surface', name: 'Surface', nameAr: 'السطح', depth: 0 },
    { id: 'extraction', name: 'Extraction', nameAr: 'الاستخراج', depth: 1 },
    { id: 'manteau', name: 'Manteau', nameAr: 'الوشاح', depth: 2 },
    { id: 'sediment', name: 'Sédiment', nameAr: 'الرواسب', depth: 3 },
    { id: 'episteme', name: 'Épistémè', nameAr: 'الإبستيمي', depth: 4 },
  ];

  useEffect(() => {
    if (token) fetchNotebooks();
  }, [token]);

  const fetchNotebooks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notebooks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setNotebooks(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchDocuments = async (notebookId) => {
    try {
      const res = await fetch(`${API_URL}/api/notebooks/${notebookId}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setDocuments(await res.json());
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
        setUser({ id: data.user_id, name: data.name, role: data.role });
        setShowLogin(false);
      } else {
        alert('Identifiants incorrects');
      }
    } catch (e) {
      alert('Erreur de connexion');
    }
    setIsLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !selectedNotebook) return;
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/notebooks/${selectedNotebook.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { 
          role: 'assistant', content: data.response, sources: data.sources 
        }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Erreur.' }]);
    }
    setIsLoading(false);
  };

  const canAccessStrate = (strateId) => {
    if (!user) return strateId === 'surface';
    if (user.role === 'admin') return true;
    if (user.role === 'pedagogue') return true;
    if (user.role === 'chercheur') return ['surface', 'extraction', 'sediment'].includes(strateId);
    return strateId === 'surface';
  };

  return (
    <div className="mg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@300;400;500&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .mg {
          min-height: 100vh;
          background: #FAFAFA;
          color: #0A0A0A;
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 17px;
          line-height: 1.6;
        }
        
        .ar { font-family: 'Amiri', serif; direction: rtl; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        
        /* Header */
        .hd {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: #FAFAFA; border-bottom: 1px solid #0A0A0A;
        }
        .hd-in {
          max-width: 1200px; margin: 0 auto; padding: 1.25rem 2rem;
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .logo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
        }
        .logo span {
          display: block; font-size: 0.55rem; font-weight: 300;
          letter-spacing: 0.25em; margin-top: 0.2rem; color: #666;
        }
        .hd-nav { display: flex; align-items: center; gap: 1.5rem; }
        .lang-btn {
          font-family: 'JetBrains Mono', monospace; font-size: 0.65rem;
          background: none; border: none; cursor: pointer;
          padding: 0.4rem; letter-spacing: 0.08em;
        }
        .lang-btn:hover { text-decoration: underline; }
        .auth-btn {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: #0A0A0A; color: #FAFAFA; border: none;
          padding: 0.5rem 1rem; cursor: pointer;
        }
        .auth-btn:hover { opacity: 0.8; }
        .user-inf {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.08em;
        }
        .user-role { color: #666; margin-left: 0.4rem; }
        
        /* Strates Nav */
        .st-nav {
          position: fixed; left: 2rem; top: 50%;
          transform: translateY(-50%); z-index: 50;
        }
        .st-lnk {
          display: block; padding: 0.6rem 0;
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #AAA; text-decoration: none; cursor: pointer;
          transition: color 0.2s; position: relative;
        }
        .st-lnk::before {
          content: ''; position: absolute; left: -0.8rem; top: 50%;
          width: 0; height: 1px; background: #0A0A0A; transition: width 0.2s;
        }
        .st-lnk:hover { color: #0A0A0A; }
        .st-lnk:hover::before { width: 0.4rem; }
        .st-lnk.act { color: #0A0A0A; }
        .st-lnk.act::before { width: 1rem; }
        .st-lnk.locked { color: #DDD; cursor: not-allowed; }
        .st-d { display: inline-block; width: 1.2rem; color: #CCC; }
        
        /* Main */
        .mn { padding-top: 90px; min-height: 100vh; }
        .ct { max-width: 800px; margin: 0 auto; padding: 3rem 2rem 3rem 7rem; }
        
        /* Surface */
        .sf-hero { padding: 6rem 0 4rem; border-bottom: 1px solid #E0E0E0; }
        .sf-ttl {
          font-size: clamp(2rem, 5vw, 3rem); font-weight: 400;
          line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.015em;
        }
        .sf-sub { font-size: 1rem; color: #555; max-width: 550px; font-style: italic; }
        
        .sec { padding: 3rem 0; border-bottom: 1px solid #E0E0E0; }
        .sec:last-child { border-bottom: none; }
        .sec-lbl {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #999; margin-bottom: 1.5rem;
        }
        .sec-ttl { font-size: 1.3rem; font-weight: 400; margin-bottom: 1rem; }
        .sec-txt { color: #333; max-width: 600px; }
        
        /* Strate Header */
        .str-hd {
          padding: 3rem 0 2rem; border-bottom: 1px solid #0A0A0A; margin-bottom: 2rem;
        }
        .str-lbl {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #666; margin-bottom: 0.75rem;
        }
        .str-ttl { font-size: 1.75rem; font-weight: 400; margin-bottom: 0.4rem; }
        .str-desc { color: #666; font-style: italic; font-size: 0.95rem; }
        
        /* Notebooks */
        .nb-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1px; background: #0A0A0A; border: 1px solid #0A0A0A;
        }
        .nb-card {
          background: #FAFAFA; padding: 1.5rem; cursor: pointer; transition: background 0.15s;
        }
        .nb-card:hover { background: #F0F0F0; }
        .nb-card.sel { background: #0A0A0A; color: #FAFAFA; }
        .nb-name { font-size: 0.95rem; margin-bottom: 0.3rem; }
        .nb-meta {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.08em; color: #888;
        }
        .nb-card.sel .nb-meta { color: #888; }
        
        /* Documents */
        .docs-sec { margin-top: 2.5rem; }
        .docs-hd {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid #E0E0E0;
        }
        .docs-ttl {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.15em; text-transform: uppercase;
        }
        .add-btn {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.08em; background: none; border: 1px solid #0A0A0A;
          padding: 0.4rem 0.8rem; cursor: pointer; transition: all 0.15s;
        }
        .add-btn:hover { background: #0A0A0A; color: #FAFAFA; }
        .doc-item {
          padding: 1.25rem 0; border-bottom: 1px solid #E0E0E0;
          display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: baseline;
        }
        .doc-item:last-child { border-bottom: none; }
        .doc-ttl { font-size: 0.95rem; margin-bottom: 0.2rem; }
        .doc-exc { font-size: 0.85rem; color: #666; font-style: italic; }
        .doc-meta {
          font-family: 'JetBrains Mono', monospace; font-size: 0.5rem;
          letter-spacing: 0.08em; color: #999; text-align: right;
        }
        .tags { margin-top: 0.6rem; display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .tag {
          font-family: 'JetBrains Mono', monospace; font-size: 0.5rem;
          letter-spacing: 0.08em; padding: 0.2rem 0.4rem; border: 1px solid #CCC; color: #666;
        }
        
        /* Chat */
        .chat-sec {
          margin-top: 3rem; border-top: 1px solid #0A0A0A; padding-top: 2rem;
        }
        .chat-hd { margin-bottom: 1.5rem; }
        .chat-lbl {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: #666; margin-bottom: 0.4rem;
        }
        .chat-ttl { font-size: 1.1rem; }
        .chat-msgs {
          min-height: 250px; max-height: 400px; overflow-y: auto;
          margin-bottom: 1.5rem; padding: 0.75rem 0;
        }
        .chat-msg { margin-bottom: 1.5rem; }
        .msg-role {
          font-family: 'JetBrains Mono', monospace; font-size: 0.5rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #999; margin-bottom: 0.4rem;
        }
        .msg-cnt { color: #333; line-height: 1.65; }
        .msg-cnt.ast { padding-left: 1.25rem; border-left: 2px solid #0A0A0A; }
        .msg-src { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #E0E0E0; }
        .src-lbl {
          font-family: 'JetBrains Mono', monospace; font-size: 0.45rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #999; margin-bottom: 0.3rem;
        }
        .src-item { font-size: 0.75rem; color: #666; font-style: italic; margin-bottom: 0.2rem; }
        .chat-in-ct {
          display: flex; gap: 0.75rem; border-top: 1px solid #E0E0E0; padding-top: 1rem;
        }
        .chat-in {
          flex: 1; padding: 0.85rem; font-family: 'EB Garamond', serif;
          font-size: 0.95rem; border: 1px solid #0A0A0A; background: #FAFAFA; resize: none;
        }
        .chat-in:focus { outline: none; background: #FFF; }
        .chat-in::placeholder { color: #999; font-style: italic; }
        .chat-send {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          background: #0A0A0A; color: #FAFAFA; border: none;
          padding: 0.85rem 1.5rem; cursor: pointer;
        }
        .chat-send:hover { opacity: 0.8; }
        .chat-send:disabled { opacity: 0.3; cursor: not-allowed; }
        
        /* Restricted */
        .restr { padding: 5rem 0; text-align: center; }
        .restr-icon { font-size: 2.5rem; margin-bottom: 1.5rem; opacity: 0.25; }
        .restr-ttl { font-size: 1.1rem; margin-bottom: 0.75rem; }
        .restr-txt { color: #666; font-style: italic; margin-bottom: 1.5rem; }
        
        /* Loading */
        .ld {
          font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
          letter-spacing: 0.15em; color: #999; animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        
        /* Modal */
        .modal-ov {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(250,250,250,0.97); z-index: 200;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-ct { width: 100%; max-width: 360px; padding: 2.5rem; }
        .modal-ttl { font-size: 1.3rem; margin-bottom: 0.4rem; }
        .modal-sub { color: #666; font-style: italic; margin-bottom: 1.5rem; font-size: 0.9rem; }
        .fg { margin-bottom: 1.25rem; }
        .fl {
          display: block; font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 0.4rem; color: #666;
        }
        .fi {
          width: 100%; padding: 0.85rem; font-family: 'EB Garamond', serif;
          font-size: 0.95rem; border: 1px solid #0A0A0A; background: #FAFAFA;
        }
        .fi:focus { outline: none; background: #FFF; }
        .fa { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        .fb {
          flex: 1; padding: 0.85rem; font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
        }
        .fb.pri { background: #0A0A0A; color: #FAFAFA; border: 1px solid #0A0A0A; }
        .fb.sec { background: transparent; color: #0A0A0A; border: 1px solid #CCC; }
        .fb:hover { opacity: 0.8; }
        
        /* Footer */
        .ft { border-top: 1px solid #0A0A0A; padding: 2rem; margin-top: 3rem; }
        .ft-in {
          max-width: 1200px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: baseline;
        }
        .ft-txt {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.08em; color: #999;
        }
        .ft-lnks { display: flex; gap: 1.5rem; }
        .ft-lnk {
          font-family: 'JetBrains Mono', monospace; font-size: 0.55rem;
          letter-spacing: 0.08em; color: #666; text-decoration: none;
        }
        .ft-lnk:hover { color: #0A0A0A; }
        
        @media (max-width: 768px) {
          .st-nav { display: none; }
          .ct { padding: 2rem 1.25rem; }
          .hd-in { padding: 0.85rem 1.25rem; }
          .nb-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <header className="hd">
        <div className="hd-in">
          <div className="logo">
            Matière Grise
            <span>{lang === 'fr' ? 'Les origines terrestres de l\'IA' : 'الأصول الأرضية للذكاء الاصطناعي'}</span>
          </div>
          <nav className="hd-nav">
            <button className="lang-btn" onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}>
              {lang === 'fr' ? 'العربية' : 'Français'}
            </button>
            {user ? (
              <div className="user-inf">
                {user.name}<span className="user-role">({user.role})</span>
              </div>
            ) : (
              <button className="auth-btn" onClick={() => setShowLogin(true)}>
                {lang === 'fr' ? 'Connexion' : 'دخول'}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Strates Nav */}
      <nav className="st-nav">
        {STRATES.map(s => (
          <a
            key={s.id}
            className={`st-lnk ${currentStrate === s.id ? 'act' : ''} ${!canAccessStrate(s.id) ? 'locked' : ''}`}
            onClick={() => canAccessStrate(s.id) && setCurrentStrate(s.id)}
          >
            <span className="st-d">{s.depth}</span>
            {lang === 'fr' ? s.name : s.nameAr}
          </a>
        ))}
      </nav>

      {/* Main */}
      <main className="mn">
        {/* SURFACE */}
        {currentStrate === 'surface' && (
          <div className="ct">
            <div className="sf-hero">
              <h1 className={`sf-ttl ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Matière Grise' : 'المادة الرمادية'}
              </h1>
              <p className={`sf-sub ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr'
                  ? 'Une archéologie des infrastructures matérielles de l\'intelligence artificielle. Du cobalt de Bou Azzer aux data centers, une enquête sur les origines terrestres de l\'IA.'
                  : 'أركيولوجيا البنى التحتية المادية للذكاء الاصطناعي. من كوبالت بو عزار إلى مراكز البيانات.'}
              </p>
            </div>
            <section className="sec">
              <div className="sec-lbl">{lang === 'fr' ? 'Projet' : 'المشروع'}</div>
              <h2 className={`sec-ttl ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'De la mine au modèle' : 'من المنجم إلى النموذج'}
              </h2>
              <p className={`sec-txt ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr'
                  ? 'Avant d\'être un réseau de neurones artificiels, l\'intelligence artificielle est d\'abord une accumulation de matières premières : cobalt, lithium, terres rares, silicium. Ce projet retrace les chaînes d\'extraction qui relient les mines du Sud global aux infrastructures computationnelles.'
                  : 'قبل أن يكون شبكة من الخلايا العصبية الاصطناعية، الذكاء الاصطناعي هو أولاً تراكم للمواد الخام: الكوبالت، الليثيوم، الأتربة النادرة، السيليكون.'}
              </p>
            </section>
            <section className="sec">
              <div className="sec-lbl">{lang === 'fr' ? 'Structure' : 'البنية'}</div>
              <h2 className={`sec-ttl ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? '5 strates de recherche' : 'خمس طبقات بحثية'}
              </h2>
              <p className={`sec-txt ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr'
                  ? '6 pédagogues et 9 chercheurs collaborent dans une structure stratigraphique, où les savoirs s\'accumulent et se transforment de la profondeur vers la surface.'
                  : 'يتعاون 6 بيداغوجيين و9 باحثين في بنية طبقية، حيث تتراكم المعارف وتتحول من العمق نحو السطح.'}
              </p>
            </section>
          </div>
        )}

        {/* EPISTEME */}
        {currentStrate === 'episteme' && (
          <div className="ct">
            <div className="str-hd">
              <div className="str-lbl">Strate 1 — Profondeur 4</div>
              <h1 className={`str-ttl ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Épistémè' : 'الإبستيمي'}
              </h1>
              <p className={`str-desc ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Espace des 6 pédagogues' : 'فضاء البيداغوجيين الستة'}
              </p>
            </div>
            {!canAccessStrate('episteme') ? (
              <div className="restr">
                <div className="restr-icon">◯</div>
                <h2 className="restr-ttl">{lang === 'fr' ? 'Accès restreint' : 'وصول مقيد'}</h2>
                <p className="restr-txt">{lang === 'fr' ? 'Réservé aux pédagogues.' : 'مخصص للبيداغوجيين.'}</p>
                <button className="auth-btn" onClick={() => setShowLogin(true)}>
                  {lang === 'fr' ? 'Connexion' : 'دخول'}
                </button>
              </div>
            ) : (
              <>
                <div className="nb-grid">
                  {notebooks.filter(n => n.strate === 'episteme').map(nb => (
                    <div key={nb.id} className={`nb-card ${selectedNotebook?.id === nb.id ? 'sel' : ''}`}
                      onClick={() => { setSelectedNotebook(nb); fetchDocuments(nb.id); }}>
                      <div className="nb-name">{nb.name}</div>
                      <div className="nb-meta">{nb.is_collective ? 'Collectif' : 'Personnel'}</div>
                    </div>
                  ))}
                </div>
                {selectedNotebook && <NotebookContent notebook={selectedNotebook} documents={documents} 
                  chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput}
                  handleChat={handleChat} isLoading={isLoading} lang={lang} />}
              </>
            )}
          </div>
        )}

        {/* SEDIMENT */}
        {currentStrate === 'sediment' && (
          <div className="ct">
            <div className="str-hd">
              <div className="str-lbl">Strate 2 — Profondeur 3</div>
              <h1 className={`str-ttl ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Sédiment' : 'الرواسب'}
              </h1>
              <p className={`str-desc ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Espace des 9 chercheurs' : 'فضاء الباحثين التسعة'}
              </p>
            </div>
            {!canAccessStrate('sediment') ? (
              <div className="restr">
                <div className="restr-icon">◯</div>
                <h2 className="restr-ttl">{lang === 'fr' ? 'Accès restreint' : 'وصول مقيد'}</h2>
                <p className="restr-txt">{lang === 'fr' ? 'Réservé aux chercheurs.' : 'مخصص للباحثين.'}</p>
                <button className="auth-btn" onClick={() => setShowLogin(true)}>
                  {lang === 'fr' ? 'Connexion' : 'دخول'}
                </button>
              </div>
            ) : (
              <>
                <div className="nb-grid">
                  {notebooks.filter(n => n.strate === 'sediment').map(nb => (
                    <div key={nb.id} className={`nb-card ${selectedNotebook?.id === nb.id ? 'sel' : ''}`}
                      onClick={() => { setSelectedNotebook(nb); fetchDocuments(nb.id); }}>
                      <div className="nb-name">{nb.name}</div>
                      <div className="nb-meta">{nb.is_collective ? 'Agora' : 'Personnel'}</div>
                    </div>
                  ))}
                </div>
                {selectedNotebook && <NotebookContent notebook={selectedNotebook} documents={documents}
                  chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput}
                  handleChat={handleChat} isLoading={isLoading} lang={lang} />}
              </>
            )}
          </div>
        )}

        {/* MANTEAU */}
        {currentStrate === 'manteau' && (
          <div className="ct">
            <div className="str-hd">
              <div className="str-lbl">Strate 3 — Profondeur 2</div>
              <h1 className={`str-ttl ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Manteau' : 'الوشاح'}
              </h1>
              <p className={`str-desc ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'IA autonome — Analyse continue' : 'الذكاء الاصطناعي المستقل'}
              </p>
            </div>
            <section className="sec">
              <p className="sec-txt">
                {lang === 'fr'
                  ? 'L\'IA analyse en continu les documents des strates Épistémè et Sédiment, générant corrélations, cartes mentales et références croisées.'
                  : 'يحلل الذكاء الاصطناعي باستمرار وثائق الطبقات ويولد ارتباطات وخرائط ذهنية.'}
              </p>
            </section>
          </div>
        )}

        {/* EXTRACTION */}
        {currentStrate === 'extraction' && (
          <div className="ct">
            <div className="str-hd">
              <div className="str-lbl">Strate 4 — Profondeur 1</div>
              <h1 className={`str-ttl ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Extraction' : 'الاستخراج'}
              </h1>
              <p className={`str-desc ${lang === 'ar' ? 'ar' : ''}`}>
                {lang === 'fr' ? 'Sas de publication — Curation collective' : 'غرفة النشر — التنسيق الجماعي'}
              </p>
            </div>
            {!canAccessStrate('extraction') ? (
              <div className="restr">
                <div className="restr-icon">◯</div>
                <h2 className="restr-ttl">{lang === 'fr' ? 'Accès restreint' : 'وصول مقيد'}</h2>
                <button className="auth-btn" onClick={() => setShowLogin(true)}>
                  {lang === 'fr' ? 'Connexion' : 'دخول'}
                </button>
              </div>
            ) : (
              <section className="sec">
                <p className="sec-txt">
                  {lang === 'fr'
                    ? 'Espace de curation collective. Sélectionnez les contenus à publier sur la Surface.'
                    : 'فضاء التنسيق الجماعي. اختر المحتويات للنشر على السطح.'}
                </p>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="ft">
        <div className="ft-in">
          <div className="ft-txt">© 2026 Matière Grise — ENSP Arles / INBA Tétouan</div>
          <div className="ft-lnks">
            <a href="#" className="ft-lnk">Mentions légales</a>
            <a href="#" className="ft-lnk">Contact</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && <LoginModal lang={lang} onClose={() => setShowLogin(false)} 
        onLogin={handleLogin} isLoading={isLoading} />}
    </div>
  );
}

// Notebook Content Component
function NotebookContent({ notebook, documents, chatMessages, chatInput, setChatInput, handleChat, isLoading, lang }) {
  return (
    <>
      <div className="docs-sec">
        <div className="docs-hd">
          <span className="docs-ttl">Documents</span>
          <button className="add-btn">+ {lang === 'fr' ? 'Ajouter' : 'إضافة'}</button>
        </div>
        {documents.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>
            {lang === 'fr' ? 'Aucun document.' : 'لا توجد وثائق.'}
          </p>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="doc-item">
              <div>
                <div className="doc-ttl">{doc.title}</div>
                {doc.content && <div className="doc-exc">{doc.content.substring(0, 120)}...</div>}
                {doc.tags?.length > 0 && (
                  <div className="tags">{doc.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                )}
              </div>
              <div className="doc-meta">{doc.doc_type}</div>
            </div>
          ))
        )}
      </div>
      <div className="chat-sec">
        <div className="chat-hd">
          <div className="chat-lbl">{lang === 'fr' ? 'Dialogue' : 'حوار'}</div>
          <h2 className="chat-ttl">{notebook.name}</h2>
        </div>
        <div className="chat-msgs">
          {chatMessages.length === 0 && (
            <p style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>
              {lang === 'fr' ? 'Posez une question sur vos documents...' : 'اطرح سؤالاً...'}
            </p>
          )}
          {chatMessages.map((m, i) => (
            <div key={i} className="chat-msg">
              <div className="msg-role">{m.role === 'user' ? (lang === 'fr' ? 'Vous' : 'أنت') : (lang === 'fr' ? 'Réponse' : 'إجابة')}</div>
              <div className={`msg-cnt ${m.role === 'assistant' ? 'ast' : ''}`}>{m.content}</div>
              {m.sources?.length > 0 && (
                <div className="msg-src">
                  <div className="src-lbl">Sources</div>
                  {m.sources.map((s, j) => <div key={j} className="src-item">{s.text_preview}</div>)}
                </div>
              )}
            </div>
          ))}
          {isLoading && <div className="ld">{lang === 'fr' ? 'Analyse...' : 'جارٍ التحليل...'}</div>}
        </div>
        <div className="chat-in-ct">
          <textarea className="chat-in" rows={2} placeholder={lang === 'fr' ? 'Question...' : 'سؤال...'}
            value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(); }}} />
          <button className="chat-send" onClick={handleChat} disabled={isLoading || !chatInput.trim()}>
            {lang === 'fr' ? 'Envoyer' : 'إرسال'}
          </button>
        </div>
      </div>
    </>
  );
}

// Login Modal Component
function LoginModal({ lang, onClose, onLogin, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal-ct" onClick={e => e.stopPropagation()}>
        <h2 className={`modal-ttl ${lang === 'ar' ? 'ar' : ''}`}>
          {lang === 'fr' ? 'Connexion' : 'تسجيل الدخول'}
        </h2>
        <p className={`modal-sub ${lang === 'ar' ? 'ar' : ''}`}>
          {lang === 'fr' ? 'Accédez aux strates de recherche' : 'الوصول إلى طبقات البحث'}
        </p>
        <form onSubmit={e => { e.preventDefault(); onLogin(email, password); }}>
          <div className="fg">
            <label className="fl">Email</label>
            <input type="email" className="fi" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="fg">
            <label className="fl">{lang === 'fr' ? 'Mot de passe' : 'كلمة المرور'}</label>
            <input type="password" className="fi" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="fa">
            <button type="button" className="fb sec" onClick={onClose}>
              {lang === 'fr' ? 'Annuler' : 'إلغاء'}
            </button>
            <button type="submit" className="fb pri" disabled={isLoading}>
              {isLoading ? '...' : (lang === 'fr' ? 'Connexion' : 'دخول')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
