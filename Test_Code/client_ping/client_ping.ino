#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "Galaxy S22D9EC";
const char* password = "12345678";

const char* ec2Server = "http://52.36.190.202:1234";
const int ec2Port = 1234; // Assuming your EC2 server is running an HTTP server

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  String payload = "{\"message\": \"TEST MESSAGE\"}";

  // Perform the "ping" by sending an HTTP GET request
  pingEc2Server(payload);

  // Wait for 2 seconds before the next ping
  delay(2000);
}

void pingEc2Server(String payload) {
  HTTPClient http;

  // Construct the URL for the HTTP GET request
  String url = String(ec2Server) + "/ping";
  
  Serial.print("Sending HTTP GET request to: ");
  Serial.println(url);

  // Specify the URL
  http.begin(url);

   // Set content type header
  http.addHeader("Content-Type", "application/json");

  // Send POST request with payload
  int httpResponseCode = http.POST(payload);

  // // Send GET request
  // int httpResponseCode = http.GET();

  // Check for a successful response
  if (httpResponseCode > 0) {
    Serial.print("HTTP POST request successful. Response code: ");
    Serial.println(httpResponseCode);

    // Print the response payload
    String response = http.getString();
    Serial.println("Response payload: " + response);
  } else {
    Serial.print("HTTP POST request failed. Response code: ");
    Serial.println(httpResponseCode);
  }

  // Close the connection
  http.end();
}