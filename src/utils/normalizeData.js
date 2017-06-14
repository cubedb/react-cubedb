import { each, isObject, transform } from 'lodash'
import { utcParse } from 'd3'
import { isFunction, isNumber } from 'lodash'

/**
 * Expecting 
 * @param {[name|date]: {c}} serie
 * @param {[name|date]: {[name]: {c}}} serie 
 * 
 */

const hourParseTime = utcParse("%Y-%m-%d %H")
const dayParseTime = utcParse("%Y-%m-%d")

function formatKey(key) {
  return hourParseTime(key) || dayParseTime(key) || key
}

export default function (originalSerie, lookup = {}, stackLookup = {}) {
  let max = 0
  let total = 0
  
  let serie = transform(originalSerie, (liveObject, step, key) => {
                let formattedKey = formatKey(key)
                if(isObject(step)) {
                  if(step.hasOwnProperty('c')) {
                    liveObject[formattedKey] = {
                      c: step.c,
                      name: lookup[key] || formattedKey,
                      key: key
                    }
                  } else {
                    liveObject[formattedKey] = {
                      c: 0,
                      key: key,
                      name: lookup[key] || formattedKey,
                      stack: {}
                    }
                    each(step, (substep, subkey) => {
                      let formattedSubkey = formatKey(subkey)
                      liveObject[formattedKey].c += substep.c
                      liveObject[formattedKey].stack[formattedSubkey] = {
                        c: substep.c,
                        name: stackLookup[subkey] || formattedSubkey,
                        key: subkey
                      }
                    })
                  }
                  total += liveObject[formattedKey].c
                  max = liveObject[formattedKey].c > max ? liveObject[formattedKey].c : max
                } else {
                  total += step
                  max = step > max ? step : max
                  liveObject[formattedKey] = {
                    c: step,
                    key: key,
                    name: lookup[key] || formattedKey,
                    stack: {}
                  }
                }
                return liveObject
              }, {})

  return {serie, total, max}
}
