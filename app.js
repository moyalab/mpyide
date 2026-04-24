function Button(e){const{first:i=!1,size:a="",square:c=!1,icon:f="connect.svg",onClick:h=b=>{},disabled:F=!1,active:r=!1,tooltip:d,label:u,background:m}=e;let k=html``;d&&(k=html`<div class="tooltip">${d}</div>`),k=html``;let v=r?"active":"",y=r?"selected":"",n=m?"inverted":"",o=i?"first":"",s=c?"square":"",l=F?"inactive":"active",g=a==="small"?"":html`<div class="label ${l} ${y}">${u}</div>`;return html`
     <div class="button ${o}">
       <button disabled=${F} class="${s}${a} ${v} ${n}" onclick=${h}>
         <img class="icon" src="media/${f}" />
       </button>
       ${g}
       ${k}
     </div>
   `}(function(){let e=null,i=null;function a(){return e||(e=document.createElement("div"),e.className="editor-context-menu",e.setAttribute("role","menu"),e.style.display="none",document.body.appendChild(e),e)}function c(){e&&(e.style.display="none",e.innerHTML="",i=null,document.removeEventListener("mousedown",f,!0),document.removeEventListener("keydown",h,!0),window.removeEventListener("blur",c),window.removeEventListener("resize",c),window.removeEventListener("scroll",c,!0))}function f(o){e&&e.contains(o.target)||c()}function h(o){o.key==="Escape"&&(o.preventDefault(),c())}function F(o){return o.state.selection.main}function r(o){const s=F(o);return s.from!==s.to}async function d(o){const{from:s,to:l}=F(o);if(s===l)return;const g=o.state.sliceDoc(s,l);try{await navigator.clipboard.writeText(g)}catch(b){return}o.dispatch({changes:{from:s,to:l,insert:""},selection:{anchor:s}}),o.focus()}async function u(o){const{from:s,to:l}=F(o);if(s===l)return;const g=o.state.sliceDoc(s,l);try{await navigator.clipboard.writeText(g)}catch(b){}o.focus()}async function m(o){let s;try{s=await navigator.clipboard.readText()}catch(b){return}if(s==null||s==="")return;const{from:l,to:g}=F(o);o.dispatch({changes:{from:l,to:g,insert:s},selection:{anchor:l+s.length}}),o.focus()}function k(o){o.dispatch({selection:{anchor:0,head:o.state.doc.length}}),o.focus()}function v(o,s,l){const g=document.createElement("div");return g.className="editor-context-menu__item"+(s?"":" is-disabled"),g.setAttribute("role","menuitem"),g.textContent=o,s&&g.addEventListener("click",()=>{c(),l()}),g}function y(o,s){const l=e;l.style.display="block",l.style.left="0px",l.style.top="0px";const g=l.offsetWidth,b=l.offsetHeight,$=window.innerWidth,_=window.innerHeight,R=4;let B=o,C=s;B+g+R>$&&(B=Math.max(R,$-g-R)),C+b+R>_&&(C=Math.max(R,_-b-R)),l.style.left=B+"px",l.style.top=C+"px"}function n(o,s){if(!s)return;i=s;const l=a();l.innerHTML="";const g=window.t||(_=>_),b=r(s);l.appendChild(v(g("editor.menu.cut"),b,()=>d(s))),l.appendChild(v(g("editor.menu.copy"),b,()=>u(s))),l.appendChild(v(g("editor.menu.paste"),!0,()=>m(s)));const $=document.createElement("div");$.className="editor-context-menu__sep",l.appendChild($),l.appendChild(v(g("editor.menu.selectAll"),!0,()=>k(s))),y(o.clientX,o.clientY),document.addEventListener("mousedown",f,!0),document.addEventListener("keydown",h,!0),window.addEventListener("blur",c),window.addEventListener("resize",c),window.addEventListener("scroll",c,!0)}window.EditorContextMenu={show:n,hide:c}})();const EDITOR_FONT_MIN=8,EDITOR_FONT_MAX=48,EDITOR_FONT_DEFAULT=16,EDITOR_FONT_STEP=1;function getEditorFontSize(){const e=document.documentElement.style.getPropertyValue("--editor-font-size").trim(),i=parseFloat(e);return Number.isFinite(i)?i:EDITOR_FONT_DEFAULT}function setEditorFontSize(e){const i=Math.max(EDITOR_FONT_MIN,Math.min(EDITOR_FONT_MAX,e));document.documentElement.style.setProperty("--editor-font-size",i+"px")}class CodeMirrorEditor extends Component{constructor(){super(),this.editor=null,this.content="# empty file",this.scrollTop=0,this.onWheelZoom=this.onWheelZoom.bind(this),this.onContextMenu=this.onContextMenu.bind(this)}createElement(i){return i&&(this.content=i),html`<div id="code-editor"></div>`}load(i){const a=c=>{this.content=c.state.doc.toString(),this.onChange()};this.editor=createEditor(this.content,i,a),i.addEventListener("wheel",this.onWheelZoom,{passive:!1}),i.addEventListener("contextmenu",this.onContextMenu),this._wheelEl=i,setTimeout(()=>{this.editor.scrollDOM.addEventListener("scroll",this.updateScrollPosition.bind(this)),this.editor.scrollDOM.scrollTo({top:this.scrollTop,left:0})},10)}update(){return!1}unload(){this.editor.scrollDOM.removeEventListener("scroll",this.updateScrollPosition),this._wheelEl&&(this._wheelEl.removeEventListener("wheel",this.onWheelZoom,{passive:!1}),this._wheelEl.removeEventListener("contextmenu",this.onContextMenu),this._wheelEl=null),window.EditorContextMenu&&window.EditorContextMenu.hide()}onContextMenu(i){!window.EditorContextMenu||!this.editor||(i.preventDefault(),i.stopPropagation(),window.EditorContextMenu.show(i,this.editor))}onWheelZoom(i){if(!i.ctrlKey)return;i.preventDefault(),i.stopPropagation();const a=getEditorFontSize(),c=i.deltaY<0?EDITOR_FONT_STEP:-EDITOR_FONT_STEP;setEditorFontSize(a+c),this.editor&&typeof this.editor.requestMeasure=="function"&&(this.editor.viewState&&(this.editor.viewState.mustMeasureContent="refresh"),this.editor.requestMeasure())}updateScrollPosition(i){this.scrollTop=i.target.scrollTop}onChange(){return!1}}function Tab(e){const{text:i="undefined",icon:a="ms-computer.svg",onSelectTab:c=()=>!1,onCloseTab:f=()=>!1,onStartRenaming:h=()=>!1,onFinishRenaming:F=()=>!1,disabled:r=!1,active:d=!1,renaming:u=!1,hasChanges:m=!1}=e;if(d)if(u){let n=function(s){F(s.target.value)},o=function(s){s.key.toLowerCase()==="enter"&&s.target.blur(),s.key.toLowerCase()==="escape"&&(s.target.value=null,s.target.blur())};var v=n,y=o;return html`
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
          <div class="text" ondblclick=${h}>
            ${m?" *":""} ${i}
          </div>
          <div class="options" >
            <button onclick=${f}>
              <img class="icon" src="media/close.svg" />
            </button>
          </div>
        </div>
      `;function k(n){n.target.classList.contains("close-tab")||c(n)}return html`
    <div
      class="tab"
      tabindex="1"
      onclick=${k}
      >
      <img class="icon" src="media/${a}" />
      <div class="text">
        ${m?"*":""} ${i}
      </div>
      <div class="options close-tab">
        <button class="close-tab" onclick=${f}>
          <img class="close-tab icon" src="media/close.svg" />
        </button>
      </div>
    </div>
  `}class XTerm extends Component{constructor(i,a,c){super(i),this.term=new Terminal({fontSize:16,fontFamily:'"CodeFont", monospace',fontWeight:"normal",lineHeight:1.2,theme:{background:"#0d1b2a",foreground:"#e0eaea",cursor:"#ffffff",cursorAccent:"#0d1b2a",selectionBackground:"rgba(0, 212, 170, 0.25)",black:"#1e2d3d",red:"#ff6b6b",green:"#4ecdc4",yellow:"#ffd166",blue:"#5b9bd5",magenta:"#c792ea",cyan:"#00d4aa",white:"#e0eaea",brightBlack:"#4a6070",brightRed:"#ff8e8e",brightGreen:"#7be4dc",brightYellow:"#ffe599",brightBlue:"#80b8e8",brightMagenta:"#d6b0f5",brightCyan:"#33dfbb",brightWhite:"#f5fafa"}}),this.resizeTerm=this.resizeTerm.bind(this)}load(i){this.term.open(i),this.resizeTerm(),window.addEventListener("resize",this.resizeTerm)}createElement(){return html`<div class="terminal-wrapper"></div>`}update(){return this.resizeTerm(),!1}resizeTerm(){if(document.querySelector("#panel")){const i=window.getComputedStyle(document.querySelector("#panel")),a=parseInt(i.getPropertyValue("width")),c=parseInt(i.getPropertyValue("height")),f=Math.floor(a/this.term._core._renderService.dimensions.actualCellWidth)-6,h=Math.floor((c-PANEL_CLOSED)/this.term._core._renderService.dimensions.actualCellHeight)-2;this.term.resize(f,h)}}}const I18N_STORAGE_KEY="language",I18N_SUPPORTED=["en","ko"],I18N_DICT={en:{"toolbar.connect":"Connect","toolbar.disconnect":"Disconnect","toolbar.reset":"Reset","toolbar.run":"Run","toolbar.stop":"Stop","toolbar.new":"New","toolbar.save":"Save","toolbar.addPackage":"Add Package","toolbar.fullScreen":"Full Screen","toolbar.exitFullScreen":"Exit Full","toolbar.settings":"Settings","toolbar.uploadFirmware":"Upload Firmware","toolbar.tooltip.connect":"Connect ({shortcut})","toolbar.tooltip.disconnect":"Disconnect ({shortcut})","toolbar.tooltip.reset":"Reset ({shortcut})","toolbar.tooltip.run":"Run ({shortcut})","toolbar.tooltip.stop":"Stop ({shortcut})","toolbar.tooltip.new":"New ({shortcut})","toolbar.tooltip.save":"Save ({shortcut})","toolbar.tooltip.addPackageEnabled":"Install a MicroPython package onto the board","toolbar.tooltip.addPackageDisabled":"Connect to a board first","toolbar.tooltip.enterFullScreen":"Enter full screen","toolbar.tooltip.exitFullScreen":"Exit full screen","toolbar.tooltip.settings":"Toggle settings sidebar","toolbar.tooltip.uploadFirmware":"Upload MicroPython firmware","firmware.title":"Upload MicroPython Firmware","firmware.close":"Close","firmware.serial.title":"Serial Connection","firmware.serial.baudRate":"Baud Rate","firmware.serial.baudDefault":"921,600 (default)","firmware.serial.connect":"Connect Port","firmware.serial.disconnect":"Disconnect","firmware.serial.help":"If it doesn\u2019t connect, hold BOOT and press RESET to enter bootloader mode.","firmware.select.title":"Select Firmware","firmware.tab.micropython":"MicroPython","firmware.tag.stable":"STABLE","firmware.tag.legacy":"LEGACY","firmware.upload.button":"Upload Firmware","firmware.upload.uploading":"Uploading...","firmware.upload.done":"Done","firmware.upload.success":"Upload finished. The board will reboot automatically.","firmware.upload.error":"Upload failed. Hold BOOT + press RESET to re-enter bootloader and try again.","firmware.upload.progressLabel":"Upload progress","firmware.log.title":"Log Console","firmware.log.clear":"Clear","firmware.log.empty":"Logs will appear here once you connect to a serial port.","firmware.version.mpy_v1_28_0.label":"MicroPython v1.28.0","firmware.version.mpy_v1_28_0.description":"Official MicroPython firmware (ESP32_GENERIC_S3 build, single image)","firmware.version.mpy_v1_28_0.changelog.0":"Python 3 REPL via serial","firmware.version.mpy_v1_28_0.changelog.1":"Official ESP32_GENERIC_S3 build (4MB flash)","firmware.version.mpy_v1_28_0.changelog.2":"Single .bin flashed at 0x0","firmware.log.notSupported":"Web Serial API is not supported in this browser.","firmware.log.selectingPort":"Selecting serial port...","firmware.log.portCancelled":"Port selection cancelled.","firmware.log.initializingEsptool":"Initializing esptool-js...","firmware.log.connected":"\u2713 {chip} connected (baud: {baud})","firmware.log.connectFailed":"Connect failed: {err}","firmware.log.bootResetHint":"Hold BOOT and press RESET, then try again.","firmware.log.disconnected":"Disconnected","firmware.log.disconnectFailed":"Disconnect failed: {err}","firmware.log.connectFirst":"Connect to a port first.","firmware.log.flashStart":"Starting ESP32-S3 firmware flash (esptool-js)","firmware.log.flashMode":"  Flash Mode: {value}","firmware.log.flashFreq":"  Flash Freq: {value}","firmware.log.flashSize":"  Flash Size: {value}","firmware.log.fileCount":"  Files: {n}","firmware.log.flashDone":"\u2713 Firmware flash complete!","firmware.log.boardReset":"Resetting board...","firmware.log.resetDone":"\u2713 Reset done \u2014 board boots in normal mode","firmware.log.flashFailed":"\u2717 Flash failed: {err}","firmware.log.bootResetRetryHint":"Hold BOOT + RESET to re-enter bootloader and try again.","firmware.log.selectFw":"Please select a firmware.","firmware.log.fwNotFound":"Selected firmware version not found.","firmware.log.loadingFw":"Loading firmware {version}...","firmware.log.downloading":"  Downloading: {path}","firmware.log.loadFailed":"File load failed: {path} ({status})","firmware.log.loadedEntry":"  \u2713 {label}: {bytes} bytes","firmware.log.allLoaded":"All files loaded ({n} total)","firmware.log.loadError":"Firmware load error: {err}","sidebar.connectToBoard":"Connect to board","sidebar.selectFolder":"Select a folder...","sidebar.refresh":"Refresh file list","sidebar.deleteBoard":"Delete selected files on board","sidebar.deleteDisk":"Delete selected files on disk","sidebar.toggle":"Toggle sidebar","sidebar.hideFiles":"Hide files","sidebar.showFiles":"Show files","repl.connectedTo":"Connected to {name}","repl.showTerminal":"Show terminal","repl.copy":"Copy","repl.paste":"Paste","repl.clean":"Clean ({shortcut})","dialog.install.title":"Install a MicroPython package","dialog.install.search":"Search packages\u2026","dialog.install.loading":"Loading package list\u2026","dialog.install.noResults":"No packages match your search.","dialog.install.unnamed":"(unnamed)","dialog.install.working":"Working\u2026","dialog.install.installThis":"Install this package","dialog.install.openDocs":"Open documentation","dialog.install.noDocs":"No documentation URL available","dialog.install.overwrite":"Overwrite existing","dialog.install.installAsMpy":"Install as .mpy when available","dialog.install.fromUrl":"Install from URL","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"Install","dialog.install.close":"Close","dialog.install.closeDisabled":"Cannot close while installing","dialog.install.mpyNotSupported":"Board does not report an .mpy format \u2014 only .py will be installed","dialog.install.mpyFormatArch":"Board: {arch}, format {format}","dialog.install.mpyFormatOnly":"Format {format}","dialog.install.resolving":"Resolving\u2026","dialog.install.installed":"Installed.","dialog.newFile.title":"Create new file","dialog.newFile.close":"Close","dialog.newFile.board":"Board","dialog.newFile.computer":"Computer","dialog.ok":"OK","dialog.cancel":"Cancel","dialog.yes":"Yes","dialog.unsaved.title":"Unsaved Changes","dialog.unsaved.msg":"Your file has unsaved changes. Are you sure you want to proceed?","dialog.unsaved.msgMayHave":"You may have unsaved changes. Are you sure you want to proceed?","dialog.connectFailed.title":"Connection Failed","dialog.connectFailed.msg":"Could not connect to the board. Reset it and try again.","dialog.fileExists.title":"File Already Exists","dialog.fileExists.msg":"File {name} already exists on {source}. Please choose another name.","dialog.overwrite.title":"Confirm Overwrite","dialog.overwrite.msgFile":`You are about to overwrite the file {name} on your {source}.

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
`,"overlay.loading":"Loading files...","overlay.removing":"Removing...","overlay.connecting":"Connecting...","overlay.saving":"Saving file... {progress}","overlay.transferring":"Transferring file","toast.boardDisconnected":"Board disconnected.","toast.packageRegistryFailed":"Could not load package registry: {err}","settings.title":"Settings","settings.close":"Close settings","settings.language":"Language","settings.apply":"Apply","editor.menu.cut":"Cut","editor.menu.copy":"Copy","editor.menu.paste":"Paste","editor.menu.selectAll":"Select All"},ko:{"toolbar.connect":"\uC5F0\uACB0","toolbar.disconnect":"\uC5F0\uACB0 \uD574\uC81C","toolbar.reset":"\uC7AC\uC2DC\uC791","toolbar.run":"\uC2E4\uD589","toolbar.stop":"\uC911\uC9C0","toolbar.new":"\uC0C8 \uD30C\uC77C","toolbar.save":"\uC800\uC7A5","toolbar.addPackage":"\uD328\uD0A4\uC9C0 \uCD94\uAC00","toolbar.fullScreen":"\uC804\uCCB4 \uD654\uBA74","toolbar.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.settings":"\uC124\uC815","toolbar.uploadFirmware":"\uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","toolbar.tooltip.connect":"\uC5F0\uACB0 ({shortcut})","toolbar.tooltip.disconnect":"\uC5F0\uACB0 \uD574\uC81C ({shortcut})","toolbar.tooltip.reset":"\uC7AC\uC2DC\uC791 ({shortcut})","toolbar.tooltip.run":"\uC2E4\uD589 ({shortcut})","toolbar.tooltip.stop":"\uC911\uC9C0 ({shortcut})","toolbar.tooltip.new":"\uC0C8 \uD30C\uC77C ({shortcut})","toolbar.tooltip.save":"\uC800\uC7A5 ({shortcut})","toolbar.tooltip.addPackageEnabled":"\uBCF4\uB4DC\uC5D0 MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","toolbar.tooltip.addPackageDisabled":"\uBA3C\uC800 \uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD558\uC138\uC694","toolbar.tooltip.enterFullScreen":"\uC804\uCCB4 \uD654\uBA74\uC73C\uB85C \uC804\uD658","toolbar.tooltip.exitFullScreen":"\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC","toolbar.tooltip.settings":"\uC124\uC815 \uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","toolbar.tooltip.uploadFirmware":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C \uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.title":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C \uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.close":"\uB2EB\uAE30","firmware.serial.title":"\uC2DC\uB9AC\uC5BC \uC5F0\uACB0","firmware.serial.baudRate":"Baud Rate","firmware.serial.baudDefault":"921,600 (\uAE30\uBCF8\uAC12)","firmware.serial.connect":"\uD3EC\uD2B8 \uC5F0\uACB0","firmware.serial.disconnect":"\uC5F0\uACB0 \uD574\uC81C","firmware.serial.help":"\uC5F0\uACB0\uC774 \uC548 \uB418\uBA74 BOOT \uBC84\uD2BC\uC744 \uB204\uB978 \uCC44 RESET\uC744 \uB20C\uB7EC \uBD80\uD2B8\uB85C\uB354 \uBAA8\uB4DC\uB85C \uC9C4\uC785\uD558\uC138\uC694.","firmware.select.title":"\uD38C\uC6E8\uC5B4 \uC120\uD0DD","firmware.tab.micropython":"MicroPython","firmware.tag.stable":"STABLE","firmware.tag.legacy":"LEGACY","firmware.upload.button":"\uD38C\uC6E8\uC5B4 \uC5C5\uB85C\uB4DC","firmware.upload.uploading":"\uC5C5\uB85C\uB4DC \uC911...","firmware.upload.done":"\uC5C5\uB85C\uB4DC \uC644\uB8CC","firmware.upload.success":"\uC5C5\uB85C\uB4DC\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBCF4\uB4DC\uAC00 \uC790\uB3D9\uC73C\uB85C \uC7AC\uC2DC\uC791\uB429\uB2C8\uB2E4.","firmware.upload.error":"\uC5C5\uB85C\uB4DC \uC2E4\uD328. BOOT+RESET\uC73C\uB85C \uBD80\uD2B8\uB85C\uB354 \uC9C4\uC785 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.upload.progressLabel":"\uC5C5\uB85C\uB4DC \uC9C4\uD589","firmware.log.title":"\uB85C\uADF8 \uCF58\uC194","firmware.log.clear":"\uCD08\uAE30\uD654","firmware.log.empty":"\uC2DC\uB9AC\uC5BC \uD3EC\uD2B8\uC5D0 \uC5F0\uACB0\uD558\uBA74 \uB85C\uADF8\uAC00 \uC5EC\uAE30\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.","firmware.version.mpy_v1_28_0.label":"\uB9C8\uC774\uD06C\uB85C\uD30C\uC774\uC36C v1.28.0","firmware.version.mpy_v1_28_0.description":"MicroPython \uACF5\uC2DD \uD38C\uC6E8\uC5B4 (ESP32_GENERIC_S3 \uBE4C\uB4DC, \uB2E8\uC77C \uC774\uBBF8\uC9C0)","firmware.version.mpy_v1_28_0.changelog.0":"Python 3 \uD638\uD658 REPL \xB7 REPL \uC2DC\uB9AC\uC5BC \uC811\uC18D\uC73C\uB85C \uBC14\uB85C \uCF54\uB529","firmware.version.mpy_v1_28_0.changelog.1":"\uACF5\uC2DD ESP32_GENERIC_S3 \uBE4C\uB4DC (4MB \uD50C\uB798\uC2DC)","firmware.version.mpy_v1_28_0.changelog.2":"\uB2E8\uC77C .bin \uC774\uBBF8\uC9C0\uB97C 0x0 \uC624\uD504\uC14B\uC5D0 \uC77C\uAD04 \uD50C\uB798\uC2DC","firmware.log.notSupported":"\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 Web Serial API\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.","firmware.log.selectingPort":"\uC2DC\uB9AC\uC5BC \uD3EC\uD2B8 \uC120\uD0DD \uC911...","firmware.log.portCancelled":"\uD3EC\uD2B8 \uC120\uD0DD\uC774 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.","firmware.log.initializingEsptool":"esptool-js \uCD08\uAE30\uD654 \uC911...","firmware.log.connected":"\u2713 {chip} \uC5F0\uACB0 \uC644\uB8CC (baud: {baud})","firmware.log.connectFailed":"\uC5F0\uACB0 \uC2E4\uD328: {err}","firmware.log.bootResetHint":"BOOT \uBC84\uD2BC\uC744 \uB204\uB978 \uCC44 RESET \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.log.disconnected":"\uC5F0\uACB0 \uD574\uC81C","firmware.log.disconnectFailed":"\uC5F0\uACB0 \uD574\uC81C \uC2E4\uD328: {err}","firmware.log.connectFirst":"\uBA3C\uC800 \uD3EC\uD2B8\uC5D0 \uC5F0\uACB0\uD574\uC8FC\uC138\uC694.","firmware.log.flashStart":"ESP32-S3 \uD38C\uC6E8\uC5B4 \uD50C\uB798\uC2F1 \uC2DC\uC791 (esptool-js)","firmware.log.flashMode":"  Flash Mode: {value}","firmware.log.flashFreq":"  Flash Freq: {value}","firmware.log.flashSize":"  Flash Size: {value}","firmware.log.fileCount":"  \uD30C\uC77C \uC218: {n}","firmware.log.flashDone":"\u2713 \uD38C\uC6E8\uC5B4 \uD50C\uB798\uC2F1 \uC644\uB8CC!","firmware.log.boardReset":"\uBCF4\uB4DC \uB9AC\uC14B \uC911...","firmware.log.resetDone":"\u2713 \uB9AC\uC14B \uC644\uB8CC \u2014 \uBCF4\uB4DC\uAC00 \uC815\uC0C1 \uBAA8\uB4DC\uB85C \uBD80\uD305\uB429\uB2C8\uB2E4","firmware.log.flashFailed":"\u2717 \uD50C\uB798\uC2F1 \uC2E4\uD328: {err}","firmware.log.bootResetRetryHint":"BOOT + RESET\uC73C\uB85C \uBD80\uD2B8\uB85C\uB354 \uC7AC\uC9C4\uC785 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","firmware.log.selectFw":"\uD38C\uC6E8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.","firmware.log.fwNotFound":"\uC120\uD0DD\uD55C \uD38C\uC6E8\uC5B4 \uBC84\uC804\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.","firmware.log.loadingFw":"\uD38C\uC6E8\uC5B4 {version} \uD30C\uC77C \uB85C\uB4DC \uC911...","firmware.log.downloading":"  \uB2E4\uC6B4\uB85C\uB4DC: {path}","firmware.log.loadFailed":"\uD30C\uC77C \uB85C\uB4DC \uC2E4\uD328: {path} ({status})","firmware.log.loadedEntry":"  \u2713 {label}: {bytes} bytes","firmware.log.allLoaded":"\uBAA8\uB4E0 \uD30C\uC77C \uB85C\uB4DC \uC644\uB8CC (\uCD1D {n}\uAC1C)","firmware.log.loadError":"\uD38C\uC6E8\uC5B4 \uB85C\uB4DC \uC624\uB958: {err}","sidebar.connectToBoard":"\uBCF4\uB4DC \uC5F0\uACB0","sidebar.selectFolder":"\uD3F4\uB354\uB97C \uC120\uD0DD\uD558\uC138\uC694...","sidebar.refresh":"\uD30C\uC77C \uBAA9\uB85D \uC0C8\uB85C \uACE0\uCE68","sidebar.deleteBoard":"\uBCF4\uB4DC\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.deleteDisk":"\uB514\uC2A4\uD06C\uC5D0\uC11C \uC120\uD0DD\uD55C \uD30C\uC77C \uC0AD\uC81C","sidebar.toggle":"\uC0AC\uC774\uB4DC\uBC14 \uD1A0\uAE00","sidebar.hideFiles":"\uD30C\uC77C \uC228\uAE30\uAE30","sidebar.showFiles":"\uD30C\uC77C \uBCF4\uC774\uAE30","repl.connectedTo":"{name}\uC5D0 \uC5F0\uACB0\uB428","repl.showTerminal":"\uD130\uBBF8\uB110 \uD45C\uC2DC","repl.copy":"\uBCF5\uC0AC","repl.paste":"\uBD99\uC5EC\uB123\uAE30","repl.clean":"\uC9C0\uC6B0\uAE30 ({shortcut})","dialog.install.title":"MicroPython \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.search":"\uD328\uD0A4\uC9C0 \uAC80\uC0C9\u2026","dialog.install.loading":"\uD328\uD0A4\uC9C0 \uBAA9\uB85D \uBD88\uB7EC\uC624\uB294 \uC911\u2026","dialog.install.noResults":"\uAC80\uC0C9 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.","dialog.install.unnamed":"(\uC774\uB984 \uC5C6\uC74C)","dialog.install.working":"\uC791\uC5C5 \uC911\u2026","dialog.install.installThis":"\uC774 \uD328\uD0A4\uC9C0 \uC124\uCE58","dialog.install.openDocs":"\uBB38\uC11C \uC5F4\uAE30","dialog.install.noDocs":"\uBB38\uC11C URL\uC774 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.overwrite":"\uAE30\uC874 \uD30C\uC77C \uB36E\uC5B4\uC4F0\uAE30","dialog.install.installAsMpy":"\uAC00\uB2A5\uD558\uBA74 .mpy\uB85C \uC124\uCE58","dialog.install.fromUrl":"URL\uC5D0\uC11C \uC124\uCE58","dialog.install.urlPlaceholder":"github:owner/repo@version","dialog.install.installBtn":"\uC124\uCE58","dialog.install.close":"\uB2EB\uAE30","dialog.install.closeDisabled":"\uC124\uCE58 \uC911\uC5D0\uB294 \uB2EB\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4","dialog.install.mpyNotSupported":"\uBCF4\uB4DC\uAC00 .mpy \uD3EC\uB9F7\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544 .py\uB9CC \uC124\uCE58\uB429\uB2C8\uB2E4","dialog.install.mpyFormatArch":"\uBCF4\uB4DC: {arch}, \uD3EC\uB9F7 {format}","dialog.install.mpyFormatOnly":"\uD3EC\uB9F7 {format}","dialog.install.resolving":"\uBD84\uC11D \uC911\u2026","dialog.install.installed":"\uC124\uCE58\uB428.","dialog.newFile.title":"\uC0C8 \uD30C\uC77C \uB9CC\uB4E4\uAE30","dialog.newFile.close":"\uB2EB\uAE30","dialog.newFile.board":"\uBCF4\uB4DC","dialog.newFile.computer":"\uCEF4\uD4E8\uD130","dialog.ok":"\uD655\uC778","dialog.cancel":"\uCDE8\uC18C","dialog.yes":"\uC608","dialog.unsaved.title":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D","dialog.unsaved.msg":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.unsaved.msgMayHave":"\uC800\uC7A5\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uACC4\uC18D\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?","dialog.connectFailed.title":"\uC5F0\uACB0 \uC2E4\uD328","dialog.connectFailed.msg":"\uBCF4\uB4DC\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC7AC\uC2DC\uC791 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.","dialog.fileExists.title":"\uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4","dialog.fileExists.msg":"{source}\uC5D0 {name} \uD30C\uC77C\uC774 \uC774\uBBF8 \uC874\uC7AC\uD569\uB2C8\uB2E4. \uB2E4\uB978 \uC774\uB984\uC744 \uC0AC\uC6A9\uD558\uC138\uC694.","dialog.overwrite.title":"\uB36E\uC5B4\uC4F0\uAE30 \uD655\uC778","dialog.overwrite.msgFile":`{source}\uC5D0 \uC788\uB294 {name} \uD30C\uC77C\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4.

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
`,"overlay.loading":"\uD30C\uC77C \uBD88\uB7EC\uC624\uB294 \uC911...","overlay.removing":"\uC0AD\uC81C \uC911...","overlay.connecting":"\uC5F0\uACB0 \uC911...","overlay.saving":"\uD30C\uC77C \uC800\uC7A5 \uC911... {progress}","overlay.transferring":"\uD30C\uC77C \uC804\uC1A1 \uC911","toast.boardDisconnected":"\uBCF4\uB4DC\uC640 \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4.","toast.packageRegistryFailed":"\uD328\uD0A4\uC9C0 \uB808\uC9C0\uC2A4\uD2B8\uB9AC \uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328: {err}","settings.title":"\uC124\uC815","settings.close":"\uC124\uC815 \uB2EB\uAE30","settings.language":"\uC5B8\uC5B4","settings.apply":"\uC801\uC6A9","editor.menu.cut":"\uC798\uB77C\uB0B4\uAE30","editor.menu.copy":"\uBCF5\uC0AC","editor.menu.paste":"\uBD99\uC5EC\uB123\uAE30","editor.menu.selectAll":"\uC804\uCCB4 \uC120\uD0DD"}};function i18nDetectDefault(){const e=(navigator.language||"en").split("-")[0].toLowerCase();return I18N_SUPPORTED.includes(e)?e:"en"}function i18nGetStored(){try{return localStorage.getItem(I18N_STORAGE_KEY)}catch(e){return null}}function i18nSetStored(e){try{localStorage.setItem(I18N_STORAGE_KEY,e)}catch(i){}}let __i18nLang=(function(){const e=i18nGetStored();return e&&I18N_SUPPORTED.includes(e)?e:i18nDetectDefault()})();function applyHtmlLang(e){typeof document!="undefined"&&document.documentElement&&(document.documentElement.lang=e)}applyHtmlLang(__i18nLang);function t(e,i){const a=I18N_DICT[__i18nLang]||I18N_DICT.en;let c=a[e]!==void 0?a[e]:I18N_DICT.en[e]!==void 0?I18N_DICT.en[e]:e;if(i)for(const f in i)c=c.split("{"+f+"}").join(String(i[f]));return c}window.t=t,window.i18n={getLanguage:()=>__i18nLang,setLanguage:e=>{I18N_SUPPORTED.includes(e)&&(__i18nLang=e,i18nSetStored(e),applyHtmlLang(e))},getAvailable:()=>I18N_SUPPORTED.slice(),detectDefault:i18nDetectDefault},window.FirmwareConfig={FIRMWARE_VERSIONS:[{id:"micropython-v1.28.0",version:"v1.28.0",board:"micropython",labelKey:"firmware.version.mpy_v1_28_0.label",descriptionKey:"firmware.version.mpy_v1_28_0.description",changelogKeys:["firmware.version.mpy_v1_28_0.changelog.0","firmware.version.mpy_v1_28_0.changelog.1","firmware.version.mpy_v1_28_0.changelog.2"],image:"firmware/micropython.png",date:"2026-04-06",tag:"stable",combinedImage:"ESP32_GENERIC_S3-20260406-v1.28.0.bin"}],BOARD_TABS:[{id:"micropython",labelKey:"firmware.tab.micropython",icon:"firmware/micropython.png"}],getFlashMap(e){return[{path:`firmware/${e.board}/${e.version}/${e.combinedImage}`,address:0,label:"MicroPython (combined)"}]},DEFAULT_SETTINGS:{baudRate:921600},FLASH_MODE:"keep",FLASH_FREQ:"keep",FLASH_SIZE:"keep"};function CodeEditor(e,i){return e.editingFile?e.openFiles.find(c=>c.id==e.editingFile).editor.render():html`
      <div id="code-editor"></div>
    `}function NewFileDialog(e,i){const a=e.isNewFileDialogOpen?"open":"closed";function c(k){k.target.id=="dialog-new-file"&&i("close-new-file-dialog")}function f(k){k.stopPropagation(),i("close-new-file-dialog")}function h(k){return v=>{v&&v.stopPropagation&&v.stopPropagation();const y=document.querySelector("#file-name"),n=y.value.trim()||y.placeholder;i("create-new-tab",k,n)}}new MutationObserver((k,v)=>{const y=document.querySelector("#dialog-new-file input");y&&(y.focus(),v.disconnect())}).observe(document.body,{childList:!0,subtree:!0});const d={type:"text",id:"file-name",value:"",placeholder:generateFileName()},u=e.isConnected?html`<button type="button" onclick=${h("board")}>${t("dialog.newFile.board")}</button>`:"",m=html`
  <div id="dialog-new-file" class="dialog ${a}" onclick=${c}>
    <div class="dialog-content">
      <div class="dialog-header">
        <div class="dialog-title">${t("dialog.newFile.title")}</div>
        <button class="dialog-close" type="button" aria-label=${t("dialog.newFile.close")} onclick=${f}>×</button>
      </div>
      <div class="dialog-body">
        <input ${d} />
      </div>
      <div class="dialog-actions">
        ${u}
        <button type="button" class="dialog-action-default" onclick=${h("disk")}>${t("dialog.newFile.computer")}</button>
      </div>
    </div>
  </div>
`;if(e.isNewFileDialogOpen){const k=m.querySelector("#dialog-new-file .dialog-content input");return k&&k.focus(),m}}function InstallPackageDialog(e,i){const a=e.isInstallPackageDialogOpen?"open":"closed",c=e.packageSearchResults||[],f=e.selectedPackage,h=!!e.isInstallingPackage;function F(l){i("search-packages",l.target.value)}function r(l){return()=>{h||i("select-package-to-install",l)}}function d(l){return g=>{g&&g.stopPropagation&&g.stopPropagation(),!h&&i("install-package",l)}}function u(l){return g=>{g&&g.stopPropagation&&g.stopPropagation();const b=l.docs||l.url;if(!b)return;const $=/^https?:\/\//.test(b)?b:b.startsWith("github:")?"https://github.com/"+b.substring(7).split("@")[0]:b.startsWith("gitlab:")?"https://gitlab.com/"+b.substring(7).split("@")[0]:b;window.open($,"_blank","noopener,noreferrer")}}function m(){h||i("close-install-package-dialog")}function k(l){i("toggle-install-overwrite",l.target.checked)}const v=c.length===0?html`<div class="package-empty">${e.packageList.length===0?t("dialog.install.loading"):t("dialog.install.noResults")}</div>`:c.map(l=>{const g=f&&f.name===l.name&&f.url===l.url,b="package-item"+(g?" selected":""),$=l.url?html`<span class="package-source">${l.url}</span>`:html`<span class="package-source">micropython-lib</span>`,R=!!(l.docs||l.url||""),B=g?html`
              <div class="package-actions">
                <button class="package-action-btn"
                        title=${t("dialog.install.installThis")}
                        disabled=${h}
                        onclick=${d(l)}>
                  <span class="material-symbols-outlined">deployed_code_update</span>
                </button>
                <button class="package-action-btn"
                        title=${t(R?"dialog.install.openDocs":"dialog.install.noDocs")}
                        disabled=${!R}
                        onclick=${u(l)}>
                  <span class="material-symbols-outlined">description</span>
                </button>
              </div>
            `:"";return html`
          <div class="${b}" onclick=${r(l)}>
            <div class="package-info">
              <div class="package-head">
                <span class="material-symbols-outlined package-icon">deployed_code</span>
                <span class="package-name">${l.name||t("dialog.install.unnamed")}</span>
                ${l.version?html`<span class="package-version">v${l.version}</span>`:""}
              </div>
              <div class="package-desc">${l.description||""}</div>
              ${$}
            </div>
            ${B}
          </div>
        `}),y=e.installPackageError?html`<div class="install-error">${e.installPackageError}</div>`:"",n=h?html`<div class="install-progress">${e.installPackageProgress||t("dialog.install.working")}</div>`:"",o=h?html`<button class="dialog-close-floating" disabled title=${t("dialog.install.closeDisabled")}><span class="material-symbols-outlined">close</span></button>`:html`<button class="dialog-close-floating" onclick=${m} title=${t("dialog.install.close")}><span class="material-symbols-outlined">close</span></button>`,s=html`
  <div id="dialog-install-package" class="dialog ${a}">
    <div class="dialog-content install-package-dialog">
      ${o}
      <div class="dialog-title">${t("dialog.install.title")}</div>

      <input type="search"
             id="install-package-search"
             placeholder=${t("dialog.install.search")}
             value=${e.packageSearchQuery||""}
             oninput=${F} />

      <div class="package-list">${v}</div>

      <div class="install-options">
        <label class="install-option">
          <input type="checkbox" checked=${!!e.packageOverwrite} onchange=${k} />
          ${t("dialog.install.overwrite")}
        </label>
      </div>

      ${y}
      ${n}
    </div>
  </div>
  `;if(e.isInstallPackageDialogOpen)return s}function FileActions(e,i){const{isConnected:a,selectedFiles:c}=e;return html`
  <div id="file-actions">
    ${Button({icon:"arrow-up.svg",size:"small",disabled:!canUpload({isConnected:a,selectedFiles:c}),onClick:()=>i("upload-files")})}
    ${Button({icon:"arrow-down.svg",size:"small",disabled:!canDownload({isConnected:a,selectedFiles:c}),onClick:()=>i("download-files")})}
  </div>

  `}const DiskFileList=generateFileList("disk"),BoardFileList=generateFileList("board");function generateFileList(e){return function(a,c){function f(v){v.key.toLowerCase()==="enter"&&v.target.blur(),v.key.toLowerCase()==="escape"&&(v.target.value=null,v.target.blur())}const h=html`
      <div class="item">
        <img class="icon" src="media/file.svg" />
        <div class="text">
          <input type="text" onkeydown=${f} onblur=${v=>c("finish-creating-file",v.target.value)}/>
        </div>
      </div>
    `,F=html`
      <div class="item">
        <img class="icon" src="media/folder.svg" />
        <div class="text">
          <input type="text" onkeydown=${f} onblur=${v=>c("finish-creating-folder",v.target.value)}/>
        </div>
      </div>
    `;function r(v,y){const n=html`
        <input type="text"
          value=${v.fileName}
          onkeydown=${f}
          onblur=${_=>c("finish-renaming-file",_.target.value)}
          onclick=${_=>!1}
          ondblclick=${_=>!1}
          />
      `,o=a.selectedFiles.find(_=>_.fileName===v.fileName&&_.source===e);function s(_){return _.preventDefault(),c("rename-file",e,v),!1}function l(){a.renamingFile||c(`navigate-${e}-folder`,v.fileName)}function g(){a.renamingFile||c("open-file",e,v)}let b=v.fileName;const $=a.selectedFiles.find(_=>_.fileName===b);return a.renamingFile==e&&$&&(b=n),v.type==="folder"?html`
          <div
            class="item ${o?"selected":""}"
            onclick=${_=>c("toggle-file-selection",v,e,_)}
            ondblclick=${l}
            >
            <img class="icon" src="media/folder.svg" />
            <div class="text">${b}</div>
            <div class="options" onclick=${s}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `:html`
          <div
            class="item ${o?"selected":""}"
            onclick=${_=>c("toggle-file-selection",v,e,_)}
            ondblclick=${g}
            >
            <img class="icon" src="media/file.svg"  />
            <div class="text">${b}</div>
            <div class="options" onclick=${s}>
              <img src="media/ms-edit.svg" />
            </div>
          </div>
        `}const d=a[`${e}Files`].sort((v,y)=>{const n=v.fileName.toUpperCase(),o=y.fileName.toUpperCase();if(v.type==="folder"&&y.type==="file")return-1;if(v.type===y.type){if(n<o)return-1;if(n>o)return 1}return 0}),u=html`<div class="item"
  onclick=${()=>c(`navigate-${e}-parent`)}
  style="cursor: pointer"
  >
  ..
</div>`,m=html`
      <div class="file-list">
        <div class="list">
          ${e==="disk"&&a.diskNavigationPath!="/"?u:""}
          ${e==="board"&&a.boardNavigationPath!="/"?u:""}
          ${a.creatingFile==e?h:null}
          ${a.creatingFolder==e?F:null}
          ${d.map(r)}
        </div>
      </div>
    `;return new MutationObserver(v=>{const y=m.querySelector("input");y&&y.focus()}).observe(m,{childList:!0,subtree:!0}),m}}function ReplPanel(e,i){const a=e.panelHeight<=PANEL_CLOSED,c=a?0:e.panelHeight,f=()=>{e.panelHeight>PANEL_CLOSED?i("close-panel"):i("open-panel")},h=a?"closed":"open",F=e.isResizingPanel?"resizing":"",r=e.panelHeight>PANEL_TOO_SMALL?"visible":"hidden";let d="terminal-enabled";return(!e.isConnected||e.isNewFileDialogOpen)&&(d="terminal-disabled"),html`
    <div class="panel-container">
      <div id="panel" class="${h} ${F}" style="height: ${c}px">
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
          <div class="term-operations ${r}">
            ${ReplOperations(e,i)}
          </div>
          ${Button({icon:`arrow-${e.panelHeight>PANEL_CLOSED?"down":"up"}.svg`,size:"small",onClick:f})}
        </div>
        <div class=${d}>
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
      ${e.openFiles.map(f=>Tab({text:f.fileName,icon:f.source==="board"?"ms-videogame-asset.svg":"ms-computer.svg",active:f.id===e.editingFile,renaming:f.id===e.renamingTab,hasChanges:f.hasChanges,onSelectTab:()=>i("select-tab",f.id),onCloseTab:()=>i("close-tab",f.id),onStartRenaming:()=>i("rename-tab",f.id),onFinishRenaming:h=>i("finish-renaming-tab",h)}))}
    </div>
  `;return new MutationObserver(f=>{const h=a.querySelector("input");h&&h.focus()}).observe(a,{childList:!0,subtree:!0}),a}function Toolbar(e,i){const a=window.canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile}),c=window.canExecute({view:e.view,isConnected:e.isConnected}),f=e.platform==="darwin"?"Cmd":"Ctrl",h=e.isSidebarOpen?"":"sidebar-collapsed";return html`
    <div id="navigation-bar" class="${h}">
      <div id="app-logo">
        <img src="media/logo.svg" alt="MicroPython for Bitblock" />
      </div>
      <div id="toolbar">
        ${Button({icon:e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg",label:e.isConnected?t("toolbar.disconnect"):t("toolbar.connect"),tooltip:e.isConnected?t("toolbar.tooltip.disconnect",{shortcut:`${f}+Shift+D`}):t("toolbar.tooltip.connect",{shortcut:`${f}+Shift+C`}),onClick:()=>e.isConnected?i("disconnect"):i("connect"),active:e.isConnected,first:!0})}
        ${Button({icon:"ms-restart.svg",label:t("toolbar.reset"),tooltip:t("toolbar.tooltip.reset",{shortcut:`${f}+Shift+R`}),disabled:!c,onClick:()=>i("reset")})}
        <div class="separator"></div>

        ${Button({icon:"ms-play.svg",label:t("toolbar.run"),tooltip:t("toolbar.tooltip.run",{shortcut:`${f}+R`}),disabled:!c,onClick:F=>{F.altKey?i("run-from-button",!0):i("run-from-button")}})}
        ${Button({icon:"ms-stop.svg",label:t("toolbar.stop"),tooltip:t("toolbar.tooltip.stop",{shortcut:`${f}+H`}),disabled:!c,onClick:()=>i("stop")})}

        <div class="separator"></div>

        ${Button({icon:"ms-note-add.svg",label:t("toolbar.new"),tooltip:t("toolbar.tooltip.new",{shortcut:`${f}+N`}),disabled:e.view!="editor"||e.isFirmwareUploaderOpen,onClick:()=>i("create-new-file")})}

        ${Button({icon:"ms-save.svg",label:t("toolbar.save"),tooltip:t("toolbar.tooltip.save",{shortcut:`${f}+S`}),disabled:!a||e.isFirmwareUploaderOpen,onClick:()=>i("save")})}

        <div class="separator"></div>

        ${Button({icon:"ms-deployed-code.svg",label:t("toolbar.addPackage"),disabled:!e.isConnected,tooltip:e.isConnected?t("toolbar.tooltip.addPackageEnabled"):t("toolbar.tooltip.addPackageDisabled"),onClick:()=>i("open-install-package-dialog")})}

        ${Button({icon:e.isFullscreen?"ms-fullscreen-exit.svg":"ms-fullscreen.svg",label:e.isFullscreen?t("toolbar.exitFullScreen"):t("toolbar.fullScreen"),tooltip:e.isFullscreen?t("toolbar.tooltip.exitFullScreen"):t("toolbar.tooltip.enterFullScreen"),onClick:()=>i("toggle-fullscreen")})}

        <div class="toolbar-version">v 0.0.1</div>

        ${Button({icon:"ms-settings.svg",label:t("toolbar.settings"),tooltip:t("toolbar.tooltip.settings"),active:e.isRightSidebarOpen,disabled:e.isFirmwareUploaderOpen,onClick:()=>i("toggle-right-sidebar")})}

        ${Button({icon:"ms-upload-2.svg",label:t("toolbar.uploadFirmware"),tooltip:t("toolbar.tooltip.uploadFirmware"),active:e.isFirmwareUploaderOpen,onClick:()=>i("toggle-firmware-uploader")})}
      </div>
    </div>
  `}function Sidebar(e,i){const a=!!e.isSidebarOpen,c="app-sidebar"+(a?"":" collapsed"),f=a?"chevron_left":"chevron_right";let h=t("sidebar.connectToBoard");const F=!!e.diskNavigationRoot;let r=F?`${e.diskNavigationRoot}${e.diskNavigationPath}`:t("sidebar.selectFolder");e.isConnected&&(h=`bitblock${e.boardNavigationPath}`);const d=(e.selectedFiles||[]).filter(v=>v.source==="board").length,u=(e.selectedFiles||[]).filter(v=>v.source==="disk").length,m=html`
    <div id="board-files">
      <div class="device-header">
        <img class="icon" src="media/${e.isConnected?"ms-videogame-asset.svg":"ms-videogame-asset-off.svg"}" />
        <div onclick=${()=>i("connect")} class="text">
          <span>${h}</span>
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
        <button disabled=${!e.isConnected||d===0}
                onclick=${()=>i("remove-files","board")}
                title=${t("sidebar.deleteBoard")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${BoardFileList(e,i)}
    </div>
  `,k=html`
    <div id="disk-files">
      <div class="device-header">
        <img class="icon" src="media/ms-computer.svg" />
        <div class="text" onclick=${()=>i("select-disk-navigation-root")}>
          <span>${r}</span>
        </div>
        <button disabled=${!F}
                onclick=${()=>i("refresh-files")}
                title=${t("sidebar.refresh")}>
          <img class="icon" src="media/ms-refresh.svg" />
        </button>
        <button disabled=${!F} onclick=${()=>i("create-folder","disk")}>
          <img class="icon" src="media/new-folder.svg" />
        </button>
        <button disabled=${!F} onclick=${()=>i("create-file","disk")}>
          <img class="icon" src="media/new-file.svg" />
        </button>
        <button disabled=${!F||u===0}
                onclick=${()=>i("remove-files","disk")}
                title=${t("sidebar.deleteDisk")}>
          <img class="icon" src="media/delete.svg" />
        </button>
      </div>
      ${DiskFileList(e,i)}
    </div>
  `;return html`
    <aside class="${c}">
      <div id="file-manager" class="sidebar-files">
        ${m}
        ${FileActions(e,i)}
        ${k}
      </div>
      <button class="sidebar-toggle"
              onclick=${()=>i("toggle-sidebar")}
              aria-label=${t("sidebar.toggle")}
              title=${t(a?"sidebar.hideFiles":"sidebar.showFiles")}>
        <span class="material-symbols-outlined">${f}</span>
      </button>
    </aside>
  `}function RightSidebar(e,i){const c="app-right-sidebar"+(!!e.isRightSidebarOpen?"":" collapsed"),f=e.language;return html`
    <aside class="${c}">
      <div class="right-sidebar-header">
        <div class="right-sidebar-title">${t("settings.title")}</div>
        <button class="right-sidebar-close"
                onclick=${()=>i("toggle-right-sidebar")}
                aria-label=${t("settings.close")}>×</button>
      </div>
      <div class="right-sidebar-body">
        <section class="settings-card">
          <div class="settings-card-title">${t("settings.language")}</div>
          <div class="settings-card-body">
            <select id="language-select" class="settings-select">
              <option value="en" selected=${f==="en"}>English</option>
              <option value="ko" selected=${f==="ko"}>한국어</option>
            </select>
            <button class="settings-apply" onclick=${()=>{const h=document.getElementById("language-select");h&&i("set-language",h.value)}}>${t("settings.apply")}</button>
          </div>
        </section>
      </div>
    </aside>
  `}function FirmwareUploader(e,i){if(!e.isFirmwareUploaderOpen)return html`<div class="firmware-uploader closed"></div>`;const a=e.fw,f=window.FirmwareConfig.FIRMWARE_VERSIONS.filter(r=>r.board===a.activeTab),h=a.isConnected&&!a.isUploading&&!!a.selectedVersion;window.__fwScrollPending||(window.__fwScrollPending=!0,requestAnimationFrame(()=>{window.__fwScrollPending=!1;const r=document.querySelector(".firmware-uploader .log-container");r&&(r.scrollTop=r.scrollHeight)}));function F(){a.uploadStatus==="success"?i("disconnect"):i("fw-upload")}return html`
    <div class="firmware-uploader open">
      <div class="firmware-uploader-titlebar">
        <div class="firmware-uploader-title">${t("firmware.title")}</div>
        <button class="firmware-uploader-close"
                type="button"
                aria-label=${t("firmware.close")}
                onclick=${()=>i("close-firmware-uploader")}>×</button>
      </div>
      <div class="firmware-uploader-body">
        <div class="layout">
          <div class="col-left">
            <section class="panel">
              <div class="panel-header">
                <h2>${t("firmware.serial.title")}</h2>
              </div>
              <div class="panel-body">
                <div class="setting-row">
                  <label>${t("firmware.serial.baudRate")}</label>
                  <select
                    onchange=${r=>i("fw-set-baud",r.target.value)}
                    disabled=${a.isConnected}>
                    <option value="115200" selected=${a.baudRate===115200}>115,200</option>
                    <option value="230400" selected=${a.baudRate===230400}>230,400</option>
                    <option value="460800" selected=${a.baudRate===460800}>460,800</option>
                    <option value="921600" selected=${a.baudRate===921600}>${t("firmware.serial.baudDefault")}</option>
                  </select>
                </div>

                <p class="help-text">${t("firmware.serial.help")}</p>
              </div>
            </section>
          </div>

          <div class="col-right">
            <section class="panel">
              <div class="panel-header">
                <h2>${t("firmware.select.title")}</h2>
              </div>
              <div class="panel-body">
                <div class="version-list">
                  ${f.map(r=>html`
                    <div
                      class=${`version-card ${a.selectedVersion===r.id?"selected":""}`}
                      onclick=${()=>i("fw-select-version",r.id)}>
                      <div class="version-card-top">
                        <div class="version-info">
                          <img src=${r.image} alt=${r.board} class="version-board-img"
                               onerror=${d=>{d.target.style.display="none"}} />
                          <div>
                            <span class="version-number">${t(r.labelKey)}</span>
                            <span class=${`version-tag tag-${r.tag}`}>${t("firmware.tag."+r.tag)}</span>
                          </div>
                        </div>
                        <span class="version-date">${r.version}</span>
                      </div>
                      <p class="version-desc">${t(r.descriptionKey)}</p>
                      <div class="version-meta"><span>${r.date}</span></div>
                      ${a.selectedVersion===r.id?html`
                        <div class="version-changelog">
                          <ul>
                            ${r.changelogKeys.map(d=>html`<li>${t(d)}</li>`)}
                          </ul>
                        </div>
                      `:""}
                    </div>
                  `)}
                </div>
              </div>
            </section>

            <section class="panel upload-panel">
              <div class="panel-body">
                ${a.uploadStatus==="uploading"?html`
                  <div class="progress-container">
                    <div class="progress-header">
                      <span>${t("firmware.upload.progressLabel")}</span>
                      <span class="progress-pct">${a.uploadProgress}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style=${`width:${a.uploadProgress}%`}></div>
                    </div>
                  </div>
                `:""}

                ${a.uploadStatus==="error"?html`
                  <div class="upload-result error">
                    <span>${t("firmware.upload.error")}</span>
                  </div>
                `:""}

                <button
                  class="btn btn-upload"
                  onclick=${F}
                  disabled=${a.uploadStatus!=="success"&&!h}>
                  ${a.isUploading?html`<span class="spinner"></span> ${t("firmware.upload.uploading")}`:a.uploadStatus==="success"?t("firmware.upload.done"):html`<span class="material-symbols-outlined">upload_2</span> ${t("firmware.upload.button")}`}
                </button>
              </div>
            </section>
          </div>
        </div>

        <section class="panel log-panel">
          <div class="log-container log-container-grow">
            ${a.logs.length===0?html`<div class="log-empty">${t("firmware.log.empty")}</div>`:a.logs.map(r=>html`
                  <div class=${`log-entry log-${r.type}`}>
                    <span class="log-time">${r.timestamp}</span>
                    <span class="log-badge">${r.type.toUpperCase()}</span>
                    <span class="log-msg">${r.message}</span>
                  </div>
                `)}
          </div>
        </section>
        <div class="log-spacer"></div>
      </div>
    </div>
  `}function Overlay(e,i){const a=html`<span class="material-symbols-outlined overlay-spinner">hourglass_empty</span>`,c=h=>html`<div class="overlay-message">${a}<span>${h}</span></div>`;let f=html`<div id="overlay" class="closed"></div>`;return e.diskFiles==null&&(i("load-disk-files"),f=html`<div id="overlay" class="open">${c(t("overlay.loading"))}</div>`),e.isRemoving&&(f=html`<div id="overlay" class="open">${c(t("overlay.removing"))}</div>`),e.isConnecting&&(f=html`<div id="overlay" class="open">${c(t("overlay.connecting"))}</div>`),e.isLoadingFiles&&(f=html`<div id="overlay" class="open">${c(t("overlay.loading"))}</div>`),e.isSaving&&(f=html`<div id="overlay" class="open">${c(t("overlay.saving",{progress:e.savingProgress}))}</div>`),e.isTransferring&&(f=html`<div id="overlay" class="open">${c(html`${t("overlay.transferring")}<br><br>${e.transferringProgress}`)}</div>`),f}function EditorView(e,i){return html`
    <div class="working-area">
      ${Tabs(e,i)}
      ${CodeEditor(e,i)}
      ${ReplPanel(e,i)}
    </div>
  `}(function(){function e(...h){return h.filter(r=>r!=null&&r!=="").map(r=>String(r)).join("/").replace(/\/+/g,"/")}function i(...h){let F=e(...h);return F.startsWith("/")||(F="/"+F),F.replace(/\/+/g,"/")}function a(h){if(!h)return"/";const F=String(h).replace(/\/+$/,"");if(F===""||F==="/")return"/";const r=F.lastIndexOf("/");return r<=0?"/":F.slice(0,r)}function c(h){const F=String(h||"").replace(/\/+$/,""),r=F.lastIndexOf("/");return r===-1?F:F.slice(r+1)}function f(h){return h?String(h).replace(/\\/g,"/").replace(/\/+/g,"/").replace(/^\/+/,""):""}window.PosixPath={join:e,resolve:i,dirname:a,basename:c,normalize:f}})(),(function(){const e={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"CommandOrControl+Enter",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"CommandOrControl+H",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"};function i(){const c=navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"";return/mac|darwin/i.test(c)}function a(c){if(!c)return"";const f=i();return c.replace("CommandOrControl",f?"Cmd":"Ctrl").replace("CmdOrCtrl",f?"Cmd":"Ctrl").replace("Alt",f?"Option":"Alt")}window.AppShortcuts={map:e,displayLabel:a,isMacPlatform:i}})(),(function(){const e="micropython-ide-fsa",a="handles",c="diskRoot";function f(){return new Promise((m,k)=>{const v=indexedDB.open(e,1);v.onupgradeneeded=()=>{const y=v.result;y.objectStoreNames.contains(a)||y.createObjectStore(a)},v.onsuccess=()=>m(v.result),v.onerror=()=>k(v.error)})}async function h(m){const k=await f();try{await new Promise((v,y)=>{const n=k.transaction(a,"readwrite");n.objectStore(a).put(m,c),n.oncomplete=()=>v(),n.onerror=()=>y(n.error),n.onabort=()=>y(n.error)})}finally{k.close()}}async function F(){const m=await f();try{return await new Promise((k,v)=>{const n=m.transaction(a,"readonly").objectStore(a).get(c);n.onsuccess=()=>k(n.result||null),n.onerror=()=>v(n.error)})}finally{m.close()}}async function r(){const m=await f();try{await new Promise((k,v)=>{const y=m.transaction(a,"readwrite");y.objectStore(a).delete(c),y.oncomplete=()=>k(),y.onerror=()=>v(y.error)})}finally{m.close()}}async function d(m,k="readwrite"){const v={mode:k};return typeof m.queryPermission=="function"&&await m.queryPermission(v)==="granted"||typeof m.requestPermission=="function"&&await m.requestPermission(v)==="granted"}async function u(m,k="readwrite"){return typeof m.queryPermission!="function"?!1:await m.queryPermission({mode:k})==="granted"}window.FsaHandleStore={saveHandle:h,loadHandle:F,clearHandle:r,verifyPermission:d,queryPermissionOnly:u}})(),(function(){let e=!1;function i(){if(e)return;e=!0;const c=`
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
    `,f=document.createElement("style");f.textContent=c,document.head.appendChild(f)}function a(c){i();const f=c&&c.buttons||["OK"],h=c&&c.defaultId!=null?c.defaultId:0,F=c&&c.cancelId!=null?c.cancelId:-1,r=c&&c.message||"",d=c&&c.title||"";return new Promise(u=>{const m=document.createElement("dialog");m.className="app-dialog",m.setAttribute("data-dialog-type",c&&c.type||"info");let k=!1;function v(_){if(!k){k=!0;try{m.close()}catch(R){}m.parentNode&&m.parentNode.removeChild(m),u(_!==F)}}const y=()=>v(F===-1?f.length:F),n=document.createElement("div");n.className="app-dialog-header";const o=document.createElement("div");o.className="app-dialog-title",o.textContent=d,n.appendChild(o);const s=document.createElement("button");s.className="app-dialog-close",s.type="button",s.setAttribute("aria-label","Close"),s.textContent="\xD7",s.addEventListener("click",y),n.appendChild(s),m.appendChild(n);const l=document.createElement("div");l.className="app-dialog-body";const g=document.createElement("p");g.className="app-dialog-message",g.textContent=r,l.appendChild(g),m.appendChild(l);const b=document.createElement("div");b.className="app-dialog-buttons",f.forEach((_,R)=>{const B=document.createElement("button");B.type="button",B.textContent=_,R===h&&B.classList.add("app-dialog-default"),B.addEventListener("click",()=>v(R)),b.appendChild(B)}),m.appendChild(b),m.addEventListener("cancel",_=>{_.preventDefault(),y()}),document.body.appendChild(m),m.showModal();const $=b.querySelector(".app-dialog-default");$&&$.focus()})}window.AppDialog={openDialog:a}})(),(function(){if(!window.AppShortcuts){console.error("[shortcut-manager] AppShortcuts not loaded");return}const e=window.AppShortcuts.isMacPlatform(),i=[],a=[];let c=!1;function f(y){if(!(e?y.metaKey:y.ctrlKey))return null;const o=["CommandOrControl"];y.altKey&&o.push("Alt"),y.shiftKey&&o.push("Shift");let s=null;return y.code&&y.code.startsWith("Key")?s=y.code.slice(3).toUpperCase():y.code&&y.code.startsWith("Digit")?s=y.code.slice(5):y.key==="Enter"?s="Enter":y.key===" "?s="Space":y.key&&y.key.length===1?s=y.key.toUpperCase():s=y.key,s?(o.push(s),o.join("+")):null}function h(){const y=window.AppShortcuts.map,n=new Set;for(const o of Object.keys(y))n.add(y[o]);return n}let F=h();function r(y){if(!y)return!1;const n=(y.tagName||"").toLowerCase();return!!(n==="input"||n==="textarea"||n==="select"||y.isContentEditable)}function d(y){if(c||i.length===0)return;const n=f(y);if(n&&F.has(n)){y.preventDefault(),y.stopPropagation();for(const o of i)try{o(n)}catch(s){console.error("[shortcut]",s)}}}window.addEventListener("keydown",d,!0);function u(y){typeof y=="function"&&i.push(y)}function m(y){typeof y=="function"&&a.push(y)}function k(y){c=!!y;for(const n of a)try{n(c)}catch(o){console.error("[disable-shortcuts]",o)}}function v(y){for(const n of i)try{n(y)}catch(o){console.error("[shortcut/menu]",o)}}window.AppShortcutManager={onShortcut:u,onDisableShortcuts:m,setSuppressed:k,dispatchAccelerator:v,eventToAccelerator:f,refreshKnown:()=>{F=h()}}})(),(function(){const e=u=>()=>Promise.reject(new Error(`not implemented yet: ${u}`));window.PosixPath||console.error("[web-bridges] PosixPath not loaded \u2014 check script order");const i=window.PosixPath||{join:(...u)=>u.filter(Boolean).join("/").replace(/\/+/g,"/"),resolve:(...u)=>"/"+u.filter(Boolean).join("/").replace(/\/+/g,"/"),dirname:u=>(u||"/").replace(/\/[^/]*$/,"")||"/"},a=i.join,c=i.resolve,f=i.dirname;window.BridgeSerial={loadPorts:e("BridgeSerial.loadPorts"),requestPort:e("BridgeSerial.requestPort"),connect:e("BridgeSerial.connect"),disconnect:e("BridgeSerial.disconnect"),run:e("BridgeSerial.run"),execFile:e("BridgeSerial.execFile"),getPrompt:e("BridgeSerial.getPrompt"),keyboardInterrupt:e("BridgeSerial.keyboardInterrupt"),reset:e("BridgeSerial.reset"),eval:e("BridgeSerial.eval"),onData:()=>{},listFiles:e("BridgeSerial.listFiles"),ilistFiles:e("BridgeSerial.ilistFiles"),loadFile:e("BridgeSerial.loadFile"),removeFile:e("BridgeSerial.removeFile"),saveFileContent:e("BridgeSerial.saveFileContent"),uploadFile:e("BridgeSerial.uploadFile"),downloadFile:e("BridgeSerial.downloadFile"),renameFile:e("BridgeSerial.renameFile"),onConnectionClosed:()=>{},createFolder:e("BridgeSerial.createFolder"),removeFolder:e("BridgeSerial.removeFolder"),fileExists:e("BridgeSerial.fileExists"),getNavigationPath:(u,m)=>a(u,m),getFullPath:(u,m,k)=>a(u,(m||"").replace(/\\/g,"/"),(k||"").replace(/\\/g,"/")),getParentPath:u=>f(u)},window.BridgeDisk={openFolder:e("BridgeDisk.openFolder"),listFiles:e("BridgeDisk.listFiles"),ilistFiles:e("BridgeDisk.ilistFiles"),ilistAllFiles:e("BridgeDisk.ilistAllFiles"),loadFile:e("BridgeDisk.loadFile"),loadFileBytes:e("BridgeDisk.loadFileBytes"),removeFile:e("BridgeDisk.removeFile"),saveFileContent:e("BridgeDisk.saveFileContent"),renameFile:e("BridgeDisk.renameFile"),createFolder:e("BridgeDisk.createFolder"),removeFolder:e("BridgeDisk.removeFolder"),fileExists:e("BridgeDisk.fileExists"),getAppPath:()=>Promise.resolve("./"),getNavigationPath:(u,m)=>a(u,m),getFullPath:(u,m,k)=>c(u,(m||"").replace(/\\/g,"/"),(k||"").replace(/\\/g,"/")),getParentPath:u=>f(u)};const h={CLOSE:"CommandOrControl+Shift+W",CONNECT:"CommandOrControl+Shift+C",DISCONNECT:"CommandOrControl+Shift+D",RUN:"CommandOrControl+Enter",RUN_SELECTION:"CommandOrControl+Alt+Enter",RUN_SELECTION_WL:"CommandOrControl+Alt+S",STOP:"CommandOrControl+H",RESET:"CommandOrControl+Shift+R",NEW:"CommandOrControl+N",SAVE:"CommandOrControl+S",CLEAR_TERMINAL:"CommandOrControl+L",EDITOR_VIEW:"CommandOrControl+Alt+1",FILES_VIEW:"CommandOrControl+Alt+2"},F=window.AppShortcuts&&window.AppShortcuts.map||h;function r(){const m=(navigator.userAgentData&&navigator.userAgentData.platform||navigator.platform||"").toLowerCase();return m.includes("win")?"win32":m.includes("mac")?"darwin":m.includes("linux")?"linux":"unknown"}const d=r();window.BridgeWindow={setWindowSize:()=>{},onKeyboardShortcut:()=>{},onDisableShortcuts:()=>{},beforeClose:()=>{},confirmClose:()=>Promise.resolve(),isPackaged:()=>Promise.resolve(!1),openDialog:e("BridgeWindow.openDialog"),getOS:()=>d,isWindows:()=>d==="win32",isMac:()=>d==="darwin",isLinux:()=>d==="linux",updateMenuState:()=>Promise.resolve(),getShortcuts:()=>F},window.launchApp=async(u,m)=>{const k=m||u;k&&window.open(k,"_blank","noopener,noreferrer")}})(),(function(){const e=typeof navigator!="undefined"&&"serial"in navigator;function i(F){return new Promise(r=>setTimeout(r,F))}function a(F){return F.replace(/\r\n/g,`
`)}function c(F){return F.slice(2,-3)}function f(F,r=2,d=3){return F.slice(r,-d).split(",").filter(m=>m.length>0).map(Number)}class h{constructor(){this.port=null,this.writer=null,this.reader=null,this._readLoopPromise=null,this._matcher=null,this._inboundBuffer="",this._dataListener=null,this._closeListener=null,this.reject_run=null,this.write_chunk_size=128,this.write_chunk_sleep=10,this.fs_chunk_size=48}async list_ports(){if(!e)throw new Error("Web Serial API not supported in this browser");return(await navigator.serial.getPorts()).map(d=>{const u=d.getInfo&&d.getInfo()||{};return{path:u.usbVendorId!=null?`bitblock:${u.usbVendorId.toString(16)}:${(u.usbProductId||0).toString(16)}`:"serial",vendorId:u.usbVendorId,productId:u.usbProductId,_port:d}})}async request_port(r){if(!e)throw new Error("Web Serial API not supported in this browser");const d=r?{filters:r}:{};return await navigator.serial.requestPort(d)}async open(r){if(!e)throw new Error("Web Serial API not supported in this browser");this.port&&await this.close();let d;r&&r._port?d=r._port:r&&typeof r.open=="function"?d=r:d=await navigator.serial.requestPort(),await d.open({baudRate:115200}),this.port=d,this.writer=d.writable.getWriter(),this._startReadLoop()}_startReadLoop(){const r=new TextDecoder;this._readLoopPromise=(async()=>{for(;this.port&&this.port.readable;){let d;try{d=this.port.readable.getReader()}catch(u){break}this.reader=d;try{for(;;){const{value:u,done:m}=await d.read();if(m)break;if(u&&u.byteLength>0){const k=r.decode(u,{stream:!0});this._onIncomingText(k)}}}catch(u){break}finally{try{d.releaseLock()}catch(u){}this.reader=null}}this._onClose()})()}_onIncomingText(r){if(this._dataListener)try{this._dataListener(r)}catch(d){}if(this._matcher){if(this._matcher.buffer+=r,this._matcher.dc)try{this._matcher.dc(r)}catch(u){}const d=this._matcher.buffer.indexOf(this._matcher.ending);if(d!==-1){const u=this._matcher;this._matcher=null;const m=u.buffer.slice(0,d+u.ending.length);this._inboundBuffer=u.buffer.slice(d+u.ending.length),u.resolve(m)}}else this._inboundBuffer+=r}_onClose(){const r=this._closeListener;if(r)try{r()}catch(d){}if(this._matcher){const d=this._matcher;this._matcher=null,d.reject(new Error("serial connection closed"))}}async close(){if(this.reject_run){try{this.reject_run(new Error("pre close"))}catch(d){}this.reject_run=null}const r=this.port;this.port=null;try{this.reader&&await this.reader.cancel()}catch(d){}try{this.writer&&(await this.writer.close().catch(()=>{}),this.writer.releaseLock())}catch(d){}this.writer=null,this.reader=null;try{r&&await r.close()}catch(d){}}on_data(r){this._dataListener=r}on_close(r){this._closeListener=r}read_until(r,d){return new Promise((u,m)=>{if(this._matcher){const y=this._matcher;this._matcher=null,y.reject(new Error("superseded"))}const k=this._inboundBuffer;this._inboundBuffer="";const v=k.indexOf(r);if(v!==-1){const y=k.slice(0,v+r.length);return this._inboundBuffer=k.slice(v+r.length),u(y)}this._matcher={ending:r,dc:d,buffer:k,resolve:u,reject:m}})}async write_and_read_until(r,d,u){if(!this.writer)throw new Error("serial not open");this._inboundBuffer="";const m=new TextEncoder,k=this.write_chunk_size,v=this.write_chunk_sleep;for(let n=0;n<r.length;n+=k){const o=r.slice(n,n+k);await this.writer.write(m.encode(o)),await i(v)}let y;return d&&(y=await this.read_until(d,u)),await i(v),y}async get_prompt(){return await i(150),await this.stop(),await i(150),await this.write_and_read_until("\r",`\r
>>>`)}async enter_raw_repl(){return await this.write_and_read_until("","raw REPL; CTRL-B to exit")}async exit_raw_repl(){return await this.write_and_read_until("",`\r
>>>`)}async exec_raw(r,d){return await this.write_and_read_until(r),await this.write_and_read_until("",">",d)}async execfile(r,d){const u=typeof r=="string"?r:new TextDecoder().decode(r);await this.enter_raw_repl();const m=await this.exec_raw(u,d);return await this.exit_raw_repl(),m}async run(r,d){const u=d||function(){};return new Promise(async(m,k)=>{this.reject_run&&(this.reject_run(new Error("re-run")),this.reject_run=null),this.reject_run=k;try{await this.enter_raw_repl();const v=await this.exec_raw(r||"#",u);await this.exit_raw_repl(),this.reject_run=null,m(v)}catch(v){this.reject_run=null,k(v)}})}async eval(r){if(!this.writer)throw new Error("serial not open");await this.writer.write(new TextEncoder().encode(r))}async stop(){if(this.reject_run){try{this.reject_run(new Error("pre stop"))}catch(r){}this.reject_run=null}this.writer&&await this.writer.write(new TextEncoder().encode(""))}async reset(){if(this.reject_run){try{this.reject_run(new Error("pre reset"))}catch(r){}this.reject_run=null}this.writer&&(await this.writer.write(new TextEncoder().encode("")),await this.writer.write(new TextEncoder().encode("")))}async fs_exists(r){r=r||"";let d=`try:
`;d+=`  f = open("${r}", "r")
`,d+=`  print(1)
`,d+=`except OSError:
`,d+=`  print(0)
`,d+=`del f
`,await this.enter_raw_repl();const u=await this.exec_raw(d);return await this.exit_raw_repl(),u[2]==="1"}async fs_ls(r){r=r||"";let d=`import os
`;d+=`try:
`,d+=`  print(os.listdir("${r}"))
`,d+=`except OSError:
`,d+=`  print([])
`,await this.enter_raw_repl();let u=await this.exec_raw(d);return await this.exit_raw_repl(),u=c(u).replace(/'/g,'"'),JSON.parse(u)}async fs_ils(r){r=r||"";let d=`import os
`;d+=`try:
`,d+=`  l=[]
`,d+=`  f=None
`,d+=`  for f in os.ilistdir("${r}"):
`,d+=`    l.append(list(f))
`,d+=`  print(l)
`,d+=`except OSError:
`,d+=`  print([])
`,d+=`del l
`,d+=`if f:del f
`,await this.enter_raw_repl();let u=await this.exec_raw(d);return await this.exit_raw_repl(),u=c(u).replace(/'/g,'"').split("OK"),JSON.parse(u)}async fs_cat_binary(r){if(!r)throw new Error("Path to file was not specified");await this.enter_raw_repl();const d=256;let u=`with open('${r}','rb') as f:
`;u+=`  while 1:
`,u+=`    b=f.read(${d})
`,u+=`    if not b:break
`,u+=`    print(",".join(str(e) for e in b),end=",")
`,u+=`del f
`,u+=`del b
`;let m=await this.exec_raw(u);await this.exit_raw_repl();const k=f(m,2,4);return new Uint8Array(k)}async fs_cat(r){if(!r)throw new Error("Path to file was not specified");await this.enter_raw_repl();const d=`with open('${r}','r') as f:
 while 1:
  b=f.read(256)
  if not b:break
  print(b,end='')
del f
del b
`;let u=await this.exec_raw(d);return await this.exit_raw_repl(),a(c(u))}async fs_put(r,d,u){if(!r||!d)throw new Error("Must specify source bytes and destination");const m=u||function(){},k=r instanceof Uint8Array?r:r instanceof ArrayBuffer?new Uint8Array(r):new TextEncoder().encode(String(r));let v="";v+=await this.enter_raw_repl(),v+=await this.exec_raw(`f=open('${d}','wb')
w=f.write`);const y=this.fs_chunk_size;for(let n=0;n<k.length;n+=y){const o=k.subarray(n,n+y);v+=await this.exec_raw(`w(bytes([${o}]))`),m(parseInt(n/k.length*100)+"%")}return v+=await this.exec_raw(`f.close()
del f
del w
`),v+=await this.exit_raw_repl(),m("100%"),v}async fs_save(r,d,u){if(r==null||!d)throw new Error("Must specify content and destination path");const m=u||function(){},k=typeof r=="string"?new TextEncoder().encode(r):r instanceof Uint8Array?r:new Uint8Array(r);let v="";v+=await this.enter_raw_repl(),v+=await this.exec_raw(`f=open('${d}','wb')
w=f.write`);const y=this.fs_chunk_size;for(let n=0;n<k.length;n+=y){const o=k.subarray(n,n+y);v+=await this.exec_raw(`w(bytes([${o}]))`),m(parseInt(n/k.length*100)+"%")}return v+=await this.exec_raw(`f.close()
del f
del w
`),v+=await this.exit_raw_repl(),m("100%"),v}async fs_mkdir(r){if(!r)throw new Error("Path required");await this.enter_raw_repl();const d=await this.exec_raw(`import os
os.mkdir('${r}')`);return await this.exit_raw_repl(),d}async fs_rmdir(r){if(!r)throw new Error("Path required");let d=`import os
`;d+=`try:
`,d+=`  os.rmdir("${r}")
`,d+=`except OSError:
`,d+=`  print(0)
`,await this.enter_raw_repl();const u=await this.exec_raw(d);return await this.exit_raw_repl(),u}async fs_rm(r){if(!r)throw new Error("Path required");let d=`import os
`;d+=`try:
`,d+=`  os.remove("${r}")
`,d+=`except OSError:
`,d+=`  print(0)
`,await this.enter_raw_repl();const u=await this.exec_raw(d);return await this.exit_raw_repl(),u}async fs_rename(r,d){if(!r||!d)throw new Error("Both paths required");await this.enter_raw_repl();const u=await this.exec_raw(`import os
os.rename('${r}', '${d}')`);return await this.exit_raw_repl(),u}}typeof window!="undefined"&&(window.MicroPythonWeb=h),typeof module!="undefined"&&module.exports&&(module.exports={MicroPythonWeb:h,extract:c,extractBytes:f,fixLineBreak:a})})(),(function(){if(!window.MicroPythonWeb){console.error("[BridgeSerial] MicroPythonWeb not loaded \u2014 check script order in index.html");return}const e=new window.MicroPythonWeb;let i=[],a=null,c=null;async function f(){if(a!=null)return a;if(c)return c;c=(async()=>{const w=await fetch("helpers.py",{cache:"no-cache"});if(!w.ok)throw new Error(`helpers.py fetch failed: HTTP ${w.status}`);return a=await w.text(),a})();try{return await c}finally{c=null}}let h=null,F=null;e.on_data(w=>{h&&h(w)}),e.on_close(()=>{F&&F()});async function r(){const w=await e.list_ports();return i=w,w.filter(E=>E.vendorId!=null&&E.productId!=null).map(E=>({path:E.path,vendorId:E.vendorId,productId:E.productId}))}function d(w){return i.find(E=>E.path===w)||null}const u=[{usbVendorId:12346,usbProductId:16385}],m=[{usbVendorId:12346,usbProductId:4097}];window.FIRMWARE_PORT_FILTERS=m;async function k(w={}){const E=w.firmware?m:u;let x;try{x=await e.request_port(E)}catch(T){if(T&&(T.name==="NotFoundError"||/No port selected/i.test(T.message||"")))return null;throw T}i=await e.list_ports();const O=i.find(T=>T._port===x);return!O||O.vendorId==null||O.productId==null?null:{path:O.path,vendorId:O.vendorId,productId:O.productId}}async function v(w){let E=d(w);if(E||(i=await e.list_ports(),E=d(w)),!E)throw new Error(`Port not found: ${w}. Try clicking Connect again to re-authorize.`);await e.open(E),f().catch(()=>{})}async function y(){return await e.close()}function n(w){return e.run(w)}async function o(w){const E=await f();return await e.execfile(E)}function s(){return e.get_prompt()}function l(w){return e.eval(w)}function g(){return e.stop()}async function b(){await e.stop();try{await e.exit_raw_repl()}catch(w){}await e.reset()}function $(w){return e.fs_ls(w)}function _(w){return e.fs_ils(w)}async function R(w){return await e.fs_cat_binary(w)||new Uint8Array}function B(w){return e.fs_rm(w)}function C(w,E){return e.fs_rename(w,E)}function N(w){return e.fs_mkdir(w)}function D(w){return e.fs_rmdir(w)}async function I(w,E,x){return await e.fs_save(E||" ",w,x||function(){})}async function A(w,E,x){if(!window.BridgeDisk||!window.BridgeDisk.loadFileBytes)throw new Error("BridgeDisk.loadFileBytes is required for uploadFile (Phase 3)");const O=await window.BridgeDisk.loadFileBytes(w),T=String(E).replace(/\\/g,"/");return await e.fs_put(O,T,x||function(){})}async function H(w,E){if(!window.BridgeDisk||!window.BridgeDisk.saveFileContent)throw new Error("BridgeDisk.saveFileContent is required for downloadFile (Phase 3)");const x=await e.fs_cat_binary(w);return await window.BridgeDisk.saveFileContent(E,x)}async function p(w){const E=await e.run(`
import os
try:
  os.stat("${w}")
  print(0)
except OSError:
  print(1)
`);return E&&E[2]==="0"}function S(w){h=w}function P(w){F=w}Object.assign(window.BridgeSerial,{loadPorts:r,requestPort:k,connect:v,disconnect:y,run:n,execFile:o,getPrompt:s,keyboardInterrupt:g,reset:b,eval:l,onData:S,listFiles:$,ilistFiles:_,loadFile:R,removeFile:B,saveFileContent:I,uploadFile:A,downloadFile:H,renameFile:C,onConnectionClosed:P,createFolder:N,removeFolder:D,fileExists:p}),window.__micropython=e})(),(function(){if(!window.PosixPath||!window.FsaHandleStore){console.error("[BridgeDisk] Required modules missing \u2014 check script order in index.html");return}const e=window.PosixPath,i=window.FsaHandleStore;let a=null,c=null;(async()=>{try{const C=await i.loadHandle();C&&await i.queryPermissionOnly(C,"readwrite")&&(a=C,c=C.name)}catch(C){}})();function f(C){let N=e.normalize(C);if(c){if(N===c)return"";if(N.startsWith(c+"/"))return N.slice(c.length+1)}return N}async function h(C,N){if(!a)throw new Error("No folder selected");if(!C||C==="."||C==="/")return a;let D=a;for(const I of C.split("/").filter(A=>A&&A!=="."))D=await D.getDirectoryHandle(I,N||void 0);return D}async function F(C,N){const D=f(C),I=e.dirname(D),A=e.basename(D),H=N&&N.create?{create:!0}:void 0;return await(await h(I==="/"?"":I,H)).getFileHandle(A,N||void 0)}async function r(){if(a)return;const C=await i.loadHandle();if(C&&await i.verifyPermission(C,"readwrite")){a=C,c=C.name;return}throw new Error('No folder selected. Click "Open Folder" first.')}async function d(C){const N=await h(C),D=[];for await(const[I,A]of N.entries())A.kind==="file"&&D.push(I);return D}async function u(C){const N=await h(C),D=[];for await(const[I,A]of N.entries())I.startsWith(".")||D.push({path:I,type:A.kind==="directory"?"folder":"file"});return D}async function m(C,N,D){const I=await h(C);for await(const[A,H]of I.entries()){if(A.startsWith("."))continue;const p=C?C+"/"+A:A,S=N?N+"/"+A:A;D.push({path:S,type:H.kind==="directory"?"folder":"file"}),H.kind==="directory"&&await m(p,S,D)}}async function k(){if(typeof window.showDirectoryPicker!="function")throw new Error("File System Access API not supported in this browser");let C;try{C=await window.showDirectoryPicker({mode:"readwrite"})}catch(D){if(D&&(D.name==="AbortError"||/aborted|cancel/i.test(D.message||"")))return{folder:null,files:[]};throw D}await i.saveHandle(C),a=C,c=C.name;const N=await d("");return{folder:C.name,files:N}}async function v(C){return await r(),await d(f(C))}async function y(C){return await r(),await u(f(C))}async function n(C){await r();const N=[];return await m(f(C),String(C||""),N),N}async function o(C){await r();const D=await(await F(C)).getFile();return new Uint8Array(await D.arrayBuffer())}async function s(C){const N=await o(C);return new TextDecoder("utf-8").decode(N)}async function l(C,N){await r();const I=await(await F(C,{create:!0})).createWritable();let A;return N instanceof Uint8Array?A=N:N instanceof ArrayBuffer?A=new Uint8Array(N):A=String(N==null?"":N),await I.write(A),await I.close(),!0}async function g(C){await r();const N=f(C),D=e.dirname(N),I=e.basename(N);return await(await h(D==="/"?"":D)).removeEntry(I),!0}async function b(C,N){await r();const D=f(C),I=f(N),A=await F(C);if(typeof A.move=="function"){const p=e.dirname(D),S=e.dirname(I),P=e.basename(I);try{if(p===S)await A.move(P);else{const E=await h(S==="/"?"":S,{create:!0});await A.move(E,P)}return!0}catch(w){}}const H=await o(C);return await l(N,H),await g(C),!0}async function $(C){return await r(),await h(f(C),{create:!0}),!0}async function _(C){await r();const N=f(C);if(!N)throw new Error("Cannot remove the root folder");const D=e.dirname(N),I=e.basename(N);return await(await h(D==="/"?"":D)).removeEntry(I,{recursive:!0}),!0}async function R(C){await r();try{return await F(C),!0}catch(N){if(N&&N.name==="NotFoundError")try{return await h(f(C)),!0}catch(D){return!1}throw N}}function B(){return Promise.resolve("./")}Object.assign(window.BridgeDisk,{openFolder:k,listFiles:v,ilistFiles:y,ilistAllFiles:n,loadFile:s,loadFileBytes:o,saveFileContent:l,removeFile:g,renameFile:b,createFolder:$,removeFolder:_,fileExists:R,getAppPath:B}),window.__bridgeDiskState=()=>({rootName:c,hasHandle:!!a})})(),(function(){if(!window.AppDialog||!window.AppShortcuts||!window.AppShortcutManager){console.error("[BridgeWindow] required modules missing \u2014 check script order");return}function e(m){return window.AppDialog.openDialog(m||{})}function i(){return window.AppShortcuts.map}function a(m){window.AppShortcutManager.onShortcut(m)}function c(m){window.AppShortcutManager.onDisableShortcuts(m)}let f=null;function h(m){f=m,window.addEventListener("beforeunload",k=>{if(f){try{Promise.resolve(f()).catch(()=>{})}catch(v){}k.preventDefault(),k.returnValue=""}})}function F(){try{window.close()}catch(m){}return Promise.resolve()}function r(){}function d(){return Promise.resolve(!1)}function u(m){try{window.dispatchEvent(new CustomEvent("menu-state-change",{detail:m}))}catch(k){}return Promise.resolve()}Object.assign(window.BridgeWindow,{openDialog:e,getShortcuts:i,onKeyboardShortcut:a,onDisableShortcuts:c,beforeClose:h,confirmClose:F,setWindowSize:r,isPackaged:d,updateMenuState:u})})(),(function(){const e=["https://raw.githubusercontent.com/arduino/package-index-py/main/package-list.yaml","https://raw.githubusercontent.com/arduino/package-index-py/main/micropython-lib.yaml","https://raw.githubusercontent.com/moyalab/package-index-py/main/package-list.yaml"],i="https://micropython.org/pi/v2",a="/lib";let c=null,f=null;function h(p){if(!p)return"";const S=p.indexOf("OK"),P=p.indexOf("");return S===-1||P===-1||P<=S+2?"":p.substring(S+2,P).trim()}async function F(p=!1){if(c&&!p)return c;if(f)return f;f=(async()=>{let S=[];for(const P of e)try{const w=await fetch(P,{cache:"no-cache"});if(!w.ok)throw new Error(`HTTP ${w.status}`);const E=await w.text(),x=window.jsyaml.load(E);x&&Array.isArray(x.packages)&&(S=S.concat(x.packages))}catch(w){throw new Error(`Failed to fetch ${P}: ${w.message}`)}return S.sort((P,w)=>(P.name||"").localeCompare(w.name||"")),c=S,S})();try{return await f}finally{f=null}}function r(p,S){const P=Array.isArray(S)?S:c||[];if(!p)return P.slice();const w=p.trim().toLowerCase();return w?P.filter(E=>E?[E.name,E.description,E.author,E.url,Array.isArray(E.tags)?E.tags.join(" "):E.tags].filter(Boolean).join(" ").toLowerCase().includes(w):!1):P.slice()}function d(p){if(!p)return null;const S=p.split("-");return S.length>=3?S[2]:null}async function u(){if(!window.BridgeSerial||typeof window.BridgeSerial.run!="function")return{format:null,arch:null};let p=null,S=null;try{const P=await window.BridgeSerial.run(`import sys
try:
  print(sys.implementation._mpy & 0xff)
except AttributeError:
  print("")
`),w=h(P);w&&/^\d+$/.test(w)&&(p=Number(w))}catch(P){}try{const P=await window.BridgeSerial.run(`try:
  import platform
  print(platform.platform())
except Exception:
  print("")
`);S=d(h(P))}catch(P){}return{format:p,arch:S}}function m(p){return p?p.startsWith("github:")||p.startsWith("gitlab:")||p.startsWith("http://")||p.startsWith("https://"):!1}function k(p,S){let P=String(p).trim(),w=S||null;const E=P.lastIndexOf("@");if(E>P.indexOf("://")&&E!==-1)w=w||P.substring(E+1),P=P.substring(0,E);else if(P.startsWith("github:")||P.startsWith("gitlab:")){const x=P.indexOf(":"),O=P.substring(x+1),T=O.lastIndexOf("@");T!==-1&&(w=w||O.substring(T+1),P=P.substring(0,x+1)+O.substring(0,T))}if(w=w||"HEAD",/\.(py|mpy)$/i.test(P))return{kind:"file",fileUrl:v(P,w),fileName:P.split("/").pop(),version:w};if(P.startsWith("github:")||P.startsWith("gitlab:")){const x=P.startsWith("github:")?"github":"gitlab",T=P.substring(P.indexOf(":")+1).split("/"),M=T[0],L=T[1],W=T.slice(2).join("/");return{kind:"repo",host:x,owner:M,repo:L,subdir:W,version:w}}try{const x=new URL(P);if(x.hostname==="github.com"||x.hostname==="www.github.com"){const O=x.pathname.replace(/^\//,"").split("/"),T=O[0],M=O[1];let L=O.slice(2);return(L[0]==="tree"||L[0]==="blob")&&(w=w==="HEAD"?L[1]||"HEAD":w,L=L.slice(2)),{kind:"repo",host:"github",owner:T,repo:M,subdir:L.join("/"),version:w}}if(x.hostname==="gitlab.com"||x.hostname==="www.gitlab.com"){const O=x.pathname.replace(/^\//,"").split("/");return{kind:"repo",host:"gitlab",owner:O[0],repo:O[1],subdir:O.slice(2).join("/"),version:w}}if(x.hostname==="raw.githubusercontent.com"){const O=x.pathname.replace(/^\//,"").split("/"),T=O[0],M=O[1],L=O[2];return{kind:"repo",host:"github",owner:T,repo:M,subdir:O.slice(3).join("/"),version:w==="HEAD"?L:w}}}catch(x){}throw new Error(`Unrecognized package URL: ${p}`)}function v(p,S){if(p.startsWith("github:")){const w=p.substring(7).split("/"),E=w[0],x=w[1],O=w.slice(2).join("/");return`https://raw.githubusercontent.com/${E}/${x}/${S}/${O}`}if(p.startsWith("gitlab:")){const w=p.substring(7).split("/"),E=w[0],x=w[1],O=w.slice(2).join("/");return`https://gitlab.com/${E}/${x}/-/raw/${S}/${O}`}return p}function y(p,S){const P=p.version||"HEAD",w=p.subdir?p.subdir.replace(/\/$/,"")+"/":"";return p.host==="github"?`https://raw.githubusercontent.com/${p.owner}/${p.repo}/${P}/${w}${S}`:`https://gitlab.com/${p.owner}/${p.repo}/-/raw/${P}/${w}${S}`}async function n(p){const S=await fetch(p,{cache:"no-cache"});if(!S.ok)throw new Error(`Fetch ${p} \u2192 HTTP ${S.status}`);const P=await S.arrayBuffer();return new Uint8Array(P)}async function o(p){const S=await fetch(p,{cache:"no-cache"});if(!S.ok)throw new Error(`Fetch ${p} \u2192 HTTP ${S.status}`);return await S.json()}async function s(p){const S=y(p,"package.json");try{return await o(S)}catch(P){throw new Error(`Could not find package.json at ${S} \u2014 ${P.message}`)}}function l(...p){return p.filter(S=>S!=null&&S!=="").join("/").replace(/\/+/g,"/")}function g(p){if(!p)return"/";const S=p.lastIndexOf("/");return S<=0?"/":p.substring(0,S)}async function b(p){const S=p.split("/").filter(Boolean);let P="";for(const w of S){P+="/"+w;try{await window.BridgeSerial.createFolder(P)}catch(E){}}}async function $(p,S,P){return await b(g(S)),await window.BridgeSerial.saveFileContent(S,p,P||(()=>{}))}async function _(p){let S;try{S=await window.BridgeSerial.ilistFiles(p)}catch(P){return}if(Array.isArray(S)){for(const P of S){const w=P[0],E=P[1],x=l(p,w);if(E===16384)await _(x);else try{await window.BridgeSerial.removeFile(x)}catch(O){}}try{await window.BridgeSerial.removeFolder(p)}catch(P){}}}function R(p,S){const P=[];if(!p||!Array.isArray(p.hashes))return P;for(const[w,E]of p.hashes){const x=E.slice(0,2);P.push({boardRelPath:w,fileUrl:`${i}/file/${x}/${E}`})}return P}function B(p,S){const P=[];if(!p||!Array.isArray(p.urls))return P;for(const w of p.urls){const E=w[0],x=w[1];let O;/^https?:\/\//.test(x)?O=x:x.startsWith("github:")||x.startsWith("gitlab:")?O=v(x,S.version):O=y(S,x),P.push({boardRelPath:E,fileUrl:O})}return P}async function C(p,{visitedKey:S,mpyFormat:P,visited:w=new Set}){if(w.has(S))return{entries:[],packageName:null};w.add(S);let E=[],x=null,O=null;if(p.kind==="index"){const T=`${i}/package/${P}/${p.name}/${p.version}.json`,M=await o(T);x=M.name||p.name,E=R(M,P),O=M.deps||null}else if(p.kind==="repo"){const T=await s(p.repo);x=T.name||p.repo.repo,E=B(T,p.repo),O=T.deps||null}else if(p.kind==="file"){const T=p.fileName;x=T.replace(/\.(m?py)$/i,""),E=[{boardRelPath:T,fileUrl:p.fileUrl}]}if(Array.isArray(O))for(const T of O){const M=Array.isArray(T)?T[0]:T,L=Array.isArray(T)?T[1]:null,W=N(M,L),q=D(W),j=await C(W,{visitedKey:q,mpyFormat:P,visited:w});E=E.concat(j.entries)}return{entries:E,packageName:x}}function N(p,S){if(!p)throw new Error("Empty package identifier");if(m(p)||/\.(py|mpy)$/i.test(p)){const w=k(p,S);return w.kind==="file"?{kind:"file",fileUrl:w.fileUrl,fileName:w.fileName}:{kind:"repo",repo:w}}const P=S||"latest";return{kind:"index",name:p,version:P==="HEAD"?"latest":P}}function D(p){return p.kind==="index"?`index:${p.name}@${p.version}`:p.kind==="repo"?`repo:${p.repo.host}:${p.repo.owner}/${p.repo.repo}/${p.repo.subdir}@${p.repo.version}`:`file:${p.fileUrl}`}function I(p){const S=new Set;for(const P of p){const w=P.boardRelPath.split("/")[0];w&&w.indexOf(".")===-1&&S.add(w)}return Array.from(S)}async function A(p,S={}){const{overwrite:P=!0,installAsMpy:w=!0,mpySpec:E=null,onProgress:x=()=>{}}=S;if(!p)throw new Error("No package provided");const T=w&&E&&E.format!=null?String(E.format):"py";let M;if(p.url)M=N(p.url,p.version);else if(p.name)M=N(p.name,p.version);else throw new Error("Package has neither name nor url");x({phase:"resolve",message:"Resolving package and dependencies\u2026"});const{entries:L}=await C(M,{visitedKey:D(M),mpyFormat:T});if(L.length===0)throw new Error("No files to install");const W=a;try{await window.BridgeSerial.createFolder(W)}catch(U){}const q=I(L);for(const U of q){const z=l(W,U);if(await window.BridgeSerial.fileExists(z)){if(!P)throw new Error(`Package folder already exists: ${z}`);x({phase:"cleanup",message:`Removing existing ${z}\u2026`}),await _(z)}}for(const U of L){if(U.boardRelPath.indexOf("/")!==-1)continue;const z=l(W,U.boardRelPath);if(await window.BridgeSerial.fileExists(z)){if(!P)throw new Error(`File already exists: ${z}`);try{await window.BridgeSerial.removeFile(z)}catch(K){}}}let j=0;for(const U of L){j+=1;const z=l(W,U.boardRelPath);x({phase:"install",message:`Installing ${j}/${L.length}: ${U.boardRelPath}`,current:j,total:L.length});const V=await n(U.fileUrl);await $(V,z,K=>{x({phase:"install",message:`Installing ${j}/${L.length}: ${U.boardRelPath} ${K}`,current:j,total:L.length,chunk:K})})}return x({phase:"done",message:`Installed ${L.length} file(s)`}),{installedFiles:L.length,formatUsed:T}}async function H(p,S={}){if(!p||typeof p!="string")throw new Error("URL is required");return await A({url:p.trim()},S)}window.PackageInstaller={getPackageList:F,findPackages:r,getBoardMpySpec:u,installPackage:A,installFromURL:H,_internals:{parseRepoUrl:k,resolveInstallTarget:N,targetKey:D,extractStdout:h,parseArchFromPlatform:d}}})(),(function(){const{ESPLoader:e,Transport:i}=window.esptoolJs;let a=null,c=null,f=null,h=null;function F(){return"serial"in navigator}function r(s){a=s}function d(s,l){a&&a.emit(s,l)}function u(s,l="info"){d("fw-log",{message:s,type:l})}function m(){return{clean(){},writeLine(s){if(!s||s.trim()==="")return;const l=s.replace(/\r?\n/g,"").trim();if(!l)return;let g="info";/error|fail/i.test(l)?g="error":/warning/i.test(l)?g="warn":/done|hash|leaving/i.test(l)&&(g="success"),u(l,g)},write(){}}}async function k(s=921600){if(!F())throw u(t("firmware.log.notSupported"),"error"),new Error("Web Serial not supported");try{u(t("firmware.log.selectingPort"),"info");const l=window.FIRMWARE_PORT_FILTERS||[];h=await navigator.serial.requestPort(l.length?{filters:l}:{}),c=new i(h,!1);const g=h.getInfo(),b={vendorId:g.usbVendorId?`0x${g.usbVendorId.toString(16).toUpperCase().padStart(4,"0")}`:"N/A",productId:g.usbProductId?`0x${g.usbProductId.toString(16).toUpperCase().padStart(4,"0")}`:"N/A"};d("fw-state",{portInfo:b}),u(t("firmware.log.initializingEsptool"),"info"),f=new e({transport:c,baudrate:parseInt(s),terminal:m()});const $=await f.main();return d("fw-state",{isConnected:!0,chipName:$}),u(t("firmware.log.connected",{chip:$,baud:s}),"success"),$}catch(l){throw l&&l.name==="NotFoundError"?u(t("firmware.log.portCancelled"),"warn"):(u(t("firmware.log.connectFailed",{err:l&&l.message?l.message:String(l)}),"error"),u(t("firmware.log.bootResetHint"),"warn")),l}}async function v(){try{c&&await c.disconnect()}catch(s){u(t("firmware.log.disconnectFailed",{err:s&&s.message?s.message:String(s)}),"error")}finally{c=null,f=null,h=null,d("fw-state",{isConnected:!1,chipName:null,portInfo:null,uploadProgress:0,uploadStatus:"idle"}),u(t("firmware.log.disconnected"),"info")}}async function y(s,l={}){if(!f)return u(t("firmware.log.connectFirst"),"error"),!1;const{eraseAll:g=!1}=l;d("fw-state",{isUploading:!0,uploadStatus:"uploading",uploadProgress:0});try{u("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","info"),u(t("firmware.log.flashStart"),"info"),u(t("firmware.log.flashMode",{value:window.FirmwareConfig.FLASH_MODE}),"info"),u(t("firmware.log.flashFreq",{value:window.FirmwareConfig.FLASH_FREQ}),"info"),u(t("firmware.log.flashSize",{value:window.FirmwareConfig.FLASH_SIZE}),"info"),u(t("firmware.log.fileCount",{n:s.length}),"info");for(const R of s)u(`  0x${R.address.toString(16).padStart(5,"0")} \u2192 ${R.label} (${n(R.data.length)})`,"info");u("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","info");const b=s.map(R=>({data:o(R.data),address:R.address})),$=s.reduce((R,B)=>R+B.data.length,0),_=s.map(R=>R.data.length);return await f.writeFlash({fileArray:b,flashMode:window.FirmwareConfig.FLASH_MODE,flashFreq:window.FirmwareConfig.FLASH_FREQ,flashSize:window.FirmwareConfig.FLASH_SIZE,eraseAll:g,compress:!0,reportProgress:(R,B,C)=>{const N=_.slice(0,R).reduce((I,A)=>I+A,0),D=Math.round((N+B)/$*100);d("fw-state",{uploadProgress:D})}}),u("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","success"),u(t("firmware.log.flashDone"),"success"),u("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550","success"),u(t("firmware.log.boardReset"),"info"),await f.after(),u(t("firmware.log.resetDone"),"success"),d("fw-state",{uploadProgress:100,uploadStatus:"success",isUploading:!1}),!0}catch(b){return u(t("firmware.log.flashFailed",{err:b&&b.message?b.message:String(b)}),"error"),u(t("firmware.log.bootResetRetryHint"),"warn"),d("fw-state",{uploadStatus:"error",isUploading:!1}),!1}}function n(s){if(s===0)return"0 B";const l=["B","KB","MB","GB"],g=Math.floor(Math.log(s)/Math.log(1024));return(s/Math.pow(1024,g)).toFixed(2)+" "+l[g]}function o(s){let g="";for(let b=0;b<s.length;b+=8192){const $=s.subarray(b,Math.min(b+8192,s.length));g+=String.fromCharCode.apply(null,$)}return g}window.FirmwareTool={isSupported:F,setEmitter:r,connect:k,disconnect:v,flashFirmware:y}})(),(function(){function e(){return typeof navigator!="undefined"&&"serial"in navigator&&typeof window.showDirectoryPicker=="function"}function i(){const f=navigator.userAgentData&&navigator.userAgentData.brands&&navigator.userAgentData.brands.map(h=>h.brand).join(", ")||navigator.userAgent||"";return html`
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
          <p class="app-unsupported-ua">Detected: ${f}</p>
        </div>
      </div>
    `}let a=!1;function c(){if(a)return;a=!0;const f=`
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
    `,h=document.createElement("style");h.textContent=f,document.head.appendChild(h)}window.UnsupportedBrowser={isSupported:e,render:()=>(c(),i())}})();const log=console.log,serialBridge=window.BridgeSerial,disk=window.BridgeDisk,win=window.BridgeWindow,shortcuts=window.BridgeWindow.getShortcuts();let notyf=null;const newFileContent=`# This program was created in Arduino Lab for MicroPython

print('Hello, MicroPython!')
`;async function sleep(e){return new Promise(i=>setTimeout(i,e))}async function confirmDialog(e,i,a,c){let f=[];a&&f.push(a),i&&f.push(i);let h=await win.openDialog({type:"question",title:c||"",buttons:f,defaultId:0,cancelId:1,message:e});return Promise.resolve(h)}async function store(e,i){win.setWindowSize(720,640),notyf||(notyf=new window.Notyf({duration:2e3,position:{x:"center",y:"top"},dismissible:!0,ripple:!0})),e.platform=window.BridgeWindow.getOS(),e.view="editor",e.diskNavigationPath="/",e.diskNavigationRoot=getDiskNavigationRootFromStorage(),e.diskFiles=[],e.boardNavigationPath="/",e.boardNavigationRoot="/",e.boardFiles=[],e.openFiles=[],e.selectedFiles=[],e.newTabFileName=null,e.editingFile=null,e.creatingFile=null,e.renamingFile=null,e.creatingFolder=null,e.renamingTab=null,e.isSidebarOpen=!0,e.isRightSidebarOpen=!1,e.isFullscreen=!1,e.language=window.i18n.getLanguage(),e.isConnecting=!1,e.isConnected=!1,e.connectedPort=null,e.isNewFileDialogOpen=!1,e.isFirmwareUploaderOpen=!1,e.fw={isConnected:!1,chipName:null,portInfo:null,baudRate:window.FirmwareConfig?window.FirmwareConfig.DEFAULT_SETTINGS.baudRate:921600,activeTab:"micropython",selectedVersion:null,isUploading:!1,uploadStatus:"idle",uploadProgress:0,logs:[]},window.FirmwareTool&&window.FirmwareTool.setEmitter&&window.FirmwareTool.setEmitter(i),e.isInstallPackageDialogOpen=!1,e.isInstallingPackage=!1,e.installPackageProgress="",e.installPackageError=null,e.packageList=[],e.packageSearchQuery="",e.packageSearchResults=[],e.selectedPackage=null,e.packageOverwrite=!0,e.installAsMpy=!0,e.boardMpyFormat=null,e.boardMpyArch=null,e.isSaving=!1,e.savingProgress=0,e.isTransferring=!1,e.transferringProgress="",e.isRemoving=!1,e.isLoadingFiles=!1,e.dialogs=[],e.isTerminalBound=!1,e.shortcutsDisabled=!1,await y("disk"),e.savedPanelHeight=PANEL_DEFAULT,e.panelHeight=PANEL_DEFAULT,e.isResizingPanel=!1,e.resizePanel=function(n){e.panelHeight=PANEL_CLOSED/2+document.body.clientHeight-n.clientY,e.panelHeight<=PANEL_CLOSED?e.savedPanelHeight=PANEL_DEFAULT:e.savedPanelHeight=e.panelHeight,i.emit("render")};const a=()=>{window.BridgeWindow.updateMenuState({isConnected:e.isConnected,view:e.view})};async function c(){if(e.diskNavigationRoot)return e.diskNavigationRoot;const n=await selectDiskFolder();return n?(saveDiskNavigationRootToStorage(n),e.diskNavigationRoot=n,e.diskNavigationPath="/",n):null}i.on("select-disk-navigation-root",async()=>{await c()&&i.emit("refresh-files"),i.emit("render")}),i.on("toggle-sidebar",()=>{e.isSidebarOpen=!e.isSidebarOpen,i.emit("render")}),i.on("toggle-right-sidebar",()=>{e.isRightSidebarOpen=!e.isRightSidebarOpen,e.isSidebarOpen=!0,i.emit("render")}),i.on("set-language",n=>{window.i18n.setLanguage(n),e.language=window.i18n.getLanguage(),i.emit("render")}),i.on("toggle-fullscreen",async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch(n){console.error("fullscreen toggle failed",n)}}),document.addEventListener("fullscreenchange",()=>{e.isFullscreen=!!document.fullscreenElement,i.emit("render")}),i.on("change-view",async n=>{e.view!==n&&(e.selectedFiles=[],n==="file-manager"&&(i.emit("stop"),await sleep(250),i.emit("refresh-files")),e.view=n,i.emit("render"),a())}),i.on("launch-app",async(n,o)=>{window.launchApp(n,o)}),i.on("open-install-package-dialog",async()=>{if(!e.isConnected){i.emit("connect");return}e.isInstallPackageDialogOpen=!0,e.installPackageError=null,e.installPackageProgress="",i.emit("render");try{const n=await window.PackageInstaller.getBoardMpySpec();e.boardMpyFormat=n.format,e.boardMpyArch=n.arch}catch(n){e.boardMpyFormat=null,e.boardMpyArch=null}if(e.packageList.length===0)try{const n=await window.PackageInstaller.getPackageList();e.packageList=n,e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,n)}catch(n){e.installPackageError=t("toast.packageRegistryFailed",{err:n.message})}else e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList);i.emit("render")}),i.on("close-install-package-dialog",()=>{e.isInstallingPackage||(e.isInstallPackageDialogOpen=!1,i.emit("render"))}),i.on("search-packages",n=>{e.packageSearchQuery=n||"",e.packageSearchResults=window.PackageInstaller.findPackages(e.packageSearchQuery,e.packageList),i.emit("render")}),i.on("select-package-to-install",n=>{e.selectedPackage=n,i.emit("render")}),i.on("toggle-install-overwrite",n=>{e.packageOverwrite=!!n,i.emit("render")});async function f(n){e.isInstallingPackage=!0,e.installPackageError=null,e.installPackageProgress=t("dialog.install.resolving"),i.emit("render");try{await window.PackageInstaller.installPackage(n,{overwrite:e.packageOverwrite,installAsMpy:!0,mpySpec:{format:e.boardMpyFormat,arch:e.boardMpyArch},onProgress:o=>{e.installPackageProgress=o&&o.message?o.message:"",i.emit("render")}}),e.installPackageProgress=t("dialog.install.installed"),i.emit("refresh-files")}catch(o){e.installPackageError=o.message||String(o)}finally{e.isInstallingPackage=!1,i.emit("render")}}i.on("install-package",async n=>{e.isInstallingPackage||!n||await f(n)}),i.on("select-port",async n=>{log("connect",n);const o=n.path;e.isConnecting=!0,i.emit("render");let s=setTimeout(()=>{let g=win.openDialog({type:"error",title:t("dialog.connectFailed.title"),buttons:[t("dialog.ok")],cancelId:0,message:t("dialog.connectFailed.msg")});i.emit("connection-timeout")},3500);try{await serialBridge.connect(o)}catch(g){console.error(g)}await serialBridge.getPrompt(),clearTimeout(s),e.isConnecting=!1,e.isConnected=!0,e.boardNavigationPath=await getBoardNavigationPath(),a(),e.view==="editor"&&e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),e.connectedPort=o;let l=e.cache(XTerm,"terminal").term;e.isTerminalBound||(e.isTerminalBound=!0,l.onData(g=>{serialBridge.eval(g),l.scrollToBottom()}),serialBridge.eval("")),serialBridge.onData(g=>{l.write(g),l.scrollToBottom()}),serialBridge.onConnectionClosed(()=>i.emit("disconnected")),i.emit("refresh-files"),i.emit("render")}),i.on("disconnected",()=>{e.isConnected=!1,e.panelHeight=PANEL_CLOSED,e.boardFiles=[],e.boardNavigationPath="/",e.boardMpyFormat=null,e.boardMpyArch=null,e.isInstallPackageDialogOpen=!1,notyf.error({message:t("toast.boardDisconnected"),className:"toast-board-disconnected"}),i.emit("refresh-files"),i.emit("render"),a()}),i.on("disconnect",async()=>{if(e.isFirmwareUploaderOpen){await window.FirmwareTool.disconnect();return}await serialBridge.disconnect()}),i.on("connection-timeout",async()=>{e.isConnected=!1,e.isConnecting=!1,i.emit("render")}),i.on("connect",async()=>{if(e.isFirmwareUploaderOpen){try{await window.FirmwareTool.connect(e.fw.baudRate)}catch(o){}return}let n;try{n=await serialBridge.requestPort()}catch(o){console.error("connect: requestPort failed",o);return}n&&i.emit("select-port",n)}),i.on("toggle-firmware-uploader",async()=>{const n=!e.isFirmwareUploaderOpen;e.isConnected&&(await serialBridge.disconnect(),e.isConnected=!1),e.fw.isConnected&&await window.FirmwareTool.disconnect(),e.fw.uploadStatus="idle",e.fw.uploadProgress=0,e.isFirmwareUploaderOpen=n,i.emit("render")}),i.on("close-firmware-uploader",async()=>{e.isConnected&&(await serialBridge.disconnect(),e.isConnected=!1),e.fw.isConnected&&await window.FirmwareTool.disconnect(),e.fw.uploadStatus="idle",e.fw.uploadProgress=0,e.isFirmwareUploaderOpen=!1,i.emit("render")}),i.on("fw-set-baud",n=>{e.fw.baudRate=parseInt(n,10)||e.fw.baudRate,i.emit("render")}),i.on("fw-set-tab",n=>{e.fw.activeTab=n,e.fw.selectedVersion=null,e.fw.uploadStatus="idle",i.emit("render")}),i.on("fw-select-version",n=>{e.fw.selectedVersion=n,e.fw.uploadStatus="idle",i.emit("render")}),i.on("fw-clear-logs",()=>{e.fw.logs=[],i.emit("render")}),i.on("fw-state",n=>{const o=e.fw.uploadStatus==="success";Object.assign(e.fw,n),!o&&e.fw.uploadStatus==="success"&&notyf&&notyf.success(t("firmware.upload.success")),i.emit("render")}),i.on("fw-log",n=>{const o=window.i18n&&window.i18n.getLanguage()==="ko"?"ko-KR":"en-US",s=new Date().toLocaleTimeString(o,{hour12:!1});e.fw.logs.push({timestamp:s,message:n.message,type:n.type||"info"}),i.emit("render")}),i.on("fw-upload",async()=>{const n=window.FirmwareConfig,o=e.fw.selectedVersion;if(!o){i.emit("fw-log",{type:"warn",message:t("firmware.log.selectFw")});return}const s=n.FIRMWARE_VERSIONS.find(l=>l.id===o);if(!s){i.emit("fw-log",{type:"error",message:t("firmware.log.fwNotFound")});return}try{const l=n.getFlashMap(s);i.emit("fw-log",{type:"info",message:t("firmware.log.loadingFw",{version:s.version})});const g=[];for(const b of l){i.emit("fw-log",{type:"info",message:t("firmware.log.downloading",{path:b.path})});const $=await fetch(b.path);if(!$.ok)throw new Error(t("firmware.log.loadFailed",{path:b.path,status:$.status}));const _=new Uint8Array(await $.arrayBuffer());g.push({data:_,address:b.address,label:b.label}),i.emit("fw-log",{type:"success",message:t("firmware.log.loadedEntry",{label:b.label,bytes:_.length})})}i.emit("fw-log",{type:"success",message:t("firmware.log.allLoaded",{n:g.length})}),await window.FirmwareTool.flashFirmware(g)}catch(l){i.emit("fw-log",{type:"error",message:t("firmware.log.loadError",{err:l.message})}),i.emit("fw-state",{uploadStatus:"error"})}}),i.on("run-from-button",(n=!1)=>{n?m():u()}),i.on("run",async(n=!1)=>{log("run");const o=e.openFiles.find(b=>b.id==e.editingFile);let s=o.editor.editor.state.doc.toString();const l=o.editor.editor.state.selection.ranges[0].from,g=o.editor.editor.state.selection.ranges[0].to;g-l>0&&n&&(selectedCode=o.editor.editor.state.doc.toString().substring(l,g),selectedCode.trim().length>0&&(s=selectedCode)),i.emit("open-panel"),el=document.querySelector(".xterm-helper-textarea"),el&&el.focus(),i.emit("render");try{await serialBridge.getPrompt(),await serialBridge.run(s)}catch(b){log("error",b)}el=document.querySelector(".cm-content"),el&&el.focus(),i.emit("render")}),i.on("stop",async()=>{log("stop"),e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),e.isConnected&&await serialBridge.getPrompt()}),i.on("reset",async()=>{log("reset"),e.panelHeight<=PANEL_CLOSED&&(e.panelHeight=e.savedPanelHeight),i.emit("open-panel"),i.emit("render"),await serialBridge.reset(),i.emit("update-files"),i.emit("render")}),i.on("open-panel",()=>{i.emit("stop-resizing-panel"),e.panelHeight=e.savedPanelHeight,i.emit("render"),setTimeout(()=>{e.cache(XTerm,"terminal").resizeTerm()},550)}),i.on("close-panel",()=>{i.emit("stop-resizing-panel"),e.savedPanelHeight=e.panelHeight,e.panelHeight=0,i.emit("render")}),i.on("clear-terminal",()=>{e.cache(XTerm,"terminal").term.clear()}),i.on("start-resizing-panel",()=>{log("start-resizing-panel"),e.isResizingPanel=!0,i.emit("render"),window.addEventListener("mousemove",e.resizePanel),document.body.addEventListener("mouseleave",()=>{i.emit("stop-resizing-panel")},{once:!0}),document.querySelector("#tabs").addEventListener("mouseenter",()=>{i.emit("stop-resizing-panel")},{once:!0})}),i.on("stop-resizing-panel",()=>{log("stop-resizing-panel"),e.isResizingPanel=!1,window.removeEventListener("mousemove",e.resizePanel),i.emit("render")}),i.on("create-new-file",()=>{log("create-new-file"),h(),e.isNewFileDialogOpen=!0,i.emit("render"),document.addEventListener("keydown",h)}),i.on("close-new-file-dialog",()=>{e.isNewFileDialogOpen=!1,h(),i.emit("render")}),i.on("save",async()=>{if(log("save"),canSave({view:e.view,isConnected:e.isConnected,openFiles:e.openFiles,editingFile:e.editingFile})==!1){log("can't save");return}let o=e.openFiles.find(_=>_.id===e.editingFile);if(o.source==="disk"&&!e.diskNavigationRoot&&!await c()){i.emit("render");return}let s=!1;const l=o.parentFolder,g=l===null;g&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let b=!1;if(o.source=="board"?(await serialBridge.getPrompt(),b=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(b=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),(g||!b)&&(o.source=="board"?(o.parentFolder=e.boardNavigationPath,await serialBridge.getPrompt(),s=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName))):o.source=="disk"&&(o.parentFolder=e.diskNavigationPath,s=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName)))),s&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){o.parentFolder=l,i.emit("render");return}e.isSaving=!0,i.emit("render");const $=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),$,_=>{e.savingProgress=_,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),$)}catch(_){log("error",_)}o.hasChanges=!1,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("select-tab",n=>{log("select-tab",n),e.editingFile=n,i.emit("render")}),i.on("close-tab",async n=>{if(log("close-tab",n),e.openFiles.find(s=>s.id===n).hasChanges&&!await confirmDialog(t("dialog.unsaved.msg"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;e.openFiles=e.openFiles.filter(s=>s.id!==n),e.openFiles.length>0?e.editingFile=e.openFiles[0].id:await y("disk"),i.emit("render")}),i.on("refresh-files",async()=>{if(log("refresh-files"),!e.isLoadingFiles){if(e.isLoadingFiles=!0,i.emit("render"),e.isConnected)try{e.boardFiles=await getBoardFiles(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""))}catch(n){e.boardFiles=[]}else e.boardFiles=[];if(e.diskNavigationRoot)try{e.diskFiles=await getDiskFiles(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""))}catch(n){e.diskNavigationRoot=null,e.diskNavigationPath="/",e.diskFiles=[]}else e.diskFiles=[];i.emit("refresh-selected-files"),e.isLoadingFiles=!1,i.emit("render")}}),i.on("refresh-selected-files",()=>{log("refresh-selected-files"),e.selectedFiles=e.selectedFiles.filter(n=>n.source==="board"?e.isConnected?e.boardFiles.find(o=>n.fileName===o.fileName):!1:e.diskFiles.find(o=>n.fileName===o.fileName)),i.emit("render")}),i.on("create-new-tab",async(n,o=null)=>{const s=n=="board"?e.boardNavigationPath:e.diskNavigationPath;log("create-new-tab",n,o,s),await y(n,o,s)&&(i.emit("close-new-file-dialog"),i.emit("render"))}),i.on("create-file",(n,o=null)=>{log("create-file",n),e.creatingFile===null&&(e.creatingFile=n,e.creatingFolder=null,o!=null&&i.emit("finish-creating-file",o),i.emit("render"))}),i.on("finish-creating-file",async n=>{if(log("finish-creating",n),!!e.creatingFile){if(!n){e.creatingFile=null,i.emit("render");return}if(e.creatingFile=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n),newFileContent)}else if(e.creatingFile=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})&&!await confirmDialog(t("dialog.overwrite.msgFileDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFile=null,i.emit("render");return}await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n),newFileContent)}setTimeout(()=>{e.creatingFile=null,h(),i.emit("refresh-files"),i.emit("render")},200)}}),i.on("create-folder",n=>{log("create-folder",n),e.creatingFolder===null&&(e.creatingFolder=n,e.creatingFile=null,i.emit("render"))}),i.on("finish-creating-folder",async n=>{if(log("finish-creating-folder",n),!!e.creatingFolder){if(!n){e.creatingFolder=null,i.emit("render");return}if(e.creatingFolder=="board"&&e.isConnected){if(await checkBoardFile({root:e.boardNavigationRoot,parentFolder:e.boardNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueBoard",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}await serialBridge.createFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}else if(e.creatingFolder=="disk"){if(await checkDiskFile({root:e.diskNavigationRoot,parentFolder:e.diskNavigationPath,fileName:n})){if(!await confirmDialog(t("dialog.overwrite.msgValueDisk",{name:n}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.creatingFolder=null,i.emit("render");return}await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}await disk.createFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}setTimeout(()=>{e.creatingFolder=null,i.emit("refresh-files"),i.emit("render")},200)}}),i.on("remove-files",async n=>{log("remove-files",n||"(all)");const o=n?e.selectedFiles.filter($=>$.source===n):e.selectedFiles;if(o.length===0)return;let s=o.filter($=>$.source==="board").map($=>$.fileName),l=o.filter($=>$.source==="disk").map($=>$.fileName),g=t("dialog.delete.header");if(s.length&&(g+=t("dialog.delete.fromBoard"),s.forEach($=>g+=`${$}
`),g+=`
`),l.length&&(g+=t("dialog.delete.fromDisk"),l.forEach($=>g+=`${$}
`),g+=`
`),g+=t("dialog.overwrite.proceed"),!!await confirmDialog(g,t("dialog.cancel"),t("dialog.yes"),t("dialog.delete.title"))){e.isRemoving=!0,i.emit("render");for(let $ in o){const _=o[$];_.type=="folder"?_.source==="board"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,_.fileName)):await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,_.fileName)):_.source==="board"?await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,_.fileName)):await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,_.fileName))}i.emit("refresh-files"),n?e.selectedFiles=e.selectedFiles.filter($=>$.source!==n):e.selectedFiles=[],e.isRemoving=!1,i.emit("render")}}),i.on("rename-file",(n,o)=>{log("rename-file",n,o),e.renamingFile=n,i.emit("render")}),i.on("finish-renaming-file",async n=>{log("finish-renaming-file",n);const o=e.selectedFiles[0];if(!n||o.fileName==n){e.renamingFile=null,i.emit("render");return}if(e.renamingFile=="board"&&e.isConnected){if((await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,""),source:"board"})).length>0){let l=t("dialog.overwrite.msgSingleBoardHeader");if(l+=`${n}

`,l+=t("dialog.overwrite.proceed"),!await confirmDialog(l,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await removeBoardFolder(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):o.type=="file"&&await serialBridge.removeFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n))}}else if(e.renamingFile=="disk"&&(await checkOverwrite({fileNames:[n],parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,""),source:"disk"})).length>0){let l=t("dialog.overwrite.msgSingleDiskHeader");if(l+=`${n}

`,l+=t("dialog.overwrite.proceed"),!await confirmDialog(l,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingFile=null,i.emit("render");return}o.type=="folder"?await disk.removeFolder(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n)):o.type=="file"&&await disk.removeFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n))}e.isSaving=!0,i.emit("render");try{e.renamingFile=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,o.fileName),serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,n)):await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,o.fileName),disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,n));const s=e.openFiles.findIndex(l=>l.fileName===o.fileName&&l.source===o.source&&l.parentFolder===o.parentFolder);s>-1&&(e.openFiles[s].fileName=n,i.emit("render"))}catch(s){alert(`The file ${o.fileName} could not be renamed to ${n}`)}e.isSaving=!1,e.renamingFile=null,i.emit("refresh-files"),i.emit("render")}),i.on("rename-tab",n=>{log("rename-tab",n),e.renamingTab=n,i.emit("render")}),i.on("finish-renaming-tab",async n=>{log("finish-renaming-tab",n);const o=e.openFiles.find(_=>_.id===e.renamingTab);if(!n||o.fileName==n){e.renamingTab=null,e.isSaving=!1,i.emit("render");return}const s=o.parentFolder,l=o.fileName;o.fileName=n;const g=s===null;let b=!1;g||(o.source=="board"?b=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,l)):o.source=="disk"&&(b=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,l)))),(g||!b)&&(o.source=="board"?o.parentFolder=e.boardNavigationPath:o.source=="disk"&&(o.parentFolder=e.diskNavigationPath));let $=!1;if(o.source=="board"?$=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&($=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))),$&&!await confirmDialog(t("dialog.overwrite.msgFile",{name:o.fileName,source:o.source}),t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title"))){e.renamingTab=null,o.fileName=l,i.emit("render");return}if(e.isSaving=!0,i.emit("render"),b){if(o.hasChanges){const _=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,l),_,R=>{e.savingProgress=R,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,l),_)}catch(R){log("error",R)}}try{o.source=="board"?await serialBridge.renameFile(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,l),serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName)):o.source=="disk"&&await disk.renameFile(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,l),disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName))}catch(_){log("error",_)}}else if(!b){const _=o.editor.editor.state.doc.toString();try{o.source=="board"?(await serialBridge.getPrompt(),await serialBridge.saveFileContent(serialBridge.getFullPath(e.boardNavigationRoot,o.parentFolder,o.fileName),_,R=>{e.savingProgress=R,i.emit("render")})):o.source=="disk"&&await disk.saveFileContent(disk.getFullPath(e.diskNavigationRoot,o.parentFolder,o.fileName),_)}catch(R){log("error",R)}}o.hasChanges=!1,e.renamingTab=null,e.isSaving=!1,e.savingProgress=0,i.emit("refresh-files"),i.emit("render")}),i.on("toggle-file-selection",(n,o,s)=>{log("toggle-file-selection",n,o,s);let l=o=="board"?e.boardNavigationPath:e.diskNavigationPath;if(s&&!s.ctrlKey&&!s.metaKey){e.selectedFiles=[{fileName:n.fileName,type:n.type,source:o,parentFolder:l}],i.emit("render");return}e.selectedFiles.find(b=>b.fileName===n.fileName&&b.source===o)?e.selectedFiles=e.selectedFiles.filter(b=>!(b.fileName===n.fileName&&b.source===o)):e.selectedFiles.push({fileName:n.fileName,type:n.type,source:o,parentFolder:l}),i.emit("render")}),i.on("open-selected-files",async()=>{log("open-selected-files");let n=[],o=[];if(!e.isLoadingFiles){e.isLoadingFiles=!0,i.emit("render");for(let s in e.selectedFiles){let l=e.selectedFiles[s];if(l.type=="folder")continue;const g=e.openFiles.find(b=>b.fileName==l.fileName&&b.source==l.source&&b.parentFolder==l.parentFolder);if(g)o.push(g);else{let b=null;if(l.source=="board"){const $=await serialBridge.loadFile(serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,l.fileName)),_=new Uint8Array($),R=new TextDecoder("utf-8").decode(_);b=v({parentFolder:e.boardNavigationPath,fileName:l.fileName,source:l.source,content:R}),b.editor.onChange=function(){b.hasChanges=!0,i.emit("render")}}else if(l.source=="disk"){const $=await disk.loadFile(disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,l.fileName));b=v({parentFolder:e.diskNavigationPath,fileName:l.fileName,source:l.source,content:$}),b.editor.onChange=function(){b.hasChanges=!0,i.emit("render")}}n.push(b)}}o.length>0&&(e.editingFile=o[0].id),n.length>0&&(e.editingFile=n[0].id),e.openFiles=e.openFiles.concat(n),e.selectedFiles=[],e.view="editor",a(),e.isLoadingFiles=!1,i.emit("render")}}),i.on("open-file",(n,o)=>{log("open-file",n,o),e.selectedFiles=[{fileName:o.fileName,type:o.type,source:n,parentFolder:e[`${n}NavigationPath`]}],i.emit("open-selected-files")}),i.on("upload-files",async()=>{log("upload-files");const n=await checkOverwrite({source:"board",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyBoardHeader");if(n.forEach(l=>o+=`${l.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const s=e.selectedFiles[o],l=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,s.fileName),g=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,s.fileName);s.type=="folder"?(await uploadFolder(l,g,(b,$)=>{e.transferringProgress=`${$}: ${b}`,i.emit("render")}),e.transferringProgress=""):(await serialBridge.uploadFile(l,g,b=>{e.transferringProgress=`${s.fileName}: ${b}`,i.emit("render")}),e.transferringProgress="")}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("download-files",async()=>{log("download-files");const n=await checkOverwrite({source:"disk",fileNames:e.selectedFiles.map(o=>o.fileName),parentPath:disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,"")});if(n.length>0){let o=t("dialog.overwrite.msgManyDiskHeader");if(n.forEach(l=>o+=`${l.fileName}
`),o+=`
`,o+=t("dialog.overwrite.proceed"),!await confirmDialog(o,t("dialog.cancel"),t("dialog.yes"),t("dialog.overwrite.title")))return}e.isTransferring=!0,i.emit("render");for(let o in e.selectedFiles){const s=e.selectedFiles[o],l=serialBridge.getFullPath(e.boardNavigationRoot,e.boardNavigationPath,s.fileName),g=disk.getFullPath(e.diskNavigationRoot,e.diskNavigationPath,s.fileName);s.type=="folder"?await downloadFolder(l,g,b=>{e.transferringProgress=b,i.emit("render")}):await serialBridge.downloadFile(l,g,b=>{e.transferringProgress=b,i.emit("render")})}e.isTransferring=!1,e.selectedFiles=[],i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-folder",n=>{log("navigate-board-folder",n),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-board-parent",()=>{log("navigate-board-parent"),e.boardNavigationPath=serialBridge.getNavigationPath(e.boardNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-folder",n=>{log("navigate-disk-folder",n),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,n),i.emit("refresh-files"),i.emit("render")}),i.on("navigate-disk-parent",()=>{log("navigate-disk-parent"),e.diskNavigationPath=disk.getNavigationPath(e.diskNavigationPath,".."),i.emit("refresh-files"),i.emit("render")}),win.beforeClose(async()=>{if(!!e.openFiles.find(o=>o.hasChanges)&&!await confirmDialog(t("dialog.unsaved.msgMayHave"),t("dialog.cancel"),t("dialog.yes"),t("dialog.unsaved.title")))return!1;await win.confirmClose()}),win.onDisableShortcuts(n=>{e.shortcutsDisabled=n}),win.onKeyboardShortcut(n=>{if(!(e.isTransferring||e.isRemoving||e.isSaving||e.isNewFileDialogOpen)&&!e.shortcutsDisabled){if(n===shortcuts.CLOSE&&i.emit("close-tab",e.editingFile),n===shortcuts.CONNECT&&i.emit("connect"),n===shortcuts.DISCONNECT&&i.emit("disconnect"),n===shortcuts.RESET){if(e.view!="editor")return;i.emit("reset")}if(n===shortcuts.CLEAR_TERMINAL){if(e.view!="editor")return;i.emit("clear-terminal")}if(n===shortcuts.RUN){if(e.view!="editor")return;u()}if(n===shortcuts.RUN_SELECTION||n===shortcuts.RUN_SELECTION_WL){if(e.view!="editor")return;m()}if(n===shortcuts.STOP){if(e.view!="editor")return;k()}if(n===shortcuts.NEW){if(e.view!="editor")return;i.emit("create-new-file")}if(n===shortcuts.SAVE){if(e.view!="editor")return;i.emit("save")}if(n===shortcuts.EDITOR_VIEW){if(e.view!="file-manager")return;i.emit("change-view","editor")}if(n===shortcuts.FILES_VIEW){if(e.view!="editor")return;i.emit("change-view","file-manager")}}});function h(n=null){n&&n.key!="Escape"||(document.removeEventListener("keydown",h),e.isNewFileDialogOpen=!1,i.emit("render"))}let F=!1;function r(){F=!0,setTimeout(()=>{F=!1},500)}function d(n=!1){F||(i.emit("run",n),r())}function u(){canExecute({view:e.view,isConnected:e.isConnected})&&d()}function m(){canExecute({view:e.view,isConnected:e.isConnected})&&d(!0)}function k(){canExecute({view:e.view,isConnected:e.isConnected})&&i.emit("stop")}function v(n){const{source:o,parentFolder:s,fileName:l,content:g=newFileContent,hasChanges:b=!1}=n,$=generateHash(),_=e.cache(CodeMirrorEditor,`editor_${$}`);return _.content=g,{id:$,source:o,parentFolder:s,fileName:l,editor:_,hasChanges:b}}async function y(n,o=null,s=null){const l=n=="board"?e.boardNavigationPath:e.diskNavigationPath,g=v({fileName:o===null?generateFileName():o,parentFolder:s,source:n,hasChanges:!0});let b=!1;if(s!=null&&(n=="board"?(await serialBridge.getPrompt(),b=await serialBridge.fileExists(serialBridge.getFullPath(e.boardNavigationRoot,g.parentFolder,g.fileName))):n=="disk"&&(b=await disk.fileExists(disk.getFullPath(e.diskNavigationRoot,g.parentFolder,g.fileName)))),e.openFiles.find(_=>_.parentFolder===g.parentFolder&&_.fileName===g.fileName&&_.source===g.source)||b){const _=await confirmDialog(t("dialog.fileExists.msg",{name:g.fileName,source:n}),t("dialog.ok"),void 0,t("dialog.fileExists.title"));return!1}return g.editor.onChange=function(){g.hasChanges=!0,i.emit("render")},e.openFiles.push(g),e.editingFile=g.id,!0}}function getDiskNavigationRootFromStorage(){let e=localStorage.getItem("diskNavigationRoot");return(!e||e=="null")&&(e=null),e}function saveDiskNavigationRootToStorage(e){try{return localStorage.setItem("diskNavigationRoot",e),!0}catch(i){return log("saveDiskNavigationRootToStorage",i),!1}}async function selectDiskFolder(){let{folder:e,files:i}=await disk.openFolder();return e!==null&&e!="null"?e:null}async function getDiskFiles(e){let i=await disk.ilistFiles(e);return i=i.map(a=>({fileName:a.path,type:a.type})),i=i.sort(sortFilesAlphabetically),i}function sortFilesAlphabetically(e,i){return e.fileName.localeCompare(i.fileName)}function generateHash(){return`${Date.now()}_${parseInt(Math.random()*1024)}`}async function getBoardNavigationPath(){let e=await serialBridge.execFile(await getHelperFullPath());e=await serialBridge.run("iget_root()");let i="";try{e=e.substring(e.indexOf("OK")+2,e.indexOf("")),i=e}catch(a){log("error",e)}return i}async function getBoardFiles(e){await serialBridge.getPrompt();let i=await serialBridge.ilistFiles(e);return i=i.map(a=>({fileName:a[0],type:a[1]===16384?"folder":"file"})),i=i.sort(sortFilesAlphabetically),i}function checkDiskFile({root:e,parentFolder:i,fileName:a}){return e==null||i==null||a==null?!1:disk.fileExists(disk.getFullPath(e,i,a))}async function checkBoardFile({root:e,parentFolder:i,fileName:a}){return e==null||i==null||a==null?!1:(await serialBridge.getPrompt(),serialBridge.fileExists(serialBridge.getFullPath(e,i,a)))}async function checkOverwrite({fileNames:e=[],parentPath:i,source:a}){let c=[];return a==="board"?c=await getBoardFiles(i):c=await getDiskFiles(i),c.filter(f=>e.indexOf(f.fileName)!==-1)}function generateFileName(e){return e?`${e.split(".py")[0]}_${Date.now()}.py`:`${pickRandom(adjectives)}_${pickRandom(nouns)}.py`}function pickRandom(e){return e[parseInt(Math.random()*e.length)]}function canSave({view:e,isConnected:i,openFiles:a,editingFile:c}){const f=e==="editor",h=a.find(F=>F.id===c);return!h.hasChanges||!f?!1:h.source==="disk"?!0:i}function canExecute({view:e,isConnected:i}){return e==="editor"&&i}function canDownload({isConnected:e,selectedFiles:i}){const a=i.filter(c=>c.source==="disk");return e&&i.length>0&&a.length===0}function canUpload({isConnected:e,selectedFiles:i}){const a=i.filter(c=>c.source==="board");return e&&i.length>0&&a.length===0}function canEdit({selectedFiles:e}){return e.filter(a=>a.type=="file").length!=0}async function removeBoardFolder(e){let i=await serialBridge.execFile(await getHelperFullPath());await serialBridge.run(`delete_folder('${e}')`)}async function uploadFolder(e,i,a){a=a||function(){},await serialBridge.createFolder(i);let c=await disk.ilistAllFiles(e);for(let f in c){const h=c[f],F=h.path.substring(e.length);h.type==="folder"?await serialBridge.createFolder(serialBridge.getFullPath(i,F,"")):await serialBridge.uploadFile(disk.getFullPath(e,F,""),serialBridge.getFullPath(i,F,""),r=>{a(r,F)})}}async function downloadFolder(e,i,a){a=a||function(){},await disk.createFolder(i);let c=await serialBridge.execFile(await getHelperFullPath());c=await serialBridge.run(`ilist_all('${e}')`);let f=[];try{c=c.substring(c.indexOf("OK")+2,c.indexOf("")),f=JSON.parse(c)}catch(h){log("error",c)}for(let h in f){const F=f[h],r=F.path.substring(e.length);F.type=="folder"?await disk.createFolder(disk.getFullPath(i,r,"")):await serialBridge.downloadFile(serialBridge.getFullPath(e,r,""),serialBridge.getFullPath(i,r,""))}}async function getHelperFullPath(){const e=await disk.getAppPath();return await win.isPackaged()?disk.getFullPath(e,"..","ui/helpers.py"):disk.getFullPath(e,"ui/helpers.py","")}const PANEL_CLOSED=32,PANEL_TOO_SMALL=52,PANEL_DEFAULT=320;function App(e,i){return window.UnsupportedBrowser&&!window.UnsupportedBrowser.isSupported()?window.UnsupportedBrowser.render():html`
    <div id="app">
      <div class="app-shell">
        ${Toolbar(e,i)}
        <div class="app-main">
          ${FirmwareUploader(e,i)}
          ${Sidebar(e,i)}
          <div class="app-content">
            ${EditorView(e,i)}
          </div>
          ${RightSidebar(e,i)}
        </div>
        <footer class="app-footer"></footer>
      </div>
      ${NewFileDialog(e,i)}
      ${InstallPackageDialog(e,i)}
      ${Overlay(e,i)}
    </div>
  `}window.addEventListener("load",()=>{let e=Choo();e.use(store),e.route("*",App),e.mount("#app"),e.emitter.on("DOMContentLoaded",()=>{e.state.diskNavigationRoot&&e.emitter.emit("refresh-files")})}),window.addEventListener("contextmenu",e=>{e.preventDefault()}),window.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{const e=document.getElementById("splash");e&&(e.classList.add("splash-hidden"),setTimeout(()=>e.remove(),400))},2e3)});
