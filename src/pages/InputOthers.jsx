import React,{useState} from 'react';
import {useApp,BRANDS} from '../context/AppContext';
import {Plus,Trash2,Save,Check} from 'lucide-react';

function Field({label,children}){return(<div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:10,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</label>{children}</div>);}
function Card({title,icon,color,children}){
  return(<div className="card" style={{padding:0,overflow:'hidden'}}>
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'13px 18px',borderBottom:'1px solid var(--bo)'}}>
      <div style={{width:26,height:26,borderRadius:7,background:color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{icon}</div>
      <span style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:13,color:'var(--t1)'}}>{title}</span>
    </div>
    <div style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:12}}>{children}</div>
  </div>);
}
function MetaBar({brand,date,setter}){
  return(<div style={{display:'flex',gap:12,flexWrap:'wrap',background:'var(--bg2)',borderRadius:12,padding:'14px 18px',border:'1px solid var(--bo)'}}>
    <Field label="Tanggal"><input type="date" value={date} onChange={e=>setter('date',e.target.value)} style={{width:160}}/></Field>
    <Field label="Brand"><select value={brand} onChange={e=>setter('brand',e.target.value)} style={{width:180}}>{Object.values(BRANDS).map(b=><option key={b.id} value={b.id}>{b.label}</option>)}</select></Field>
  </div>);
}

