import React,{useMemo} from 'react';
import {useApp,BRANDS,PLATFORMS} from '../context/AppContext';
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from 'recharts';
import {Download,ExternalLink} from 'lucide-react';

const fRp=n=>'Rp '+new Intl.NumberFormat('id-ID',{notation:'compact',maximumFractionDigits:1}).format(n||0);
const fFull=n=>'Rp '+new Intl.NumberFormat('id-ID').format(n||0);
const fN=n=>new Intl.NumberFormat('id-ID',{notation:'compact',maximumFractionDigits:1}).format(n||0);

function dummy14(brandId){
  const data=[];const today=new Date();
  Object.keys(PLATFORMS).forEach(p=>{
    for(let d=13;d>=0;d--){
      const dt=new Date(today);dt.setDate(today.getDate()-d);
      const ds=dt.toISOString().split('T')[0];
      const base=p==='tiktok'?20:p==='shopee'?15:5;
      const gmv=Math.round((base+Math.random()*8)*1e6);
      const spend=Math.round(gmv*.18);
      data.push({id:`bd_${ds}_${brandId}_${p}`,date:ds,brand:brandId,platform:p,division:'marketplace',data:{gmv_total:gmv,ads_spend:spend,orders:Math.round(gmv/38000)}});
    }
  });
  return data;
}

