# public-assets
Public assets for general purpose
```scala
val underscoreSeparatedString = camelCaseString
  .replaceAll("([a-z])([A-Z0-9])", "$1_$2")
  .replaceAll("([A-Z0-9])([A-Z])(?=[a-z])", "$1_$2")
  .toLowerCase()
```
