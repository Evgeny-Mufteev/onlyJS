window.addEventListener("load", () => {

  // Открытие выпадающего меню
  const dropdownMenu = () => {
    const btn = document.querySelectorAll(".clio-dropdown-menu");
    const menu = document.querySelector(".clio-sidenav");
    btn.forEach((item) => {
      item.addEventListener("click", () => {
        menu.classList.toggle("active"),
          document.body.classList.toggle("no-scroll");
      });
    });
  };
  dropdownMenu();

  // Раскрытие вложенного меню
  const delegate = (el) => {
    el = el.target;

    if (el.closest(".clio-sidenav__dropdown-btn") && !el.closest(".clio-sidenav__dropdown-btn.active")) {
      // 
      document.querySelectorAll(".clio-sidenav__dropdown-btn").forEach(el => {
        el.classList.remove("active");
        let scrollHeight = el.closest(".clio-sidenav__dropdown-btn");
        scrollHeight.querySelector(".clio-dropdown-container").style.maxHeight = null;
      });

      let scrollHeight = el.closest(".clio-sidenav__dropdown-btn");
      el.closest(".clio-sidenav__dropdown-btn").classList.add("active");
      scrollHeight.querySelector(".clio-dropdown-container").style.maxHeight =
        scrollHeight.querySelector(".clio-dropdown-container").scrollHeight + "px";
    } else if ( el.closest(".clio-sidenav__dropdown-btn") && !el.closest(".clio-dropdown-container")) {
      // 
      el.closest(".clio-sidenav__dropdown-btn").classList.remove("active");
      let scrollHeight = el.closest(".clio-sidenav__dropdown-btn");
      scrollHeight.querySelector(".clio-dropdown-container").style.maxHeight = null;
    }
    if (!el.closest(".clio-sidenav__dropdown-btn")) {
      // 
      document.querySelectorAll(".clio-sidenav__dropdown-btn").forEach(el => {
        el.classList.remove("active");
        let scrollHeight = el.closest(".clio-sidenav__dropdown-btn");
        scrollHeight.querySelector(".clio-dropdown-container").style.maxHeight = null;
      });
    }
  }
  document.addEventListener("click", delegate);

  // Переключение табов в форме заказа
  const tabsHandler = (tabs, btns, tabsContent) => {
    if (document.querySelector(".clio-order-form")) {
      tabs = document.querySelector(tabs);
      btns = tabs.querySelectorAll(btns);
      tabsContent = tabs.querySelectorAll(tabsContent);

      function change3(arr, i) {
        arr.forEach((item) => {
          item.forEach((i) => {
            i.classList.remove("active");
          });
          item[i].classList.add("active");
        });
      }

      for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", () => {
          change3([btns, tabsContent], i);
        });
      }
    }
  };
  tabsHandler(".clio-order-tabs", ".clio-input-raduio-wrap", ".clio-tabs-content");
  tabsHandler(".clio-order-tabs_method", ".clio-input-raduio-wrap_method-obtaining", ".clio-tabs-content_method");

  // изменение видимости пунктов доставки при выборе типа покупателя
  const changingDeliveryPoints = () => {
    if (document.querySelector(".clio-order-form")) {
      // ищу все способы доставки включая скрытые
      const arrShippingMethods = document.querySelectorAll(".clio-input-raduio-wrap_method-obtaining");
      const arrHiddenTypes = document.querySelectorAll(".clio-none");

      const jurPerson = document.getElementById("clio-legal-entity");
      const epPerson = document.getElementById("clio-ep");
      const fizPerson = document.getElementById("clio-individual");

      jurPerson.addEventListener("change", () => {
        for (let el of arrShippingMethods) {
          el.classList.remove("clio-none");
        }
        changesTextPayment(".clio-payment-card-text");
      });

      epPerson.addEventListener("change", () => {
        for (let el of arrShippingMethods) {
          el.classList.remove("clio-none");
        }
        changesTextPayment(".clio-payment-card-text");
      });

      fizPerson.addEventListener("change", () => {
        for (let el of arrHiddenTypes) {
          el.classList.add("clio-none");
        }
        let getBtn = document.querySelector(".clio-payment-card-text");
        getBtn.innerHTML = "Интернет-эквайринг Альфа-Банк";
      });
    }
  };
  changingDeliveryPoints();

  // Изменение текста кнопки способа оплаты у юр лиц
  const changesTextPayment = (btn) => {
    let getBtn = document.querySelector(btn);
    getBtn.innerHTML = "Оплата банковского счета";
  };

  // Маска телефона
  const mask = (input) => {
    var matrix = "+7 (___) ___-__-__",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = input.value.replace(/\D/g, "");
    if (def.length >= val.length) val = def;
    input.value = matrix.replace(/./g, function (a) {
      return /[_\d]/.test(a) && i < val.length
        ? val.charAt(i++)
        : i >= val.length
        ? ""
        : a;
    });
  };
  document.querySelectorAll(".clio-mask-number").forEach((item) =>
    item.addEventListener("click", function () {
      item.addEventListener("input", mask.bind(null, item), false);
      item.addEventListener("focus", mask.bind(null, item), false);
      item.addEventListener("blur", mask.bind(null, item), false);
    })
  );

  // Проверка обязательных инпутов
  const checkingRequiredInputs = (form, inputs, el) => {
    form = document.querySelector(form);
    inputs = form.querySelectorAll(inputs);
    let error = false;

    for (let input of inputs) {

      if(input.closest(".clio-tabs-content.active")){
        if(input.value === "") {
          input.classList.add("error");
          error = true;
        } else if(input.value !== '') {
          input.classList.remove("error");
        }
      }

      if(input.closest(".clio-tabs-content_method.active")){
        if(input.value === "") {
          input.classList.add("error");
          scroolTo()
          error = true;
        } else if(input.value !== '') {
          input.classList.remove("error");
        }
      }

    }
    return error
  };
  
  // Отправка формы
  const formHandler = () => {
    if (document.querySelector(".clio-order-form")) {
      let form = document.querySelector(".clio-order-form");

      form.addEventListener("submit", (el) => {
        el.preventDefault();
        let check =  checkingRequiredInputs(".clio-order-form", ".clio-required", el);

        if(!check) {
          deleteEmptyInputs();
          checkingPaymentMethod();
          console.log("отправлено");

        }
      });
    }
  };
  formHandler();

  // Удаляю не активные табы при отправке формы
  const selectedPersonType = (form, btns, tabs) => {
    const formPersonType = document.querySelector(form);
    const arrRadioBtn = formPersonType.querySelectorAll(btns);
    const arrTabsInput = document.querySelectorAll(tabs);

    arrRadioBtn.forEach((itemRadio) => {
      if (!itemRadio.classList.contains("active")) {
        itemRadio.remove();
      }
    });

    arrTabsInput.forEach((itemTab) => {
      if (!itemTab.classList.contains("active")) {
        itemTab.remove();
      }
    });
  };
  
  // удаляю пустые инпуты
  const deleteEmptyInputs = () => {
    selectedPersonType(".clio-order-info-details", ".clio-input-raduio-wrap", ".clio-tabs-content");
    selectedPersonType(".clio-order-production-method", ".clio-input-raduio-wrap_method-obtaining", ".clio-tabs-content_method");

    const allInputs = document.forms[0].getElementsByTagName("input");
    const allTextAreas = document.forms[0].getElementsByTagName("textarea");

    for (let input of allInputs) {
      if(!input.closest(".clio-tabs-content.active")){
        if (input.value === "") input.remove();
      }
    }

    for (let textArea of allTextAreas) {
      if (textArea.value === "") textArea.remove();
    }
  };

  // Проверка выбранного способа оплаты
  const checkingPaymentMethod = () => {
    const arrInputs = document.querySelectorAll("[data-method]");
    for (let input of arrInputs) {
      if (input.checked === false) input.remove();
    }
  }

  // Валидация типа инпута index
  const ValidationInputTypes = () => {
    const arrIndex = document.querySelectorAll("[data-index]");

    arrIndex.forEach((indexItem) => {
      indexItem.oninput = () => {
        indexItem.value = indexItem.value.substr(0, 6);
      };
    });
  };
  ValidationInputTypes();

  // Плавный переход к незаполненным инпутам
  const scroolTo = () => {
    const field = document.querySelector(".error");
    if(field) {
        field.scrollIntoView({
          behavior: "smooth", 
          block: "center", 
        }
        )
    }
  };

