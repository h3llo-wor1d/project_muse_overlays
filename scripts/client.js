async function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

class Client {
    type = null;
    currentRequest = null;
    ws = null;
    funcMap = {};

    constructor(type, funcMap) {
        this.type = type;
        this.funcMap = funcMap;
    }

    run = async () => {
        if (!this.ws === null) {
            this.ws.close();
        }

        let i1 = this;

        this.ws = new WebSocket("ws://localhost:8080");
        
        this.ws.onopen = () => {
            console.log("Connected to discord socket!")
            i1.ws.send(JSON.stringify({
                type: this.type
            }));
        };
        this.ws.onmessage = async (message) => {
            await i1.event(message.data);
        };
        this.ws.onclose = async () => {
            await delay(1);
            await i1.init();
        }
        this.ws.onerror = () => {}
    }

    event = async (d) => {
        try {
            let data = JSON.parse(d);
            this.funcMap[data.event](data.data);
        } catch {}
    }
}