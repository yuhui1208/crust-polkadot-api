"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeRegistry = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldLooseBase2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseBase"));

var _classPrivateFieldLooseKey2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldLooseKey"));

var _fromMetadata = _interopRequireDefault(require("@polkadot/metadata/Decorated/extrinsics/fromMetadata"));

var _util = require("@polkadot/util");

var _utilCrypto = require("@polkadot/util-crypto");

var _Raw = _interopRequireDefault(require("../codec/Raw"));

var _signedExtensions2 = require("../extrinsic/signedExtensions");

var _Event = require("../generic/Event");

var _DoNotConstruct = _interopRequireDefault(require("../primitive/DoNotConstruct"));

var _createClass = require("./createClass");

var _createType = require("./createType");

var _getTypeDef = require("./getTypeDef");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// create error mapping from metadata
function decorateErrors(_, metadata, metadataErrors) {
  // decorate the errors
  metadata.asLatest.modules.forEach((section, _sectionIndex) => {
    const sectionIndex = section.index.eqn(255) ? _sectionIndex : section.index.toNumber();
    const sectionName = (0, _util.stringCamelCase)(section.name.toString());
    section.errors.forEach(({
      documentation,
      name
    }, index) => {
      const eventIndex = new Uint8Array([sectionIndex, index]);
      metadataErrors[(0, _util.u8aToHex)(eventIndex)] = {
        documentation: documentation.map(d => d.toString()),
        index,
        name: name.toString(),
        section: sectionName
      };
    });
  });
} // create event classes from metadata


function decorateEvents(registry, metadata, metadataEvents) {
  // decorate the events
  metadata.asLatest.modules.filter(({
    events
  }) => events.isSome).forEach((section, _sectionIndex) => {
    const sectionIndex = section.index.eqn(255) ? _sectionIndex : section.index.toNumber();
    const sectionName = (0, _util.stringCamelCase)(section.name.toString());
    section.events.unwrap().forEach((meta, methodIndex) => {
      const methodName = meta.name.toString();
      const eventIndex = new Uint8Array([sectionIndex, methodIndex]); // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access

      const typeDef = meta.args.map(arg => (0, _getTypeDef.getTypeDef)(arg.toString()));
      let Types = [];

      try {
        Types = typeDef.map(typeDef => (0, _createClass.getTypeClass)(registry, typeDef));
      } catch (error) {
        console.error(error);
      }

      metadataEvents[(0, _util.u8aToHex)(eventIndex)] = class extends _Event.EventData {
        constructor(registry, value) {
          super(registry, Types, value, typeDef, meta, sectionName, methodName);
        }

      };
    });
  });
} // create extrinsic mapping from metadata


function decorateExtrinsics(registry, metadata, metadataCalls) {
  const extrinsics = (0, _fromMetadata.default)(registry, metadata); // decorate the extrinsics

  Object.values(extrinsics).forEach(methods => Object.values(methods).forEach(method => {
    metadataCalls[(0, _util.u8aToHex)(method.callIndex)] = method;
  }));
}

var _classes = (0, _classPrivateFieldLooseKey2.default)("classes");

var _definitions = (0, _classPrivateFieldLooseKey2.default)("definitions");

var _metadataCalls = (0, _classPrivateFieldLooseKey2.default)("metadataCalls");

var _metadataErrors = (0, _classPrivateFieldLooseKey2.default)("metadataErrors");

var _metadataEvents = (0, _classPrivateFieldLooseKey2.default)("metadataEvents");

var _unknownTypes = (0, _classPrivateFieldLooseKey2.default)("unknownTypes");

var _chainProperties = (0, _classPrivateFieldLooseKey2.default)("chainProperties");

var _hasher = (0, _classPrivateFieldLooseKey2.default)("hasher");

var _knownTypes = (0, _classPrivateFieldLooseKey2.default)("knownTypes");

var _signedExtensions = (0, _classPrivateFieldLooseKey2.default)("signedExtensions");

