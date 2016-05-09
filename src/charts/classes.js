'use strict';

/**
 * Base class. This class is inherited in all charts implementations.
 * This is a non-instanciable chart.
 */
class Chart {

  constructor() {
    var clazz = this.constructor.name;
    if (clazz === 'Chart' || clazz === 'Basic' || clazz === 'Flow') {
      throw new Error(clazz + ' is non-instanciable');
    }
    this.events = {};
  }

  /**
   * Returns the chart context: data, configuration and chart type.
   */
  _getChartContext() {
    return {
      data: this.data,
      config: this.config,
      cType: this.constructor.name
    };
  }

  /**
   * Initialize the SVG context
   */
  _initializeSVGContext() {
    this._svg = new SvgStrategy(strategies[this.constructor.name](this._getChartContext()));
  }

  /**
   * @param  {Object} data Data object. This method infer the type of data, which could be:
   * Array: Data is an static object.
   * Object: Data is a data source we need to connect to, in order to receive a stream of data.
   */
  _inferDataSource(data) {
    if (utils.isObject(data)) {
      this._initializeWebsocketDataSource(data);
    } else if (!utils.isArray(data)) {
      throw new TypeError('Wrong data format');
    }
  }

  /**
   * Initialize a connecton between browser and server through a Websocket connections
   * @param  {Object} source Connection details.
   */
  _initializeWebsocketDataSource(source) {
    let _initialize = () => {
      this.ws = new WebSocket(source.endpoint);

      this.ws.onopen = () => {
      };

      this.ws.onerror = (e) => {
        throw new Error('Error with websocket connection', e);
      };

      this.ws.onmessage = (event) => {
        //var data = JSON.parse(event.data).points;
        var data = JSON.parse(event.data.substr(2))[1];
        setTimeout(() => {
          this.keepDrawing(data);
        }, 50);
      };
    };

    //private streaming functions, only available when using websockets
    this.start = () => {
      _initialize();
    }
    this.stop = () => {
      if (this.ws) {
        this.ws.close();
      }
    }
  }

  /**
  * Add a new point to a given serie.
  * @param  {object} new serie
  * @autodraw {Boolean} Auto re-draw the current chart after adding the new serie
  */
  addPoint(point, autodraw = true) {
    if (!point || !utils.isObject(point)) {
      throw Error('\'point\' should be an object. Instead: ' + point);
    }

    this.data.push(point);

    if (autodraw) {
      this.draw();
    }
  }

  /**
   * Add new points (array) to a given serie.
   * @param  {Array} points Array of data
   * @autodraw {Boolean} Auto re-draw the current chart after adding new series
   */
  addPoints(points, autodraw = true) {
    if (!points || points.constructor !== Array) {
      throw Error('\'points\' should be an array. Instead: ' + points);
    }

    this.data = this.data.concat(points);

    if (autodraw) {
      this.draw();
    }
  }

  removePoint(point, autodraw = true) {
    if (!point || !utils.isObject(point)) {
      throw Error('\'point\' should be an object. Instead: ' + point);
    }

    this.data.some((item, index, array) => {
      var equals = (JSON.stringify(item) === JSON.stringify(point));
      if (equals) {
        return this.data.splice(index, 1);
      }
    });

    if (autodraw) {
      this.draw();
    }
  }

  /**
   * Renders data on barchart. Only allowed when data is an array of static data.
   * @param  {Array} data Array of data
   */
  draw(data = this.data) {
    if (!utils.isArray(data)) {
      throw new TypeError('draw method is only allowed with static data.');
    }
    this._svg.draw(data);
  }

  /**
   * Returns a PNG image of the current graph
   * @return {[String]} Image in data-url format
   */
  toPNG(cb) {
    utils.svgAsDataUri(d3.select(this.config.selector + ' svg')[0][0], {}, (uri, err) => {
      if (err) {
        throw Error('Error converting to image ' + err);
      }
      else {
        cb(uri);
      }
    });
  }

  /**
   * On method. Define custom events (click, over, down and up).
   */
  on(eventName, action) {
    if (!eventName || typeof eventName !== 'string') {
      throw Error('eventName should be a string. Instead: ' + eventName);
    }
    if (!action || !utils.isFunction(action)) {
      throw Error('action should be a function. Instead: ' + eventName);
    }

    this.events[eventName] = action;
    this._svg.on(this.events);
    return this;
  }

}

/**
 * Basic chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: bar, line, point.
 */

class Basic extends Chart {
  constructor() {
    super();
  }
}

/**
 * Flow chart. This class in inherited in all basic charts implementatios.
 * This is a non-instanciable chart. Instanciable charts are: stremgraph and so on.
 */

class Flow extends Chart {
  constructor() {
    super();
  }

  draw(data) {
    //hack to clone object. It is because flow chart (like streamgraph) modify the original dataset to create itself. 
    //It could be a problem in streaming scenario, where data is concatenated with new data. We need to keep the original dataset.
    data = JSON.parse(JSON.stringify(data));
    super.draw(data);
  }
}