var five = require("johnny-five"),
request = require("request"),
  raspi = require("raspi-io"),
  board, button;

board = new five.Board({
	io: new raspi()
});

board.on("ready", function() {

  // Create a new `button` hardware instance.
  // This example allows the button module to
  // create a completely default instance

	console.log('ready!');

  var button = new five.Button(37);

  var button2 = new five.Button(15);

  // Button Event API
  // "down" the button is pressed
  button.on("down", function() {
    console.log("down");
  });

  // "hold" the button is pressed for specified time.
  //        defaults to 500ms (1/2 second)
  //        set
  button.on("hold", function() {
    console.log("hold");
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
    request.post("http://redbooth.topspinjs.com/api/games/current/left");
  });

  // "up" the button is released
  button2.on("up", function() {
    console.log("up");
    request.post("http://redbooth.topspinjs.com/api/games/current/right");
  });
});
