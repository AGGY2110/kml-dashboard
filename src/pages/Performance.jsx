import React,{useState} from 'react';
import {useApp,BRANDS,PLATFORMS} from '../context/AppContext';
import {LineChart,Line,BarChart,Bar,PieChart,Pie,Cell,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend} from 'recharts';
import {Trophy,Target,TrendingUp,Award,Lightbulb,AlertCircle,CheckCircle} from 'lucide-react';

const fRp=n=>'Rp '+new Intl.NumberFormat('id-ID',{notation:'compact',maximumFractionDigits:1}).format(n||0);

const DAILY=Array.from({length:14},(_,i)=>{
  const d=new Date();d.setDate(d.getDate()-(13-i));
  return{date:d.toISOString().slice(5,10),ngaciin:Math.round((10+Math.random()*8)*1e6),zonanyam:Math.round((18+Math.random()*10)*1e6),sentral_basreng:Math.round((14+Math.random()*9)*1e6)};
});
const TARGETS=[
  {brand:'ngaciin',target:200,real:165,color:'#FF6B35'},
  {brand:'zonanyam',target:350,real:320,color:'#F5C518'},
  {brand:'sentral_basreng',target:280,real:250,color:'#E63946'},
];
const PLAT_RANK=[
  {name:'TikTok',gmv:185,spend:44,roas:4.12,orders:8451,color:'#69C9D0'},
  {name:'Shopee',gmv:122,spend:38,roas:3.21,orders:5689,color:'#EE4D2D'},
  {name:'Meta',gmv:44,spend:14,roas:2.61,orders:1828,color:'#1877F2'},
];
const TOP_KOL=[
  {nama:'@snacklover.id',brand:'zonanyam',gmv:42e6,video:8,followers:'128K'},
  {nama:'@foodies.bdg',brand:'ngaciin',gmv:38e6,video:6,followers:'95K'},
  {nama:'@jajanmalam.id',brand:'sentral_basreng',gmv:35e6,video:7,followers:'210K'},
  {nama:'@cemilancemill',brand:'zonanyam',gmv:28e6,video:5,followers:'67K'},
  {nama:'@pedas.lovers',brand:'ngaciin',gmv:22e6,video:4,followers:'44K'},
];
const TOP_PRODS=[
  {nama:'Basreng Original 400gr',brand:'sentral_basreng',terjual:2450,omset:24.5e6},
  {nama:'Basreng Pedas 400gr',brand:'sentral_basreng',terjual:2120,omset:21.2e6},
  {nama:'Cimin Balado',brand:'ngaciin',terjual:1890,omset:18.9e6},
  {nama:'Topoki Cheese 1',brand:'zonanyam',terjual:1650,omset:16.5e6},
  {nama:'Baso Aci Ayam Mercon',brand:'ngaciin',terjual:1420,omset:14.2e6},
];
const TOP_HOSTS=[
  {nama:'Rudi',platform:'tiktok',brand:'zonanyam',sales:85e6,sessions:12},
  {nama:'Sari',platform:'shopee',brand:'sentral_basreng',sales:72e6,sessions:10},
  {nama:'Budi',platform:'tiktok',brand:'ngaciin',sales:65e6,sessions:14},
];

