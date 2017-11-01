import { utcParse } from 'd3'

const toUtcDate = utcParse('%s')

export default function dateParser(unix) {
  //return toUtcDate(Number(unix))
  return new Date(Number(unix)*1000)
}
