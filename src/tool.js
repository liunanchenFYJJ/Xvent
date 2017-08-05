export function toArray(val) {
  return [].concat(val)
}

export function generateSubscriber(action) {
  let observer = {}
  if (typeof action === 'function') {
    observer.next = action
  } else {
    observer = action
  }
  return observer
}

export function pub(controller, flow, value) {
  controller.$flows[flow].next(value)
}

export function sub(controller, flow, observer) {
  let subscription = controller.$flows[flow].subscribe(observer)
  controller.$listeners[flow].push({
    subscription,
    observer,
  })
  return subscription
}

export function empty() {
}