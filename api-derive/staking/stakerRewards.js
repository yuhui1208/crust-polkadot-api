"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._stakerRewardsEras = _stakerRewardsEras;
exports._stakerRewards = _stakerRewards;
exports.stakerRewards = stakerRewards;
exports.stakerRewardsMultiEras = stakerRewardsMultiEras;
exports.stakerRewardsMulti = stakerRewardsMulti;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _bn = _interopRequireDefault(require("bn.js"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _util = require("@polkadot/util");

var _util2 = require("../util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const ZERO = new _bn.default(0);
const MIN_ONE = new _bn.default(-1);
const COMM_DIV = new _bn.default(1000000000);
const MAX_ERAS = new _bn.default(1000000000);

function parseRewards(api, stashId, [, erasPoints, erasPrefs, erasRewards], exposures) {
  return exposures.map(({
    era,
    isEmpty,
    isValidator,
    nominating,
    validators: eraValidators
  }) => {
    const {
      eraPoints,
      validators: allValPoints
    } = erasPoints.find(p => p.era.eq(era)) || {
      eraPoints: ZERO,
      validators: {}
    };
    const {
      eraReward
    } = erasRewards.find(r => r.era.eq(era)) || {
      eraReward: api.registry.createType('Balance')
    };
    const {
      validators: allValPrefs
    } = erasPrefs.find(p => p.era.eq(era)) || {
      validators: {}
    };
    const validators = {};
    const stakerId = stashId.toString();
    Object.entries(eraValidators).forEach(([validatorId, exposure]) => {
      var _allValPrefs$validato;

      const valPoints = allValPoints[validatorId] || ZERO;
      const valComm = ((_allValPrefs$validato = allValPrefs[validatorId]) === null || _allValPrefs$validato === void 0 ? void 0 : _allValPrefs$validato.commission.unwrap()) || ZERO;
      const expTotal = exposure.total.unwrap();
      let avail = ZERO;
      let value;

      if (!(expTotal.isZero() || valPoints.isZero() || eraPoints.isZero())) {
        avail = eraReward.mul(valPoints).div(eraPoints);
        const valCut = valComm.mul(avail).div(COMM_DIV);
        let staked;

        if (validatorId === stakerId) {
          staked = exposure.own.unwrap();
        } else {
          const stakerExp = exposure.others.find(({
            who
          }) => who.eq(stakerId));
          staked = stakerExp ? stakerExp.value.unwrap() : ZERO;
        }

        value = avail.sub(valCut).imul(staked).div(expTotal).iadd(validatorId === stakerId ? valCut : ZERO);
      }

      validators[validatorId] = {
        total: api.registry.createType('Balance', avail),
        value: api.registry.createType('Balance', value)
      };
    });
    return {
      era,
      eraReward,
      isEmpty,
      isValidator,
      nominating,
      validators
    };
  });
}

function uniqValidators(rewards) {
  const uniq = [];
  rewards.forEach(({
    validators
  }) => {
    Object.keys(validators).forEach(validatorId => {
      if (!uniq.includes(validatorId)) {
        uniq.push(validatorId);
      }
    });
  });
  return uniq;
}

function isOldLedger(ledger) {
  return !!(ledger === null || ledger === void 0 ? void 0 : ledger.lastReward);
}

function filterEra(era, stakingLedger) {
  return isOldLedger(stakingLedger) ? era.gt(stakingLedger.lastReward.unwrapOr(MIN_ONE)) : !stakingLedger.claimedRewards.some(e => e.eq(era));
}

function filterEras(eras, stakingLedger) {
  return eras.filter(era => filterEra(era, stakingLedger));
}

function filterRewards(api, eras, migrateEra, rewards, stakingLedger, withActive) {
  if (withActive) {
    return (0, _rxjs.of)(rewards);
  }

  const validators = uniqValidators(rewards);
  return ((0, _util.isFunction)(api.tx.staking.payoutStakers) ? api.derive.staking.queryMulti(validators) : (0, _rxjs.of)([])).pipe((0, _operators.map)(queryValidators => {
    const filter = withActive ? eras : filterEras(eras, stakingLedger);
    return rewards.filter(({
      isEmpty
    }) => !isEmpty).filter(reward => {
      if (!filter.some(filter => reward.era.eq(filter))) {
        return false;
      } else if (reward.era.lt(migrateEra)) {
        // we filter again here, the actual ledger may have changed, e.g. something has been claimed
        return filterEra(reward.era, stakingLedger);
      }

      reward.isStakerPayout = true;
      const rm = [];
      Object.keys(reward.validators).forEach(validatorId => {
        const index = validators.indexOf(validatorId);

        if (index !== -1) {
          const valLedger = queryValidators[index].stakingLedger;

          if (valLedger === null || valLedger === void 0 ? void 0 : valLedger.claimedRewards.some(era => reward.era.eq(era))) {
            rm.push(validatorId);
          }
        }
      });
      rm.forEach(validatorId => {
        delete reward.validators[validatorId];
      });
      return true;
    }).filter(({
      validators
    }) => Object.keys(validators).length !== 0).map(reward => _objectSpread(_objectSpread({}, reward), {}, {
      nominators: reward.nominating.filter(({
        validatorId
      }) => !!reward.validators[validatorId])
    }));
  }));
}

function _stakerRewardsEras(instanceId, api) {
  return (0, _util2.memo)(instanceId, (eras, withActive) => (0, _rxjs.combineLatest)([(0, _util.isFunction)(api.query.staking.migrateEra) ? api.query.staking.migrateEra() : (0, _rxjs.of)({
    unwrapOr: () => (0, _util.isFunction)(api.tx.staking.payoutStakers) ? ZERO : MAX_ERAS
  }), api.derive.staking._erasPoints(eras, withActive), api.derive.staking._erasPrefs(eras, withActive), api.derive.staking._erasRewards(eras, withActive)]));
}

function _stakerRewards(instanceId, api) {
  return (0, _util2.memo)(instanceId, (accountId, eras, withActive) => (0, _rxjs.combineLatest)([api.derive.staking.query(accountId), api.derive.staking._stakerExposure(accountId, eras, withActive), api.derive.staking._stakerRewardsEras(eras, withActive)]).pipe((0, _operators.switchMap)(([{
    stakingLedger,
    stashId
  }, exposures, erasResult]) => {
    const migrateEra = erasResult[0].unwrapOr(ZERO);

    if (!stashId || !stakingLedger) {
      return (0, _rxjs.of)([]);
    }

    return filterRewards(api, eras, migrateEra, parseRewards(api, stashId, erasResult, exposures), stakingLedger, withActive);
  })));
}

function stakerRewards(instanceId, api) {
  return (0, _util2.memo)(instanceId, (accountId, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _operators.switchMap)(eras => api.derive.staking._stakerRewards(accountId, eras, withActive))));
}

function stakerRewardsMultiEras(instanceId, api) {
  return (0, _util2.memo)(instanceId, (accountIds, eras) => accountIds.length && eras.length ? (0, _rxjs.combineLatest)(accountIds.map(acc => api.derive.staking._stakerRewards(acc, eras, false))) : (0, _rxjs.of)([]));
}

function stakerRewardsMulti(instanceId, api) {
  return (0, _util2.memo)(instanceId, (accountIds, withActive = false) => api.derive.staking.erasHistoric(withActive).pipe((0, _operators.switchMap)(eras => api.derive.staking.stakerRewardsMultiEras(accountIds, eras))));
}