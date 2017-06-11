
import sys.io.File;
import haxe.Cson;

///C:\Users\ronan\experiments\hog\test\node_modules\ethereumjs-account,C:\Users\ronan\experiments\hog\test\node_modules\ethereumjs-block,C:\Users\ronan\experiments\hog\test\node_modules\ethereumjs-testrpc,C:\Users\ronan\experiments\hog\test\node_modules\ethereumjs-tx,C:\Users\ronan\experiments\hog\test\node_modules\ethereumjs-util,C:\Users\ronan\experiments\hog\test\node_modules\ethereumjs-wallet,C:\Users\ronan\experiments\hog\test\node_modules\ethereumjs-vm
class HogTest{
	public static function main(){

		var args = Sys.args();
		
		if(args.length <= 0){
			Sys.println("please specify the scenario file to run");
			Sys.exit(1);
		}
		
		
		var scenario : Scenario = Cson.parse(File.getContent(args[0]));

		var scenarioRunner = new ScenarioRunner(scenario);
		scenarioRunner.run(function(err){
			if(err != null){
				trace(err);
			}
		});
	}
}