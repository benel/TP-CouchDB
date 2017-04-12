function(doc) {
  if (doc.text) {
    for each (h in doc.text.match(/#\w+/g)) {
      emit(h); 
    }
  }
}
