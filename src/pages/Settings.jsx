import React,{useState} from 'react';
import {useApp,BRANDS} from '../context/AppContext';
import {Save,Check,Image,Target} from 'lucide-react';

function Field({label,children}){return(<div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:11,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</label>{children}</div>);}

export default function Settings(){
  const{logoUrls,setLogoUrls,targets,setTargets}=useApp();
  const[saved,setSaved]=useState(false);
  const[logos,setLogos]=useState({...logoUrls});
  const[tgt,setTgt]=useState({...targets});

  const save=()=>{
    setLogoUrls(logos);
    setTargets(tgt);
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  };

  return(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Pengaturan</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Logo brand dan target performa</p></div>
        <button onClick={save} className="btn btn-primary" style={{fontSize:13,padding:'9px 22px'}}>{saved?<><Check size={14}/>Tersimpan!</>:<><Save size={14}/>Simpan</>}</button>
      </div>

      {/* Logo settings */}
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}><Image size={15} color="var(--y)"/><div className="sec-title" style={{margin:0}}>Logo Brand</div></div>
        <p style={{fontSize:12,color:'var(--t2)',marginBottom:16,lineHeight:1.6}}>Upload logo ke <strong style={{color:'var(--y)'}}>imgbb.com</strong> lalu paste direct link-nya di bawah. Logo akan muncul di semua halaman dashboard.</p>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {Object.values(BRANDS).map(b=>(
            <div key={b.id} style={{display:'grid',gridTemplateColumns:'180px 1fr 60px',gap:12,alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:32,height:32,borderRadius:8,background:b.bg,border:`1px solid ${b.color}30`,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {logos[b.id]?<img src={logos[b.id]} alt={b.label} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                    :<span style={{fontSize:9,fontWeight:800,color:b.color}}>{b.label.split(' ').map(w=>w[0]).join('')}</span>}
                </div>
                <span style={{fontSize:13,fontWeight:700,color:b.color}}>{b.label}</span>
              </div>
              <Field label="">
                <input value={logos[b.id]||''} onChange={e=>setLogos(p=>({...p,[b.id]:e.target.value}))} placeholder="https://i.ibb.co/..." style={{fontSize:12}}/>
              </Field>
              {logos[b.id]&&<div style={{width:48,height:48,borderRadius:8,overflow:'hidden',border:'1px solid var(--bo)',background:'var(--bg3)'}}>
                <img src={logos[b.id]} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}} onError={e=>e.target.style.display='none'}/>
              </div>}
            </div>
          ))}
        </div>
        <div style={{marginTop:16,padding:'12px 14px',borderRadius:8,background:'var(--bg3)',fontSize:12,color:'var(--t2)',lineHeight:1.6}}>
          💡 <strong>Cara upload logo:</strong> Buka imgbb.com → drag & drop file logo → klik Upload → setelah selesai klik kanan foto → "Copy image address" → paste di sini.
        </div>
      </div>

      {/* Target settings */}
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}><Target size={15} color="var(--y)"/><div className="sec-title" style={{margin:0}}>Target Penjualan (Juta Rp/Bulan)</div></div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr>
            <th style={{textAlign:'left',padding:'8px',color:'var(--t3)',fontSize:10,textTransform:'uppercase',borderBottom:'1px solid var(--bo)'}}>Brand</th>
            <th style={{padding:'8px',color:'#69C9D0',fontSize:10,textTransform:'uppercase',borderBottom:'1px solid var(--bo)',textAlign:'center'}}>TikTok</th>
            <th style={{padding:'8px',color:'#EE4D2D',fontSize:10,textTransform:'uppercase',borderBottom:'1px solid var(--bo)',textAlign:'center'}}>Shopee</th>
            <th style={{padding:'8px',color:'#1877F2',fontSize:10,textTransform:'uppercase',borderBottom:'1px solid var(--bo)',textAlign:'center'}}>Meta</th>
          </tr></thead>
          <tbody>
            {Object.values(BRANDS).map(b=>(
              <tr key={b.id} style={{borderBottom:'1px solid var(--bo)'}}>
                <td style={{padding:'10px 8px'}}><span style={{fontWeight:700,color:b.color}}>{b.label}</span></td>
                {['tiktok','shopee','meta'].map(p=>(
                  <td key={p} style={{padding:'6px 8px',textAlign:'center'}}>
                    <input type="number" value={tgt[b.id]?.[p]||''} onChange={e=>setTgt(prev=>({...prev,[b.id]:{...prev[b.id],[p]:+e.target.value}}))}
                      placeholder="0" style={{width:90,textAlign:'center',fontSize:12}}/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Akun info */}
      <div className="card">
        <div className="sec-title">Akun Login Tim</div>
        <table className="tbl">
          <thead><tr><th>Email</th><th>Nama</th><th>Divisi</th><th>Password</th></tr></thead>
          <tbody>
            {[
              ['admin@kmlgroup.com','Admin Marketing','All Access','admin123'],
              ['kol@kmlgroup.com','Tim KOL','KOL','kol123'],
              ['marketplace@kmlgroup.com','Tim Marketplace','Marketplace','mp123'],
              ['csmp@kmlgroup.com','Tim CS MP','CS MP','cs123'],
              ['konten@kmlgroup.com','Tim Konten','Konten','konten123'],
              ['live@kmlgroup.com','Tim Live','Live','live123'],
            ].map(([e,n,d,p])=>(
              <tr key={e}>
                <td style={{fontSize:11,color:'var(--y)'}}>{e}</td>
                <td style={{fontWeight:600}}>{n}</td>
                <td><span className="badge b-y">{d}</span></td>
                <td style={{fontFamily:'monospace',fontSize:11,color:'var(--t2)'}}>{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
