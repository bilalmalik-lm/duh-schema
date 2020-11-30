(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.schema = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const {name, version, vendor, library, description} = require('./primitive.js');

const meta = require('./meta.js');

const props = {
  type: 'object',
  patternProperties: {
    '.+': meta
  }
};

const onRole = {
  type: 'object',
  properties: {
    direction: {
      enum: ['in', 'out']
    },
    width: {
      oneOf: [{
        type: 'integer'
      }, {
        type: 'string'
      }]
    }
  },
  oneOf: [{
    required: ['direction'],
    properties: {
      presence: {
        enum: ['optional', 'required']
      }
    }
  }, {
    required: ['presence'],
    properties: {
      presence: {
        enum: ['illegal']
      }
    }
  }]
};

const port = {
  type: 'object',
  required: ['description', 'wire'],
  properties: {
    description,
    wire: {
      type: 'object',
      required: ['onInitiator', 'onTarget'],
      properties: {
        onInitiator: onRole,
        onTarget: onRole,
        isAddress: {
          description: 'the port contains address information',
          type: 'boolean',
          default: false
        },
        isData: {
          description: 'the port contains data information',
          type: 'boolean',
          default: false
        },
        isClock: {
          description: 'port is a clock for this bus interface',
          type: 'boolean',
          default: false
        },
        isReset: {
          description: 'port is a reset for this bus interface',
          type: 'boolean',
          default: false
        },
        requiresDriver: {
          description: 'specifies whether the port requires a driver when used in a completed design',
          type: 'boolean',
          default: false
        },
        defaultValue: {
          description: 'default logic value for this wire port',
          type: 'integer',
          minimum: 0,
          default: 0
        }
      }
    }
  }
};

const abstractionDefinition = {
  type: 'object',
  required: ['name', 'version', 'vendor', 'library', 'busType', 'ports'],
  properties: {
    name, version, vendor, library,
    busType: {
      type: 'object',
      required: ['name', 'version', 'vendor', 'library'],
      properties: {name, version, vendor, library}
    },
    ports: {
      type: 'object',
      patternProperties: {
        '.+': port
      }
    },
    props
  }
};

module.exports = {
  type: 'object',
  title: 'Abstraction definition document',
  required: ['abstractionDefinition'],
  properties: {
    abstractionDefinition: abstractionDefinition
  }
};

},{"./meta.js":12,"./primitive.js":13}],2:[function(require,module,exports){
'use strict';

const {name, version, vendor, library, description} = require('./primitive.js');

const busDefinition = {
  type: 'object',
  required: ['name', 'version', 'vendor', 'library'],
  properties: {
    name, version, vendor, library, description
  }
};

module.exports = {
  type: 'object',
  title: 'Bus definition document',
  required: ['busDefinition'],
  properties: {
    busDefinition: busDefinition
  }
};

},{"./primitive.js":13}],3:[function(require,module,exports){
'use strict';

const {
  vendor, library, name, version,
  id, displayName, description
} = require('./primitive.js');

const libraryRefType = {
  type: 'object',
  required: ['vendor', 'library', 'name', 'version'],
  properties: {
    vendor, library, name, version
  }
};

module.exports = {
  type: 'object',
  title: 'Bus interface',
  required: ['name', 'busType'],
  properties: {
    name, displayName, description, // nameGroup
    interfaceMode: {
      enum: ['initiator', 'target', 'monitor', null]
    },
    memoryMapRef: {type: 'string'},
    busType: {
      oneOf: [
        libraryRefType,
        {type: 'string'} // non standard bus interfaces
      ]
    },
    abstractionTypes: {
      type: 'array',
      items: {
        type: 'object',
        // required: ['viewRef'],
        properties: {
          viewRef: id,
          portMaps: {
            oneOf: [{
              type: 'object',
              patternProperties: {
                '.+': {'$ref': 'defs#/bundle'}
              }
            }, {
              type: 'array',
              items: {
                type: 'string'
              }
            }]
          }
        }
      }
    }
  }
};

},{"./primitive.js":13}],4:[function(require,module,exports){
'use strict';

module.exports = {
  type: 'object',
  title: 'Catalog document',
  properties: {
    catalog: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: {$ref: 'defs#/component'}
        },
        designs: {
          type: 'array',
          items: {$ref: 'defs#/design'}
        },
        busDefinitions: {
          type: 'array',
          items: {$ref: 'defs#/abstractionDefinition'}
        }
      }
    }
  },
  required: ['catalog']
};

},{}],5:[function(require,module,exports){
'use strict';

const {
  name, version, vendor, library,
  uint, description, displayName
} = require('./primitive.js');
// const register = require('./register.js');


const wire = {
  oneOf: [{
    type: 'integer'
  }, {
    type: 'string'
  }, {
    type: 'object',
    required: ['direction', 'width'],
    properties: {
      direction: { enum: ['in', 'out', 'inout'] },
      width: {
        oneOf: [
          {
            type: 'integer',
            minimum: 1
            // maximum: 65536 // FIXME unbound wire width
          },
          {
            type: 'string'
          }
        ]
      },
      analog: { enum: ['in', 'out', 'inout'] },
      displayName,
      description
    }
  }]
};

// Each port element describes a single external port on the component.
const ports = {
  title: 'Ports',
  oneOf: [{
    // Main port format:  "pin_name": width +- direction
    type: 'object',
    patternProperties: {
      '.+': wire
    }
  }, {
    // Elaborate port format
    type: 'array',
    uniqueItemProperties: ['name'],
    items: {
      type: 'object',
      required: ['name', 'wire'],
      properties: {
        name, // unique name within the containing ports element
        wire
      }
    }
  }]
};

const component = {
  type: 'object',
  required: ['vendor', 'library', 'name', 'version'],
  properties: {
    vendor, library, name, version,
    busInterfaces: {
      type: 'array',
      uniqueItemProperties: ['name'],
      items: {$ref: 'defs#/busInterface'}
    },
    model: {
      type: 'object',
      required: ['ports'],
      properties: {
        ports: ports
      }
    },
    addressSpaces: {
      type: 'array',
      uniqueItemProperties: ['name'],
      items: {
        type: 'object',
        title: 'Address space',
        required: ['name', 'range', 'width'],
        properties: {
          name,
          range: uint,
          width: uint
        }
      }
    },
    memoryMaps: {
      type: 'array',
      uniqueItemProperties: ['name'],
      items: {$ref: 'defs#/memoryMap'}
    },
    componentGenerators: { type: 'array' },
    fileSets: {
      type: 'object'
    },
    parameters: {
      type: 'array'
    }
  }
};

module.exports = {
  type: 'object',
  title: 'Component document',
  description: `
Component document collects information about a single hardware block without
expressing internal structure or hierarchy. Component document expressing following aspects:
* name, version
* top level ports
* parameter schema
* bus interfaces
* memory regions
* registers
* clocks, resets
* block generation flow
* references to implementation, documentation, tests
`,
  required: ['component'],
  properties: {
    component: component
  }
};

},{"./primitive.js":13}],6:[function(require,module,exports){
'use strict';

const component = require('./component.js');
const design = require('./design.js');
const catalog = require('./catalog.js');
const abstractionDefinition = require('./abstractionDefinition.js');
const busDefinition = require('./busDefinition.js');

const register = require('./register.js');
const busInterface = require('./busInterface.js');
const memoryMap = require('./memoryMap.js');

// const {name} = require('./primitive.js');

// const portMap = {
//   type: 'object',
//   properties: {
//     logicalPort: {
//       type: 'object',
//       required: ['name'],
//       properties: {
//         name
//       }
//     },
//     physicalPort: {
//       type: 'object',
//       required: ['name'],
//       properties: {
//         name
//       }
//     },
//     logicalTieOff: {
//       type: 'integer',
//       minimum: 0
//     }
//   },
//   oneOf: [
//     {
//       required: ['logicalPort', 'physicalPort']
//     },
//     {
//       required: ['logicalPort', 'logicalTieOff']
//     }
//   ]
// };

const bundle = {
  oneOf: [{
    type: 'string'
  }, {
    type: 'array',
    items: {
      type: 'string'
    }
  }, {
    type: 'object',
    patternProperties: {
      '.+': {'$ref': 'defs#/bundle'}
    }
  }]
};

module.exports = {
  '$id': 'defs',
  catalog,
  component,
  design,
  abstractionDefinition,
  busDefinition,

  busInterface,
  memoryMap,
  register,
  bundle
};

},{"./abstractionDefinition.js":1,"./busDefinition.js":2,"./busInterface.js":3,"./catalog.js":4,"./component.js":5,"./design.js":7,"./memoryMap.js":11,"./register.js":14}],7:[function(require,module,exports){
'use strict';

const {vendor, library, name, version, id} = require('./primitive.js');

const componentRef = {type: 'object'};

const portRef = id;

// -----------------------------------------------------------------------------

const instance = {
  type: 'object', properties: {
    name,
    ref: {type: 'object'}
  },
  required: ['name', 'ref']
};

const instances = {
  type: 'array',
  uniqueItemProperties: ['name'],
  items: instance
};

// -----------------------------------------------------------------------------

const instanceBus = {
  type: 'array', items: {type: 'string'},
  minItems: 2, maxItems: 2
};

// -----------------------------------------------------------------------------

const connection = {
  type: 'object', properties: {
    name,
    source: instanceBus,
    target: instanceBus,
    import: name,
    export: name
  }
  // required: ['name']
};

const connections = {
  type: 'array', items: connection
};
// -----------------------------------------------------------------------------

const portReference = {
  type: 'object',
  oneOf: [{
    properties: {
      kind: {enum: ['internal']},
      componentRef,
      portRef
    },
    required: ['portRef', 'componentRef']
  }, {
    properties: {
      kind: {enum: ['extrenal']},
      portRef
    },
    required: ['portRef']
  }]
};

const portReferences = {type: 'array', items: portReference};

const adHocConnection = {
  type: 'object',
  properties: {
    name,
    portReferences
  }
};

const adHocConnections = {
  type: 'array',
  items: adHocConnection
};
// -----------------------------------------------------------------------------

const design = {
  type: 'object',
  properties: {
    vendor, library, name, version,
    instances,
    connections,
    adHocConnections
  },
  required: ['vendor', 'library', 'name', 'version']
};

module.exports = {
  type: 'object',
  title: 'Desgin document',
  properties: {
    design
  },
  required: ['design']
};

},{"./primitive.js":13}],8:[function(require,module,exports){
'use strict';

const {
  name, int, description, displayName
} = require('./primitive.js');

const enumeratedValue = {
  type: 'object',
  title: 'Enumerated values',
  required: ['name', 'value'],
  properties: {
    name,
    description,
    displayName,
    // usage
    value: int
  }
};

const enumeratedValues = {
  type: 'array',
  uniqueItemProperties: ['name'],
  items: enumeratedValue
};

module.exports = enumeratedValues;

},{"./primitive.js":13}],9:[function(require,module,exports){
'use strict';

const {name, uint, int, access, expression, description} = require('./primitive.js');
const enumeratedValues = require('./enumeratedValues.js');

const modifiedWriteValue = {
  description: 'manipulation of data written to a field',
  enum: [
    'oneToClear',
    'oneToSet',
    'oneToToggle',
    'zeroToClear',
    'zeroToSet',
    'zeroToToggle',
    'clear',
    'set',
    'modify'
  ]
};

const readAction = {
  description: 'an action that happens to a field after a read operation happens',
  enum: [
    'clear',
    'set',
    'modify'
  ]
};

const field = {
  type: 'object',
  title: 'Register field',
  required: ['name', 'bitOffset', 'bitWidth'],
  properties: {
    name,
    description,
    bitOffset: {oneOf: [expression, uint]}, // base % regWidth in bits
    resetValue: int, // ipxactish
    // resetMask // ipxactish
    bitWidth:  {oneOf: [expression, uint]}, // in bits
    volatile: { type: 'boolean' },
    access,
    enumeratedValues,
    modifiedWriteValue,
    readAction,
    testable: { type: 'boolean' }, // default true
    reserved: { type: 'boolean' } // ipxactish
  }
};

module.exports = field;

},{"./enumeratedValues.js":8,"./primitive.js":13}],10:[function(require,module,exports){
'use strict';

const pkg = require('../package.json');
const catalog = require('./catalog.js');
const component = require('./component.js');
const design = require('./design.js');
const abstractionDefinition = require('./abstractionDefinition.js');
const busDefinition = require('./busDefinition.js');
const defs = require('./defs.js');

exports.version = pkg.version;
exports.any = {
  oneOf: [
    catalog,
    component,
    design,
    abstractionDefinition,
    busDefinition
  ]
};
exports.component = component;
exports.abstractionDefinition = abstractionDefinition;
exports.defs = defs;

},{"../package.json":16,"./abstractionDefinition.js":1,"./busDefinition.js":2,"./catalog.js":4,"./component.js":5,"./defs.js":6,"./design.js":7}],11:[function(require,module,exports){
'use strict';

const {name, uint, access} = require('./primitive.js');
const registerFile = require('./registerFile.js');

module.exports = {
  type: 'object',
  title: 'Memory map',
  required: ['name', 'addressBlocks'],
  properties: {
    name,
    addressUnitBits: {
      enum: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
      default: 8
    },
    addressBlocks: {
      type: 'array',
      uniqueItemProperties: ['name'],
      items: {
        type: 'object',
        title: 'Address block',
        required: ['name', 'baseAddress', 'range', 'width'],
        properties: {
          name,
          baseAddress: uint,
          range: uint,
          width: uint,
          usage: { enum: ['memory', 'register'] },
          volatile: { type: 'boolean' },
          access: access,
          registers: {
            type: 'array',
            uniqueItemProperties: ['name'],
            items: {$ref: 'defs#/register'}
          },
          registerFiles: {
            type: 'array',
            uniqueItemProperties: ['name'],
            items: registerFile
          }
        }
      }
    }
  }
};

},{"./primitive.js":13,"./registerFile.js":15}],12:[function(require,module,exports){
'use strict';

let meta;

const simpleTypes = {
  enum: [
    'array',
    'boolean',
    'integer',
    'null',
    'number',
    'object',
    'string'
  ]
};

const schemaArray = {
  type: 'array',
  minItems: 1,
  items: meta
};

meta = {
  type: 'object',
  properties: {
    type: simpleTypes,
    description: {type: 'string'},
    properties: {
      type: 'object',
      additionalProperties: meta
    },
    allOf: schemaArray,
    anyOf: schemaArray,
    oneOf: schemaArray
  }
};

module.exports = meta;

},{}],13:[function(require,module,exports){
'use strict';

exports.name = {
  type: 'string',
  minLength: 1,
  maxLength: 256,
  pattern: '^[_:A-Za-z][-._:A-Za-z0-9]*$'
};

exports.expression = {
  type: 'string',
  minLength: 1,
  maxLength: 256
  // pattern: '^[a-zA-Z][:a-zA-Z0-9_]*$' // (a + 5)
};

exports.uint = {
  type: 'integer',
  minimum: 0
};

exports.int = {
  type: 'integer'
};

exports.access = {
  description: 'specifies the accessibility of the data in the address block',
  enum: [
    'read-write',
    'read-only',
    'write-only',
    'read-writeOnce',
    'writeOnce'
  ]
};

const id = {
  type: 'string',
  minLength: 1,
  maxLength: 256,
  pattern: '^[a-zA-Z][:a-zA-Z0-9_-]*$'
};

const uri = {
  type: 'string',
  minLength: 3,
  maxLength: 256,
  pattern: '^[a-zA-Z][a-zA-Z0-9_.-]*$'
};

exports.id = id;
exports.vendor = uri;
exports.library = id;
exports.version = {type: 'string'}; // FIXME semver
exports.description = {type: 'string'};
exports.displayName = {type: 'string'};

},{}],14:[function(require,module,exports){
'use strict';

const {
  name, uint, int, access, expression,
  description, displayName
} = require('./primitive.js');
const field = require('./field.js');

const register = {
  type: 'object',
  title: 'Register',
  required: ['name', 'addressOffset', 'size'],
  properties: {
    name,
    addressOffset: {oneOf: [expression, uint]}, // in memoryMaps[?].addressUnitBits
    size: {oneOf: [expression, uint]}, // regWidth in bits
    access: access,
    displayName,
    description,
    fields: {
      type: 'array',
      uniqueItemProperties: ['name'],
      items: field
    },
    resetValue: int // spiritual
  }
};

module.exports = register;

},{"./field.js":9,"./primitive.js":13}],15:[function(require,module,exports){
'use strict';

const {name, uint, expression} = require('./primitive.js');

const registerFile = {
  type: 'object',
  title: 'Register file',
  required: ['name', 'addressOffset', 'range'],
  properties: {
    name,
    // accessHandles // ipxactish
    // isPresent // ipxactish
    // dim: uint
    addressOffset: {oneOf: [expression, uint]}, // in memoryMaps[?].addressUnitBits
    // parameters
    range: uint,
    registers: {
      type: 'array',
      uniqueItemProperties: ['name'],
      items: {$ref: 'defs#/register'}
    }
    // Handle recursive definitions
    // registerFiles: {
    //   type: 'array',
    //   items: registerFile
    // }
  }
};

module.exports = registerFile;

},{"./primitive.js":13}],16:[function(require,module,exports){
module.exports={
  "name": "duh-schema",
  "version": "0.9.16",
  "description": "DUH Schema",
  "main": "lib/index.js",
  "unpkg": "dist/schema.js",
  "scripts": {
    "test": "eslint lib/ test/ && nyc -r=text -r=lcov mocha",
    "browserify": "browserify --standalone schema lib/index.js > dist/schema.js",
    "prepare": "node bin/prepare.js && npm run browserify"
  },
  "files": [
    "lib",
    "dist"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sifive/duh-schema.git"
  },
  "author": "SiFive",
  "license": "Apache-2.0",
  "bugs": {
    "url": "https://github.com/sifive/duh-schema/issues"
  },
  "homepage": "https://github.com/sifive/duh-schema#readme",
  "engines": {
    "node": ">=8"
  },
  "devDependencies": {
    "@drom/eslint-config": "0.10.0",
    "browserify": "^16.2.2",
    "ajv": "^6.12.2",
    "chai": "^4.2.0",
    "coveralls": "^3.1.0",
    "eslint": "^6.8.0",
    "fs-extra": "^8.1.0",
    "mocha": "^7.2.0",
    "nyc": "^15.1.0"
  },
  "eslintConfig": {
    "extends": "@drom/eslint-config/eslint4/node8"
  }
}

},{}]},{},[10])(10)
});
