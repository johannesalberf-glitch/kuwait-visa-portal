import{r as e,t}from"./jsx-runtime-DGeXAQPT.js";import{a as n,i as r,o as i,r as a,s as o,t as s}from"./visa-storage-D69v9tx5.js";import{a as c,i as l,n as u,o as d,u as f}from"./index-D7TXTpVo.js";import{t as p}from"./arrow-left-CdFlmjMr.js";import{t as m}from"./x-Dal_F-_8.js";var h=e(f(),1);function g(e){let t=l();return h.useCallback(async(...n)=>{try{let t=await e(...n);if(d(t))throw t;return t}catch(e){if(d(e))return e.options._fromLocation=t.stores.location.get(),t.navigate(t.resolveRedirect(e).options);throw e}},[t,e])}var _=i(`log-out`,[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]),v=i(`pencil`,[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]]),y=i(`save`,[[`path`,{d:`M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z`,key:`1c8476`}],[`path`,{d:`M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7`,key:`1ydtos`}],[`path`,{d:`M7 3v4a1 1 0 0 0 1 1h7`,key:`t51u73`}]]),b=i(`trash-2`,[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]]),x=async d=>{const r=await fetch(`/api/admin/login`,{method:`POST`,credentials:`include`,headers:{"Content-Type":"application/json"},body:JSON.stringify({username:d?.data?.username??``,password:d?.data?.password??``})});const j=await r.json();return j.ok?{ok:true}:{ok:false,error:j.error||`Invalid username or password`}},S=async d=>{try{const r=await fetch(`/api/admin/session`,{method:`GET`,credentials:`include`});const j=await r.json();return{configured:j.configured!==false,authed:!!j.authed,error:j.error}}catch(e){return{configured:false,error:`Cannot reach server`}}},C=async d=>{try{await fetch(`/api/admin/logout`,{method:`POST`,credentials:`include`})}catch(e){}return{ok:true}},w=t();function T({children:e}){let t=g(S),n=g(x),r=g(C),[i,a]=(0,h.useState)({state:`loading`}),[o,s]=(0,h.useState)(null),[c,l]=(0,h.useState)(!1);(0,h.useEffect)(()=>{t().then(e=>{e.configured?e.authed?a({state:`authed`}):a({state:`unauthed`}):a({state:`misconfigured`,error:e.error??`Server not configured`})})},[t]);async function u(e){e.preventDefault(),l(!0),s(null);let t=new FormData(e.currentTarget),r=await n({data:{username:String(t.get(`username`)??``),password:String(t.get(`password`)??``)}});l(!1),r.ok?a({state:`authed`}):s(r.error)}async function d(){await r({data:void 0}),a({state:`unauthed`})}return i.state===`loading`?(0,w.jsx)(`div`,{className:`flex min-h-screen items-center justify-center bg-gray-50 text-gray-600`,children:`Checking session…`}):i.state===`misconfigured`?(0,w.jsx)(`div`,{className:`flex min-h-screen items-center justify-center bg-gray-50 p-6`,children:(0,w.jsxs)(`div`,{className:`max-w-md rounded-xl border border-red-200 bg-white p-6 shadow`,children:[(0,w.jsx)(`h1`,{className:`text-lg font-bold text-red-700`,children:`Admin unavailable`}),(0,w.jsx)(`p`,{className:`mt-2 text-sm text-gray-700`,children:i.error})]})}):i.state===`unauthed`?(0,w.jsx)(`div`,{className:`flex min-h-screen items-center justify-center bg-gray-50 p-6`,children:(0,w.jsxs)(`form`,{onSubmit:u,className:`w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-xl`,children:[(0,w.jsx)(`h1`,{className:`text-center text-2xl font-bold text-[#0b2a6b]`,children:`Admin Login`}),(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`label`,{className:`mb-1 block text-sm font-semibold text-gray-700`,children:`Username`}),(0,w.jsx)(`input`,{name:`username`,autoComplete:`username`,defaultValue:`admin`,className:`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200`,required:!0})]}),(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`label`,{className:`mb-1 block text-sm font-semibold text-gray-700`,children:`Password`}),(0,w.jsx)(`input`,{name:`password`,type:`password`,autoComplete:`current-password`,className:`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200`,required:!0})]}),o&&(0,w.jsx)(`p`,{className:`rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600`,children:o}),(0,w.jsx)(`button`,{type:`submit`,disabled:c,className:`w-full rounded-lg bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-900 disabled:opacity-60`,children:c?`Signing in…`:`Sign in`})]})}):(0,w.jsx)(w.Fragment,{children:e(d)})}var E={url:`/images/kuwait-emblem.webp`};function D(){return(0,w.jsx)(T,{children:e=>(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(`div`,{className:`flex justify-end bg-gray-50 px-4 pt-4`,children:(0,w.jsxs)(`button`,{onClick:e,className:`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100`,children:[(0,w.jsx)(_,{className:`h-4 w-4`}),` Sign out`]})}),(0,w.jsx)(F,{})]})})}var O=[{en:`ETHIOPIA`,ar:`إثيوبيا`},{en:`INDIA`,ar:`الهند`},{en:`PHILIPPINES`,ar:`الفلبين`},{en:`BANGLADESH`,ar:`بنغلاديش`},{en:`PAKISTAN`,ar:`باكستان`},{en:`EGYPT`,ar:`مصر`},{en:`SRI LANKA`,ar:`سريلانكا`},{en:`NEPAL`,ar:`نيبال`},{en:`KENYA`,ar:`كينيا`},{en:`UGANDA`,ar:`أوغندا`},{en:`OTHER`,ar:`أخرى`}],k=[{en:`B - Private Sector Work Visa`,ar:`سمة دخول عمل أهلي`},{en:`18 - Government Work Visa`,ar:`سمة دخول عمل حكومي`},{en:`14 - Visit Visa`,ar:`سمة زيارة`},{en:`20 - Family Visit`,ar:`زيارة عائلية`},{en:`22 - Tourist Visa`,ar:`تأشيرة سياحية`}];function A(e){return e.toString().padStart(2,`0`)}function j(e){if(!e)return``;let t=new Date(e);return isNaN(t.getTime())?e:`${A(t.getDate())}/${A(t.getMonth()+1)}/${t.getFullYear()}`}function M(){return Math.floor(1e5+Math.random()*9e5).toString()}function N(){return Math.floor(1e5+Math.random()*9e5).toString()}function P(e,t,n,r,i,a){let o=e=>e.toUpperCase().replace(/[^A-Z0-9]/g,`<`).padEnd(30,`<`).slice(0,30),s=n.slice(0,3).toUpperCase().padEnd(3,`X`),c=e=>{if(!e)return`000000`;let t=new Date(e);return isNaN(t.getTime())?`000000`:`${(t.getFullYear()%100).toString().padStart(2,`0`)}${A(t.getMonth()+1)}${A(t.getDate())}`},l=i===`M`?`M`:i===`F`?`F`:`X`;return[`V<MLS${o(e)}`.slice(0,44).padEnd(44,`<`),`${(t||``).toUpperCase().padEnd(9,`<`).slice(0,9)}0${s}${c(r)}0${l}${c(a)}0<<<<<<<<<<<<<<`.slice(0,44).padEnd(44,`<`)]}function F(){let[e,t]=(0,h.useState)(null),[n,i]=(0,h.useState)(null),[a,o]=(0,h.useState)([]),[s,c]=(0,h.useState)(``),[l,d]=(0,h.useState)(``),[f,m]=(0,h.useState)(null),[g,_]=(0,h.useState)(()=>M()),[v,y]=(0,h.useState)(()=>N()),b=(0,h.useRef)(null),x=(0,h.useRef)(null);function S(e){let t=e.target.files?.[0];if(!t)return;let n=new FileReader;n.onload=()=>{let e=typeof n.result==`string`?n.result:null;if(!e)return;let t=new Image;t.onload=()=>{let n=Math.min(1,400/Math.max(t.width,t.height)),r=Math.round(t.width*n),a=Math.round(t.height*n),o=document.createElement(`canvas`);o.width=r,o.height=a;let s=o.getContext(`2d`);if(!s){i(e);return}s.drawImage(t,0,0,r,a),i(o.toDataURL(`image/jpeg`,.75))},t.onerror=()=>i(e),t.src=e},n.readAsDataURL(t)}function C(e){let t=Array.from(e.target.files??[]);t.length&&Promise.all(t.map(e=>new Promise(t=>{let n=new FileReader;n.onload=()=>{let r=typeof n.result==`string`?n.result:null;if(!r)return t(null);t({name:e.name,type:e.type||`application/octet-stream`,dataUrl:r})},n.onerror=()=>t(null),n.readAsDataURL(e)}))).then(e=>{let t=e.filter(e=>!!e);o(e=>[...e,...t])})}function T(e){o(t=>t.filter((t,n)=>n!==e))}async function D(e){let t=e.trim();if(!t)return``;try{return(await(await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(t)}&langpair=en|ar`)).json())?.responseData?.translatedText??``}catch{return``}}async function A(e,t){if(!t.trim())return;m(e);let n=await D(t);n&&(e===`name`?c(n):d(n)),m(null)}let[F,R]=(0,h.useState)(!1),[z,B]=(0,h.useState)(null);async function V(e){e.preventDefault();let i=new FormData(e.currentTarget),o=g.replace(/\D/g,``).slice(0,6),c=v.replace(/\D/g,``).slice(0,6);if(o.length!==6||c.length!==6){B(`OTP and Tracker must be exactly 6 digits.`);return}let u=`KWT`+Math.floor(1e5+Math.random()*9e5).toString()+String.fromCharCode(65+Math.floor(Math.random()*26)),d=String(i.get(`nationality`)??``),f=String(i.get(`visaType`)??``),p={id:o,tracker:c,name:String(i.get(`name`)??``),passport:String(i.get(`passport`)??``),nationality:d,gender:String(i.get(`gender`)??``),visaType:f,occupation:String(i.get(`occupation`)??``),birthDate:String(i.get(`birthDate`)??``),issueDate:String(i.get(`issueDate`)??``),expiryDate:String(i.get(`expiryDate`)??``),photo:n,documents:a};R(!0),B(null);try{await r(p)}catch(e){R(!1),B(e instanceof Error?e.message:`Failed to save visa. Please try again.`);return}R(!1);let m=P(p.name,p.passport,p.nationality,p.birthDate,p.gender,p.expiryDate);t({...p,nameAr:s,occupationAr:l,nationalityAr:O.find(e=>e.en===d)?.ar??``,visaTypeAr:k.find(e=>e.en===f)?.ar??``,reference:u,mrz:m}),setTimeout(()=>{document.getElementById(`visa-card-preview`)?.scrollIntoView({behavior:`smooth`,block:`start`})},100)}function H(){t(null),i(null),o([]),c(``),d(``),_(M()),y(N()),b.current&&(b.current.value=``),x.current&&(x.current.value=``)}return(0,w.jsxs)(`div`,{className:`mols-admin min-h-screen py-8 px-4`,children:[(0,w.jsx)(`style`,{children:L}),(0,w.jsxs)(`div`,{className:`mx-auto max-w-5xl`,children:[(0,w.jsxs)(u,{to:`/`,reloadDocument:true,className:`mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--mls-gold)] hover:underline`,children:[(0,w.jsx)(p,{className:`h-4 w-4`}),`Back to home`]}),(0,w.jsxs)(`div`,{className:`generator-section`,children:[(0,w.jsx)(`h1`,{className:`generator-title`,children:`Kuwait Ministry of Interior — وزارة الداخلية الكويتية`}),(0,w.jsx)(`p`,{className:`generator-subtitle`,children:`Electronic Visa ID Generator · مولّد بطاقة التأشيرة الإلكترونية`}),(0,w.jsxs)(`form`,{onSubmit:V,children:[(0,w.jsxs)(`div`,{className:`form-grid`,children:[(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`OTP Number · رمز التحقق (6 digits)`}),(0,w.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,w.jsx)(`input`,{type:`text`,inputMode:`numeric`,maxLength:6,required:!0,value:g,onChange:e=>_(e.target.value.replace(/\D/g,``).slice(0,6)),placeholder:`6-digit OTP`,style:{flex:1}}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>_(M()),className:`btn-reset`,style:{whiteSpace:`nowrap`},children:`Random`})]})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Database Tracker · معرّف قاعدة البيانات (6 digits)`}),(0,w.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,w.jsx)(`input`,{type:`text`,inputMode:`numeric`,maxLength:6,required:!0,value:v,onChange:e=>y(e.target.value.replace(/\D/g,``).slice(0,6)),placeholder:`6-digit tracker`,style:{flex:1}}),(0,w.jsx)(`button`,{type:`button`,onClick:()=>y(N()),className:`btn-reset`,style:{whiteSpace:`nowrap`},children:`Random`})]})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Full Name (English)`}),(0,w.jsx)(`input`,{name:`name`,type:`text`,required:!0,placeholder:`e.g. AREGASH ALEMAYEU ASALE`,onBlur:e=>A(`name`,e.target.value)})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsxs)(`label`,{children:[`Full Name (Arabic) · الاسم بالعربية`,f===`name`&&(0,w.jsx)(`span`,{style:{marginLeft:8,opacity:.7},children:`translating…`})]}),(0,w.jsx)(`input`,{name:`nameAr`,type:`text`,dir:`rtl`,value:s,onChange:e=>c(e.target.value),placeholder:`مثال: أريغاش أليمايو أسالي (يُملأ تلقائيًا)`})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Nationality · الجنسية`}),(0,w.jsx)(`select`,{name:`nationality`,defaultValue:`ETHIOPIA`,required:!0,children:O.map(e=>(0,w.jsxs)(`option`,{value:e.en,children:[e.en,` — `,e.ar]},e.en))})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Passport Number · رقم الجواز`}),(0,w.jsx)(`input`,{name:`passport`,type:`text`,required:!0,placeholder:`e.g. EQ1648348`})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Date of Birth · تاريخ الميلاد`}),(0,w.jsx)(`input`,{name:`birthDate`,type:`date`,required:!0})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Gender · الجنس`}),(0,w.jsxs)(`select`,{name:`gender`,defaultValue:`F`,required:!0,children:[(0,w.jsx)(`option`,{value:`F`,children:`Female — أنثى`}),(0,w.jsx)(`option`,{value:`M`,children:`Male — ذكر`})]})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Visa Type · نوع التأشيرة`}),(0,w.jsx)(`select`,{name:`visaType`,defaultValue:k[0].en,required:!0,children:k.map(e=>(0,w.jsxs)(`option`,{value:e.en,children:[e.en,` — `,e.ar]},e.en))})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Occupation (English)`}),(0,w.jsx)(`input`,{name:`occupation`,type:`text`,required:!0,placeholder:`e.g. Hotel Host / Waiter`,onBlur:e=>A(`occupation`,e.target.value)})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsxs)(`label`,{children:[`Occupation (Arabic) · المهنة`,f===`occupation`&&(0,w.jsx)(`span`,{style:{marginLeft:8,opacity:.7},children:`translating…`})]}),(0,w.jsx)(`input`,{name:`occupationAr`,type:`text`,dir:`rtl`,value:l,onChange:e=>d(e.target.value),placeholder:`مثال: موظفة فندق / نادلة (يُملأ تلقائيًا)`})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Issue Date · تاريخ الإصدار`}),(0,w.jsx)(`input`,{name:`issueDate`,type:`date`,required:!0})]}),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Expiry Date · تاريخ الانتهاء`}),(0,w.jsx)(`input`,{name:`expiryDate`,type:`date`,required:!0})]})]}),(0,w.jsxs)(`div`,{className:`form-group`,style:{marginBottom:20},children:[(0,w.jsx)(`label`,{children:`Photo Upload · الصورة`}),(0,w.jsxs)(`label`,{className:`photo-upload`,htmlFor:`photo`,children:[(0,w.jsx)(`span`,{className:`photo-upload-text`,children:n?`Photo selected — click to replace`:`Click to upload passport photo`}),(0,w.jsx)(`input`,{ref:b,id:`photo`,type:`file`,accept:`image/*`,onChange:S,style:{display:`none`}})]})]}),(0,w.jsxs)(`div`,{className:`form-group`,style:{marginBottom:20},children:[(0,w.jsx)(`label`,{children:`Documents / Files · المستندات (Images, PDFs)`}),(0,w.jsxs)(`label`,{className:`photo-upload`,htmlFor:`docs`,children:[(0,w.jsx)(`span`,{className:`photo-upload-text`,children:a.length?`${a.length} file${a.length===1?``:`s`} attached — click to add more`:`Click to upload supporting documents (multi-select)`}),(0,w.jsx)(`input`,{ref:x,id:`docs`,type:`file`,accept:`image/*,application/pdf`,multiple:!0,onChange:C,style:{display:`none`}})]}),a.length>0&&(0,w.jsx)(`div`,{className:`doc-chips`,children:a.map((e,t)=>(0,w.jsxs)(`div`,{className:`doc-chip`,children:[e.type.startsWith(`image/`)?(0,w.jsx)(`img`,{src:e.dataUrl,alt:e.name}):(0,w.jsx)(`span`,{className:`doc-chip-icon`,children:`📄`}),(0,w.jsx)(`span`,{className:`doc-chip-name`,title:e.name,children:e.name}),(0,w.jsx)(`button`,{type:`button`,className:`doc-chip-remove`,onClick:()=>T(t),"aria-label":`Remove ${e.name}`,children:`×`})]},t))})]}),(0,w.jsxs)(`div`,{style:{display:`flex`,gap:12,flexWrap:`wrap`,alignItems:`center`},children:[(0,w.jsx)(`button`,{type:`submit`,className:`btn-generate`,disabled:F,style:F?{opacity:.6,cursor:`wait`}:void 0,children:F?`Saving to Database…`:`Generate eVisa Card`}),e&&(0,w.jsx)(`button`,{type:`button`,className:`btn-reset`,onClick:H,children:`Reset`}),z&&(0,w.jsx)(`span`,{style:{color:`#fca5a5`,fontSize:`0.85rem`},children:z})]})]})]}),e&&(0,w.jsxs)(`div`,{id:`visa-card-preview`,className:`visa-card-wrapper active`,children:[(0,w.jsxs)(`div`,{className:`visa-card`,children:[(0,w.jsxs)(`div`,{className:`ovi-overlay`,children:[(0,w.jsx)(`div`,{className:`ovi-sheen`}),(0,w.jsx)(`div`,{className:`ovi-grid`}),(0,w.jsx)(`div`,{className:`ovi-guilloche`}),(0,w.jsx)(`div`,{className:`ovi-emblem-pattern`,style:{backgroundImage:`url(${E.url})`}}),(0,w.jsx)(`div`,{className:`ovi-kinegram`,children:`MOI · وزارة الداخلية`}),[`tl`,`tr`,`bl`,`br`].map(e=>(0,w.jsx)(`div`,{className:`ovi-holo ovi-holo-${e}`,children:(0,w.jsx)(`img`,{src:E.url,alt:`State of Kuwait emblem`,className:`ovi-holo-img`})},e))]}),(0,w.jsxs)(`div`,{className:`card-header`,children:[(0,w.jsxs)(`div`,{className:`header-left`,children:[(0,w.jsx)(`h2`,{children:`KUWAIT MINISTRY`}),(0,w.jsx)(`p`,{children:`Of Interior · Electronic Visa`})]}),(0,w.jsx)(`div`,{className:`emblem`,children:(0,w.jsx)(`img`,{src:E.url,alt:`Kuwait emblem`,className:`emblem-img`})}),(0,w.jsxs)(`div`,{className:`header-right`,children:[(0,w.jsx)(`h2`,{children:`وزارة الداخلية الكويتية`}),(0,w.jsx)(`p`,{children:`التأشيرة الإلكترونية`})]})]}),(0,w.jsxs)(`div`,{className:`card-body`,children:[(0,w.jsx)(`div`,{className:`watermark`,children:`MLS`}),(0,w.jsxs)(`div`,{className:`info-grid`,children:[(0,w.jsxs)(`div`,{className:`info-section`,children:[(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Full Name · الاسم الكامل`}),(0,w.jsx)(`span`,{className:`info-value`,children:e.name.toUpperCase()}),e.nameAr&&(0,w.jsx)(`span`,{className:`info-value ar`,dir:`rtl`,children:e.nameAr})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Nationality · الجنسية`}),(0,w.jsx)(`span`,{className:`info-value`,children:e.nationality}),e.nationalityAr&&(0,w.jsx)(`span`,{className:`info-value ar`,dir:`rtl`,children:e.nationalityAr})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Passport No. · رقم الجواز`}),(0,w.jsx)(`span`,{className:`info-value highlight`,children:e.passport.toUpperCase()})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Occupation · المهنة`}),(0,w.jsx)(`span`,{className:`info-value`,children:e.occupation}),e.occupationAr&&(0,w.jsx)(`span`,{className:`info-value ar`,dir:`rtl`,children:e.occupationAr})]})]}),(0,w.jsxs)(`div`,{className:`info-section`,children:[(0,w.jsxs)(`div`,{className:`photo-qr-section`,children:[(0,w.jsxs)(`div`,{className:`photo-box`,children:[e.photo?(0,w.jsx)(`img`,{src:e.photo,alt:`Applicant`}):(0,w.jsx)(`span`,{className:`photo-placeholder`,children:`👤`}),(0,w.jsx)(`div`,{className:`photo-label`,children:`OFFICIAL · رسمي`})]}),(0,w.jsx)(`div`,{className:`qr-box`,children:(0,w.jsx)(`img`,{src:`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`MOLS-EVISA-${e.id}-${e.passport}-${e.name.toUpperCase()}`)}`,alt:`QR`})})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`OTP Number · رمز التحقق`}),(0,w.jsx)(`span`,{className:`info-value highlight`,children:e.id})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Database Tracker · معرّف قاعدة البيانات`}),(0,w.jsx)(`span`,{className:`info-value highlight`,style:{color:`#0d3d66`},children:e.tracker})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Reference · المرجع`}),(0,w.jsx)(`span`,{className:`info-value highlight`,style:{color:`#b45309`},children:e.reference})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Visa Type · نوع التأشيرة`}),(0,w.jsx)(`span`,{className:`info-value`,children:e.visaType}),e.visaTypeAr&&(0,w.jsx)(`span`,{className:`info-value ar`,dir:`rtl`,children:e.visaTypeAr})]})]}),(0,w.jsxs)(`div`,{className:`info-section`,children:[(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Date of Birth · تاريخ الميلاد`}),(0,w.jsx)(`span`,{className:`info-value date-block`,children:j(e.birthDate)})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Gender · الجنس`}),(0,w.jsx)(`span`,{className:`info-value`,children:e.gender===`M`?`Male · ذكر`:e.gender===`F`?`Female · أنثى`:e.gender})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Issue Date · تاريخ الإصدار`}),(0,w.jsx)(`span`,{className:`info-value date-block`,children:j(e.issueDate)})]}),(0,w.jsxs)(`div`,{className:`info-item`,children:[(0,w.jsx)(`span`,{className:`info-label`,children:`Expiry Date · تاريخ الانتهاء`}),(0,w.jsx)(`span`,{className:`info-value date-block`,style:{color:`#b45309`},children:j(e.expiryDate)})]})]})]}),(0,w.jsxs)(`div`,{className:`mrz-section`,children:[(0,w.jsx)(`div`,{className:`mrz-line`,children:e.mrz[0]}),(0,w.jsx)(`div`,{className:`mrz-line`,children:e.mrz[1]})]})]}),(0,w.jsxs)(`div`,{className:`card-footer`,children:[(0,w.jsx)(`p`,{children:`KUWAIT MINISTRY OF INTERIOR · وزارة الداخلية الكويتية`}),(0,w.jsx)(`span`,{className:`status-badge`,children:`APPROVED · معتمدة`})]})]}),e.documents&&e.documents.length>0&&(0,w.jsxs)(`div`,{className:`attachments-panel`,children:[(0,w.jsx)(`h3`,{className:`attachments-title`,children:`Attached Documents · المستندات المرفقة`}),(0,w.jsx)(`div`,{className:`attachments-grid`,children:e.documents.map((e,t)=>e.type.startsWith(`image/`)?(0,w.jsxs)(`a`,{href:e.dataUrl,target:`_blank`,rel:`noreferrer`,className:`attachment-img`,children:[(0,w.jsx)(`img`,{src:e.dataUrl,alt:e.name}),(0,w.jsx)(`span`,{className:`attachment-name`,children:e.name})]},t):(0,w.jsxs)(`a`,{href:e.dataUrl,download:e.name,className:`attachment-file`,children:[(0,w.jsx)(`span`,{className:`attachment-icon`,children:`📄`}),(0,w.jsx)(`span`,{className:`attachment-name`,children:e.name})]},t))})]}),(0,w.jsxs)(`div`,{style:{display:`flex`,gap:12,marginTop:20,flexWrap:`wrap`},children:[(0,w.jsx)(`button`,{className:`btn-print`,onClick:()=>window.print(),children:`Print Visa Card`}),(0,w.jsxs)(`div`,{className:`issued-badge`,children:[`OTP: `,(0,w.jsx)(`strong`,{children:e.id}),` · Tracker: `,(0,w.jsx)(`strong`,{children:e.tracker})]})]})]}),(0,w.jsx)(I,{})]})]})}function I(){let[e,t]=(0,h.useState)(null),[r,i]=(0,h.useState)(null),[o,c]=(0,h.useState)(null),[l,d]=(0,h.useState)(null),[f,p]=(0,h.useState)(null),[g,_]=(0,h.useState)(``);async function x(){try{i(null),t(await a())}catch(e){i(e instanceof Error?e.message:`Failed to load visas.`)}}(0,h.useEffect)(()=>{x()},[]);function S(e){d(e),p({name:e.name,passport:e.passport,nationality:e.nationality,gender:e.gender,visaType:e.visaType,occupation:e.occupation,birthDate:e.birthDate,issueDate:e.issueDate,expiryDate:e.expiryDate})}async function C(){if(!(!l||!f)){c(l.id);try{await n(l.id,{...l,...f}),d(null),p(null),await x()}catch(e){i(e instanceof Error?e.message:`Failed to update.`)}finally{c(null)}}}async function T(e){if(confirm(`Delete visa ${e}? This cannot be undone.`)){c(e);try{await s(e),await x()}catch(e){i(e instanceof Error?e.message:`Failed to delete.`)}finally{c(null)}}}let E=(e??[]).filter(e=>{let t=g.trim().toLowerCase();return t?e.id.includes(t)||e.name.toLowerCase().includes(t)||e.passport.toLowerCase().includes(t)||e.nationality.toLowerCase().includes(t):!0});return(0,w.jsxs)(`div`,{className:`generator-section`,style:{marginTop:24},children:[(0,w.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:12},children:[(0,w.jsxs)(`div`,{children:[(0,w.jsx)(`h2`,{className:`generator-title`,style:{fontSize:`1.25rem`},children:`Saved Visas · التأشيرات المحفوظة`}),(0,w.jsx)(`p`,{className:`generator-subtitle`,children:`Manage all issued visa records — edit or delete.`})]}),(0,w.jsx)(`input`,{type:`text`,value:g,onChange:e=>_(e.target.value),placeholder:`Search by OTP / name / passport…`,style:{padding:`10px 14px`,borderRadius:8,border:`1px solid rgba(201,168,76,0.25)`,background:`rgba(255,255,255,0.05)`,color:`#f5f0e6`,minWidth:260}})]}),r&&(0,w.jsx)(`div`,{style:{marginTop:12,color:`#fca5a5`},children:r}),(0,w.jsx)(`div`,{style:{marginTop:16,overflowX:`auto`},children:(0,w.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,color:`#f5f0e6`,fontSize:`0.85rem`},children:[(0,w.jsx)(`thead`,{children:(0,w.jsxs)(`tr`,{style:{textAlign:`left`,color:`var(--mls-gold)`,borderBottom:`1px solid rgba(201,168,76,0.3)`},children:[(0,w.jsx)(`th`,{style:{padding:`10px 8px`},children:`OTP`}),(0,w.jsx)(`th`,{style:{padding:`10px 8px`},children:`Name`}),(0,w.jsx)(`th`,{style:{padding:`10px 8px`},children:`Passport`}),(0,w.jsx)(`th`,{style:{padding:`10px 8px`},children:`Nationality`}),(0,w.jsx)(`th`,{style:{padding:`10px 8px`},children:`Visa Type`}),(0,w.jsx)(`th`,{style:{padding:`10px 8px`},children:`Expiry`}),(0,w.jsx)(`th`,{style:{padding:`10px 8px`,textAlign:`right`},children:`Actions`})]})}),(0,w.jsxs)(`tbody`,{children:[e===null&&(0,w.jsx)(`tr`,{children:(0,w.jsx)(`td`,{colSpan:7,style:{padding:16,textAlign:`center`,opacity:.7},children:`Loading…`})}),e!==null&&E.length===0&&(0,w.jsx)(`tr`,{children:(0,w.jsx)(`td`,{colSpan:7,style:{padding:16,textAlign:`center`,opacity:.7},children:`No visas found.`})}),E.map(e=>(0,w.jsxs)(`tr`,{style:{borderBottom:`1px solid rgba(255,255,255,0.06)`},children:[(0,w.jsx)(`td`,{style:{padding:`10px 8px`,fontFamily:`ui-monospace, monospace`},children:e.id}),(0,w.jsx)(`td`,{style:{padding:`10px 8px`},children:e.name}),(0,w.jsx)(`td`,{style:{padding:`10px 8px`,fontFamily:`ui-monospace, monospace`},children:e.passport}),(0,w.jsx)(`td`,{style:{padding:`10px 8px`},children:e.nationality}),(0,w.jsx)(`td`,{style:{padding:`10px 8px`},children:e.visaType}),(0,w.jsx)(`td`,{style:{padding:`10px 8px`},children:j(e.expiryDate)}),(0,w.jsxs)(`td`,{style:{padding:`10px 8px`,textAlign:`right`,whiteSpace:`nowrap`},children:[(0,w.jsx)(u,{to:`/visa/$id`,params:{id:e.id},style:{color:`var(--mls-gold)`,marginRight:12,fontSize:`0.8rem`},children:`View`}),(0,w.jsx)(`button`,{onClick:()=>S(e),disabled:o===e.id,style:{background:`none`,border:`none`,color:`#93c5fd`,cursor:`pointer`,marginRight:8},"aria-label":`Edit ${e.id}`,children:(0,w.jsx)(v,{className:`h-4 w-4`})}),(0,w.jsx)(`button`,{onClick:()=>T(e.id),disabled:o===e.id,style:{background:`none`,border:`none`,color:`#fca5a5`,cursor:`pointer`},"aria-label":`Delete ${e.id}`,children:(0,w.jsx)(b,{className:`h-4 w-4`})})]})]},e.id))]})]})}),l&&f&&(0,w.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,style:{position:`fixed`,inset:0,background:`rgba(0,0,0,0.65)`,zIndex:100,display:`flex`,alignItems:`center`,justifyContent:`center`,padding:16},onClick:e=>{e.target===e.currentTarget&&(d(null),p(null))},children:(0,w.jsxs)(`div`,{style:{background:`#0f1c30`,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:16,padding:24,width:`100%`,maxWidth:640,maxHeight:`90vh`,overflowY:`auto`,color:`#f5f0e6`},children:[(0,w.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:16},children:[(0,w.jsxs)(`h3`,{style:{margin:0,color:`var(--mls-gold)`,fontFamily:`Cinzel, Georgia, serif`},children:[`Edit Visa · `,l.id]}),(0,w.jsx)(`button`,{onClick:()=>{d(null),p(null)},style:{background:`none`,border:`none`,color:`#f5f0e6`,cursor:`pointer`},"aria-label":`Close`,children:(0,w.jsx)(m,{className:`h-5 w-5`})})]}),(0,w.jsxs)(`div`,{className:`form-grid`,children:[[[`name`,`Full Name (English)`,`text`],[`passport`,`Passport`,`text`],[`nationality`,`Nationality`,`text`],[`occupation`,`Occupation`,`text`],[`visaType`,`Visa Type`,`text`],[`birthDate`,`Date of Birth`,`date`],[`issueDate`,`Issue Date`,`date`],[`expiryDate`,`Expiry Date`,`date`]].map(([e,t,n])=>(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:t}),(0,w.jsx)(`input`,{type:n,value:f[e],onChange:t=>p({...f,[e]:t.target.value})})]},e)),(0,w.jsxs)(`div`,{className:`form-group`,children:[(0,w.jsx)(`label`,{children:`Gender`}),(0,w.jsxs)(`select`,{value:f.gender,onChange:e=>p({...f,gender:e.target.value}),children:[(0,w.jsx)(`option`,{value:`F`,children:`Female`}),(0,w.jsx)(`option`,{value:`M`,children:`Male`})]})]})]}),(0,w.jsxs)(`div`,{style:{display:`flex`,gap:12,marginTop:20,justifyContent:`flex-end`},children:[(0,w.jsx)(`button`,{type:`button`,className:`btn-reset`,onClick:()=>{d(null),p(null)},children:`Cancel`}),(0,w.jsxs)(`button`,{type:`button`,className:`btn-generate`,onClick:C,disabled:o===l.id,style:o===l.id?{opacity:.6,cursor:`wait`}:void 0,children:[(0,w.jsx)(y,{className:`h-4 w-4`,style:{display:`inline`,marginRight:6,verticalAlign:`-3px`}}),o===l.id?`Saving…`:`Save Changes`]})]})]})})]})}var L=`

.mols-admin {
  --mls-blue: #1a5f9e;
  --mls-blue-dark: #0d3d66;
  --mls-blue-light: #e8f1f8;
  --mls-gold: #c9a84c;
  --mls-gold-bright: #e8c96e;
  --mls-gold-dim: #8a7340;
  --mls-cream: #f5f0e6;
  --mls-green: #2e7d32;
  --mls-silver: #a0a8b0;
  --mls-border: #d4c9b0;
  background: linear-gradient(160deg, #0a1628 0%, #1a2a40 30%, #0f1c30 70%, #0a1628 100%);
  color: #333;
  font-family: 'Inter', 'Noto Sans Arabic', system-ui, sans-serif;
}
.mols-admin .generator-section {
  background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
  padding: 32px;
  margin-bottom: 40px;
  border: 1px solid rgba(201,168,76,0.15);
  backdrop-filter: blur(10px);
}
.mols-admin .generator-title {
  color: var(--mls-gold);
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.mols-admin .generator-title::before { content: "◆ "; }
.mols-admin .generator-subtitle {
  color: var(--mls-silver);
  font-size: 0.9rem;
  margin-bottom: 26px;
}
.mols-admin .form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}
.mols-admin .form-group { display: flex; flex-direction: column; }
.mols-admin .form-group label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--mls-gold-dim);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
.mols-admin .form-group input,
.mols-admin .form-group select {
  padding: 12px 14px;
  background: rgba(10,22,40,0.6);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--mls-cream);
  transition: all 0.3s ease;
}
.mols-admin .form-group input:focus,
.mols-admin .form-group select:focus {
  outline: none;
  border-color: var(--mls-gold);
  box-shadow: 0 0 0 3px rgba(201,168,76,0.15);
  background: rgba(10,22,40,0.8);
}
.mols-admin .form-group option { background: #0a1628; color: var(--mls-cream); }
.mols-admin .btn-generate {
  background: linear-gradient(135deg, var(--mls-gold) 0%, var(--mls-gold-dim) 100%);
  color: var(--mls-blue-dark);
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(201,168,76,0.3);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Cinzel', Georgia, serif;
}
.mols-admin .btn-generate:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.5); }
.mols-admin .btn-reset {
  background: rgba(255,255,255,0.08);
  color: var(--mls-cream);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 14px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.85rem;
}
.mols-admin .photo-upload {
  border: 2px dashed rgba(201,168,76,0.3);
  border-radius: 10px;
  padding: 18px;
  text-align: center;
  cursor: pointer;
  background: rgba(10,22,40,0.4);
  display: block;
  transition: all 0.3s ease;
}
.mols-admin .photo-upload:hover { border-color: var(--mls-gold); background: rgba(201,168,76,0.08); }
.mols-admin .photo-upload-text { font-size: 0.85rem; color: var(--mls-silver); }

.mols-admin .visa-card-wrapper { margin-top: 20px; }
.mols-admin .visa-card-wrapper.active { animation: molsFadeUp 0.7s cubic-bezier(0.22,1,0.36,1); }
@keyframes molsFadeUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: none; } }

.mols-admin .visa-card {
  background: linear-gradient(165deg, #faf7f0 0%, #f5f0e6 40%, #ede8db 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.3);
  overflow: hidden;
  border: 1px solid var(--mls-border);
  position: relative;
  color: #333;
}
.mols-admin .visa-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--mls-blue) 0%, var(--mls-gold) 35%, var(--mls-gold-bright) 50%, var(--mls-gold) 65%, var(--mls-blue) 100%);
  z-index: 10;
}
.mols-admin .ovi-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 5; overflow: hidden; border-radius: 20px; }
.mols-admin .ovi-sheen {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.1) 15deg, rgba(0,191,255,0.08) 30deg, rgba(255,0,128,0.06) 45deg, rgba(0,255,128,0.06) 60deg, rgba(255,140,0,0.08) 75deg, transparent 90deg, transparent 180deg, rgba(255,215,0,0.07) 195deg, transparent 360deg);
  animation: molsOviRotate 10s linear infinite;
  mix-blend-mode: overlay;
}
@keyframes molsOviRotate { to { transform: rotate(360deg); } }
.mols-admin .ovi-grid {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,168,76,0.04) 2px, rgba(201,168,76,0.04) 3px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(10,22,40,0.03) 2px, rgba(10,22,40,0.03) 3px);
  animation: molsGrid 5s ease-in-out infinite alternate;
}
@keyframes molsGrid { from { opacity: 0.3; } to { opacity: 0.7; } }
.mols-admin .ovi-guilloche {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 15% 25%, rgba(201,168,76,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 75%, rgba(10,22,40,0.05) 0%, transparent 50%);
  animation: molsGuilloche 12s ease-in-out infinite;
}
@keyframes molsGuilloche { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
.mols-admin .ovi-kinegram {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-family: 'Cinzel', 'Noto Sans Arabic', Georgia, serif;
  font-size: 5rem; font-weight: 900; letter-spacing: 20px;
  color: transparent;
  background: linear-gradient(90deg, rgba(201,168,76,0.0) 0%, rgba(201,168,76,0.18) 50%, rgba(201,168,76,0.0) 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  animation: molsKine 4s ease-in-out infinite;
  white-space: nowrap; z-index: 6;
}
@keyframes molsKine { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

/* Corner emblem containers — clean, clearly visible */
.mols-admin .ovi-holo {
  position: absolute;
  width: 78px; height: 78px;
  z-index: 8;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.mols-admin .ovi-holo-tl { top: 12px; left: 12px; }
.mols-admin .ovi-holo-tr { top: 12px; right: 12px; }
.mols-admin .ovi-holo-bl { bottom: 12px; left: 12px; }
.mols-admin .ovi-holo-br { bottom: 12px; right: 12px; }
.mols-admin .ovi-holo-img {
  width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
}

.mols-admin .card-header {
  background: linear-gradient(135deg, var(--mls-blue-light) 0%, #d4e6f1 100%);
  padding: 22px 32px;
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  border-bottom: 2px solid var(--mls-gold);
  position: relative; z-index: 2;
}
.mols-admin .header-left h2 {
  font-family: 'Cinzel', Georgia, serif;
  color: var(--mls-blue);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
}
.mols-admin .header-left p {
  color: #5a7a94;
  font-size: 0.72rem;
  margin-top: 3px;
  letter-spacing: 2px;
  text-transform: uppercase;
}
.mols-admin .header-right { text-align: right; }
.mols-admin .header-right h2 {
  font-family: 'Noto Sans Arabic', system-ui, sans-serif;
  color: var(--mls-blue);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}
.mols-admin .header-right p {
  font-family: 'Noto Sans Arabic', system-ui, sans-serif;
  color: #5a7a94;
  font-size: 0.85rem;
  margin-top: 3px;
}
.mols-admin .emblem {
  width: 96px; height: 72px;
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 2;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.25));
}
.mols-admin .emblem-img {
  width: 100%; height: 100%; object-fit: contain;
  background: radial-gradient(circle at 50% 50%, rgba(13,61,102,0.9), rgba(13,61,102,0.7));
  padding: 6px; border-radius: 10px;
  border: 1px solid rgba(201,168,76,0.4);
}

