var five = require("johnny-five")
  , request = require("request")
  , raspi = require("raspi-io")
  , crypto = require('crypto')
  , token
  , left_pin
  , right_pin
  , domain
  , endpoint
  , wakeup_endpoint
  , board;

token = process.env.TOPSPINJS_TOKEN;
left_pin = +process.env.TOPSPINJS_LEFT_PIN || 37;
right_pin = +process.env.TOPSPINJS_RIGHT_PIN || 15;
domain = process.env.TOPSPINJS_DOMAIN || 'redbooth.topspinjs.com'; // FIXME

if (!domain) {
  throw new Error('TOPSPINJS_DOMAIN environment variable is mandatory');
}

endpoint = 'http://' + domain + '/api/games/current';
wakeup_endpoint = 'http://' + domain + '/wakeup';

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
  request.post(wakeup_endpoint);

  left_button = new five.Button(left_pin);
  right_button = new five.Button(right_pin);

  function callback(error, response, body) {
    if (error) {
      console.error('Error posting a side event!');
    }
  }

  function postSide(side) {
    var options = {}
      , phrase
      , hash;

    console.log(side + " down");

    options.url = endpoint + "/" + side;
    options.headers = {};

    if (token) {
      phrase = token + options.url;
      hash = crypto.createHash('sha1').update(phrase).digest('hex');

      options.headers.Authorization = hash;
    }

    options.headers['X-Timestamp'] = Date.now();

    request.post(options, callback);
  }

  left_button.on("down", function () {
    postSide('left');
  });

  right_button.on("down", function () {
    postSide('right');
  });
});
