Kafka Node.js Example Project
This project is a demonstration of how to create a Kafka producer and consumer using Node.js and the node-rdkafka library. The project consists of two main components: the producer, which fetches data from an external API and sends it to a Kafka topic, and the consumer, which reads the data from the Kafka topic and processes it. The purpose of this project is to explore the efficiency and capabilities of Kafka in handling real-time data streams.

Project Structure
Producer: Fetches currency data from the CoinGecko API and produces events to a Kafka topic.
Consumer: Consumes events from the Kafka topic and logs the data.
Utility Functions: Helper functions to read configuration files.
Files
producer.js: Contains the code for the Kafka producer.
consumer.js: Contains the code for the Kafka consumer.
util.js: Contains utility functions for reading configuration files.

**Installation and Setup
**Prerequisites
**Node.js (v14 or higher)
**Kafka broker (local or remote)
Configuration file for Kafka client********




Steps
Clone the repository:

1.Clone the repository:
git clone https://github.com/your-username/kafka-nodejs-example.git
cd kafka-nodejs-example
Install the dependencies:

2.Install the dependencies:
npm install

3.Create a configuration file for Kafka (e.g., config.properties) with the necessary properties:
bootstrap.servers=<your_kafka_broker>
security.protocol=<your_security_protocol>
sasl.mechanisms=<your_sasl_mechanisms>
sasl.username=<your_sasl_username>
sasl.password=<your_sasl_password>


4.Run the producer:
node producer.js config.properties

5.Run the consumer:
node consumer.js config.properties



This project demonstrates the basics of producing and consuming messages with Kafka using Node.js. 
It highlights the efficiency and scalability of Kafka in handling real-time data streams. 
By fetching currency data from an external API and processing it through Kafka, this project showcases a typical use case for real-time data processing.

For more information on Kafka and node-rdkafka, refer to the Kafka documentation and the node-rdkafka GitHub repository.