.mols-admin .card-body { padding: 28px 32px; position: relative; z-index: 2; }
.mols-admin .watermark {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-family: 'Cinzel', Georgia, serif;
  font-size: 5rem; font-weight: 900;
  color: rgba(26,95,158,0.035);
  letter-spacing: 12px; text-transform: uppercase;
  pointer-events: none; white-space: nowrap; z-index: 1;
}
.mols-admin .info-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 22px;
  position: relative; z-index: 3;
}
@media (max-width: 768px) { .mols-admin .info-grid { grid-template-columns: 1fr; gap: 14px; } }
@media (max-width: 640px) {
  .mols-admin { padding-left: 10px; padding-right: 10px; }
  .mols-admin .generator-section { padding: 18px; border-radius: 14px; }
  .mols-admin .generator-title { font-size: 1.05rem; letter-spacing: 1px; }
  .mols-admin .visa-card { border-radius: 14px; }
  .mols-admin .card-header { padding: 14px 14px; gap: 8px; }
  .mols-admin .header-left h2, .mols-admin .header-right h2 { font-size: 0.85rem; letter-spacing: 1px; }
  .mols-admin .header-left p, .mols-admin .header-right p { font-size: 0.6rem; letter-spacing: 1px; }
  .mols-admin .emblem { width: 56px; height: 46px; }
  .mols-admin .card-body { padding: 18px 14px; }
  .mols-admin .watermark { font-size: 3rem; letter-spacing: 6px; }
  .mols-admin .ovi-kinegram { font-size: 2.2rem; letter-spacing: 8px; }
  .mols-admin .ovi-holo { width: 46px; height: 46px; }
  .mols-admin .ovi-holo-tl, .mols-admin .ovi-holo-tr { top: 6px; }
  .mols-admin .ovi-holo-bl, .mols-admin .ovi-holo-br { bottom: 6px; }
  .mols-admin .ovi-holo-tl, .mols-admin .ovi-holo-bl { left: 6px; }
  .mols-admin .ovi-holo-tr, .mols-admin .ovi-holo-br { right: 6px; }
  .mols-admin .photo-qr-section { gap: 8px; }
  .mols-admin .photo-box { width: 88px; height: 110px; }
  .mols-admin .qr-box { width: 88px; height: 88px; }
  .mols-admin .info-value { font-size: 0.88rem; }
  .mols-admin .info-value.highlight { font-size: 0.95rem; letter-spacing: 0.5px; }
  .mols-admin .mrz-section { padding: 10px 12px; }
  .mols-admin .mrz-line { font-size: 0.6rem; letter-spacing: 1px; word-break: break-all; overflow-wrap: anywhere; }
  .mols-admin .card-footer { padding: 12px 14px; }
  .mols-admin .card-footer p { font-size: 0.6rem; letter-spacing: 1px; }
}
.mols-admin .info-section { display: flex; flex-direction: column; gap: 14px; }
.mols-admin .info-item { display: flex; flex-direction: column; }
.mols-admin .info-label {
  font-size: 0.65rem; font-weight: 700; color: #5a7a94;
  text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px;
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}
.mols-admin .info-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.95rem; font-weight: 600; color: var(--mls-blue-dark);
  word-break: break-word;
}
.mols-admin .info-value.ar {
  font-family: 'Noto Sans Arabic', system-ui, sans-serif;
  font-size: 0.9rem; margin-top: 2px; color: var(--mls-blue);
}
.mols-admin .info-value.highlight {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 1.05rem; font-weight: 700; color: var(--mls-blue); letter-spacing: 1px;
}
.mols-admin .info-value.date-block {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.9rem; font-weight: 600;
}
.mols-admin .photo-qr-section { display: flex; gap: 12px; margin-bottom: 6px; }
.mols-admin .photo-box {
  width: 100px; height: 125px;
  background: linear-gradient(145deg, #f0ebe0 0%, #e8e3d8 100%);
  border: 2px solid #c8dce8; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);
}
.mols-admin .photo-box img { width: 100%; height: 100%; object-fit: cover; }
.mols-admin .photo-placeholder { font-size: 2.5rem; }
.mols-admin .photo-label {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(90deg, var(--mls-blue) 0%, var(--mls-blue-dark) 100%);
  color: white; font-family: 'JetBrains Mono', 'Noto Sans Arabic', monospace;
  font-size: 0.55rem; text-align: center; padding: 3px;
  letter-spacing: 1px; font-weight: 600;
}
.mols-admin .qr-box {
  width: 100px; height: 100px; background: white;
  border: 2px solid #c8dce8; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; padding: 4px;
}
.mols-admin .qr-box img { width: 100%; height: 100%; }
.mols-admin .mrz-section {
  background: linear-gradient(90deg, #f0f4f8 0%, #e8f1f8 50%, #f0f4f8 100%);
  padding: 14px 20px; border-radius: 10px; margin-top: 18px;
  border: 1px solid #d0e3f0; position: relative; z-index: 3;
}
.mols-admin .mrz-line {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem; font-weight: 700; color: var(--mls-blue-dark);
  letter-spacing: 2px; line-height: 1.8; word-break: break-all;
}
.mols-admin .card-footer {
  background: linear-gradient(135deg, #f5f9fc 0%, #e8f1f8 100%);
  padding: 14px 32px; border-top: 2px solid var(--mls-gold);
  display: flex; justify-content: space-between; align-items: center;
  position: relative; z-index: 2; flex-wrap: wrap; gap: 10px;
}
.mols-admin .card-footer p {
  font-size: 0.72rem; color: #5a7a94; letter-spacing: 1.5px; margin: 0;
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}
.mols-admin .status-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: var(--mls-green); padding: 6px 14px; border-radius: 25px;
  font-size: 0.75rem; font-weight: 700; border: 1px solid #a5d6a7; letter-spacing: 1px;
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
}
.mols-admin .status-badge::before {
  content: ""; width: 8px; height: 8px; background: var(--mls-green);
  border-radius: 50%; animation: molsPulseDot 2s infinite; box-shadow: 0 0 8px rgba(46,125,50,0.5);
}
@keyframes molsPulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
.mols-admin .btn-print {
  background: linear-gradient(135deg, var(--mls-green) 0%, #1b5e20 100%);
  color: white; border: none; padding: 12px 26px; border-radius: 10px;
  font-weight: 700; cursor: pointer; letter-spacing: 1px;
  font-family: 'Cinzel', Georgia, serif; text-transform: uppercase;
}
.mols-admin .btn-print:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(46,125,50,0.3); }
.mols-admin .issued-badge {
  display: inline-flex; align-items: center; padding: 12px 20px;
  background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.4);
  border-radius: 10px; color: var(--mls-cream); font-size: 0.9rem; letter-spacing: 1px;
}
.mols-admin .issued-badge strong {
  color: var(--mls-gold-bright); margin-left: 8px;
  font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 1.05rem;
}
@media print {
  .mols-admin { background: white; padding: 0; }
  .mols-admin .generator-section, .mols-admin .btn-print, .mols-admin .issued-badge { display: none !important; }
  .mols-admin .visa-card { box-shadow: none; border: 1px solid #ccc; }
}

/* Holographic emblem guilloche background — tiled Kuwait emblem */
.mols-admin .ovi-emblem-pattern {
  position: absolute; inset: 0;
  background-repeat: repeat;
  background-size: 78px 78px;
  opacity: 0.09;
  mix-blend-mode: multiply;
  animation: molsEmblemHue 14s linear infinite;
  pointer-events: none;
  z-index: 1;
}
@keyframes molsEmblemHue {
  0% { filter: hue-rotate(0deg) saturate(1.1); }
  50% { filter: hue-rotate(180deg) saturate(1.3); }
  100% { filter: hue-rotate(360deg) saturate(1.1); }
}

/* Document upload chips (admin form) */
.mols-admin .doc-chips {
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;
}
.mols-admin .doc-chip {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(10,22,40,0.6);
  border: 1px solid rgba(201,168,76,0.35);
  padding: 6px 10px; border-radius: 8px;
  color: var(--mls-cream); font-size: 0.78rem;
  max-width: 220px;
}
.mols-admin .doc-chip img {
  width: 28px; height: 28px; object-fit: cover; border-radius: 4px;
  border: 1px solid rgba(201,168,76,0.3);
}
.mols-admin .doc-chip-icon { font-size: 1.1rem; }
.mols-admin .doc-chip-name {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;
}
.mols-admin .doc-chip-remove {
  background: transparent; border: none; color: #fca5a5;
  font-size: 1.1rem; cursor: pointer; padding: 0 2px; line-height: 1;
}

/* Attached documents panel below visa card */
.mols-admin .attachments-panel {
  margin-top: 22px;
  background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 16px;
  padding: 18px 20px;
}
.mols-admin .attachments-title {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.95rem; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--mls-gold); margin: 0 0 14px;
}
.mols-admin .attachments-title::before { content: "◆ "; }
.mols-admin .attachments-grid {
  display: grid; gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}
.mols-admin .attachment-img,
.mols-admin .attachment-file {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: rgba(10,22,40,0.5);
  border: 1px solid rgba(201,168,76,0.25);
  border-radius: 10px; padding: 8px; text-decoration: none;
  color: var(--mls-cream); font-size: 0.72rem;
  transition: all 0.25s ease;
}
.mols-admin .attachment-img:hover,
.mols-admin .attachment-file:hover {
  border-color: var(--mls-gold);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(201,168,76,0.15);
}
.mols-admin .attachment-img img {
  width: 100%; height: 110px; object-fit: cover; border-radius: 6px;
  border: 1px solid rgba(201,168,76,0.2);
}
.mols-admin .attachment-icon { font-size: 2.5rem; padding: 18px 0 6px; }
.mols-admin .attachment-name {
  width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  text-align: center; letter-spacing: 0.3px;
}
`;export{D as component};