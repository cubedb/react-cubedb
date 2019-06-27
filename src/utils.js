// @flow

// TODO remove lodash
import { each, isObject, transform } from 'lodash';
import { utcParse, format } from 'd3';

export const dateParser = dt => {
  if (typeof dt === 'number' || typeof dt === 'string') {
    return new Date(Number(dt));
  }

  return dt;
};

export const roundDate = (date, timeUnit) => {
  const unixDate = date / 1000;
  const x = Math.round(unixDate / timeUnit);
  return dateParser(x * timeUnit);
};

export const saveData = (filename = String, blob = Blob) => {
  const uri = URL.createObjectURL(blob);
  const link = document.createElement('a');

  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = uri;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(uri);
  }
};

/**
 * Expecting
 * @param {[name|date]: {c}} serie
 * @param {[name|date]: {[name]: {c}}} serie
 *
 */

const hourParseTime = utcParse('%Y-%m-%d %H');
const dayParseTime = utcParse('%Y-%m-%d');

const formatKey = key => {
  return hourParseTime(key) || dayParseTime(key) || key;
};

export const normalizeData = (originalSerie, lookup = {}, stackLookup = {}) => {
  let max = 0;
  let total = 0;

  const serie = transform(
    originalSerie,
    (liveObject, step, key) => {
      const formattedKey = formatKey(key);
      if (isObject(step)) {
        if (step.hasOwnProperty('c')) {
          liveObject[formattedKey] = {
            c: step.c,
            name: lookup[key] || formattedKey,
            key: key
          };
        } else {
          liveObject[formattedKey] = {
            c: 0,
            key: key,
            name: lookup[key] || formattedKey,
            stack: {}
          };
          each(step, (substep, subkey) => {
            const formattedSubkey = formatKey(subkey);
            liveObject[formattedKey].c += substep.c;
            liveObject[formattedKey].stack[formattedSubkey] = {
              c: substep.c,
              name: stackLookup[subkey] || formattedSubkey,
              key: subkey
            };
          });
        }
        total += liveObject[formattedKey].c;
        max = liveObject[formattedKey].c > max ? liveObject[formattedKey].c : max;
      } else {
        total += step;
        max = step > max ? step : max;
        liveObject[formattedKey] = {
          c: step,
          key: key,
          name: lookup[key] || formattedKey,
          stack: {}
        };
      }
      return liveObject;
    },
    {}
  );

  return { serie, total, max };
};

export const numberFormat = format(',d');

export const getCommonPrefix = array => {
  // return empty string for arrays withe less then two elements
  if (!array || array.length <= 1) return ''; // Sorting an array and comparing the first and last elements
  var A = array.concat().sort(),
    a1 = A[0],
    a2 = A[A.length - 1],
    L = a1.length,
    i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  const prefix = a1.substring(0, i);
  // Now checking if it contains number and ends with _
  if (prefix[prefix.length - 1] === '_' && !/\d/.test(prefix)) return prefix;
  else return '';
};
