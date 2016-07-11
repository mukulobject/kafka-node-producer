kafka-node based Producer-Consumer application.

producer-app creates messages every 5 seconds with random id's.
kafka-producers takes these messages and using keyedPartitioner, publish them to appropriate partition.
kafka-consumer can instantiates and start n number of consumer processes to consume messages using HighLevelConsumer.


npm install kafka-node
npm install config

Start app by:
$ export NODE_ENV=default
$ node producer-app.js