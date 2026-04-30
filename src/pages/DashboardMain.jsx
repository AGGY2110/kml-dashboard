import React,{useMemo,useState} from 'react';
import {useApp,BRANDS,PLATFORMS} from '../context/AppContext';
import {LineChart,Line,BarChart,Bar,PieChart,Pie,Cell,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend} from 'recharts';
import {TrendingUp,TrendingDown,DollarSign,ShoppingBag,Zap,ArrowUpRight,Package,Trophy} from 'lucide-react';
import DateFilter from '../components/DateFilter';

const fRp=n=>'Rp '+new Intl.NumberFormat('id-ID',{notation:'compact',maximumFractionDigits:1}).format(n||0);
const fFull=n=>'Rp '+new Intl.NumberFormat('id-ID').format(n||0);
const fN=n=>new Intl.NumberFormat('id-ID',{notation:'compact',maximumFractionDigits:1}).format(n||0);

const TOP_PRODUCTS_DUMMY=[
  {nama:'Basreng Original 400gr',brand:'sentral_basreng',terjual:2450,omset:24.5e6,growth:12.3},
  {nama:'Cimin Balado',brand:'ngaciin',terjual:1980,omset:19.8e6,growth:28.6},
  {nama:'Topoki Cheese Isi 1',brand:'zonanyam',terjual:1750,omset:17.5e6,growth:15.2},
  {nama:'Baso Aci Ayam Mercon',brand:'ngaciin',terjual:1620,omset:16.2e6,growth:22.1},
  {nama:'Raboki Cheese',brand:'zonanyam',terjual:1480,omset:14.8e6,growth:8.7},
  {nama:'Basreng Pedas 400gr',brand:'sentral_basreng',terjual:1350,omset:13.5e6,growth:-3.2},
  {nama:'Basreng Toples PDJ',brand:'sentral_basreng',terjual:1200,omset:12.0e6,growth:5.4},
  {nama:'Cimin Ori',brand:'ngaciin',terjual:1100,omset:11.0e6,growth:19.8},
];

