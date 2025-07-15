function addSpansBeforeFuture() {
  const classes = ['ms', 'min', 'hrs', 'days', 'years', 'signs', 'mayan'];
  const target = document.getElementById('get-ready-for');
  if (!target) return;
  classes.forEach((cls) => {
    const span = document.createElement('span');
    span.classList.add(cls);
    target.parentNode.insertBefore(span, target);
  });
}

addSpansBeforeFuture();
