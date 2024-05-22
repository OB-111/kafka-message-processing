const Kafka = require('node-rdkafka');
const { configFromPath } = require('./util');

const axios = require('axios');


async function fetchCurrencyData() {
    // Example: Fetch data from CoinGecko API
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
      return response.data;
    } catch (error) {
      console.error('Error fetching currency data:', error);
    }
}

function createProducer(config, onDeliveryReport) {
  const producer = new Kafka.Producer(config);

  return new Promise((resolve, reject) => {
    producer
      .on('ready', () => resolve(producer))
      .on('delivery-report', onDeliveryReport)
      .on('event.error', (err) => {
        console.warn('event.error', err);
        reject(err);
      });
    producer.connect();
  });
}

async function produceExample() {
  if (process.argv.length < 3) {
    console.log("Please provide the configuration file path as the command line argument");
    process.exit(1);
  }
  let configPath = process.argv.slice(2)[0];
  console.log('From Producer:\n',configPath);

  const config = await configFromPath(configPath);
  config['dr_msg_cb'] = true;
//   let topic = "purchases";
 let topic = "currency-data";
 
  let users = [ "eabara", "jsmith", "sgarcia", "jbernard", "htanaka", "awalther" ];
  let items = [ "book", "alarm clock", "t-shirts", "gift card", "batteries" ];

  const producer = await createProducer(config, (err, report) => {
    if (err) {
      console.warn('Error producing', err)
    } else {
      const {topic, key, value} = report;
      let k = key.toString().padEnd(10, ' ');
      console.log(`Produced event to topic ${topic}: key = ${k} value = ${value}`);
    }
  });

//   let numEvents = 10;
//   for (let idx = 0; idx < numEvents; ++idx) {
//     const key = users[Math.floor(Math.random() * users.length)];
//     const value = Buffer.from(items[Math.floor(Math.random() * items.length)]);

//     producer.produce(topic, -1, value, key);
//   }

//   producer.flush(10000, () => {
//     producer.disconnect();
//   });
const interval = setInterval(async () => {
    const currencyData = await fetchCurrencyData();
    if (currencyData) {
      for (const [key, value] of Object.entries(currencyData)) {
        producer.produce(topic, -1, Buffer.from(JSON.stringify(value)), key);
      }
    }
  }, 5000); // Fetch data every 5 seconds

  process.on('SIGINT', () => {
    clearInterval(interval);
    producer.flush(10000, () => {
      producer.disconnect();
    });
  });
}

produceExample()
  .catch((err) => {
    console.error(`Something went wrong:\n${err}`);
    process.exit(1);
  });