import axios from 'axios';
import Notiflix from 'notiflix';
import { spiner } from '.';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '?key=30843123-cf65eced721c119970e40006a';
const params = '&image_type=photo&orientation=horizontal&safesearch=true';

const page = {
  number: 1,
  per_page: 40,
};
async function fetchImages(img) {
  try {
    const fetch = await axios.get(
      `${BASE_URL}${KEY}&q=${img}${params}&page=${page.number}&per_page=${page.per_page}`
    );
    const data = await fetch.data;
    page.number += 1;
    return data;
  } catch (error) {
    if (error.response.status === 400) {
      spiner.classList.add('is-hidden');
      Notiflix.Report.init({ svgSize: '50px', titleFontSize: '22px' });
      Notiflix.Report.info(
        '',
        `We're sorry, but you've reached the end of search results.`
      );
    }
  }
}

export { fetchImages, page };