class TypeRegistry {
  constructor() {
    Object.defineProperty(this, _classes, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _definitions, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _metadataCalls, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _metadataErrors, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _metadataEvents, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _unknownTypes, {
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, _chainProperties, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _hasher, {
      writable: true,
      value: _utilCrypto.blake2AsU8a
    });
    Object.defineProperty(this, _knownTypes, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _signedExtensions, {
      writable: true,
      value: _signedExtensions2.defaultExtensions
    });

    // we only want to import these on creation, i.e. we want to avoid types
    // weird side-effects from circular references. (Since registry is injected
    // into types, this can  be a real concern now)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const baseTypes = require('../index.types'); // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment


    const definitions = require('../interfaces/definitions'); // since these are classes, they are injected first


    this.register(_objectSpread({
      Raw: _Raw.default
    }, baseTypes)); // since these are definitions, they would only get created when needed

    Object.values(definitions).forEach(({
      types
    }) => this.register(types));
  }

  get chainDecimals() {
    var _classPrivateFieldLoo;

    return ((_classPrivateFieldLoo = (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties]) === null || _classPrivateFieldLoo === void 0 ? void 0 : _classPrivateFieldLoo.tokenDecimals.isSome) ? (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties].tokenDecimals.unwrap().toNumber() : 12;
  }

  get chainSS58() {
    var _classPrivateFieldLoo2;

    return ((_classPrivateFieldLoo2 = (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties]) === null || _classPrivateFieldLoo2 === void 0 ? void 0 : _classPrivateFieldLoo2.ss58Format.isSome) ? (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties].ss58Format.unwrap().toNumber() : undefined;
  }

  get chainToken() {
    var _classPrivateFieldLoo3;

    return ((_classPrivateFieldLoo3 = (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties]) === null || _classPrivateFieldLoo3 === void 0 ? void 0 : _classPrivateFieldLoo3.tokenSymbol.isSome) ? (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties].tokenSymbol.unwrap().toString() : _util.formatBalance.getDefaults().unit;
  }

  get knownTypes() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _knownTypes)[_knownTypes];
  }

  get signedExtensions() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _signedExtensions)[_signedExtensions];
  }
  /**
   * @describe Creates an instance of the class
   */


  createClass(type) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (0, _createClass.createClass)(this, type);
  }
  /**
   * @description Creates an instance of a type as registered
   */


  createType(type, ...params) {
    return (0, _createType.createType)(this, type, ...params);
  } // find a specific call


  findMetaCall(callIndex) {
    const hexIndex = (0, _util.u8aToHex)(callIndex);

    const fn = (0, _classPrivateFieldLooseBase2.default)(this, _metadataCalls)[_metadataCalls][hexIndex];

    (0, _util.assert)(!(0, _util.isUndefined)(fn), `findMetaCall: Unable to find Call with index ${hexIndex}/[${callIndex.toString()}]`);
    return fn;
  } // finds an error


  findMetaError(errorIndex) {
    const hexIndex = (0, _util.u8aToHex)((0, _util.isU8a)(errorIndex) ? errorIndex : new Uint8Array([errorIndex.index.toNumber(), errorIndex.error.toNumber()]));

    const error = (0, _classPrivateFieldLooseBase2.default)(this, _metadataErrors)[_metadataErrors][hexIndex];

    (0, _util.assert)(!(0, _util.isUndefined)(error), `findMetaError: Unable to find Error with index ${hexIndex}/[${errorIndex.toString()}]`);
    return error;
  }

  findMetaEvent(eventIndex) {
    const hexIndex = (0, _util.u8aToHex)(eventIndex);

    const Event = (0, _classPrivateFieldLooseBase2.default)(this, _metadataEvents)[_metadataEvents][hexIndex];

    (0, _util.assert)(!(0, _util.isUndefined)(Event), `findMetaEvent: Unable to find Event with index ${hexIndex}/[${eventIndex.toString()}]`);
    return Event;
  }

  get(name, withUnknown) {
    let Type = (0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].get(name); // we have not already created the type, attempt it


    if (!Type) {
      const definition = (0, _classPrivateFieldLooseBase2.default)(this, _definitions)[_definitions].get(name);

      let BaseType; // we have a definition, so create the class now (lazily)

      if (definition) {
        BaseType = (0, _createClass.createClass)(this, definition);
      } else if (withUnknown) {
        console.warn(`Unable to resolve type ${name}, it will fail on construction`);

        (0, _classPrivateFieldLooseBase2.default)(this, _unknownTypes)[_unknownTypes].set(name, true);

        BaseType = _DoNotConstruct.default.with(name);
      }

      if (BaseType) {
        // NOTE If we didn't extend here, we would have strange artifacts. An example is
        // Balance, with this, new Balance() instanceof u128 is true, but Balance !== u128
        // Additionally, we now pass through the registry, which is a link to ourselves
        Type = class extends BaseType {};

        (0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].set(name, Type);
      }
    }

    return Type;
  }

  getChainProperties() {
    return (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties];
  }

  getClassName(clazz) {
    const entry = [...(0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].entries()].find(([, test]) => test === clazz);
    return entry ? entry[0] : undefined;
  }

  getDefinition(name) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _definitions)[_definitions].get(name);
  }

  getOrThrow(name, msg) {
    const Type = this.get(name);

    if ((0, _util.isUndefined)(Type)) {
      throw new Error(msg || `type ${name} not found`);
    }

    return Type;
  }

  getOrUnknown(name) {
    return this.get(name, true);
  }

  getSignedExtensionExtra() {
    return (0, _signedExtensions2.expandExtensionTypes)((0, _classPrivateFieldLooseBase2.default)(this, _signedExtensions)[_signedExtensions], 'extra');
  }

  getSignedExtensionTypes() {
    return (0, _signedExtensions2.expandExtensionTypes)((0, _classPrivateFieldLooseBase2.default)(this, _signedExtensions)[_signedExtensions], 'types');
  }

  hasClass(name) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].has(name);
  }

  hasDef(name) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _definitions)[_definitions].has(name);
  }

  hasType(name) {
    return !(0, _classPrivateFieldLooseBase2.default)(this, _unknownTypes)[_unknownTypes].get(name) && (this.hasClass(name) || this.hasDef(name));
  }

  hash(data) {
    return (0, _classPrivateFieldLooseBase2.default)(this, _hasher)[_hasher](data);
  }

  // eslint-disable-next-line no-dupe-class-members
  register(arg1, arg2) {
    // NOTE Constructors appear as functions here
    if ((0, _util.isFunction)(arg1)) {
      (0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].set(arg1.name, arg1);
    } else if ((0, _util.isString)(arg1)) {
      (0, _util.assert)((0, _util.isFunction)(arg2), `Expected class definition passed to '${arg1}' registration`);

      (0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].set(arg1, arg2);
    } else {
      this._registerObject(arg1);
    }
  }

  _registerObject(obj) {
    Object.entries(obj).forEach(([name, type]) => {
      if ((0, _util.isFunction)(type)) {
        // This _looks_ a bit funny, but `typeof Clazz === 'function'
        (0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].set(name, type);
      } else {
        const def = (0, _util.isString)(type) ? type : JSON.stringify(type); // we already have this type, remove the classes registered for it

        if ((0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].has(name)) {
          (0, _classPrivateFieldLooseBase2.default)(this, _classes)[_classes].delete(name);
        }

        (0, _classPrivateFieldLooseBase2.default)(this, _definitions)[_definitions].set(name, def);
      }
    });
  } // sets the chain properties


  setChainProperties(properties) {
    if (properties) {
      (0, _classPrivateFieldLooseBase2.default)(this, _chainProperties)[_chainProperties] = properties;
    }
  }

  setHasher(hasher = _utilCrypto.blake2AsU8a) {
    (0, _classPrivateFieldLooseBase2.default)(this, _hasher)[_hasher] = hasher;
  }

  setKnownTypes(knownTypes) {
    (0, _classPrivateFieldLooseBase2.default)(this, _knownTypes)[_knownTypes] = knownTypes;
  } // sets the metadata


  setMetadata(metadata, signedExtensions) {
    decorateExtrinsics(this, metadata, (0, _classPrivateFieldLooseBase2.default)(this, _metadataCalls)[_metadataCalls]);
    decorateErrors(this, metadata, (0, _classPrivateFieldLooseBase2.default)(this, _metadataErrors)[_metadataErrors]);
    decorateEvents(this, metadata, (0, _classPrivateFieldLooseBase2.default)(this, _metadataEvents)[_metadataEvents]); // setup the available extensions

    this.setSignedExtensions(signedExtensions || (metadata.asLatest.extrinsic.version.gt(_util.BN_ZERO) ? metadata.asLatest.extrinsic.signedExtensions.map(key => key.toString()) : _signedExtensions2.defaultExtensions));
  } // sets the available signed extensions


  setSignedExtensions(signedExtensions = _signedExtensions2.defaultExtensions) {
    (0, _classPrivateFieldLooseBase2.default)(this, _signedExtensions)[_signedExtensions] = signedExtensions;
    const unknown = (0, _signedExtensions2.findUnknownExtensions)((0, _classPrivateFieldLooseBase2.default)(this, _signedExtensions)[_signedExtensions]);

    if (unknown.length) {
      console.warn(`Unknown signed extensions ${unknown.join(', ')} found, treating them as no-effect`);
    }
  }

}

exports.TypeRegistry = TypeRegistry;