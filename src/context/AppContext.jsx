import React,{createContext,useContext,useState,useEffect,useCallback} from 'react';

const Ctx = createContext();

export const BRANDS = {
  ngaciin:{id:'ngaciin',label:'Ngaciin',color:'#FF6B35',bg:'#FF6B3518',tagline:'Kenyal Ngangenin',logo:null,
    skus:['cimin balado','cimin ori','baso aci ayam mercon','baso aci ayam ori','baso aci mercon mini','baso aci ori mini','cimin balado + topoki cheese','baso aci ayam mercon + baso aci ayam ori','cimin balado + cimin ori','baso aci mini isi 5']},
  zonanyam:{id:'zonanyam',label:'Zona Nyam',color:'#F5C518',bg:'#F5C51818',tagline:'Sekali Coba Auto Nyam Nyam',logo:null,
    skus:['topoki cheese 1','topoki gochujang 1','topoki karbonara 1','topoki mala 1','basreng kuah keju 1','raboki cheese 1','topoki shareit','topoki cheese isi 2','topoki cheese isi 3','topoki cheese isi 4','topoki cheese + topoki gochujang','topoki cheese + raboki cheese + topoki gochujang','topoki cheese + topoki gochujang + topoki karbonara','topoki cheese + topoki gochujang + baso aci pedas + cuanki keju','cimin balado + topoki cheese','topoki cheese + raboki cheese','raboki isi 2','raboki isi 3','topoki 1 kg']},
  sentral_basreng:{id:'sentral_basreng',label:'Sentral Basreng',color:'#E63946',bg:'#E6394618',tagline:'Basreng Terenak',logo:null,
    skus:['pipih pdj 400gr','pipih odj 400 gr','pipih saltedegg 400 gr','basreng kacang 450 gr','basreng kuah keju','basreng kacang 75 gr','basreng pdj 75 gr','basreng odj 75 gr','basreng kacang + basreng pdj + basreng odj','basreng pdj + basreng odj pipih','basreng pdj + basreng salted egg pipih','basreng toples pdj','basreng toples odj','basreng toples rose','basreng toples salted','stik odj 400 gr','stik pdj 400 gr','stik odj + stik pdj','stik odj 1 kg','stik pdj 1 kg']}
};

export const PLATFORMS = {
  tiktok:{id:'tiktok',label:'TikTok',color:'#010101',accent:'#69C9D0',icon:'🎵'},
  shopee:{id:'shopee',label:'Shopee',color:'#EE4D2D',accent:'#EE4D2D',icon:'🛒'},
  meta:{id:'meta',label:'Meta / Reseller',color:'#1877F2',accent:'#1877F2',icon:'📘'}
};

const USERS = {
  'admin@kmlgroup.com':{name:'Admin Marketing',role:'admin',division:'all',password:'admin123'},
  'kol@kmlgroup.com':{name:'Tim KOL',role:'staff',division:'kol',password:'kol123'},
  'marketplace@kmlgroup.com':{name:'Tim Marketplace',role:'staff',division:'marketplace',password:'mp123'},
  'csmp@kmlgroup.com':{name:'Tim CS MP',role:'staff',division:'cs_mp',password:'cs123'},
  'konten@kmlgroup.com':{name:'Tim Konten',role:'staff',division:'konten',password:'konten123'},
  'live@kmlgroup.com':{name:'Tim Live',role:'staff',division:'live',password:'live123'}
};

function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}

// Dummy data generator
function makeDummy(){
  const brands=Object.keys(BRANDS);
  const plats=Object.keys(PLATFORMS);
  const data=[];
  const today=new Date();
  for(let d=13;d>=0;d--){
    const date=new Date(today);date.setDate(today.getDate()-d);
    const ds=date.toISOString().split('T')[0];
    brands.forEach(b=>{
      plats.forEach(p=>{
        const base=b==='zonanyam'?22:b==='sentral_basreng'?18:12;
        const pm=p==='tiktok'?1.6:p==='shopee'?1.2:.5;
        const gmv=Math.round((base+Math.random()*8)*pm*1e6);
        const spend=Math.round(gmv*.18);
        const orders=Math.round(gmv/38000);
        const buyers=Math.round(orders*.95);
        const visitors=Math.round(orders*4.5);
        data.push({
          id:`demo_mp_${ds}_${b}_${p}`,date:ds,brand:b,platform:p,division:'marketplace',
          data:{gmv_total:gmv,gmv_live:Math.round(gmv*.3),gmv_affiliate:Math.round(gmv*.4),gmv_konten:Math.round(gmv*.2),gmv_shop_lain:Math.round(gmv*.1),ads_spend:spend,orders,buyers,visitors,aov:Math.round(gmv/buyers),roas:+(gmv/spend).toFixed(2)},
          user:'Demo'
        });
        // KOL
        data.push({
          id:`demo_kol_${ds}_${b}_${p}`,date:ds,brand:b,platform:p,division:'kol',
          data:{kol_sales:Math.round(gmv*.35),active_kol:Math.floor(3+Math.random()*8),video_gmv:Math.floor(5+Math.random()*12),invitations:Math.floor(10+Math.random()*20)},
          user:'Demo'
        });
        // Live
        if(p!=='meta'){
          data.push({
            id:`demo_live_${ds}_${b}_${p}`,date:ds,brand:b,platform:p,division:'live',
            data:{gmv_total:Math.round(gmv*.28),ads_spend:Math.round(spend*.15),viewer:Math.floor(200+Math.random()*800),pembeli:Math.floor(20+Math.random()*80),host:'Demo Host'},
            user:'Demo'
          });
        }
      });
    });
  }
  return data;
}

