function(doc) {
  const time = new Date(doc.created_at).getTime();
  if (doc.text) {
    for each (h in doc.text.match(/#\w+/g)) {
      emit([h, time]);
    }
  }
}
