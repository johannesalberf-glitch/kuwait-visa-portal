import{a as e,c as t,i as n,n as r,o as i,s as a,t as o}from"./visa-storage-sCzICmXN.js";import{a as s,d as c,f as l,i as u,n as d,o as f,s as p}from"./index--ublQLgp.js";import{n as m,t as h}from"./arrow-left-DQgKDIQ_.js";var g=l(c(),1);function _(e){let t=u();return g.useCallback(async(...n)=>{try{let t=await e(...n);if(p(t))throw t;return t}catch(e){if(p(e))return e.options._fromLocation=t.stores.location.get(),t.navigate(t.resolveRedirect(e).options);throw e}},[t,e])}var v=m(`circle-check`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),y=m(`log-out`,[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]),b=m(`pencil`,[[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}],[`path`,{d:`m15 5 4 4`,key:`1mk7zo`}]]),x=m(`refresh-cw`,[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`,key:`v9h5vc`}],[`path`,{d:`M21 3v5h-5`,key:`1q7to0`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`,key:`3uifl3`}],[`path`,{d:`M8 16H3v5`,key:`1cv678`}]]),S=m(`save`,[[`path`,{d:`M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z`,key:`1c8476`}],[`path`,{d:`M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7`,key:`1ydtos`}],[`path`,{d:`M7 3v4a1 1 0 0 0 1 1h7`,key:`t51u73`}]]),C=m(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),w=m(`trash-2`,[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]]),T=m(`triangle-alert`,[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,key:`wmoenq`}],[`path`,{d:`M12 9v4`,key:`juzpu7`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]]),E=m(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),D=t({method:`POST`}).handler(f(`09acecb65dbfaa667d8a2486fe12b3c8107af1b4b83340a3302ab08b8221d0f9`)),O=t({method:`GET`}).handler(f(`cf34fdb24dd225129468eb5e0ffc4e998a67899c2ff2322ce8bc37903ed7e7f1`)),k=t({method:`POST`}).handler(f(`3843b1d8cd28064fb269f959871f07de08aaf5369634f8cddfcd8ad5a754d389`)),A=s();function j({children:e}){let t=_(O),n=_(D),r=_(k),[i,a]=(0,g.useState)({state:`loading`}),[o,s]=(0,g.useState)(null),[c,l]=(0,g.useState)(!1);(0,g.useEffect)(()=>{let e=!0;return t().then(t=>{e&&(t.configured?t.authed?a({state:`authed`}):a({state:`unauthed`}):a({state:`misconfigured`,error:t.error??`Server not configured`}))}).catch(()=>{e&&a({state:`unauthed`})}),()=>{e=!1}},[t]);async function u(e){e.preventDefault(),l(!0),s(null);let t=new FormData(e.currentTarget),r=String(t.get(`username`)??``),i=String(t.get(`password`)??``),o=await n({data:{username:r,password:i}});l(!1),o.ok?a({state:`authed`}):s(o.error)}async function d(){await r({data:void 0}),a({state:`unauthed`})}return i.state===`loading`?(0,A.jsx)(`div`,{className:`flex min-h-screen items-center justify-center bg-gray-50 text-gray-600`,children:`Checking session…`}):i.state===`misconfigured`?(0,A.jsx)(`div`,{className:`flex min-h-screen items-center justify-center bg-gray-50 p-6`,children:(0,A.jsxs)(`div`,{className:`max-w-md rounded-xl border border-red-200 bg-white p-6 shadow`,children:[(0,A.jsx)(`h1`,{className:`text-lg font-bold text-red-700`,children:`Admin unavailable`}),(0,A.jsx)(`p`,{className:`mt-2 text-sm text-gray-700`,children:i.error})]})}):i.state===`unauthed`?(0,A.jsx)(`div`,{className:`flex min-h-screen items-center justify-center bg-gray-50 p-6`,children:(0,A.jsxs)(`form`,{onSubmit:u,className:`w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-xl`,children:[(0,A.jsx)(`h1`,{className:`text-center text-2xl font-bold text-[#0b2a6b]`,children:`Admin Login`}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{className:`mb-1 block text-sm font-semibold text-gray-700`,children:`Username`}),(0,A.jsx)(`input`,{name:`username`,autoComplete:`username`,defaultValue:`admin`,className:`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200`,required:!0})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{className:`mb-1 block text-sm font-semibold text-gray-700`,children:`Password`}),(0,A.jsx)(`input`,{name:`password`,type:`password`,autoComplete:`current-password`,className:`w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200`,required:!0})]}),o&&(0,A.jsx)(`p`,{className:`rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600`,children:o}),(0,A.jsx)(`button`,{type:`submit`,disabled:c,className:`w-full rounded-lg bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-900 disabled:opacity-60`,children:c?`Signing in…`:`Sign in`})]})}):(0,A.jsx)(A.Fragment,{children:e(d)})}function M(){return(0,A.jsx)(j,{children:e=>(0,A.jsxs)(A.Fragment,{children:[(0,A.jsxs)(`div`,{className:`flex justify-between items-center bg-[#0a1628] border-b border-[rgba(201,168,76,0.2)] px-6 py-3`,children:[(0,A.jsx)(`span`,{className:`text-[var(--mls-gold)] font-bold tracking-wider text-xs sm:text-sm`,children:`STATE OF KUWAIT · MINISTRY OF INTERIOR ADMIN`}),(0,A.jsxs)(`button`,{onClick:e,className:`inline-flex items-center gap-2 rounded-lg border border-[rgba(201,168,76,0.4)] bg-[rgba(255,255,255,0.06)] px-3.5 py-1.5 text-xs font-semibold text-[#f5f0e6] hover:bg-[rgba(201,168,76,0.15)] transition`,children:[(0,A.jsx)(y,{className:`h-3.5 w-3.5`}),` Sign out`]})]}),(0,A.jsx)(B,{})]})})}var N=[{en:`ETHIOPIA`,ar:`إثيوبيا`},{en:`INDIA`,ar:`الهند`},{en:`PHILIPPINES`,ar:`الفلبين`},{en:`BANGLADESH`,ar:`بنغلاديش`},{en:`PAKISTAN`,ar:`باكستان`},{en:`EGYPT`,ar:`مصر`},{en:`SRI LANKA`,ar:`سريلانكا`},{en:`NEPAL`,ar:`نيبال`},{en:`KENYA`,ar:`كينيا`},{en:`UGANDA`,ar:`أوغندا`},{en:`OTHER`,ar:`أخرى`}],P=[{en:`B - Private Sector Work Visa`,ar:`سمة دخول عمل أهلي`},{en:`18 - Government Work Visa`,ar:`سمة دخول عمل حكومي`},{en:`14 - Visit Visa`,ar:`سمة زيارة`},{en:`20 - Family Visit`,ar:`زيارة عائلية`},{en:`22 - Tourist Visa`,ar:`تأشيرة سياحية`}];function F(e){return e.toString().padStart(2,`0`)}function I(e){if(!e)return``;let t=new Date(e);return isNaN(t.getTime())?e:`${F(t.getDate())}/${F(t.getMonth()+1)}/${t.getFullYear()}`}function L(){return Math.floor(1e5+Math.random()*9e5).toString()}function R(){return Math.floor(1e5+Math.random()*9e5).toString()}function z(e,t,n,r,i,a){let o=e=>e.toUpperCase().replace(/[^A-Z0-9]/g,`<`).padEnd(30,`<`).slice(0,30),s=n.slice(0,3).toUpperCase().padEnd(3,`X`),c=e=>{if(!e)return`000000`;let t=new Date(e);return isNaN(t.getTime())?`000000`:`${(t.getFullYear()%100).toString().padStart(2,`0`)}${F(t.getMonth()+1)}${F(t.getDate())}`},l=i===`M`?`M`:i===`F`?`F`:`X`;return[`V<MLS${o(e)}`.slice(0,44).padEnd(44,`<`),`${(t||``).toUpperCase().padEnd(9,`<`).slice(0,9)}0${s}${c(r)}0${l}${c(a)}0<<<<<<<<<<<<<<`.slice(0,44).padEnd(44,`<`)]}function B(){let[t,n]=(0,g.useState)(null),[r,i]=(0,g.useState)(null),[o,s]=(0,g.useState)([]),[c,l]=(0,g.useState)(``),[u,f]=(0,g.useState)(``),[p,m]=(0,g.useState)(null),[_,v]=(0,g.useState)(()=>L()),[y,b]=(0,g.useState)(()=>R()),[x,S]=(0,g.useState)(0),C=(0,g.useRef)(null),w=(0,g.useRef)(null);function T(e){let t=e.target.files?.[0];if(!t)return;let n=new FileReader;n.onload=()=>{let e=typeof n.result==`string`?n.result:null;if(!e)return;let t=new Image;t.onload=()=>{let n=Math.min(1,400/Math.max(t.width,t.height)),r=Math.round(t.width*n),a=Math.round(t.height*n),o=document.createElement(`canvas`);o.width=r,o.height=a;let s=o.getContext(`2d`);s?(s.drawImage(t,0,0,r,a),i(o.toDataURL(`image/jpeg`,.75))):i(e)},t.onerror=()=>i(e),t.src=e},n.readAsDataURL(t)}function E(e){let t=Array.from(e.target.files??[]);t.length&&Promise.all(t.map(e=>new Promise(t=>{let n=new FileReader;n.onload=()=>{let r=typeof n.result==`string`?n.result:null;if(!r)return t(null);t({name:e.name,type:e.type||`application/octet-stream`,dataUrl:r})},n.onerror=()=>t(null),n.readAsDataURL(e)}))).then(e=>{let t=e.filter(e=>!!e);s(e=>[...e,...t])})}function D(e){s(t=>t.filter((t,n)=>n!==e))}async function O(e){let t=e.trim();if(!t)return``;try{return(await(await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(t)}&langpair=en|ar`)).json())?.responseData?.translatedText??``}catch{return``}}async function k(e,t){if(!t.trim())return;m(e);let n=await O(t);n&&(e===`name`?l(n):f(n)),m(null)}let[j,M]=(0,g.useState)(!1),[F,I]=(0,g.useState)(null);async function B(t){t.preventDefault();let i=new FormData(t.currentTarget),a=_.replace(/\D/g,``).slice(0,6),s=y.replace(/\D/g,``).slice(0,6);if(a.length!==6||s.length!==6){I(`OTP and Tracker must be exactly 6 digits.`);return}let l=`KWT`+Math.floor(1e5+Math.random()*9e5).toString()+String.fromCharCode(65+Math.floor(Math.random()*26)),d=String(i.get(`nationality`)??``),f=String(i.get(`visaType`)??``),p={id:a,tracker:s,name:String(i.get(`name`)??``),passport:String(i.get(`passport`)??``),nationality:d,gender:String(i.get(`gender`)??``),visaType:f,occupation:String(i.get(`occupation`)??``),birthDate:String(i.get(`birthDate`)??``),issueDate:String(i.get(`issueDate`)??``),expiryDate:String(i.get(`expiryDate`)??``),photo:r,documents:o};M(!0),I(null);try{await e(p)}catch(e){M(!1),I(e instanceof Error?e.message:`Failed to save visa. Please try again.`);return}M(!1);let m=z(p.name,p.passport,p.nationality,p.birthDate,p.gender,p.expiryDate);n({...p,nameAr:c,occupationAr:u,nationalityAr:N.find(e=>e.en===d)?.ar??``,visaTypeAr:P.find(e=>e.en===f)?.ar??``,reference:l,mrz:m}),S(e=>e+1),setTimeout(()=>{document.getElementById(`visa-card-preview`)?.scrollIntoView({behavior:`smooth`,block:`start`})},100)}function U(){n(null),i(null),s([]),l(``),f(``),v(L()),b(R()),C.current&&(C.current.value=``),w.current&&(w.current.value=``)}return(0,A.jsxs)(`div`,{className:`mols-admin min-h-screen py-8 px-4`,children:[(0,A.jsx)(`style`,{children:H}),(0,A.jsxs)(`div`,{className:`mx-auto max-w-5xl`,children:[(0,A.jsxs)(d,{to:`/`,className:`mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--mls-gold)] hover:underline`,children:[(0,A.jsx)(h,{className:`h-4 w-4`}),`Back to home`]}),(0,A.jsxs)(`div`,{className:`generator-section`,children:[(0,A.jsx)(`h1`,{className:`generator-title`,children:`Kuwait Ministry of Interior — وزارة الداخلية الكويتية`}),(0,A.jsx)(`p`,{className:`generator-subtitle`,children:`Electronic Visa ID Generator · مولّد بطاقة التأشيرة الإلكترونية`}),(0,A.jsxs)(`form`,{onSubmit:B,children:[(0,A.jsxs)(`div`,{className:`form-grid`,children:[(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`OTP Number · رمز التحقق (6 digits)`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,A.jsx)(`input`,{type:`text`,inputMode:`numeric`,maxLength:6,required:!0,value:_,onChange:e=>v(e.target.value.replace(/\D/g,``).slice(0,6)),placeholder:`6-digit OTP`,style:{flex:1}}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>v(L()),className:`btn-reset`,style:{whiteSpace:`nowrap`},children:`Random`})]})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Database Tracker · معرّف قاعدة البيانات (6 digits)`}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,A.jsx)(`input`,{type:`text`,inputMode:`numeric`,maxLength:6,required:!0,value:y,onChange:e=>b(e.target.value.replace(/\D/g,``).slice(0,6)),placeholder:`6-digit tracker`,style:{flex:1}}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>b(R()),className:`btn-reset`,style:{whiteSpace:`nowrap`},children:`Random`})]})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Full Name (English)`}),(0,A.jsx)(`input`,{name:`name`,type:`text`,required:!0,placeholder:`e.g. MOHAMMED AHMED ALI`,onBlur:e=>k(`name`,e.target.value)})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsxs)(`label`,{children:[`Full Name (Arabic) · الاسم بالعربية`,p===`name`&&(0,A.jsx)(`span`,{style:{marginLeft:8,opacity:.7},children:`translating…`})]}),(0,A.jsx)(`input`,{name:`nameAr`,type:`text`,dir:`rtl`,value:c,onChange:e=>l(e.target.value),placeholder:`مثال: محمد أحمد علي (يُملأ تلقائيًا)`})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Nationality · الجنسية`}),(0,A.jsx)(`select`,{name:`nationality`,defaultValue:`ETHIOPIA`,required:!0,children:N.map(e=>(0,A.jsxs)(`option`,{value:e.en,children:[e.en,` — `,e.ar]},e.en))})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Passport Number · رقم الجواز`}),(0,A.jsx)(`input`,{name:`passport`,type:`text`,required:!0,placeholder:`e.g. A12345678`})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Date of Birth · تاريخ الميلاد`}),(0,A.jsx)(`input`,{name:`birthDate`,type:`date`,required:!0})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Gender · الجنس`}),(0,A.jsxs)(`select`,{name:`gender`,defaultValue:`F`,required:!0,children:[(0,A.jsx)(`option`,{value:`F`,children:`Female — أنثى`}),(0,A.jsx)(`option`,{value:`M`,children:`Male — ذكر`})]})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Visa Type · نوع التأشيرة`}),(0,A.jsx)(`select`,{name:`visaType`,defaultValue:P[0].en,required:!0,children:P.map(e=>(0,A.jsxs)(`option`,{value:e.en,children:[e.en,` — `,e.ar]},e.en))})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Occupation (English)`}),(0,A.jsx)(`input`,{name:`occupation`,type:`text`,required:!0,placeholder:`e.g. Software Engineer / Consultant`,onBlur:e=>k(`occupation`,e.target.value)})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsxs)(`label`,{children:[`Occupation (Arabic) · المهنة`,p===`occupation`&&(0,A.jsx)(`span`,{style:{marginLeft:8,opacity:.7},children:`translating…`})]}),(0,A.jsx)(`input`,{name:`occupationAr`,type:`text`,dir:`rtl`,value:u,onChange:e=>f(e.target.value),placeholder:`مثال: مهندس برمجيات / استشاري (يُملأ تلقائيًا)`})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Issue Date · تاريخ الإصدار`}),(0,A.jsx)(`input`,{name:`issueDate`,type:`date`,required:!0})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Expiry Date · تاريخ الانتهاء`}),(0,A.jsx)(`input`,{name:`expiryDate`,type:`date`,required:!0})]})]}),(0,A.jsxs)(`div`,{className:`form-group`,style:{marginBottom:20},children:[(0,A.jsx)(`label`,{children:`Photo Upload · الصورة`}),(0,A.jsxs)(`label`,{className:`photo-upload`,htmlFor:`photo`,children:[(0,A.jsx)(`span`,{className:`photo-upload-text`,children:r?`Photo selected — click to replace`:`Click to upload passport photo`}),(0,A.jsx)(`input`,{ref:C,id:`photo`,type:`file`,accept:`image/*`,onChange:T,style:{display:`none`}})]})]}),(0,A.jsxs)(`div`,{className:`form-group`,style:{marginBottom:20},children:[(0,A.jsx)(`label`,{children:`Documents / Files · المستندات (Images, PDFs)`}),(0,A.jsxs)(`label`,{className:`photo-upload`,htmlFor:`docs`,children:[(0,A.jsx)(`span`,{className:`photo-upload-text`,children:o.length?`${o.length} file${o.length===1?``:`s`} attached — click to add more`:`Click to upload supporting documents (multi-select)`}),(0,A.jsx)(`input`,{ref:w,id:`docs`,type:`file`,accept:`image/*,application/pdf`,multiple:!0,onChange:E,style:{display:`none`}})]}),o.length>0&&(0,A.jsx)(`div`,{className:`doc-chips`,children:o.map((e,t)=>(0,A.jsxs)(`div`,{className:`doc-chip`,children:[e.type.startsWith(`image/`)?(0,A.jsx)(`img`,{src:e.dataUrl,alt:e.name}):(0,A.jsx)(`span`,{className:`doc-chip-icon`,children:`📄`}),(0,A.jsx)(`span`,{className:`doc-chip-name`,title:e.name,children:e.name}),(0,A.jsx)(`button`,{type:`button`,className:`doc-chip-remove`,onClick:()=>D(t),"aria-label":`Remove ${e.name}`,children:`×`})]},t))})]}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:12,flexWrap:`wrap`,alignItems:`center`},children:[(0,A.jsx)(`button`,{type:`submit`,className:`btn-generate`,disabled:j,style:j?{opacity:.6,cursor:`wait`}:void 0,children:j?`Saving to Database…`:`Generate eVisa Card`}),t&&(0,A.jsx)(`button`,{type:`button`,className:`btn-reset`,onClick:U,children:`Reset`}),F&&(0,A.jsx)(`span`,{style:{color:`#fca5a5`,fontSize:`0.85rem`},children:F})]})]})]}),t&&(0,A.jsxs)(`div`,{id:`visa-card-preview`,className:`my-8`,children:[(0,A.jsx)(a,{record:t,celebrate:!0}),(0,A.jsxs)(`div`,{style:{display:`flex`,gap:12,marginTop:24,justifyContent:`center`,alignItems:`center`,flexWrap:`wrap`},children:[(0,A.jsx)(`button`,{className:`btn-print`,onClick:()=>window.print(),children:`Print Visa Card`}),(0,A.jsxs)(`div`,{className:`issued-badge`,children:[`OTP: `,(0,A.jsx)(`strong`,{children:t.id}),` · Database Tracker: `,(0,A.jsx)(`strong`,{children:t.tracker})]})]})]}),(0,A.jsx)(V,{refreshKey:x,onClearAll:()=>n(null)})]})]})}function V({refreshKey:e,onClearAll:t}){let[a,s]=(0,g.useState)(null),[c,l]=(0,g.useState)(null),[u,f]=(0,g.useState)(null),[p,m]=(0,g.useState)(null),[h,_]=(0,g.useState)(null),[y,D]=(0,g.useState)(null),[O,k]=(0,g.useState)(``),[j,M]=(0,g.useState)(null),[F,L]=(0,g.useState)(!1);async function R(){try{l(null);let e=await n();s(e)}catch(e){l(e instanceof Error?e.message:`Failed to load issued visas.`)}}(0,g.useEffect)(()=>{R()},[e]),(0,g.useEffect)(()=>{if(!u)return;let e=setTimeout(()=>f(null),4e3);return()=>clearTimeout(e)},[u]);function z(e){_(e),D({name:e.name,passport:e.passport,nationality:e.nationality,gender:e.gender,visaType:e.visaType,occupation:e.occupation,birthDate:e.birthDate,issueDate:e.issueDate,expiryDate:e.expiryDate})}async function B(){if(h&&y){m(h.id),l(null);try{await i(h.id,{...h,...y}),_(null),D(null),f(`Visa #${h.id} (${y.name}) updated successfully.`),await R()}catch(e){l(e instanceof Error?e.message:`Failed to update visa record.`)}finally{m(null)}}}async function V(e){m(e.id),l(null);try{await r(e.id),M(null),f(`Visa #${e.id} for ${e.name} has been deleted.`),await R()}catch(e){l(e instanceof Error?e.message:`Failed to delete visa record.`)}finally{m(null)}}async function H(){m(`all`),l(null);try{await o(),L(!1),f(`All issued visa records and applicant data have been permanently cleared.`),t?.(),await R()}catch(e){l(e instanceof Error?e.message:`Failed to clear all visas.`)}finally{m(null)}}let U=(a??[]).filter(e=>{let t=O.trim().toLowerCase();return!t||e.id&&e.id.toLowerCase().includes(t)||e.name&&e.name.toLowerCase().includes(t)||e.passport&&e.passport.toLowerCase().includes(t)||e.nationality&&e.nationality.toLowerCase().includes(t)||e.visaType&&e.visaType.toLowerCase().includes(t)||e.occupation&&e.occupation.toLowerCase().includes(t)});return(0,A.jsxs)(`div`,{id:`manage-visas-section`,className:`generator-section`,style:{marginTop:24},children:[(0,A.jsxs)(`div`,{className:`flex flex-col md:flex-row justify-between items-start md:items-center gap-4`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`h2`,{className:`generator-title`,style:{fontSize:`1.25rem`,margin:0},children:`Saved Visas · التأشيرات المحفوظة`}),(0,A.jsx)(`p`,{className:`generator-subtitle`,style:{margin:`4px 0 0`},children:`Manage all issued visa records — edit or delete.`})]}),(0,A.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2.5 w-full md:w-auto`,children:[(0,A.jsxs)(`div`,{className:`relative flex-1 md:w-72`,children:[(0,A.jsx)(C,{className:`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--mls-gold)] opacity-70 pointer-events-none`}),(0,A.jsx)(`input`,{type:`text`,value:O,onChange:e=>k(e.target.value),placeholder:`Search OTP / name / passport…`,className:`w-full pl-9 pr-8 py-2 rounded-xl border border-[rgba(201,168,76,0.3)] bg-[rgba(10,22,40,0.6)] text-[#f5f0e6] text-xs sm:text-sm outline-none focus:border-[var(--mls-gold)] focus:ring-1 focus:ring-[var(--mls-gold)] transition`}),O&&(0,A.jsx)(`button`,{type:`button`,onClick:()=>k(``),className:`absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded cursor-pointer`,title:`Clear filter`,children:(0,A.jsx)(E,{className:`h-3.5 w-3.5`})})]}),(0,A.jsxs)(`button`,{type:`button`,onClick:()=>void R(),disabled:a===null||p!==null,className:`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.06)] text-[var(--mls-cream)] text-xs font-semibold hover:bg-[rgba(201,168,76,0.15)] transition cursor-pointer disabled:opacity-50`,title:`Refresh records list`,children:[(0,A.jsx)(x,{className:`h-3.5 w-3.5 ${a===null?`animate-spin`:``}`}),(0,A.jsx)(`span`,{className:`hidden sm:inline`,children:`Refresh`})]}),(a??[]).length>0&&(0,A.jsxs)(`button`,{type:`button`,onClick:()=>L(!0),disabled:p!==null,className:`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs font-semibold hover:bg-red-900/60 hover:text-white transition shadow-sm cursor-pointer disabled:opacity-50`,title:`Delete all issued visa records`,children:[(0,A.jsx)(w,{className:`h-3.5 w-3.5 text-red-400`}),(0,A.jsx)(`span`,{children:p===`all`?`Clearing…`:`Clear All`})]})]})]}),O&&a!==null&&(0,A.jsxs)(`div`,{className:`mt-3 flex items-center justify-between text-xs text-[var(--mls-silver)] px-1`,children:[(0,A.jsxs)(`span`,{children:[`Showing `,(0,A.jsx)(`strong`,{children:U.length}),` of `,(0,A.jsx)(`strong`,{children:a.length}),` visa records`]}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>k(``),className:`text-[var(--mls-gold-bright)] hover:underline`,children:`Reset search`})]}),u&&(0,A.jsxs)(`div`,{className:`mt-3.5 flex items-center justify-between gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm animate-in fade-in`,children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,A.jsx)(v,{className:`h-4 w-4 text-emerald-400 shrink-0`}),(0,A.jsx)(`span`,{children:u})]}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>f(null),className:`text-emerald-400 hover:text-white text-xs cursor-pointer`,children:`×`})]}),c&&(0,A.jsxs)(`div`,{className:`mt-3.5 flex items-center justify-between gap-2 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm animate-in fade-in`,children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,A.jsx)(T,{className:`h-4 w-4 text-red-400 shrink-0`}),(0,A.jsx)(`span`,{children:c})]}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>l(null),className:`text-red-400 hover:text-white text-xs cursor-pointer`,children:`×`})]}),a===null&&(0,A.jsxs)(`div`,{className:`my-10 flex items-center justify-center gap-3 text-sm text-[var(--mls-gold-bright)]`,children:[(0,A.jsx)(x,{className:`h-5 w-5 animate-spin text-[var(--mls-gold)]`}),(0,A.jsx)(`span`,{children:`Loading issued visas from database…`})]}),a!==null&&a.length===0&&(0,A.jsxs)(`div`,{className:`my-6 py-12 px-6 text-center rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[rgba(10,22,40,0.5)] shadow-inner`,children:[(0,A.jsx)(`div`,{className:`w-14 h-14 rounded-2xl bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.25)] flex items-center justify-center mx-auto mb-3 text-2xl`,children:`🛡️`}),(0,A.jsx)(`h3`,{className:`text-base sm:text-lg font-bold text-[var(--mls-gold)] font-serif`,children:`No Issued Visa Records in Database`}),(0,A.jsx)(`p`,{className:`text-xs sm:text-sm text-gray-300 mt-1.5 max-w-md mx-auto leading-relaxed`,children:`All user records have been cleaned. Use the official generator above to issue new Kuwait electronic visas.`}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>{window.scrollTo({top:0,behavior:`smooth`})},className:`mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[var(--mls-gold)] to-[var(--mls-gold-bright)] hover:opacity-90 transition shadow cursor-pointer`,children:`↑ Issue New Visa`})]}),a!==null&&a.length>0&&U.length===0&&(0,A.jsxs)(`div`,{className:`my-6 py-10 px-4 text-center rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[rgba(10,22,40,0.4)]`,children:[(0,A.jsx)(`div`,{className:`text-3xl mb-2`,children:`🔍`}),(0,A.jsx)(`h3`,{className:`text-base font-bold text-[var(--mls-gold)] font-serif`,children:`No Visas Match Your Search`}),(0,A.jsxs)(`p`,{className:`text-xs text-gray-300 mt-1 max-w-md mx-auto`,children:[`No visa matching "`,O,`". Try searching by another OTP number, applicant name, or passport.`]}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>k(``),className:`mt-3 text-xs font-semibold text-[var(--mls-gold-bright)] underline hover:text-white cursor-pointer`,children:`Clear Search`})]}),a!==null&&U.length>0&&(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(`div`,{className:`block md:hidden mt-4 space-y-3.5`,children:U.map(e=>(0,A.jsxs)(`div`,{className:`p-4 rounded-xl border border-[rgba(201,168,76,0.25)] bg-[rgba(10,22,40,0.6)] shadow-lg hover:border-[rgba(201,168,76,0.4)] transition`,children:[(0,A.jsxs)(`div`,{className:`flex justify-between items-center mb-2`,children:[(0,A.jsxs)(`span`,{className:`font-mono text-xs font-bold text-[var(--mls-gold-bright)] bg-[rgba(201,168,76,0.15)] px-2.5 py-1 rounded-md border border-[rgba(201,168,76,0.3)]`,children:[`OTP: `,e.id]}),(0,A.jsxs)(`span`,{className:`inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full`,children:[(0,A.jsx)(`span`,{className:`w-1.5 h-1.5 rounded-full bg-emerald-400`}),`APPROVED`]})]}),(0,A.jsx)(`div`,{className:`font-bold text-base text-[#f5f0e6] leading-tight break-words mt-1`,children:e.name}),(0,A.jsxs)(`div`,{className:`grid grid-cols-2 gap-2 mt-2.5 text-xs text-gray-300 bg-[rgba(255,255,255,0.03)] p-2.5 rounded-lg border border-[rgba(255,255,255,0.05)]`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`span`,{className:`text-gray-400 block text-[10px] uppercase font-semibold`,children:`Passport`}),(0,A.jsx)(`strong`,{className:`font-mono text-[#f5f0e6]`,children:e.passport})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`span`,{className:`text-gray-400 block text-[10px] uppercase font-semibold`,children:`Nationality`}),(0,A.jsx)(`span`,{className:`text-[#f5f0e6] truncate block`,children:e.nationality})]}),(0,A.jsxs)(`div`,{className:`col-span-2`,children:[(0,A.jsx)(`span`,{className:`text-gray-400 block text-[10px] uppercase font-semibold`,children:`Visa Type`}),(0,A.jsx)(`span`,{className:`text-amber-200 truncate block`,children:e.visaType})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`span`,{className:`text-gray-400 block text-[10px] uppercase font-semibold`,children:`Occupation`}),(0,A.jsx)(`span`,{className:`text-gray-200 truncate block`,children:e.occupation||`N/A`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`span`,{className:`text-gray-400 block text-[10px] uppercase font-semibold`,children:`Expires`}),(0,A.jsx)(`span`,{className:`font-mono text-amber-300`,children:I(e.expiryDate)})]})]}),(0,A.jsxs)(`div`,{className:`flex justify-end items-center gap-2 mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.08)]`,children:[(0,A.jsx)(d,{to:`/visa/$id`,params:{id:e.id},className:`min-h-[38px] inline-flex items-center gap-1 text-xs font-semibold text-[var(--mls-gold-bright)] hover:underline px-3 py-1.5 rounded-lg bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] transition`,children:`View ↗`}),(0,A.jsxs)(`button`,{type:`button`,onClick:()=>z(e),disabled:p===e.id,className:`min-h-[38px] inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white px-3 py-1.5 rounded-lg bg-blue-900/40 border border-blue-500/40 hover:bg-blue-800/60 transition cursor-pointer`,"aria-label":`Edit visa ${e.id}`,children:[(0,A.jsx)(b,{className:`h-3.5 w-3.5 text-blue-300`}),(0,A.jsx)(`span`,{children:`Edit`})]}),(0,A.jsxs)(`button`,{type:`button`,onClick:()=>M(e),disabled:p===e.id,className:`min-h-[38px] inline-flex items-center gap-1.5 text-xs font-semibold text-red-200 hover:text-white px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-500/40 hover:bg-red-800/60 transition cursor-pointer`,"aria-label":`Delete visa ${e.id}`,children:[(0,A.jsx)(w,{className:`h-3.5 w-3.5 text-red-400`}),(0,A.jsx)(`span`,{children:`Delete`})]})]})]},e.id))}),(0,A.jsx)(`div`,{className:`hidden md:block mt-4 overflow-x-auto rounded-xl border border-[rgba(201,168,76,0.25)] bg-[rgba(10,22,40,0.4)]`,children:(0,A.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`,color:`#f5f0e6`,fontSize:`0.85rem`},children:[(0,A.jsx)(`thead`,{children:(0,A.jsxs)(`tr`,{style:{textAlign:`left`,color:`var(--mls-gold)`,borderBottom:`1px solid rgba(201,168,76,0.3)`,background:`rgba(201,168,76,0.06)`},children:[(0,A.jsx)(`th`,{style:{padding:`12px 10px`},children:`OTP`}),(0,A.jsx)(`th`,{style:{padding:`12px 10px`},children:`Applicant Name`}),(0,A.jsx)(`th`,{style:{padding:`12px 10px`},children:`Passport`}),(0,A.jsx)(`th`,{style:{padding:`12px 10px`},children:`Nationality`}),(0,A.jsx)(`th`,{style:{padding:`12px 10px`},children:`Visa Type`}),(0,A.jsx)(`th`,{style:{padding:`12px 10px`},children:`Expiry Date`}),(0,A.jsx)(`th`,{style:{padding:`12px 10px`,textAlign:`right`},children:`Actions`})]})}),(0,A.jsx)(`tbody`,{children:U.map(e=>(0,A.jsxs)(`tr`,{className:`hover:bg-[rgba(201,168,76,0.05)] transition`,style:{borderBottom:`1px solid rgba(255,255,255,0.06)`},children:[(0,A.jsx)(`td`,{style:{padding:`12px 10px`,fontFamily:`ui-monospace, monospace`,fontWeight:700,color:`var(--mls-gold-bright)`},children:e.id}),(0,A.jsx)(`td`,{style:{padding:`12px 10px`,fontWeight:600},children:e.name}),(0,A.jsx)(`td`,{style:{padding:`12px 10px`,fontFamily:`ui-monospace, monospace`},children:e.passport}),(0,A.jsx)(`td`,{style:{padding:`12px 10px`},children:e.nationality}),(0,A.jsx)(`td`,{style:{padding:`12px 10px`,color:`#fde68a`},children:e.visaType}),(0,A.jsx)(`td`,{style:{padding:`12px 10px`,fontFamily:`ui-monospace, monospace`},children:I(e.expiryDate)}),(0,A.jsxs)(`td`,{style:{padding:`12px 10px`,textAlign:`right`,whiteSpace:`nowrap`},children:[(0,A.jsx)(d,{to:`/visa/$id`,params:{id:e.id},style:{color:`var(--mls-gold-bright)`,marginRight:14,fontSize:`0.82rem`,fontWeight:600},children:`View ↗`}),(0,A.jsxs)(`button`,{type:`button`,onClick:()=>z(e),disabled:p===e.id,className:`inline-flex items-center gap-1 text-blue-300 hover:text-white px-2 py-1 rounded bg-blue-900/30 border border-blue-500/30 mr-2 cursor-pointer`,"aria-label":`Edit ${e.id}`,children:[(0,A.jsx)(b,{className:`h-3.5 w-3.5`}),(0,A.jsx)(`span`,{className:`text-xs`,children:`Edit`})]}),(0,A.jsxs)(`button`,{type:`button`,onClick:()=>M(e),disabled:p===e.id,className:`inline-flex items-center gap-1 text-red-300 hover:text-white px-2 py-1 rounded bg-red-900/30 border border-red-500/30 cursor-pointer`,"aria-label":`Delete ${e.id}`,children:[(0,A.jsx)(w,{className:`h-3.5 w-3.5`}),(0,A.jsx)(`span`,{className:`text-xs`,children:`Delete`})]})]})]},e.id))})]})})]}),j&&(0,A.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,className:`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in`,onClick:e=>{e.target===e.currentTarget&&M(null)},children:(0,A.jsxs)(`div`,{className:`bg-[#0f1c30] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#f5f0e6]`,children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-3 mb-3 text-red-400`,children:[(0,A.jsx)(T,{className:`h-6 w-6`}),(0,A.jsx)(`h3`,{className:`text-lg font-bold font-serif m-0 text-red-300`,children:`Delete Visa Record?`})]}),(0,A.jsxs)(`p`,{className:`text-sm text-gray-300 leading-relaxed mb-4`,children:[`Are you sure you want to permanently delete visa record for`,` `,(0,A.jsx)(`strong`,{className:`text-white`,children:j.name}),` (OTP:`,` `,(0,A.jsx)(`span`,{className:`font-mono font-bold text-amber-300`,children:j.id}),`)? This action cannot be undone.`]}),(0,A.jsxs)(`div`,{className:`flex justify-end gap-3`,children:[(0,A.jsx)(`button`,{type:`button`,className:`btn-reset`,onClick:()=>M(null),disabled:p===j.id,children:`Cancel`}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>void V(j),disabled:p===j.id,className:`px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60`,children:p===j.id?`Deleting…`:`Yes, Delete`})]})]})}),F&&(0,A.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,className:`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in`,onClick:e=>{e.target===e.currentTarget&&L(!1)},children:(0,A.jsxs)(`div`,{className:`bg-[#0f1c30] border border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-[#f5f0e6]`,children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-3 mb-3 text-red-400`,children:[(0,A.jsx)(w,{className:`h-6 w-6`}),(0,A.jsx)(`h3`,{className:`text-lg font-bold font-serif m-0 text-red-300`,children:`Delete ALL Issued Visas?`})]}),(0,A.jsxs)(`p`,{className:`text-sm text-gray-300 leading-relaxed mb-4`,children:[`This action will permanently delete `,(0,A.jsx)(`strong`,{children:`all issued visa records`}),` and applicant info from the database. The database will be wiped clean.`]}),(0,A.jsxs)(`div`,{className:`flex justify-end gap-3`,children:[(0,A.jsx)(`button`,{type:`button`,className:`btn-reset`,onClick:()=>L(!1),disabled:p===`all`,children:`Cancel`}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>void H(),disabled:p===`all`,className:`px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-60 shadow-lg`,children:p===`all`?`Clearing Database…`:`Confirm & Delete All`})]})]})}),h&&y&&(0,A.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,className:`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in`,onClick:e=>{e.target===e.currentTarget&&(_(null),D(null))},children:(0,A.jsxs)(`div`,{className:`bg-[#0f1c30] border border-[rgba(201,168,76,0.35)] rounded-2xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl text-[#f5f0e6] max-h-[92vh] overflow-y-auto my-auto`,children:[(0,A.jsxs)(`div`,{className:`flex justify-between items-center mb-4 pb-3 border-b border-[rgba(201,168,76,0.2)]`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`h3`,{className:`m-0 text-base sm:text-lg font-bold text-[var(--mls-gold)] font-serif`,children:[`Edit Visa · OTP: `,(0,A.jsx)(`span`,{className:`font-mono text-amber-300`,children:h.id})]}),(0,A.jsx)(`p`,{className:`text-xs text-gray-400 m-0 mt-0.5`,children:`Update official visa records in the database.`})]}),(0,A.jsx)(`button`,{type:`button`,onClick:()=>{_(null),D(null)},className:`text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer`,"aria-label":`Close`,children:(0,A.jsx)(E,{className:`h-5 w-5`})})]}),(0,A.jsxs)(`div`,{className:`form-grid`,children:[(0,A.jsxs)(`div`,{className:`form-group sm:col-span-2`,children:[(0,A.jsx)(`label`,{children:`Full Name (English)`}),(0,A.jsx)(`input`,{type:`text`,value:y.name,onChange:e=>D({...y,name:e.target.value}),required:!0})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Passport Number`}),(0,A.jsx)(`input`,{type:`text`,value:y.passport,onChange:e=>D({...y,passport:e.target.value}),required:!0})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Nationality`}),(0,A.jsx)(`select`,{value:y.nationality,onChange:e=>D({...y,nationality:e.target.value}),required:!0,children:N.map(e=>(0,A.jsxs)(`option`,{value:e.en,children:[e.en,` — `,e.ar]},e.en))})]}),(0,A.jsxs)(`div`,{className:`form-group sm:col-span-2`,children:[(0,A.jsx)(`label`,{children:`Visa Type`}),(0,A.jsx)(`select`,{value:y.visaType,onChange:e=>D({...y,visaType:e.target.value}),required:!0,children:P.map(e=>(0,A.jsxs)(`option`,{value:e.en,children:[e.en,` — `,e.ar]},e.en))})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Occupation`}),(0,A.jsx)(`input`,{type:`text`,value:y.occupation,onChange:e=>D({...y,occupation:e.target.value}),required:!0})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Gender`}),(0,A.jsxs)(`select`,{value:y.gender,onChange:e=>D({...y,gender:e.target.value}),required:!0,children:[(0,A.jsx)(`option`,{value:`F`,children:`Female — أنثى`}),(0,A.jsx)(`option`,{value:`M`,children:`Male — ذكر`})]})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Date of Birth`}),(0,A.jsx)(`input`,{type:`date`,value:y.birthDate,onChange:e=>D({...y,birthDate:e.target.value}),required:!0})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Issue Date`}),(0,A.jsx)(`input`,{type:`date`,value:y.issueDate,onChange:e=>D({...y,issueDate:e.target.value}),required:!0})]}),(0,A.jsxs)(`div`,{className:`form-group`,children:[(0,A.jsx)(`label`,{children:`Expiry Date`}),(0,A.jsx)(`input`,{type:`date`,value:y.expiryDate,onChange:e=>D({...y,expiryDate:e.target.value}),required:!0})]})]}),(0,A.jsxs)(`div`,{className:`flex gap-3 mt-6 justify-end pt-3 border-t border-[rgba(255,255,255,0.08)]`,children:[(0,A.jsx)(`button`,{type:`button`,className:`btn-reset`,onClick:()=>{_(null),D(null)},children:`Cancel`}),(0,A.jsxs)(`button`,{type:`button`,className:`btn-generate inline-flex items-center gap-2`,onClick:B,disabled:p===h.id,style:p===h.id?{opacity:.6,cursor:`wait`}:void 0,children:[(0,A.jsx)(S,{className:`h-4 w-4`}),(0,A.jsx)(`span`,{children:p===h.id?`Saving Changes…`:`Save Changes`})]})]})]})})]})}var H=`

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
.mols-admin .ovi-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; border-radius: 20px; }
.mols-admin .ovi-sheen {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.08) 15deg, rgba(0,191,255,0.06) 30deg, transparent 90deg, transparent 360deg);
  animation: molsOviRotate 10s linear infinite;
  mix-blend-mode: overlay; pointer-events: none;
}
@keyframes molsOviRotate { to { transform: rotate(360deg); } }
.mols-admin .ovi-grid {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,168,76,0.04) 2px, rgba(201,168,76,0.04) 3px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(10,22,40,0.03) 2px, rgba(10,22,40,0.03) 3px);
  pointer-events: none;
}
.mols-admin .ovi-guilloche {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 15% 25%, rgba(201,168,76,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 75%, rgba(10,22,40,0.05) 0%, transparent 50%);
  pointer-events: none;
}
.mols-admin .ovi-kinegram {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-family: 'Cinzel', 'Noto Sans Arabic', Georgia, serif;
  font-size: 3.5rem; font-weight: 900; letter-spacing: 16px;
  color: rgba(201,168,76,0.06);
  white-space: nowrap; pointer-events: none; z-index: 1; user-select: none;
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
.mols-admin .watermark { display: none; }
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
  .mols-admin .ovi-kinegram { font-size: 2.2rem; letter-spacing: 8px; }
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
`;export{M as component};