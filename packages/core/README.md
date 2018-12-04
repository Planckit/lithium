## Modules

<dl>
<dt><a href="#module_Service">Service</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#EventListener">EventListener()</a></dt>
<dd><p>All EventEmitters emit the event &#39;newListener&#39; when new listeners are added
and &#39;removeListener&#39; when existing listeners are removed.</p>
</dd>
<dt><a href="#on">on(event, listener)</a> ⇒ <code><a href="#EventListener">EventListener</a></code></dt>
<dd><p>Adds the listener function to the end of the listeners array for the event.
No checks are made to see if the listener has already been added.
Multiple calls passing the same combination of event and listener will
result in the listener being added, and called, multiple times.
By default, event listeners are invoked in the order they are added.</p>
</dd>
<dt><a href="#once">once(event, listener)</a> ⇒ <code><a href="#EventListener">EventListener</a></code></dt>
<dd><p>Adds a one-time listener function for the event.
The next time the event is triggered, this listener is removed and then invoked.</p>
</dd>
<dt><a href="#removeListener">removeListener(event, listener)</a> ⇒ <code><a href="#EventListener">EventListener</a></code></dt>
<dd><p>Removes the specified listener from the listener array for the event.</p>
</dd>
<dt><a href="#emit">emit(event, args)</a> ⇒ <code>Promise</code></dt>
<dd><p>Synchronously calls each of the listeners registered for the event named event,
in the order they were registered, passing the supplied arguments to each.</p>
</dd>
</dl>

<a name="module_Service"></a>

## Service

