import React,{useState,useMemo} from 'react';
import {useApp,BRANDS,PLATFORMS} from '../context/AppContext';
import {Download,Filter} from 'lucide-react';

const fRp=n=>'Rp '+new Intl.NumberFormat('id-ID',{notation:'compact',maximumFractionDigits:1}).format(n||0);
const fN=n=>new Intl.NumberFormat('id-ID').format(n||0);

function genDummy(){
  const brands=Object.keys(BRANDS),plats=Object.keys(PLATFORMS);
  const data=[];const today=new Date();
  for(let d=13;d>=0;d--){
    const dt=new Date(today);dt.setDate(today.getDate()-d);
    const ds=dt.toISOString().split('T')[0];
    brands.forEach(b=>plats.forEach(p=>{
      const gmv=Math.round((15+Math.random()*20)*1e6);
      const spend=Math.round(gmv*.2);
      const orders=Math.round(gmv/40000);
      const kol=Math.round(gmv*.3);
      const live=Math.round(gmv*.25);
      const chat=Math.floor(50+Math.random()*200);
      const uploads=Math.floor(1+Math.random()*5);
      data.push({id:`lr_${ds}_${b}_${p}`,date:ds,brand:b,platform:p,division:'marketplace',
        data:{gmv_total:gmv,ads_spend:spend,orders,kol_sales:kol,live_sales:live,chat_masuk:chat,konten_upload:uploads,roas:+(gmv/spend).toFixed(2)}});
    }));
  }
  return data;
}
const DUMMY_L=genDummy();

