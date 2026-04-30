import React,{useState} from 'react';
import {AppProvider,useApp} from './context/AppContext';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardMain from './pages/DashboardMain';
import {BrandDetail,ExportPage} from './pages/BrandExport';
import Laporan from './pages/Laporan';
import {Performance,Analisis} from './pages/Performance';
import InputKOL from './pages/InputKOL';
import InputMarketplace from './pages/InputMarketplace';
import {InputCSMP,InputKonten,InputLive} from './pages/InputOthers';
import Settings from './pages/Settings';
import {Menu,Bell} from 'lucide-react';

const PAGE_TITLES={
  dashboard:'Dashboard Utama',brand:'Dashboard Brand',laporan:'Laporan',performance:'Performance',analisis:'Analisis Data',
  input_kol:'Input KOL',input_marketplace:'Marketplace Optimizer',input_csmp:'CS Marketplace',input_konten:'Input Konten',input_live:'Input Live',
  export:'Export Data',settings:'Pengaturan'
};

function Header({onMenu}){
  const{page,user,activeBrand,BRANDS}=useApp();
  const b=BRANDS[activeBrand];
  return(
    <header style={{height:'var(--hh)',background:'#fff',borderBottom:'1px solid var(--bo)',display:'flex',alignItems:'center',padding:'0 20px',gap:14,position:'sticky',top:0,zIndex:50,flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,.06)'}}>
      <button onClick={onMenu} className="menu-btn" style={{background:'none',border:'none',cursor:'pointer',color:'var(--t2)',display:'none',padding:4}}>
        <Menu size={20}/>
      </button>
      <div style={{flex:1}}>
        <h2 style={{fontFamily:'var(--fd)',fontSize:16,fontWeight:800,color:'var(--t1)'}}>{PAGE_TITLES[page]||page}</h2>
        {page==='brand'&&<p style={{fontSize:10,color:b.color,marginTop:1}}>{b.label} — {b.tagline}</p>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:6,background:'#FFF5F2',border:'1px solid #EE4D2D30',borderRadius:20,padding:'5px 14px'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'#00BFA5',animation:'pulse 2s infinite'}}/>
          <span style={{fontSize:12,color:'#EE4D2D',fontWeight:700}}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
}

function AppLayout(){
  const{user,page,setPage}=useApp();
  const[menuOpen,setMenuOpen]=useState(false);

  if(page==='landing')return<Landing/>;
  if(page==='login'||!user)return<Login/>;

  const render=()=>{
    switch(page){
      case 'dashboard':return<DashboardMain/>;
      case 'brand':return<BrandDetail/>;
      case 'laporan':return<Laporan/>;
      case 'performance':return<Performance/>;
      case 'analisis':return<Analisis/>;
      case 'input_kol':return<InputKOL/>;
      case 'input_marketplace':return<InputMarketplace/>;
      case 'input_csmp':return<InputCSMP/>;
      case 'input_konten':return<InputKonten/>;
      case 'input_live':return<InputLive/>;
      case 'export':return<ExportPage/>;
      case 'settings':return<Settings/>;
      default:return<DashboardMain/>;
    }
  };

  return(
    <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
      <Sidebar/>
      {menuOpen&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:199}} onClick={()=>setMenuOpen(false)}/>}
      {menuOpen&&<Sidebar mobile onClose={()=>setMenuOpen(false)}/>}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0}}>
        <Header onMenu={()=>setMenuOpen(true)}/>
        <main style={{flex:1,overflowY:'auto',padding:'20px 20px 70px',background:'var(--bg0)'}}>
          <div style={{maxWidth:1200,margin:'0 auto',animation:'fadeUp .35s ease'}} key={page}>
            {render()}
          </div>
        </main>
      </div>
      <style>{`
        @media(max-width:768px){
          aside:not([style*="position: fixed"]){display:none!important}
          .menu-btn{display:flex!important}
          main{padding:14px 14px 60px!important}
        }
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>
    </div>
  );
}

export default function App(){
  return<AppProvider><AppLayout/></AppProvider>;
}
