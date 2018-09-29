HaierJS = window.HaierJS || {};

// if(window.console == undefined) {
// 	window.console = {
// 		log: function(){}
// 	}
// }
(function(){
	var language = navigator.language || navigator.userLanguage;

	HaierJS.plupload = function(options){
		var initHolder = $.extend({}, options.init);
		delete options.init;

		var uploader = new plupload.Uploader($.extend({
			url : '/API/File/Upload',
			browse_button : 'pickfiles', // button id

			runtimes : 'html5,flash,silverlight,html4',
			flash_swf_url :  'https://cdn.jsdelivr.net/gh/tongjieme/public-assets@0ad9b6ea3c60a3c2ee6ff17f04038afcd5a30721js/vendor/plupload/Moxie.swf',
			silverlight_xap_url : 'https://cdn.jsdelivr.net/gh/tongjieme/public-assets@0ad9b6ea3c60a3c2ee6ff17f04038afcd5a30721js/vendor/plupload/Moxie.xap',
			multi_selection: true,// default
			
			filters : {
				max_file_size : '500kb',
				mime_types: [
					{title : "Image files", extensions : "jpg,gif,png"},
					{title : "Zip files", extensions : "zip"}
				],
				prevent_duplicates: false // default
			},

			// chunk_size: 0,

			init: (function(){
				return $.extend({}, initHolder, {
							BeforeUpload: function(up, file){
								// alert();
								if(typeof options.multipart_params == 'function') {
									up.setOption('multipart_params', options.multipart_params());
								}
								!!!(initHolder && initHolder.BeforeUpload) || initHolder.BeforeUpload(up, file);
							},
							FilesAdded: function(up, file){
								!!!initHolder.FilesAdded || initHolder.FilesAdded(up, file);
								if(options.autoUpload) {
									uploader.start()
								}
							},
							FileUploaded: function(up, files, response){
								var json = {};
								try {
								    json = $.parseJSON(response.response)
								}
								catch(err) {
								    
								} 
								finally {
									!!!initHolder.FileUploaded || initHolder.FileUploaded(up, files, response, json);    
								}
								
							},
							Error: function(up, err){
								// console.log(err.code);
								// console.log(err.message);
								if(err.code == -600) {
									err.message = "上传文件不能大于" + up.getOption().filters.max_file_size;
								}
								if(err.code == -601) {
									err.message = "该上传文件的格式是不允许的, 请重新选择文件上传 \n\n支持的文件格式有" + (function(){
										var s = '';

										var mime_types = up.getOption().filters.mime_types;

										$.each(mime_types, function(k,v){
											s += v.extensions + (k == 0 && mime_types.length > 1 ? ',' : '');
										});
										return s;
									})();
								}


								!!!(initHolder && initHolder.Error) || initHolder.Error(up, err);
							}
						})
			})()
		}, options));

		uploader.init();

		return uploader;
	};
})();

if(window.define) {
	define(function() {
		return HaierJS.plupload;
	});
}