* [Service](#module_Service)
    * [~Service](#module_Service..Service)
        * [new Service(serviceDescriptor)](#new_module_Service..Service_new)
        * [.get(path, data, [headers])](#module_Service..Service+get)
        * [.post(path, data, [headers])](#module_Service..Service+post)
        * [.patch(path, data, [headers])](#module_Service..Service+patch)
        * [.put(path, data, [headers])](#module_Service..Service+put)
        * [.delete(path, data, [headers])](#module_Service..Service+delete)
        * [.setService(serviceDescriptor)](#module_Service..Service+setService)

<a name="module_Service..Service"></a>

### Service~Service
Lazy create a Serrvice Instance.
Every prop of the serviceDescriptor will be wrapped by the service instance.

**Kind**: inner class of [<code>Service</code>](#module_Service)  

* [~Service](#module_Service..Service)
    * [new Service(serviceDescriptor)](#new_module_Service..Service_new)
    * [.get(path, data, [headers])](#module_Service..Service+get)
    * [.post(path, data, [headers])](#module_Service..Service+post)
    * [.patch(path, data, [headers])](#module_Service..Service+patch)
    * [.put(path, data, [headers])](#module_Service..Service+put)
    * [.delete(path, data, [headers])](#module_Service..Service+delete)
    * [.setService(serviceDescriptor)](#module_Service..Service+setService)

<a name="new_module_Service..Service_new"></a>

#### new Service(serviceDescriptor)

| Param | Type | Description |
| --- | --- | --- |
| serviceDescriptor | <code>Object</code> | Description Object of a Service. Could be contain any property. The Properties name, hostname and port are required. |
| serviceDescriptor.name | <code>String</code> |  |
| serviceDescriptor.hostname | <code>String</code> | IP Address ot this Service |
| serviceDescriptor.port | <code>Number</code> | Http port of this Service |

<a name="module_Service..Service+get"></a>

#### service.get(path, data, [headers]) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Service</code>](#module_Service..Service)  
**Returns**: <code>Promise</code> - Returns a Promise which resolves the result of the Request.

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | to make a request to this Service instance |
| data | <code>Object</code> | to seleralize and send |
| [headers] | <code>Object</code> | Optional headers to describe the request and pass Authorization data |

<a name="module_Service..Service+post"></a>

#### service.post(path, data, [headers]) ⇒ <code>Promise</code>
See [service.get](service.get)

**Kind**: instance method of [<code>Service</code>](#module_Service..Service)  
**Returns**: <code>Promise</code> - Returns a Promise which resolves the result of the Request.

| Param | Type |
| --- | --- |
| path | <code>String</code> |
| data | <code>Object</code> |
| [headers] | <code>Object</code> |

<a name="module_Service..Service+patch"></a>

#### service.patch(path, data, [headers]) ⇒ <code>Promise</code>
See [service.get](service.get)

**Kind**: instance method of [<code>Service</code>](#module_Service..Service)  
**Returns**: <code>Promise</code> - Returns a Promise which resolves the result of the Request.

| Param | Type |
| --- | --- |
| path | <code>String</code> |
| data | <code>Object</code> |
| [headers] | <code>Object</code> |

<a name="module_Service..Service+put"></a>

#### service.put(path, data, [headers]) ⇒ <code>Promise</code>
See [service.get](service.get)

**Kind**: instance method of [<code>Service</code>](#module_Service..Service)  
**Returns**: <code>Promise</code> - Returns a Promise which resolves the result of the Request.

| Param | Type |
| --- | --- |
| path | <code>String</code> |
| data | <code>Object</code> |
| [headers] | <code>Object</code> |

<a name="module_Service..Service+delete"></a>

#### service.delete(path, data, [headers]) ⇒ <code>Promise</code>
See [service.get](service.get)

**Kind**: instance method of [<code>Service</code>](#module_Service..Service)  
**Returns**: <code>Promise</code> - Returns a Promise which resolves the result of the Request.

| Param | Type |
| --- | --- |
| path | <code>String</code> |
| data | <code>Object</code> |
| [headers] | <code>Object</code> |

<a name="module_Service..Service+setService"></a>

#### service.setService(serviceDescriptor)
Change service endpoint for rest calls.
Every prop of the serviceDescriptor will be wrapped by the service instance.

**Kind**: instance method of [<code>Service</code>](#module_Service..Service)  

| Param | Type | Description |
| --- | --- | --- |
| serviceDescriptor | <code>Object</code> | Description Object of a Service. Could be contain any property. The Properties name, hostname and port are required. |
| serviceDescriptor.name | <code>String</code> |  |
| serviceDescriptor.hostname | <code>String</code> | IP Address ot this Service |
| serviceDescriptor.port | <code>Number</code> | Http port of this Service. |

<a name="EventListener"></a>

---

## EventListener()
All EventEmitters emit the event 'newListener' when new listeners are added
and 'removeListener' when existing listeners are removed.

**Kind**: global function  
<a name="on"></a>

## on(event, listener) ⇒ [<code>EventListener</code>](#EventListener)
Adds the listener function to the end of the listeners array for the event.
No checks are made to see if the listener has already been added.
Multiple calls passing the same combination of event and listener will
result in the listener being added, and called, multiple times.
By default, event listeners are invoked in the order they are added.

**Kind**: global function  
**Returns**: [<code>EventListener</code>](#EventListener) - Returns a reference to the EventEmitter, so that calls can be chained.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Event Name |
| listener | <code>function</code> | Listener Function |

<a name="once"></a>

## once(event, listener) ⇒ [<code>EventListener</code>](#EventListener)
Adds a one-time listener function for the event.
The next time the event is triggered, this listener is removed and then invoked.

**Kind**: global function  
**Returns**: [<code>EventListener</code>](#EventListener) - Returns a reference to the EventEmitter, so that calls can be chained.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Event Name |
| listener | <code>function</code> | Listener Function |

<a name="removeListener"></a>

## removeListener(event, listener) ⇒ [<code>EventListener</code>](#EventListener)
Removes the specified listener from the listener array for the event.

**Kind**: global function  
**Returns**: [<code>EventListener</code>](#EventListener) - Returns a reference to the EventEmitter, so that calls can be chained.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Event Name |
| listener | <code>function</code> | Listener Function |

<a name="emit"></a>

## emit(event, args) ⇒ <code>Promise</code>
Synchronously calls each of the listeners registered for the event named event,
in the order they were registered, passing the supplied arguments to each.

**Kind**: global function  
**Returns**: <code>Promise</code> - Returns a Promise which resolves the result of the first resolving listener.  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Event Name |
| args | <code>Object</code> | Arguments to pass to the listener |