export function Performance(){
  const{targets,setTargets}=useApp();
  return(
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Performance</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Analisis kinerja brand, platform, dan tim</p></div>

      {/* Target vs realisasi */}
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}><Target size={15} color="var(--y)"/><div className="sec-title" style={{margin:0}}>Target vs Realisasi (Juta Rp)</div></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
          {TARGETS.map((t,i)=>{
            const pct=Math.round((t.real/t.target)*100);
            return(
              <div key={i} style={{background:'var(--bg3)',borderRadius:10,padding:'14px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <span style={{fontSize:12,fontWeight:700,color:t.color}}>{BRANDS[t.brand]?.label}</span>
                  <span style={{fontSize:13,fontWeight:800,color:pct>=100?'var(--g)':pct>=80?'var(--y)':'var(--r)'}}>{pct}%</span>
                </div>
                <div style={{height:7,background:'var(--bo)',borderRadius:4,overflow:'hidden',marginBottom:8}}>
                  <div style={{height:'100%',width:Math.min(pct,100)+'%',background:t.color,borderRadius:4,transition:'width .8s ease'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--t3)'}}>
                  <span>Realisasi: {t.real}jt</span><span>Target: {t.target}jt</span>
                </div>
              </div>
            );
          })}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={TARGETS} layout="vertical" margin={{left:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bo)" horizontal={false}/>
            <XAxis type="number" tick={{fontSize:10,fill:'var(--t3)'}} tickFormatter={v=>v+'jt'}/>
            <YAxis type="category" dataKey="brand" tick={{fontSize:11,fill:'var(--t2)'}} tickFormatter={v=>BRANDS[v]?.label||v} width={110}/>
            <Tooltip formatter={v=>fRp(v*1e6)} contentStyle={{background:'var(--bg2)',border:'1px solid var(--bo)',borderRadius:8,fontSize:11}}/>
            <Bar dataKey="target" name="Target" fill="var(--bo)" radius={[0,4,4,0]}/>
            <Bar dataKey="real" name="Realisasi" radius={[0,4,4,0]}>{TARGETS.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily trend */}
      <div className="card">
        <div className="sec-title">Pertumbuhan Harian 14 Hari</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={DAILY}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bo)"/>
            <XAxis dataKey="date" tick={{fontSize:10,fill:'var(--t3)'}}/>
            <YAxis tick={{fontSize:10,fill:'var(--t3)'}} tickFormatter={v=>fRp(v)}/>
            <Tooltip formatter={(v,n)=>[fRp(v),BRANDS[n]?.label||n]} contentStyle={{background:'var(--bg2)',border:'1px solid var(--bo)',borderRadius:8,fontSize:11}}/>
            <Legend wrapperStyle={{fontSize:11}} formatter={v=>BRANDS[v]?.label||v}/>
            <Line type="monotone" dataKey="ngaciin" stroke={BRANDS.ngaciin.color} strokeWidth={2.5} dot={false}/>
            <Line type="monotone" dataKey="zonanyam" stroke={BRANDS.zonanyam.color} strokeWidth={2.5} dot={false}/>
            <Line type="monotone" dataKey="sentral_basreng" stroke={BRANDS.sentral_basreng.color} strokeWidth={2.5} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Platform ranking */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:14}}><Trophy size={14} color="var(--y)"/><div className="sec-title" style={{margin:0}}>Ranking Platform</div></div>
          {PLAT_RANK.map((p,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<PLAT_RANK.length-1?'1px solid var(--bo)':''}}>
              <div style={{width:26,height:26,borderRadius:7,background:p.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--fd)',fontWeight:800,fontSize:13,color:p.color}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:12,color:'var(--t1)'}}>{p.name}</div>
                <div style={{fontSize:10,color:'var(--t3)'}}>Spend: Rp{p.spend}jt · ROAS: {p.roas}x</div>
              </div>
              <div style={{fontFamily:'var(--fd)',fontSize:14,fontWeight:800,color:p.color}}>Rp{p.gmv}jt</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="sec-title">Kontribusi Platform</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PLAT_RANK.map(p=>({name:p.name,value:p.gmv,color:p.color}))} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={3}>
                {PLAT_RANK.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'var(--bg2)',border:'1px solid var(--bo)',borderRadius:8,fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',gap:14,justifyContent:'center',marginTop:8}}>
            {PLAT_RANK.map((p,i)=>{const tot=PLAT_RANK.reduce((s,x)=>s+x.gmv,0);return(
              <div key={i} style={{display:'flex',alignItems:'center',gap:5}}>
                <div style={{width:7,height:7,borderRadius:2,background:p.color}}/>
                <span style={{fontSize:10,color:'var(--t2)'}}>{p.name}</span>
                <span style={{fontSize:10,fontWeight:700,color:p.color}}>{((p.gmv/tot)*100).toFixed(0)}%</span>
              </div>
            )})}
          </div>
        </div>
      </div>

      {/* Top KOL & Products */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:14}}><Award size={14} color="var(--y)"/><div className="sec-title" style={{margin:0}}>Top KOL</div></div>
          {TOP_KOL.map((k,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<TOP_KOL.length-1?'1px solid var(--bo)':''}}>
              <div style={{width:20,height:20,borderRadius:5,background:BRANDS[k.brand]?.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:BRANDS[k.brand]?.color}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--t1)'}}>{k.nama}</div>
                <div style={{fontSize:10,color:'var(--t3)'}}>{BRANDS[k.brand]?.label} · {k.video} video · {k.followers}</div>
              </div>
              <div style={{fontSize:12,fontWeight:800,color:BRANDS[k.brand]?.color}}>{fRp(k.gmv)}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:14}}><TrendingUp size={14} color="var(--g)"/><div className="sec-title" style={{margin:0}}>Top Produk Terlaris</div></div>
          {TOP_PRODS.map((p,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<TOP_PRODS.length-1?'1px solid var(--bo)':''}}>
              <div style={{width:20,height:20,borderRadius:5,background:BRANDS[p.brand]?.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:BRANDS[p.brand]?.color}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:'var(--t1)'}}>{p.nama}</div>
                <div style={{fontSize:10,color:'var(--t3)'}}>{BRANDS[p.brand]?.label} · {p.terjual.toLocaleString('id-ID')} terjual</div>
              </div>
              <div style={{fontSize:12,fontWeight:800,color:'var(--g)'}}>{fRp(p.omset)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Live Hosts */}
      <div className="card">
        <div className="sec-title">🎙️ Top Live Host</div>
        <table className="tbl">
          <thead><tr><th>#</th><th>Nama Host</th><th>Platform</th><th>Brand</th><th style={{textAlign:'right'}}>Live Sales</th><th style={{textAlign:'right'}}>Sessions</th></tr></thead>
          <tbody>
            {TOP_HOSTS.map((h,i)=>(
              <tr key={i}>
                <td style={{fontWeight:800,color:i===0?'var(--y)':'var(--t3)'}}>{i+1}</td>
                <td style={{fontWeight:700}}>{h.nama}</td>
                <td><span className="badge" style={{background:PLATFORMS[h.platform]?.accent+'18',color:PLATFORMS[h.platform]?.accent}}>{PLATFORMS[h.platform]?.label}</span></td>
                <td style={{color:BRANDS[h.brand]?.color,fontWeight:700}}>{BRANDS[h.brand]?.label}</td>
                <td style={{textAlign:'right',fontWeight:800,color:'var(--g)'}}>{fRp(h.sales)}</td>
                <td style={{textAlign:'right',color:'var(--t2)'}}>{h.sessions}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== ANALISIS =====
const INSIGHTS=[
  {type:'good',text:'ROAS TikTok minggu ini meningkat 15% dibanding minggu lalu. TikTok adalah platform paling efisien saat ini.'},
  {type:'good',text:'GMV Zona Nyam naik 32.8% — pertumbuhan tertinggi di antara semua brand. Strategi afiliasi berjalan sangat baik.'},
  {type:'tip',text:'Shopee memiliki konversi rendah (1.2%) dibanding TikTok (3.8%). Perlu review halaman produk, foto, dan harga di Shopee.'},
  {type:'bad',text:'ROI Meta Ads turun di bawah 2x untuk Sentral Basreng. Evaluasi targeting dan creative iklan Meta.'},
  {type:'tip',text:'Live streaming Shopee belum optimal. Coba jadwal live di jam 19:00-21:00 untuk meningkatkan viewer.'},
  {type:'good',text:'Konten KOL berhasil menghasilkan 40% dari total GMV TikTok. Top performer adalah @snacklover.id.'},
];

export function Analisis(){
  const col={good:'var(--g)',bad:'var(--r)',tip:'var(--y)',info:'var(--b)'};
  const ic={good:<CheckCircle size={14}/>,bad:<AlertCircle size={14}/>,tip:<Lightbulb size={14}/>,info:<TrendingUp size={14}/>};
  return(
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div><h1 style={{fontFamily:'var(--fd)',fontSize:20,fontWeight:800,letterSpacing:'-.02em'}}>Analisis Data</h1><p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Insight otomatis & perbandingan antar platform dan brand</p></div>

      {/* Insights */}
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:14}}><Lightbulb size={15} color="var(--y)"/><div className="sec-title" style={{margin:0}}>Insight Otomatis</div></div>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          {INSIGHTS.map((ins,i)=>(
            <div key={i} style={{display:'flex',gap:10,padding:'12px 14px',borderRadius:10,background:col[ins.type]+'12',border:`1px solid ${col[ins.type]}30`}}>
              <span style={{color:col[ins.type],flexShrink:0,marginTop:1}}>{ic[ins.type]}</span>
              <span style={{fontSize:13,color:'var(--t1)',lineHeight:1.55}}>{ins.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform comparison chart */}
      <div className="card">
        <div className="sec-title">Perbandingan GMV per Platform (14 Hari)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DAILY.map(d=>({date:d.date,TikTok:Math.round(d.ngaciin*1.6+d.zonanyam*1.4+d.sentral_basreng*1.5),Shopee:Math.round(d.ngaciin*1.1+d.zonanyam*1.2+d.sentral_basreng*1.1),Meta:Math.round(d.ngaciin*.4+d.zonanyam*.5+d.sentral_basreng*.4)}))}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bo)"/>
            <XAxis dataKey="date" tick={{fontSize:10,fill:'var(--t3)'}}/>
            <YAxis tick={{fontSize:10,fill:'var(--t3)'}} tickFormatter={v=>fRp(v)}/>
            <Tooltip formatter={(v,n)=>[fRp(v),n]} contentStyle={{background:'var(--bg2)',border:'1px solid var(--bo)',borderRadius:8,fontSize:11}}/>
            <Legend wrapperStyle={{fontSize:11}}/>
            <Bar dataKey="TikTok" fill="#69C9D0" radius={[3,3,0,0]}/>
            <Bar dataKey="Shopee" fill="#EE4D2D" radius={[3,3,0,0]}/>
            <Bar dataKey="Meta" fill="#1877F2" radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Brand comparison table */}
      <div className="card">
        <div className="sec-title">Perbandingan Antar Brand (Periode Ini)</div>
        <table className="tbl">
          <thead><tr><th>Brand</th><th style={{textAlign:'right'}}>GMV</th><th style={{textAlign:'right'}}>ROAS</th><th style={{textAlign:'right'}}>TikTok</th><th style={{textAlign:'right'}}>Shopee</th><th style={{textAlign:'right'}}>Meta</th><th style={{textAlign:'right'}}>Growth</th></tr></thead>
          <tbody>
            {[{brand:'zonanyam',gmv:320e6,roas:4.63,tt:185e6,sp:105e6,mt:30e6,growth:32.8},
              {brand:'sentral_basreng',gmv:250e6,roas:3.83,tt:140e6,sp:85e6,mt:25e6,growth:21.4},
              {brand:'ngaciin',gmv:165e6,roas:3.21,tt:90e6,sp:55e6,mt:20e6,growth:28.6}].map((r,i)=>{
              const b=BRANDS[r.brand];
              return(
                <tr key={i}>
                  <td><div style={{display:'flex',alignItems:'center',gap:7}}><div style={{width:7,height:7,borderRadius:'50%',background:b.color}}/><span style={{fontWeight:700,color:b.color}}>{b.label}</span></div></td>
                  <td style={{textAlign:'right',fontWeight:700}}>{fRp(r.gmv)}</td>
                  <td style={{textAlign:'right',fontWeight:800,color:'var(--g)'}}>{r.roas}x</td>
                  <td style={{textAlign:'right',color:'#69C9D0'}}>{fRp(r.tt)}</td>
                  <td style={{textAlign:'right',color:'#EE4D2D'}}>{fRp(r.sp)}</td>
                  <td style={{textAlign:'right',color:'#1877F2'}}>{fRp(r.mt)}</td>
                  <td style={{textAlign:'right',fontWeight:700,color:'var(--g)'}}>+{r.growth}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