// ===== CS MP =====
export function InputCSMP(){
  const{addReport,activeBrand,setActiveBrand,today,user}=useApp();
  const[date,setDate]=useState(today());
  const[saved,setSaved]=useState(false);
  const[data,setData]=useState({tiktok_chat:'',shopee_chat:'',meta_chat:'',komplain:[]});

  const addK=()=>setData(p=>({...p,komplain:[...p.komplain,{nama_akun:'',komplain:'',tgl_order:''}]}));
  const remK=i=>setData(p=>({...p,komplain:p.komplain.filter((_,idx)=>idx!==i)}));
  const setK=(i,k,v)=>setData(p=>{const a=[...p.komplain];a[i]={...a[i],[k]:v};return{...p,komplain:a}});

  const save=()=>{
    ['tiktok','shopee','meta'].forEach(plat=>{
      addReport({id:`csmp_${date}_${activeBrand}_${plat}`,date,brand:activeBrand,platform:plat,division:'cs_mp',
        data:{chat_masuk:+data[`${plat}_chat`]||0,komplain:data.komplain},user:user?.name});
    });
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  };

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Input CS Marketplace</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Data chat & komplain customer</p></div>
        <button onClick={save} className="btn btn-primary" style={{fontSize:13,padding:'9px 22px'}}>{saved?<><Check size={14}/>Tersimpan!</>:<><Save size={14}/>Simpan</>}</button>
      </div>
      <MetaBar brand={activeBrand} date={date} setter={(k,v)=>{if(k==='date')setDate(v);else setActiveBrand(v)}}/>

      <Card title="Jumlah Chat Masuk per Platform" icon="💬" color="var(--b)">
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          <Field label="TikTok Chat Masuk"><input type="number" value={data.tiktok_chat} onChange={e=>setData(p=>({...p,tiktok_chat:e.target.value}))} placeholder="0"/></Field>
          <Field label="Shopee Chat Masuk"><input type="number" value={data.shopee_chat} onChange={e=>setData(p=>({...p,shopee_chat:e.target.value}))} placeholder="0"/></Field>
          <Field label="Meta Chat Masuk"><input type="number" value={data.meta_chat} onChange={e=>setData(p=>({...p,meta_chat:e.target.value}))} placeholder="0"/></Field>
        </div>
      </Card>

      <Card title="Komplain Customer" icon="⚠️" color="var(--r)">
        <div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={addK} className="btn btn-secondary" style={{fontSize:11,padding:'5px 10px'}}><Plus size={11}/>Tambah Komplain</button></div>
        {data.komplain.length>0&&(
          <table className="tbl">
            <thead><tr><th>Nama Akun</th><th>Komplain</th><th>Tanggal Order</th><th></th></tr></thead>
            <tbody>
              {data.komplain.map((k,i)=>(
                <tr key={i}>
                  <td><input value={k.nama_akun} onChange={e=>setK(i,'nama_akun',e.target.value)} placeholder="@akun" style={{fontSize:11,padding:'4px 8px',background:'transparent',border:'none',color:'var(--t1)',width:'100%'}}/></td>
                  <td><input value={k.komplain} onChange={e=>setK(i,'komplain',e.target.value)} placeholder="Deskripsi" style={{fontSize:11,padding:'4px 8px',background:'transparent',border:'none',color:'var(--t1)',width:'100%'}}/></td>
                  <td><input type="date" value={k.tgl_order} onChange={e=>setK(i,'tgl_order',e.target.value)} style={{fontSize:11,padding:'4px 8px',background:'transparent',border:'none',color:'var(--t2)',width:'100%'}}/></td>
                  <td><button onClick={()=>remK(i)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--r)'}}><Trash2 size={12}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data.komplain.length===0&&<div style={{textAlign:'center',padding:'20px',color:'var(--t3)',fontSize:12}}>Belum ada komplain. Klik "+ Tambah Komplain" jika ada.</div>}
      </Card>
    </div>
  );
}

// ===== KONTEN =====
export function InputKonten(){
  const{addReport,activeBrand,setActiveBrand,today,user}=useApp();
  const[date,setDate]=useState(today());
  const[saved,setSaved]=useState(false);
  const[posts,setPosts]=useState([]);

  const add=()=>setPosts(p=>[...p,{platform:'tiktok',jam:'',jenis:'',link:''}]);
  const rem=i=>setPosts(p=>p.filter((_,idx)=>idx!==i));
  const set=(i,k,v)=>setPosts(p=>{const a=[...p];a[i]={...a[i],[k]:v};return a});

  const save=()=>{
    ['tiktok','shopee','instagram','meta'].forEach(plat=>{
      const pp=posts.filter(p=>p.platform===plat);
      if(pp.length>0)addReport({id:`konten_${date}_${activeBrand}_${plat}`,date,brand:activeBrand,platform:plat,division:'konten',data:{posts:pp,total_upload:pp.length},user:user?.name});
    });
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  };

  const counts={tiktok:posts.filter(p=>p.platform==='tiktok').length,shopee:posts.filter(p=>p.platform==='shopee').length,instagram:posts.filter(p=>p.platform==='instagram').length,meta:posts.filter(p=>p.platform==='meta').length};

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Input Konten</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Data upload konten harian per platform</p></div>
        <button onClick={save} className="btn btn-primary" style={{fontSize:13,padding:'9px 22px'}}>{saved?<><Check size={14}/>Tersimpan!</>:<><Save size={14}/>Simpan</>}</button>
      </div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',background:'var(--bg2)',borderRadius:12,padding:'14px 18px',border:'1px solid var(--bo)',alignItems:'flex-end'}}>
        <Field label="Tanggal"><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:160}}/></Field>
        <Field label="Brand"><select value={activeBrand} onChange={e=>setActiveBrand(e.target.value)} style={{width:180}}>{Object.values(BRANDS).map(b=><option key={b.id} value={b.id}>{b.label}</option>)}</select></Field>
        <div style={{display:'flex',gap:8,paddingBottom:2}}>
          {[['tiktok','#69C9D0','TT'],['shopee','#EE4D2D','SP'],['instagram','#E1306C','IG'],['meta','#1877F2','FB']].map(([p,c,l])=>(
            <span key={p} className="badge" style={{background:c+'18',color:c,border:`1px solid ${c}30`}}>{l}: {counts[p]}</span>
          ))}
        </div>
      </div>

      <Card title="Daftar Konten Upload" icon="🎬" color="var(--o)">
        <div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={add} className="btn btn-secondary" style={{fontSize:11,padding:'5px 10px'}}><Plus size={11}/>Tambah Konten</button></div>
        {posts.map((p,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'120px 100px 150px 1fr 32px',gap:8,alignItems:'end'}}>
            <Field label={i===0?'Platform':''}>
              <select value={p.platform} onChange={e=>set(i,'platform',e.target.value)} style={{fontSize:12,padding:'6px 8px'}}>
                <option value="tiktok">TikTok</option><option value="shopee">Shopee</option>
                <option value="instagram">Instagram</option><option value="meta">Meta</option>
              </select>
            </Field>
            <Field label={i===0?'Jam Post':''}><input type="time" value={p.jam} onChange={e=>set(i,'jam',e.target.value)} style={{fontSize:12}}/></Field>
            <Field label={i===0?'Jenis Konten':''}>
              <select value={p.jenis} onChange={e=>set(i,'jenis',e.target.value)} style={{fontSize:12,padding:'6px 8px'}}>
                <option value="">Pilih jenis</option>
                <option>Review Produk</option><option>Tutorial</option><option>Unboxing</option>
                <option>Testimoni</option><option>Promo/Diskon</option><option>Edukasi</option>
                <option>Entertainment</option><option>Behind The Scenes</option><option>Lainnya</option>
              </select>
            </Field>
            <Field label={i===0?'Link Konten':''}><input value={p.link} onChange={e=>set(i,'link',e.target.value)} placeholder="https://..." style={{fontSize:12}}/></Field>
            <button onClick={()=>rem(i)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--r)',padding:'8px 0'}}><Trash2 size={13}/></button>
          </div>
        ))}
        {posts.length===0&&<div style={{textAlign:'center',padding:'24px',color:'var(--t3)',fontSize:12}}>Belum ada konten. Klik "+ Tambah Konten" untuk mulai.</div>}
      </Card>
    </div>
  );
}

