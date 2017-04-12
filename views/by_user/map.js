function(doc) {
  const time = new Date(doc.created_at).getTime();
  emit(['@' + doc.user, time]);
  if (doc.text) {
    for each (mention in doc.text.match(/@\w+/g)) {
      emit([mention, time]);
    }
  }
}
