function(doc) {
  emit('@' + doc.user);
  if (doc.text) {
    for each (mention in doc.text.match(/@\w+/g)) {
      emit(mention);
    }
  }
}
