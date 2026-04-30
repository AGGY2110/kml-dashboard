import React,{useState} from 'react';
import {Calendar,ChevronDown} from 'lucide-react';

export default function DateFilter({onChange,value={}}){
  const[open,setOpen]=useState(false);
  const[preset,setPreset]=useState('7d');
  const[from,setFrom]=useState(value.from||'');
  const[to,setTo]=useState(value.to||'');

  const apply=(p,f,t)=>{
    setPreset(p);setFrom(f);setTo(t);
    onChange({from:f,to:t,preset:p});
    setOpen(false);
  };

  const today=new Date().toISOString().split('T')[0];
  const daysAgo=d=>{const dt=new Date();dt.setDate(dt.getDate()-d);return dt.toISOString().split('T')[0];};
  const monthStart=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1).toISOString().split('T')[0];};
  const lastMonthStart=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth()-1,1).toISOString().split('T')[0];};
  const lastMonthEnd=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),0).toISOString().split('T')[0];};

  const PRESETS=[
    {id:'today',label:'Hari Ini',fn:()=>apply('today',today,today)},
    {id:'7d',label:'7 Hari Terakhir',fn:()=>apply('7d',daysAgo(6),today)},
    {id:'30d',label:'30 Hari Terakhir',fn:()=>apply('30d',daysAgo(29),today)},
    {id:'thisMonth',label:'Bulan Ini',fn:()=>apply('thisMonth',monthStart(),today)},
    {id:'lastMonth',label:'Bulan Lalu',fn:()=>apply('lastMonth',lastMonthStart(),lastMonthEnd())},
    {id:'all',label:'Semua Data',fn:()=>apply('all','','')},
  ];

  const label={today:'Hari Ini','7d':'7 Hari','30d':'30 Hari',thisMonth:'Bulan Ini',lastMonth:'Bulan Lalu',all:'Semua Data',custom:'Custom'}[preset]||'Filter Tanggal';

  return(
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)}
        style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,border:'1px solid var(--bo)',background:'#fff',cursor:'pointer',fontSize:12,fontWeight:600,color:'var(--t1)',fontFamily:'var(--fb)',boxShadow:'var(--sh-sm)'}}>
        <Calendar size={13} color="#EE4D2D"/>
        {label}
        <ChevronDown size={12} color="var(--t3)"/>
      </button>

      {open&&(
        <div style={{position:'absolute',top:'calc(100% + 6px)',right:0,background:'#fff',border:'1px solid var(--bo)',borderRadius:12,boxShadow:'var(--sh-lg)',zIndex:200,minWidth:240,overflow:'hidden'}}>
          <div style={{padding:'10px 14px',borderBottom:'1px solid var(--bo)',fontSize:11,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.05em'}}>Pilih Periode</div>
          <div style={{padding:'6px'}}>
            {PRESETS.map(p=>(
              <button key={p.id} onClick={p.fn} style={{width:'100%',display:'flex',alignItems:'center',padding:'9px 12px',borderRadius:8,border:'none',cursor:'pointer',textAlign:'left',fontSize:13,fontWeight:preset===p.id?700:400,color:preset===p.id?'#EE4D2D':'var(--t1)',background:preset===p.id?'#FFF5F2':'transparent',fontFamily:'var(--fb)'}}>
                {preset===p.id&&<div style={{width:4,height:4,borderRadius:'50%',background:'#EE4D2D',marginRight:8}}/>}
                {p.label}
              </button>
            ))}
          </div>
          <div style={{padding:'10px 14px',borderTop:'1px solid var(--bo)',background:'#FAFAFA'}}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--t3)',marginBottom:8,textTransform:'uppercase',letterSpacing:'.05em'}}>Custom Range</div>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{fontSize:12,padding:'6px 8px'}}/>
              <span style={{color:'var(--t3)',fontSize:12,flexShrink:0}}>s/d</span>
              <input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{fontSize:12,padding:'6px 8px'}}/>
            </div>
            <button onClick={()=>apply('custom',from,to)} style={{marginTop:8,width:'100%',padding:'8px',borderRadius:7,background:'#EE4D2D',color:'#fff',border:'none',cursor:'pointer',fontSize:12,fontWeight:700,fontFamily:'var(--fb)'}}>
              Terapkan
            </button>
          </div>
        </div>
      )}
      {open&&<div style={{position:'fixed',inset:0,zIndex:199}} onClick={()=>setOpen(false)}/>}
    </div>
  );
}
