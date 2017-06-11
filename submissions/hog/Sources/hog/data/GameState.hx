package hog.data;

@:enum
abstract GameState(String) to(String) {
  var None = "None";
  var CreatingGame = "CreatingGame";
  var StartingGame = "StartingGame";
  var WaitingOponent = "WaitingOponent";
  var OponentFirstMove = "OponentFirstMove";
  var YourTurn = "YourTurn";
  var SendingUnits = "SendingUnits";
  var OponentTurn = "OponentTurn";
  var Arena = "Arena";
  var Done = "Done";
  var NobodyJoined = "NobodyJoined";
  var OponentLate = "OponentLate";
  var YouLate = "YouLate";
  var OponentQuit = "OponentQuit";
  var NoLocalData = "NoLocalData";
  var Collecting = "Collecting";
  var Quitting = "Quitting";
  
  // var TurnOver = "TurnOver";
}

@:enum
abstract ContractGameState(String)to(String) {
  var None = "None";
  var WaitingOponent = "WaitingOponent";
  var OponentFirstMove = "OponentFirstMove";
  var YourTurn = "YourTurn";
  var OponentTurn = "OponentTurn";

  @:to
  public function toGameState() : GameState {
    return cast this;
  }
}

