/*
 * @author Alberto Colella
 */

/**
 * layOutDay jQuery plugin.
 *
 * Usage:
 * <code>
 *  $('.your-calendar-selector').layOutDay({
 *           'calendar_width': 600,  // optional
 *           'calendar_height': 720, // optional
 *           'events_selector': ".events"  // optional
 *  });
 *  $('.your-calendar-selector').addEvents([ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ]);
 * </code>
 */
(function($){

    // default settings.
    var settings = {
            calendar_width: null,
            calendar_height: null,
            calendar_start: 0,
            calendar_end: 1440,
            events_selector: ".events"
        };

    /**
     * Initializes a Calendar stage
     * @param options
     *      Hash of settings. Optional.
     */
    $.fn.layOutDay = function(options){
      options = options || {};
      settings  = $.extend({}, settings, options);
      if(!$.cal){
        $.cal = new Calendar(settings, this);
      }
    };

    /**
     * Add Events to Calendar stage
     * @param cal_events
     *      Array of Events coordinates. Format: [{start:<int>, end:<int>}, ... ]
     */
    $.fn.addEvents = function(cal_events){
      if($.isArray(cal_events) === false ){
        $.error('No events provided, please pass an array of events.');
        return false;
      }
      if(!$.cal){
        $.cal = new Calendar(settings);
      }
      cal_events.forEach(function(ev) {
        $.cal.addEvent(ev);
      }.bind(this));
    };

    /**
     * Calendar Event class.
     * @param ev
     *      Event's start and end coordinates.
     * @param options
     *      Event's options.
     * @param settings
     *      Plugin's settings.
     * @return
     *      Calendar Event class' instance.
     */
    var CalEvent = function (ev, options, settings) {

      /**
       * Event constructor.
       */
      this.init = function () {
        this.ev = ev;
        this.options = options;
        this.colliding_events = [];
        this.options.col = 0;
        this.id = this.ev.start + "-" + this.ev.end + '-' + this.options.pos;
        this.el = $('<div id="' + this.id + '" class="event"><span class="title">Sample Item</span><br /><span class="subtitle">Sample Location</span><br /><span class="debug">' + this.ev.start + ":" + this.ev.end + "</span></div>");
        var unit = settings.calendar_height / settings.calendar_end;
        $(this.el).css('height', unit*(Math.abs(this.ev.start-this.ev.end)));
        $(this.el).css('top', unit*this.ev.start);
        return this;
      };

      /**
       * Get Event's DOM element.
       * @return
       *        Event's DOM element.
       */
      this.getEl = function () {
        return $(this.el);
      };

      /**
       * Gets Event's start coordinate.
       * @return
       *        Event's start coordinate.
       */
      this.getStart = function () {
        return this.ev.start;
      };

      /**
       * Gets Event's end coordinate.
       * @return
       *        Event's end coordinate.
       */
      this.getEnd = function () {
        return this.ev.end;
      };

      /**
       * Checks if Event collides with passed Event
       * @param elm
       *        Event to check collision with.
       * @return
       *        true if the two Events collide. false otherwise.
       */
      this.isCollidingWith = function(elm){
        var colliding = (this.getStart()<=elm.getStart() && this.getEnd()>=elm.getStart()) ||
               (this.getStart()>=elm.getStart() && this.getStart()<=elm.getEnd()) ||
               (this.getEnd()>=elm.getStart() && this.getEnd()<=elm.getEnd()) ||
               (this.getStart()<=elm.getStart() && this.getEnd()>=elm.getEnd()) ||
               (this.getStart()>=elm.getStart() && this.getEnd()<=elm.getEnd());
        if(colliding){
            this.addCollidingEvent(elm.getId());
            elm.addCollidingEvent(this.getId());
        }
        return colliding;
      };

      /**
       * Changes Event's width
       * @param width
       *        New Event's width.
       */
      this.resize = function(width){
        this.getEl().css('width', width);
      };

      /**
       * Changes Event's position
       * @param left
       *        New Event's position.
       */
      this.move = function(left){
        this.getEl().css('left', left);
      };

      /**
       * Gets Event's id
       * @return
       *        Event's id.
       */
      this.getId = function(){
        return this.id;
      };

      /**
       * Adds an Event to Events' collision list.
       * @param id
       *        Colliding Event's id.
       */
      this.addCollidingEvent = function(id){
        if(this.colliding_events[id]===undefined){
            this.colliding_events[id] = id;
        }
      };

      /**
       * Gets Event's colliding events.
       * @return
       *        Event's colliding events.
       */
      this.getCollidingEvents = function () {
        return this.colliding_events;
      };

      /**
       * Sets Event's column in Calendar Stage.
       * @param col
       *        Event's column in Calendar Stage.
       */
      this.setCol = function (col) {
        this.options.col = col;
      };

      /**
       * Gets Event's column in Calendar Stage.
       * @return
       *        Event's column in Calendar Stage.
       */
      this.getCol = function () {
        return this.options.col;
      };

      return this.init();
    };

    /**
     * Params validator class.
     * @param settings
     *      Plugin's settings.
     */
    var ElementValidator = function (settings) {
        var error = null;

        /**
         * Validates Event's input coordinates.
         * @param ev
         *       Event's coordinates.
         * @return
         *       true if valideation pass, false otherwise.
         */
        this.validate = function(ev) {
            error = null;
            try{
              if (ev === undefined || ev === null) {
               throw new Error("Please pass a not empty param.");
              }
              if (!(ev instanceof Object)) {
               throw new Error("Please pass a valid param, '" + ev + "' passed instead.");
              }
              if ($.isEmptyObject(ev)) {
               throw new Error("Please pass a not empty param.");
              }
              if (!ev.hasOwnProperty('start') || !ev.hasOwnProperty('end')) {
               throw new Error("Please pass a param with 'start' and 'end' keys.");
              }
              if (isNaN(ev.start) || isNaN(ev.end)) {
               throw new Error("Please pass a param with 'start' and 'end' keys containing numbers.");
              }
              if (parseInt(ev.start, 10) !== ev.start || parseInt(ev.end, 10) !== ev.end ) {
               throw new Error("Please pass a param with 'start' and 'end' keys containing integer.");
              }
              if (ev.start < 0) {
               throw new Error("Please pass a param with 'start' value bigger than 0.");
              }
              /*if (ev.end > settings.calendar_height) {
               throw new Error("Please pass a param with 'start' and 'end' values between 0 and " + settings.calendar_height + ".");
             }*/
              if (ev.start >= ev.end) {
               throw new Error("Please pass a param with 'start' value lower than 'end' value ("+ev.start+":"+ev.end+" passed).");
              }
              return true;
            }
            catch(e){
              error = e;
              $.error(e.message);
              return false;
            }
        };
    };

    /**
     * Calendar class.
     * @param settings
     *      Plugin's settings.
     */
    var Calendar = function (settings, element) {

      var cal_events = [];
      this.ids = [];
      this.matrix = [];
      this.element = element;

      /**
       * Adds an Event to Calendar stage.
       * @param ev
       *        The Event's coordinates.
       * @return
       *        The Event or false if coordinates validation fails.
       */
      this.addEvent = function(ev){
        var validator = new ElementValidator(settings);
        if(validator.validate(ev)){
            var options = {};
            if(this.ids[ev.start+"_"+ev.end]===undefined){
                this.ids[ev.start+"_"+ev.end] = [];
            }
            options.pos = this.ids[ev.start+"_"+ev.end].length;
            var el = new CalEvent(ev, options, settings);
            cal_events[el.getId()] = el;
            this.ids[ev.start+"_"+ev.end].push(el.getId());
            this.resizeAndPosition(el);
            this.drawEvent(el);
            return el;
        }
        return false;
      };

      /**
       * Resize an Event and place it in Calendar stage.
       * @param ev
       *        The Event.
       */
      this.resizeAndPosition = function(ev){
        var min_width = settings.calendar_width;
        var colliding_ev = this.getCollidingEvents(ev);
        var cols = colliding_ev.length>0 ? colliding_ev.length : 1;
        var col = this.getFirstFreeColumn(ev, colliding_ev);
        for(var j=ev.getStart(); j<=ev.getEnd(); j++){
            for(var k=0; k<=cols; k++){
                if(k==col){
                   this.matrix[j][col]=ev.getId();
                   this.matrix[j][col].length++;
                } else if(this.matrix[j][k] === undefined){
                   this.matrix[j][k] = '';
                   this.matrix.length++;
                }
            }
        }
        min_width = this.resizeCollidingEvents(colliding_ev);
        ev.resize(min_width-1);
        ev.setCol(col);
        //ev.move((col*min_width)+10);
        ev.move(col*min_width);
      };

      /**
       * Gets the cluster of Events colliding with Event passed as parameter.
       * @param ev
       *        The Event.
       * @param calculated_els
       *        List of already parsed Events.
       * @param colliding_evs
       *        List of colliding Events belonging to ev's cluster.
       * @return
       *        Colliding Events list.
       */
      this.getCollidingEvents = function(ev, calculated_els, colliding_evs){
        var keys = Object.keys(cal_events);
        if(colliding_evs===undefined){
            colliding_evs = [];
        }
        if(calculated_els===undefined){
            calculated_els = [];
        }
        if(calculated_els[ev.getId()]!==undefined){
            return colliding_evs;
        }
        calculated_els[ev.getId()] = ev.getId();
        for(var i=0;i<keys.length;i++){
            if(cal_events[keys[i]].isCollidingWith(ev) && calculated_els[cal_events[keys[i]].getId()]===undefined){
                colliding_evs.push(cal_events[keys[i]]);
                var coll_coll_evs = this.getCollidingEvents(cal_events[keys[i]], calculated_els, colliding_evs);
                for(k=0;k<coll_coll_evs.length;k++){
                   if(calculated_els[coll_coll_evs[k].getId()]===undefined){
                    colliding_evs.push(cal_events[coll_coll_evs[k].getId()]);
                   }
                }
            }
        }
        return colliding_evs;
      };

      /**
       * Gets the first available colum for a Event in Calendar stage.
       * @param ev
       *        The Event.
       * @param colliding_evs
       *        List of colliding Events belonging to ev's cluster.
       * @return
       *        The column number.
       */
      this.getFirstFreeColumn = function(ev, colliding_ev){
        var free_cols = [];
        var cols = colliding_ev.length;
        var col = 0;
        for(var i=0; i<cols; i++){
            free_cols[i] = i;
        }
        for(var j=ev.getStart(); j<=ev.getEnd(); j++){
          if(this.matrix[j] === undefined){
            this.matrix[j] = [];
          }
          for(var k=0; k<=cols; k++){
            if(this.matrix[j][k] !== undefined && this.matrix[j][k] !== ''  && this.matrix[j][k].length>0 ){
                if(free_cols[k]!==undefined){
                  col++;
                  delete free_cols[k];
                }
            }
          }
        }
        free_cols = free_cols.filter(function(n){ return n !== undefined; });
        if(free_cols.length>0){
            col = free_cols.shift();
        }
        return col;
      };

      /**
       * Resize all Events belonging to an Event's colliding cluster.
       * @param colliding_ev
       *        List of colliding Events belonging to ev's cluster.
       * @return
       *        The new Events size.
       */
      this.resizeCollidingEvents = function(colliding_ev){
        col_width = settings.calendar_width;
        min_width = col_width;
        for(var i=0;i<colliding_ev.length;i++){
            var max_col = 0;
            for(var j=colliding_ev[i].getStart(); j<=colliding_ev[i].getEnd(); j++){
                for(var k=0; k<=this.matrix[j].length; k++){
                    if(this.matrix[j][k] !== undefined && this.matrix[j][k] !== ''  && this.matrix[j][k].length>0 ){
                        if(k>max_col){
                            max_col = k;
                        }
                    }
                }
            }
            col_width = settings.calendar_width;
            if(max_col>0){
                col_width = col_width/(max_col+1);
            }
            if(col_width<min_width){
                min_width = col_width;
            }
        }
        for(var h=0;h<colliding_ev.length;h++){
            colliding_ev[h].resize(min_width-1);
            //colliding_ev[h].move((colliding_ev[h].getCol()*min_width)+10);
            colliding_ev[h].move(colliding_ev[h].getCol()*min_width);
        }
        return min_width;
      };

      /**
       * Renders an Event on Calendar stage.
       * @param ev
       *        The Event.
       */
      this.drawEvent = function(ev){
        $(settings.events_selector).append(ev.getEl());
      };

      this.buildEventsPane = function(){
        var events_el = $(this.element).find(settings.events_selector);
        if(events_el.length==0){
          if(settings.events_selector.indexOf('#') == 0) {
             var events_tag = '<div id="'+settings.events_selector.substring(1)+'"></div>';
          } else if(settings.events_selector.indexOf('.') == 0) {
             var events_tag = '<div class="'+settings.events_selector.substring(1)+'"></div>';
          }
          events_el = $(events_tag);
          $(this.element).append(events_el);
        }
        events_el.css('width', settings.calendar_width);
      };

      this.buildTimePane = function(){
        // @TODO
      };

      this.buildPanes = function(){
        this.buildEventsPane();
        this.buildTimePane();
      };

      this.init = function(){
        $(this.element).addClass('jquery-layoutday');
        this.buildPanes();
        if(!settings.calendar_width){
          settings.calendar_width = $(this.element).find(settings.events_selector).innerWidth();
        }
        if(!settings.calendar_height){
          settings.calendar_height = $(this.element).find(settings.events_selector).innerHeight();
        }
      };

      this.init();
    };

})(jQuery);
