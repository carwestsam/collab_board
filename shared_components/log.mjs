export default function log () {
  if (process.env.NODE_ENV === 'development') {
    console.log('->')
    Object.values(arguments).map(v => console.log(v))
  }
}
