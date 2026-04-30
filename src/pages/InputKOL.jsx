import React,{useState} from 'react';
import {useApp,BRANDS} from '../context/AppContext';
import {Plus,Trash2,Save,Check,ChevronDown,ChevronUp,Trophy} from 'lucide-react';

function Field({label,children}){return(<div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:10,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</label>{children}</div>);}
function Section({title,icon,color,children,open:def=true}){
  const[open,setOpen]=useState(def);
  return(<div className="card" style={{padding:0,overflow:'hidden'}}>
    <button onClick={()=>setOpen(!open)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'13px 18px',background:'transparent',border:'none',cursor:'pointer'}}>
      <div style={{width:26,height:26,borderRadius:7,background:color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{icon}</div>
      <span style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:13,color:'var(--t1)',flex:1,textAlign:'left'}}>{title}</span>
      {open?<ChevronUp size={14} color="var(--t3)"/>:<ChevronDown size={14} color="var(--t3)"/>}
    </button>
    {open&&<div style={{padding:'0 18px 18px',borderTop:'1px solid var(--bo)',paddingTop:16,display:'flex',flexDirection:'column',gap:14}}>{children}</div>}
  </div>);
}

export default function InputKOL(){
  const{addReport,activeBrand,setActiveBrand,today,user}=useApp();
  const[date,setDate]=useState(today());
  const[saved,setSaved]=useState(false);
  const[tiktok,setTiktok]=useState({kol_sales:'',active_kol:'',video_gmv:'',invitations:'',top10:[],affiliates:[]});
  const[shopee,setShopee]=useState({kol_sales:'',active_kol:'',video_gmv:'',invitations:'',top10:[],affiliates:[]});

  const addTop=(set)=>set(p=>({...p,top10:[...p.top10,{akun:'',gmv:''}]}));
  const remTop=(set,i)=>set(p=>({...p,top10:p.top10.filter((_,idx)=>idx!==i)}));
  const setTop=(set,i,k,v)=>set(p=>{const a=[...p.top10];a[i]={...a[i],[k]:v};return{...p,top10:a}});

  const addAff=(set)=>set(p=>({...p,affiliates:[...p.affiliates,{nama:'',akun:'',gmv:'',view:'',alamat:'',no_tlp:'',biaya:'',produk:''}]}));
  const remAff=(set,i)=>set(p=>({...p,affiliates:p.affiliates.filter((_,idx)=>idx!==i)}));
  const setAff=(set,i,k,v)=>set(p=>{const a=[...p.affiliates];a[i]={...a[i],[k]:v};return{...p,affiliates:a}});

  const save=()=>{
    [['tiktok',tiktok],['shopee',shopee]].forEach(([plat,d])=>{
      addReport({id:`kol_${date}_${activeBrand}_${plat}`,date,brand:activeBrand,platform:plat,division:'kol',data:{...d,kol_sales:+d.kol_sales||0},user:user?.name});
    });
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  };

  const KOLSection=({title,icon,color,data,set})=>(
    <Section title={title} icon={icon} color={color}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
        <Field label={`${title} Sales (Rp)`}><input type="number" value={data.kol_sales} onChange={e=>set(p=>({...p,kol_sales:e.target.value}))} placeholder="0"/></Field>
        <Field label="KOL/Affiliate Aktif"><input type="number" value={data.active_kol} onChange={e=>set(p=>({...p,active_kol:e.target.value}))} placeholder="0"/></Field>
        <Field label="Video Affiliate GMV"><input type="number" value={data.video_gmv} onChange={e=>set(p=>({...p,video_gmv:e.target.value}))} placeholder="0"/></Field>
        <Field label="Jumlah Invitation"><input type="number" value={data.invitations} onChange={e=>set(p=>({...p,invitations:e.target.value}))} placeholder="0"/></Field>
      </div>

      {/* Top 10 Affiliates */}
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}><Trophy size={13} color={color}/><span style={{fontSize:12,fontWeight:700,color:'var(--t2)'}}>10 Affiliate Terbaik</span></div>
          <button onClick={()=>addTop(set)} className="btn btn-secondary" style={{fontSize:11,padding:'4px 10px'}}><Plus size={11}/>Tambah</button>
        </div>
        {data.top10.length>0&&(
          <table className="tbl" style={{marginBottom:8}}>
            <thead><tr><th>#</th><th>Akun Affiliate</th><th style={{textAlign:'right'}}>GMV</th><th></th></tr></thead>
            <tbody>
              {data.top10.map((t,i)=>(
                <tr key={i}>
                  <td style={{color:i<3?color:'var(--t3)',fontWeight:800}}>{i+1}</td>
                  <td><input value={t.akun} onChange={e=>setTop(set,i,'akun',e.target.value)} placeholder="@akun" style={{fontSize:11,padding:'4px 8px',background:'transparent',border:'none',width:'100%',color:'var(--t1)'}}/></td>
                  <td><input type="number" value={t.gmv} onChange={e=>setTop(set,i,'gmv',e.target.value)} placeholder="0" style={{fontSize:11,padding:'4px 8px',background:'transparent',border:'none',width:'100%',textAlign:'right',color:color,fontWeight:700}}/></td>
                  <td><button onClick={()=>remTop(set,i)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--r)'}}><Trash2 size={12}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Affiliate pengiriman */}
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <span style={{fontSize:12,fontWeight:700,color:'var(--t2)'}}>Pengiriman Affiliasi ({data.affiliates.length})</span>
          <button onClick={()=>addAff(set)} className="btn btn-secondary" style={{fontSize:11,padding:'4px 10px'}}><Plus size={11}/>Tambah</button>
        </div>
        {data.affiliates.map((a,i)=>(
          <div key={i} style={{background:'var(--bg3)',borderRadius:9,padding:12,marginBottom:9,position:'relative'}}>
            <button onClick={()=>remAff(set,i)} style={{position:'absolute',top:10,right:10,background:'none',border:'none',cursor:'pointer',color:'var(--r)'}}><Trash2 size={12}/></button>
            <div style={{fontSize:10,fontWeight:700,color:'var(--o)',marginBottom:9}}>Afiliasi #{i+1}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {[['nama','Nama'],['akun','Nama Akun'],['no_tlp','No. Telepon'],['gmv','GMV (Rp)'],['view','Avg View VT'],['biaya','Biaya Endorse (Rp)'],['produk','Produk Dikirim'],['alamat','Alamat']].map(([k,l])=>(
                <Field key={k} label={l}><input value={a[k]||''} onChange={e=>setAff(set,i,k,e.target.value)} placeholder={l} style={{fontSize:11,padding:'6px 9px'}}/></Field>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Input KOL</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Data afiliasi dan KOL harian</p></div>
        <button onClick={save} className="btn btn-primary" style={{fontSize:13,padding:'9px 22px'}}>
          {saved?<><Check size={14}/>Tersimpan!</>:<><Save size={14}/>Simpan Data</>}
        </button>
      </div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',background:'var(--bg2)',borderRadius:12,padding:'14px 18px',border:'1px solid var(--bo)'}}>
        <Field label="Tanggal"><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:160}}/></Field>
        <Field label="Brand"><select value={activeBrand} onChange={e=>setActiveBrand(e.target.value)} style={{width:180}}>{Object.values(BRANDS).map(b=><option key={b.id} value={b.id}>{b.label}</option>)}</select></Field>
      </div>
      <KOLSection title="TikTok KOL" icon="🎵" color="#69C9D0" data={tiktok} set={setTiktok}/>
      <KOLSection title="Shopee KOL" icon="🛒" color="#EE4D2D" data={shopee} set={setShopee}/>
    </div>
  );
}
