Уже на готовой верстке стояла задача добавить префикс ко всем классам на странице, инструменты редактора позволяли добавить префикс лишь 
к первмому классу,  для решения данной задачи была написана функция которая получает все классы в дом дереве, кладет их в новый массив 
и добавляет префикс "clio-":

window.addEventListener("load", () => {
  const all = document.querySelectorAll("*");

  all.forEach((el) => {
    if(el.classList) {
      const arrNewClass = [];

      while (el.classList[0]) {
        arrNewClass.push("clio-" + el.classList[0]);
        el.classList.remove(el.classList[0]);
      }

      arrNewClass.forEach((newClass) => {
        el.classList.add(newClass);
      })
    }
  })
})

Основной упор был сделан на JavaScript код он максимально изолирован, а вся логика разбита по блокам.
