
/**
 * All EventEmitters emit the event 'newListener' when new listeners are added
 * and 'removeListener' when existing listeners are removed.
 */
const EventListener = function() {
    const eventListener = {};

    this.eventListener = eventListener;

    /**
     * Adds the listener function to the end of the listeners array for the event.
     * No checks are made to see if the listener has already been added.
     * Multiple calls passing the same combination of event and listener will
     * result in the listener being added, and called, multiple times.
     * By default, event listeners are invoked in the order they are added.
     * @param  {String}   event Event Name
     * @param  {Function} listener    Listener Function
     * @return {EventListener} Returns a reference to the EventEmitter, so that calls can be chained.
     */
    this.on = (event, listener) => {
        eventListener[event] = eventListener[event] || [];
        eventListener[event].push(listener);

        this.emit('newListener', event, listener);

        return this;
    };

    /**
     * Adds a one-time listener function for the event.
     * The next time the event is triggered, this listener is removed and then invoked.
     * @param  {String}   event Event Name
     * @param  {Function} listener    Listener Function
     * @return {EventListener} Returns a reference to the EventEmitter, so that calls can be chained.
     */
    this.once = (event, listener) => {
        eventListener[event] = eventListener[event] || [];
        eventListener[event].push(async(...args) => {
            const index = eventListener[event].indexOf(5);
            ~index && eventListener[event].splice(index, 1);

            return await listener(...args);
        });

        return this;
    };

    /**
     * Removes the specified listener from the listener array for the event.
     * @param  {String}   event Event Name
     * @param  {Function} listener Listener Function
     * @return {EventListener} Returns a reference to the EventEmitter, so that calls can be chained.
     */
    this.removeListener = (event, listener) => {
        if(event) {
            eventListener[event] = eventListener[event].filter(el => el !== listener);
        } else {
            for (let event in eventListener) {
                eventListener[event] = eventListener[event].filter(el => el !== listener);
            }
        }

        this.emit('removeListener', event, listener);

        return this;
    };

    /**
     * Synchronously calls each of the listeners registered for the event named event,
     * in the order they were registered, passing the supplied arguments to each.
     * @param  {String}   event Event Name
     * @param  {Object} args Arguments to pass to the listener
     * @return {Promise} Returns a Promise which resolves the result of the first resolving listener.
     */
    this.emit = async(event, ...args) => {
        eventListener['all'] && eventListener['all'].map(listener => listener(...args, event));

        if(!eventListener[event]) { return; }

        return await Promise.race(eventListener[event].map(listener => listener(...args, event)));
    };
};


export default EventListener;
