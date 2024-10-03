let client;            // MQTT client
let message = '';       // Latest message
let ledState = 'OFF';   // State of LED ("ON" or "OFF")
let topicLED = '/LED';      // Topic to publish when button pressed
let topicADC = '/ADC' //Topic with ADC value
let broker = 'wss://docencia-esp32.cloud.shiftr.io'; // MQTT broker

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(20);

  // Connect to the MQTT broker with credentials
  client = mqtt.connect(broker, {
    username: 'docencia-esp32',
    password: 'public'
  });

  // Event: when the client connects to the broker
  client.on('connect', () => {
    console.log('Connected to broker');
    client.subscribe(topicADC);  // Subscribe to the topics
  });

  // Event: when a message is received
  client.on('message', (topicADC, payload) => {
    message = payload.toString();
    console.log(`Received message: ${message}`);
  });

  // Draw button for controlling LED
  button = createButton('Toggle LED');
  button.position(width / 4 - 50, height / 2 + 50);
  button.mousePressed(toggleLED);  // Attach toggle function to button press
}

function draw() {
  background(200);
  fill(0);
  text('MQTT simple dashboard', width / 2, height / 9);
  text("ADC value (12bits): "+message, width / 3, height / 3);
}

// Function to toggle the LED state and publish the message to the topic
function toggleLED() {
  if (ledState === 'OFF') {
    ledState = 'ON';
  } else {
    ledState = 'OFF';
  }

  client.publish(topicLED, ledState);  // Publish the new state
  console.log(`Published message: ${ledState}`);
}
