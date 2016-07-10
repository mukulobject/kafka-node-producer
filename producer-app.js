var com = com || {}

if (typeof com.rb === "undefined") {
    com.rb = {}
}

if (typeof com.rb.kafka === "undefined") {
    com.rb.kafka = {}
}

com.rb.kafka.Main = (function () {

    var kafkaProducer = require('./producer/kafka-producer');
    var kafkaConsumers = require('./consumer/kafka-consumer');

    var beeMessage = {
        "uuid": "00000103-4212-47d0-8b34-07164f9abdd3",
        "created_date": 1445857921342,
        "payload": "+RESP:GTDAT,020202,115522339955",
        "SEQ": 33494
    }

    function randomNumber() {
        return Math.floor(100000000000 + Math.random() * 900000000000);
    }

    function send() {
        // start the producer to send messages
        setInterval(function () {
            // creating a random number in payload, which will be used as a key while determining partitions.
            // It creates randomization while pushing messages to partitions.
            var msgPayload = beeMessage.payload;
            var splits = msgPayload.split(',');
            splits[2] = randomNumber();
            msgPayload = splits.join();
            beeMessage['payload'] = msgPayload;

            // now send the message
            kafkaProducer.send(beeMessage)
        }, 5000);

        // start the consumers to consume messages
        setTimeout(function () {
            kafkaConsumers.start()
        }, 10000)
    }

    return {
        send: send
    }

})();

com.rb.kafka.Main.send();