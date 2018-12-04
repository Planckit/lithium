# Global





* * *

### EventListener() 

All EventEmitters emit the event 'newListener' when new listeners are added
and 'removeListener' when existing listeners are removed.



### on(event, listener) 

Adds the listener function to the end of the listeners array for the event.
No checks are made to see if the listener has already been added.
Multiple calls passing the same combination of event and listener will
result in the listener being added, and called, multiple times.
By default, event listeners are invoked in the order they are added.

**Parameters**

**event**: `String`, Event Name

**listener**: `function`, Listener Function

**Returns**: `EventListener`, Returns a reference to the EventEmitter, so that calls can be chained.


### once(event, listener) 

Adds a one-time listener function for the event.
The next time the event is triggered, this listener is removed and then invoked.

**Parameters**

**event**: `String`, Event Name

**listener**: `function`, Listener Function

**Returns**: `EventListener`, Returns a reference to the EventEmitter, so that calls can be chained.


### removeListener(event, listener) 

Removes the specified listener from the listener array for the event.

**Parameters**

**event**: `String`, Event Name

**listener**: `function`, Listener Function

**Returns**: `EventListener`, Returns a reference to the EventEmitter, so that calls can be chained.


### emit(event, args) 

Synchronously calls each of the listeners registered for the event named event,
in the order they were registered, passing the supplied arguments to each.

**Parameters**

**event**: `String`, Event Name

**args**: `Object`, Arguments to pass to the listener

**Returns**: `Promise`, Returns a Promise which resolves the result of the first resolving listener.



* * *










