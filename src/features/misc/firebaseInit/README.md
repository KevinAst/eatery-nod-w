# firebaseInit feature

The **firebaseInit** feature provides an API by which "firebase
dependent" services can initialize themselves:
`fassets.initFireBase()`.

The `initFireBase()` function will initialize firebase specifically
for the eatery-nod app.  It is designed to support multiple
invocations _(no-oping after the first invocation)_, because multiple
services may be "firebase dependent".
