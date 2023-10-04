#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";

const char* ec2Server = "your_ec2_server_ip_or_domain";
const int ec2Port = 80; // Assuming your EC2 server is running an HTTP server

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Perform the "ping" by sending an HTTP GET request
  pingEc2Server();
}

void loop() {
  // The loop can be empty as we only want to perform the "ping" once
}

void pingEc2Server() {
  HTTPClient http;

  // Construct the URL for the HTTP GET request
  String url = "http://" + String(ec2Server) + "/ping";
  
  Serial.print("Sending HTTP GET request to: ");
  Serial.println(url);

  // Send GET request
  int httpResponseCode = http.GET(url);

  // Check for a successful response
  if (httpResponseCode > 0) {
    Serial.print("HTTP GET request successful. Response code: ");
    Serial.println(httpResponseCode);

    // You can parse the response or perform other actions here
  } else {
    Serial.print("HTTP GET request failed. Response code: ");
    Serial.println(httpResponseCode);
  }

  // Close the connection
  http.end();
}
