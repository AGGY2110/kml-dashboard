import React,{useState} from 'react';
import {useApp} from '../context/AppContext';
import {Eye,EyeOff,LogIn,AlertCircle,ArrowLeft} from 'lucide-react';

const DEMOS=[
  {email:'admin@kmlgroup.com',password:'admin123',label:'Admin',color:'#F5C518'},
  {email:'kol@kmlgroup.com',password:'kol123',label:'Tim KOL',color:'#FF6B35'},
  {email:'marketplace@kmlgroup.com',password:'mp123',label:'Tim MP',color:'#06D6A0'},
  {email:'csmp@kmlgroup.com',password:'cs123',label:'Tim CS',color:'#118AB2'},
  {email:'konten@kmlgroup.com',password:'konten123',label:'Tim Konten',color:'#E63946'},
  {email:'live@kmlgroup.com',password:'live123',label:'Tim Live',color:'#8B5CF6'},
];

export default function Login(){
  const {login,setPage}=useApp();
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const [show,setShow]=useState(false);
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);

  const submit=async(e)=>{
    e.preventDefault();setLoading(true);setErr('');
    await new Promise(r=>setTimeout(r,600));
    if(!login(email,pass))setErr('Email atau password salah');
    setLoading(false);
  };

  return(
    <div style={{minHeight:'100vh',background:'var(--bg0)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'20%',left:'10%',width:400,height:400,borderRadius:'50%',background:'var(--y)',opacity:.04,filter:'blur(100px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'20%',right:'10%',width:300,height:300,borderRadius:'50%',background:'var(--o)',opacity:.05,filter:'blur(80px)',pointerEvents:'none'}}/>

      <div style={{width:'100%',maxWidth:420,animation:'fadeUp .5s ease'}}>
        <button onClick={()=>setPage('landing')} className="btn btn-ghost" style={{marginBottom:24,fontSize:13}}>
          <ArrowLeft size={14}/> Kembali
        </button>

        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,var(--y),var(--o))',marginBottom:14,fontSize:24,fontFamily:'var(--fd)',fontWeight:800,color:'#080809'}}>K</div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:22,fontWeight:800,color:'var(--t1)'}}>KML Group</h1>
          <p style={{fontSize:13,color:'var(--t3)',marginTop:3}}>Marketing Intelligence Dashboard</p>
        </div>

        <div className="card" style={{padding:28}}>
          <h2 style={{fontFamily:'var(--fd)',fontSize:16,fontWeight:700,marginBottom:22,color:'var(--t1)'}}>Masuk ke Dashboard</h2>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'var(--t3)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'.05em'}}>Email Tim</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tim@kmlgroup.com" required/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'var(--t3)',display:'block',marginBottom:5,textTransform:'uppercase',letterSpacing:'.05em'}}>Password</label>
              <div style={{position:'relative'}}>
                <input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required style={{paddingRight:40}}/>
                <button type="button" onClick={()=>setShow(!show)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--t3)',display:'flex'}}>
                  {show?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
            {err&&<div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:8,background:'rgba(230,57,70,.1)',border:'1px solid rgba(230,57,70,.3)',fontSize:12,color:'var(--r)'}}><AlertCircle size={13}/>{err}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%',justifyContent:'center',padding:'12px',fontSize:14,marginTop:4}}>
              {loading?<span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:14,height:14,border:'2px solid #080809',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .6s linear infinite',display:'inline-block'}}/>Masuk...</span>:<><LogIn size={15}/>Masuk</>}
            </button>
          </form>
        </div>

        <div style={{marginTop:18}}>
          <p style={{fontSize:11,color:'var(--t3)',textAlign:'center',marginBottom:10,textTransform:'uppercase',letterSpacing:'.05em'}}>Akun Demo — Klik untuk isi otomatis</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center'}}>
            {DEMOS.map(a=>(
              <button key={a.email} onClick={()=>{setEmail(a.email);setPass(a.password)}}
                style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${a.color}40`,background:a.color+'14',color:a.color,fontSize:11,fontWeight:700,cursor:'pointer',transition:'all .15s'}}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
