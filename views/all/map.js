function(doc) {
  if (doc.created_at) {
    const time = new Date(doc.created_at).getTime();
    emit(time);
  }
}
