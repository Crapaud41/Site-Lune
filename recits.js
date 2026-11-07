/* Une fiche .txt dans recits ; la ligne Photo relie le récit au cliché. */
(function(){
  'use strict';
  const box=document.getElementById('lightbox'),toggle=document.getElementById('recitToggle'),panel=document.getElementById('recitPanel');
  const map=new Map(); let loading=null,currentPath='',current=null;
  const key=value=>String(value).normalize('NFC').toLowerCase();
  function photoKey(value){
    try{return key(decodeURIComponent(value).replace(/^\/?photos\//,'').replace(/^\//,''));}catch(e){return key(value);}
  }
  function parse(text){
    const data={photos:[],facts:[],paragraphs:[],sources:[]};let body=[],inBody=false;
    for(let line of text.replace(/^\uFEFF/,'').split(/\r?\n/)){
      line=line.trim();if(line.startsWith('#'))continue;
      const field=line.match(/^([^:]+)\s*:\s*(.*)$/);
      const name=field?key(field[1].trim()):'',value=field?.[2].trim()||'';
      if(['photo','titre','nom scientifique','famille','ordre','milieu','texte','source'].includes(name)){
        inBody=name==='texte';
        if(name==='photo')data.photos.push(photoKey(value));
        else if(name==='titre')data.title=value;
        else if(name==='nom scientifique')data.scientific=value;
        else if(['famille','ordre','milieu'].includes(name))data.facts.push([name,value]);
        else if(name==='texte'&&value)body.push(value);
        else if(name==='source'){
          const [label,...parts]=value.split('|');
          try{const url=new URL(parts.join('|').trim());if(url.protocol==='https:')data.sources.push({label:label.trim(),url:url.href});}catch(e){}
        }
      }else if(inBody)body.push(line);
    }
    data.paragraphs=body.join('\n').split(/\n\s*\n/).map(p=>p.replace(/\n/g,' ').trim()).filter(Boolean);
    return data.photos.length&&data.title&&data.paragraphs.length?data:null;
  }
  async function load(){
    if(loading)return loading;
    loading=(async()=>{
      // Cette première fiche reste disponible si l'API de liste est momentanément indisponible.
      const files=new Set(['lucane-cerf-volant.txt']);
      try{
        const response=await fetch('https://api.github.com/repos/Crapaud41/Site-Lune/contents/recits',{cache:'no-cache'});
        if(response.ok){const entries=await response.json();if(Array.isArray(entries))for(const file of entries)if(file.type==='file'&&/\.txt$/i.test(file.name))files.add(file.name);}
      }catch(e){}
      await Promise.all([...files].map(async name=>{
        try{
          const response=await fetch('recits/'+encodeURIComponent(name),{cache:'no-cache'});if(!response.ok)return;
          const data=parse(await response.text());if(data)for(const path of data.photos)map.set(path,data);
        }catch(e){}
      }));
      update();
    })();return loading;
  }
  function close(focus=true){
    const wasOpen=box.classList.contains('recit-open');
    box.classList.remove('recit-open');panel.hidden=true;toggle.setAttribute('aria-expanded','false');
    if(wasOpen){document.dispatchEvent(new Event('recit:layout'));if(focus&&!toggle.hidden)toggle.focus({preventScroll:true});}
  }
  function update(){
    current=map.get(currentPath)||null;toggle.hidden=!current;
    toggle.setAttribute('aria-label',current?'Découvrir : '+current.title:'Découvrir cette espèce');
  }
  function show(item){close(false);currentPath=photoKey(item.path);update();load();}
  function open(){
    if(!current)return;
    document.getElementById('recitTitle').textContent=current.title;
    const scientific=document.getElementById('recitScientific');scientific.textContent=current.scientific||'';scientific.hidden=!current.scientific;
    const facts=document.getElementById('recitFacts');facts.replaceChildren();
    for(const [label,value]of current.facts){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);facts.append(row);}
    const text=document.getElementById('recitText');text.replaceChildren();
    for(const paragraph of current.paragraphs){const p=document.createElement('p');p.textContent=paragraph;text.append(p);}
    const sources=document.getElementById('recitSources');sources.replaceChildren();
    if(current.sources.length){sources.append('Sources :');for(const source of current.sources){const a=document.createElement('a');a.textContent=source.label;a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a);}}
    panel.hidden=false;box.classList.add('recit-open');toggle.setAttribute('aria-expanded','true');
    document.dispatchEvent(new Event('recit:layout'));panel.focus({preventScroll:true});
  }
  toggle.addEventListener('click',()=>box.classList.contains('recit-open')?close():open());
  document.getElementById('recitBack').addEventListener('click',()=>close());
  window.PhotoRecits={show,close,load,isOpen:()=>box.classList.contains('recit-open')};
})();