export default function Laporan(){
  const{reports,getReports}=useApp();
  const[tab,setTab]=useState('all');
  const[brand,setBrand]=useState('all');
  const[division,setDivision]=useState('all');
  const[from,setFrom]=useState('');
  const[to,setTo]=useState('');
  const[preset,setPreset]=useState('7d');

  const allData=[...reports,...DUMMY_L.filter(d=>!reports.find(r=>r.id===d.id))];

  const applyPreset=p=>{
    setPreset(p);
    const today=new Date();
    const fmt=d=>d.toISOString().split('T')[0];
    if(p==='today'){setFrom(fmt(today));setTo(fmt(today));}
    else if(p==='7d'){setFrom(fmt(new Date(Date.now()-6*86400000)));setTo(fmt(today));}
    else if(p==='30d'){setFrom(fmt(new Date(Date.now()-29*86400000)));setTo(fmt(today));}
    else{setFrom('');setTo('');}
  };

  const filtered=useMemo(()=>{
    return allData.filter(r=>{
      if(brand!=='all'&&r.brand!==brand)return false;
      if(tab!=='all'&&r.platform!==tab)return false;
      if(division!=='all'&&r.division!==division)return false;
      if(from&&r.date<from)return false;
      if(to&&r.date>to)return false;
      return true;
    }).sort((a,b)=>b.date>a.date?1:-1);
  },[allData,brand,tab,division,from,to]);

  const totals={
    gmv:filtered.reduce((s,r)=>s+(r.data?.gmv_total||0),0),
    orders:filtered.reduce((s,r)=>s+(r.data?.orders||0),0),
    spend:filtered.reduce((s,r)=>s+(r.data?.ads_spend||0),0),
    kol:filtered.reduce((s,r)=>s+(r.data?.kol_sales||0),0),
    live:filtered.reduce((s,r)=>s+(r.data?.live_sales||0),0),
    chat:filtered.reduce((s,r)=>s+(r.data?.chat_masuk||0),0),
  };

  const exportCSV=()=>{
    const h=['Tanggal','Brand','Platform','Divisi','Omset','Order','Ads Spend','ROAS','Konten Upload','Live Sales','Affiliate Sales','Chat Masuk'];
    const rows=filtered.map(r=>[r.date,BRANDS[r.brand]?.label||r.brand,PLATFORMS[r.platform]?.label||r.platform,r.division,r.data?.gmv_total||0,r.data?.orders||0,r.data?.ads_spend||0,r.data?.roas||'-',r.data?.konten_upload||0,r.data?.live_sales||0,r.data?.kol_sales||0,r.data?.chat_masuk||0]);
    const csv=[h,...rows].map(r=>r.join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`kml_laporan_${new Date().toISOString().split('T')[0]}.csv`;a.click();
  };

  const TABS=[{id:'all',label:'Semua Platform'},{id:'tiktok',label:'TikTok'},{id:'shopee',label:'Shopee'},{id:'meta',label:'Meta/Reseller'}];

  return(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Laporan</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>{filtered.length} data ditemukan</p></div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={exportCSV} className="btn btn-primary" style={{fontSize:12}}><Download size={13}/>Export Excel/CSV</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:3,background:'var(--bg2)',padding:5,borderRadius:12,border:'1px solid var(--bo)'}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'7px 10px',borderRadius:8,border:'none',cursor:'pointer',fontSize:12,fontWeight:tab===t.id?700:400,background:tab===t.id?'var(--y)':'transparent',color:tab===t.id?'#080809':'var(--t2)',transition:'all .15s'}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{background:'var(--bg2)',borderRadius:12,padding:'14px 18px',border:'1px solid var(--bo)',display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
        <div style={{display:'flex',gap:5}}>
          {['today','7d','30d','custom'].map(p=>(
            <button key={p} onClick={()=>applyPreset(p)} style={{padding:'5px 11px',borderRadius:7,border:'1px solid var(--bo)',fontSize:11,fontWeight:preset===p?700:400,background:preset===p?'var(--y2)':'transparent',color:preset===p?'var(--y)':'var(--t2)',cursor:'pointer'}}>
              {p==='today'?'Hari ini':p==='7d'?'7 Hari':p==='30d'?'30 Hari':'Custom'}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{width:145,fontSize:12}}/>
          <span style={{color:'var(--t3)',fontSize:12}}>s/d</span>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{width:145,fontSize:12}}/>
        </div>
        <select value={brand} onChange={e=>setBrand(e.target.value)} style={{width:160,fontSize:12}}>
          <option value="all">Semua Brand</option>
          {Object.values(BRANDS).map(b=><option key={b.id} value={b.id}>{b.label}</option>)}
        </select>
        <select value={division} onChange={e=>setDivision(e.target.value)} style={{width:160,fontSize:12}}>
          <option value="all">Semua Divisi</option>
          <option value="marketplace">Marketplace</option><option value="kol">KOL</option>
          <option value="live">Live</option><option value="konten">Konten</option><option value="cs_mp">CS MP</option>
        </select>
      </div>

      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10}}>
        {[['Total Omset',fRp(totals.gmv),'var(--y)'],['Total Order',fN(totals.orders),'var(--o)'],['Ads Spend',fRp(totals.spend),'var(--r)'],['KOL Sales',fRp(totals.kol),'var(--g)'],['Live Sales',fRp(totals.live),'var(--b)'],['Total Chat',fN(totals.chat),'#8B5CF6']].map(([l,v,c])=>(
          <div key={l} style={{background:'var(--bg2)',border:'1px solid var(--bo)',borderRadius:10,padding:'12px 14px'}}>
            <div style={{fontSize:10,color:'var(--t3)',marginBottom:3}}>{l}</div>
            <div style={{fontFamily:'var(--fd)',fontSize:16,fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{background:'var(--bg2)',border:'1px solid var(--bo)',borderRadius:14,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table className="tbl">
            <thead>
              <tr>
                {['Tanggal','Brand','Platform','Divisi','Omset','Order','Ads Spend','ROAS','Konten','Live Sales','Aff Sales','Chat'].map(h=>(
                  <th key={h} style={{textAlign:['Omset','Order','Ads Spend','ROAS','Konten','Live Sales','Aff Sales','Chat'].includes(h)?'right':'left',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,60).map((r,i)=>{
                const b=BRANDS[r.brand];const p=PLATFORMS[r.platform];
                const roas=r.data?.roas||(r.data?.ads_spend>0?(r.data?.gmv_total/r.data?.ads_spend).toFixed(2):'-');
                return(
                  <tr key={i}>
                    <td style={{color:'var(--t2)',whiteSpace:'nowrap',fontSize:11}}>{r.date}</td>
                    <td><div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:6,height:6,borderRadius:'50%',background:b?.color}}/><span style={{fontWeight:600,color:b?.color,fontSize:11}}>{b?.label}</span></div></td>
                    <td><span className="badge" style={{fontSize:10,background:(p?.accent||'#888')+'18',color:p?.accent||'#888',border:`1px solid ${p?.accent||'#888'}25`}}>{p?.label||r.platform}</span></td>
                    <td style={{color:'var(--t2)',textTransform:'capitalize',fontSize:11}}>{r.division}</td>
                    <td style={{textAlign:'right',fontWeight:700,fontSize:11}}>{fRp(r.data?.gmv_total)}</td>
                    <td style={{textAlign:'right',color:'var(--t2)',fontSize:11}}>{fN(r.data?.orders)}</td>
                    <td style={{textAlign:'right',color:'var(--t2)',fontSize:11}}>{fRp(r.data?.ads_spend)}</td>
                    <td style={{textAlign:'right',fontWeight:800,fontSize:11,color:+roas>=3?'var(--g)':+roas>=2?'var(--y)':'var(--r)'}}>{roas}x</td>
                    <td style={{textAlign:'right',color:'var(--t3)',fontSize:11}}>{r.data?.konten_upload||'-'}</td>
                    <td style={{textAlign:'right',fontSize:11}}>{fRp(r.data?.live_sales)}</td>
                    <td style={{textAlign:'right',fontSize:11}}>{fRp(r.data?.kol_sales)}</td>
                    <td style={{textAlign:'right',color:'var(--t2)',fontSize:11}}>{fN(r.data?.chat_masuk)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<div style={{textAlign:'center',padding:40,color:'var(--t3)',fontSize:13}}>Tidak ada data untuk filter yang dipilih.</div>}
        {filtered.length>60&&<div style={{textAlign:'center',padding:12,fontSize:11,color:'var(--t3)',borderTop:'1px solid var(--bo)'}}>Menampilkan 60 dari {filtered.length} data. Export CSV untuk data lengkap.</div>}
      </div>
    </div>
  );
}
