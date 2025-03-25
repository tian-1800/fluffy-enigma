document.addEventListener('DOMContentLoaded', function () {
  const variantSelects = document.querySelectorAll('select[name^="options"]');
  const productSelector = document.querySelector('.product-variant-selector');
  const productData = document.querySelector('[tian-product-variants]')?.innerHTML;
  console.log(JSON.parse(productData));

  function buildRequestUrlWithParams(url, optionValues) {
    const sectionId = productSelector.dataset.section;

    const params = [`section_id=${sectionId}`];

    if (optionValues.length) {
      params.push(`option_values=${optionValues.join(',')}`);
    }

    return `${url}?${params.join('&')}`;
  }

  function renderProductInfo({ requestUrl, callback }) {
    console.log(requestUrl);

    fetch(requestUrl)
      .then((response) => response.text())
      .then((responseText) => {
        this.pendingRequestUrl = null;
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        callback(html);
      })

      .catch((error) => {
        console.error(error);
      });
  }

  function updateMedia(html) {
    console.log('start updating media');

    const mediaGallerySource = document.querySelector('.product-image');
    const mediaGalleryDestination = html.querySelector('.product-image');

    if (mediaGallerySource && mediaGalleryDestination) {
      console.log('updating image');

      mediaGallerySource.innerHTML = mediaGalleryDestination.innerHTML;
    }
  }

  function getSelectedVariant(productInfoNode) {
    const selectedVariant = productInfoNode.querySelector('variant-selects [data-selected-variant]')?.innerHTML;
    // const productData = productInfoNode.querySelector('variant-selects [tian-product-variants]')?.innerHTML;
    // console.log(JSON.parse(productData));

    return !!selectedVariant ? JSON.parse(selectedVariant) : null;
  }
  function handleUpdateProductInfo(productUrl) {
    return (html) => {
      // const variant = getSelectedVariant(html);

      // Need to check these implementation
      // this.updateOptionValues(html);
      // this.updateURL(productUrl, variant?.id);
      // this.updateVariantInputs(variant?.id);

      // if (!variant) {
      // this.setUnavailable();
      //   return;
      // }

      // updateMedia(html);
      updateMedia(html);

      // this.productForm?.toggleSubmitButton(
      //   html.getElementById(`ProductSubmitButton-${this.sectionId}`)?.hasAttribute('disabled') ?? true,
      //   window.variantStrings.soldOut
      // );

      // publish(PUB_SUB_EVENTS.variantChange, {
      //   data: {
      //     sectionId: this.sectionId,
      //     html,
      //     variant,
      //   },
      // });
    };
  }
  function selectedOptionValues() {
    const optionsSelect = document.querySelectorAll('select[name^="options"] option[selected]');

    console.log(Array.from(optionsSelect));

    return Array.from(optionsSelect).map((select) => {
      return select.dataset.optionValueId;
    });

    // return Array.from(productSelector.querySelectorAll('select option[selected], fieldset input:checked')).map(
    //   ({ dataset }) => dataset.optionValueId
    // );
  }
  function handleOptionValueChange(selectedOptionValues) {
    // if (!this.contains(event.target)) return;

    // this.resetProductFormState();
    const productUrl = productSelector.dataset.url;
    // this.pendingRequestUrl = productUrl;
    // const shouldSwapProduct = this.dataset.url !== productUrl;
    // const shouldFetchFullPage = this.dataset.updateUrl === 'true' && shouldSwapProduct;

    renderProductInfo({
      requestUrl: buildRequestUrlWithParams(productUrl, selectedOptionValues),
      // targetId: target.id,
      callback: handleUpdateProductInfo(productUrl),
    });
  }

  // function updateImage() {
  //   const selectedOptions = Array.from(variantSelects).map((select) => select.value);
  //   const selectedVariant = productJson.variants.find((variant) => {
  //     return variant.options.every((option, index) => option === selectedOptions[index]);
  //   });

  //   if (selectedVariant && selectedVariant.image) {
  //     mainImage.src = selectedVariant.image.src;
  //   } else {
  //     mainImage.src = productJson.images[0].src;
  //   }
  // }

  // Initialize on load
  // updateImage();

  // Add event listeners
  variantSelects.forEach((select) => {
    select.addEventListener('change', ({ target }) => {
      console.log('select change', target);
      Array.from(target.options)
        .find((option) => option.getAttribute('selected'))
        .removeAttribute('selected');
      target.selectedOptions[0].setAttribute('selected', 'selected');

      handleOptionValueChange(selectedOptionValues());
    });
  });
});
