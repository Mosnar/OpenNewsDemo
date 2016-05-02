"use strict";function debounce(t,e,n){var o;return function(){var s=this,i=arguments,a=function(){o=null,n||t.apply(s,i)},r=n&&!o;clearTimeout(o),o=setTimeout(a,e),r&&t.apply(s,i)}}$(function(){function t(t){var e=!1;return $(s).each(function(n){var o=t.text().trim(),s=$(this).text().trim();return o==s?(e=!0,!1):void 0}),e}function e(t){c.prop("disabled",t),u.prop("disabled",t)}function n(){e(!1);var t=$(i).get(0),n=$(t);$(n).show(),$(n).addClass("current")}function o(n){var o=$(i).get(l),s=$(i).get(l+1),a=$(o),r=$(s);if(!o)return!1;var c="";t(a)?(c=n?"You and the algorithm disagree, ":"You and the algorithm agree, ",toastr.success(c+"it labels this is as objective!"),a.removeClass("current"),a.addClass("unbiased")):(c=n?"You and the algorithm agree, ":"You and the algorithm disagree, ",toastr.error(c+" it labels this as biased!"),a.removeClass("current"),a.addClass("biased")),l++,s?(r.show(),r.addClass("current")):e(!0)}toastr.options={closeButton:!1,debug:!1,newestOnTop:!1,progressBar:!0,positionClass:"toast-top-center",preventDuplicates:!1,onclick:null,showDuration:"300",hideDuration:"1000",timeOut:"3500",extendedTimeOut:"1000",showEasing:"swing",hideEasing:"linear",showMethod:"fadeIn",hideMethod:"fadeOut"};var s=$("[autoclass2=obj]"),i=($("[autoclass2=subj]"),$("MPQASENT")),a=io.connect("http://localhost:8000/quiz"),r=$("#status"),c=($("#log"),$("#btnBiased")),u=$("#btnUnbiased"),d=0,l=0;e(!0),a.on("connect",function(){n(),r.text("Connected")}),a.on("error",function(){r.text("Failed to connect")}),a.on("disconnect",function(){r.text("Connection dropped"),e(!0),d=0}),a.on("reconnect_attempt",function(){d++,r.text("Reattempting connection... "+d)});var h="biased";a.on("selection",debounce(function(t){t.type==h?(console.log("Got biased"),o(!0)):(console.log("Got unbiased"),o(!1))},1e3)),c.on("click",function(){a.emit("debug_press",{type:"biased"})}),u.on("click",function(){a.emit("debug_press",{type:"unbiased"})})});