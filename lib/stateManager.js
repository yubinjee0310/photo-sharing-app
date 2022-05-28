class StateManager {
    constructor() {
        this.eventToObjects = new Map();
    }

    register(obj, eventType) {
        if (this.eventToObjects.has(eventType)){
            this.eventToObjects[eventType].push(obj);
        } else {
            this.eventToObjects[eventType] = [obj]; 
        }
    }

    notify(eventType) {
        for (const element of this.eventToObjects[eventType]) {
            element.notifyEvent(eventType);
        }
    }
}

export default StateManager;