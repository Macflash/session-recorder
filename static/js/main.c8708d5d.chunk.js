(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,t,a){},16:function(e,t,a){},17:function(e,t,a){"use strict";a.r(t);var r=a(0),o=a.n(r),n=a(7),i=a.n(n),c=(a(15),a(1)),s=a(2),l=a(4),d=a(3),u=a(5),m=(a(16),a(8)),v=function(e,t,a){var r=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;return r?new Promise(function(t,a){r.call(navigator,e,t,a)}):Promise.reject(new Error("getUserMedia is not implemented in this browser"))},f=function(){void 0===navigator.mediaDevices&&(navigator.mediaDevices={}),void 0===navigator.mediaDevices.getUserMedia&&(navigator.mediaDevices.getUserMedia=v)},h=function(e){function t(){var e,a;Object(c.a)(this,t);for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return(a=Object(l.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).clipCanvas=null,a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidUpdate",value:function(){if(this.clipCanvas){var e=this.clipCanvas.getContext("2d"),t=this.clipCanvas.width,a=this.clipCanvas.height;e.fillStyle="rgb(255, 255, 255)",e.fillRect(0,0,t,a),e.lineWidth=2,e.strokeStyle="rgb(0, 0, 0)";for(var r=1*t/this.props.waveform.length,o=0,n=0,i=a/2,c=0;c<this.props.waveform.length;c++){var s=this.props.waveform[c]/128*a/2;this.props.waveform[c]>140||this.props.waveform[c]<100?e.strokeStyle="rgb(255, 0, 0)":e.strokeStyle="rgb(0, 0, 0)",e.beginPath(),e.moveTo(n,i),e.lineTo(o,s),e.stroke(),n=o,i=s,o+=r}}}},{key:"render",value:function(){var e=this;return o.a.createElement("canvas",{height:"50",ref:function(t){!e.clipCanvas&&t&&(e.clipCanvas=t,e.setState({clipCanvas:t}))},style:{flex:"auto"}})}}]),t}(r.Component),p=function(e){function t(){var e,a;Object(c.a)(this,t);for(var r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return(a=Object(l.a)(this,(e=Object(d.a)(t)).call.apply(e,[this].concat(o)))).clipCanvas=null,a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.props.clipInfo;return o.a.createElement("div",{style:{display:"flex",flexDirection:"row",height:"100px"}},o.a.createElement("div",{style:{flex:"none"}},e.trackNumber),o.a.createElement("div",{style:{flex:"auto",display:"flex",flexDirection:"column"}},o.a.createElement(h,{waveform:e.waveform}),o.a.createElement("audio",{controls:!0,src:e.audioUrl})),o.a.createElement("div",{style:{flex:"none",display:"flex",flexDirection:"column"}},o.a.createElement("div",{style:{flex:"none"}},e.name),o.a.createElement("div",{style:{flex:"none"}},o.a.createElement("button",null,"Edit"),o.a.createElement("button",null,"Delete"))))}}]),t}(r.Component),g=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(d.a)(t).call(this,e))).mediaRecorder=void 0,a.lastNoiseCounter=0,a.chunks=[],a.waveform=[],a.trackCount=1,a.record=function(){if(!a.mediaRecorder)throw"No recorder!";a.mediaRecorder.start(),a.setState({status:"recording"})},a.pause=function(){if(!a.mediaRecorder)throw"No recorder!";a.mediaRecorder.pause(),a.setState({status:"paused"})},a.resume=function(){if(!a.mediaRecorder)throw"No recorder!";a.mediaRecorder.resume(),a.setState({status:"recording"})},a.split=function(){if(!a.mediaRecorder)throw"No recorder!"},a.stop=function(){if(!a.mediaRecorder)throw"No recorder!";a.mediaRecorder.stop(),a.setState({status:"ready"})},f(),navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?(console.log("getUserMedia supported."),navigator.mediaDevices.getUserMedia({audio:!0}).then(function(e){var t=new AudioContext,r=t.createMediaStreamSource(e),o=t.createAnalyser();r.connect(o);var n=o.fftSize;console.log(n);var i=new Uint8Array(n),c=document.querySelector(".visualizer"),s=c.getContext("2d");!function e(){var t=c.width,r=c.height;requestAnimationFrame(e),o.getByteTimeDomainData(i),a.waveform=a.waveform.concat(Array.from(i));"recording"!=a.state.status&&a.waveform.length>75e3&&(a.waveform=a.waveform.slice(a.waveform.length-75e3));var n=1e14,l=-1e14;i.forEach(function(e){n=Math.min(e,n),l=Math.max(e,l)}),l>140||n<100?(a.lastNoiseCounter=0,"recording"!=a.state.status&&a.record()):(a.lastNoiseCounter++,a.lastNoiseCounter>15&&"recording"==a.state.status&&a.stop()),a.waveform.concat([n,l]),s.fillStyle="rgb(200, 200, 200)",s.fillRect(0,0,t,r),s.lineWidth=2,s.strokeStyle="rgb(0, 0, 0)";for(var d=1*t/a.waveform.length,u=0,m=0,v=r/2,f=0;f<a.waveform.length;f++){var h=a.waveform[f]/128*r/2;a.waveform[f]>140||a.waveform[f]<100?s.strokeStyle="rgb(255, 0, 0)":s.strokeStyle="rgb(0, 0, 0)",s.beginPath(),s.moveTo(m,v),s.lineTo(u,h),s.stroke(),m=u,v=h,u+=d}s.lineTo(c.width,c.height/2)}(),a.mediaRecorder=new MediaRecorder(e,{mimeType:"audio/webm",audioBitsPerSecond:32e4}),a.mediaRecorder.onstart=function(e){a.chunks=[],a.waveform=[]},a.mediaRecorder.ondataavailable=function(e){a.chunks.push(e.data)},a.mediaRecorder.onstop=function(e){var t=new Blob(a.chunks,{type:"audio/webm"});a.chunks=[];var r=window.URL.createObjectURL(t),o={audioUrl:r,name:"Track "+a.trackCount,waveform:a.waveform,trackNumber:a.trackCount};a.trackCount++,a.setState({clips:[].concat(Object(m.a)(a.state.clips),[o])}),a.waveform=[];var n=document.createElement("a");n.href=r,n.download="test.webm",document.body.appendChild(n)},a.setState({status:"ready"})}).catch(function(e){console.error("The following getUserMedia error occured: "+e)})):console.error("getUserMedia not supported on your browser!"),a.state={status:"initializing",clips:[]},a}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){var e=this.state,t=e.status,a=e.clips;return o.a.createElement("div",{style:{display:"flex",flexDirection:"column",height:"100%"}},o.a.createElement("div",{style:{overflow:"auto",flex:"auto",minHeight:"50%"}},a.map(function(e,t){return o.a.createElement(p,{key:t,clipInfo:e})})),o.a.createElement("div",{style:{flex:"none"}},o.a.createElement("canvas",{className:"visualizer",width:"300",height:"100"}),t,o.a.createElement("div",null,"ready"==t&&o.a.createElement("button",{onClick:this.record},"Record"),"recording"==t&&o.a.createElement("button",{onClick:this.pause},"Pause"),"recording"==t&&o.a.createElement("button",{onClick:this.stop},"Stop"),"paused"==t&&o.a.createElement("button",{onClick:this.resume},"Resume"))))}}]),t}(r.Component),w=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return o.a.createElement(g,null)}}]),t}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(w,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},9:function(e,t,a){e.exports=a(17)}},[[9,1,2]]]);
//# sourceMappingURL=main.c8708d5d.chunk.js.map