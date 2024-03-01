function selectSection(j) {
  const parent = document.getElementById("timeLine");
  for (let i = 0; i < parent.children.length; i++) {
    parent.children[i].classList.remove("timeLine__div--selected");
    parent.children[i].children[1].classList.remove("timeLine__span--selected");
  }
  parent.children[j].classList.add("timeLine__div--selected");
  parent.children[j].children[1].classList.add("timeLine__span--selected");
}
