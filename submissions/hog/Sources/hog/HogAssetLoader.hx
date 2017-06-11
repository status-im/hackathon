package hog;

using StringTools;

class HogAssetLoader{

	public static var progress : Float;

	@:access(kha.Assets.BlobList)
	public static function loadEverything(callback : Void -> Void) : Void{
		var fileCount = 0;
		for (blob in Type.getInstanceFields(Type.getClass(kha.Assets.blobs))) {
			if (blob.endsWith("Load")) {
				++fileCount;
			}
		}
		for (image in Type.getInstanceFields(Type.getClass(kha.Assets.images))) {
			if (image.endsWith("Load")) {
				++fileCount;
			}
		}
		for (sound in Type.getInstanceFields(Type.getClass(kha.Assets.sounds))) {
			if (sound.endsWith("Load")) {
				++fileCount;
			}
		}
		for (font in Type.getInstanceFields(Type.getClass(kha.Assets.fonts))) {
			if (font.endsWith("Load")) {
				++fileCount;
			}
		}
		for (video in Type.getInstanceFields(Type.getClass(kha.Assets.videos))) {
			if (video.endsWith("Load")) {
				++fileCount;
			}
		}
		
		if (fileCount == 0) {
			callback();
			return;
		}

		var filesLeft = fileCount;
		
		for (blob in Type.getInstanceFields(Type.getClass(kha.Assets.blobs))) {
			if (blob.endsWith("Load")) {
				Reflect.field(kha.Assets.blobs, blob)(function () {
					//Report.anInfo("Blob Loaded : " + blob);
					--filesLeft;
					progress = 1 - filesLeft / fileCount;
					if (filesLeft == 0) callback();
				});
			}
		}
		for (image in Type.getInstanceFields(Type.getClass(kha.Assets.images))) {
			if (image.endsWith("Load")) {
				Reflect.field(kha.Assets.images, image)(function () {
					//Report.anInfo("Image Loaded : " + image);
					--filesLeft;
					progress = 1 - filesLeft / fileCount;
					if (filesLeft == 0) callback();
				});
			}
		}
		for (sound in Type.getInstanceFields(Type.getClass(kha.Assets.sounds))) {
			if (sound.endsWith("Load")) {
				Reflect.field(kha.Assets.sounds, sound)(function () {
					//Report.anInfo("Sound Loaded : " + sound);
					if(sound.indexOf("theme")== -1){
						var theSound: kha.Sound = Reflect.field(kha.Assets.sounds, sound.substring(0, sound.length - 4));
						theSound.uncompress(function () {
							//Report.anInfo("Sound uncompressed : " + sound);
							--filesLeft;
							progress = 1 - filesLeft / fileCount;
							if (filesLeft == 0) callback();	
						});
					}else{
						//Report.anInfo("Sound will be streamed : " + sound);
						--filesLeft;
						progress = 1 - filesLeft / fileCount;
						if (filesLeft == 0) callback();	
					}
				});
			}
		}
		for (font in Type.getInstanceFields(Type.getClass(kha.Assets.fonts))) {
			if (font.endsWith("Load")) {
				Reflect.field(kha.Assets.fonts, font)(function () {
					//Report.anInfo("font Loaded : " + font);
					--filesLeft;
					progress = 1 - filesLeft / fileCount;
					if (filesLeft == 0) callback();
				});
			}
		}
		for (video in Type.getInstanceFields(Type.getClass(kha.Assets.videos))) {
			if (video.endsWith("Load")) {
				Reflect.field(kha.Assets.videos, video)(function () {
					//Report.anInfo("Video Loaded : " + video);
					--filesLeft;
					progress = 1 - filesLeft / fileCount;
					if (filesLeft == 0) callback();
				});
			}
		}
	}
}