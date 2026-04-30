import React,{useState} from 'react';
import {useApp,BRANDS} from '../context/AppContext';
import {Plus,Trash2,Save,Check,ChevronDown,ChevronUp} from 'lucide-react';

function Field({label,children}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:5}}>
      <label style={{fontSize:10,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</label>
      {children}
    </div>
  );
}

function Calc({label,value,color='var(--y)'}){
  return(
    <div style={{background:'var(--bg3)',borderRadius:9,padding:'10px 14px'}}>
      <div style={{fontSize:10,color:'var(--t3)',marginBottom:3}}>{label} (otomatis)</div>
      <div style={{fontFamily:'var(--fd)',fontSize:18,fontWeight:800,color}}>{value}</div>
    </div>
  );
}

function Section({title,icon,color,children,open:def=true}){
  const [open,setOpen]=useState(def);
  return(
    <div className="card" style={{padding:0,overflow:'hidden'}}>
      <button onClick={()=>setOpen(!open)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'13px 18px',background:'transparent',border:'none',cursor:'pointer'}}>
        <div style={{width:26,height:26,borderRadius:7,background:color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{icon}</div>
        <span style={{fontFamily:'var(--fd)',fontWeight:700,fontSize:13,color:'var(--t1)',flex:1,textAlign:'left'}}>{title}</span>
        {open?<ChevronUp size={14} color="var(--t3)"/>:<ChevronDown size={14} color="var(--t3)"/>}
      </button>
      {open&&<div style={{padding:'0 18px 18px',borderTop:'1px solid var(--bo)',display:'flex',flexDirection:'column',gap:14,paddingTop:16}}>{children}</div>}
    </div>
  );
}

const initPlat=()=>({ads_spend:'',gmv_total:'',gmv_live:'',gmv_affiliate:'',gmv_konten:'',gmv_shop_lain:'',visitors:'',buyers:'',orders:'',products:[]});

export default function InputMarketplace(){
  const {addReport,activeBrand,setActiveBrand,today,user}=useApp();
  const [date,setDate]=useState(today());
  const [saved,setSaved]=useState(false);
  const [tiktok,setTiktok]=useState(initPlat());
  const [shopee,setShopee]=useState(initPlat());
  const [meta,setMeta]=useState({ads_spend:'',leads:'',closing:'',omset:''});

  const brand=BRANDS[activeBrand];
  const skus=brand.skus||[];

  const calc=d=>{
    const gmv=+d.gmv_total||0,spend=+d.ads_spend||0,buyers=+d.buyers||0;
    return{aov:buyers>0?Math.round(gmv/buyers):0,roas:spend>0?(gmv/spend).toFixed(2):'-'};
  };

  const addProd=set=>set(p=>({...p,products:[...p.products,{sku:'',nama:'',pesanan:'',rupiah:''}]}));
  const remProd=(set,i)=>set(p=>({...p,products:p.products.filter((_,idx)=>idx!==i)}));
  const setProd=(set,i,k,v)=>set(p=>{const a=[...p.products];a[i]={...a[i],[k]:v};return{...p,products:a}});

  const save=()=>{
    [['tiktok',tiktok],['shopee',shopee]].forEach(([plat,d])=>{
      const{aov,roas}=calc(d);
      addReport({id:`mp_${date}_${activeBrand}_${plat}`,date,brand:activeBrand,platform:plat,division:'marketplace',
        data:{...d,aov,roas:+roas||0,gmv_total:+d.gmv_total||0,ads_spend:+d.ads_spend||0,orders:+d.orders||0,buyers:+d.buyers||0,visitors:+d.visitors||0},user:user?.name});
    });
    addReport({id:`mp_${date}_${activeBrand}_meta`,date,brand:activeBrand,platform:'meta',division:'marketplace',
      data:{ads_spend:+meta.ads_spend||0,gmv_total:+meta.omset||0,orders:+meta.closing||0,leads:+meta.leads||0},user:user?.name});
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  };

  const PlatSection=({title,icon,color,data,set})=>{
    const{aov,roas}=calc(data);
    const fmtAOV='Rp '+aov.toLocaleString('id-ID');
    return(
      <Section title={title} icon={icon} color={color}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          <Field label="Ads Spend (Rp)"><input type="number" value={data.ads_spend} onChange={e=>set(p=>({...p,ads_spend:e.target.value}))} placeholder="0"/></Field>
          <Field label="GMV Total (Rp)"><input type="number" value={data.gmv_total} onChange={e=>set(p=>({...p,gmv_total:e.target.value}))} placeholder="0"/></Field>
          <Field label="GMV Live (Rp)"><input type="number" value={data.gmv_live} onChange={e=>set(p=>({...p,gmv_live:e.target.value}))} placeholder="0"/></Field>
          <Field label="GMV Affiliasi (Rp)"><input type="number" value={data.gmv_affiliate} onChange={e=>set(p=>({...p,gmv_affiliate:e.target.value}))} placeholder="0"/></Field>
          <Field label="GMV Konten (Rp)"><input type="number" value={data.gmv_konten} onChange={e=>set(p=>({...p,gmv_konten:e.target.value}))} placeholder="0"/></Field>
          <Field label="GMV Shop Lain (Rp)"><input type="number" value={data.gmv_shop_lain} onChange={e=>set(p=>({...p,gmv_shop_lain:e.target.value}))} placeholder="0"/></Field>
          <Field label="Total Pengunjung"><input type="number" value={data.visitors} onChange={e=>set(p=>({...p,visitors:e.target.value}))} placeholder="0"/></Field>
          <Field label="Total Pembeli"><input type="number" value={data.buyers} onChange={e=>set(p=>({...p,buyers:e.target.value}))} placeholder="0"/></Field>
          <Field label="Total Pesanan"><input type="number" value={data.orders} onChange={e=>set(p=>({...p,orders:e.target.value}))} placeholder="0"/></Field>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Calc label="AOV (GMV / Pembeli)" value={fmtAOV} color={color}/>
          <Calc label="ROAS (GMV / Spend)" value={roas+'x'} color={color}/>
        </div>

        {/* Products with SKU */}
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <span style={{fontSize:11,fontWeight:700,color:'var(--t2)'}}>Rincian Pesanan ({data.products.length} produk)</span>
            <button onClick={()=>addProd(set)} className="btn btn-secondary" style={{fontSize:11,padding:'5px 10px'}}><Plus size={11}/>Tambah Produk</button>
          </div>
          {data.products.map((p,i)=>(
            <div key={i} style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr 32px',gap:8,marginBottom:8,alignItems:'end'}}>
              <Field label={i===0?'Pilih SKU / Nama Produk':''}>
                <div style={{position:'relative'}}>
                  <select value={p.sku} onChange={e=>{
                    const val=e.target.value;
                    setProd(set,i,'sku',val);
                    if(val)setProd(set,i,'nama',val);
                  }} style={{fontSize:12}}>
                    <option value="">-- Pilih SKU --</option>
                    {skus.map(s=><option key={s} value={s}>{s}</option>)}
                    <option value="custom">Ketik manual...</option>
                  </select>
                </div>
                {(p.sku==='custom'||!p.sku)&&<input value={p.nama} onChange={e=>setProd(set,i,'nama',e.target.value)} placeholder="Nama produk" style={{fontSize:12,marginTop:4}}/>}
              </Field>
              <Field label={i===0?'Pesanan (pcs)':''}><input type="number" value={p.pesanan} onChange={e=>setProd(set,i,'pesanan',e.target.value)} placeholder="0" style={{fontSize:12}}/></Field>
              <Field label={i===0?'Total Rupiah (Rp)':''}><input type="number" value={p.rupiah} onChange={e=>setProd(set,i,'rupiah',e.target.value)} placeholder="0" style={{fontSize:12}}/></Field>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {i===0&&<label style={{fontSize:10,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.05em'}}>Harga Satuan</label>}
                <div style={{background:'var(--bg3)',borderRadius:7,padding:'9px 10px',fontSize:12,color:'var(--y)',fontWeight:700}}>
                  {p.pesanan>0&&p.rupiah>0?'Rp '+Math.round(+p.rupiah/+p.pesanan).toLocaleString('id-ID'):'—'}
                </div>
              </div>
              <button onClick={()=>remProd(set,i)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--r)',padding:'8px 0'}}><Trash2 size={13}/></button>
            </div>
          ))}
        </div>
      </Section>
    );
  };

  return(
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Marketplace Optimizer</h1>
          <p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Data penjualan & iklan per platform</p>
        </div>
        <button onClick={save} className="btn btn-primary" style={{fontSize:13,padding:'9px 22px'}}>
          {saved?<><Check size={14}/>Tersimpan!</>:<><Save size={14}/>Simpan Data</>}
        </button>
      </div>

      <div style={{display:'flex',gap:12,flexWrap:'wrap',background:'var(--bg2)',borderRadius:12,padding:'14px 18px',border:'1px solid var(--bo)'}}>
        <Field label="Tanggal"><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:160}}/></Field>
        <Field label="Brand">
          <select value={activeBrand} onChange={e=>setActiveBrand(e.target.value)} style={{width:180}}>
            {Object.values(BRANDS).map(b=><option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </Field>
        <div style={{display:'flex',alignItems:'flex-end',gap:6,paddingBottom:2}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:brand.color,marginBottom:2}}/>
          <span style={{fontSize:12,color:brand.color,fontWeight:700}}>{brand.label}</span>
          <span style={{fontSize:10,color:'var(--t3)',marginLeft:4}}>{brand.skus.length} SKU tersedia</span>
        </div>
      </div>

      <PlatSection title="TikTok Shop" icon="🎵" color="#69C9D0" data={tiktok} set={setTiktok}/>
      <PlatSection title="Shopee" icon="🛒" color="#EE4D2D" data={shopee} set={setShopee}/>

      <Section title="Meta / Reseller" icon="📘" color="#1877F2">
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
          <Field label="Meta Ads Spend (Rp)"><input type="number" value={meta.ads_spend} onChange={e=>setMeta(p=>({...p,ads_spend:e.target.value}))} placeholder="0"/></Field>
          <Field label="Leads Masuk"><input type="number" value={meta.leads} onChange={e=>setMeta(p=>({...p,leads:e.target.value}))} placeholder="0"/></Field>
          <Field label="Closing (Pembeli)"><input type="number" value={meta.closing} onChange={e=>setMeta(p=>({...p,closing:e.target.value}))} placeholder="0"/></Field>
          <Field label="Omset (Rp)"><input type="number" value={meta.omset} onChange={e=>setMeta(p=>({...p,omset:e.target.value}))} placeholder="0"/></Field>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          <Calc label="Cost Per Lead" value={'Rp '+(meta.leads>0?Math.round(+meta.ads_spend/+meta.leads).toLocaleString('id-ID'):0)} color="#1877F2"/>
          <Calc label="Cost Per Closing" value={'Rp '+(meta.closing>0?Math.round(+meta.ads_spend/+meta.closing).toLocaleString('id-ID'):0)} color="#1877F2"/>
          <Calc label="Closing Rate" value={(meta.leads>0?((+meta.closing/+meta.leads)*100).toFixed(1):0)+'%'} color="#1877F2"/>
        </div>
      </Section>
    </div>
  );
}
