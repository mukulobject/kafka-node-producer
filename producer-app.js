var com = com || {}

if (typeof com.rb === "undefined") {
    com.rb = {}
}

if (typeof com.rb.kafka === "undefined") {
    com.rb.kafka = {}
}

com.rb.kafka.Main = (function () {

    var kafkaProducer = require('./producer/kafka-producer');

    var beeMessage = {
        "uuid": "00000103-4212-47d0-8b34-07164f9abdd3",
        "created_date": 1445857921342,
        "payload": "+RESP:GTDAT,020202,115522339955",
        "SEQ": 33494
    }

    function send() {
        setInterval(function () {
            kafkaProducer.send(beeMessage)
        }, 5000);
    }

    return {
        send: send
    }

})();

com.rb.kafka.Main.send();