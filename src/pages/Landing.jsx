import React,{useState,useEffect} from 'react';
import {useApp,BRANDS} from '../context/AppContext';

export default function Landing(){
  const{setPage,logoUrls}=useApp();
  const[vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),80)},[]);

  return(
    <div style={{background:'#FFFBF0',color:'#1A1400',minHeight:'100vh',overflowX:'hidden',fontFamily:"'DM Sans',system-ui,sans-serif"}}>

      {/* NAV */}
      <nav style={{background:'rgba(255,251,240,.92)',backdropFilter:'blur(16px)',borderBottom:'2px solid rgba(245,197,24,.2)',padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#F5C518,#FF6B35)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:16,color:'#fff'}}>K</div>
          <span style={{fontWeight:900,fontSize:14,letterSpacing:'-.01em',color:'#1A1400'}}>KML <span style={{color:'#FF6B35'}}>GROUP</span></span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setPage('login')} style={{background:'transparent',color:'#6B5B00',border:'1.5px solid rgba(245,197,24,.5)',padding:'7px 16px',borderRadius:8,fontWeight:600,fontSize:12,cursor:'pointer'}}>Masuk</button>
          <button onClick={()=>setPage('dashboard')} style={{background:'#F5C518',color:'#1A1400',border:'none',padding:'8px 18px',borderRadius:8,fontWeight:700,fontSize:12,cursor:'pointer'}}>Buka Dashboard</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{padding:'64px 24px 52px',textAlign:'center',position:'relative',overflow:'hidden',background:'linear-gradient(160deg,#FFF8DC 0%,#FFF0CC 40%,#FFE8CC 70%,#FFD8C0 100%)',animation:vis?'fadeUp .7s ease':'none',opacity:vis?1:0}}>
        <div style={{position:'absolute',top:-60,right:-60,width:280,height:280,borderRadius:'50%',background:'#F5C518',opacity:.18,filter:'blur(60px)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-40,left:-40,width:220,height:220,borderRadius:'50%',background:'#FF6B35',opacity:.15,filter:'blur(50px)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:'40%',right:'5%',width:160,height:160,borderRadius:'50%',background:'#E63946',opacity:.1,filter:'blur(40px)',pointerEvents:'none'}}/>
        <div style={{position:'relative',maxWidth:700,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 16px',borderRadius:20,background:'#F5C518',marginBottom:24,boxShadow:'0 2px 12px rgba(245,197,24,.4)'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#1A1400',animation:'pulse 2s infinite'}}/>
            <span style={{fontSize:11,fontWeight:800,color:'#1A1400',letterSpacing:'.05em'}}>MARKETING INTELLIGENCE DASHBOARD</span>
          </div>
          <h1 style={{fontSize:'clamp(28px,5vw,42px)',fontWeight:900,lineHeight:1.06,letterSpacing:'-.03em',marginBottom:14,color:'#1A1400'}}>
            REPORT TIM MARKETING<br/>
            <span style={{background:'linear-gradient(90deg,#FF6B35,#E63946)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>KML GROUP</span>
          </h1>
          <p style={{fontSize:15,color:'#5C4A00',lineHeight:1.65,maxWidth:500,margin:'0 auto 30px'}}>
            Pantau performa, penjualan, iklan, dan pertumbuhan semua brand secara realtime. Satu platform untuk semua tim.
          </p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={()=>setPage('dashboard')} style={{background:'linear-gradient(135deg,#FF6B35,#E63946)',color:'#fff',border:'none',padding:'12px 28px',borderRadius:10,fontSize:14,fontWeight:800,cursor:'pointer',boxShadow:'0 4px 20px rgba(255,107,53,.4)'}}>Lihat Dashboard →</button>
            <button style={{background:'#fff',color:'#FF6B35',border:'2px solid #FF6B35',padding:'11px 28px',fontSize:14,borderRadius:10,fontWeight:700,cursor:'pointer'}}>Download Report</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{background:'linear-gradient(135deg,#FF6B35,#E63946)',padding:'28px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,maxWidth:680,margin:'0 auto',textAlign:'center'}}>
          {[['3','Brand Aktif'],['3','Platform'],['6','Divisi Tim'],['40+','Metrik Terpantau']].map(([v,l])=>(
            <div key={l}>
              <div style={{fontSize:30,fontWeight:900,color:'#fff',letterSpacing:'-.02em'}}>{v}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.75)',marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND CARDS */}
      <section style={{padding:'44px 24px',background:'#FFFBF0'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <h2 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:6,color:'#1A1400'}}>3 Brand, 1 Dashboard</h2>
          <p style={{fontSize:13,color:'#8B7300'}}>Semua brand terpantau dalam satu sistem terintegrasi</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,maxWidth:680,margin:'0 auto'}}>
          {[
            {id:'ngaciin',bg:'linear-gradient(135deg,#FFF0E8,#FFE0D0)',border:'rgba(255,107,53,.25)',icon:'🌶️',iconBg:'rgba(255,107,53,.12)',nameColor:'#D44A1A',tagColor:'#8B4020'},
            {id:'zonanyam',bg:'linear-gradient(135deg,#FFFBE0,#FFF0B0)',border:'rgba(245,197,24,.25)',icon:'🍢',iconBg:'rgba(245,197,24,.12)',nameColor:'#A07800',tagColor:'#6B5000'},
            {id:'sentral_basreng',bg:'linear-gradient(135deg,#FFE8EA,#FFD0D4)',border:'rgba(230,57,70,.25)',icon:'🥨',iconBg:'rgba(230,57,70,.12)',nameColor:'#A02030',tagColor:'#6B1020'},
          ].map(b=>{
            const brand=BRANDS[b.id];
            const logo=logoUrls[b.id];
            return(
              <div key={b.id} onClick={()=>{setPage('dashboard')}}
                style={{background:b.bg,border:`2px solid ${b.border}`,borderRadius:16,padding:20,cursor:'pointer',transition:'transform .2s'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''}>
                <div style={{width:56,height:56,borderRadius:14,background:b.iconBg,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,overflow:'hidden'}}>
                  {logo?<img src={logo} alt={brand.label} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                    :<span style={{fontSize:28}}>{b.icon}</span>}
                </div>
                <div style={{fontSize:14,fontWeight:900,color:b.nameColor,marginBottom:3}}>{brand.label}</div>
                <div style={{fontSize:10,color:b.tagColor,marginBottom:12}}>{brand.tagline}</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {['TikTok','Shopee','Meta'].map(p=>(
                    <span key={p} style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:20,background:'#fff',color:p==='TikTok'?'#010101':p==='Shopee'?'#EE4D2D':'#1877F2'}}>{p}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRODUK UNGGULAN */}
      <section style={{background:'linear-gradient(160deg,#FFF3CC,#FFE8B0)',padding:'44px 24px'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <h2 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:6,color:'#1A1400'}}>Produk Unggulan</h2>
          <p style={{fontSize:13,color:'#8B7300'}}>Produk terlaris dari 3 brand KML Group</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,maxWidth:680,margin:'0 auto'}}>
          {[
            {img:'https://i.ibb.co/4gWtBDZP/CIMIN-PEDAS.png',brand:'NGACIIN',brandColor:'#FF6B35',badgeBg:'#FF6B35',name:'Cimin Pedas',tag:'Pedas • Kenyal',bg:'#FFE0D0'},
            {img:'https://i.ibb.co/4gWtBDZP/CIMIN-PEDAS.png',brand:'NGACIIN',brandColor:'#FF6B35',badgeBg:'#FF6B35',name:'Cimin Balado',tag:'Pedas Level 5',bg:'#FFD0C0'},
            {img:'https://i.ibb.co/x8CcYcxp/RABOKKI.png',brand:'ZONA NYAM',brandColor:'#A07800',badgeBg:'#D4A000',name:'Rabokki Cheese',tag:'Cheesy • Viral',bg:'#FFF8D0'},
            {img:'https://i.ibb.co/x8CcYcxp/RABOKKI.png',brand:'ZONA NYAM',brandColor:'#A07800',badgeBg:'#D4A000',name:'Topoki Cheese',tag:'Creamy • Lezat',bg:'#FFEE90'},
            {img:'https://i.ibb.co/nsQQPxPR/75-GR-BASCANG.png',brand:'SENTRAL BASRENG',brandColor:'#C02030',badgeBg:'#E63946',name:'Basreng 75gr',tag:'Renyah • Gurih',bg:'#FFE0E2'},
            {img:'https://i.ibb.co/nsQQPxPR/75-GR-BASCANG.png',brand:'SENTRAL BASRENG',brandColor:'#C02030',badgeBg:'#E63946',name:'Basreng Toples',tag:'Premium • Hadiah',bg:'#FFC0C4'},
          ].map((p,i)=>(
            <div key={i} style={{background:'#fff',borderRadius:14,overflow:'hidden',border:'1.5px solid rgba(245,197,24,.2)',transition:'transform .2s'}}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e=>e.currentTarget.style.transform=''}>
              <div style={{height:110,background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
                <img src={p.img} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';e.target.parentNode.style.fontSize='36px';e.target.parentNode.innerHTML+='🍽️'}}/>
                <span style={{position:'absolute',top:8,right:8,fontSize:9,fontWeight:800,padding:'3px 8px',borderRadius:20,background:p.badgeBg,color:'#fff'}}>{p.brand.split(' ')[0]}</span>
              </div>
              <div style={{padding:'10px 12px'}}>
                <div style={{fontSize:9,fontWeight:800,color:p.brandColor,marginBottom:3,letterSpacing:'.05em'}}>{p.brand}</div>
                <div style={{fontSize:12,fontWeight:700,color:'#1A1400',marginBottom:5,lineHeight:1.3}}>{p.name}</div>
                <span style={{fontSize:10,color:'#8B7300',background:'#FFF3CC',padding:'2px 8px',borderRadius:20}}>{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:20,fontSize:12,color:'#8B7300'}}>
          + masih banyak produk lainnya — <span onClick={()=>setPage('brand')} style={{color:'#FF6B35',fontWeight:700,cursor:'pointer'}}>lihat semua produk →</span>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{background:'#FFFBF0',padding:'44px 24px'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <h2 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:6,color:'#1A1400'}}>Fitur Lengkap untuk Tim Marketing</h2>
          <p style={{fontSize:13,color:'#8B7300'}}>Semua yang dibutuhkan dalam satu platform</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,maxWidth:680,margin:'0 auto'}}>
          {[
            {icon:'📊',bg:'#FFF3CC',title:'Dashboard Realtime',desc:'Pantau GMV, ROAS, dan konversi semua brand.'},
            {icon:'🎯',bg:'#FFE8D8',title:'Input per Divisi',desc:'KOL, Marketplace, CS MP, Konten & Live.'},
            {icon:'⚡',bg:'#FFE8EA',title:'Multi Platform',desc:'TikTok, Shopee & Meta terpisah otomatis.'},
            {icon:'📈',bg:'#E8F8F0',title:'Analisis Otomatis',desc:'Insight dan rekomendasi dari data harian.'},
            {icon:'📥',bg:'#E8F0FF',title:'Export & Sheets',desc:'Download Excel atau kirim ke Google Sheets.'},
            {icon:'🔐',bg:'#FFF0F8',title:'Login per Tim',desc:'6 akun terpisah sesuai divisi masing-masing.'},
          ].map((f,i)=>(
            <div key={i} style={{background:'#fff',border:'1.5px solid rgba(245,197,24,.2)',borderRadius:14,padding:16,display:'flex',gap:12,transition:'border-color .2s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#F5C518'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(245,197,24,.2)'}>
              <div style={{width:38,height:38,borderRadius:10,background:f.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{f.icon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:3,color:'#1A1400'}}>{f.title}</div>
                <div style={{fontSize:11,color:'#6B5B00',lineHeight:1.5}}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVISI */}
      <section style={{background:'linear-gradient(135deg,#1A1400,#2E2000)',padding:'44px 24px'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <h2 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:6,color:'#F5C518'}}>5 Divisi Tim</h2>
          <p style={{fontSize:13,color:'#8B7300'}}>Input data dipisah per divisi dan per platform untuk laporan yang akurat</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,maxWidth:680,margin:'0 auto'}}>
          {[['🎯','Tim KOL','Afiliasi'],['🛒','Marketplace','TikTok & Shopee'],['📡','Tim Live','Live streaming'],['🎬','Tim Konten','Upload & posting'],['💬','CS MP','Chat & komplain']].map(([icon,name,desc])=>(
            <div key={name} style={{background:'#2E2400',border:'1px solid rgba(245,197,24,.15)',borderRadius:12,padding:'14px 10px',textAlign:'center'}}>
              <div style={{fontSize:22,marginBottom:7}}>{icon}</div>
              <div style={{fontSize:11,fontWeight:700,color:'#F5C518',marginBottom:2}}>{name}</div>
              <div style={{fontSize:9,color:'#8B7300',lineHeight:1.4}}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'linear-gradient(160deg,#F5C518,#FF6B35)',padding:'56px 24px',textAlign:'center'}}>
        <h2 style={{fontSize:26,fontWeight:900,letterSpacing:'-.02em',marginBottom:10,color:'#fff'}}>Siap Pantau Performa Brand?</h2>
        <p style={{fontSize:13,color:'rgba(255,255,255,.85)',marginBottom:26}}>Login dengan akun tim kamu dan mulai input data hari ini.</p>
        <button onClick={()=>setPage('login')} style={{background:'#fff',color:'#FF6B35',padding:'13px 36px',borderRadius:10,fontSize:15,fontWeight:800,border:'none',cursor:'pointer'}}>Mulai Sekarang →</button>
        <div style={{marginTop:14,fontSize:11,color:'rgba(255,255,255,.7)'}}>KML Group · Marketing Intelligence · 2025</div>
      </section>

      <footer style={{background:'#1A1400',padding:'16px 24px',textAlign:'center',fontSize:11,color:'#8B7300'}}>
        KML Group Dashboard · Dibuat untuk tim marketing yang luar biasa
      </footer>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