export function BrandDetail(){
  const{activeBrand,setActiveBrand,reports,logoUrls}=useApp();
  const b=BRANDS[activeBrand];
  const dummy=useMemo(()=>dummy14(activeBrand),[activeBrand]);
  const allData=[...reports.filter(r=>r.brand===activeBrand),...dummy.filter(d=>!reports.find(r=>r.id===d.id))];
  const mp=allData.filter(r=>r.division==='marketplace');

  const totals={
    gmv:mp.reduce((s,r)=>s+(r.data?.gmv_total||0),0),
    orders:mp.reduce((s,r)=>s+(r.data?.orders||0),0),
    spend:mp.reduce((s,r)=>s+(r.data?.ads_spend||0),0),
  };
  totals.roas=totals.spend>0?(totals.gmv/totals.spend).toFixed(2):'-';

  const chart=useMemo(()=>{
    const days={};
    mp.forEach(r=>{
      if(!days[r.date])days[r.date]={date:r.date.slice(5),tiktok:0,shopee:0,meta:0};
      days[r.date][r.platform]=(days[r.date][r.platform]||0)+(r.data?.gmv_total||0);
    });
    return Object.values(days).sort((a,b)=>a.date>b.date?1:-1);
  },[mp]);

  const platStats=Object.keys(PLATFORMS).map(p=>{
    const d=mp.filter(r=>r.platform===p);
    const gmv=d.reduce((s,r)=>s+(r.data?.gmv_total||0),0);
    const spend=d.reduce((s,r)=>s+(r.data?.ads_spend||0),0);
    const orders=d.reduce((s,r)=>s+(r.data?.orders||0),0);
    return{platform:p,gmv,spend,orders,roas:spend>0?(gmv/spend).toFixed(2):'-',color:PLATFORMS[p].accent};
  });

  return(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
            <div style={{width:52,height:52,borderRadius:12,background:b.bg,border:`1px solid ${b.color}30`,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              {logoUrls[activeBrand]?<img src={logoUrls[activeBrand]} alt={b.label} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                :<span style={{fontFamily:'var(--fd)',fontSize:12,fontWeight:800,color:b.color}}>{b.label.split(' ').map(w=>w[0]).join('')}</span>}
            </div>
            <div>
              <h1 style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:800,letterSpacing:'-.02em',color:b.color}}>{b.label}</h1>
              <p style={{fontSize:12,color:'var(--t3)',marginTop:1}}>{b.tagline}</p>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:5}}>
          {Object.values(BRANDS).map(brand=>(
            <button key={brand.id} onClick={()=>setActiveBrand(brand.id)}
              style={{padding:'6px 13px',borderRadius:20,border:`1px solid ${brand.id===activeBrand?brand.color:'var(--bo)'}`,background:brand.id===activeBrand?brand.color+'18':'transparent',color:brand.id===activeBrand?brand.color:'var(--t2)',fontSize:12,fontWeight:brand.id===activeBrand?700:400,cursor:'pointer'}}>
              {brand.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {[['💰','Total GMV',fRp(totals.gmv),b.color],['📦','Total Order',fN(totals.orders),'var(--o)'],['📈','ROAS',totals.roas+'x','var(--g)'],['⚡','Ads Spend',fRp(totals.spend),'var(--r)']].map(([icon,l,v,c])=>(
          <div key={l} className="card" style={{borderTop:`2px solid ${c}`}}>
            <div style={{fontSize:18,marginBottom:7}}>{icon}</div>
            <div style={{fontSize:10,color:'var(--t3)',marginBottom:3}}>{l}</div>
            <div style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="sec-title">Trend GMV 14 Hari — {b.label}</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bo)"/>
            <XAxis dataKey="date" tick={{fontSize:10,fill:'var(--t3)'}}/>
            <YAxis tick={{fontSize:10,fill:'var(--t3)'}} tickFormatter={v=>fRp(v)}/>
            <Tooltip formatter={(v,n)=>[fFull(v),PLATFORMS[n]?.label||n]} contentStyle={{background:'var(--bg2)',border:'1px solid var(--bo)',borderRadius:8,fontSize:11}}/>
            <Line type="monotone" dataKey="tiktok" name="tiktok" stroke="#69C9D0" strokeWidth={2.5} dot={{r:2}}/>
            <Line type="monotone" dataKey="shopee" name="shopee" stroke="#EE4D2D" strokeWidth={2.5} dot={{r:2}}/>
            <Line type="monotone" dataKey="meta" name="meta" stroke="#1877F2" strokeWidth={2} strokeDasharray="4 4" dot={{r:2}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {platStats.map((p,i)=>(
          <div key={i} className="card" style={{borderLeft:`3px solid ${p.color}`}}>
            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:12}}>
              <span style={{fontSize:16}}>{PLATFORMS[p.platform].icon}</span>
              <span style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:13,color:p.color}}>{PLATFORMS[p.platform].label}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[['GMV',fRp(p.gmv)],['Orders',fN(p.orders)],['ROAS',p.roas+'x'],['Spend',fRp(p.spend)]].map(([l,v])=>(
                <div key={l}>
                  <div style={{fontSize:9,color:'var(--t3)'}}>{l}</div>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--t1)',marginTop:2}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SKU list */}
      <div className="card">
        <div className="sec-title">Daftar SKU Produk — {b.label}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:6}}>
          {b.skus.map((sku,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',background:'var(--bg3)',borderRadius:7}}>
              <div style={{width:18,height:18,borderRadius:4,background:b.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:b.color,flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:11,color:'var(--t1)'}}>{sku}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExportPage(){
  const{getReports}=useApp();
  const exportCSV=()=>{
    const data=getReports({});
    const h=['Tanggal','Brand','Platform','Divisi','GMV','Order','Ads Spend','ROAS'];
    const rows=data.map(r=>[r.date,r.brand,r.platform,r.division,r.data?.gmv_total||0,r.data?.orders||0,r.data?.ads_spend||0,r.data?.roas||'-']);
    const csv=[h,...rows].map(r=>r.join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`kml_export_${new Date().toISOString().split('T')[0]}.csv`;a.click();
  };

  return(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Export Data</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Download atau kirim data ke Google Spreadsheet</p></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,maxWidth:800}}>
        <div className="card">
          <div style={{fontSize:24,marginBottom:12}}>📥</div>
          <h3 style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:15,marginBottom:8}}>Download CSV / Excel</h3>
          <p style={{fontSize:12,color:'var(--t2)',lineHeight:1.6,marginBottom:16}}>Download semua data laporan dalam format CSV yang bisa dibuka langsung di Excel atau Google Sheets.</p>
          <button onClick={exportCSV} className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}><Download size={14}/>Download Semua Data</button>
        </div>
        <div className="card">
          <div style={{fontSize:24,marginBottom:12}}>📊</div>
          <h3 style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:15,marginBottom:8}}>Kirim ke Google Sheets</h3>
          <p style={{fontSize:12,color:'var(--t2)',lineHeight:1.6,marginBottom:12}}>Paste URL Google Apps Script untuk kirim data otomatis ke spreadsheet tim.</p>
          <input placeholder="https://script.google.com/macros/s/..." style={{fontSize:12,marginBottom:10}}/>
          <button className="btn btn-secondary" style={{width:'100%',justifyContent:'center'}}><ExternalLink size={14}/>Kirim ke Sheets</button>
        </div>
      </div>
      <div className="card" style={{maxWidth:800}}>
        <h3 style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:14,marginBottom:10}}>📖 Panduan Setup Google Sheets</h3>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {['Buka Google Spreadsheet → Extensions → Apps Script','Hapus semua kode yang ada → paste kode Apps Script dari halaman Laporan','Klik Deploy → New Deployment → Web App → Anyone → Deploy','Salin URL yang muncul → paste di kolom di atas → klik Kirim'].map((step,i)=>(
            <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
              <div style={{width:20,height:20,borderRadius:'50%',background:'var(--y)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#080809',flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:12,color:'var(--t2)',marginTop:2}}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
