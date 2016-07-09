((root, factory) ->
  if typeof define is 'function' and define.amd
    # AMD. Register as an anonymous module.
    define ->
      factory()
  else if typeof exports is 'object'
    # Node. Does not work with strict CommonJS, but
    # only CommonJS-like enviroments that support module.exports,
    # like Node.
    module.exports = factory()
  else
    # Browser globals.
    root.ifvisible = factory()
)(this, ->
  # Export Object
  # ```
  # @type {Object}
  # ```
  ifvisible = {}

  # document element
  # ```
  # @type {Document Object}
  # ```
  doc = document

  # flag to prevent multiple initializations
  # ```
  # @type {Boolean}`
  # ```
  initialized = false

  # Current status, may contain `active`, `idle`, `hidden`
  # ```
  # @type {String}`
  # ```
  status = "active"

  # Time to wait when setting page to idle
  # ```
  # @type {Number} in miliseconds
  # ```
  idleTime = 60000

  # To track how many time left to become IDLE I need to know
  # when we started keeping the time
  # ```
  # @type {Number} in miliseconds
  # ```
  idleStartedTime = false

  # ## Custome Event Handler

  # Handle Custom Object events
  # ```
  # @return {Object} add and fire methods to handle custom events
  # ```
  customEvent = (->
    # Create a synthetic GUID
    S4 = ->
       (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    guid = ->
       (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())

    # Event listeners
    # ```
    # @type {Object}
    # ```
    listeners = {}

    # Name of the custom GUID property
    # ```
    # @type {String}
    # ```
    cgid = '__ceGUID'

    # Add a custom event to a given object
    # ```
    # @param {Object}   obj      Object to add custom events
    # @param {string}   event    name of the custom event
    # @param {Function} callback callback function to run when
    #                            event is fired
    # ```
    addCustomEvent = (obj, event, callback)->
      # Extent Objects with custom event GUID so that it will be hidden
      obj[cgid] = `undefined` # it was using prototype before but diabled
      # We were using GUID here but it's disabled to keep events object in scope
      obj[cgid] = "ifvisible.object.event.identifier" unless obj[cgid]
      # create a place for event
      listeners[obj[cgid]] = {}  unless listeners[obj[cgid]]
      listeners[obj[cgid]][event] = [] unless listeners[obj[cgid]][event]
      # add event
      listeners[obj[cgid]][event].push(callback)

    # Trigger the custom event on given object
    # ```
    # @param  {Object} obj   Object to trigger the event
    # @param  {string} event name of the event to trigger
    # @param  {object} memo  a custom argument to send
    #                        triggered event
    # ```
    fireCustomEvent = (obj, event, memo)->
      if obj[cgid] and listeners[obj[cgid]] and listeners[obj[cgid]][event]
        ev(memo or {}) for ev in listeners[obj[cgid]][event]

    # Remove a custom event from a given object
    # ```
    # @param {Object}   obj      Object to add custom events
    # @param {string}   event    name of the custom event
    # @param {Function} callback Optional! When passed, removes only that
    #                            callback, otherwise removes all callbacks
    # ```
    removeCustomEvent = (obj, event, callback)->
      # if callback was sent, find and remove only given callback
      if callback
        if obj[cgid] and listeners[obj[cgid]] and listeners[obj[cgid]][event]
          for cl, i in listeners[obj[cgid]][event]
            if cl is callback
              listeners[obj[cgid]][event].splice(i, 1)
              return cl
      else # otherwise remove all callbacks for given event
        if obj[cgid] and listeners[obj[cgid]] and listeners[obj[cgid]][event]
          delete listeners[obj[cgid]][event]

    # export methods to use
    add: addCustomEvent
    remove: removeCustomEvent
    fire: fireCustomEvent
  )()

  # ## Regular Event Handlers

  # CrossBrowser event attachement
  # ```
  # @param  {DomElement}   el Dom Element to attach the event
  # @param  {string}   ev name of the event with on prefix
  # @param  {Function} fn callback function to run when event
  #                       is fired
  # ```
  addEvent = (->
    setListener = false
    # return an anonmous function with the correct version of set listener
    (el, ev, fn)->
      if not setListener
        if el.addEventListener
          setListener = (el, ev, fn) ->
            el.addEventListener(ev, fn, false)
        else if el.attachEvent
          setListener = (el, ev, fn) ->
            el.attachEvent('on' + ev, fn, false)
        else
          setListener = (el, ev, fn) ->
            el['on' + ev] =  fn
      setListener(el, ev, fn)
  )()

  # Trigger any HTML events
  # ```
  # @param  {DomElement} element Dom Element to trigger
  #                              events on
  # @param  {string} event   event name to trigger
  # @return {boolean}   if dispached or not
  # ```
  fireEvent = (element, event) ->
    if doc.createEventObject
      element.fireEvent('on'+event,evt)
    else
      evt = doc.createEvent('HTMLEvents')
      evt.initEvent(event, true, true)
      not element.dispatchEvent(evt)

  # ## IE Detection

  # Get the IE version
  # ```
  # @return {Number|Undefined} version number of IE or undefined
  # ```
  ie = (->
    undef = undefined
    v = 3
    div = doc.createElement("div")
    all = div.getElementsByTagName("i")

    check = ->
      return ((div.innerHTML = "<!--[if gt IE " + (++v) +
        "]><i></i><![endif]-->"); all[0])

    while check()
      continue

    (if v > 4 then v else undef)
  )()

  # ## Get HTML5 visibility api for current browser

  # Set the name of the hidden property and the change event for visibility checks
  hidden = false
  visibilityChange = undefined
  # Standarts
  if typeof doc.hidden isnt "undefined"
    hidden = "hidden"
    visibilityChange = "visibilitychange"
  # For Gecko browsers
  else if typeof doc.mozHidden isnt "undefined"
    hidden = "mozHidden"
    visibilityChange = "mozvisibilitychange"
  # For MSIE
  else if typeof doc.msHidden isnt "undefined"
    hidden = "msHidden"
    visibilityChange = "msvisibilitychange"
  # For Webkit browsers
  else if typeof doc.webkitHidden isnt "undefined"
    hidden = "webkitHidden"
    visibilityChange = "webkitvisibilitychange"


  # Track if the page is idle or not
  trackIdleStatus = ->
    timer = []
    wakeUp = ->
      timer.map(clearTimeout);
      ifvisible.wakeup()  if status isnt "active"
      idleStartedTime = +(new Date())
      timer.push setTimeout(->
        ifvisible.idle()  if status is "active"
      , idleTime)

    # Call once so that it can set page to idle without doing anything
    wakeUp()
    addEvent doc, "mousemove", wakeUp
    addEvent doc, "keyup", wakeUp
    addEvent doc, "touchstart", wakeUp
    addEvent window, "scroll", wakeUp
    # If page got focus but noinput activity was recorded
    ifvisible.focus wakeUp
    ifvisible.wakeup wakeUp

  # ## Initialize the module

  # constructor
  init = ->
    return true  if initialized

    # If hidden is false the use the legacy methods
    if hidden is false
      blur = "blur"
      blur = "focusout"  if ie < 9
      addEvent window, blur, ->
        ifvisible.blur()

      addEvent window, "focus", ->
        ifvisible.focus()

    else

      # add HTML5 visibility events
      addEvent doc, visibilityChange, ->
        if doc[hidden]
          ifvisible.blur()
        else
          ifvisible.focus()
      , false
    initialized = true

    #Set method to be initialized
    trackIdleStatus()

  # ## Exports

  # Methods to be exported
  # ```
  # @type {Object}
  # ```
  ifvisible =

    # Change idle timeout value.
    # ```
    # @param {Number} seconds a number in seconds such as: 10 or 0.5
    # ```
    setIdleDuration: (seconds) ->
      idleTime = seconds * 1000


    # Get idle timeout value.
    getIdleDuration: ->
      idleTime


    # Get information about user being idle.
    # ```
    # @return {Object} An object contining information about idle status
    # ```
    # Informations is as following
    # ```
    # isIdle: [current idle status true/false]
    # idleFor: [how long the user was idle
    #           in milliseconds]
    # timeLeft: [How long does it take to become
    #            idle in milliseconds]
    # timeLeftPer: [How long does it take to become
    #               idle in percentage]
    # ```
    getIdleInfo: ->
      now = +(new Date())
      res = {}
      if status is "idle"
        res.isIdle = true
        res.idleFor = now - idleStartedTime
        res.timeLeft = 0
        res.timeLeftPer = 100
      else
        res.isIdle = false
        res.idleFor = now - idleStartedTime
        res.timeLeft = (idleStartedTime + idleTime) - now
        res.timeLeftPer = (100 - (res.timeLeft * 100 / idleTime)).toFixed(2)
      res


    # When User Opens the page,
    # ```
    # @note: User may not be looking at it directly
    # ```
    focus: (callback) ->

      # if first argument is a callback then set an event
      if typeof callback is "function"
        @on("focus", callback)
      else
        # else trigger event
        status = "active"
        customEvent.fire this, "focus"
        customEvent.fire this, "wakeup" # When focused page will woke up too.
        customEvent.fire this, "statusChanged", { status: status }
      @


    # When User swicthes tabs or minimizes the window
    # ```
    # @note: this may trigger when iframes are selected
    # ```
    blur: (callback) ->

      # if first argument is a callback then set an event
      if typeof callback is "function"
        @on("blur", callback)
      else
        # else trigger event
        status = "hidden"
        customEvent.fire this, "blur"
        customEvent.fire this, "idle" # When blurred page is idle too
        customEvent.fire this, "statusChanged", { status: status }
      @


    # When page is focused but user is doing nothing on the page
    idle: (callback) ->

      # if first argument is a callback then set an event
      if typeof callback is "function"
        @on("idle", callback)
      else
        # else trigger event
        status = "idle"
        customEvent.fire this, "idle"
        customEvent.fire this, "statusChanged", { status: status }
      @


    # When user started to make interactions on the page such as:
    # `mousemove`, `click`, `keypress`, `scroll`
    # This will be called when page has focus too
    wakeup: (callback) ->

      # if first argument is a callback then set an event
      if typeof callback is "function"
        @on("wakeup", callback)
      else
        # else trigger event
        status = "active"
        customEvent.fire this, "wakeup"
        customEvent.fire this, "statusChanged", { status: status }
      @

    # Set an event to ifvisible object
    # ```
    # @param  {string}   name     Event name such as focus,
    #                             idle, blur, wakeup
    # @param  {Function} callback callback function to call
    #                             when event is fired
    # @return {object}            an object with a stop method
    #                             to unbid this event
    # ```
    on: (name, callback) ->
      init() # Auto init on first call
      customEvent.add this, name, callback
      @

    # Remove an event from ifvisible object
    # ```
    # @param  {string}   name     Event name such as focus,
    #                             idle, blur, wakeup
    # @param  {Function} callback Optional, if passed, it will remove
    #                             only the given callback, if empty will
    #                             remove all
    # @return {object}            an object with a stop method
    #                             to unbid this event
    # ```
    off: (name, callback) ->
      init() # Auto init on first call
      customEvent.remove this, name, callback
      @

    # if page is visible then run given code in given seconds of intervals
    # ```
    # @param  {float}   seconds  seconds to run interval
    # @param  {Function} callback callback function to run
    # ```
    onEvery: (seconds, callback) ->
      # Auto init on first call
      init()

      paused = false

      t = setInterval(->
        callback()  if status is "active" && paused is false
      , seconds * 1000) if callback

      # return methods
      stop: ->
        clearInterval t

      pause: ->
        paused = true

      resume: ->
        paused = false

      code: t
      callback: callback


    # `ifvisible.now()` return if the page is visible right now?
    # ```
    # @return {boolean} true if page is visible
    # ```
    now: (check)->
      # Auto init on first call
      init()
      status is (check or "active")

  return ifvisible
)
