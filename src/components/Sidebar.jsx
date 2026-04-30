import React,{useState} from 'react';
import {useApp,BRANDS} from '../context/AppContext';
import {LayoutDashboard,Tag,FileText,TrendingUp,Database,Users,ShoppingBag,MessageSquare,Video,Radio,Download,BarChart2,ChevronDown,ChevronRight,LogOut,Settings,X} from 'lucide-react';

const NAV=[
  {id:'dashboard',label:'Dashboard',icon:LayoutDashboard},
  {id:'brand',label:'Brand',icon:Tag},
  {id:'laporan',label:'Laporan',icon:FileText},
  {id:'performance',label:'Performance',icon:TrendingUp},
  {id:'analisis',label:'Analisis Data',icon:BarChart2},
  {id:'input',label:'Input Data',icon:Database,sub:[
    {id:'input_kol',label:'KOL',icon:Users},
    {id:'input_marketplace',label:'Marketplace',icon:ShoppingBag},
    {id:'input_csmp',label:'CS MP',icon:MessageSquare},
    {id:'input_konten',label:'Konten',icon:Video},
    {id:'input_live',label:'Live',icon:Radio},
  ]},
  {id:'export',label:'Export',icon:Download},
  {id:'settings',label:'Pengaturan',icon:Settings},
];

export default function Sidebar({mobile,onClose}){
  const{page,setPage,user,logout,activeBrand,setActiveBrand,logoUrls}=useApp();
  const[inputOpen,setInputOpen]=useState(()=>page.startsWith('input'));
  const go=(id)=>{setPage(id);onClose?.()};
  const inputPages=['input','input_kol','input_marketplace','input_csmp','input_konten','input_live'];

  function BrandMini({b}){
    const isActive=activeBrand===b.id;
    const logo=logoUrls[b.id];
    return(
      <button onClick={()=>{setActiveBrand(b.id);go('brand')}}
        style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:8,border:'none',cursor:'pointer',textAlign:'left',marginBottom:2,background:isActive?'#FFF5F2':'transparent',transition:'background .15s'}}>
        <div style={{width:28,height:28,borderRadius:8,background:isActive?b.bg:'#F5F5F5',border:`1.5px solid ${isActive?b.color+'50':'#E8E8E8'}`,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          {logo?<img src={logo} alt={b.label} style={{width:'100%',height:'100%',objectFit:'contain'}} onError={e=>{e.target.style.display='none'}}/>
            :<span style={{fontSize:9,fontWeight:800,color:b.color}}>{b.label.split(' ').map(w=>w[0]).join('')}</span>}
        </div>
        <span style={{fontSize:12,fontWeight:isActive?700:500,color:isActive?b.color:'var(--t2)'}}>{b.label}</span>
        {isActive&&<div style={{width:5,height:5,borderRadius:'50%',background:b.color,marginLeft:'auto'}}/>}
      </button>
    );
  }

  return(
    <aside style={{width:'var(--sw)',background:'#fff',borderRight:'1px solid var(--bo)',height:'100vh',display:'flex',flexDirection:'column',flexShrink:0,position:mobile?'fixed':'sticky',top:0,left:0,zIndex:mobile?200:'auto',overflowY:'auto',boxShadow:'var(--sh-sm)'}}>
      {/* Logo */}
      <div style={{padding:'16px 14px',borderBottom:'2px solid #EE4D2D',display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(135deg,#EE4D2D,#FF7337)'}}>
        <div style={{display:'flex',alignItems:'center',gap:9}}>
          <div style={{width:32,height:32,borderRadius:9,background:'rgba(255,255,255,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--fd)',fontWeight:900,fontSize:16,color:'#fff'}}>K</div>
          <div>
            <div style={{fontFamily:'var(--fd)',fontWeight:900,fontSize:13,color:'#fff',letterSpacing:'-.01em'}}>KML GROUP</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,.8)',marginTop:-1}}>Marketing Dashboard</div>
          </div>
        </div>
        {mobile&&<button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.8)'}}><X size={17}/></button>}
      </div>

      {/* Brands */}
      <div style={{padding:'12px 10px 6px'}}>
        <div style={{fontSize:10,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8,paddingLeft:4}}>Brand</div>
        {Object.values(BRANDS).map(b=><BrandMini key={b.id} b={b}/>)}
      </div>

      {/* Divider */}
      <div style={{height:1,background:'var(--bo)',margin:'4px 14px'}}/>

      {/* Nav */}
      <nav style={{flex:1,padding:'8px 10px'}}>
        <div style={{fontSize:10,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8,paddingLeft:4}}>Menu</div>
        {NAV.map(item=>{
          if(item.sub){
            const isActive=inputPages.includes(page);
            return(
              <div key={item.id}>
                <button onClick={()=>setInputOpen(!inputOpen)}
                  style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,border:'none',cursor:'pointer',textAlign:'left',background:isActive?'#FFF5F2':'transparent',marginBottom:2}}>
                  <item.icon size={14} color={isActive?'#EE4D2D':'var(--t3)'}/>
                  <span style={{flex:1,fontSize:12,fontWeight:isActive?700:500,color:isActive?'#EE4D2D':'var(--t2)'}}>{item.label}</span>
                  {inputOpen?<ChevronDown size={12} color="var(--t3)"/>:<ChevronRight size={12} color="var(--t3)"/>}
                </button>
                {inputOpen&&(
                  <div style={{paddingLeft:14,marginBottom:4}}>
                    {item.sub.map(sub=>(
                      <button key={sub.id} onClick={()=>go(sub.id)}
                        style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:7,border:'none',cursor:'pointer',textAlign:'left',background:page===sub.id?'#FFF5F2':'transparent',marginBottom:1,borderLeft:page===sub.id?'2px solid #EE4D2D':'2px solid transparent'}}>
                        <sub.icon size={12} color={page===sub.id?'#EE4D2D':'var(--t3)'}/>
                        <span style={{fontSize:12,fontWeight:page===sub.id?700:400,color:page===sub.id?'#EE4D2D':'var(--t2)'}}>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return(
            <button key={item.id} onClick={()=>go(item.id)}
              style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,border:'none',cursor:'pointer',textAlign:'left',background:page===item.id?'#FFF5F2':'transparent',marginBottom:2,transition:'background .15s',borderLeft:page===item.id?'2px solid #EE4D2D':'2px solid transparent'}}>
              <item.icon size={14} color={page===item.id?'#EE4D2D':'var(--t3)'}/>
              <span style={{fontSize:12,fontWeight:page===item.id?700:500,color:page===item.id?'#EE4D2D':'var(--t2)'}}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{padding:'12px 14px',borderTop:'1px solid var(--bo)',background:'#FAFAFA'}}>
        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#EE4D2D,#FF7337)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0}}>{user?.name?.charAt(0)}</div>
          <div style={{minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:'var(--t1)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.name}</div>
            <div style={{fontSize:10,color:'var(--t3)'}}>{user?.role==='admin'?'Super Admin':user?.division?.toUpperCase()}</div>
          </div>
        </div>
        <button onClick={logout} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'7px',borderRadius:7,border:'1px solid var(--bo)',background:'#fff',cursor:'pointer',fontSize:12,color:'var(--t2)',fontFamily:'var(--fb)',fontWeight:600}}>
          <LogOut size={13}/> Keluar
        </button>
      </div>
    </aside>
  );
}