// ===== LIVE =====
export function InputLive(){
  const{addReport,activeBrand,setActiveBrand,today,user}=useApp();
  const[date,setDate]=useState(today());
  const[saved,setSaved]=useState(false);
  const initLive=()=>({sales:'',spend:'',jam:'',durasi:'',viewer:'',pembeli:'',host:''});
  const[tiktok,setTiktok]=useState(initLive());
  const[shopee,setShopee]=useState(initLive());

  const save=()=>{
    [['tiktok',tiktok],['shopee',shopee]].forEach(([plat,d])=>{
      addReport({id:`live_${date}_${activeBrand}_${plat}`,date,brand:activeBrand,platform:plat,division:'live',
        data:{gmv_total:+d.sales||0,ads_spend:+d.spend||0,jam:d.jam,durasi:+d.durasi||0,viewer:+d.viewer||0,pembeli:+d.pembeli||0,host:d.host},user:user?.name});
    });
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  };

  const LiveCard=({title,icon,color,data,set})=>{
    const roas=+data.spend>0?(+data.sales/+data.spend).toFixed(2):'-';
    const cr=+data.viewer>0?((+data.pembeli/+data.viewer)*100).toFixed(1):0;
    return(
      <Card title={title} icon={icon} color={color}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
          <Field label="Live Sales (Rp)"><input type="number" value={data.sales} onChange={e=>set(p=>({...p,sales:e.target.value}))} placeholder="0"/></Field>
          <Field label="Ads Spend (Rp)"><input type="number" value={data.spend} onChange={e=>set(p=>({...p,spend:e.target.value}))} placeholder="0"/></Field>
          <Field label="Jam Live"><input type="time" value={data.jam} onChange={e=>set(p=>({...p,jam:e.target.value}))}/></Field>
          <Field label="Durasi (menit)"><input type="number" value={data.durasi} onChange={e=>set(p=>({...p,durasi:e.target.value}))} placeholder="60"/></Field>
          <Field label="Total Viewer"><input type="number" value={data.viewer} onChange={e=>set(p=>({...p,viewer:e.target.value}))} placeholder="0"/></Field>
          <Field label="Total Pembeli"><input type="number" value={data.pembeli} onChange={e=>set(p=>({...p,pembeli:e.target.value}))} placeholder="0"/></Field>
          <Field label="Nama Host"><input value={data.host} onChange={e=>set(p=>({...p,host:e.target.value}))} placeholder="Nama host"/></Field>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div style={{background:'var(--bg3)',borderRadius:9,padding:'10px 14px'}}>
            <div style={{fontSize:10,color:'var(--t3)',marginBottom:3}}>ROAS Live (otomatis)</div>
            <div style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:800,color}}>{roas}x</div>
          </div>
          <div style={{background:'var(--bg3)',borderRadius:9,padding:'10px 14px'}}>
            <div style={{fontSize:10,color:'var(--t3)',marginBottom:3}}>Conversion Rate (otomatis)</div>
            <div style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:800,color}}>{cr}%</div>
          </div>
        </div>
      </Card>
    );
  };

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Input Live</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Data live streaming harian per platform</p></div>
        <button onClick={save} className="btn btn-primary" style={{fontSize:13,padding:'9px 22px'}}>{saved?<><Check size={14}/>Tersimpan!</>:<><Save size={14}/>Simpan</>}</button>
      </div>
      <MetaBar brand={activeBrand} date={date} setter={(k,v)=>{if(k==='date')setDate(v);else setActiveBrand(v)}}/>
      <LiveCard title="TikTok Live" icon="🎵" color="#69C9D0" data={tiktok} set={setTiktok}/>
      <LiveCard title="Shopee Live" icon="🛒" color="#EE4D2D" data={shopee} set={setShopee}/>
    </div>
  );
}