const DUMMY=makeDummy();

export function AppProvider({children}){
  const [user,setUser]=useState(()=>load('kml_user',null));
  const [reports,setReports]=useState(()=>load('kml_reports',[]));
  const [targets,setTargets]=useState(()=>load('kml_targets',{ngaciin:{tiktok:200,shopee:150,meta:50},zonanyam:{tiktok:350,shopee:250,meta:80},sentral_basreng:{tiktok:280,shopee:200,meta:60}}));
  const [activeBrand,setActiveBrand]=useState('ngaciin');
  const [page,setPage]=useState(()=>load('kml_user',null)?'dashboard':'landing');
  const [dateRange,setDateRange]=useState({from:'',to:''});
  const [logoUrls,setLogoUrls]=useState(()=>{
    const saved=load('kml_logos',{});
    return{
      ngaciin: saved.ngaciin||'https://i.ibb.co/PsjDgp1q/LOGO-NGACIIN.jpg',
      zonanyam: saved.zonanyam||'https://i.ibb.co/WNbLdHK3/LOGO-ZN.jpg',
      sentral_basreng: saved.sentral_basreng||'https://i.ibb.co/99jPc6jR/LOGO-SB.png'
    };
  });

  useEffect(()=>{save('kml_user',user)},[user]);
  useEffect(()=>{save('kml_reports',reports)},[reports]);
  useEffect(()=>{save('kml_targets',targets)},[targets]);
  useEffect(()=>{save('kml_logos',logoUrls)},[logoUrls]);

  const allData=useCallback(()=>[...reports,...DUMMY.filter(d=>!reports.find(r=>r.id===d.id))],[reports]);

  const login=(email,password)=>{
    const u=USERS[email.toLowerCase()];
    if(u&&u.password===password){setUser({...u,email});setPage('dashboard');return true;}
    return false;
  };
  const logout=()=>{setUser(null);setPage('landing')};

  const addReport=useCallback((r)=>{
    setReports(prev=>{
      const idx=prev.findIndex(x=>x.id===r.id);
      if(idx>=0){const u=[...prev];u[idx]=r;return u;}
      return [...prev,{...r,id:r.id||Date.now().toString(),createdAt:new Date().toISOString()}];
    });
  },[]);

  const getReports=useCallback((f={})=>{
    let d=allData();
    if(f.brand&&f.brand!=='all')d=d.filter(r=>r.brand===f.brand);
    if(f.platform&&f.platform!=='all')d=d.filter(r=>r.platform===f.platform);
    if(f.division&&f.division!=='all')d=d.filter(r=>r.division===f.division);
    if(f.from)d=d.filter(r=>r.date>=f.from);
    if(f.to)d=d.filter(r=>r.date<=f.to);
    return d.sort((a,b)=>b.date>a.date?1:-1);
  },[allData]);

  const getGMV=useCallback((brand,platform,from,to)=>{
    const d=getReports({brand,platform,division:'marketplace',from,to});
    return d.reduce((s,r)=>s+(r.data?.gmv_total||0),0);
  },[getReports]);

  const today=()=>new Date().toISOString().split('T')[0];

  return(
    <Ctx.Provider value={{
      user,login,logout,reports,allData,addReport,getReports,getGMV,
      activeBrand,setActiveBrand,page,setPage,
      dateRange,setDateRange,targets,setTargets,
      logoUrls,setLogoUrls,today,
      BRANDS,PLATFORMS,DUMMY,USERS
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp=()=>useContext(Ctx);
