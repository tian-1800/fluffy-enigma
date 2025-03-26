// assets/test-product.js

document.addEventListener('DOMContentLoaded', () => {
  const variantSelects = document.querySelectorAll('select[name^="options"]');
  const productSelector = document.querySelector('.product-variant-selector');

  // Helper function to build the request URL with params
  const buildRequestUrlWithParams = (url, optionValues) => {
    const sectionId = productSelector.dataset.section;
    const params = [`section_id=${sectionId}`];

    if (optionValues.length > 0) {
      params.push(`option_values=${optionValues.join(',')}`);
    }

    return `${url}?${params.join('&')}`;
  };

  // Fetch and render product information
  const renderProductInfo = (requestUrl, render) => {
    fetch(requestUrl)
      .then((response) => response.text())
      .then((htmlText) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(htmlText, 'text/html');
        render(html);
      })
      .catch((error) => console.error('Error fetching product info:', error));
  };

  // Update image and variant id
  const updateMedia = (html) => {
    const mediaGallerySource = document.querySelector('.product-image');
    const mediaGalleryDestination = html.querySelector('.product-image');

    if (mediaGallerySource && mediaGalleryDestination) {
      mediaGallerySource.innerHTML = mediaGalleryDestination.innerHTML;
      mediaGallerySource.dataset.variantId = mediaGalleryDestination.dataset.variantId;
    }
  };

  // Update the browser's URL
  const updateURL = (url) => {
    const variantId = document.querySelector('.product-image')?.dataset.variantId;
    const queryString = variantId ? `?variant=${variantId}` : '';
    window.history.replaceState({}, '', `${url}${queryString}`);
  };

  // Handle update product information on options change
  const handleUpdateProductInfo = (productUrl) => (html) => {
    updateMedia(html);
    updateURL(productUrl);
  };

  // Retrieve selected option values
  const getSelectedOptionValues = () => {
    const selectedOptions = document.querySelectorAll('select[name^="options"] option[selected]');
    return Array.from(selectedOptions).map((option) => option.dataset.optionValueId);
  };

  // Function to handle changes in option values
  const handleOptionValueChange = (productUrl) => (selectedOptionValues) => {
    const requestUrl = buildRequestUrlWithParams(productUrl, selectedOptionValues);
    renderProductInfo(requestUrl, handleUpdateProductInfo(productUrl));
  };

  // Attach event listeners to variant selects
  variantSelects.forEach((select) => {
    select.addEventListener('change', ({ target }) => {
      // Manually assign selected option based on user pick
      Array.from(target.options).forEach((option) => option.removeAttribute('selected'));
      target.selectedOptions[0].setAttribute('selected', 'selected');

      // Trigger product info update with the current selected values
      const productUrl = productSelector.dataset.url;
      handleOptionValueChange(productUrl)(getSelectedOptionValues());
    });
  });
});
