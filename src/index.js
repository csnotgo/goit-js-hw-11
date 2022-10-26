import lodash from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchImages, page } from './fetchImages';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
export const spiner = document.querySelector('.load-more');
let fieldValue = '';

searchForm.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', lodash(Onscroll, 300));

async function onFormSubmit(e) {
  e.preventDefault();
  fieldValue = searchForm.searchQuery.value.trim();
  page.number = 1;
  if (fieldValue !== '') {
    try {
      const result = await fetchImages(fieldValue);
      if (result.hits.length === 0) {
        spiner.classList.add('is-hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (result.hits.length > 1) {
        Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
        createGalleryMarkup(result.hits);
      }
      if (result.totalHits) {
        window.scrollTo(top);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    Notiflix.Notify.failure('Please, enter something in the search field.');
  }

  searchForm.reset();
  gallery.innerHTML = '';
}

async function createGalleryMarkup(image) {
  const markup = await image
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="340" height="240"/>
  <div class="info">
    <p class="info-item">
      <b>👍</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>👁‍🗨</b>
      ${views}
    </p>
    <p class="info-item">
      <b>💬</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>🚀</b>
      ${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

async function addPage() {
  if (fieldValue !== '') {
    try {
      const result = await fetchImages(fieldValue);
      createGalleryMarkup(result.hits);
      console.log(gallery.children.length);
      if (result.totalHits) {
        spiner.classList.add('is-hidden');
        // Notiflix.Notify.info(
        //   `We're sorry, but you've reached the end of search results.`
        // );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

async function Onscroll() {
  const scroll = document.documentElement.getBoundingClientRect();
  if (scroll.bottom <= document.documentElement.clientHeight + 150) {
    spiner.classList.remove('is-hidden');
    await addPage();
  }
}