function KPICard({label,value,sub,icon:Icon,color,trend,delay=0}){
  return(
    <div className="card fade-up" style={{animationDelay:delay+'ms',borderLeft:`4px solid ${color}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <span style={{fontSize:11,fontWeight:600,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</span>
        <div style={{width:32,height:32,borderRadius:8,background:color+'15',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={15} color={color}/></div>
      </div>
      <div style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:800,color:color,letterSpacing:'-.02em',marginBottom:3}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:'var(--t3)'}}>{sub}</div>}
      {trend!=null&&<div style={{display:'flex',alignItems:'center',gap:4,marginTop:6}}>
        {trend>=0?<TrendingUp size={11} color="#00BFA5"/>:<TrendingDown size={11} color="#D0011B"/>}
        <span style={{fontSize:11,fontWeight:700,color:trend>=0?'#00BFA5':'#D0011B'}}>{trend>=0?'+':''}{trend}%</span>
        <span style={{fontSize:10,color:'var(--t3)'}}>vs kemarin</span>
      </div>}
    </div>
  );
}

function BrandCard({brand,stats,logo,onClick}){
  const b=BRANDS[brand];
  return(
    <div onClick={onClick} className="card" style={{cursor:'pointer',transition:'all .2s',borderTop:`3px solid ${b.color}`}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--sh-md)'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:48,height:48,borderRadius:12,background:'#F5F5F5',border:`1px solid ${b.color}30`,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            {logo?<img src={logo} alt={b.label} style={{width:'100%',height:'100%',objectFit:'contain'}} onError={e=>{e.target.style.display='none';e.target.parentNode.innerHTML=`<span style="font-family:var(--fd);font-size:11px;font-weight:800;color:${b.color}">${b.label.split(' ').map(w=>w[0]).join('')}</span>`}}/>
              :<span style={{fontFamily:'var(--fd)',fontSize:11,fontWeight:800,color:b.color}}>{b.label.split(' ').map(w=>w[0]).join('')}</span>}
          </div>
          <div>
            <div style={{fontFamily:'var(--fd)',fontSize:15,fontWeight:800,color:b.color}}>{b.label}</div>
            <div style={{fontSize:10,color:'var(--t3)',marginTop:1}}>{b.tagline}</div>
          </div>
        </div>
        <ArrowUpRight size={14} color="var(--t3)"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
        <div style={{background:'var(--bg0)',borderRadius:8,padding:'8px 10px'}}>
          <div style={{fontSize:10,color:'var(--t3)'}}>Total Penjualan</div>
          <div style={{fontFamily:'var(--fd)',fontSize:15,fontWeight:800,color:'var(--t1)',marginTop:2}}>{fRp(stats.gmv)}</div>
        </div>
        <div style={{background:'var(--bg0)',borderRadius:8,padding:'8px 10px'}}>
          <div style={{fontSize:10,color:'var(--t3)'}}>Total Order</div>
          <div style={{fontFamily:'var(--fd)',fontSize:15,fontWeight:800,color:'var(--t1)',marginTop:2}}>{fN(stats.orders)}</div>
        </div>
      </div>
      <div style={{display:'flex',gap:7}}>
        {[['ROAS',stats.roas+'x',b.color],['Ads Spend',fRp(stats.spend),'var(--t2)'],['Growth',(+stats.growth>=0?'+':'')+stats.growth+'%',+stats.growth>=0?'#00BFA5':'#D0011B']].map(([l,v,c])=>(
          <div key={l} style={{flex:1,background:'var(--bg0)',borderRadius:7,padding:'7px 9px',textAlign:'center'}}>
            <div style={{fontSize:9,color:'var(--t3)',marginBottom:2}}>{l}</div>
            <div style={{fontSize:13,fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardMain(){
  const{getReports,setActiveBrand,setPage,logoUrls}=useApp();
  const[dateFilter,setDateFilter]=useState({from:'',to:'',preset:'7d'});

  const from=dateFilter.from||new Date(Date.now()-6*86400000).toISOString().split('T')[0];
  const to=dateFilter.to||new Date().toISOString().split('T')[0];
  const mp=getReports({division:'marketplace',from:dateFilter.preset==='all'?'':from,to:dateFilter.preset==='all'?'':to});

  const total={
    gmv:mp.reduce((s,r)=>s+(r.data?.gmv_total||0),0),
    orders:mp.reduce((s,r)=>s+(r.data?.orders||0),0),
    spend:mp.reduce((s,r)=>s+(r.data?.ads_spend||0),0),
  };
  total.roas=total.spend>0?(total.gmv/total.spend).toFixed(2):'-';

  const brandStats=useMemo(()=>{
    const res={};
    Object.keys(BRANDS).forEach(b=>{
      const d=mp.filter(r=>r.brand===b);
      const gmv=d.reduce((s,r)=>s+(r.data?.gmv_total||0),0);
      const spend=d.reduce((s,r)=>s+(r.data?.ads_spend||0),0);
      const orders=d.reduce((s,r)=>s+(r.data?.orders||0),0);
      res[b]={gmv,spend,orders,roas:spend>0?(gmv/spend).toFixed(2):'-',growth:(Math.random()*40+5).toFixed(1)};
    });
    return res;
  },[mp]);

  const chartData=useMemo(()=>{
    const days={};
    mp.forEach(r=>{
      if(!days[r.date])days[r.date]={date:r.date.slice(5),ngaciin:0,zonanyam:0,sentral_basreng:0};
      days[r.date][r.brand]=(days[r.date][r.brand]||0)+(r.data?.gmv_total||0);
    });
    return Object.values(days).sort((a,b)=>a.date>b.date?1:-1);
  },[mp]);

  const platData=useMemo(()=>Object.keys(PLATFORMS).map(p=>{
    const d=mp.filter(r=>r.platform===p);
    const gmv=d.reduce((s,r)=>s+(r.data?.gmv_total||0),0);
    const spend=d.reduce((s,r)=>s+(r.data?.ads_spend||0),0);
    const orders=d.reduce((s,r)=>s+(r.data?.orders||0),0);
    return{name:PLATFORMS[p].label,gmv,spend,orders,roas:spend>0?(gmv/spend).toFixed(2):'-',color:p==='tiktok'?'#212121':p==='shopee'?'#EE4D2D':'#1877F2'};
  }),[mp]);

  const pieData=Object.keys(BRANDS).map(b=>({name:BRANDS[b].label,value:brandStats[b]?.gmv||0,color:BRANDS[b].color}));
  const totalGMV=pieData.reduce((s,x)=>s+x.value,0);

  // Product chart data
  const prodChartData=TOP_PRODUCTS_DUMMY.slice(0,6).map(p=>({name:p.nama.length>15?p.nama.slice(0,15)+'...':p.nama,terjual:p.terjual,omset:p.omset/1e6}));

  return(
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:900,letterSpacing:'-.02em',color:'var(--t1)'}}>Dashboard</h1>
          <p style={{fontSize:12,color:'var(--t3)',marginTop:2}}>Ringkasan performa semua brand KML Group</p>
        </div>
        <DateFilter value={dateFilter} onChange={setDateFilter}/>
      </div>

      {/* KPI */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:12}}>
        <KPICard label="Total Penjualan" value={fRp(total.gmv)} icon={DollarSign} color="#EE4D2D" trend={25.7} delay={0} sub="Semua brand & platform"/>
        <KPICard label="Total Order" value={fN(total.orders)} icon={ShoppingBag} color="#FF7337" trend={24.3} delay={60}/>
        <KPICard label="Rata-rata ROAS" value={total.roas+'x'} icon={TrendingUp} color="#00BFA5" trend={12.5} delay={120} sub="GMV / Spending"/>
        <KPICard label="Total Ads Spend" value={fRp(total.spend)} icon={Zap} color="#D0011B" trend={19.1} delay={180}/>
      </div>

      {/* Brand cards */}
      <div>
        <div className="sec-title">Performa per Brand</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14}}>
          {Object.keys(BRANDS).map(b=>(
            <BrandCard key={b} brand={b} stats={brandStats[b]||{}} logo={logoUrls[b]}
              onClick={()=>{setActiveBrand(b);setPage('brand')}}/>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16}}>
        <div className="card">
          <div className="sec-title">Trend Penjualan Semua Brand</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{top:5,right:5,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/>
              <XAxis dataKey="date" tick={{fontSize:10,fill:'var(--t3)'}}/>
              <YAxis tick={{fontSize:10,fill:'var(--t3)'}} tickFormatter={v=>fRp(v)}/>
              <Tooltip formatter={(v,n)=>[fFull(v),BRANDS[n]?.label||n]} contentStyle={{background:'#fff',border:'1px solid #E8E8E8',borderRadius:8,fontSize:11,boxShadow:'var(--sh-md)'}}/>
              <Legend wrapperStyle={{fontSize:11}} formatter={v=>BRANDS[v]?.label||v}/>
              <Line type="monotone" dataKey="ngaciin" stroke={BRANDS.ngaciin.color} strokeWidth={2.5} dot={{r:3}}/>
              <Line type="monotone" dataKey="zonanyam" stroke={BRANDS.zonanyam.color} strokeWidth={2.5} dot={{r:3}}/>
              <Line type="monotone" dataKey="sentral_basreng" stroke={BRANDS.sentral_basreng.color} strokeWidth={2.5} dot={{r:3}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="sec-title">Kontribusi per Brand</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} dataKey="value" paddingAngle={3}>
                {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={v=>fFull(v)} contentStyle={{background:'#fff',border:'1px solid #E8E8E8',borderRadius:8,fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
            {pieData.map((d,i)=>{
              const pct=totalGMV>0?((d.value/totalGMV)*100).toFixed(1):0;
              return(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                  <span style={{fontSize:11,color:'var(--t2)',flex:1}}>{d.name}</span>
                  <span style={{fontSize:11,color:'var(--t3)'}}>{fRp(d.value)}</span>
                  <span style={{fontSize:11,fontWeight:700,color:d.color}}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card">
          <div className="sec-title">Penjualan per Platform</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platData} margin={{top:5,right:5,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0"/>
              <XAxis dataKey="name" tick={{fontSize:10,fill:'var(--t3)'}}/>
              <YAxis tick={{fontSize:10,fill:'var(--t3)'}} tickFormatter={v=>fRp(v)}/>
              <Tooltip formatter={v=>fFull(v)} contentStyle={{background:'#fff',border:'1px solid #E8E8E8',borderRadius:8,fontSize:11}}/>
              <Bar dataKey="gmv" name="GMV" radius={[5,5,0,0]}>
                {platData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="sec-title">Ranking Platform</div>
          <table className="tbl">
            <thead><tr><th>Platform</th><th style={{textAlign:'right'}}>Penjualan</th><th style={{textAlign:'right'}}>Order</th><th style={{textAlign:'right'}}>ROAS</th></tr></thead>
            <tbody>
              {platData.sort((a,b)=>b.gmv-a.gmv).map((p,i)=>(
                <tr key={i}>
                  <td><div style={{display:'flex',alignItems:'center',gap:7}}><div style={{width:7,height:7,borderRadius:'50%',background:p.color}}/><span style={{fontWeight:600}}>{p.name}</span></div></td>
                  <td style={{textAlign:'right',fontWeight:700}}>{fRp(p.gmv)}</td>
                  <td style={{textAlign:'right',color:'var(--t2)'}}>{fN(p.orders)}</td>
                  <td style={{textAlign:'right',fontWeight:800,color:+p.roas>=3?'#00BFA5':+p.roas>=2?'#FF7337':'#D0011B'}}>{p.roas}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP PRODUK */}
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <Trophy size={16} color="#EE4D2D"/>
            <div className="sec-title" style={{margin:0}}>Top Produk Terlaris</div>
          </div>
          <span style={{fontSize:11,color:'var(--t3)'}}>Berdasarkan jumlah terjual</span>
        </div>

        {/* Bar chart produk */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={prodChartData} layout="vertical" margin={{left:10,right:20,top:5,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false}/>
            <XAxis type="number" tick={{fontSize:10,fill:'var(--t3)'}} tickFormatter={v=>v+'pcs'}/>
            <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:'var(--t2)'}} width={120}/>
            <Tooltip formatter={(v,n)=>[n==='terjual'?v+' pcs':fRp(v*1e6),n==='terjual'?'Terjual':'Omset']} contentStyle={{background:'#fff',border:'1px solid #E8E8E8',borderRadius:8,fontSize:11}}/>
            <Bar dataKey="terjual" name="terjual" fill="#EE4D2D" radius={[0,5,5,0]}/>
          </BarChart>
        </ResponsiveContainer>

        {/* Table produk */}
        <div style={{marginTop:16,overflowX:'auto'}}>
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th><th>Produk</th><th>Brand</th><th style={{textAlign:'right'}}>Terjual</th><th style={{textAlign:'right'}}>Omset</th><th style={{textAlign:'right'}}>Growth</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS_DUMMY.map((p,i)=>{
                const b=BRANDS[p.brand];
                return(
                  <tr key={i}>
                    <td style={{fontWeight:800,color:i<3?'#EE4D2D':'var(--t3)',width:30}}>{i+1}</td>
                    <td style={{fontWeight:600}}>{p.nama}</td>
                    <td><span style={{fontSize:11,padding:'2px 8px',borderRadius:4,background:b.bg,color:b.color,fontWeight:700}}>{b.label}</span></td>
                    <td style={{textAlign:'right',fontWeight:700}}>{fN(p.terjual)} pcs</td>
                    <td style={{textAlign:'right',fontWeight:700,color:'#EE4D2D'}}>{fRp(p.omset)}</td>
                    <td style={{textAlign:'right',fontWeight:700,color:p.growth>=0?'#00BFA5':'#D0011B'}}>{p.growth>=0?'+':''}{p.growth}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
