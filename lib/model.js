var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    Document = require('./document'),
    Queriable = require('./query'),
    ChainViewAble = require('./chainview'),
    db_helper = require('./connection');

var defined_models = {};


var ModelDocument = function (model_type, schema, views) {

  var self = this;
  var base = self;

  self.model_type = model_type;
  self.schema = schema;
  self.views = views;
  self.methods = {};

  this.beforeSave = function (fn) {
    self.beforeSaveFn = fn;
  };

  this.afterSave = function (fn) {
    self.afterSaveFn = fn;
  };

  this.beforeCreate = function (fn) {
    self.beforeCreateFn = fn;
  };

  this.beforeRemove = function (fn) {
    self.beforeRemoveFn = fn
  };

  this.afterRemove = function (fn) {
    self.afterRemoveFn = fn
  };

  this.validate = function (fn) {
    self.validateFn = fn;
  };

  this.addView = function (view_name, view) {
    self.views[view_name] = view;
  };

  this.addMethod = function (method_name, method) {
    self.methods[method_name] = method;
  };

  this.view = function (view_name, options, cb) {
    var _cb = cb;

    if (arguments.length == 1) {
      return new ChainViewAble(self, view_name);
    }

    if (arguments.length < 3) {
      _cb = options;
      options = {};
    }

    this._view(self.model_type + '/' + view_name, options, _cb);
  };

  self.load = function (model_data) { 

    var model = new Document( self.beforeSaveFn, 
        self.afterSaveFn,
        self.beforeRemoveFn,
        self.afterRemoveFn,
        self.validateFn,
        self.schema,
        self.model_type);

    self._load_methods(model);

    if (!model_data) return model;

    self._load_model_from_schema(model, model_data);

    if (model_data._id) {
      model.id = model_data._id;
    }

    if(model_data._rev) {
      model.rev = model_data._rev;
    }

    model.dateCreated = model_data.dateCreated;
    model.lastUpdated = model_data.lastUpdated;

    return model;
  };

  self._load_methods = function (model) {
    Object.keys(self.methods).forEach(function (key) {
      model[key] = self.methods[key];
    });
  };

  self._load_model_from_schema = function (model, model_data) {
    // TODO convert to correct type if needed
    Object.keys(self.schema).forEach(function (key) { 

      if (self.schema[key].type.has_one) {
        model[key] = self.schema[key].type.has_one.load(model_data[key]);

      } else if (self.schema[key].type.has_many) {
        var created_docs = [];
        var key_store = key;

        if(model_data[key]) {

          model_data[key].forEach(function (item) {
            created_docs.push(Model(item.model_type).load(item));
          });
        }

        model[key] = created_docs;

      } else if (model_data[key] !== undefined) {
        model[key] = model_data[key]; 

      } else {
        model[key] = schema[key].default;
      }
    });

  }

  self.create = function (model_data) {

    var model = self.load(model_data);
    self.beforeCreateFn && self.beforeCreateFn(model);

    return model;
  };

  self.onDocLoad(self.load);

};


// Mixins http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
Queriable.call(ModelDocument.prototype);


var Model = function (model_type) {
  var model_document = defined_models[model_type];

  if (!model_document) {
    throw {
      message: "Model " + model_type + " does not exist"
    }
  }

  if (model_document.instance) {
    return model_document.instance;
  }

  model_document.instance = new ModelDocument(model_type, model_document.schema); 

  return model_document.instance;
};

Model.create_connection= function (db_name) {
  return db_helper.create_connection(db_name);
}

Model.connect = Model.create_connection;

Model.create_views = function (model_type, model_schema) {
  var db = db_helper.connection();

  var model_views = {};

  Object.keys(model_schema).forEach(function (property) {
    model_views[property] = {};
    model_views[property].map = 'function (doc) {if (doc.model_type === \''+model_type+'\' && doc.' +property +') { emit(doc.' +property +',doc)} }'
  });

  model_views.all = {};
  model_views.all.map = 'function (doc) { if (doc.model_type === \''+model_type+'\'){emit(null, doc)}}';

  return model_views
};


Model.load = function () {
    if (typeof(arguments[0]) === 'string') {
      var dir = path.resolve(process.cwd(),arguments[0]);
      fs.readdirSync(dir).forEach(function (file) {
        var full_path = path.join(dir,file);
        require(full_path);
      });
    }

    var _cb = arguments[arguments.length - 1];
    var cb  = function () {};

    if (typeof(_cb) === 'function') {
      cb = _cb;
    } 

  var db = db_helper.connection();

  async.forEach(Object.keys(defined_models), function (model_type, done_cb) {
    var model_document = defined_models[model_type]

    db.save('_design/'+model_type, model_document.views, function (err, res) {
      if (err) {
        return done_cb(err)
      }

      done_cb();
    });
  }, cb);

};


Model.define = function (model_type, model_schema) {
  var schema  = create_schema(model_schema);

  var model_document = {};
  model_document.schema = schema;
  model_document.views = Model.create_views(model_type, schema);
  model_document.instance = new ModelDocument(model_type, schema, model_document.views);

  defined_models[model_type] = model_document;

  return model_document.instance
};

function create_schema(model_schema) {
  for (key in model_schema) {
    if (model_schema[key].hasOwnProperty('type')) {
      if (!model_schema[key].hasOwnProperty('default')) {
        model_schema[key].default = undefined;
      }
    } else {
      model_schema[key] = {
        type: model_schema[key],
        default: undefined
      };
    }
  };

  return model_schema;
};


//  ----- For testing -------
Model.remove_models = function () {
  defined_models = {};
};

Model.dump = function () {
  console.dir(defined_models);
};



module.exports = Model;
