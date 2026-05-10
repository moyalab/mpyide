window.APP_VERSION="0.22.0";function Button(e){const{first:i=!1,size:a="",square:r=!1,icon:l="connect.svg",onClick:f=F=>{},disabled:g=!1,active:s=!1,tooltip:c,label:d,background:h}=e;let _=html``;c&&(_=html`<div class="tooltip">${c}</div>`),_=html``;let v=s?"active":"",y=s?"selected":"",n=h?"inverted":"",o=i?"first":"",u=r?"square":"",p=g?"inactive":"active",k=a==="small"?"":html`<div class="label ${p} ${y}">${d}</div>`;return html`
     <div class="button ${o}">
       <button disabled=${g} class="${u}${a} ${v} ${n}" onclick=${f}>
         <img class="icon" src="media/${l}" />
       </button>
       ${k}
       ${_}
     </div>
   `}(function(){let e=null,i=null;function a(){return e||(e=document.createElement("div"),e.className="editor-context-menu",e.setAttribute("role","menu"),e.style.display="none",document.body.appendChild(e),e)}function r(){e&&(e.style.display="none",e.innerHTML="",i=null,document.removeEventListener("mousedown",l,!0),document.removeEventListener("keydown",f,!0),window.removeEventListener("blur",r),window.removeEventListener("resize",r),window.removeEventListener("scroll",r,!0))}function l(o){e&&e.contains(o.target)||r()}function f(o){o.key==="Escape"&&(o.preventDefault(),r())}function g(o){return o.state.selection.main}function s(o){const u=g(o);return u.from!==u.to}async function c(o){const{from:u,to:p}=g(o);if(u===p)return;const k=o.state.sliceDoc(u,p);try{await navigator.clipboard.writeText(k)}catch(F){return}o.dispatch({changes:{from:u,to:p,insert:""},selection:{anchor:u}}),o.focus()}async function d(o){const{from:u,to:p}=g(o);if(u===p)return;const k=o.state.sliceDoc(u,p);try{await navigator.clipboard.writeText(k)}catch(F){}o.focus()}async function h(o){let u;try{u=await navigator.clipboard.readText()}catch(F){return}if(u==null||u==="")return;const{from:p,to:k}=g(o);o.dispatch({changes:{from:p,to:k,insert:u},selection:{anchor:p+u.length}}),o.focus()}function _(o){o.dispatch({selection:{anchor:0,head:o.state.doc.length}}),o.focus()}function v(o,u,p){const k=document.createElement("div");return k.className="editor-context-menu__item"+(u?"":" is-disabled"),k.setAttribute("role","menuitem"),k.textContent=o,u&&k.addEventListener("click",()=>{r(),p()}),k}function y(o,u){const p=e;p.style.display="block",p.style.left="0px",p.style.top="0px";const k=p.offsetWidth,F=p.offsetHeight,x=window.innerWidth,S=window.innerHeight,D=4;let B=o,M=u;B+k+D>x&&(B=Math.max(D,x-k-D)),M+F+D>S&&(M=Math.max(D,S-F-D)),p.style.left=B+"px",p.style.top=M+"px"}function n(o,u){if(!u)return;i=u;const p=a();p.innerHTML="";const k=window.t||(S=>S),F=s(u);p.appendChild(v(k("editor.menu.cut"),F,()=>c(u))),p.appendChild(v(k("editor.menu.copy"),F,()=>d(u))),p.appendChild(v(k("editor.menu.paste"),!0,()=>h(u)));const x=document.createElement("div");x.className="editor-context-menu__sep",p.appendChild(x),p.appendChild(v(k("editor.menu.selectAll"),!0,()=>_(u))),y(o.clientX,o.clientY),document.addEventListener("mousedown",l,!0),document.addEventListener("keydown",f,!0),window.addEventListener("blur",r),window.addEventListener("resize",r),window.addEventListener("scroll",r,!0)}window.EditorContextMenu={show:n,hide:r}})();const EDITOR_FONT_MIN=8,EDITOR_FONT_MAX=48,EDITOR_FONT_DEFAULT=16,EDITOR_FONT_STEP=1,SNIPPET_MIME="application/vnd.micropython-ide.code-snippet";window.DragSnippet=window.DragSnippet||(function(){let e="";return{set(i){e=i||""},get(){return e},clear(){e=""},MIME:SNIPPET_MIME}})();function getEditorFontSize(){const e=document.documentElement.style.getPropertyValue("--editor-font-size").trim(),i=parseFloat(e);return Number.isFinite(i)?i:EDITOR_FONT_DEFAULT}function setEditorFontSize(e){const i=Math.max(EDITOR_FONT_MIN,Math.min(EDITOR_FONT_MAX,e));document.documentElement.style.setProperty("--editor-font-size",i+"px")}class CodeMirrorEditor extends Component{constructor(){super(),this.editor=null,this.content="# empty file",this.scrollTop=0,this.onWheelZoom=this.onWheelZoom.bind(this),this.onContextMenu=this.onContextMenu.bind(this),this._dropZone=null,this._dropAfterLine=null,this._snippetDragOver=null,this._snippetDragLeave=null,this._snippetDragEnd=null,this._snippetDrop=null}createElement(i){return i&&(this.content=i),html`<div id="code-editor"></div>`}load(i){const a=r=>{this.content=r.state.doc.toString(),this.onChange()};this.editor=createEditor(this.content,i,a),i.addEventListener("wheel",this.onWheelZoom,{passive:!1}),i.addEventListener("contextmenu",this.onContextMenu),this._wheelEl=i,this._installSnippetDnd(),setTimeout(()=>{this.editor.scrollDOM.addEventListener("scroll",this.updateScrollPosition.bind(this)),this.editor.scrollDOM.scrollTo({top:this.scrollTop,left:0})},10)}update(){return!1}unload(){this.editor.scrollDOM.removeEventListener("scroll",this.updateScrollPosition),this._wheelEl&&(this._wheelEl.removeEventListener("wheel",this.onWheelZoom,{passive:!1}),this._wheelEl.removeEventListener("contextmenu",this.onContextMenu),this._wheelEl=null),this._uninstallSnippetDnd(),window.EditorContextMenu&&window.EditorContextMenu.hide()}onContextMenu(i){!window.EditorContextMenu||!this.editor||(i.preventDefault(),i.stopPropagation(),window.EditorContextMenu.show(i,this.editor))}onWheelZoom(i){if(!i.ctrlKey)return;i.preventDefault(),i.stopPropagation();const a=getEditorFontSize(),r=i.deltaY<0?EDITOR_FONT_STEP:-EDITOR_FONT_STEP;setEditorFontSize(a+r),this.editor&&typeof this.editor.requestMeasure=="function"&&(this.editor.viewState&&(this.editor.viewState.mustMeasureContent="refresh"),this.editor.requestMeasure())}updateScrollPosition(i){this.scrollTop=i.target.scrollTop}onChange(){return!1}_installSnippetDnd(){if(!this.editor)return;const i=this.editor.dom,a=r=>{const l=r.dataTransfer&&r.dataTransfer.types;return!!l&&Array.from(l).indexOf(SNIPPET_MIME)!==-1};this._snippetDragOver=r=>{if(!a(r))return;r.preventDefault(),r.stopPropagation(),r.dataTransfer&&(r.dataTransfer.dropEffect="copy");const l=window.DragSnippet&&window.DragSnippet.get()||"";l&&this._showSnippetDropZone(r.clientX,r.clientY,l)},this._snippetDragLeave=r=>{r.relatedTarget&&i.contains(r.relatedTarget)||this._clearSnippetDropZone()},this._snippetDragEnd=()=>this._clearSnippetDropZone(),this._snippetDrop=r=>{if(!a(r))return;r.preventDefault(),r.stopPropagation();const l=r.dataTransfer&&r.dataTransfer.getData(SNIPPET_MIME)||window.DragSnippet&&window.DragSnippet.get()||"",f=this._dropAfterLine;this._clearSnippetDropZone(),window.DragSnippet&&window.DragSnippet.clear(),l&&this._insertSnippet(l,f,r.clientX,r.clientY)},i.addEventListener("dragover",this._snippetDragOver,!0),i.addEventListener("dragleave",this._snippetDragLeave,!0),i.addEventListener("dragend",this._snippetDragEnd,!0),i.addEventListener("drop",this._snippetDrop,!0),this._snippetWindowEnd=()=>this._clearSnippetDropZone(),window.addEventListener("dragend",this._snippetWindowEnd),window.addEventListener("drop",this._snippetWindowEnd)}_uninstallSnippetDnd(){if(!this.editor)return;const i=this.editor.dom;this._snippetDragOver&&i.removeEventListener("dragover",this._snippetDragOver,!0),this._snippetDragLeave&&i.removeEventListener("dragleave",this._snippetDragLeave,!0),this._snippetDragEnd&&i.removeEventListener("dragend",this._snippetDragEnd,!0),this._snippetDrop&&i.removeEventListener("drop",this._snippetDrop,!0),this._snippetWindowEnd&&(window.removeEventListener("dragend",this._snippetWindowEnd),window.removeEventListener("drop",this._snippetWindowEnd)),this._clearSnippetDropZone()}_clearSnippetDropZone(){this._dropZone&&this._dropZone.parentNode&&this._dropZone.parentNode.removeChild(this._dropZone),this._dropZone=null,this._dropAfterLine=null}_resolveAfterLine(i,a){const r=this.editor;if(!r)return null;const l=r.state.doc,f=l.lines;let g=r.posAtCoords({x:i,y:a});if(g==null){const _=r.dom.getBoundingClientRect();return a<_.top+_.height/2?0:f}const s=l.lineAt(g).number,c=r.coordsAtPos(l.line(s).from);if(!c)return s;const d=r.defaultLineHeight||c.bottom-c.top||16;return a>c.top+d/2?s:s-1}_showSnippetDropZone(i,a,r){const l=this.editor;if(!l)return;const f=l.state.doc,g=f.lines,s=this._resolveAfterLine(i,a);if(s==null||this._dropAfterLine===s&&this._dropZone)return;this._clearSnippetDropZone(),this._dropAfterLine=s;let c;if(s<=0){const F=l.coordsAtPos(0);if(!F)return;c=F.top}else if(s>=g){const F=f.line(g),x=l.coordsAtPos(F.to);if(!x)return;c=x.bottom}else{const F=f.line(s+1),x=l.coordsAtPos(F.from);if(!x)return;c=x.top}const d=l.dom.getBoundingClientRect(),h=Math.max(d.top,Math.min(d.bottom-2,c)),_=l.defaultLineHeight||18,v=parseFloat(getComputedStyle(l.contentDOM).fontSize)||14,n=String(r).split(`
`).length*_+6,o=Math.max(0,d.bottom-h),u=document.createElement("div");u.className="snippet-drop-zone",u.style.position="fixed",u.style.top=`${h}px`,u.style.left=`${d.left}px`,u.style.width=`${d.width}px`,u.style.height=`${Math.min(n,o)}px`,u.style.zIndex="50",u.style.pointerEvents="none";const p=document.createElement("div");p.className="snippet-drop-bar",u.appendChild(p);const k=document.createElement("pre");k.className="snippet-drop-ghost",k.style.fontSize=`${v}px`,k.style.lineHeight=`${_}px`,k.textContent=r,u.appendChild(k),document.body.appendChild(u),this._dropZone=u}_insertSnippet(i,a,r,l){const f=this.editor;if(!f)return;const g=f.state.doc,s=g.lines,c=i.endsWith(`
`)?i.slice(0,-1):i;let d=a;d==null&&(d=this._resolveAfterLine(r,l),d==null&&(d=s));let h,_;d>=s?(h=g.length,_=`
${c}`):d<=0?(h=0,_=`${c}
`):(h=g.line(d+1).from,_=`${c}
`);const v=h+_.length;f.dispatch({changes:{from:h,to:h,insert:_},selection:{anchor:v},scrollIntoView:!0}),f.focus()}}function Tab(e){const{text:i="undefined",icon:a="ms-computer.svg",onSelectTab:r=()=>!1,onCloseTab:l=()=>!1,onStartRenaming:f=()=>!1,onFinishRenaming:g=()=>!1,disabled:s=!1,active:c=!1,renaming:d=!1,hasChanges:h=!1}=e;if(c)if(d){let n=function(u){g(u.target.value)},o=function(u){u.key.toLowerCase()==="enter"&&u.target.blur(),u.key.toLowerCase()==="escape"&&(u.target.value=null,u.target.blur())};var v=n,y=o;return html`
        <div class="tab active" tabindex="0">
          <img class="icon" src="media/${a}" />
          <div class="text">
            <input type="text"
              value=${i}
              onblur=${n}
              onkeydown=${o}
              />
          </div>
        </div>
      `}else return html`
        <div class="tab active" tabindex="0">
          <img class="icon" src="media/${a}" />
          <div class="text"
               onclick=${f}
               ondblclick=${f}>
            ${h?" *":""} ${i}
          </div>
          <div class="options" >
            <button onclick=${l}>
              <img class="icon" src="media/close.svg" />
            </button>
          </div>
        </div>
      `;function _(n){n.target.classList.contains("close-tab")||r(n)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${_}
      >
      <img class="icon" src="media/${a}" />
      <div class="text">
        ${h?"*":""} ${i}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${l}>
          <img class="close-tab icon" src="media/close.svg" />
        </button>
      </div>
    </div>
  `}class XTerm extends Component{constructor(i,a,r){super(i),this.term=new Terminal({fontSize:16,fontFamily:'"CodeFont", monospace',fontWeight:"normal",lineHeight:1.2,theme:{background:"#0d1b2a",foreground:"#e0eaea",cursor:"#ffffff",cursorAccent:"#0d1b2a",selectionBackground:"rgba(0, 212, 170, 0.25)",black:"#1e2d3d",red:"#ff6b6b",green:"#4ecdc4",yellow:"#ffd166",blue:"#5b9bd5",magenta:"#c792ea",cyan:"#00d4aa",white:"#e0eaea",brightBlack:"#4a6070",brightRed:"#ff8e8e",brightGreen:"#7be4dc",brightYellow:"#ffe599",brightBlue:"#80b8e8",brightMagenta:"#d6b0f5",brightCyan:"#33dfbb",brightWhite:"#f5fafa"}}),this.resizeTerm=this.resizeTerm.bind(this)}load(i){this.term.open(i),this.resizeTerm(),window.addEventListener("resize",this.resizeTerm)}createElement(){return html`<div class="terminal-wrapper"></div>`}update(){return this.resizeTerm(),!1}resizeTerm(){if(document.querySelector("#panel")){const i=window.getComputedStyle(document.querySelector("#panel")),a=parseInt(i.getPropertyValue("width")),r=parseInt(i.getPropertyValue("height")),l=Math.floor(a/this.term._core._renderService.dimensions.actualCellWidth)-6,f=Math.floor((r-PANEL_CLOSED)/this.term._core._renderService.dimensions.actualCellHeight)-2;this.term.resize(l,f)}}}const I18N_STORAGE_KEY="language",I18N_SUPPORTED=["en","ko"],I18N_DICT={en:{"toolbar.connect":"Connect","toolbar.disconnect":"Disconnect","toolbar.reset":"Reset","toolbar.run":"Run","toolbar.stop":"Stop","toolbar.new":"New","toolbar.save":"Save","toolbar.addPackage":"Add Package","toolbar.fullScreen":"Full Screen","toolbar.exitFullScreen":"Exit Full","toolbar.settings":"Settings","toolbar.tooltip.connect":"Connect ({shortcut})","toolbar.tooltip.disconnect":"Disconnect ({shortcut})","toolbar.tooltip.reset":"Reset ({shortcut})","toolbar.tooltip.run":"Run ({shortcut})","toolbar.tooltip.stop":"Stop ({shortcut})","toolbar.tooltip.new":"New ({shortcut})","toolbar.tooltip.save":"Save ({shortcut})","toolbar.tooltip.addPackageEnabled":"Install a MicroPython package onto the board","toolbar.tooltip.addPackageDisabled":"Connect to a board first","toolbar.tooltip.enterFullScreen":"Enter full screen","toolbar.tooltip.exitFullScreen":"Exit full screen","toolbar.tooltip.settings":"Toggle settings sidebar","sidebar.connectToBoard":"Connect to board","sidebar.selectFolder":"Select a folder...","sidebar.refresh":"Refresh file list","sidebar.deleteBoard":"Delete selected files on board","sidebar.deleteDisk":"Delete selected files on disk","sidebar.toggle":"Toggle sidebar","sidebar.hideFiles":"Hide files","sidebar.showFiles":"Show files","repl.connectedTo":"Connected to {name}","repl.showTerminal":"Show terminal","repl.copy":"Copy","repl.paste":"Paste","repl.clean":"Clean ({shortcut})","dialog.install.title":"Install a MicroPython package","dialog.install.search":"Search packages\u2026","dialog.install.loading":"Loading package list\u2026","dialog.install.noResults":"No packages match your search.","dialog.install.unnamed":"(unnamed)","dialog.install.working":"Working\u2026","dialog.install.installThis":"Install this package","dialog.install.openDocs":"Open documentation","dialog.install.noDocs":"No documentation URL available","dialog.install.overwrite":"Overwrite existing","dialog.install.installAsMpy":"Install as .mpy when available","dialog.install.fromUrl":"Install from URL","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"Install","dialog.install.close":"Close","dialog.install.closeDisabled":"Cannot close while installing","dialog.install.mpyNotSupported":"Board does not report an .mpy format \u2014 only .py will be installed","dialog.install.mpyFormatArch":"Board: {arch}, format {format}","dialog.install.mpyFormatOnly":"Format {format}","dialog.install.resolving":"Resolving\u2026","dialog.install.installed":"Installed.","dialog.newFile.title":"Create new file","dialog.newFile.close":"Close","dialog.newFile.board":"Board","dialog.newFile.computer":"Computer","dialog.ok":"OK","dialog.cancel":"Cancel","dialog.yes":"Yes","dialog.unsaved.title":"Unsaved Changes","dialog.unsaved.msg":"Your file has unsaved changes. Are you sure you want to proceed?","dialog.unsaved.msgMayHave":"You may have unsaved changes. Are you sure you want to proceed?","dialog.connectFailed.title":"Connection Failed","dialog.connectFailed.msg":"Could not connect to the board. Reset it and try again.","dialog.fileExists.title":"File Already Exists","dialog.fileExists.msg":"File {name} already exists on {source}. Please choose another name.","dialog.overwrite.title":"Confirm Overwrite","dialog.overwrite.msgFile":`You are about to overwrite the file {name} on your {source}.

 Are you sure you want to proceed?`,"dialog.overwrite.msgFileBoard":`You are about to overwrite the file {name} on your board.

Are you sure you want to proceed?`,"dialog.overwrite.msgFileDisk":`You are about to overwrite the file {name} on your disk.

Are you sure you want to proceed?`,"dialog.overwrite.msgValueBoard":`You are about to overwrite {name} on your board.

Are you sure you want to proceed?`,"dialog.overwrite.msgValueDisk":`You are about to overwrite {name} on your disk.

Are you sure you want to proceed?`,"dialog.overwrite.msgSingleBoardHeader":`You are about to overwrite the following file/folder on your board:

`,"dialog.overwrite.msgSingleDiskHeader":`You are about to overwrite the following file/folder on your disk:

`,"dialog.overwrite.msgManyBoardHeader":`You are about to overwrite the following files/folders on your board:

`,"dialog.overwrite.msgManyDiskHeader":`You are about to overwrite the following files/folders on your disk:

`,"dialog.overwrite.proceed":"Are you sure you want to proceed?","dialog.delete.title":"Confirm Delete","dialog.delete.header":`You are about to delete the following files:

`,"dialog.delete.fromBoard":`From your board:
`,"dialog.delete.fromDisk":`From your disk:
`,"overlay.loading":"Loading files...","overlay.removing":"Removing...","overlay.connecting":"Connecting...","overlay.saving":"Saving file... {progress}","overlay.transferring":"Transferring file","toast.boardDisconnected":"Board disconnected.","toast.packageRegistryFailed":"Could not load package registry: {err}","settings.title":"Settings","settings.close":"Close settings","settings.language":"Language","settings.apply":"Apply","settings.shortcuts.title":"Shortcuts","settings.shortcuts.clearEditor":"Clear all editor code","settings.shortcuts.run":"Run","settings.shortcuts.stop":"Stop","editor.menu.cut":"Cut","editor.menu.copy":"Copy","editor.menu.paste":"Paste","editor.menu.selectAll":"Select All","activity.explorer":"Explorer","activity.mpy":"MPY","activity.bitblock":"BitBlock","activity.settings":"Settings","topic.loading":"Loading\u2026","topic.error":"Failed to load: {err}","topic.back":"Back","topic.empty":"No topics yet."},ko:{"toolbar.connect":"\uC5F0\uACB0","toolbar.disconnect":"\uC5F0\uACB0 \uD574\uC81C","toolbar.reset":"\uC7AC\uC2DC\uC791","toolbar.run":"\uC2E4\uD589","toolbar.stop":"\uC911\uC9C0","toolbar.new":"\uC0C8 \uD30C\uC77C","toolbar.save":"\uC800\uC7A5","toolbar.addPackage":"\uD328\uD0A4\uC9C0 \uCD94\uAC00","toolbar.fullScreen":"\uC804\uCCB4 \uD654\uBA74","toolbar.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.settings":"\uC124\uC815","toolbar.tooltip.connect":"\uC5F0\uACB0 ({shortcut})","toolbar.tooltip.disconnect":"\uC5F0\uACB0 \uD574\uC81C ({shortcut})","toolbar.tooltip.reset":"\uC7AC\uC2DC\uC791 ({shortcut})","toolbar.tooltip.run":"\uC2E4\uD589 ({shortcut})","toolbar.tooltip.stop":"\uC911\uC9C0 ({shortcut})","toolbar.tooltip.new":"\uC0C8 \uD30C\uC77C ({shortcut})","toolbar.tooltip.save":"\uC800\uC7A5 ({shortcut})","toolbar.tooltip.addPackageEnabled":"\uBCF4\uB4DC\uC5D0 MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","toolbar.tooltip.addPackageDisabled":"\uBA3C\uC800 \uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD558\uC138\uC694","toolbar.tooltip.enterFullScreen":"\uC804\uCCB4 \uD654\uBA74\uC73C\uB85C \uC804\uD658","toolbar.tooltip.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.tooltip.settings":"\uC124\uC815 \uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","sidebar.connectToBoard":"\uBCF4\uB4DC \uC5F0\uACB0","sidebar.selectFolder":"\uD3F4\uB354\uB97C \uC120\uD0DD\uD558\uC138\uC694...","sidebar.refresh":"\uD30C\uC77C \uBAA9\uB85D \uC0C8\uB85C \uACE0\uCE68","sidebar.deleteBoard":"\uBCF4\uB4DC\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.deleteDisk":"\uB514\uC2A4\uD06C\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.toggle":"\uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","sidebar.hideFiles":"\uD30C\uC77C \uC228\uAE30\uAE30","sidebar.showFiles":"\uD30C\uC77C \uBCF4\uC774\uAE30","repl.connectedTo":"{name}\uC5D0 \uC5F0\uACB0\uB428","repl.showTerminal":"\uD130\uBBF8\uB110 \uD45C\uC2DC","repl.copy":"\uBCF5\uC0AC","repl.paste":"\uBD99\uC5EC\uB123\uAE30","repl.clean":"\uC9C0\uC6B0\uAE30 ({shortcut})","dialog.install.title":"MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.search":"\uD328\uD0A4\uC9C0 \uAC80\uC0C9\u2026","dialog.install.loading":"\uD328\uD0A4\uC9C0 \uBAA9\uB85D \uBD88\uB7EC\uC624\uB294 \uC911\u2026","dialog.install.noResults":"\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.","dialog.install.unnamed":"(\uC774\uB984 \uC5C6\uC74C)","dialog.install.working":"\uC791\uC5C5 \uC911\u2026","dialog.install.installThis":"\uC774 \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.openDocs":"\uBB38\uC11C \uC5F4\uAE30","dialog.install.noDocs":"\uBB38\uC11C URL\uC774 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.overwrite":"\uAE30\uC874 \uD30C\uC77C \uB36E\uC5B4\uC4F0\uAE30","dialog.install.installAsMpy":"\uAC00\uB2A5\uD558\uBA74 .mpy\uB85C \uC124\uCE58","dialog.install.fromUrl":"URL\uC5D0\uC11C \uC124\uCE58","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"\uC124\uCE58","dialog.install.close":"\uB2EB\uAE30","dialog.install.closeDisabled":"\uC124\uCE58 \uC911\uC5D0\uB294 \uB2EB\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.mpyNotSupported":"\uBCF4\uB4DC\uAC00 .mpy \uD3EC\uB9F7\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544 .py\uB9CC \uC124\uCE58\uB429\uB2C8\uB2E4","dialog.install.mpyFormatArch":"\uBCF4\uB4DC: {arch}, \uD3EC\uB9F7 {format}","dialog.install.mpyFormatOnly":"\uD3EC\uB9F7 {format}","dialog.install.resolving":"\uBD84\uC11D \uC911\u2026","dialog.install.installed":"\uC124\uCE58\uB428.","dialog.newFile.title":"\uC0C8 \uD30C\uC77C \uB9CC\uB4E4\uAE30","dialog.newFile.close":"\uB2EB\uAE30","dialog.newFile.board":"\uBCF4\uB4DC","dialog.newFile.computer":"\uCEF4\uD4E8\uD130","dialog.ok":"\uD655\uC778","dialog.cancel":"\uCDE8\uC18C","dialog.yes":"\uC608","dialog.unsaved.title":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D","dialog.unsaved.msg":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.unsaved.msgMayHave":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.connectFailed.title":"\uC5F0\uACB0 \uC2E4\uD328","dialog.connectFailed.msg":"\uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC7AC\uC2DC\uC791 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","dialog.fileExists.title":"\uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4","dialog.fileExists.msg":"{source}\uC5D0 {name} \uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4. \uB2E4\uB978 \uC774\uB984\uC744 \uC0AC\uC6A9\uD558\uC138\uC694.","dialog.overwrite.title":"\uB36E\uC5B4\uC4F0\uAE30 \uD655\uC778","dialog.overwrite.msgFile":`{source}\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

 \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgFileBoard":`\uBCF4\uB4DC\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgFileDisk":`\uB514\uC2A4\uD06C\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgValueBoard":`\uBCF4\uB4DC\uC5D0 \uC788\uB294 {name}\uC744(\uB97C) \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgValueDisk":`\uB514\uC2A4\uD06C\uC5D0 \uC788\uB294 {name}\uC744(\uB97C) \uB36E\uC5B4\uC501\uB2C8\uB2E4.

\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?`,"dialog.overwrite.msgSingleBoardHeader":`\uBCF4\uB4DC\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB97C \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.msgSingleDiskHeader":`\uB514\uC2A4\uD06C\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB97C \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.msgManyBoardHeader":`\uBCF4\uB4DC\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB4E4\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.msgManyDiskHeader":`\uB514\uC2A4\uD06C\uC758 \uB2E4\uC74C \uD30C\uC77C/\uD3F4\uB354\uB4E4\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4:

`,"dialog.overwrite.proceed":"\uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.delete.title":"\uC0AD\uC81C \uD655\uC778","dialog.delete.header":`\uB2E4\uC74C \uD30C\uC77C\uB4E4\uC744 \uC0AD\uC81C\uD569\uB2C8\uB2E4:

`,"dialog.delete.fromBoard":`\uBCF4\uB4DC\uC5D0\uC11C:
`,"dialog.delete.fromDisk":`\uB514\uC2A4\uD06C\uC5D0\uC11C:
`,"overlay.loading":"\uD30C\uC77C \uBD88\uB7EC\uC624\uB294 \uC911...","overlay.removing":"\uC0AD\uC81C \uC911...","overlay.connecting":"\uC5F0\uACB0 \uC911...","overlay.saving":"\uD30C\uC77C \uC800\uC7A5 \uC911... {progress}","overlay.transferring":"\uD30C\uC77C \uC804\uC1A1 \uC911","toast.boardDisconnected":"\uBCF4\uB4DC\uC640 \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4.","toast.packageRegistryFailed":"\uD328\uD0A4\uC9C0 \uB808\uC9C0\uC2A4\uD2B8\uB9AC \uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328: {err}","settings.title":"\uC124\uC815","settings.close":"\uC124\uC815 \uB2EB\uAE30","settings.language":"\uC5B8\uC5B4","settings.apply":"\uC801\uC6A9","settings.shortcuts.title":"\uB2E8\uCD95\uD0A4","settings.shortcuts.clearEditor":"\uC5D0\uB514\uD130 \uCF54\uB4DC \uC804\uCCB4 \uC9C0\uC6B0\uAE30","settings.shortcuts.run":"\uC2E4\uD589","settings.shortcuts.stop":"\uC815\uC9C0","editor.menu.cut":"\uC798\uB77C\uB0B4\uAE30","editor.menu.copy":"\uBCF5\uC0AC","editor.menu.paste":"\uBD99\uC5EC\uB123\uAE30","editor.menu.selectAll":"\uC804\uCCB4 \uC120\uD0DD","activity.explorer":"\uD30C\uC77C","activity.mpy":"MPY","activity.bitblock":"\uBE44\uD2B8\uBE14\uB85D","activity.settings":"\uC124\uC815","topic.loading":"\uBD88\uB7EC\uC624\uB294 \uC911\u2026","topic.error":"\uB85C\uB4DC \uC2E4\uD328: {err}","topic.back":"\uB4A4\uB85C","topic.empty":"\uC544\uC9C1 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}};function i18nDetectDefault(){const e=(navigator.language||"en").split("-")[0].toLowerCase();return I18N_SUPPORTED.includes(e)?e:"en"}function i18nGetStored(){try{return localStorage.getItem(I18N_STORAGE_KEY)}catch(e){return null}}function i18nSetStored(e){try{localStorage.setItem(I18N_STORAGE_KEY,e)}catch(i){}}let __i18nLang=(function(){const e=i18nGetStored();return e&&I18N_SUPPORTED.includes(e)?e:i18nDetectDefault()})();function applyHtmlLang(e){typeof document!="undefined"&&document.documentElement&&(document.documentElement.lang=e)}applyHtmlLang(__i18nLang);function t(e,i){const a=I18N_DICT[__i18nLang]||I18N_DICT.en;let r=a[e]!==void 0?a[e]:I18N_DICT.en[e]!==void 0?I18N_DICT.en[e]:e;if(i)for(const l in i)r=r.split("{"+l+"}").join(String(i[l]));return r}window.t=t,window.i18n={getLanguage:()=>__i18nLang,setLanguage:e=>{I18N_SUPPORTED.includes(e)&&(__i18nLang=e,i18nSetStored(e),applyHtmlLang(e))},getAvailable:()=>I18N_SUPPORTED.slice(),detectDefault:i18nDetectDefault};function CodeEditor(e,i){return e.editingFile?e.openFiles.find(r=>r.id==e.editingFile).editor.render():html`
      <div id="code-editor"></div>
    `}function NewFileDialog(e,i){const a=e.isNewFileDialogOpen?"open":"closed";function r(v){v.target.id=="dialog-new-file"&&i("close-new-file-dialog")}function l(v){v.stopPropagation(),i("close-new-file-dialog")}function f(v){return y=>{y&&y.stopPropagation&&y.stopPropagation();const n=document.querySelector("#file-name"),o=n.value.trim()||n.placeholder;i("create-new-tab",v,o)}}new MutationObserver((v,y)=>{const n=document.querySelector("#dialog-new-file input");n&&(n.focus(),y.disconnect())}).observe(document.body,{childList:!0,subtree:!0});const s=[...(e.openFiles||[]).map(v=>v.fileName),...(e.diskFiles||[]).map(v=>v.fileName),...(e.boardFiles||[]).map(v=>v.fileName)],d={type:"text",id:"file-name",value:"",placeholder:generateFileName(s)},h=e.isConnected?html`<button type="button" onclick=${f("board")}>${t("dialog.newFile.board")}</button>`:"",_=html`
  <div id="dialog-new-file" class="dialog ${a}" onclick=${r}>
    <div class="dialog-content">
      <div class="dialog-header">
        <div class="dialog-title">${t("dialog.newFile.title")}</div>
        <button class="dialog-close" type="button" aria-label=${t("dialog.newFile.close")} onclick=${l}>×</button>
      </div>
      <div class="dialog-body">
        <input ${d} />
      </div>
      <div class="dialog-actions">
        ${h}
        <button type="button" class="dialog-action-default" onclick=${f("disk")}>${t("dialog.newFile.computer")}</button>
      </div>
    </div>
  </div>
`;if(e.isNewFileDialogOpen){const v=_.querySelector("#dialog-new-file .dialog-content input");return v&&v.focus(),_}}function InstallPackageDialog(e,i){const a=e.isInstallPackageDialogOpen?"open":"closed",r=e.packageSearchResults||[],l=e.selectedPackage,f=!!e.isInstallingPackage;function g(p){i("search-packages",p.target.value)}function s(p){return()=>{f||i("select-package-to-install",p)}}function c(p){return k=>{k&&k.stopPropagation&&k.stopPropagation(),!f&&i("install-package",p)}}function d(p){return k=>{k&&k.stopPropagation&&k.stopPropagation();const F=p.docs||p.url;if(!F)return;const x=/^https?:\/\//.test(F)?F:F.startsWith("github:")?"https://github.com/"+F.substring(7).split("@")[0]:F.startsWith("gitlab:")?"https://gitlab.com/"+F.substring(7).split("@")[0]:F;window.open(x,"_blank","noopener,noreferrer")}}function h(){f||i("close-install-package-dialog")}function _(p){i("toggle-install-overwrite",p.target.checked)}const v=r.length===0?html`<div class="package-empty">${e.packageList.length===0?t("dialog.install.loading"):t("dialog.install.noResults")}</div>`:r.map(p=>{const k=l&&l.name===p.name&&l.url===p.url,F="package-item"+(k?" selected":""),x=p.url?html`<span class="package-source">${p.url}</span>`:html`<span class="package-source">micropython-lib</span>`,D=!!(p.docs||p.url||""),B=k?html`
              <div class="package-actions">
                <button class="package-action-btn"
                        title=${t("dialog.install.installThis")}
                        disabled=${f}
                        onclick=${c(p)}>
                  <span class="material-symbols-outlined">deployed_code_update</span>
                </button>
                <button class="package-action-btn"
                        title=${t(D?"dialog.install.openDocs":"dialog.install.noDocs")}
                        disabled=${!D}
                        onclick=${d(p)}>
                  <span class="material-symbols-outlined">description</span>
                </button>
              </div>
            `:"";return html`
          <div class="${F}" onclick=${s(p)}>
            <div class="package-info">
              <div class="package-head">
                <span class="material-symbols-outlined package-icon">deployed_code</span>
                <span class="package-name">${p.name||t("dialog.install.unnamed")}</span>
                ${p.version?html`<span class="package-version">v${p.version}</span>`:""}
              </div>
              <div class="package-desc">${p.description||""}</div>
              ${x}
            </div>
            ${B}
          </div>
        `}),y=e.installPackageError?html`<div class="install-error">${e.installPackageError}</div>`:"",n=f?html`<div class="install-progress">${e.installPackageProgress||t("dialog.install.working")}</div>`:"",o=f?html`<button class="dialog-close-floating" disabled title=${t("dialog.install.closeDisabled")}><span class="material-symbols-outlined">close</span></button>`:html`<button class="dialog-close-floating" onclick=${h} title=${t("dialog.install.close")}><span class="material-symbols-outlined">close</span></button>`,u=html`
  <div id="dialog-install-package" class="dialog ${a}">
    <div class="dialog-content install-package-dialog">
      ${o}
      <div class="dialog-title">${t("dialog.install.title")}</div>

      <input type="search"
             id="install-package-search"
             placeholder=${t("dialog.install.search")}
             value=${e.packageSearchQuery||""}
             oninput=${g} />

      <div class="package-list">${v}</div>

      <div class="install-options">
        <label class="install-option">
          <input type="checkbox" checked=${!!e.packageOverwrite} onchange=${_} />
          ${t("dialog.install.overwrite")}
        </label>
      </div>

      ${y}
      ${n}
    </div>
  </div>
  `;if(e.isInstallPackageDialogOpen)return u}function FileActions(e,i){const{isConnected:a,selectedFiles:r}=e;return html`
  <div id="file-actions">
    ${Button({icon:"arrow-up.svg",size:"small",disabled:!canUpload({isConnected:a,selectedFiles:r}),onClick:()=>i("upload-files")})}
    ${Button({icon:"arrow-down.svg",size:"small",disabled:!canDownload({isConnected:a,selectedFiles:r}),onClick:()=>i("download-files")})}
  </div>

  `}const DiskFileList=generateFileList("disk"),BoardFileList=generateFileList("board");function generateFileList(e){return function(a,r){function l(v){v.key.toLowerCase()==="enter"&&v.target.blur(),v.key.toLowerCase()==="escape"&&(v.target.value=null,v.target.blur())}const f=html`
      <div class="item">
        <img class="icon" src="media/file.svg" />
        <div class="text">
          <input type="text" onkeydown=${l} onblur=${v=>r("finish-creating-file",v.target.value)}/>
        </div>
      </div>
    `,g=html`
      <div class="item">
        <img class="icon" src="media/folder.svg" />
        <div class="text">
          <input type="text" onkeydown=${l} onblur=${v=>r("finish-creating-folder",v.target.value)}/>
        </div>
      </div>
    `;function s(v,y){const n=html`
        <input type="text"
          value=${v.fileName}
          onkeydown=${l}
          onblur=${S=>r("finish-renaming-file",S.target.value)}
          onclick=${S=>!1}
          ondblclick=${S=>!1}
          />
      `,o=a.selectedFiles.find(S=>S.fileName===v.fileName&&S.source===e);function u(S){return S.preventDefault(),r("rename-file",e,v),!1}function p(){a.renamingFile||r(`navigate-${e}-folder`,v.fileName)}function k(){a.renamingFile||r("open-file",e,v)}let F=v.fileName;const x=a.selectedFiles.find(S=>S.fileName===F);return a.renamingFile==e&&x&&(F=n),v.type==="folder"?html`
          <div
            class="item ${o?"selected":""}"
            onclick=${S=>r("toggle-file-selection",v,e,S)}
            ondblclick=${p}
            >
            <img class="icon" src="media/folder.svg" />
            <div class="text">${F}</div>
            <div class="options" onclick=${u}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `:html`
          <div
            class="item ${o?"selected":""}"
            onclick=${S=>r("toggle-file-selection",v,e,S)}
            ondblclick=${k}
            >
            <img class="icon" src="media/file.svg"  />
            <div class="text">${F}</div>
            <div class="options" onclick=${u}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `}const c=a[`${e}Files`].sort((v,y)=>{const n=v.fileName.toUpperCase(),o=y.fileName.toUpperCase();if(v.type==="folder"&&y.type==="file")return-1;if(v.type===y.type){if(n<o)return-1;if(n>o)return 1}return 0}),d=html`<div class="item"
  onclick=${()=>r(`navigate-${e}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,h=html`
      <div class="file-list">
        <div class="list">
          ${e==="disk"&&a.diskNavigationPath!="/"?d:""}
          ${e==="board"&&a.boardNavigationPath!="/"?d:""}
          ${a.creatingFile==e?f:null}
          ${a.creatingFolder==e?g:null}
          ${c.map(s)}
        </div>
      </div>
    `;return new MutationObserver(v=>{const y=h.querySelector("input");y&&y.focus()}).observe(h,{childList:!0,subtree:!0}),h}}function ReplPanel(e,i){const a=e.panelHeight<=PANEL_CLOSED,r=a?0:e.panelHeight,l=()=>{e.panelHeight>PANEL_CLOSED?i("close-panel"):i("open-panel")},f=a?"closed":"open",g=e.isResizingPanel?"resizing":"",s=e.panelHeight>PANEL_TOO_SMALL?"visible":"hidden";let c="terminal-enabled";return(!e.isConnected||e.isNewFileDialogOpen)&&(c="terminal-disabled"),html`
    <div class="panel-container">
      <div id="panel" class="${f} ${g}" style="height: ${r}px">
        <div class="panel-bar">
          <div id="connection-status" style="visibility:${e.isConnected?"visible":"hidden"};">
            <img src="media/ms-usb.svg" />
            <div>${e.isConnected?t("repl.connectedTo",{name:"bitblock"}):""}</div>
          </div>
          <div class="spacer"></div>
          <div id="drag-handle"
            onmousedown=${()=>i("start-resizing-panel")}
            onmouseup=${()=>i("stop-resizing-panel")}
            ></div>
          <div class="term-operations ${s}">
            ${ReplOperations(e,i)}
          </div>
          ${Button({icon:`arrow-${e.panelHeight>PANEL_CLOSED?"down":"up"}.svg`,size:"small",onClick:l})}
        </div>
        <div class=${c}>
          ${e.cache(XTerm,"terminal").render()}
        </div>
      </div>
      <button class="panel-reopen-handle ${a?"visible":""}"
              onclick=${()=>i("open-panel")}
              aria-label=${t("repl.showTerminal")}
              title=${t("repl.showTerminal")}>
        <span class="material-symbols-outlined">keyboard_arrow_up</span>
      </button>
    </div>
  `}function ReplOperations(e,i){return[Button({icon:"copy.svg",size:"small",tooltip:t("repl.copy"),onClick:()=>document.execCommand("copy")}),Button({icon:"paste.svg",size:"small",tooltip:t("repl.paste"),onClick:()=>document.execCommand("paste")}),Button({icon:"delete.svg",size:"small",tooltip:t("repl.clean",{shortcut:`${e.platform==="darwin"?"Cmd":"Ctrl"}+L`}),onClick:()=>i("clear-terminal")})]}function Tabs(e,i){const a=html`
    <div id="tabs">
      ${e.openFiles.map(l=>Tab({text:l.fileName,icon:l.source==="board"?"ms-videogame-asset.svg":"ms-computer.svg",active:l.id===e.editingFile,renaming:l.id===e.renamingTab,hasChanges:l.hasChanges,onSelectTab:()=>i("select-tab",l.id),onCloseTab:()=>i("close-tab",l.id),onStartRenaming:()=>i("rename-tab",l.id),onFinishRenaming:f=>i("finish-renaming-tab",f)}))}
    </div>
  `;return new MutationObserver(l=>{const f=a.querySelector("input");f&&f.focus()}).observe(a,{childList:!0,subtree:!0}),a}function Toolbar(e,i){const a=window.canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile}),r=window.canExecute({view:e.view,isConnected:e.isConnected}),l=e.platform==="darwin"?"Cmd":"Ctrl",f=e.isSidebarOpen?"":"sidebar-collapsed";return html`
    <div id="navigation-bar" class="${f}">
      <div id="app-logo">
        <img src="media/logo.svg" alt="MicroPython for Bitblock" />
      </div>
      <div id="toolbar">
        ${Button({icon:e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg",label:e.isConnected?t("toolbar.disconnect"):t("toolbar.connect"),tooltip:e.isConnected?t("toolbar.tooltip.disconnect",{shortcut:`${l}+Shift+D`}):t("toolbar.tooltip.connect",{shortcut:`${l}+Shift+C`}),onClick:()=>e.isConnected?i("disconnect"):i("connect"),active:e.isConnected,first:!0})}
        ${Button({icon:"ms-restart.svg",label:t("toolbar.reset"),tooltip:t("toolbar.tooltip.reset",{shortcut:`${l}+Shift+R`}),disabled:!r,onClick:()=>i("reset")})}
        <div class="separator"></div>

        ${Button({icon:"ms-play.svg",label:t("toolbar.run"),tooltip:t("toolbar.tooltip.run",{shortcut:`${l}+R`}),disabled:!r||e.isRunning,onClick:g=>{g.altKey?i("run-from-button",!0):i("run-from-button")}})}
        ${Button({icon:"ms-stop.svg",label:t("toolbar.stop"),tooltip:t("toolbar.tooltip.stop",{shortcut:`${l}+H`}),disabled:!r||!e.isRunning,onClick:()=>i("stop")})}

        <div class="separator"></div>

        ${Button({icon:"ms-note-add.svg",label:t("toolbar.new"),tooltip:t("toolbar.tooltip.new",{shortcut:`${l}+N`}),disabled:e.view!="editor",onClick:()=>i("create-new-file")})}

        ${Button({icon:"ms-save.svg",label:t("toolbar.save"),tooltip:t("toolbar.tooltip.save",{shortcut:`${l}+S`}),disabled:!a,onClick:()=>i("save")})}

        <div class="separator"></div>

        ${Button({icon:"ms-deployed-code.svg",label:t("toolbar.addPackage"),disabled:!e.isConnected,tooltip:e.isConnected?t("toolbar.tooltip.addPackageEnabled"):t("toolbar.tooltip.addPackageDisabled"),onClick:()=>i("open-install-package-dialog")})}

        ${Button({icon:e.isFullscreen?"ms-fullscreen-exit.svg":"ms-fullscreen.svg",label:e.isFullscreen?t("toolbar.exitFullScreen"):t("toolbar.fullScreen"),tooltip:e.isFullscreen?t("toolbar.tooltip.exitFullScreen"):t("toolbar.tooltip.enterFullScreen"),onClick:()=>i("toggle-fullscreen")})}

        <div class="toolbar-version">${window.APP_VERSION||""}</div>
      </div>
    </div>
  `}function RunFab(e,i){if(e.view!=="editor"||!e.isConnected)return"";const a=!!e.isRunning,r=()=>i(a?"stop":"run-from-button"),l=t(a?"toolbar.stop":"toolbar.run"),g=e.panelHeight>PANEL_CLOSED?e.panelHeight+16:24;return html`
    <button class="run-fab ${a?"is-running":""}"
            style="bottom: ${g}px"
            title=${l}
            aria-label=${l}
            onclick=${r}>
      <img class="icon" src=${a?"media/ms-stop.svg":"media/ms-play.svg"} />
    </button>
  `}function FileManagerPanel(e,i){let a=t("sidebar.connectToBoard");const r=!!e.diskNavigationRoot;let l=r?`${e.diskNavigationRoot}${e.diskNavigationPath}`:t("sidebar.selectFolder");e.isConnected&&(a=`bitblock${e.boardNavigationPath}`);const f=(e.selectedFiles||[]).filter(d=>d.source==="board").length,g=(e.selectedFiles||[]).filter(d=>d.source==="disk").length,s=html`
    <div id="board-files">
      <div class="device-header">
        <img class="icon" src="media/${e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg"}" />
        <div onclick=${()=>i("connect")} class="text">
          <span>${a}</span>
        </div>
        <button disabled=${!e.isConnected}
                onclick=${()=>i("refresh-files")}
                title=${t("sidebar.refresh")}>
          <img class="icon" src="media/ms-refresh.svg" />
        </button>
        <button disabled=${!e.isConnected} onclick=${()=>i("create-folder","board")}>
          <img class="icon" src="media/new-folder.svg" />
        </button>
        <button disabled=${!e.isConnected} onclick=${()=>i("create-file","board")}>
          <img class="icon" src="media/new-file.svg" />
        </button>
        <button disabled=${!e.isConnected||f===0}
                onclick=${()=>i("remove-files","board")}
                title=${t("sidebar.deleteBoard")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${BoardFileList(e,i)}
    </div>
  `,c=html`
    <div id="disk-files">
      <div class="device-header">
        <img class="icon" src="media/ms-computer.svg" />
        <div class="text" onclick=${()=>i("select-disk-navigation-root")}>
          <span>${l}</span>
        </div>
        <button disabled=${!r}
                onclick=${()=>i("refresh-files")}
                title=${t("sidebar.refresh")}>
          <img class="icon" src="media/ms-refresh.svg" />
        </button>
        <button disabled=${!r} onclick=${()=>i("create-folder","disk")}>
          <img class="icon" src="media/new-folder.svg" />
        </button>
        <button disabled=${!r} onclick=${()=>i("create-file","disk")}>
          <img class="icon" src="media/new-file.svg" />
        </button>
        <button disabled=${!r||g===0}
                onclick=${()=>i("remove-files","disk")}
                title=${t("sidebar.deleteDisk")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${DiskFileList(e,i)}
    </div>
  `;return html`
    <div id="file-manager" class="sidebar-files">
      ${s}
      ${FileActions(e,i)}
      ${c}
    </div>
  `}const TOPIC_VIEW_TO_FILE={mpy:"mpyTutorial",bitblock:"bitblockTutorials"},TOPIC_VIEW_FORCED_LANG={mpy:"ko",bitblock:"ko"};function iconBgFor(e){const i=e.iconBg&&String(e.iconBg).trim();if(i)return i;const a=e.id||"";return a.endsWith("_classifier")?"#bbf7d0":["cv2","hand","face","pose"].includes(a)?"#e9d5ff":"#bfdbfe"}function TopicListPanel(e,i,a){const r=TOPIC_VIEW_TO_FILE[a];if(!r)return html`<div class="topic-empty">${t("topic.empty")}</div>`;const l=e.topicsByFile[r];if(!l&&!e.topicsError[r]){const g=TOPIC_VIEW_FORCED_LANG[a]||e.language;i("load-topics",{key:r,lang:g})}if(e.topicsError[r])return html`
      <div class="topic-error">
        ${t("topic.error",{err:e.topicsError[r]})}
      </div>
    `;if(!l)return html`<div class="topic-loading">${t("topic.loading")}</div>`;const f=e.selectedTopicId[a];if(f){const g=l.topics.find(s=>s.id===f);if(g)return TopicDetail(e,i,a,g);e.selectedTopicId[a]=null}return html`
    <div class="topic-list">
      ${l.topics.length===0?html`<div class="topic-empty">${t("topic.empty")}</div>`:l.topics.map(g=>html`
            <button class="topic-card"
                    onclick=${()=>i("select-topic",{view:a,topicId:g.id})}>
              <span class="topic-card-icon" style=${`background:${iconBgFor(g)}`}>
                <span class="material-symbols-outlined">${g.icon||"menu_book"}</span>
              </span>
              <span class="topic-card-text">
                <span class="topic-card-title">${g.title}</span>
                ${g.description?html`<span class="topic-card-desc">${g.description}</span>`:""}
              </span>
              <span class="topic-card-arrow">
                <span class="material-symbols-outlined">arrow_forward</span>
              </span>
            </button>
          `)}
    </div>
  `}function TopicDetail(e,i,a,r){const l=()=>i("select-topic",{view:a,topicId:null}),f=r.entries||[],g=r.entriesAfter||[],s=`topic-${a}-${r.id}`;function c(d){const h=document.getElementById(`${s}-${d}`);h&&h.scrollIntoView({block:"nearest",behavior:"smooth"})}return html`
    <div class="topic-detail">
      <div class="topic-detail-backbar">
        <button class="topic-detail-back-link" onclick=${l}>
          <span class="material-symbols-outlined">chevron_left</span>
          <span>${t("topic.back")}</span>
        </button>
      </div>
      <header class="topic-detail-header">
        <span class="topic-detail-icon" style=${`background:${iconBgFor(r)}`}>
          <span class="material-symbols-outlined">${r.icon||"help"}</span>
        </span>
        <div class="topic-detail-text">
          <h2 class="topic-detail-title">${r.title}</h2>
          ${r.description?html`<p class="topic-detail-desc">${r.description}</p>`:""}
        </div>
      </header>
      <div class="topic-detail-body">
        ${EntryToc(f,g,c)}
        ${r.notice?html`
            <div class="topic-notice">
              <span class="material-symbols-outlined topic-notice-icon">warning</span>
              <p class="topic-notice-text">${r.notice}</p>
            </div>
          `:""}
        ${r.externalLink?html`
            <div class="topic-external">
              <a class="topic-external-link"
                 href=${r.externalLink.href}
                 target="_blank"
                 rel="noopener noreferrer">
                <span class="material-symbols-outlined">${r.externalLink.icon||"open_in_new"}</span>
                <span>${r.externalLink.label}</span>
              </a>
            </div>
          `:""}
        ${f.map((d,h)=>html`
          <div id=${`${s}-b-${h}`}>
            ${EntryView(e,i,a,r.id,d,`b-${h}`)}
          </div>
        `)}
        ${g.map((d,h)=>html`
          <div id=${`${s}-a-${h}`}>
            ${EntryView(e,i,a,r.id,d,`a-${h}`)}
          </div>
        `)}
      </div>
    </div>
  `}function EntryToc(e,i,a){const r=e||[],l=i||[];if(r.length+l.length===0)return"";function g(s,c){const d=s.name&&s.name.trim()?s.name:"(\uC774\uB984 \uC5C6\uC74C)";return html`
      <button type="button"
              class="topic-toc-item"
              onclick=${()=>a(c)}>
        ${d}
      </button>
    `}return html`
    <div class="topic-toc-wrapper">
      <div class="topic-toc">
        <div class="topic-toc-title">목차</div>
        <div class="topic-toc-items">
          ${r.map((s,c)=>g(s,`b-${c}`))}
          ${r.length>0&&l.length>0?html`<div class="topic-toc-divider"></div>`:""}
          ${l.map((s,c)=>g(s,`a-${c}`))}
        </div>
      </div>
    </div>
  `}function EntryView(e,i,a,r,l,f){const g=`${a}:${r}:${f}`,c=!!!(e.collapsedEntries&&e.collapsedEntries[g]),d=Array.isArray(l.examples)?l.examples.filter(h=>{const _=h&&h.code||"",v=h&&h.description||"";return _!==""||v!==""}):[];return html`
    <article class="entry">
      <div class="entry-header">
        <h3 class="entry-name">${l.name}</h3>
        <button type="button"
                class="entry-more"
                onclick=${()=>i("toggle-entry",{key:g})}>
          <span>More</span>
          <span class="material-symbols-outlined">${c?"keyboard_arrow_up":"keyboard_arrow_down"}</span>
        </button>
      </div>

      ${l.summary?html`<p class="entry-summary">${l.summary}</p>`:""}

      ${l.extension?html`<div class="entry-extension">${l.extension}</div>`:""}

      ${l.warning?NoticeBox(l.warning,l.warningType,l.warningShowIcon):""}

      ${c&&l.details?html`<div class="entry-details-box">${l.details}</div>`:""}

      ${l.warning2?NoticeBox(l.warning2,l.warning2Type,l.warning2ShowIcon):""}

      ${c&&l.table?EntryTable(l.table):""}

      ${d.map(h=>html`
        <div class="entry-example">
          ${h.description?html`<p class="entry-example-desc">${h.description}</p>`:""}
          <div class="entry-code"
               role="button"
               tabindex="0"
               draggable="true"
               title="클릭해서 복사 · 드래그해서 에디터에 삽입"
               onclick=${()=>copyText(h.code||"")}
               ondragstart=${_=>onCodeDragStart(_,h.code||"")}
               ondragend=${onCodeDragEnd}>
            <span class="material-symbols-outlined entry-code-grip">drag_indicator</span>
            <pre class="entry-code-pre"><code>${h.code||""}</code></pre>
          </div>
        </div>
      `)}
    </article>
  `}function NoticeBox(e,i,a){const r=i||"warning",l=a!==!1,f=r==="info"?"info":r==="error"?"error":"warning";return html`
    <div class=${`entry-notice entry-notice-${r}`}>
      ${l?html`<span class="material-symbols-outlined entry-notice-icon">${f}</span>`:""}
      <div class="entry-notice-text">${e}</div>
    </div>
  `}function EntryTable(e){return html`
    <div class="entry-table-wrap">
      <table class="entry-table">
        <thead>
          <tr>
            ${(e.headers||[]).map(i=>html`<th>${i}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${(e.rows||[]).map(i=>html`
            <tr>
              ${i.map((a,r)=>html`
                <td class=${r===0?"entry-table-first":""}>${a}</td>
              `)}
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `}function copyText(e){if(e)try{navigator.clipboard&&navigator.clipboard.writeText(e)}catch(i){}}function onCodeDragStart(e,i){if(!e.dataTransfer)return;e.dataTransfer.effectAllowed="copy";const a=window.DragSnippet&&window.DragSnippet.MIME||"application/vnd.micropython-ide.code-snippet";try{e.dataTransfer.setData(a,i)}catch(r){}try{e.dataTransfer.setData("text/plain",i)}catch(r){}window.DragSnippet&&window.DragSnippet.set(i)}function onCodeDragEnd(){window.DragSnippet&&window.DragSnippet.clear()}function SettingsPanel(e,i){const a=e.language,r=window.AppShortcuts&&window.AppShortcuts.map||{},l=window.AppShortcuts&&window.AppShortcuts.displayLabel||(g=>g),f=[{accel:r.CLEAR_EDITOR,descKey:"settings.shortcuts.clearEditor"},{accel:r.RUN,descKey:"settings.shortcuts.run"},{accel:r.STOP,descKey:"settings.shortcuts.stop"}].filter(g=>g.accel);return html`
    <div class="settings-panel">
      <div class="settings-panel-header">${t("settings.title")}</div>
      <div class="settings-panel-body">
        <section class="settings-card">
          <div class="settings-card-title">${t("settings.language")}</div>
          <div class="settings-card-body">
            <select id="language-select" class="settings-select">
              <option value="en" selected=${a==="en"}>English</option>
              <option value="ko" selected=${a==="ko"}>한국어</option>
            </select>
            <button class="settings-apply" onclick=${()=>{const g=document.getElementById("language-select");g&&i("set-language",g.value)}}>${t("settings.apply")}</button>
          </div>
        </section>

        <section class="settings-card">
          <div class="settings-card-title">${t("settings.shortcuts.title")}</div>
          <div class="settings-shortcut-list">
            ${f.map(g=>html`
              <div class="settings-shortcut-row">
                <kbd class="settings-shortcut-key">${l(g.accel)}</kbd>
                <span class="settings-shortcut-desc">${t(g.descKey)}</span>
              </div>
            `)}
          </div>
        </section>
      </div>
    </div>
  `}const BITBLOCK_ICON_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 L20.5 7.25 L20.5 16.75 L12 21.5 L3.5 16.75 L3.5 7.25 Z"/><path d="M3.5 7.25 L12 12 L20.5 7.25"/><path d="M12 12 L12 21.5"/></svg>',MPY_ICON_SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 2h20v20H2V2zm4 2h2v13H6V4zm4 4h2v13h-2V8zm4-4h2v13h-2V4zm3.5 13.5h2v2h-2v-2z"/></svg>',ACTIVITY_TOP=[{id:"explorer",icon:"folder",labelKey:"activity.explorer"},{id:"mpy",svg:MPY_ICON_SVG,labelKey:"activity.mpy"},{id:"bitblock",svg:BITBLOCK_ICON_SVG,labelKey:"activity.bitblock"}],ACTIVITY_BOTTOM=[{id:"settings",icon:"settings",labelKey:"activity.settings"}];function renderSvgIcon(e){const i=document.createElement("span");return i.className="activity-icon activity-svg-icon",i.innerHTML=e,i}function ActivityBar(e,i){const a=l=>{const f=e.activeView===l.id,g=()=>{if(f&&e.isSidebarOpen){if(l.id==="mpy"||l.id==="bitblock"){e.selectedTopicId[l.id]&&i("select-topic",{view:l.id,topicId:null});return}i("toggle-sidebar");return}i("set-active-view",l.id),e.isSidebarOpen||i("toggle-sidebar")},s="activity-item"+(f?" is-active":""),c=t(l.labelKey),d=l.svg?renderSvgIcon(l.svg):html`<span class="material-symbols-outlined activity-icon">${l.icon}</span>`;return html`
      <button class="${s}"
              title=${c}
              aria-label=${c}
              onclick=${g}>
        ${d}
        <span class="activity-label">${c}</span>
      </button>
    `},r=html`<div class="activity-divider" role="separator" aria-orientation="horizontal"></div>`;return html`
    <nav class="activity-bar" aria-label="activity">
      <div class="activity-group activity-top">
        ${a(ACTIVITY_TOP[0])}
        ${r}
        ${ACTIVITY_TOP.slice(1).map(a)}
      </div>
      <div class="activity-group activity-bottom">${ACTIVITY_BOTTOM.map(a)}</div>
    </nav>
  `}function Sidebar(e,i){const a=!!e.isSidebarOpen,r="app-sidebar"+(a?"":" collapsed"),l=a?"chevron_left":"chevron_right",f=a?`flex: 0 0 ${e.sidebarWidth}px; width: ${e.sidebarWidth}px;`:"";let g;switch(e.activeView){case"mpy":g=TopicListPanel(e,i,"mpy");break;case"bitblock":g=TopicListPanel(e,i,"bitblock");break;case"settings":g=SettingsPanel(e,i);break;default:g=FileManagerPanel(e,i);break}return html`
    <aside class="${r}" style=${f}>
      ${g}
      <button class="sidebar-toggle"
              onclick=${()=>i("toggle-sidebar")}
              aria-label=${t("sidebar.toggle")}
              title=${t(a?"sidebar.hideFiles":"sidebar.showFiles")}>
        <span class="material-symbols-outlined">${l}</span>
      </button>
    </aside>
  `}const SIDEBAR_WIDTH_MIN_UI=180,SIDEBAR_WIDTH_MAX_UI=600,SIDEBAR_WIDTH_DEFAULT_UI=400;function startSidebarDrag(e,i,a){e.preventDefault();const r=e.clientX,l=document.querySelector(".app-sidebar");let f=a;function g(c){const d=Math.max(SIDEBAR_WIDTH_MIN_UI,Math.min(SIDEBAR_WIDTH_MAX_UI,a+(c.clientX-r)));f=d,l&&(l.style.flex=`0 0 ${d}px`,l.style.width=`${d}px`)}function s(){window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",s),document.body.classList.remove("is-resizing-sidebar"),i("set-sidebar-width",f)}document.body.classList.add("is-resizing-sidebar"),window.addEventListener("mousemove",g),window.addEventListener("mouseup",s)}function SidebarResizer(e,i){const a="sidebar-resizer"+(e.isSidebarOpen?"":" is-hidden");return html`
    <div class="${a}"
         role="separator"
         aria-orientation="vertical"
         title="Drag to resize · Double-click to reset"
         onmousedown=${r=>e.isSidebarOpen&&startSidebarDrag(r,i,e.sidebarWidth)}
         ondblclick=${()=>e.isSidebarOpen&&i("set-sidebar-width",SIDEBAR_WIDTH_DEFAULT_UI)}>
    </div>
  `}function Overlay(e,i){const a=html`<span class="material-symbols-outlined overlay-spinner">hourglass_empty</span>`,r=f=>html`<div class="overlay-message">${a}<span>${f}</span></div>`;let l=html`<div id="overlay" class="closed"></div>`;return e.diskFiles==null&&(i("load-disk-files"),l=html`<div id="overlay" class="open">${r(t("overlay.loading"))}</div>`),e.isRemoving&&(l=html`<div id="overlay" class="open">${r(t("overlay.removing"))}</div>`),e.isConnecting&&(l=html`<div id="overlay" class="open">${r(t("overlay.connecting"))}</div>`),e.isLoadingFiles&&(l=html`<div id="overlay" class="open">${r(t("overlay.loading"))}</div>`),e.isSaving&&(l=html`<div id="overlay" class="open">${r(t("overlay.saving",{progress:e.savingProgress}))}</div>`),e.isTransferring&&(l=html`<div id="overlay" class="open">${r(html`${t("overlay.transferring")}<br><br>${e.transferringProgress}`)}</div>`),l}function EditorView(e,i){return html`
    <div class="working-area">
      ${Tabs(e,i)}
      ${CodeEditor(e,i)}
      ${ReplPanel(e,i)}
      ${RunFab(e,i)}
    </div>
  `}(function(){function e(...f){return f.filter(s=>s!=null&&s!=="").map(s=>String(s)).join("/").replace(/\/+/g,"/")}function i(...f){let g=e(...f);return g.startsWith("/")||(g="/"+g),g.replace(/\/+/g,"/")}function a(f){if(!f)return"/";const g=String(f).replace(/\/+$/,"");if(g===""||g==="/")return"/";const s=g.lastIndexOf("/");return s<=0?"/":g.slice(0,s)}function r(f){const g=String(f||"").replace(/\/+$/,""),s=g.lastIndexOf("/");return s===-1?g:g.slice(s+1)}function l(f){return f?String(f).replace(/\\/g,"/").replace(/\/+/g,"/").replace(/^\/+/,""):""}window.PosixPath={join:e,resolve:i,dirname:a,basename:r,normalize:l}})(),(function(){const e={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"F5",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"Shift+F5",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",CLEAR_EDITOR:"CommandOrControl+D",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"};function i(){const r=navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"";return/mac|darwin/i.test(r)}function a(r){if(!r)return"";const l=i();return r.replace("CommandOrControl",l?"Cmd":"Ctrl").replace("CmdOrCtrl",l?"Cmd":"Ctrl").replace("Alt",l?"Option":"Alt")}window.AppShortcuts={map:e,displayLabel:a,isMacPlatform:i}})(),(function(){const e="micropython-ide-fsa",a="handles",r="diskRoot";function l(){return new Promise((h,_)=>{const v=indexedDB.open(e,1);v.onupgradeneeded=()=>{const y=v.result;y.objectStoreNames.contains(a)||y.createObjectStore(a)},v.onsuccess=()=>h(v.result),v.onerror=()=>_(v.error)})}async function f(h){const _=await l();try{await new Promise((v,y)=>{const n=_.transaction(a,"readwrite");n.objectStore(a).put(h,r),n.oncomplete=()=>v(),n.onerror=()=>y(n.error),n.onabort=()=>y(n.error)})}finally{_.close()}}async function g(){const h=await l();try{return await new Promise((_,v)=>{const n=h.transaction(a,"readonly").objectStore(a).get(r);n.onsuccess=()=>_(n.result||null),n.onerror=()=>v(n.error)})}finally{h.close()}}async function s(){const h=await l();try{await new Promise((_,v)=>{const y=h.transaction(a,"readwrite");y.objectStore(a).delete(r),y.oncomplete=()=>_(),y.onerror=()=>v(y.error)})}finally{h.close()}}async function c(h,_="readwrite"){const v={mode:_};return typeof h.queryPermission=="function"&&await h.queryPermission(v)==="granted"||typeof h.requestPermission=="function"&&await h.requestPermission(v)==="granted"}async function d(h,_="readwrite"){return typeof h.queryPermission!="function"?!1:await h.queryPermission({mode:_})==="granted"}window.FsaHandleStore={saveHandle:f,loadHandle:g,clearHandle:s,verifyPermission:c,queryPermissionOnly:d}})(),(function(){let e=!1;function i(){if(e)return;e=!0;const r=`
      .app-dialog {
        border: none;
        border-radius: 6px;
        padding: 0;
        max-width: 460px;
        font-family: inherit;
        color: #222;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      }
      .app-dialog::backdrop { background: rgba(0,0,0,0.45); }
      .app-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px 12px;
        gap: 12px;
        border-bottom: 1px solid #e0e0e0;
      }
      .app-dialog-title {
        font-weight: 700;
        font-size: 22.5px;
        color: #111;
      }
      .app-dialog-close {
        background: none;
        border: none;
        cursor: pointer;
        /* Match right-padding with .app-dialog-buttons button so the X
           and the last action button line up on the same vertical axis. */
        padding: 2px 2px 2px 8px;
        color: #d32f2f;
        font-size: 30px;
        line-height: 1;
      }
      .app-dialog-close:hover { color: #a10e0e; }
      .app-dialog-body { padding: 14px 18px; }
      .app-dialog-message {
        margin: 0;
        white-space: pre-wrap;
        font-size: 18px;
        line-height: 1.5;
      }
      .app-dialog-buttons {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 32px;
        /* Right padding is larger than the header's 18px so the last
           action button's visible right edge lands slightly inside the
           X button's right edge instead of overshooting due to font
           metric differences between 'L' (minimal right bearing) and
           '\xD7' (notable right bearing). */
        padding: 10px 30px 14px 18px;
        box-sizing: border-box;
        max-width: 100%;
      }
      .app-dialog-buttons button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 2px;
        font-family: inherit;
        font-size: 20px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #888;
        max-width: 100%;
      }
      .app-dialog-buttons button:hover { color: #444; }
      .app-dialog-buttons button.app-dialog-default {
        font-weight: 700;
        color: #1976d2;
      }
      .app-dialog-buttons button.app-dialog-default:hover { color: #1565c0; }
    `,l=document.createElement("style");l.textContent=r,document.head.appendChild(l)}function a(r){i();const l=r&&r.buttons||["OK"],f=r&&r.defaultId!=null?r.defaultId:0,g=r&&r.cancelId!=null?r.cancelId:-1,s=r&&r.message||"",c=r&&r.title||"";return new Promise(d=>{const h=document.createElement("dialog");h.className="app-dialog",h.setAttribute("data-dialog-type",r&&r.type||"info");let _=!1;function v(S){if(!_){_=!0;try{h.close()}catch(D){}h.parentNode&&h.parentNode.removeChild(h),d(S!==g)}}const y=()=>v(g===-1?l.length:g),n=document.createElement("div");n.className="app-dialog-header";const o=document.createElement("div");o.className="app-dialog-title",o.textContent=c,n.appendChild(o);const u=document.createElement("button");u.className="app-dialog-close",u.type="button",u.setAttribute("aria-label","Close"),u.textContent="\xD7",u.addEventListener("click",y),n.appendChild(u),h.appendChild(n);const p=document.createElement("div");p.className="app-dialog-body";const k=document.createElement("p");k.className="app-dialog-message",k.textContent=s,p.appendChild(k),h.appendChild(p);const F=document.createElement("div");F.className="app-dialog-buttons",l.forEach((S,D)=>{const B=document.createElement("button");B.type="button",B.textContent=S,D===f&&B.classList.add("app-dialog-default"),B.addEventListener("click",()=>v(D)),F.appendChild(B)}),h.appendChild(F),h.addEventListener("cancel",S=>{S.preventDefault(),y()}),document.body.appendChild(h),h.showModal();const x=F.querySelector(".app-dialog-default");x&&x.focus()})}window.AppDialog={openDialog:a}})(),(function(){if(!window.AppShortcuts){console.error("[shortcut-manager] AppShortcuts not loaded");return}const e=window.AppShortcuts.isMacPlatform(),i=[],a=[];let r=!1;function l(y){const n=e?y.metaKey:y.ctrlKey,o=typeof y.key=="string"&&/^F\d{1,2}$/.test(y.key);if(!n&&!o)return null;const u=[];n&&u.push("CommandOrControl"),y.altKey&&u.push("Alt"),y.shiftKey&&u.push("Shift");let p=null;return o?p=y.key:y.code&&y.code.startsWith("Key")?p=y.code.slice(3).toUpperCase():y.code&&y.code.startsWith("Digit")?p=y.code.slice(5):y.key==="Enter"?p="Enter":y.key===" "?p="Space":y.key&&y.key.length===1?p=y.key.toUpperCase():p=y.key,p?(u.push(p),u.join("+")):null}function f(){const y=window.AppShortcuts.map,n=new Set;for(const o of Object.keys(y))n.add(y[o]);return n}let g=f();function s(y){if(!y)return!1;const n=(y.tagName||"").toLowerCase();return!!(n==="input"||n==="textarea"||n==="select"||y.isContentEditable)}function c(y){if(r||i.length===0)return;const n=l(y);if(n&&g.has(n)){y.preventDefault(),y.stopPropagation();for(const o of i)try{o(n)}catch(u){console.error("[shortcut]",u)}}}window.addEventListener("keydown",c,!0);function d(y){typeof y=="function"&&i.push(y)}function h(y){typeof y=="function"&&a.push(y)}function _(y){r=!!y;for(const n of a)try{n(r)}catch(o){console.error("[disable-shortcuts]",o)}}function v(y){for(const n of i)try{n(y)}catch(o){console.error("[shortcut/menu]",o)}}window.AppShortcutManager={onShortcut:d,onDisableShortcuts:h,setSuppressed:_,dispatchAccelerator:v,eventToAccelerator:l,refreshKnown:()=>{g=f()}}})(),(function(){const e=d=>()=>Promise.reject(new Error(`not implemented yet: ${d}`));window.PosixPath||console.error("[web-bridges] PosixPath not loaded \u2014 check script order");const i=window.PosixPath||{join:(...d)=>d.filter(Boolean).join("/").replace(/\/+/g,"/"),resolve:(...d)=>"/"+d.filter(Boolean).join("/").replace(/\/+/g,"/"),dirname:d=>(d||"/").replace(/\/[^/]*$/,"")||"/"},a=i.join,r=i.resolve,l=i.dirname;window.BridgeSerial={loadPorts:e("BridgeSerial.loadPorts"),requestPort:e("BridgeSerial.requestPort"),connect:e("BridgeSerial.connect"),disconnect:e("BridgeSerial.disconnect"),run:e("BridgeSerial.run"),execFile:e("BridgeSerial.execFile"),getPrompt:e("BridgeSerial.getPrompt"),keyboardInterrupt:e("BridgeSerial.keyboardInterrupt"),reset:e("BridgeSerial.reset"),eval:e("BridgeSerial.eval"),onData:()=>{},listFiles:e("BridgeSerial.listFiles"),ilistFiles:e("BridgeSerial.ilistFiles"),loadFile:e("BridgeSerial.loadFile"),removeFile:e("BridgeSerial.removeFile"),saveFileContent:e("BridgeSerial.saveFileContent"),uploadFile:e("BridgeSerial.uploadFile"),downloadFile:e("BridgeSerial.downloadFile"),renameFile:e("BridgeSerial.renameFile"),onConnectionClosed:()=>{},createFolder:e("BridgeSerial.createFolder"),removeFolder:e("BridgeSerial.removeFolder"),fileExists:e("BridgeSerial.fileExists"),getNavigationPath:(d,h)=>h===".."?l(d):a(d,h),getFullPath:(d,h,_)=>a(d,(h||"").replace(/\\/g,"/"),(_||"").replace(/\\/g,"/")),getParentPath:d=>l(d)},window.BridgeDisk={openFolder:e("BridgeDisk.openFolder"),listFiles:e("BridgeDisk.listFiles"),ilistFiles:e("BridgeDisk.ilistFiles"),ilistAllFiles:e("BridgeDisk.ilistAllFiles"),loadFile:e("BridgeDisk.loadFile"),loadFileBytes:e("BridgeDisk.loadFileBytes"),removeFile:e("BridgeDisk.removeFile"),saveFileContent:e("BridgeDisk.saveFileContent"),renameFile:e("BridgeDisk.renameFile"),createFolder:e("BridgeDisk.createFolder"),removeFolder:e("BridgeDisk.removeFolder"),fileExists:e("BridgeDisk.fileExists"),getAppPath:()=>Promise.resolve("./"),getNavigationPath:(d,h)=>h===".."?l(d):a(d,h),getFullPath:(d,h,_)=>r(d,(h||"").replace(/\\/g,"/"),(_||"").replace(/\\/g,"/")),getParentPath:d=>l(d)};const f={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"F5",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"Shift+F5",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",CLEAR_EDITOR:"CommandOrControl+D",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"},g=window.AppShortcuts&&window.AppShortcuts.map||f;function s(){const h=(navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"").toLowerCase();return h.includes("win")?"win32":h.includes("mac")?"darwin":h.includes("linux")?"linux":"unknown"}const c=s();window.BridgeWindow={setWindowSize:()=>{},onKeyboardShortcut:()=>{},onDisableShortcuts:()=>{},beforeClose:()=>{},confirmClose:()=>Promise.resolve(),isPackaged:()=>Promise.resolve(!1),openDialog:e("BridgeWindow.openDialog"),getOS:()=>c,isWindows:()=>c==="win32",isMac:()=>c==="darwin",isLinux:()=>c==="linux",updateMenuState:()=>Promise.resolve(),getShortcuts:()=>g},window.launchApp=async(d,h)=>{const _=h||d;_&&window.open(_,"_blank","noopener,noreferrer")}})(),(function(){const e=typeof navigator!="undefined"&&"serial"in navigator;function i(g){return new Promise(s=>setTimeout(s,g))}function a(g){return g.replace(/\r\n/g,`
`)}function r(g){return g.slice(2,-3)}function l(g,s=2,c=3){return g.slice(s,-c).split(",").filter(h=>h.length>0).map(Number)}class f{constructor(){this.port=null,this.writer=null,this.reader=null,this._readLoopPromise=null,this._matcher=null,this._inboundBuffer="",this._dataListener=null,this._closeListener=null,this.reject_run=null,this.write_chunk_size=128,this.write_chunk_sleep=10,this.fs_chunk_size=48}async list_ports(){if(!e)throw new Error("Web Serial API not supported in this browser");return(await navigator.serial.getPorts()).map(c=>{const d=c.getInfo&&c.getInfo()||{};return{path:d.usbVendorId!=null?`bitblock:${d.usbVendorId.toString(16)}:${(d.usbProductId||0).toString(16)}`:"serial",vendorId:d.usbVendorId,productId:d.usbProductId,_port:c}})}async request_port(s){if(!e)throw new Error("Web Serial API not supported in this browser");const c=s?{filters:s}:{};return await navigator.serial.requestPort(c)}async open(s){if(!e)throw new Error("Web Serial API not supported in this browser");this.port&&await this.close();let c;s&&s._port?c=s._port:s&&typeof s.open=="function"?c=s:c=await navigator.serial.requestPort(),await c.open({baudRate:115200}),this.port=c,this.writer=c.writable.getWriter(),this._startReadLoop()}_startReadLoop(){const s=new TextDecoder;this._readLoopPromise=(async()=>{for(;this.port&&this.port.readable;){let c;try{c=this.port.readable.getReader()}catch(d){break}this.reader=c;try{for(;;){const{value:d,done:h}=await c.read();if(h)break;if(d&&d.byteLength>0){const _=s.decode(d,{stream:!0});this._onIncomingText(_)}}}catch(d){break}finally{try{c.releaseLock()}catch(d){}this.reader=null}}this._onClose()})()}_onIncomingText(s){if(this._dataListener)try{this._dataListener(s)}catch(c){}if(this._matcher){if(this._matcher.buffer+=s,this._matcher.dc)try{this._matcher.dc(s)}catch(d){}const c=this._matcher.buffer.indexOf(this._matcher.ending);if(c!==-1){const d=this._matcher;this._matcher=null;const h=d.buffer.slice(0,c+d.ending.length);this._inboundBuffer=d.buffer.slice(c+d.ending.length),d.resolve(h)}}else this._inboundBuffer+=s}_onClose(){const s=this._closeListener;if(s)try{s()}catch(c){}if(this._matcher){const c=this._matcher;this._matcher=null,c.reject(new Error("serial connection closed"))}}async close(){if(this.reject_run){try{this.reject_run(new Error("pre close"))}catch(c){}this.reject_run=null}const s=this.port;this.port=null;try{this.reader&&await this.reader.cancel()}catch(c){}try{this.writer&&(await this.writer.close().catch(()=>{}),this.writer.releaseLock())}catch(c){}this.writer=null,this.reader=null;try{s&&await s.close()}catch(c){}}on_data(s){this._dataListener=s}on_close(s){this._closeListener=s}read_until(s,c){return new Promise((d,h)=>{if(this._matcher){const y=this._matcher;this._matcher=null,y.reject(new Error("superseded"))}const _=this._inboundBuffer;this._inboundBuffer="";const v=_.indexOf(s);if(v!==-1){const y=_.slice(0,v+s.length);return this._inboundBuffer=_.slice(v+s.length),d(y)}this._matcher={ending:s,dc:c,buffer:_,resolve:d,reject:h}})}async write_and_read_until(s,c,d){if(!this.writer)throw new Error("serial not open");this._inboundBuffer="";const h=new TextEncoder,_=this.write_chunk_size,v=this.write_chunk_sleep;for(let n=0;n<s.length;n+=_){const o=s.slice(n,n+_);await this.writer.write(h.encode(o)),await i(v)}let y;return c&&(y=await this.read_until(c,d)),await i(v),y}async get_prompt(){return await i(150),await this.stop(),await i(150),await this.write_and_read_until("\r",`\r
>>>`)}async enter_raw_repl(){return await this.write_and_read_until("","raw REPL; CTRL-B to exit")}async exit_raw_repl(){return await this.write_and_read_until("",`\r
>>>`)}async exec_raw(s,c){return await this.write_and_read_until(s),await this.write_and_read_until("",">",c)}async execfile(s,c){const d=typeof s=="string"?s:new TextDecoder().decode(s);await this.enter_raw_repl();const h=await this.exec_raw(d,c);return await this.exit_raw_repl(),h}async run(s,c){const d=c||function(){};return new Promise(async(h,_)=>{this.reject_run&&(this.reject_run(new Error("re-run")),this.reject_run=null),this.reject_run=_;try{await this.enter_raw_repl();const v=await this.exec_raw(s||"#",d);await this.exit_raw_repl(),this.reject_run=null,h(v)}catch(v){this.reject_run=null,_(v)}})}async eval(s){if(!this.writer)throw new Error("serial not open");await this.writer.write(new TextEncoder().encode(s))}async stop(){if(this.reject_run){try{this.reject_run(new Error("pre stop"))}catch(s){}this.reject_run=null}this.writer&&await this.writer.write(new TextEncoder().encode(""))}async reset(){if(this.reject_run){try{this.reject_run(new Error("pre reset"))}catch(s){}this.reject_run=null}this.writer&&(await this.writer.write(new TextEncoder().encode("")),await this.writer.write(new TextEncoder().encode("")))}async fs_exists(s){s=s||"";let c=`try:
`;c+=`  f = open("${s}", "r")
`,c+=`  print(1)
`,c+=`except OSError:
`,c+=`  print(0)
`,c+=`del f
`,await this.enter_raw_repl();const d=await this.exec_raw(c);return await this.exit_raw_repl(),d[2]==="1"}async fs_ls(s){s=s||"";let c=`import os
`;c+=`try:
`,c+=`  print(os.listdir("${s}"))
`,c+=`except OSError:
`,c+=`  print([])
`,await this.enter_raw_repl();let d=await this.exec_raw(c);return await this.exit_raw_repl(),d=r(d).replace(/'/g,'"'),JSON.parse(d)}async fs_ils(s){s=s||"";let c=`import os
`;c+=`try:
`,c+=`  l=[]
`,c+=`  f=None
`,c+=`  for f in os.ilistdir("${s}"):
`,c+=`    l.append(list(f))
`,c+=`  print(l)
`,c+=`except OSError:
`,c+=`  print([])
`,c+=`del l
`,c+=`if f:del f
`,await this.enter_raw_repl();let d=await this.exec_raw(c);return await this.exit_raw_repl(),d=r(d).replace(/'/g,'"').split("OK"),JSON.parse(d)}async fs_cat_binary(s){if(!s)throw new Error("Path to file was not specified");await this.enter_raw_repl();const c=256;let d=`with open('${s}','rb') as f:
`;d+=`  while 1:
`,d+=`    b=f.read(${c})
`,d+=`    if not b:break
`,d+=`    print(",".join(str(e) for e in b),end=",")
`,d+=`del f
`,d+=`del b
`;let h=await this.exec_raw(d);await this.exit_raw_repl();const _=l(h,2,4);return new Uint8Array(_)}async fs_cat(s){if(!s)throw new Error("Path to file was not specified");await this.enter_raw_repl();const c=`with open('${s}','r') as f:
 while 1:
  b=f.read(256)
  if not b:break
  print(b,end='')
del f
del b
`;let d=await this.exec_raw(c);return await this.exit_raw_repl(),a(r(d))}async fs_put(s,c,d){if(!s||!c)throw new Error("Must specify source bytes and destination");const h=d||function(){},_=s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new TextEncoder().encode(String(s));let v="";v+=await this.enter_raw_repl(),v+=await this.exec_raw(`f=open('${c}','wb')
w=f.write`);const y=this.fs_chunk_size;for(let n=0;n<_.length;n+=y){const o=_.subarray(n,n+y);v+=await this.exec_raw(`w(bytes([${o}]))`),h(parseInt(n/_.length*100)+"%")}return v+=await this.exec_raw(`f.close()
del f
del w
`),v+=await this.exit_raw_repl(),h("100%"),v}async fs_save(s,c,d){if(s==null||!c)throw new Error("Must specify content and destination path");const h=d||function(){},_=typeof s=="string"?new TextEncoder().encode(s):s instanceof Uint8Array?s:new Uint8Array(s);let v="";v+=await this.enter_raw_repl(),v+=await this.exec_raw(`f=open('${c}','wb')
w=f.write`);const y=this.fs_chunk_size;for(let n=0;n<_.length;n+=y){const o=_.subarray(n,n+y);v+=await this.exec_raw(`w(bytes([${o}]))`),h(parseInt(n/_.length*100)+"%")}return v+=await this.exec_raw(`f.close()
del f
del w
`),v+=await this.exit_raw_repl(),h("100%"),v}async fs_mkdir(s){if(!s)throw new Error("Path required");await this.enter_raw_repl();const c=await this.exec_raw(`import os
os.mkdir('${s}')`);return await this.exit_raw_repl(),c}async fs_rmdir(s){if(!s)throw new Error("Path required");let c=`import os
`;c+=`try:
`,c+=`  os.rmdir("${s}")
`,c+=`except OSError:
`,c+=`  print(0)
`,await this.enter_raw_repl();const d=await this.exec_raw(c);return await this.exit_raw_repl(),d}async fs_rm(s){if(!s)throw new Error("Path required");let c=`import os
`;c+=`try:
`,c+=`  os.remove("${s}")
`,c+=`except OSError:
`,c+=`  print(0)
`,await this.enter_raw_repl();const d=await this.exec_raw(c);return await this.exit_raw_repl(),d}async fs_rename(s,c){if(!s||!c)throw new Error("Both paths required");await this.enter_raw_repl();const d=await this.exec_raw(`import os
os.rename('${s}', '${c}')`);return await this.exit_raw_repl(),d}}typeof window!="undefined"&&(window.MicroPythonWeb=f),typeof module!="undefined"&&module.exports&&(module.exports={MicroPythonWeb:f,extract:r,extractBytes:l,fixLineBreak:a})})(),(function(){if(!window.MicroPythonWeb){console.error("[BridgeSerial] MicroPythonWeb not loaded \u2014 check script order in index.html");return}const e=new window.MicroPythonWeb;let i=[],a=null,r=null;async function l(){if(a!=null)return a;if(r)return r;r=(async()=>{const w=await fetch("helpers.py",{cache:"no-cache"});if(!w.ok)throw new Error(`helpers.py fetch failed: HTTP ${w.status}`);return a=await w.text(),a})();try{return await r}finally{r=null}}let f=null,g=null;e.on_data(w=>{f&&f(w)}),e.on_close(()=>{g&&g()});async function s(){const w=await e.list_ports();return i=w,w.filter(b=>b.vendorId!=null&&b.productId!=null).map(b=>({path:b.path,vendorId:b.vendorId,productId:b.productId}))}function c(w){return i.find(b=>b.path===w)||null}const d=[{usbVendorId:12346,usbProductId:16385}];async function h(){let w;try{w=await e.request_port(d)}catch(C){if(C&&(C.name==="NotFoundError"||/No port selected/i.test(C.message||"")))return null;throw C}i=await e.list_ports();const b=i.find(C=>C._port===w);return!b||b.vendorId==null||b.productId==null?null:{path:b.path,vendorId:b.vendorId,productId:b.productId}}async function _(w){let b=c(w);if(b||(i=await e.list_ports(),b=c(w)),!b)throw new Error(`Port not found: ${w}. Try clicking Connect again to re-authorize.`);await e.open(b),l().catch(()=>{})}async function v(){return await e.close()}function y(w){return e.run(w)}async function n(w){const b=await l();return await e.execfile(b)}function o(){return e.get_prompt()}function u(w){return e.eval(w)}function p(){return e.stop()}async function k(){await e.stop();try{await e.exit_raw_repl()}catch(w){}await e.reset()}function F(w){return e.fs_ls(w)}function x(w){return e.fs_ils(w)}async function S(w){return await e.fs_cat_binary(w)||new Uint8Array}function D(w){return e.fs_rm(w)}function B(w,b){return e.fs_rename(w,b)}function M(w){return e.fs_mkdir(w)}function P(w){return e.fs_rmdir(w)}async function E(w,b,C){return await e.fs_save(b||" ",w,C||function(){})}async function R(w,b,C){if(!window.BridgeDisk||!window.BridgeDisk.loadFileBytes)throw new Error("BridgeDisk.loadFileBytes is required for uploadFile (Phase 3)");const N=await window.BridgeDisk.loadFileBytes(w),A=String(b).replace(/\\/g,"/");return await e.fs_put(N,A,C||function(){})}async function I(w,b){if(!window.BridgeDisk||!window.BridgeDisk.saveFileContent)throw new Error("BridgeDisk.saveFileContent is required for downloadFile (Phase 3)");const C=await e.fs_cat_binary(w);return await window.BridgeDisk.saveFileContent(b,C)}async function L(w){const b=await e.run(`
import os
try:
  os.stat("${w}")
  print(0)
except OSError:
  print(1)
`);return b&&b[2]==="0"}function m(w){f=w}function $(w){g=w}Object.assign(window.BridgeSerial,{loadPorts:s,requestPort:h,connect:_,disconnect:v,run:y,execFile:n,getPrompt:o,keyboardInterrupt:p,reset:k,eval:u,onData:m,listFiles:F,ilistFiles:x,loadFile:S,removeFile:D,saveFileContent:E,uploadFile:R,downloadFile:I,renameFile:B,onConnectionClosed:$,createFolder:M,removeFolder:P,fileExists:L}),window.__micropython=e})(),(function(){if(!window.PosixPath||!window.FsaHandleStore){console.error("[BridgeDisk] Required modules missing \u2014 check script order in index.html");return}const e=window.PosixPath,i=window.FsaHandleStore;let a=null,r=null;const l=(async()=>{try{const P=await i.loadHandle();P&&await i.queryPermissionOnly(P,"readwrite")&&(a=P,r=P.name)}catch(P){}})();function f(P){let E=e.normalize(P);if(r){if(E===r)return"";if(E.startsWith(r+"/"))return E.slice(r.length+1)}return E}async function g(P,E){if(!a)throw new Error("No folder selected");if(!P||P==="."||P==="/")return a;let R=a;for(const I of P.split("/").filter(L=>L&&L!=="."))R=await R.getDirectoryHandle(I,E||void 0);return R}async function s(P,E){const R=f(P),I=e.dirname(R),L=e.basename(R),m=E&&E.create?{create:!0}:void 0;return await(await g(I==="/"?"":I,m)).getFileHandle(L,E||void 0)}async function c(){if(a)return;const P=await i.loadHandle();if(P&&await i.verifyPermission(P,"readwrite")){a=P,r=P.name;return}throw new Error('No folder selected. Click "Open Folder" first.')}async function d(P){const E=await g(P),R=[];for await(const[I,L]of E.entries())L.kind==="file"&&R.push(I);return R}async function h(P){const E=await g(P),R=[];for await(const[I,L]of E.entries())I.startsWith(".")||R.push({path:I,type:L.kind==="directory"?"folder":"file"});return R}async function _(P,E,R){const I=await g(P);for await(const[L,m]of I.entries()){if(L.startsWith("."))continue;const $=P?P+"/"+L:L,w=E?E+"/"+L:L;R.push({path:w,type:m.kind==="directory"?"folder":"file"}),m.kind==="directory"&&await _($,w,R)}}async function v(){if(typeof window.showDirectoryPicker!="function")throw new Error("File System Access API not supported in this browser");let P;try{P=await window.showDirectoryPicker({mode:"readwrite"})}catch(R){if(R&&(R.name==="AbortError"||/aborted|cancel/i.test(R.message||"")))return{folder:null,files:[]};throw R}await i.saveHandle(P),a=P,r=P.name;const E=await d("");return{folder:P.name,files:E}}async function y(P){return await c(),await d(f(P))}async function n(P){return await c(),await h(f(P))}async function o(P){await c();const E=[];return await _(f(P),String(P||""),E),E}async function u(P){await c();const R=await(await s(P)).getFile();return new Uint8Array(await R.arrayBuffer())}async function p(P){const E=await u(P);return new TextDecoder("utf-8").decode(E)}async function k(P,E){await c();const I=await(await s(P,{create:!0})).createWritable();let L;return E instanceof Uint8Array?L=E:E instanceof ArrayBuffer?L=new Uint8Array(E):L=String(E==null?"":E),await I.write(L),await I.close(),!0}async function F(P){await c();const E=f(P),R=e.dirname(E),I=e.basename(E);return await(await g(R==="/"?"":R)).removeEntry(I),!0}async function x(P,E){await c();const R=f(P),I=f(E),L=await s(P);if(typeof L.move=="function"){const $=e.dirname(R),w=e.dirname(I),b=e.basename(I);try{if($===w)await L.move(b);else{const N=await g(w==="/"?"":w,{create:!0});await L.move(N,b)}return!0}catch(C){}}const m=await u(P);return await k(E,m),await F(P),!0}async function S(P){return await c(),await g(f(P),{create:!0}),!0}async function D(P){await c();const E=f(P);if(!E)throw new Error("Cannot remove the root folder");const R=e.dirname(E),I=e.basename(E);return await(await g(R==="/"?"":R)).removeEntry(I,{recursive:!0}),!0}async function B(P){await c();try{return await s(P),!0}catch(E){if(E&&E.name==="NotFoundError")try{return await g(f(P)),!0}catch(R){return!1}throw E}}function M(){return Promise.resolve("./")}Object.assign(window.BridgeDisk,{openFolder:v,listFiles:y,ilistFiles:n,ilistAllFiles:o,loadFile:p,loadFileBytes:u,saveFileContent:k,removeFile:F,renameFile:x,createFolder:S,removeFolder:D,fileExists:B,getAppPath:M,whenReady:()=>l,hasRoot:()=>!!a}),window.__bridgeDiskState=()=>({rootName:r,hasHandle:!!a})})(),(function(){if(!window.AppDialog||!window.AppShortcuts||!window.AppShortcutManager){console.error("[BridgeWindow] required modules missing \u2014 check script order");return}function e(h){return window.AppDialog.openDialog(h||{})}function i(){return window.AppShortcuts.map}function a(h){window.AppShortcutManager.onShortcut(h)}function r(h){window.AppShortcutManager.onDisableShortcuts(h)}let l=null;function f(h){l=h,window.addEventListener("beforeunload",_=>{if(l){try{Promise.resolve(l()).catch(()=>{})}catch(v){}_.preventDefault(),_.returnValue=""}})}function g(){try{window.close()}catch(h){}return Promise.resolve()}function s(){}function c(){return Promise.resolve(!1)}function d(h){try{window.dispatchEvent(new CustomEvent("menu-state-change",{detail:h}))}catch(_){}return Promise.resolve()}Object.assign(window.BridgeWindow,{openDialog:e,getShortcuts:i,onKeyboardShortcut:a,onDisableShortcuts:r,beforeClose:f,confirmClose:g,setWindowSize:s,isPackaged:c,updateMenuState:d})})(),(function(){const e=["https://raw.githubusercontent.com/arduino/package-index-py/main/package-list.yaml","https://raw.githubusercontent.com/arduino/package-index-py/main/micropython-lib.yaml","https://raw.githubusercontent.com/moyalab/package-index-py/main/package-list.yaml"],i="https://micropython.org/pi/v2",a="/lib";let r=null,l=null;function f(m){if(!m)return"";const $=m.indexOf("OK"),w=m.indexOf("");return $===-1||w===-1||w<=$+2?"":m.substring($+2,w).trim()}async function g(m=!1){if(r&&!m)return r;if(l)return l;l=(async()=>{let $=[];for(const w of e)try{const b=await fetch(w,{cache:"no-cache"});if(!b.ok)throw new Error(`HTTP ${b.status}`);const C=await b.text(),N=window.jsyaml.load(C);N&&Array.isArray(N.packages)&&($=$.concat(N.packages))}catch(b){throw new Error(`Failed to fetch ${w}: ${b.message}`)}return $.sort((w,b)=>(w.name||"").localeCompare(b.name||"")),r=$,$})();try{return await l}finally{l=null}}function s(m,$){const w=Array.isArray($)?$:r||[];if(!m)return w.slice();const b=m.trim().toLowerCase();return b?w.filter(C=>C?[C.name,C.description,C.author,C.url,Array.isArray(C.tags)?C.tags.join(" "):C.tags].filter(Boolean).join(" ").toLowerCase().includes(b):!1):w.slice()}function c(m){if(!m)return null;const $=m.split("-");return $.length>=3?$[2]:null}async function d(){if(!window.BridgeSerial||typeof window.BridgeSerial.run!="function")return{format:null,arch:null};let m=null,$=null;try{const w=await window.BridgeSerial.run(`import sys
try:
  print(sys.implementation._mpy & 0xff)
except AttributeError:
  print("")
`),b=f(w);b&&/^\d+$/.test(b)&&(m=Number(b))}catch(w){}try{const w=await window.BridgeSerial.run(`try:
  import platform
  print(platform.platform())
except Exception:
  print("")
`);$=c(f(w))}catch(w){}return{format:m,arch:$}}function h(m){return m?m.startsWith("github:")||m.startsWith("gitlab:")||m.startsWith("http://")||m.startsWith("https://"):!1}function _(m,$){let w=String(m).trim(),b=$||null;const C=w.lastIndexOf("@");if(C>w.indexOf("://")&&C!==-1)b=b||w.substring(C+1),w=w.substring(0,C);else if(w.startsWith("github:")||w.startsWith("gitlab:")){const N=w.indexOf(":"),A=w.substring(N+1),T=A.lastIndexOf("@");T!==-1&&(b=b||A.substring(T+1),w=w.substring(0,N+1)+A.substring(0,T))}if(b=b||"HEAD",/\.(py|mpy)$/i.test(w))return{kind:"file",fileUrl:v(w,b),fileName:w.split("/").pop(),version:b};if(w.startsWith("github:")||w.startsWith("gitlab:")){const N=w.startsWith("github:")?"github":"gitlab",T=w.substring(w.indexOf(":")+1).split("/"),H=T[0],O=T[1],U=T.slice(2).join("/");return{kind:"repo",host:N,owner:H,repo:O,subdir:U,version:b}}try{const N=new URL(w);if(N.hostname==="github.com"||N.hostname==="www.github.com"){const A=N.pathname.replace(/^\//,"").split("/"),T=A[0],H=A[1];let O=A.slice(2);return(O[0]==="tree"||O[0]==="blob")&&(b=b==="HEAD"?O[1]||"HEAD":b,O=O.slice(2)),{kind:"repo",host:"github",owner:T,repo:H,subdir:O.join("/"),version:b}}if(N.hostname==="gitlab.com"||N.hostname==="www.gitlab.com"){const A=N.pathname.replace(/^\//,"").split("/");return{kind:"repo",host:"gitlab",owner:A[0],repo:A[1],subdir:A.slice(2).join("/"),version:b}}if(N.hostname==="raw.githubusercontent.com"){const A=N.pathname.replace(/^\//,"").split("/"),T=A[0],H=A[1],O=A[2];return{kind:"repo",host:"github",owner:T,repo:H,subdir:A.slice(3).join("/"),version:b==="HEAD"?O:b}}}catch(N){}throw new Error(`Unrecognized package URL: ${m}`)}function v(m,$){if(m.startsWith("github:")){const b=m.substring(7).split("/"),C=b[0],N=b[1],A=b.slice(2).join("/");return`https://raw.githubusercontent.com/${C}/${N}/${$}/${A}`}if(m.startsWith("gitlab:")){const b=m.substring(7).split("/"),C=b[0],N=b[1],A=b.slice(2).join("/");return`https://gitlab.com/${C}/${N}/-/raw/${$}/${A}`}return m}function y(m,$){const w=m.version||"HEAD",b=m.subdir?m.subdir.replace(/\/$/,"")+"/":"";return m.host==="github"?`https://raw.githubusercontent.com/${m.owner}/${m.repo}/${w}/${b}${$}`:`https://gitlab.com/${m.owner}/${m.repo}/-/raw/${w}/${b}${$}`}async function n(m){const $=await fetch(m,{cache:"no-cache"});if(!$.ok)throw new Error(`Fetch ${m} \u2192 HTTP ${$.status}`);const w=await $.arrayBuffer();return new Uint8Array(w)}async function o(m){const $=await fetch(m,{cache:"no-cache"});if(!$.ok)throw new Error(`Fetch ${m} \u2192 HTTP ${$.status}`);return await $.json()}async function u(m){const $=y(m,"package.json");try{return await o($)}catch(w){throw new Error(`Could not find package.json at ${$} \u2014 ${w.message}`)}}function p(...m){return m.filter($=>$!=null&&$!=="").join("/").replace(/\/+/g,"/")}function k(m){if(!m)return"/";const $=m.lastIndexOf("/");return $<=0?"/":m.substring(0,$)}async function F(m){const $=m.split("/").filter(Boolean);let w="";for(const b of $){w+="/"+b;try{await window.BridgeSerial.createFolder(w)}catch(C){}}}async function x(m,$,w){return await F(k($)),await window.BridgeSerial.saveFileContent($,m,w||(()=>{}))}async function S(m){let $;try{$=await window.BridgeSerial.ilistFiles(m)}catch(w){return}if(Array.isArray($)){for(const w of $){const b=w[0],C=w[1],N=p(m,b);if(C===16384)await S(N);else try{await window.BridgeSerial.removeFile(N)}catch(A){}}try{await window.BridgeSerial.removeFolder(m)}catch(w){}}}function D(m,$){const w=[];if(!m||!Array.isArray(m.hashes))return w;for(const[b,C]of m.hashes){const N=C.slice(0,2);w.push({boardRelPath:b,fileUrl:`${i}/file/${N}/${C}`})}return w}function B(m,$){const w=[];if(!m||!Array.isArray(m.urls))return w;for(const b of m.urls){const C=b[0],N=b[1];let A;/^https?:\/\//.test(N)?A=N:N.startsWith("github:")||N.startsWith("gitlab:")?A=v(N,$.version):A=y($,N),w.push({boardRelPath:C,fileUrl:A})}return w}async function M(m,{visitedKey:$,mpyFormat:w,visited:b=new Set}){if(b.has($))return{entries:[],packageName:null};b.add($);let C=[],N=null,A=null;if(m.kind==="index"){const T=`${i}/package/${w}/${m.name}/${m.version}.json`,H=await o(T);N=H.name||m.name,C=D(H,w),A=H.deps||null}else if(m.kind==="repo"){const T=await u(m.repo);N=T.name||m.repo.repo,C=B(T,m.repo),A=T.deps||null}else if(m.kind==="file"){const T=m.fileName;N=T.replace(/\.(m?py)$/i,""),C=[{boardRelPath:T,fileUrl:m.fileUrl}]}if(Array.isArray(A))for(const T of A){const H=Array.isArray(T)?T[0]:T,O=Array.isArray(T)?T[1]:null,U=P(H,O),V=E(U),j=await M(U,{visitedKey:V,mpyFormat:w,visited:b});C=C.concat(j.entries)}return{entries:C,packageName:N}}function P(m,$){if(!m)throw new Error("Empty package identifier");if(h(m)||/\.(py|mpy)$/i.test(m)){const b=_(m,$);return b.kind==="file"?{kind:"file",fileUrl:b.fileUrl,fileName:b.fileName}:{kind:"repo",repo:b}}const w=$||"latest";return{kind:"index",name:m,version:w==="HEAD"?"latest":w}}function E(m){return m.kind==="index"?`index:${m.name}@${m.version}`:m.kind==="repo"?`repo:${m.repo.host}:${m.repo.owner}/${m.repo.repo}/${m.repo.subdir}@${m.repo.version}`:`file:${m.fileUrl}`}function R(m){const $=new Set;for(const w of m){const b=w.boardRelPath.split("/")[0];b&&b.indexOf(".")===-1&&$.add(b)}return Array.from($)}async function I(m,$={}){const{overwrite:w=!0,installAsMpy:b=!0,mpySpec:C=null,onProgress:N=()=>{}}=$;if(!m)throw new Error("No package provided");const T=b&&C&&C.format!=null?String(C.format):"py";let H;if(m.url)H=P(m.url,m.version);else if(m.name)H=P(m.name,m.version);else throw new Error("Package has neither name nor url");N({phase:"resolve",message:"Resolving package and dependencies\u2026"});const{entries:O}=await M(H,{visitedKey:E(H),mpyFormat:T});if(O.length===0)throw new Error("No files to install");const U=a;try{await window.BridgeSerial.createFolder(U)}catch(W){}const V=R(O);for(const W of V){const z=p(U,W);if(await window.BridgeSerial.fileExists(z)){if(!w)throw new Error(`Package folder already exists: ${z}`);N({phase:"cleanup",message:`Removing existing ${z}\u2026`}),await S(z)}}for(const W of O){if(W.boardRelPath.indexOf("/")!==-1)continue;const z=p(U,W.boardRelPath);if(await window.BridgeSerial.fileExists(z)){if(!w)throw new Error(`File already exists: ${z}`);try{await window.BridgeSerial.removeFile(z)}catch(K){}}}let j=0;for(const W of O){j+=1;const z=p(U,W.boardRelPath);N({phase:"install",message:`Installing ${j}/${O.length}: ${W.boardRelPath}`,current:j,total:O.length});const q=await n(W.fileUrl);await x(q,z,K=>{N({phase:"install",message:`Installing ${j}/${O.length}: ${W.boardRelPath} ${K}`,current:j,total:O.length,chunk:K})})}return N({phase:"done",message:`Installed ${O.length} file(s)`}),{installedFiles:O.length,formatUsed:T}}async function L(m,$={}){if(!m||typeof m!="string")throw new Error("URL is required");return await I({url:m.trim()},$)}window.PackageInstaller={getPackageList:g,findPackages:s,getBoardMpySpec:d,installPackage:I,installFromURL:L,_internals:{parseRepoUrl:_,resolveInstallTarget:P,targetKey:E,extractStdout:f,parseArchFromPlatform:c}}})(),(function(){function e(){return typeof navigator!="undefined"&&"serial"in navigator&&typeof window.showDirectoryPicker=="function"}function i(){const l=navigator.userAgentData&&navigator.userAgentData.brands&&navigator.userAgentData.brands.map(f=>f.brand).join(", ")||navigator.userAgent||"";return html`
      <div id="app" class="app-unsupported">
        <div class="app-unsupported-card">
          <h2>This browser isn't supported</h2>
          <p>
            <strong>Arduino Lab for MicroPython</strong> (web edition) needs the
            <strong>Web Serial</strong> and <strong>File System Access</strong>
            APIs to talk to your board and read your local files.
          </p>
          <p>
            These are currently available only in Chromium-based browsers:
            <strong>Chrome 89+</strong>, <strong>Edge 89+</strong>,
            <strong>Opera 75+</strong>, and other Chromium derivatives.
            Firefox and Safari do not implement Web Serial.
          </p>
          <p class="app-unsupported-actions">
            <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">Download Chrome</a>
            <span class="sep">·</span>
            <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener noreferrer">Download Edge</a>
          </p>
          <p class="app-unsupported-ua">Detected: ${l}</p>
        </div>
      </div>
    `}let a=!1;function r(){if(a)return;a=!0;const l=`
      .app-unsupported {
        font-family: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 24px;
        background: #fafafa;
      }
      .app-unsupported-card {
        max-width: 560px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 28px 32px;
      }
      .app-unsupported-card h2 { margin-top: 0; }
      .app-unsupported-card p { line-height: 1.5; }
      .app-unsupported-actions { margin-top: 24px; font-size: 15px; }
      .app-unsupported-actions a { color: #1976d2; text-decoration: none; }
      .app-unsupported-actions a:hover { text-decoration: underline; }
      .app-unsupported-actions .sep { margin: 0 10px; color: #aaa; }
      .app-unsupported-ua {
        margin-top: 28px;
        font-size: 12px;
        color: #888;
        word-break: break-all;
      }
    `,f=document.createElement("style");f.textContent=l,document.head.appendChild(f)}window.UnsupportedBrowser={isSupported:e,render:()=>(r(),i())}})();const log=console.log,serialBridge=window.BridgeSerial,disk=window.BridgeDisk,win=window.BridgeWindow,shortcuts=window.BridgeWindow.getShortcuts();let notyf=null;const newFileContent=`from bitblock import Bitblock
import time

print('Hello, BitBlock!')
`;async function sleep(e){return new Promise(i=>setTimeout(i,e))}async function confirmDialog(e,i,a,r){let l=[];a&&l.push(a),i&&l.push(i);let f=await win.openDialog({type:"question",title:r||"",buttons:l,defaultId:0,cancelId:1,message:e});return Promise.resolve(f)}async function store(e,i){win.setWindowSize(720,640),notyf||(notyf=new window.Notyf({duration:2e3,position:{x:"center",y:"top"},dismissible:!0,ripple:!0})),e.platform=window.BridgeWindow.getOS(),e.view="editor",e.diskNavigationPath="/",e.diskNavigationRoot=getDiskNavigationRootFromStorage(),e.diskFiles=[],e.boardNavigationPath="/",e.boardNavigationRoot="/",e.boardFiles=[],e.openFiles=[],e.selectedFiles=[],e.newTabFileName=null,e.editingFile=null,e.creatingFile=null,e.renamingFile=null,e.creatingFolder=null,e.renamingTab=null,e.isSidebarOpen=!0,e.sidebarWidth=getSidebarWidthFromStorage(),e.isFullscreen=!1,e.language=window.i18n.getLanguage(),e.isConnecting=!1,e.isConnected=!1,e.connectedPort=null,e.isRunning=!1,e.isNewFileDialogOpen=!1,e.isInstallPackageDialogOpen=!1,e.isInstallingPackage=!1,e.installPackageProgress="",e.installPackageError=null,e.packageList=[],e.packageSearchQuery="",e.packageSearchResults=[],e.selectedPackage=null,e.packageOverwrite=!0,e.installAsMpy=!0,e.boardMpyFormat=null,e.boardMpyArch=null,e.isSaving=!1,e.savingProgress=0,e.isTransferring=!1,e.transferringProgress="",e.isRemoving=!1,e.isLoadingFiles=!1,e.dialogs=[],e.isTerminalBound=!1,e.shortcutsDisabled=!1,e.activeView="explorer",e.topicsByFile={},e.selectedTopicId={},e.topicsLoading={},e.topicsError={},e.collapsedEntries={},await y("disk"),e.diskNavigationRoot&&window.BridgeDisk&&window.BridgeDisk.whenReady&&window.BridgeDisk.whenReady().then(()=>{window.BridgeDisk.hasRoot&&window.BridgeDisk.hasRoot()&&i.emit("refresh-files")}),e.savedPanelHeight=PANEL_DEFAULT,e.panelHeight=PANEL_DEFAULT,e.isResizingPanel=!1,e.resizePanel=function(n){e.panelHeight=PANEL_CLOSED/2+document.body.clientHeight-n.clientY,e.panelHeight<=PANEL_CLOSED?e.savedPanelHeight=PANEL_DEFAULT:e.savedPanelHeight=e.panelHeight,i.emit("render")};const a=()=>{window.BridgeWindow.updateMenuState({isConnected:e.isConnected,view:e.view})};async function r(){if(e.diskNavigationRoot)return e.diskNavigationRoot;const n=await selectDiskFolder();return n?(saveDiskNavigationRootToStorage(n),e.diskNavigationRoot=n,e.diskNavigationPath="/",n):null}i.on("select-disk-navigation-root",async()=>{const n=await selectDiskFolder();if(!n){i.emit("render");return}saveDiskNavigationRootToStorage(n),e.diskNavigationRoot=n,e.diskNavigationPath="/",e.selectedFiles=(e.selectedFiles||[]).filter(o=>o.source!=="disk"),i.emit("refresh-files"),i.emit("render")}),i.on("toggle-sidebar",()=>{e.isSidebarOpen=!e.isSidebarOpen,i.emit("render")}),i.on("set-sidebar-width",n=>{const o=clampSidebarWidth(n);o!==e.sidebarWidth&&(e.sidebarWidth=o,saveSidebarWidthToStorage(o),i.emit("render"))}),i.on("set-language",n=>{window.i18n.setLanguage(n),e.language=window.i18n.getLanguage(),e.topicsByFile={},e.topicsLoading={},e.topicsError={},i.emit("render")}),i.on("set-active-view",n=>{e.activeView=n,i.emit("render")}),i.on("select-topic",({view:n,topicId:o})=>{e.selectedTopicId[n]=o,e.collapsedEntries={},i.emit("render")}),i.on("toggle-entry",({key:n})=>{n&&(e.collapsedEntries[n]?delete e.collapsedEntries[n]:e.collapsedEntries[n]=!0,i.emit("render"))}),i.on("load-topics",async({key:n,lang:o})=>{if(!e.topicsLoading[n]){e.topicsLoading[n]=!0,e.topicsError[n]=null,i.emit("render");try{const u=await fetch(`data/topics/${n}.${o}.json`);if(!u.ok)throw new Error(`HTTP ${u.status}`);const p=await u.json();e.topicsByFile[n]={topics:p,lang:o}}catch(u){e.topicsError[n]=u&&u.message?u.message:String(u)}e.topicsLoading[n]=!1,i.emit("render")}}),i.on("toggle-fullscreen",async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch(n){console.error("fullscreen toggle failed",n)}}),document.addEventListener("fullscreenchange",()=>{e.isFullscreen=!!document.fullscreenElement,i.emit("render")}),i.on("change-view",async n=>{e.view!==n&&(e.selectedFiles=[],n==="file-manager"&&(i.emit("stop"),await sleep(250),i.emit("refresh-files")),e.view=n,i.emit("render"),a())}),i.on("launch-app",async(n,o)=>{window.launchApp(n,o)}),i.on("open-install-package-dialog",async()=>{if(!e.isConnected){i.emit("connect");return}e.isInstallPackageDialogOpen=!0,e.installPackageError=null,e.installPackageProgress="",i.emit("render");try{const n=await window.PackageInstaller.getBoardMpySpec();e.boardMpyFormat=n.format,e.boardMpyArch=n.arch}catch(n){e.boardMpyFormat=null,e.boardMpyArch=null}if(e.packageList.length===0)try{const n=await window.PackageInstaller.getPackageList();e.packageList=n,e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,n)}catch(n){e.installPackageError=t("toast.packageRegistryFailed",{err:n.message})}else e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList);i.emit("render")}),i.on("close-install-package-dialog",()=>{e.isInstallingPackage||(e.isInstallPackageDialogOpen=!1,i.emit("render"))}),i.on("search-packages",n=>{e.packageSearchQuery=n||"",e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList),i.emit("render")}),i.on("select-package-to-install",n=>{e.selectedPackage=n,i.emit("render")}),i.on("toggle-install-overwrite",n=>{e.packageOverwrite=!!n,i.emit("render")});async function l(n){e.isInstallingPackage=!0,e.installPackageError=null,e.installPackageProgress=t("dialog.install.resolving"),i.emit("render");try{await window.PackageInstaller.installPackage(n,{overwrite:e.packageOverwrite,installAsMpy:!0,mpySpec:{format:e.boardMpyFormat,arch:e.boardMpyArch},onProgress:o=>{e.installPackageProgress=o&&o.message?o.message:"",i.emit("render")}}),e.installPackageProgress=t("dialog.install.installed"),i.emit("refresh-files")}catch(o){e.installPackageError=o.message||String(o)}finally{e.isInstallingPackage=!1,i.emit("render")}}i.on("install-package",async n=>{e.isInstallingPackage||!n||await l(n)}),i.on("select-port",async n=>{log("connect",n);const o=n.path;e.isConnecting=!0,i.emit("render");let u=setTimeout(()=>{let k=win.openDialog({type:"error",title:t("dialog.connectFailed.title"),buttons:[t("dialog.ok")],cancelId:0,message:t("dialog.connectFailed.msg")});i.emit("connection-timeout")},3500);try{await serialBridge.connect(o)}catch(k){console.error(k)}await serialBridge.getPrompt(),clearTimeout(u),e.isConnecting=!1,e.isConnected=!0,e.boardNavigationPath=await getBoardNavigationPath(),a(),e.view==="editor"&&e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),e.connectedPort=o;let p=e.cache(XTerm,"terminal").term;e.isTerminalBound||(e.isTerminalBound=!0,p.onData(k=>{serialBridge.eval(k),p.scrollToBottom()}),serialBridge.eval("")),serialBridge.onData(k=>{p.write(k),p.scrollToBottom()}),serialBridge.onConnectionClosed(()=>i.emit("disconnected")),i.emit("refresh-files"),i.emit("render")}),i.on("disconnected",()=>{e.isConnected=!1,e.isRunning=!1,e.panelHeight=PANEL_CLOSED,e.boardFiles=[],e.boardNavigationPath="/",e.boardMpyFormat=null,e.boardMpyArch=null,e.isInstallPackageDialogOpen=!1,notyf.error({message:t("toast.boardDisconnected"),className:"toast-board-disconnected"}),i.emit("refresh-files"),i.emit("render"),a()}),i.on("disconnect",async()=>{await serialBridge.disconnect()}),i.on("connection-timeout",async()=>{e.isConnected=!1,e.isConnecting=!1,e.isRunning=!1,i.emit("render")}),i.on("connect",async()=>{let n;try{n=await serialBridge.requestPort()}catch(o){console.error("connect: requestPort failed",o);return}n&&i.emit("select-port",n)}),i.on("run-from-button",(n=!1)=>{n?h():d()}),i.on("run",async(n=!1)=>{log("run");const o=e.openFiles.find(F=>F.id==e.editingFile);let u=o.editor.editor.state.doc.toString();const p=o.editor.editor.state.selection.ranges[0].from,k=o.editor.editor.state.selection.ranges[0].to;k-p>0&&n&&(selectedCode=o.editor.editor.state.doc.toString().substring(p,k),selectedCode.trim().length>0&&(u=selectedCode)),e.isRunning=!0,i.emit("open-panel"),el=document.querySelector(".xterm-helper-textarea"),el&&el.focus(),i.emit("render");try{await serialBridge.getPrompt(),await serialBridge.run(u)}catch(F){log("error",F)}finally{e.isRunning=!1}el=document.querySelector(".cm-content"),el&&el.focus(),i.emit("render")}),i.on("stop",async()=>{log("stop"),e.isRunning=!1,e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),e.isConnected&&await serialBridge.getPrompt()}),i.on("reset",async()=>{log("reset"),e.isRunning=!1,e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),await serialBridge.reset(),i.emit("update-files"),i.emit("render")}),i.on("open-panel",()=>{i.emit("stop-resizing-panel"),e.panelHeight=e.savedPanelHeight,i.emit("render"),setTimeout(()=>{e.cache(XTerm,"terminal").resizeTerm()},550)}),i.on("close-panel",()=>{i.emit("stop-resizing-panel"),e.savedPanelHeight=e.panelHeight,e.panelHeight=0,i.emit("render")}),i.on("clear-terminal",()=>{e.cache(XTerm,"terminal").term.clear()}),i.on("start-resizing-panel",()=>{log("start-resizing-panel"),e.isResizingPanel=!0,i.emit("render"),window.addEventListener("mousemove",e.resizePanel),document.body.addEventListener("mouseleave",()=>{i.emit("stop-resizing-panel")},{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",()=>{i.emit("stop-resizing-panel")},{once:!0})}),i.on("stop-resizing-panel",()=>{log("stop-resizing-panel"),e.isResizingPanel=!1,window.removeEventListener("mousemove",e.resizePanel),i.emit("render")}),i.on("create-new-file",()=>{log("create-new-file"),f(),e.isNewFileDialogOpen=!0,i.emit("render"),document.addEventListener("keydown",f)}),i.on("close-new-file-dialog",()=>{e.isNewFileDialogOpen=!1,f(),i.emit("render")}),i.on("save",async()=>{if(log("save"),canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile})==!1){log("can't save");return}let o=e.openFiles.find(S=>S.id===e.editingFile);if(o.source==="disk"&&!e.diskNavigationRoot&&!await r()){i.emit("render");return}let u=!1;const p=o.parentFolder,k=p===null;k&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let F=!1;if(o.source=="board"?(await serialBridge.getPrompt(),F=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(F=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),(k||!F)&&(o.source=="board"?(o.parentFolder=e.boardNavigationPath,await serialBridge.getPrompt(),u=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(o.parentFolder=e.diskNavigationPath,u=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName)))),u&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){o.parentFolder=p,i.emit("render");return}e.isSaving=!0,i.emit("render");const x=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),x,S=>{e.savingProgress=S,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),x)}catch(S){log("error",S)}o.hasChanges=!1,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("select-tab",n=>{log("select-tab",n),e.editingFile=n,i.emit("render")}),i.on("close-tab",async n=>{if(log("close-tab",n),e.openFiles.find(u=>u.id===n).hasChanges&&!await confirmDialog(t("dialog.unsaved.msg"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;e.openFiles=e.openFiles.filter(u=>u.id!==n),e.openFiles.length>0?e.editingFile=e.openFiles[0].id:await y("disk"),i.emit("render")}),i.on("refresh-files",async()=>{if(log("refresh-files"),!e.isLoadingFiles){if(e.isLoadingFiles=!0,i.emit("render"),e.isConnected)try{e.boardFiles=await getBoardFiles(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch(n){e.boardFiles=[]}else e.boardFiles=[];if(e.diskNavigationRoot)try{e.diskFiles=await getDiskFiles(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(n){const o=n&&typeof n.message=="string"?n.message:"";n&&(n.name==="NotAllowedError"||n.name==="SecurityError")||o.startsWith("No folder selected")?e.diskFiles=[]:(e.diskNavigationRoot=null,e.diskNavigationPath="/",e.diskFiles=[])}else e.diskFiles=[];i.emit("refresh-selected-files"),e.isLoadingFiles=!1,i.emit("render")}}),i.on("refresh-selected-files",()=>{log("refresh-selected-files"),e.selectedFiles=e.selectedFiles.filter(n=>n.source==="board"?e.isConnected?e.boardFiles.find(o=>n.fileName===o.fileName):!1:e.diskFiles.find(o=>n.fileName===o.fileName)),i.emit("render")}),i.on("create-new-tab",async(n,o=null)=>{const u=n=="board"?e.boardNavigationPath:e.diskNavigationPath;log("create-new-tab",n,o,u),await y(n,o,u)&&(i.emit("close-new-file-dialog"),i.emit("render"))}),i.on("create-file",(n,o=null)=>{log("create-file",n),e.creatingFile===null&&(e.creatingFile=n,e.creatingFolder=null,o!=null&&i.emit("finish-creating-file",o),i.emit("render"))}),i.on("finish-creating-file",async n=>{if(log("finish-creating",n),!!e.creatingFile){if(!n){e.creatingFile=null,i.emit("render");return}if(e.creatingFile=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n),newFileContent)}else if(e.creatingFile=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n),newFileContent)}setTimeout(()=>{e.creatingFile=null,f(),i.emit("refresh-files"),i.emit("render")},200)}}),i.on("create-folder",n=>{log("create-folder",n),e.creatingFolder===null&&(e.creatingFolder=n,e.creatingFile=null,i.emit("render"))}),i.on("finish-creating-folder",async n=>{if(log("finish-creating-folder",n),!!e.creatingFolder){if(!n){e.creatingFolder=null,i.emit("render");return}if(e.creatingFolder=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}await serialBridge.createFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}else if(e.creatingFolder=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}await disk.createFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}setTimeout(()=>{e.creatingFolder=null,i.emit("refresh-files"),i.emit("render")},200)}}),i.on("remove-files",async n=>{log("remove-files",n||"(all)");const o=n?e.selectedFiles.filter(x=>x.source===n):e.selectedFiles;if(o.length===0)return;let u=o.filter(x=>x.source==="board").map(x=>x.fileName),p=o.filter(x=>x.source==="disk").map(x=>x.fileName),k=t("dialog.delete.header");if(u.length&&(k+=t("dialog.delete.fromBoard"),u.forEach(x=>k+=`${x}
`),k+=`
`),p.length&&(k+=t("dialog.delete.fromDisk"),p.forEach(x=>k+=`${x}
`),k+=`
`),k+=t("dialog.overwrite.proceed"),!!await confirmDialog(k,t("dialog.cancel"),t("dialog.yes"),t("dialog.delete.title"))){e.isRemoving=!0,i.emit("render");for(let x in o){const S=o[x];S.type=="folder"?S.source==="board"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,S.fileName)):await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,S.fileName)):S.source==="board"?await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,S.fileName)):await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,S.fileName))}i.emit("refresh-files"),n?e.selectedFiles=e.selectedFiles.filter(x=>x.source!==n):e.selectedFiles=[],e.isRemoving=!1,i.emit("render")}}),i.on("rename-file",(n,o)=>{log("rename-file",n,o),e.renamingFile=n,i.emit("render")}),i.on("finish-renaming-file",async n=>{log("finish-renaming-file",n);const o=e.selectedFiles[0];if(!n||o.fileName==n){e.renamingFile=null,i.emit("render");return}if(e.renamingFile=="board"&&e.isConnected){if((await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""),source:"board"})).length>0){let p=t("dialog.overwrite.msgSingleBoardHeader");if(p+=`${n}

`,p+=t("dialog.overwrite.proceed"),!await confirmDialog(p,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):o.type=="file"&&await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}}else if(e.renamingFile=="disk"&&(await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),source:"disk"})).length>0){let p=t("dialog.overwrite.msgSingleDiskHeader");if(p+=`${n}

`,p+=t("dialog.overwrite.proceed"),!await confirmDialog(p,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n)):o.type=="file"&&await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}e.isSaving=!0,i.emit("render");try{e.renamingFile=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,o.fileName),serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,o.fileName),disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n));const u=e.openFiles.findIndex(p=>p.fileName===o.fileName&&p.source===o.source&&p.parentFolder===o.parentFolder);u>-1&&(e.openFiles[u].fileName=n,i.emit("render"))}catch(u){alert(`The file ${o.fileName} could not be renamed to ${n}`)}e.isSaving=!1,e.renamingFile=null,i.emit("refresh-files"),i.emit("render")}),i.on("rename-tab",n=>{log("rename-tab",n),e.renamingTab=n,i.emit("render")}),i.on("finish-renaming-tab",async n=>{log("finish-renaming-tab",n);const o=e.openFiles.find(S=>S.id===e.renamingTab);if(!n||o.fileName==n){e.renamingTab=null,e.isSaving=!1,i.emit("render");return}const u=o.parentFolder,p=o.fileName;o.fileName=n;const k=u===null;let F=!1;k||(o.source=="board"?F=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,p)):o.source=="disk"&&(F=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,p)))),(k||!F)&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let x=!1;if(o.source=="board"?x=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&(x=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),x&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingTab=null,o.fileName=p,i.emit("render");return}if(e.isSaving=!0,i.emit("render"),F){if(o.hasChanges){const S=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,p),S,D=>{e.savingProgress=D,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,p),S)}catch(D){log("error",D)}}try{o.source=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,p),serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,p),disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))}catch(S){log("error",S)}}else if(!F){const S=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),S,D=>{e.savingProgress=D,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),S)}catch(D){log("error",D)}}o.hasChanges=!1,e.renamingTab=null,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("toggle-file-selection",(n,o,u)=>{log("toggle-file-selection",n,o,u);let p=o=="board"?e.boardNavigationPath:e.diskNavigationPath;if(u&&!u.ctrlKey&&!u.metaKey){e.selectedFiles=[{fileName:n.fileName,type:n.type,source:o,parentFolder:p}],i.emit("render");return}e.selectedFiles.find(F=>F.fileName===n.fileName&&F.source===o)?e.selectedFiles=e.selectedFiles.filter(F=>!(F.fileName===n.fileName&&F.source===o)):e.selectedFiles.push({fileName:n.fileName,type:n.type,source:o,parentFolder:p}),i.emit("render")}),i.on("open-selected-files",async()=>{log("open-selected-files");let n=[],o=[];if(!e.isLoadingFiles){e.isLoadingFiles=!0,i.emit("render");for(let u in e.selectedFiles){let p=e.selectedFiles[u];if(p.type=="folder")continue;const k=e.openFiles.find(F=>F.fileName==p.fileName&&F.source==p.source&&F.parentFolder==p.parentFolder);if(k)o.push(k);else{let F=null;if(p.source=="board"){const x=await serialBridge.loadFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,p.fileName)),S=new Uint8Array(x),D=new TextDecoder("utf-8").decode(S);F=v({parentFolder:e.boardNavigationPath,fileName:p.fileName,source:p.source,content:D}),F.editor.onChange=function(){F.hasChanges=!0,i.emit("render")}}else if(p.source=="disk"){const x=await disk.loadFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,p.fileName));F=v({parentFolder:e.diskNavigationPath,fileName:p.fileName,source:p.source,content:x}),F.editor.onChange=function(){F.hasChanges=!0,i.emit("render")}}n.push(F)}}o.length>0&&(e.editingFile=o[0].id),n.length>0&&(e.editingFile=n[0].id),e.openFiles=e.openFiles.concat(n),e.selectedFiles=[],e.view="editor",a(),e.isLoadingFiles=!1,i.emit("render")}}),i.on("open-file",(n,o)=>{log("open-file",n,o),e.selectedFiles=[{fileName:o.fileName,type:o.type,source:n,parentFolder:e[`${n}NavigationPath`]}],i.emit("open-selected-files")}),i.on("upload-files",async()=>{log("upload-files");const n=await checkOverwrite({source:"board",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyBoardHeader");if(n.forEach(p=>o+=`${p.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const u=e.selectedFiles[o],p=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,u.fileName),k=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,u.fileName);u.type=="folder"?(await uploadFolder(p,k,(F,x)=>{e.transferringProgress=`${x}: ${F}`,i.emit("render")}),e.transferringProgress=""):(await serialBridge.uploadFile(p,k,F=>{e.transferringProgress=`${u.fileName}: ${F}`,i.emit("render")}),e.transferringProgress="")}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("download-files",async()=>{log("download-files");const n=await checkOverwrite({source:"disk",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyDiskHeader");if(n.forEach(p=>o+=`${p.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const u=e.selectedFiles[o],p=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,u.fileName),k=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,u.fileName);u.type=="folder"?await downloadFolder(p,k,F=>{e.transferringProgress=F,i.emit("render")}):await serialBridge.downloadFile(p,k,F=>{e.transferringProgress=F,i.emit("render")})}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-folder",n=>{log("navigate-board-folder",n),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-parent",()=>{log("navigate-board-parent"),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-folder",n=>{log("navigate-disk-folder",n),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-parent",()=>{log("navigate-disk-parent"),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),win.beforeClose(async()=>{if(!!e.openFiles.find(o=>o.hasChanges)&&!await confirmDialog(t("dialog.unsaved.msgMayHave"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;await win.confirmClose()}),win.onDisableShortcuts(n=>{e.shortcutsDisabled=n}),win.onKeyboardShortcut(n=>{if(!(e.isTransferring||e.isRemoving||e.isSaving||e.isNewFileDialogOpen)&&!e.shortcutsDisabled){if(n===shortcuts.CLOSE&&i.emit("close-tab",e.editingFile),n===shortcuts.CONNECT&&i.emit("connect"),n===shortcuts.DISCONNECT&&i.emit("disconnect"),n===shortcuts.RESET){if(e.view!="editor")return;i.emit("reset")}if(n===shortcuts.CLEAR_TERMINAL){if(e.view!="editor")return;i.emit("clear-terminal")}if(n===shortcuts.CLEAR_EDITOR){if(e.view!="editor")return;const o=e.openFiles.find(k=>k.id==e.editingFile),u=o&&o.editor&&o.editor.editor;if(!u)return;const p=u.state.doc.length;if(p===0)return;u.dispatch({changes:{from:0,to:p,insert:""},selection:{anchor:0}}),u.focus()}if(n===shortcuts.RUN){if(e.view!="editor")return;d()}if(n===shortcuts.RUN_SELECTION||n===shortcuts.RUN_SELECTION_WL){if(e.view!="editor")return;h()}if(n===shortcuts.STOP){if(e.view!="editor")return;_()}if(n===shortcuts.NEW){if(e.view!="editor")return;i.emit("create-new-file")}if(n===shortcuts.SAVE){if(e.view!="editor")return;i.emit("save")}if(n===shortcuts.EDITOR_VIEW){if(e.view!="file-manager")return;i.emit("change-view","editor")}if(n===shortcuts.FILES_VIEW){if(e.view!="editor")return;i.emit("change-view","file-manager")}}});function f(n=null){n&&n.key!="Escape"||(document.removeEventListener("keydown",f),e.isNewFileDialogOpen=!1,i.emit("render"))}let g=!1;function s(){g=!0,setTimeout(()=>{g=!1},500)}function c(n=!1){g||(i.emit("run",n),s())}function d(){canExecute({view:e.view,isConnected:e.isConnected})&&c()}function h(){canExecute({view:e.view,isConnected:e.isConnected})&&c(!0)}function _(){canExecute({view:e.view,isConnected:e.isConnected})&&i.emit("stop")}function v(n){const{source:o,parentFolder:u,fileName:p,content:k=newFileContent,hasChanges:F=!1}=n,x=generateHash(),S=e.cache(CodeMirrorEditor,`editor_${x}`);return S.content=k,{id:x,source:o,parentFolder:u,fileName:p,editor:S,hasChanges:F}}async function y(n,o=null,u=null){const p=n=="board"?e.boardNavigationPath:e.diskNavigationPath;let k=o;if(k===null){const D=e.openFiles.filter(M=>M.source===n&&M.parentFolder===u).map(M=>M.fileName),B=(n==="board"?e.boardFiles:e.diskFiles).map(M=>M.fileName);k=generateFileName([...D,...B])}const F=v({fileName:k,parentFolder:u,source:n,hasChanges:!0});let x=!1;if(u!=null&&(n=="board"?(await serialBridge.getPrompt(),x=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,F.parentFolder,F.fileName))):n=="disk"&&(x=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,F.parentFolder,F.fileName)))),e.openFiles.find(D=>D.parentFolder===F.parentFolder&&D.fileName===F.fileName&&D.source===F.source)||x){const D=await confirmDialog(t("dialog.fileExists.msg",{name:F.fileName,source:n}),t("dialog.ok"),void 0,t("dialog.fileExists.title"));return!1}return F.editor.onChange=function(){F.hasChanges=!0,i.emit("render")},e.openFiles.push(F),e.editingFile=F.id,!0}}const SIDEBAR_WIDTH_MIN=180,SIDEBAR_WIDTH_MAX=600,SIDEBAR_WIDTH_DEFAULT=400;function clampSidebarWidth(e){const i=Number(e);return Number.isFinite(i)?Math.max(SIDEBAR_WIDTH_MIN,Math.min(SIDEBAR_WIDTH_MAX,Math.round(i))):SIDEBAR_WIDTH_DEFAULT}function getSidebarWidthFromStorage(){const e=localStorage.getItem("sidebarWidth");return e==null?SIDEBAR_WIDTH_DEFAULT:clampSidebarWidth(e)}function saveSidebarWidthToStorage(e){try{return localStorage.setItem("sidebarWidth",String(e)),!0}catch(i){return log("saveSidebarWidthToStorage",i),!1}}function getDiskNavigationRootFromStorage(){let e=localStorage.getItem("diskNavigationRoot");return(!e||e=="null")&&(e=null),e}function saveDiskNavigationRootToStorage(e){try{return localStorage.setItem("diskNavigationRoot",e),!0}catch(i){return log("saveDiskNavigationRootToStorage",i),!1}}async function selectDiskFolder(){let{folder:e,files:i}=await disk.openFolder();return e!==null&&e!="null"?e:null}async function getDiskFiles(e){let i=await disk.ilistFiles(e);return i=i.map(a=>({fileName:a.path,type:a.type})),i=i.sort(sortFilesAlphabetically),i}function sortFilesAlphabetically(e,i){return e.fileName.localeCompare(i.fileName)}function generateHash(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function getBoardNavigationPath(){let e=await serialBridge.execFile(await getHelperFullPath());e=await serialBridge.run("iget_root()");let i="";try{e=e.substring(e.indexOf("OK")+2,e.indexOf("")),i=e}catch(a){log("error",e)}return i}async function getBoardFiles(e){await serialBridge.getPrompt();let i=await serialBridge.ilistFiles(e);return i=i.map(a=>({fileName:a[0],type:a[1]===16384?"folder":"file"})),i=i.sort(sortFilesAlphabetically),i}function checkDiskFile({root:e,parentFolder:i,fileName:a}){return e==null||i==null||a==null?!1:disk.fileExists(disk.getFullPath(e,i,a))}async function checkBoardFile({root:e,parentFolder:i,fileName:a}){return e==null||i==null||a==null?!1:(await serialBridge.getPrompt(),serialBridge.fileExists(serialBridge.getFullPath(e,i,a)))}async function checkOverwrite({fileNames:e=[],parentPath:i,source:a}){let r=[];return a==="board"?r=await getBoardFiles(i):r=await getDiskFiles(i),r.filter(l=>e.indexOf(l.fileName)!==-1)}function generateFileName(e=[]){const i=new Set(e);if(!i.has("untitled.py"))return"untitled.py";for(let a=2;a<1e4;a++){const r=`untitled_${a}.py`;if(!i.has(r))return r}return`untitled_${Date.now()}.py`}function canSave({view:e,isConnected:i,openFiles:a,editingFile:r}){const l=e==="editor",f=a.find(g=>g.id===r);return!f.hasChanges||!l?!1:f.source==="disk"?!0:i}function canExecute({view:e,isConnected:i}){return e==="editor"&&i}function canDownload({isConnected:e,selectedFiles:i}){const a=i.filter(r=>r.source==="disk");return e&&i.length>0&&a.length===0}function canUpload({isConnected:e,selectedFiles:i}){const a=i.filter(r=>r.source==="board");return e&&i.length>0&&a.length===0}function canEdit({selectedFiles:e}){return e.filter(a=>a.type=="file").length!=0}async function removeBoardFolder(e){let i=await serialBridge.execFile(await getHelperFullPath());await serialBridge.run(`delete_folder('${e}')`)}async function uploadFolder(e,i,a){a=a||function(){},await serialBridge.createFolder(i);let r=await disk.ilistAllFiles(e);for(let l in r){const f=r[l],g=f.path.substring(e.length);f.type==="folder"?await serialBridge.createFolder(serialBridge.getFullPath(i,g,"")):await serialBridge.uploadFile(disk.getFullPath(e,g,""),serialBridge.getFullPath(i,g,""),s=>{a(s,g)})}}async function downloadFolder(e,i,a){a=a||function(){},await disk.createFolder(i);let r=await serialBridge.execFile(await getHelperFullPath());r=await serialBridge.run(`ilist_all('${e}')`);let l=[];try{r=r.substring(r.indexOf("OK")+2,r.indexOf("")),l=JSON.parse(r)}catch(f){log("error",r)}for(let f in l){const g=l[f],s=g.path.substring(e.length);g.type=="folder"?await disk.createFolder(disk.getFullPath(i,s,"")):await serialBridge.downloadFile(serialBridge.getFullPath(e,s,""),serialBridge.getFullPath(i,s,""))}}async function getHelperFullPath(){const e=await disk.getAppPath();return await win.isPackaged()?disk.getFullPath(e,"..","ui/helpers.py"):disk.getFullPath(e,"ui/helpers.py","")}const PANEL_CLOSED=32,PANEL_TOO_SMALL=52,PANEL_DEFAULT=320;function App(e,i){return window.UnsupportedBrowser&&!window.UnsupportedBrowser.isSupported()?window.UnsupportedBrowser.render():html`
    <div id="app">
      <div class="app-shell">
        ${Toolbar(e,i)}
        <div class="app-main">
          ${ActivityBar(e,i)}
          ${Sidebar(e,i)}
          ${SidebarResizer(e,i)}
          <div class="app-content">
            ${EditorView(e,i)}
          </div>
        </div>
        <footer class="app-footer"></footer>
      </div>
      ${NewFileDialog(e,i)}
      ${InstallPackageDialog(e,i)}
      ${Overlay(e,i)}
    </div>
  `}function isAdminHash(){const e=window.location.hash||"";return e.startsWith("#admin/editor")||e.startsWith("#/admin/editor")}window.addEventListener("load",()=>{if(isAdminHash())return;let e=Choo();e.use(store),e.route("*",App),e.mount("#app"),e.emitter.on("DOMContentLoaded",()=>{e.state.diskNavigationRoot&&e.emitter.emit("refresh-files")})}),window.addEventListener("hashchange",e=>{const i=(new URL(e.oldURL).hash||"").replace(/^#\/?/,"").startsWith("admin/editor"),a=isAdminHash();i!==a&&window.location.reload()}),window.addEventListener("contextmenu",e=>{e.preventDefault()}),window.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{const e=document.getElementById("splash");e&&(e.classList.add("splash-hidden"),setTimeout(()=>e.remove(),400))},2e3)});