// Добавление ссылки на источник при копировании
  const addingLinkToCopy = () => {
    document.addEventListener("copy", (event) => {
      const container = document.body;
      const selection = window.getSelection();
      const text = selection.toString();
  
      if (text.length >= 5 && (container.contains(selection.anchorNode) || container.contains(selection.focusNode))) {
        event.clipboardData.setData("text/plain", `${text}\nИсточник: ${document.location.href}`);
        event.preventDefault();
      }
    });
  } 
  addingLinkToCopy() 

  // Открытие каталога
  // const startCatalog = (item, popupMenu, header, menu) => {   
  //   const menuItemCatalog = document.querySelector(item);
  //   const dropdownMenu = document.querySelector(popupMenu);
  //   const firstHeader = document.querySelector(header);
  //   const itemsMenu = document.querySelectorAll(menu);
    
  //   menuItemCatalog.addEventListener("mouseenter", () => {
  //    dropdownMenu.classList.add("active");
  //    addingHoverMenuItem();
  //   })
    
  //   itemsMenu.forEach(el => {
  //     el.addEventListener("mouseenter", {handleEvent: delClass, a: el, b:dropdownMenu});
  //   })

  //   function delClass(){
  //     this.b.classList.remove("active");
  //     this.a.removeEventListener("mouseenter", delClass);
  //   }

  //   firstHeader.addEventListener("mouseenter", () => {
  //    dropdownMenu.classList.remove("active");
  //   })

  //  dropdownMenu.addEventListener("mouseleave", () => {
  //    dropdownMenu.classList.remove("active");
  //    addingHoverMenuItem();
  //   })
  // }
  // startCatalog(".clio-catalog", ".clio-catalog-menu-wrapper", ".clio-header_first_part", ".clio-menu_item");
  // startCatalog(".clio-dropdown-company", ".clio-menu-submenu_company", ".clio-header_first_part", ".clio-menu_item");
  // startCatalog(".clio-dropdown-info", ".clio-menu-submenu_info", ".clio-header_first_part", ".clio-menu_item");


  // Раскрытие вложенного меню
  // const nestedMenu = () => {
  //   const dropdown = document.querySelectorAll(".clio-sidenav__dropdown-btn");
  //   for (i = 0; i < dropdown.length; i++) {
  //     dropdown[i].addEventListener("click", function () {
  //       this.classList.toggle("active");
  //       const dropdownContent = this.nextElementSibling;
  //       if (dropdownContent.style.display === "block") {
  //         dropdownContent.style.display = "none";
  //       } else {
  //         dropdownContent.style.display = "block";
  //       }
  //     });
  //   }
  // };
  // nestedMenu();



  // счетчик и подсчет цены
  const calcProductСounter = () => {
    if (document.querySelector(".clio-products-item-inner__price p")) {
      const arrProductItem = document.querySelectorAll(".clio-products-item");

      arrProductItem.forEach((productItem) => {
        // quantity
        const isPlus = productItem.querySelector(".clio-plus");
        const isMinus = productItem.querySelector(".clio-minus");
        const quantityInputProduct = productItem.querySelector(".clio-count");
        // prices
        let curentProductPrice = productItem.querySelector(".clio-products-item-inner__price p");
        let amountProductPrice = productItem.querySelector(".clio-products-item-inner__amount p");

        let slicePrice = +curentProductPrice.textContent.replace(/\s/g, "");
        let productTotalCost = slicePrice;

        // клики по кнопкам
        isPlus.addEventListener("click", () => {
          quantityInputProduct.value++;
          productTotalCost += slicePrice;
          amountProductPrice.textContent = productTotalCost;
          calcTotalPrice();
        });

        isMinus.addEventListener("click", () => {
          if (quantityInputProduct.value <= 1) {
            return;
          }
          quantityInputProduct.value--;
          productTotalCost -= slicePrice;
          amountProductPrice.textContent = productTotalCost;
          calcTotalPrice();
        });

        // измение инпута
        quantityInputProduct.addEventListener("input", () => {
          if (quantityInputProduct.value <= 1) {
            quantityInputProduct.value = 1
          }
          quantityInputProduct.value;
          let quantytiInputValue = slicePrice * +quantityInputProduct.value;
          amountProductPrice.textContent = quantytiInputValue;
          calcTotalPrice();
        });

      });
    }
  };
  calcProductСounter();

  // Подсчет итоговой цены
  const calcTotalPrice = () => {

    const allTotalPricesGoods = document.querySelectorAll(".clio-products-item-inner__amount p");
    const arrProductPrices = [];
    let totalPrice = document.querySelector(".clio-total-price > span");
    
    allTotalPricesGoods.forEach(priceEachProduct => {
      const reductionNumberItem = +priceEachProduct.textContent.replace(/\s/g, "");
      arrProductPrices.push(reductionNumberItem)
    })

    let calctotalPrice = arrProductPrices.reduce((sum, current) => sum + current, 0);
    totalPrice.textContent = calctotalPrice;
    
  }
  calcTotalPrice();

  // Подсчет количества товаров
  const calcNumberGoods = (goods, number) => {
      const allGoods = document.querySelectorAll(goods);
      const itemNumber = document.querySelector(number);
      itemNumber.textContent = allGoods.length
  };

  // Удаление товаров делегирование
  const removeProducts = (el) => {
    el = el.target;
    const allProductItem = document.querySelectorAll(".clio-products-item");

    // удаление по отдельности
    if (el.closest(".clio-products-item-remove")) {
      el.closest(".clio-products-item").remove();
      calcNumberGoods(".clio-products-item", ".clio-readr-order span");
      calcNumberGoods(".clio-products-item", ".clio-quantity-price span");
    }
    // удаление всех
    if (el.closest(".clio-clean_btn")) {
      allProductItem.forEach((item) => {
        item.remove();
        calcNumberGoods(".clio-products-item", ".clio-readr-order span");
        calcNumberGoods(".clio-products-item", ".clio-quantity-price span");
      });
    }
  };
  document.addEventListener("click", removeProducts);


  // Применение промокода
  const applyPromocode = () => {
    const inputPromocode = document.querySelector(".clio-promo-input");
    const promocodeApplyBtn = document.querySelector(".clio-promo-btn");
    const couponTextField = document.querySelector(".clio-text-promocode b");
    const blockPromocode = document.querySelector(".clio-promo-info_text");

    inputPromocode.addEventListener("input", () => {
      inputPromocode.value = inputPromocode.value.substr(0, 6);
    });

    promocodeApplyBtn.addEventListener("click", () => {
      let inputPromocodeValue = inputPromocode.value;
      if (inputPromocodeValue !== "") {
        blockPromocode.classList.add("active");
        couponTextField.textContent = inputPromocodeValue;
        inputPromocode.value = "";
      }
    });

    document.querySelector(".clio-promocode-remove").addEventListener("click", () => {
      blockPromocode.classList.remove("active");
    });
  };
  applyPromocode();

});

