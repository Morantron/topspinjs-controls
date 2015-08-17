var five = require("johnny-five")
  , request = require("request")
  , raspi = require("raspi-io")
  , left_pin
  , right_pin
  , domain
  , endpoint
  , board;

left_pin = +process.env.TOPSPINJS_LEFT_PIN || 37;
right_pin = +process.env.TOPSPINJS_RIGHT_PIN || 15;
domain = process.env.TOPSPINJS_DOMAIN;

if (!domain) {
  throw new Error('TOPSPINJS_DOMAIN environment variable is mandatory');
}

endpoint = 'http://' + domain + '/api/games/current';

console.log('Target domain: ' + domain);

board = new five.Board({
  io: new raspi()
});

board.on("ready", function () {
  var left_button
    , right_button;

  console.log('Listening ' + left_pin + ' pin for left button');
  console.log('Listening ' + right_pin + ' pin for right button');
  console.log('Pins ready!');

  left_button = new five.Button(left_pin);
  right_button = new five.Button(right_pin);

  left_button.on("up", function () {
    console.log("left up");
    request.post(endpoint + "/left");
  });

  right_button.on("up", function () {
    console.log("right up");
    request.post(endpoint + "/right");
  });
});
